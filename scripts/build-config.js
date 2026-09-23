const fs = require('fs');
const path = require('path');

const url = process.env.SUPABASE_URL || '';
const key = process.env.SUPABASE_PUBLISHABLE_KEY || '';
if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY');
  process.exit(1);
}

const out = path.join(process.cwd(), 'web', 'config.js');
const content = 'window.__SUPABASE_CONFIG__=' + JSON.stringify({ url, publishableKey: key }) + ';\n';
fs.writeFileSync(out, content, 'utf8');
console.log('Generated web/config.js');
