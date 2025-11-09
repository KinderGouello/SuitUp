import { testSupabaseConnection } from '../lib/supabase/test';

async function main() {
  console.log('Testing Supabase connection...\n');

  const result = await testSupabaseConnection();

  if (result.success) {
    console.log('✅ Success:', result.message);
  } else {
    console.log('❌ Error:', result.message);
    if (result.error) {
      console.log('Details:', result.error.message);
    }
  }
}

main();
