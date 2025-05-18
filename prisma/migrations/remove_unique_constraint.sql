-- Drop unique constraint from timetables table
ALTER TABLE "timetables" DROP CONSTRAINT IF EXISTS unique_teacher_timetable;