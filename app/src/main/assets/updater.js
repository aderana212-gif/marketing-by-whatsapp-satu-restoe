// Satu Restoe — remote database updater
// Pulls verified additions from GitHub and merges only new phone numbers.
(function(){
  const REMOTE='https://raw.githubusercontent.com/aderana212-gif/marketing-by-whatsapp-satu-restoe/main/app/src/main/assets/remote_updates.json';
  const KEY='satu_restoe_marketing_v4';
  const norm=p=>String(p||'').replace(/\D/g,'').replace(/^0/,'62');
  function button(){
    if(document.getElementById('updateDbBtn')) return;
    const b=document.createElement('button');
    b.id='updateDbBtn'; b.className='blue'; b.textContent='🔄 Update Database';
    b.style.cssText='width:100%;margin:8px 0;padding:12px;font-size:15px';
    b.onclick=update;
    const target=document.querySelector('#dbTitle')?.parentElement;
    if(target) target.insertBefore(b,target.children[2]||null);
  }
  async function update(){
    const b=document.getElementById('updateDbBtn');
    if(b){b.disabled=true;b.textContent='⏳ Mengambil data terbaru...';}
    try{
      const r=await fetch(REMOTE+'?t='+Date.now(),{cache:'no-store'});
      if(!r.ok) throw new Error('HTTP '+r.status);
      const remote=await r.json();
      const local=JSON.parse(localStorage.getItem(KEY)||'[]');
      if(!Array.isArray(local)) throw new Error('Database lokal tidak valid');
      const seen=new Set(local.map(x=>norm(x.phone)).filter(Boolean));
      let added=0;
      Object.keys(remote||{}).forEach(cat=>{
        (remote[cat]||[]).forEach(x=>{
          const phone=norm(x[2]);
          if(!phone||seen.has(phone)) return;
          seen.add(phone);
          const city=x[1]||'';
          const jateng=/Tegal|Wonosobo|Banyumas|Purwokerto|Cilacap|Kebumen|Magelang|Pekalongan|Pemalang/.test(city);
          local.push({prio:x[3]||'B',prov:jateng?'Jawa Tengah':'Jawa Barat',city:city,name:x[0],phone:x[2],category:cat,status:'Belum dihubungi',notes:'',marketing:'',lastContact:'',nextFollow:'',history:[]});
          added++;
        });
      });
      localStorage.setItem(KEY,JSON.stringify(local));
      if(typeof data!=='undefined') data=local;
      if(typeof renderCats==='function') renderCats();
      if(typeof render==='function') render();
      if(typeof newCustomer==='function') newCustomer();
      alert(added>0?'Update berhasil. '+added+' data baru ditambahkan.':'Database sudah paling terbaru. Tidak ada data baru.');
    }catch(e){ alert('Update gagal: '+e.message); }
    finally{ if(b){b.disabled=false;b.textContent='🔄 Update Database';} }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',button); else button();
})();
