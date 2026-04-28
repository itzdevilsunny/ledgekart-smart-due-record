import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jxqqexzghiiyreksnhza.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cXFleHpnaGlpeXJla3NuaHphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczODYyMzMsImV4cCI6MjA5Mjk2MjIzM30.uBrcfk-yPyZj_qCvcK9jwE4pZWDFoytxcLqOZQuFRo8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setup() {
  console.log('Creating admin user...');
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: 'admin@ledgerkart.com',
    password: 'Password123!',
    options: {
      data: {
        full_name: 'System Admin',
        phone: '1234567890',
        role: 'admin'
      }
    }
  });

  if (authError) {
    console.error('Auth Error:', authError.message);
    return;
  }

  const userId = authData.user?.id;
  if (!userId) {
    console.error('No user ID returned');
    return;
  }

  console.log('User created:', userId);

  // Create Shop
  console.log('Creating shop...');
  const { error: shopError } = await supabase.from('shops').insert({
    owner_id: userId,
    name: 'My Demo Shop',
    address: '123 Market St',
    phone: '9876543210'
  });

  if (shopError) {
    console.error('Shop Error:', shopError.message);
  } else {
    console.log('Shop created successfully!');
  }
}

setup();
