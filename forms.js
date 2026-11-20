// Formspree fallback handler. Forms marked data-sheets-submit are handled only by sheets-forms.js.
document.querySelectorAll('form[data-formspree]:not([data-sheets-submit])').forEach(form => {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const feedback = form.querySelector('.form-feedback-message');
    const button = form.querySelector('button[type="submit"]');
    if (!feedback || !button) return;
    button.disabled = true;
    feedback.textContent = 'در حال ارسال…';
    try {
      const response = await fetch(form.action, {
        method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('ارسال انجام نشد');
      feedback.textContent = 'پیام شما ارسال شد. ممنون!';
      form.reset();
    } catch (error) {
      feedback.textContent = error.message || 'اتصال برقرار نشد. لطفاً بعداً تلاش کنید.';
    } finally {
      button.disabled = false;
    }
  });
});
