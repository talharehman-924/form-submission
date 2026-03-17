const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ override: true });

async function verify() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const { data, count, error } = await supabase.from('users').select('*', { count: 'exact' });
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Total rows:', count);
  const missingPics = data.filter(s => !s.photo || s.photo.includes('undefined') || s.photo.trim() === '');
  console.log('Shops with missing/empty photo field:', missingPics.length);
  if (missingPics.length > 0) {
    console.log('First few shops with missing pics:', missingPics.slice(0, 5).map(s => s.name));
  }
}
verify();
