import {createClient} from 'https://esm.sh/@supabase/supabase-js@2';
const c=window.AXVORQ_SUPABASE||{};
export const ready=!!(typeof c.url==='string'&&/^https:\/\//.test(c.url)&&typeof c.anonKey==='string'&&c.anonKey.length>20&&!c.anonKey.includes('PASTE_'));
export const sb=ready?createClient(c.url.replace(/\/$/,''),c.anonKey):null;
export function notice(el,t,ok=false){if(el){el.textContent=t;el.className='form-feedback '+(ok?'success':'error')}}
