# Full Guide: Hosting your MERN (MySQL) App for FREE

This guide will show you how to host your React, Node.js, and MySQL application for $0.

## 1. Database (MySQL) - Use Aiven.io
Since services like Heroku and PlanetScale no longer offer free tiers, **Aiven** is the best option for a free managed MySQL database.

1.  Go to [Aiven.io](https://aiven.io/) and create a free account.
2.  Create a new **MySQL** project.
3.  Select the **Free Plan**.
4.  Once the service is running, copy the **Connection Details**:
    - Host
    - Port
    - User (usually `avnadmin`)
    - Password
    - Database Name (default is `defaultdb`)
5.  **Initialize the Schema**: Use the details to connect via a tool like MySQL Workbench or VS Code extension, and run the SQL in `server/schema.sql`.

## 2. Backend (Express) - Use Render.com
Render is excellent for hosting Node.js applications for free.

1.  Push your code to a **GitHub repository**.
2.  Login to [Render.com](https://render.com/).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repo.
5.  Configure the service:
    - **Language**: Node
    - **Build Command**: `cd server && npm install`
    - **Start Command**: `cd server && node index.js`
6.  Go to **Environment Variables** and add:
    - `DB_HOST`: (From Aiven)
    - `DB_USER`: (From Aiven)
    - `DB_PASSWORD`: (From Aiven)
    - `DB_NAME`: (From Aiven, likely `defaultdb`)
    - `JWT_SECRET`: (Any random long string)
    - `PORT`: `5000` (Optional, Render assigns its own too)
7.  **Note**: Free services on Render "spin down" after inactivity. The first request may take 30-60 seconds to wake up.

## 3. Frontend (React) - Use Vercel
Vercel is the gold standard for hosting Vite/React applications.

1.  Login to [Vercel.com](https://vercel.com/).
2.  Click **Add New** -> **Project**.
3.  Import your GitHub repository.
4.  Configure the project:
    - **Root Directory**: `client`
    - **Framework Preset**: `Vite`
5.  **Update API URL**: 
    - Before deploying, go to `client/src/App.jsx`.
    - Change `API_URL = 'http://localhost:5000/api'` to your **Render app URL** (e.g., `https://my-todo-api.onrender.com/api`).
    - *Tip*: You can use an environment variable `VITE_API_URL` for this.
6.  Click **Deploy**.

## 4. Connecting it all together
- Ensure **CORS** in `server/index.js` allows your Vercel URL.
  ```javascript
  app.use(cors({ origin: 'https://your-frontend.vercel.app' }));
  ```
- Your app is now live!

---
**Summary of URLs**:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-api.onrender.com`
- Database: Provided by Aiven.
