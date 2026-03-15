const express = require('express');
const path = require('path');
const fs = require('fs');
// load .env in development and report if dotenv is missing
try {
  const result = require('dotenv').config();
  if (result.error) {
    console.warn('dotenv present but failed to parse .env:', result.error);
  } else {
    console.log('dotenv loaded from .env');
  }
} catch (e) {
  console.warn('dotenv not installed; .env file will not be loaded automatically.');
  console.warn('Run: npm install dotenv');
}
const multer = require('multer');
const mime = require('mime-types');
let createClient;
try {
  createClient = require('@supabase/supabase-js').createClient;
} catch (err) {
  console.error("\nMissing required package '@supabase/supabase-js'.\nPlease run 'npm install' in the project folder (or install the package manually):\n\n  npm install @supabase/supabase-js mime-types busboy\n\nAfter installation, restart the server.\n");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

const PUBLIC_DIR = path.join(__dirname, 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');

// keep a local uploads folder as a cache / fallback
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Multer setup (memory storage) - we'll upload directly to Supabase Storage
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Supabase client (server-side key required)
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://hxmxxufruldtocuhuzlj.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
// debug: show where we are and whether .env was found (does not print the secret)
console.log('cwd=', process.cwd());
console.log('__dirname=', __dirname);
console.log('.env exists at cwd?', fs.existsSync(path.join(process.cwd(), '.env')));
console.log('SUPABASE_SERVICE_KEY present?', !!SUPABASE_SERVICE_KEY);
if (!SUPABASE_SERVICE_KEY) {
  console.error('\nError: SUPABASE_SERVICE_KEY is required to run this server.\nPlease create a local .env file (see .env.example) or set the environment variable:\n\n  SUPABASE_SERVICE_KEY=your_service_role_key_here\n\nThen restart the server.\n');
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Express setup

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(PUBLIC_DIR));

// Helper: fetch users from Supabase
async function fetchUsers() {
  if (!supabase) return [];
  const { data, error } = await supabase.from('users').select('*').order('id', { ascending: false });
  if (error) {
    console.error('Supabase fetch error:', error);
    return [];
  }
  return data || [];
}

app.get('/', async (req, res) => {
  const users = await fetchUsers();
  res.render('index', { users });
});

app.post('/', upload.single('photo'), async (req, res) => {
  try {
    const name = (req.body.name || '').trim();
    const mobile = (req.body.mobile || '').trim();
    const address = (req.body.address || '').trim();

    let publicUrl = null;
    if (req.file && req.file.buffer) {
      const originalName = req.file.originalname || 'upload';
      const timestamp = Date.now();
      const safe = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${timestamp}_${safe}`;

      // upload to Supabase Storage (bucket: uploads)
      const contentType = req.file.mimetype || mime.lookup(originalName) || 'application/octet-stream';
      const { data: uploadData, error: uploadError } = await supabase.storage.from('uploads').upload(filename, req.file.buffer, {
        cacheControl: '3600',
        upsert: false,
        contentType,
      });
      if (uploadError) {
        console.error('Supabase storage upload error:', uploadError);
      } else {
        const { data: publicData } = supabase.storage.from('uploads').getPublicUrl(uploadData.path);
        publicUrl = publicData.publicUrl;
      }
      // also store a local copy for quick dev preview
      try { fs.writeFileSync(path.join(UPLOADS_DIR, filename), req.file.buffer); } catch (e) { /* ignore */ }
    }

    // insert metadata into Supabase table `users`
    const { data, error } = await supabase.from('users').insert([{ name, mobile, address, photo: publicUrl }]);
    if (error) {
      console.error('Supabase insert error:', JSON.stringify(error, null, 2));
      return res.status(500).send(`DB insert error: ${error.message}`);
    }
    return res.redirect('/');
  } catch (err) {
    console.error('Server catch error:', err);
    return res.status(500).send(`Server error: ${err.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
