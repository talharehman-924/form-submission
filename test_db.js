const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ override: true });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

console.log('SUPABASE_URL:', SUPABASE_URL);
console.log('SUPABASE_SERVICE_KEY length:', SUPABASE_SERVICE_KEY ? SUPABASE_SERVICE_KEY.length : 0);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkShops() {
  console.log('Checking users table...');
  const { data, count, error } = await supabase
    .from('users')
    .select('*', { count: 'exact' });
    
  if (error) {
    console.error('Error fetching users:', error.message);
  } else {
    console.log(`Found ${count} users in database.`);
    if (data && data.length > 0) {
      console.log('First 5 shops in DB:');
      data.slice(0, 5).forEach(s => console.log(`- ${s.name}`));
    }
  }
}

checkShops();
