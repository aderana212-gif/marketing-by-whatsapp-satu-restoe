const SUPABASE_URL='https://xgidnneeovsqfysleeua.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_bcLO52pj7tmWEHBPxziSHw_ElYtHWM0';
const db=supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
const CATS={travel:'🧳 Travel',bus:'🚌 Bus',eo:'🎪 EO/MICE',corp:'🏢 Corporate',wedding:'💍 Wedding',community:'👥 Community'};
const STATUSES=['Belum dihubungi','Sudah dihubungi'];
let contacts=[],statuses=new Map(),templates=new Map(),currentCat='travel',selected=null,selectedIds=new Set();
const $=id=>document.getElementById(id);
const norm=p=>String(p||'').replace(/\D/g,'').replace(/^0/,'62');
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function msg(c){const t=templates.get(c?.category);if(t)return t.replaceAll('[NAMA]',c?.name||'').replaceAll('\\n','\n');return 'Assalamu’alaikum Bapak/Ibu '+(c?.name||'')+' 🙏\n\nPerkenalkan, kami dari SATU RESTOE Pangandaran.\n\nBoleh kami kirimkan menu & paket Satu Restoe?\n\nTerima kasih 🙏\nSATU RESTOE PANGANDARAN\nWA 0812-2011-1178'}
async function startAnonymousSession(){const {data:{session}}=await db.auth.getSession();if(session)return true;const {data,error}=await db.auth.signInAnonymously();if(error){$('appMsg').textContent='Session otomatis gagal: '+error.message;return false}return !!data?.session}
async function load(){
 const {data,error}=await db.from('marketing_contacts').select('id,name,city,phone,category,grade,active').eq('active',true).order('id');
 if(error){$('appMsg').textContent='Gagal mengambil kontak: '+error.message;return}
 contacts=data||[];
 const {data:t,error:te}=await db.from('marketing_templates').select('category,template').eq('active',true);
 if(!te)templates=new Map((t||[]).map(x=>[x.category,x.template]));
 const {data:s,error:e}=await db.from('marketing_contact_status').select('contact_id,status');
 if(!e)(s||[]).forEach(x=>statuses.set(x.contact_id,x));
 renderCats();render();newCustomer()
}
function renderCats(){$('cats').innerHTML=Object.entries(CATS).map(([k,v])=>'<button class="'+(k===currentCat?'active':'')+'" onclick="setCat(\''+k+'\')">'+v+'</button>').join('')}
function setCat(k){currentCat=k;selected=null;selectedIds.clear();renderCats();render();newCustomer()}
function visible(){
 const q=$('search').value.toLowerCase(),sf=$('statusFilter').value;
 return contacts.filter(c=>c.category===currentCat&&(!q||[c.name,c.city,c.phone].join(' ').toLowerCase().includes(q))&&(!sf||(statuses.get(c.id)?.status||'Belum dihubungi')===sf)).sort((a,b)=>{const sa=statuses.get(a.id)?.status||'Belum dihubungi',sb=statuses.get(b.id)?.status||'Belum dihubungi';return (sa==='Belum dihubungi'?0:1)-(sb==='Belum dihubungi'?0:1)||({A:0,B:1}[a.grade]??9)-({A:0,B:1}[b.grade]??9)||a.id-b.id})
}
function render(){
 const arr=visible();
 $('tbody').innerHTML=arr.map((c,i)=>{const st=statuses.get(c.id)?.status||'Belum dihubungi',checked=selectedIds.has(c.id)?' checked':'',label=st==='Belum dihubungi'?'Belum':'Dihubungi';return '<tr onclick="pick('+c.id+')"><td onclick="event.stopPropagation()"><input class="contactCheck" type="checkbox" data-id="'+c.id+'"'+checked+'></td><td>'+(i+1)+'</td><td>'+esc(c.grade)+'</td><td>'+esc(c.name)+'</td><td>'+esc(c.city)+'</td><td>'+esc(c.phone)+'</td><td><span class="statusBadge">'+label+'</span></td></tr>'}).join('');
 arr.forEach(c=>{const el=document.querySelector('.contactCheck[data-id="'+c.id+'"]');if(el)el.onchange=()=>{el.checked?selectedIds.add(c.id):selectedIds.delete(c.id);pick(c.id);updateSelectionUI()}});
 updateSelectionUI();
 const cat=contacts.filter(c=>c.category===currentCat);$('total').textContent=cat.length;$('new').textContent=cat.filter(c=>(statuses.get(c.id)?.status||'Belum dihubungi')==='Belum dihubungi').length;$('contacted').textContent=cat.filter(c=>(statuses.get(c.id)?.status||'Belum dihubungi')==='Sudah dihubungi').length
}
function updateSelectionUI(){const arr=visible(),n=[...selectedIds].filter(id=>arr.some(c=>c.id===id)).length;$('selectedCount').textContent=n+' dipilih';$('waSelectedBtn').disabled=n===0;$('selectAll').checked=arr.length>0&&arr.every(c=>selectedIds.has(c.id))}
function toggleAllVisible(){const arr=visible(),all=arr.length>0&&arr.every(c=>selectedIds.has(c.id));arr.forEach(c=>all?selectedIds.delete(c.id):selectedIds.add(c.id));if(arr.length&&!all)pick(arr[0].id);render()}
async function saveStatus(st=$('status').value){if(!selected){$('appMsg').textContent='Pilih customer dulu.';return false}const old=statuses.get(selected.id)||{},row={contact_id:selected.id,status:st,marketing:old.marketing||'',last_contact:st==='Sudah dihubungi'?new Date().toISOString():old.last_contact||null,next_follow:old.next_follow||null,notes:old.notes||'',history:Array.isArray(old.history)?old.history:[],updated_by:null,updated_at:new Date().toISOString()};const {data,error}=await db.from('marketing_contact_status').upsert(row,{onConflict:'contact_id'}).select().single();if(error){$('appMsg').textContent='Gagal menyimpan: '+error.message;return false}statuses.set(selected.id,data);$('status').value=st;render();pick(selected.id);$('appMsg').textContent='Status: '+st;return true}
async function openWA(){if(!selected){$('appMsg').textContent='Pilih customer dulu.';return}const p=norm(selected.phone);const win=window.open('https://wa.me/'+p+'?text='+encodeURIComponent(msg(selected)),'_blank');if(!win){$('appMsg').textContent='Popup WhatsApp diblokir browser.';return}await saveStatus('Sudah dihubungi')}
function pick(id){selected=contacts.find(c=>c.id===id)||null;if(!selected)return;const s=statuses.get(id)||{};$('title').textContent=selected.name;$('detail').innerHTML='<b>'+esc(selected.city||'')+'</b> • '+esc(selected.category)+' • Prioritas '+esc(selected.grade)+'<br>WhatsApp: '+esc(selected.phone);$('status').value=s.status||'Belum dihubungi'}
function newCustomer(){$('title').textContent='Pilih Customer';$('detail').textContent='Pilih customer dari daftar.';$('status').value='Belum dihubungi'}
function openSelectedWA(){const arr=contacts.filter(c=>selectedIds.has(c.id));if(!arr.length)return;const c=arr[0];pick(c.id);selectedIds.delete(c.id);openWA();$('appMsg').textContent='WA dibuka untuk '+c.name+'. Sisa antrean: '+(arr.length-1)+'.';render()}
$('selectAll').onchange=toggleAllVisible;$('waSelectedBtn').onclick=openSelectedWA;$('saveBtn').onclick=()=>saveStatus();$('waBtn').onclick=openWA;$('clearSearch').onclick=()=>{$('search').value='';render()};$('search').oninput=render;$('statusFilter').onchange=render;
(async()=>{await startAnonymousSession();await load()})();