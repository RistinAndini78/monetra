import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testInsert() {
  const { data, error } = await supabase.from('transactions').insert([
    {
      description: 'test',
      amount: 1000,
      user_id: '123e4567-e89b-12d3-a456-426614174000'
    }
  ]);
  console.log("Error:", error);
}

testInsert();
