const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ override: true });

async function debug() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  console.log('Testing connection to:', process.env.SUPABASE_URL);
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    if (error) console.error('Supabase Error:', error);
    else console.log('Successfully connected. Total rows:', data);
  } catch (err) {
    console.error('Fetch Error:', err);
  }
}
debug();
