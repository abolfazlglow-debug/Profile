import { sb, ready } from './supabase-client.js';

window.addEventListener('axvorq:form-submitted', async (ev) => {
  const { type, values, feedback } = ev.detail || {};
  if (type !== 'expert' || !ready || !sb) return;
  try {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;
    const { error } = await sb.from('axvorq_applications').insert({
      user_id: user.id,
      name: values.name,
      email: values.email,
      role: values.role,
      portfolio: values.portfolio || null,
      intro: values.intro,
      status: 'pending'
    });
    if (!error && feedback) {
      feedback.textContent = 'درخواست شما در پنل کاربری و سیستم ثبت شد و در انتظار بررسی است.';
    }
  } catch (err) {
    console.warn('AXVORQ Supabase application sync skipped:', err);
  }
});
