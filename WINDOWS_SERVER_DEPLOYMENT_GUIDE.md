# Windows Server Deployment Guide for Next.js

To host your Next.js project (with both frontend and backend) on a Windows shared server, follow these steps:

## 1. Prerequisites

- Your server must support **Node.js** (v18+ recommended).
- You need access to upload files and run Node.js processes (via IIS, Plesk, or direct access).

## 2. Build Your Project

On your local machine, run:

```bash
npm install
npm run build
```

This creates the `.next` folder and prepares your app for production.

## 3. Upload Files to Server

Upload these folders/files to your server:

- `.next`
- `public`
- `node_modules` (or run `npm install` on the server)
- All source files (e.g., `app`, `components`, `lib`, etc.)
- `package.json`, `next.config.ts`, etc.

## 4. Set Up Node.js on Server

If using IIS:

- Install **iisnode** or use the Node.js hosting feature in Plesk.
- Point your site root to your project folder.
- Set the startup file to `server.js` or use the default Next.js start command.

## 5. Start the App

On the server, run:

```bash
npm install
npm start
```

This will start Next.js in server mode (supports API routes and backend logic).

## 6. Configure Static Files

- Ensure IIS (or your control panel) allows serving static files from `public` and `static`.
- Set correct MIME types for `.js`, `.css`, etc.

## 7. Update Environment Variables

- Set any required environment variables (e.g., database URLs, API keys) in the server's environment or `.env` file.

## 8. Test Your Site

- Visit your domain and check that both frontend and backend (API routes) work.

---

**Note:**

- If your shared server does not support running Node.js processes, you cannot host a full Next.js backend. In that case, you can only deploy a static export (no API routes or backend logic).
- For full backend support, a VPS or dedicated server is recommended.