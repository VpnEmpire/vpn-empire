// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wkdhylmqfzigaxxhnqho.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZGh5bG1xZnppZ2F4eGhucWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2ODI2NjYsImV4cCI6MjA2NzI1ODY2Nn0.9gaWyWvsvftewF3WJx03p0kZhZ6-5ReNDe2CsXoor6E';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
