# AI Career Coach Platform

Capstone project for the AI-Powered Full-Stack Web Development Internship.
**React + Tailwind CSS · Node.js + Express · MongoDB · Google Gemini API**

## Features
- Secure sign up and login (JWT, hashed passwords)
- **AI Resume Review**: strengths, improvements and rewrite suggestions
- **ATS Score Analysis**: score out of 100, matched and missing keywords against a job description
- **AI Interview Questions**: technical and behavioral questions with answer tips
- **Career Roadmap Generator**: phased plan with goals and free resources
- **Skill Gap Analysis**: skills you have versus skills to learn, with priority
- **Job Recommendation Dashboard**: matching roles with match percentage and next step
- Overview dashboard with saved history (MongoDB)
- Loading states, error handling and a responsive UI

## Architecture
```
React (Vercel) --> Express API (Render) --> MongoDB Atlas
                         |
                         +--> Gemini API (key stored only on the server)
```
- `client/` React app (Vite)
- `server/` Express API: `routes/auth.js`, `routes/coach.js` (all AI features), `routes/history.js`

## Run locally
1. Get a free Gemini key at https://aistudio.google.com and a free MongoDB Atlas connection string.
2. Backend:
```
cd server
npm install
cp .env.example .env      # fill in MONGO_URI, JWT_SECRET, GEMINI_API_KEY
npm run dev
```
3. Frontend (new terminal):
```
cd client
npm install
npm run dev
```
Open http://localhost:5173

## Deploy
**Backend on Render**
1. New → Web Service → connect this repo.
2. Root Directory `server`, Build Command `npm install`, Start Command `npm start`.
3. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `GEMINI_MODEL`.
4. In MongoDB Atlas → Network Access, allow `0.0.0.0/0` so Render can connect.

**Frontend on Vercel**
1. Add New → Project → import this repo.
2. Root Directory `client`, framework Vite.
3. Add environment variable `VITE_API_URL` = your Render URL (no trailing slash).

**Connect them:** on Render add `CLIENT_URL` = your Vercel URL (no trailing slash), then redeploy.

## Live links
- Frontend: _add Vercel link_
- Backend: _add Render link_
- Demo video: _add link_

## Security
- API keys live in environment variables, never in the browser or in GitHub
- Passwords hashed with bcrypt, routes protected with JWT
- Input length limits on every AI request
