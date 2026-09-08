// Satu Restoe — separate live customer DB and WhatsApp template refresh
(function(){
  const SUPABASE_URL='https://xgidnneeovsqfysleeua.supabase.co';
  const SUPABASE_KEY='sb_publishable_bcLO52pj7tmWEHBPxziSHw_ElYtHWM0';
  const TEMPLATE_KEY='satu_restoe_templates_v1';
  const headers={apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY};
  const clean=v=>String(v||'').replace(/\\r\\n/g,'\n').replace(/\\n/g,'\n').replace(/\\r/g,'\r');
  const personalize=(v,n)=>{let t=clean(v);const name=String(n||'').trim();return name?t.replaceAll('[NAMA]',name):t.replace(/Bapak\/Ibu\s+\.{3,}/,'Bapak/Ibu')};
  async function getTemplates(){const u=SUPABASE_URL+'/rest/v1/marketing_templates?select=category,template,active,updated_at&active=eq.true';const r=await fetch(u,{headers,cache:'no-store'});if(!r.ok)throw new Error('Supabase template HTTP '+r.status);return await r.json()}
  function refreshVisible(t){localStorage.setItem(TEMPLATE_KEY,JSON.stringify(t));const c=document.getElementById('category')?.value||'travel',m=document.getElementById('message'),n=document.getElementById('name')?.value||'';if(m&&t[c])m.value=personalize(t[c],n);if(typeof window.__applyRemoteTemplateNow==='function')window.__applyRemoteTemplateNow();}
  async function updateWA(){const b=document.getElementById('updateWaBtn');if(b){b.disabled=true;b.textContent='⏳ Mengambil template WA...'}try{const rows=await getTemplates();const t={};rows.forEach(x=>t[x.category]=x.template);refreshVisible(t);alert('Update Isi WA berhasil. Template terbaru sudah dimuat.')}catch(e){alert('Update Isi WA gagal: '+e.message)}finally{if(b){b.disabled=false;b.textContent='💬 Update Isi WA'}}}
  function installButtons(){const old=document.getElementById('updateDbBtn');if(!old)return;const parent=old.parentElement;if(!parent)return;old.textContent='🔄 Update Database Calon Customer';old.style.cssText='flex:1;min-width:180px;margin:3px;padding:12px;font-size:15px';const wrap=document.createElement('div');wrap.id='updateControls';wrap.className='row';parent.insertBefore(wrap,old);wrap.appendChild(old);const wa=document.createElement('button');wa.id='updateWaBtn';wa.className='blue';wa.textContent='💬 Update Isi WA';wa.style.cssText='flex:1;min-width:180px;margin:3px;padding:12px;font-size:15px';wa.onclick=updateWA;wrap.appendChild(wa)}
  function start(){setTimeout(installButtons,100)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();