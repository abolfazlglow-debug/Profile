import { sb, ready } from './supabase-client.js';
const msg=document.querySelector('#expert-message'), app=document.querySelector('#expert-app');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function say(t,bad=false){msg.hidden=false;msg.textContent=t;msg.className='notice'+(bad?' danger':'');}
function card(title,body,status,date){return `<article class="data-item"><div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap"><strong>${esc(title)}</strong><span class="status">${esc(statusLabel(status))}</span></div><p>${esc(body)}</p><small class="muted">${date?new Date(date).toLocaleDateString('fa-IR'):''}</small></article>`;}
function statusLabel(s){return ({pending:'در انتظار بررسی',approved:'تأییدشده',rejected:'ردشده',completed:'تکمیل‌شده'})[s]||s||'نامشخص';}
async function init(){if(!ready||!sb)return say('اتصال Supabase تنظیم نشده است.',true);const {data:{user},error}=await sb.auth.getUser();if(error||!user){location.replace('auth.html');return;}document.querySelector('#expert-email').textContent=user.email||'کارشناس';
 const [{data:profile,error:pe},{data:applications,error:ae},{data:projects,error:pr}]=await Promise.all([sb.from('profiles').select('role,display_name').eq('id',user.id).maybeSingle(),sb.from('axvorq_applications').select('*').eq('user_id',user.id).order('created_at',{ascending:false}),sb.from('axvorq_projects').select('*').eq('owner_id',user.id).order('created_at',{ascending:false})]);
 if(pe||ae||pr)return say('دریافت اطلاعات ناموفق بود: '+(pe||ae||pr).message,true);
 if(!profile||!['expert','admin','super_admin'].includes(profile.role)){say('این حساب هنوز نقش کارشناس ندارد. ابتدا فرم همکاری را ارسال کنید تا مدیر بررسی کند.',true);}
 else {msg.hidden=true;app.hidden=false;}
 document.querySelector('#expert-stats').innerHTML=[['درخواست‌های کارشناسی',applications.length],['پروژه‌های من',projects.length],['پروژه‌های تأییدشده',projects.filter(x=>x.status==='approved').length]].map(x=>`<div class="dash-box"><span class="muted">${x[0]}</span><h2>${x[1]}</h2></div>`).join('');
 document.querySelector('#my-applications').innerHTML=applications.map(x=>card(x.role,' '+(x.intro||'درخواستی ثبت شده است'),x.status,x.created_at)).join('')||'<div class="empty-state">هنوز درخواست کارشناسی ثبت نکرده‌اید.</div>';
 document.querySelector('#my-projects').innerHTML=projects.map(x=>card(x.category,x.brief,x.status,x.created_at)).join('')||'<div class="empty-state">هنوز پروژه‌ای ثبت نکرده‌اید.</div>';
}
document.querySelector('#expert-logout').addEventListener('click',async()=>{const {error}=await sb.auth.signOut();if(error)say(error.message,true);else location.href='index.html';});init();
