const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const mysql = require('mysql2/promise')

const app = express()
app.use(cors())
app.use(express.json())

// MySQL connection (defaults for XAMPP)
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'user_auth_db'
}

let pool

async function initDb() {
  pool = await mysql.createPool({ ...DB_CONFIG, waitForConnections: true, connectionLimit: 5 })
  // ensure tables
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tokens (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      token VARCHAR(255) NOT NULL UNIQUE,
      user_id BIGINT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)
}

initDb().catch(err=>{ console.error('DB init error', err); process.exit(1) })

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body || {}
  if (!username || !email || !password) return res.status(400).send('missing fields')
  try{
    const [exists] = await pool.query('SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1', [email, username])
    if (exists.length) return res.status(400).send('Email or username already in use')
    const passwordHash = await bcrypt.hash(password, 10)
    const [r] = await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, passwordHash])
    res.status(201).send('registered')
  }catch(err){ console.error(err); res.status(500).send('server error') }
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).send('missing fields')
  try{
    const [rows] = await pool.query('SELECT id, password FROM users WHERE email = ? LIMIT 1', [email])
    if (!rows.length) return res.status(401).send('invalid credentials')
    const u = rows[0]
    const match = await bcrypt.compare(password, u.password)
    if (!match) return res.status(401).send('invalid credentials')
    const token = uuidv4()
    await pool.query('INSERT INTO tokens (token, user_id) VALUES (?, ?)', [token, u.id])
    res.json({ token, userId: u.id })
  }catch(err){ console.error(err); res.status(500).send('server error') }
})

app.get('/api/user/me', async (req, res) => {
  const auth = req.header('authorization') || ''
  if (!auth.startsWith('Bearer ')) return res.status(401).send('unauthorized')
  const token = auth.substring(7)
  try{
    const [rows] = await pool.query('SELECT u.id, u.username, u.email FROM tokens t JOIN users u ON t.user_id = u.id WHERE t.token = ? LIMIT 1', [token])
    if (!rows.length) return res.status(401).send('unauthorized')
    const u = rows[0]
    res.json({ id: u.id, username: u.username, email: u.email })
  }catch(err){ console.error(err); res.status(500).send('server error') }
})

const port = process.env.PORT || 8081
app.listen(port, ()=>console.log('Mock backend (MySQL) listening on', port))
