import { sb, ready, notice } from './supabase-client.js';
const form=document.querySelector('#auth-form'),message=document.querySelector('#msg'),emailInput=document.querySelector('#email'),passwordInput=document.querySelector('#password'),signupButton=document.querySelector('#signup'),googleButton=document.querySelector('#google'),resetButton=document.querySelector('#reset-password');
const mode=new URLSearchParams(location.search).get('mode');
function show(text,ok=false){notice(message,text,ok);}
function connected(){if(!ready||!sb){show('اتصال Supabase آماده نیست. تنظیمات اتصال را بررسی کنید.');return false;}return true;}
function validEmail(){if(!emailInput.value.trim()||!emailInput.checkValidity()){show('لطفاً ایمیل معتبر وارد کنید.');emailInput.focus();return false;}return true;}
function validPassword(){if(passwordInput.value.length<8){show('رمز عبور باید حداقل ۸ کاراکتر باشد.');passwordInput.focus();return false;}return true;}
function busy(button,on){if(button)button.disabled=on;}
if(mode==='recovery'){document.querySelector('h1').textContent='تعیین رمز عبور جدید';document.querySelector('p.muted').textContent='رمز جدید حساب خود را وارد کنید.';emailInput.required=false;emailInput.closest('.form-group').hidden=true;signupButton.hidden=true;googleButton.hidden=true;resetButton.hidden=true;}
form?.addEventListener('submit',async event=>{
 event.preventDefault();if(!connected()||(mode!=='recovery'&&!validEmail())||!validPassword())return;
 const button=form.querySelector('button[type="submit"]');busy(button,true);
 try{
  if(mode==='recovery'){
   show('در حال ذخیره رمز جدید…');const {error}=await sb.auth.updateUser({password:passwordInput.value});if(error)throw error;
   show('رمز عبور تغییر کرد. در حال انتقال…',true);location.href='dashboard.html';return;
  }
  show('در حال ورود…');const {error}=await sb.auth.signInWithPassword({email:emailInput.value.trim(),password:passwordInput.value});if(error)throw error;
  show('ورود موفق بود. در حال انتقال…',true);location.href='dashboard.html';
 }catch(error){show(friendly(error));}finally{busy(button,false);}
});
signupButton?.addEventListener('click',async()=>{if(!connected()||!validEmail()||!validPassword())return;busy(signupButton,true);show('در حال ساخت حساب…');try{const {data,error}=await sb.auth.signUp({email:emailInput.value.trim(),password:passwordInput.value,options:{emailRedirectTo:`${location.origin}/dashboard.html`}});if(error)throw error;if(data?.session){show('حساب ساخته شد. در حال انتقال…',true);location.href='dashboard.html';}else show('درخواست ساخت حساب ثبت شد. ایمیل خود را برای تأیید بررسی کنید.',true);}catch(error){show(friendly(error));}finally{busy(signupButton,false);}});
resetButton?.addEventListener('click',async()=>{if(!connected()||!validEmail())return;busy(resetButton,true);show('در حال ارسال لینک بازیابی…');try{const {error}=await sb.auth.resetPasswordForEmail(emailInput.value.trim(),{redirectTo:`${location.origin}/auth.html?mode=recovery`});if(error)throw error;show('اگر این ایمیل حساب داشته باشد، لینک بازیابی ارسال می‌شود. ایمیل خود را بررسی کنید.',true);}catch(error){show(friendly(error));}finally{busy(resetButton,false);}});
googleButton?.addEventListener('click',async()=>{if(!connected())return;busy(googleButton,true);show('در حال انتقال به گوگل…');try{const {error}=await sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:`${location.origin}/dashboard.html`}});if(error)throw error;}catch(error){show(friendly(error));busy(googleButton,false);}});
function friendly(error){const m=String(error?.message||error?.error_description||'');if(/invalid login credentials/i.test(m))return 'ایمیل یا رمز عبور صحیح نیست.';if(/email not confirmed/i.test(m))return 'ابتدا ایمیل خود را تأیید کنید.';if(/password/i.test(m)&&/weak|short/i.test(m))return 'رمز عبور ضعیف است؛ رمز قوی‌تری انتخاب کنید.';if(/provider.*disabled|unsupported provider/i.test(m))return 'ورود با Google در Supabase فعال نشده است. تنظیمات Authentication > Providers را بررسی کنید.';if(/redirect.*(not allowed|url)|url.*not allowed/i.test(m))return 'آدرس بازگشت در Supabase مجاز نیست. Authentication > URL Configuration را بررسی کنید.';if(/invalid api key|apikey/i.test(m))return 'کلید اتصال Supabase معتبر نیست؛ فایل supabase-config.js را بررسی کنید.';if(/failed to fetch|network|timeout/i.test(m))return 'ارتباط با Supabase برقرار نشد. اتصال اینترنت یا دسترسی سرویس را بررسی کنید.';return m||'عملیات انجام نشد. تنظیمات اتصال را بررسی کنید.';}
if(mode==='signup'&&signupButton){signupButton.classList.replace('btn-secondary','btn-primary');form?.querySelector('button[type="submit"]')?.classList.replace('btn-primary','btn-secondary');emailInput?.focus();}
