// Satu Restoe V3 — AI Marketing Assistant (local, no auto-send)
(function(){
  function q(id){return document.getElementById(id)}
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
  function getData(){
    if(Array.isArray(window.data)&&window.data.length) return window.data;
    try{
      const raw=localStorage.getItem('satu_restoe_marketing_v2');
      const parsed=raw?JSON.parse(raw):null;
      if(Array.isArray(parsed)&&parsed.length) return parsed;
    }catch(e){}
    try{
      if(typeof SEED!=='undefined'&&Array.isArray(SEED)) return SEED.map(x=>({prio:x[0],prov:x[1],city:x[2],name:x[3],phone:x[4],status:'Belum dihubungi'}));
    }catch(e){}
    return [];
  }
  function inject(){
    if(q('aiCard')) return;
    const card=document.createElement('section'); card.className='card'; card.id='aiCard';
    card.innerHTML=`<style>
      #aiCard{overflow:hidden}
      .ai-head{display:flex;align-items:center;gap:12px;margin-bottom:10px}
      .ai-robot{position:relative;width:72px;height:72px;flex:0 0 72px;border-radius:24px;background:linear-gradient(145deg,#eaf7ff,#fff);box-shadow:0 6px 18px #0b3a7522;display:flex;align-items:center;justify-content:center}
      .ai-robot:before{content:'';position:absolute;top:5px;left:50%;width:7px;height:12px;border-radius:8px;background:#25a7ff;transform:translateX(-50%)}
      .ai-robot:after{content:'';position:absolute;top:0;left:50%;width:12px;height:12px;border-radius:50%;background:#25a7ff;transform:translateX(-50%);box-shadow:0 0 10px #25a7ff}
      .ai-face{width:52px;height:40px;border-radius:16px;background:#172033;position:relative;box-shadow:inset 0 0 0 3px #d9f1ff}
      .ai-face:before{content:'⌣  ⌣';position:absolute;color:#62d9ff;font-size:17px;font-weight:bold;letter-spacing:4px;left:7px;top:8px}
      .ai-body{position:absolute;bottom:-4px;width:34px;height:17px;border-radius:12px 12px 8px 8px;background:#fff;border:2px solid #d9e9f5;box-shadow:0 3px 7px #0002}
      .ai-title{font-size:18px;font-weight:800;margin:0}
      .ai-caption{font-size:12px;color:#667085;margin-top:3px}
      .ai-actions{display:grid;grid-template-columns:1fr 1fr;gap:6px}
      .ai-actions button{width:100%;margin:0}
      .ai-bubble{background:#edf7ee;padding:10px 12px;border-left:4px solid #28a745;border-radius:9px;font-size:13px;margin:8px 0}
      @media(max-width:500px){.ai-robot{width:64px;height:64px;flex-basis:64px}.ai-title{font-size:17px}}
    </style>
    <div class="ai-head"><div class="ai-robot"><div class="ai-face"></div><div class="ai-body"></div></div><div><div class="ai-title">AI Marketing Assistant V3</div><div class="ai-caption">Teman marketing Satu Restoe</div></div></div>
    <div id="aiSummary" class="ai-bubble">🤖 Halo Sob! Saya siap menganalisis database customer.</div>
    <div class="ai-actions"><button class="blue" onclick="aiAnalyze()">🔎 Analisis Customer</button><button class="gray" onclick="aiFollowups()">📅 Prioritas Follow-up</button></div>
    <div id="aiResult" class="history"><span class="muted">Tekan Analisis Customer untuk melihat rekomendasi.</span></div>`;
    const main=document.querySelector('main.wrap'); if(main) main.insertBefore(card,main.firstElementChild.nextElementSibling);
  }
  window.aiAnalyze=function(){
    const data=getData();
    if(!data.length){q('aiSummary').textContent='🤖 Data customer belum tersedia.';return}
    const total=data.length, fresh=data.filter(x=>x.status==='Belum dihubungi'), fu=data.filter(x=>x.status==='Follow Up'), resp=data.filter(x=>x.status==='Respon'), deals=data.filter(x=>x.status==='Deal'), high=fresh.filter(x=>x.prio==='A');
    q('aiSummary').innerHTML='<b>🤖 Rekomendasi AI:</b> '+high.length+' customer prioritas A belum dihubungi. Saya sarankan mulai dari mereka.';
    q('aiResult').innerHTML='<b>📊 Ringkasan:</b><br>Total '+total+' • Belum dihubungi '+fresh.length+' • Follow Up '+fu.length+' • Respon '+resp.length+' • Deal '+deals.length+'<br><br><b>🔥 Prioritas berikutnya:</b><br>'+high.slice(0,10).map((x,i)=>(i+1)+'. '+esc(x.name)+' — '+esc(x.city||'-')).join('<br>')+(high.length>10?'<br>... dan '+(high.length-10)+' lainnya':'');
  };
  window.aiFollowups=function(){
    const data=getData();
    const list=data.filter(x=>x.status==='Follow Up').sort((a,b)=>String(a.nextFollow||'').localeCompare(String(b.nextFollow||'')));
    q('aiSummary').innerHTML='<b>🤖 Prioritas Follow-up:</b> '+list.length+' customer sedang berstatus Follow Up.';
    q('aiResult').innerHTML=list.length?list.slice(0,12).map((x,i)=>(i+1)+'. <b>'+esc(x.name)+'</b> — '+esc(x.city||'-')+' — jadwal: '+esc(x.nextFollow||'belum diatur')).join('<br>'):'Belum ada customer yang dijadwalkan Follow Up.';
  };
  window.addEventListener('load',inject);
})();
