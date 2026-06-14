const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://sjnevbbptqnxqitqgzmb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqbmV2YmJwdHFueHFpdHFnem1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExODU5ODQsImV4cCI6MjA5Njc2MTk4NH0.GHM4rHeUezDmAd05W9Q4F6YGZhh_KdChzvEqdEJVd_k'
const supabase = createClient(supabaseUrl, supabaseKey)

async function check() {
  const { data, error } = await supabase.from('users').select('*')
  console.log('Users table:', JSON.stringify(data, null, 2))
  console.log('Error:', error)
}

check()
