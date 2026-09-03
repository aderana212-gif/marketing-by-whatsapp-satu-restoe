// Satu Restoe — remote database updater
(function(){
  const REMOTE='https://raw.githubusercontent.com/aderana212-gif/marketing-by-whatsapp-satu-restoe/main/app/src/main/assets/category_data.js';
  const KEY='satu_restoe_marketing_v4';
  const LEGACY_KEYS=['satu_restoe_marketing_v3','satu_restoe_marketing_v2'];
  const norm=p=>String(p||'').replace(/\D/g,'').replace(/^0/,'62');
  function button(){
    if(document.getElementById('updateDbBtn')) return;
    const b=document.createElement('button'); b.id='updateDbBtn'; b.className='blue'; b.textContent='🔄 Update Database';
    b.style.cssText='width:100%;margin:8px 0;padding:12px;font-size:15px'; b.onclick=update;
    const target=document.querySelector('#dbTitle')?.parentElement; if(target) target.insertBefore(b,target.children[2]||null);
  }
  function mergeInto(base,incoming){const seen=new Set(base.map(x=>norm(x.phone)).filter(Boolean));let added=0;(incoming||[]).forEach(x=>{const phone=norm(x.phone);if(!phone||seen.has(phone))return;seen.add(phone);base.push(x);added++});return added;}
  async function update(){
    const b=document.getElementById('updateDbBtn'); if(b){b.disabled=true;b.textContent='⏳ Memulihkan & mengambil data...';}
    try{
      let local=[]; try{const cur=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(cur))local=cur}catch(e){}
      let restored=0;
      for(const k of LEGACY_KEYS){try{const old=JSON.parse(localStorage.getItem(k)||'[]');if(Array.isArray(old))restored+=mergeInto(local,old)}catch(e){}}
      if(typeof seed==='function') restored+=mergeInto(local,seed());
      const r=await fetch(REMOTE+'?t='+Date.now(),{cache:'no-store'}); if(!r.ok)throw new Error('HTTP '+r.status);
      const text=await r.text(); const m=text.match(/const\s+CATEGORY_DATA\s*=\s*([\s\S]*);\s*$/); if(!m)throw new Error('Format database tidak dikenali');
      const remote=Function('return ('+m[1]+')')(); const rows=[];
      Object.keys(remote||{}).forEach(cat=>(remote[cat]||[]).forEach(x=>{const city=x[1]||'';const jateng=/Tegal|Wonosobo|Banyumas|Purwokerto|Cilacap|Kebumen|Magelang|Pekalongan|Pemalang/.test(city);rows.push({prio:x[3]||'B',prov:jateng?'Jawa Tengah':'Jawa Barat',city:city,name:x[0],phone:x[2],category:cat,status:'Belum dihubungi',notes:'',marketing:'',lastContact:'',nextFollow:'',history:[]})}));
      const added=mergeInto(local,rows); localStorage.setItem(KEY,JSON.stringify(local)); if(typeof data!=='undefined')data=local;
      if(typeof renderCats==='function')renderCats(); if(typeof render==='function')render(); if(typeof newCustomer==='function')newCustomer();
      alert('Database berhasil dipulihkan. '+(restored+added)+' data ditambahkan/ditarik. Total sekarang '+local.length+' customer.');
    }catch(e){alert('Update gagal: '+e.message)}finally{if(b){b.disabled=false;b.textContent='🔄 Update Database'}}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',button);else button();
})();
