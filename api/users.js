const { createClient } = require('@supabase/supabase-js');
const Busboy = require('busboy');
const mime = require('mime-types');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(SUPABASE_URL || '', SUPABASE_SERVICE_KEY || '');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase.from('users').select('*').order('id', { ascending: false });
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data || []);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'server error' });
    }
  }

  if (req.method === 'POST') {
    // parse multipart form with Busboy
    const busboy = new Busboy({ headers: req.headers });
    const fields = {};
    let fileBuffer = null;
    let fileName = null;
    let fileMime = null;

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      const chunks = [];
      file.on('data', (data) => chunks.push(data));
      file.on('end', () => {
        fileBuffer = Buffer.concat(chunks);
        fileName = filename;
        fileMime = mimetype;
      });
    });

    busboy.on('field', (fieldname, val) => {
      fields[fieldname] = val;
    });

    busboy.on('finish', async () => {
      try {
        let publicUrl = null;
        if (fileBuffer && fileName) {
          const timestamp = Date.now();
          const safe = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
          const filename = `${timestamp}_${safe}`;
          const contentType = fileMime || mime.lookup(fileName) || 'application/octet-stream';

          const { data: uploadData, error: uploadError } = await supabase.storage.from('uploads').upload(filename, fileBuffer, {
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
        }

        const record = {
          name: (fields.name || '').trim(),
          mobile: (fields.mobile || '').trim(),
          address: (fields.address || '').trim(),
          photo: publicUrl,
        };

        const { data, error } = await supabase.from('users').insert([record]);
        if (error) {
          console.error('Supabase insert error:', error);
          return res.status(500).json({ error: 'insert error' });
        }
        return res.status(200).json({ success: true, user: data[0] });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'server error' });
      }
    });

    req.pipe(busboy);
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
};
