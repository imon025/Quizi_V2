-- Run this script in the Supabase SQL Editor to ensure all users have a profile.
-- This is necessary if you created your account before the profile trigger was set up.

INSERT INTO public.profiles (id, full_name, email)
SELECT id, raw_user_meta_data->>'full_name', email
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);
