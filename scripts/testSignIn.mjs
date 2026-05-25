import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const [,, email, password] = process.argv
if (!email || !password) {
  console.error('Usage: node scripts/testSignIn.mjs email password')
  process.exit(1)
}

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY)

async function run(){
  const res = await supabase.auth.signInWithPassword({ email, password })
  console.log(JSON.stringify(res, null, 2))
}

run().catch(e => { console.error(e); process.exit(1) })
