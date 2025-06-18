import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yhteoqeljaeoouxrjjda.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlodGVvcWVsamFlb291eHJqamRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNzE0MjIsImV4cCI6MjA2NTc0NzQyMn0.zHD2IelKm9HSeohOrLdrbNvy3-pw6eFKrBSOFA3hQno'

export const supabase = createClient(supabaseUrl, supabaseKey)