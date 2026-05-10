-- Jalankan SQL ini di Supabase Dashboard > SQL Editor
-- Untuk menambah kolom catatan di tabel transactions

ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS catatan TEXT;

-- Verifikasi hasilnya:
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'transactions' 
ORDER BY ordinal_position;
