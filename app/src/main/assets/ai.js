// Satu Restoe V3 — AI Marketing Assistant (local, no auto-send)
(function(){
  function q(id){return document.getElementById(id)}
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
  function getData(){
    if(Array.isArray(window.data)) return window.data;
    try{
      const raw=localStorage.getItem('satu_restoe_marketing_v2');
      const parsed=raw?JSON.parse(raw):null;
      return Array.isArray(parsed)?parsed:[];
    }catch(e){return []}
  }
  function inject(){
    if(q('aiCard')) return;
    const card=document.createElement('section'); card.className='card'; card.id='aiCard';
    card.innerHTML='<h3>🤖 AI Marketing Assistant V3</h3><div id="aiSummary" class="notice">AI siap menganalisis 166 calon customer tanpa perlu mengisi nomor WhatsApp terlebih dahulu.</div><div class="row"><button class="blue" onclick="aiAnalyze()">🤖 Analisis Customer</button><button class="gray" onclick="aiFollowups()">📅 Prioritas Follow-up</button></div><div id="aiResult" class="history"><span class="muted">Tekan Analisis Customer untuk melihat rekomendasi.</span></div>';
    const main=document.querySelector('main.wrap'); if(main) main.insertBefore(card,main.firstElementChild.nextElementSibling);
  }
  window.aiAnalyze=function(){
    const data=getData();
    if(!data.length){q('aiSummary').textContent='Data customer belum tersedia.';return}
    const total=data.length, fresh=data.filter(x=>x.status==='Belum dihubungi'), fu=data.filter(x=>x.status==='Follow Up'), resp=data.filter(x=>x.status==='Respon'), deals=data.filter(x=>x.status==='Deal'), high=fresh.filter(x=>x.prio==='A');
    q('aiSummary').innerHTML='<b>🤖 Rekomendasi AI:</b> '+high.length+' customer prioritas A belum dihubungi. Fokuskan pendekatan pada mereka terlebih dahulu.';
    q('aiResult').innerHTML='<b>Ringkasan:</b><br>Total '+total+' • Belum dihubungi '+fresh.length+' • Follow Up '+fu.length+' • Respon '+resp.length+' • Deal '+deals.length+'<br><br><b>Prioritas berikutnya:</b><br>'+high.slice(0,10).map((x,i)=>(i+1)+'. '+esc(x.name)+' — '+esc(x.city||'-')).join('<br>')+(high.length>10?'<br>... dan '+(high.length-10)+' lainnya':'');
  };
  window.aiFollowups=function(){
    const data=getData();
    const list=data.filter(x=>x.status==='Follow Up').sort((a,b)=>String(a.nextFollow||'').localeCompare(String(b.nextFollow||'')));
    q('aiSummary').innerHTML='<b>📅 Prioritas Follow-up:</b> '+list.length+' customer sedang berstatus Follow Up.';
    q('aiResult').innerHTML=list.length?list.slice(0,12).map((x,i)=>(i+1)+'. <b>'+esc(x.name)+'</b> — '+esc(x.city||'-')+' — jadwal: '+esc(x.nextFollow||'belum diatur')).join('<br>'):'Belum ada customer yang dijadwalkan Follow Up.';
  };
  window.addEventListener('load',inject);
})();
