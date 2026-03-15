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
- Uploaded images are saved to Supabase Storage (bucket: `uploads`). A local copy is also written to `public/uploads` for quick preview during development.
- Data is stored in Supabase `users` table (not SQLite).
- If you don't want dev-dependency `nodemon`, run `npm start`.

Supabase setup (quick):
1. Create a free project at https://app.supabase.com/ and note the `SUPABASE_URL`.
	- Example project URL (already set in this repo as default): `https://hxmxxufruldtocuhuzlj.supabase.co`
2. Go to Settings → API and copy the `Service Role` key. Keep it secret and set it as `SUPABASE_SERVICE_KEY` in your environment.
3. In the Storage section create a new bucket named `uploads` and set it to public (or configure access rules).
4. Create the `users` table via SQL Editor with this SQL:

```sql
create table if not exists users (
	id bigserial primary key,
	name text not null,
	mobile text,
	address text,
	photo text,
	inserted_at timestamptz default now()
);
```

Environment variables (locally):

Windows PowerShell example:
```powershell
setx SUPABASE_URL "https://hxmxxufruldtocuhuzlj.supabase.co"
setx SUPABASE_SERVICE_KEY "your_service_role_key_here"
```

Or create a `.env` based on `.env.example` in the project root for local development.

Or create a `.env` locally and use a process manager to load envs. For Vercel set these in the Project → Settings → Environment Variables.

Files
- `server.js` — Express server (uploads to Supabase Storage and inserts into Supabase table)
- `views/index.ejs` — EJS template with Bootstrap form and cards
- `public/uploads/` — local preview copies (development only)

Deploy notes
- For production hosting with persistent uploads and DB on Supabase, Vercel + Supabase is fine. Ensure `SUPABASE_SERVICE_KEY` is configured in Vercel environment variables.

If you want, I can convert the Express server into Vercel serverless functions, add CI deploy scripts, and help deploy — tell me if you'd like that next.
