# Web app

This React app provides Register, Login, Dashboard/Profile (protected) and Logout functionality.

Run locally:
```powershell
cd web
npm install
npm start
```

Notes:
- App assumes backend runs at `http://localhost:8080` with endpoints `/api/auth/register`, `/api/auth/login`, `/api/user/me`.
- If you change the backend port or host, update the fetch URLs in `web/src/components/*`.

