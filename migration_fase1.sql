-- ============================================================
-- MONETRA - FASE 1: DATABASE SCHEMA MIGRATION
-- Jalankan seluruh file ini di Supabase Dashboard > SQL Editor
-- ============================================================

-- ============================================================
-- 1. TABEL WALLETS (Multi Dompet)
-- ============================================================
CREATE TABLE IF NOT EXISTS wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'cash' CHECK (type IN ('cash', 'bank', 'e-wallet', 'investment')),
  balance NUMERIC DEFAULT 0,
  color TEXT DEFAULT '#7C3AED',
  icon TEXT DEFAULT 'wallet',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_wallets_select" ON wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_wallets_insert" ON wallets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_wallets_update" ON wallets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users_wallets_delete" ON wallets FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 2. TABEL BUDGETS (Budget Bulanan)
-- ============================================================
CREATE TABLE IF NOT EXISTS budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INT NOT NULL CHECK (year >= 2020),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, category, month, year)
);

ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_budgets_select" ON budgets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_budgets_insert" ON budgets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_budgets_update" ON budgets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users_budgets_delete" ON budgets FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 3. TABEL SAVINGS_GOALS (Target Tabungan)
-- ============================================================
CREATE TABLE IF NOT EXISTS savings_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  target_amount NUMERIC NOT NULL CHECK (target_amount > 0),
  current_amount NUMERIC DEFAULT 0 CHECK (current_amount >= 0),
  deadline DATE,
  icon TEXT DEFAULT '🎯',
  color TEXT DEFAULT '#7C3AED',
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_goals_select" ON savings_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_goals_insert" ON savings_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_goals_update" ON savings_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users_goals_delete" ON savings_goals FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 4. TABEL ACTIVITY_LOGS (Riwayat Aktivitas)
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_logs_select" ON activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_logs_insert" ON activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Admin bisa lihat semua log
CREATE POLICY "admin_logs_select" ON activity_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  ));

-- ============================================================
-- 5. TABEL NOTIFICATIONS (Sistem Notifikasi)
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'danger')),
  is_read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_notif_select" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_notif_insert" ON notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_notif_update" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users_notif_delete" ON notifications FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 6. UPDATE TABEL TRANSACTIONS (tambah kolom baru)
-- ============================================================
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS catatan TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS wallet_id UUID REFERENCES wallets(id) ON DELETE SET NULL;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS is_transfer BOOLEAN DEFAULT false;

-- ============================================================
-- 7. PROFILE TAMBAHAN (simpan preferensi user)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  currency TEXT DEFAULT 'IDR',
  dark_mode BOOLEAN DEFAULT false,
  monthly_income NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_profile_select" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_profile_insert" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users_profile_update" ON user_profiles FOR UPDATE USING (auth.uid() = id);
-- Admin bisa lihat semua profil
CREATE POLICY "admin_profile_select" ON user_profiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  ));

-- ============================================================
-- 8. FUNCTION: Auto-create profile saat user baru register
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: jalankan function setiap kali user baru dibuat
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 9. VERIFIKASI — cek semua tabel sudah terbuat
-- ============================================================
SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('wallets', 'budgets', 'savings_goals', 'activity_logs', 'notifications', 'user_profiles', 'transactions')
ORDER BY table_name;
