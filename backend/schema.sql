-- ============================================================================
-- SAHIL & TASLEEMA ENGAGEMENT INVITATION — DATABASE SCHEMA (SUPABASE / POSTGRES)
-- ============================================================================
-- Run this script in your Supabase SQL Editor (https://app.supabase.com)
-- It creates the tables, indexes, and Row Level Security (RLS) policies.

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 2. RSVPS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    attendance TEXT NOT NULL,
    guests INTEGER DEFAULT 1,
    dietary TEXT DEFAULT 'Traditional Kashmiri Wazwan',
    phone TEXT,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for searching guest names and dates
CREATE INDEX IF NOT EXISTS idx_rsvps_name ON public.rsvps (name);
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON public.rsvps (created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can submit an RSVP
CREATE POLICY "Allow public inserts to rsvps"
    ON public.rsvps
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- RLS Policy: Only authenticated admin can view all RSVPs
CREATE POLICY "Allow admin to read rsvps"
    ON public.rsvps
    FOR SELECT
    TO authenticated
    USING (true);

-- ----------------------------------------------------------------------------
-- 3. GUEST WISHES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wishes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    relation TEXT DEFAULT 'Guest & Well-wisher',
    message TEXT NOT NULL,
    likes INTEGER DEFAULT 1,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for wishes timeline
CREATE INDEX IF NOT EXISTS idx_wishes_created_at ON public.wishes (created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public can view approved wishes
CREATE POLICY "Allow public to read approved wishes"
    ON public.wishes
    FOR SELECT
    TO anon, authenticated
    USING (is_approved = true);

-- RLS Policy: Anyone can submit a wish
CREATE POLICY "Allow public to insert wishes"
    ON public.wishes
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- RLS Policy: Public can like a wish (update likes count)
CREATE POLICY "Allow public to update wish likes"
    ON public.wishes
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 4. INITIAL SAMPLE WISHES (Blessings from Elders)
-- ----------------------------------------------------------------------------
INSERT INTO public.wishes (name, relation, message, likes, is_approved)
VALUES 
    ('Uncle Farooq & Family', 'Family Elder', 'May Allah SWT shower His infinite blessings upon Sahil and Tasleema. Seeing our family united in joy fills our hearts with immense gratitude. Mubarak to both families!', 12, true),
    ('Aaqib & Saima', 'Cousin from Srinagar', 'Heartiest congratulations brother Sahil! Counting down the days for the grand Kashmiri Wazwan and celebrations in October. You two make an incredible pair!', 8, true),
    ('Dr. Ghulam Hassan Malla', 'Family Friend', 'Hearty Mubarak! May this beautiful engagement blossom into a lifetime of peace, prosperity, and companionship. Barakallahu lakuma.', 15, true)
ON CONFLICT DO NOTHING;
