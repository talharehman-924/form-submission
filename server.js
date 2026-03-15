const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const mime = require('mime-types');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

const PUBLIC_DIR = path.join(__dirname, 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');

// keep a local uploads folder as a cache / fallback
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Multer setup (memory storage) - we'll upload directly to Supabase Storage
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Supabase client (server-side key required)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.warn('Warning: SUPABASE_URL or SUPABASE_SERVICE_KEY not set. Please set env vars.');
}
const supabase = createClient(SUPABASE_URL || '', SUPABASE_SERVICE_KEY || '');

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
      console.error('Supabase insert error:', error);
      return res.status(500).send('DB insert error');
    }
    return res.redirect('/');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
