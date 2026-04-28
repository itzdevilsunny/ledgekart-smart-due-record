import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jxqqexzghiiyreksnhza.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cXFleHpnaGlpeXJla3NuaHphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczODYyMzMsImV4cCI6MjA5Mjk2MjIzM30.uBrcfk-yPyZj_qCvcK9jwE4pZWDFoytxcLqOZQuFRo8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: profiles, error: pError } = await supabase.from('profiles').select('*');
  console.log('Profiles:', profiles);
  if (pError) console.error('P Error:', pError);

  const { data: shops, error: sError } = await supabase.from('shops').select('*');
  console.log('Shops:', shops);
  if (sError) console.error('S Error:', sError);
}

check();
