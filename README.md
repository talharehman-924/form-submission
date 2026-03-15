Form Submission (Node.js/Express)

This project has two versions — a Python/Flask version and a Node.js/Express version.
You can run the Node.js version as follows.

Prerequisites
- Install Node.js (v14+ recommended). Download from https://nodejs.org/

Install and run

```powershell
npm install
npm run dev    # uses nodemon if installed
# or
npm start
```

Open http://localhost:3000/ in your browser.

Notes
- Uploaded images are saved to `public/uploads`.
- Data is stored in `data.db` (SQLite) in the project root.
- If you don't want dev-dependency `nodemon`, run `npm start`.

Files
- `server.js` — Express server
- `views/index.ejs` — EJS template with Bootstrap form and cards
- `public/uploads/` — uploaded images

If you want I can remove the Flask files or help you run the Node app here. Which would you like?
