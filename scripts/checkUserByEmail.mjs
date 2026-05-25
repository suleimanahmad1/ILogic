import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

function loadDotEnv(path = '.env'){
  try{
    const raw = fs.readFileSync(path, 'utf8')
    raw.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim()
      if(!trimmed || trimmed.startsWith('#')) return
      const idx = trimmed.indexOf('=')
      if(idx === -1) return
      const key = trimmed.slice(0, idx).trim()
      let val = trimmed.slice(idx+1).trim()
      if(val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
      if(val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1)
      process.env[key] = val
    })
  } catch(e){ /* ignore */ }
}

loadDotEnv()

const [,, email] = process.argv
if (!email) {
  console.error('Usage: node scripts/checkUserByEmail.mjs email@example.com')
  process.exit(1)
}

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)


async function run(){
  try {
    if (supabase.auth && supabase.auth.admin && typeof supabase.auth.admin.getUserByEmail === 'function'){
      const { data: user, error } = await supabase.auth.admin.getUserByEmail(email)
      if (error) throw error
      if (!user) return console.log('User not found')
      const safe = {
        id: user.id,
        email: user.email,
        phone: user.phone,
        confirmed_at: user.confirmed_at,
        last_sign_in_at: user.last_sign_in_at,
        disabled: user.disabled,
        created_at: user.created_at
      }
      return console.log(JSON.stringify(safe, null, 2))
    }
  } catch(e) {
    // fallthrough to REST
  }

  // Fallback: call Supabase Admin REST API
  const url = `${process.env.VITE_SUPABASE_URL.replace(/\/$/, '')}/admin/v1/users?email=${encodeURIComponent(email)}`
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'apiKey': process.env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
    }
  })
  if (!res.ok) {
    const txt = await res.text()
    console.error('Admin API error:', res.status, txt)
    process.exit(1)
  }
  const data = await res.json()
  if (!data || data.length === 0) return console.log('User not found')
  const user = data[0]
  const safe = {
    id: user.id,
    email: user.email,
    phone: user.phone,
    confirmed_at: user.confirmed_at,
    last_sign_in_at: user.last_sign_in_at,
    disabled: user.disabled,
    created_at: user.created_at
  }
  console.log(JSON.stringify(safe, null, 2))
}

run().catch(e => { console.error(e); process.exit(1) })
