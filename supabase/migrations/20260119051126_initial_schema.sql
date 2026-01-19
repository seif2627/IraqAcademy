-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    role TEXT DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    teacher_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create access_codes table
CREATE TABLE IF NOT EXISTS public.access_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    course_id UUID REFERENCES public.courses ON DELETE CASCADE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired')),
    created_by UUID REFERENCES auth.users,
    activated_by UUID REFERENCES auth.users,
    activated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profiles." ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Courses are viewable by everyone." ON public.courses
    FOR SELECT USING (true);

CREATE POLICY "Access codes are viewable by admins." ON public.access_codes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Students can view their own activated codes." ON public.access_codes
    FOR SELECT USING (activated_by = auth.uid());
