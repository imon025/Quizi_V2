-- Run this script in the Supabase SQL Editor to fix the relationships and missing columns.

-- 1. Add missing columns (Safe to run multiple times)
ALTER TABLE courses ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE results ADD COLUMN IF NOT EXISTS graded_at TIMESTAMPTZ;

-- 2. Update Foreign Keys to point to 'profiles' instead of 'auth.users'
-- This fixes the "Could not find a relationship" 400 Errors.

-- Courses
ALTER TABLE courses DROP CONSTRAINT IF EXISTS courses_teacher_id_fkey;
ALTER TABLE courses ADD CONSTRAINT courses_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.profiles(id);

-- Enrollments
ALTER TABLE enrollments DROP CONSTRAINT IF EXISTS enrollments_student_id_fkey;
ALTER TABLE enrollments ADD CONSTRAINT enrollments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id);

-- Results
ALTER TABLE results DROP CONSTRAINT IF EXISTS results_student_id_fkey;
ALTER TABLE results ADD CONSTRAINT results_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id);

-- Leave Requests
ALTER TABLE leave_requests DROP CONSTRAINT IF EXISTS leave_requests_student_id_fkey;
ALTER TABLE leave_requests ADD CONSTRAINT leave_requests_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id);

-- Notifications
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
ALTER TABLE notifications ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);

-- 3. Ensure all existing users have a profile (Fixes course creation issues)
INSERT INTO public.profiles (id, full_name, email)
SELECT id, raw_user_meta_data->>'full_name', email
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);
