// Satu Restoe V3 — AI Marketing Assistant (local, no auto-send)
(function(){
  function q(id){return document.getElementById(id)}
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
  function inject(){
    if(q('aiCard')) return;
    const card=document.createElement('section'); card.className='card'; card.id='aiCard';
    card.innerHTML='<h3>🤖 AI Marketing Assistant</h3><div id="aiSummary" class="notice">AI lokal siap menganalisis database customer.</div><div class="row"><button class="blue" onclick="aiAnalyze()">🤖 Analisis Customer</button><button class="gray" onclick="aiFollowups()">📅 Prioritas Follow-up</button></div><div id="aiResult" class="history"><span class="muted">Belum ada analisis.</span></div>';
    const main=document.querySelector('main.wrap'); main.insertBefore(card,main.firstElementChild.nextElementSibling);
  }
  window.aiAnalyze=function(){
    if(!window.data){return}
    const total=data.length, fresh=data.filter(x=>x.status==='Belum dihubungi'), fu=data.filter(x=>x.status==='Follow Up'), resp=data.filter(x=>x.status==='Respon'), deals=data.filter(x=>x.status==='Deal'), high=fresh.filter(x=>x.prio==='A');
    q('aiSummary').innerHTML='<b>Rekomendasi AI:</b> '+high.length+' customer prioritas A belum dihubungi. Fokuskan pendekatan pada mereka terlebih dahulu.';
    q('aiResult').innerHTML='<b>Ringkasan:</b><br>Total '+total+' • Belum dihubungi '+fresh.length+' • Follow Up '+fu.length+' • Respon '+resp.length+' • Deal '+deals.length+'<br><br><b>Prioritas berikutnya:</b><br>'+high.slice(0,8).map((x,i)=>(i+1)+'. '+esc(x.name)+' — '+esc(x.city)+' — '+esc(x.phone)).join('<br>')+(high.length>8?'<br>...':'');
  };
  window.aiFollowups=function(){
    if(!window.data)return;
    const list=data.filter(x=>x.status==='Follow Up').sort((a,b)=>String(a.nextFollow||'').localeCompare(String(b.nextFollow||'')));
    q('aiSummary').innerHTML='<b>Prioritas Follow-up:</b> '+list.length+' customer sedang berstatus Follow Up.';
    q('aiResult').innerHTML=list.length?list.slice(0,12).map((x,i)=>(i+1)+'. <b>'+esc(x.name)+'</b> — '+esc(x.city)+' — jadwal: '+esc(x.nextFollow||'belum diatur')).join('<br>'):'Belum ada customer yang dijadwalkan Follow Up.';
  };
  window.addEventListener('load',inject);
})();
