import { createClient } from '@supabase/supabase-js';

export const supabase = createClient("https://celnfoespsbbsuxxcdvx.supabase.co/rest/v1/article?select=*", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlbG5mb2VzcHNiYnN1eHhjZHZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTM2NjcsImV4cCI6MjA2MzIyOTY2N30.PmQacma367OhVmdxDO9ffVk1bzhYWxU0XNJhLjW2ttw");