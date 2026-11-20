import { sb, ready } from './supabase-client.js';

window.addEventListener('axvorq:form-submitted', async (ev) => {
  const { type, values, feedback } = ev.detail || {};
  if (type !== 'project' || !ready || !sb) return;
  try {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;
    const { error } = await sb.from('axvorq_projects').insert({
      owner_id: user.id,
      contact_name: values.name,
      contact_email: values.email,
      category: values.category,
      budget: values.budget || null,
      brief: values.brief,
      status: 'pending'
    });
    if (!error && feedback) {
      feedback.textContent = 'پروژه در پنل کاربری و سیستم ثبت شد و در انتظار بررسی است.';
    }
  } catch (err) {
    console.warn('AXVORQ Supabase project sync skipped:', err);
  }
});
