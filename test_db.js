const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkShops() {
  console.log('Checking shops table...');
  const { data, error } = await supabase.from('shops').select('*');
  if (error) {
    console.error('Error fetching shops:', error.message);
  } else {
    console.log(`Found ${data.length} shops.`);
    console.log(JSON.stringify(data, null, 2));
  }

  console.log('Checking users table...');
  const { data: userData, error: userError } = await supabase.from('users').select('*');
  if (userError) {
    console.error('Error fetching users:', userError.message);
  } else {
    console.log(`Found ${userData.length} users.`);
    // console.log(JSON.stringify(userData, null, 2));
  }
}

checkShops();
