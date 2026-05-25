import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const [,, email] = process.argv
if (!email) {
  console.error('Usage: node scripts/addAdminByEmail.mjs email@example.com')
  process.exit(1)
}

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function run(){
  // get user by email using the Admin API
  const { data: user, error: getErr } = await supabase.auth.admin.getUserByEmail(email)
  if (getErr || !user) {
    console.error('Error fetching user or user not found', getErr)
    process.exit(1)
  }
  const userId = user.id
  const { error } = await supabase.from('user_roles').insert({ user_id: userId, role: 'admin' })
  if (error) {
    console.error('Error inserting user_roles:', error)
    process.exit(1)
  }
  console.log('Admin role assigned to user_id:', userId)
}

run().catch(e => { console.error(e); process.exit(1) })
