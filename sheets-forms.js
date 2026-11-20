// Verified Google Apps Script submission bridge using a cross-origin iframe + postMessage.
(() => {
  const endpoint = window.AXVORQ_SHEETS_API;
  if (!endpoint) return;
  const allowedOrigins = new Set(['https://script.google.com','https://script.googleusercontent.com']);
  document.querySelectorAll('form[data-sheets-submit]').forEach(form => {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const feedback = form.querySelector('.form-feedback-message');
      const button = form.querySelector('button[type="submit"]');
      if (!feedback || !button || !form.reportValidity()) return;
      const values = Object.fromEntries(new FormData(form).entries());
      const payload = {
        action: 'submit', mode: 'iframe', nonce: makeNonce(),
        submission_type: form.dataset.submissionType || 'contact',
        name: values.name || '', email: values.email || '',
        role_or_category: values.role || values.category || '',
        portfolio_url: values.portfolio || '',
        message: values.message || values.intro || values.brief || '',
        website: values.website || '', budget: values.budget || ''
      };
      if (payload.budget) payload.message += '\n\nبودجه: ' + payload.budget;
      button.disabled = true; feedback.className='form-feedback form-feedback-message';
      feedback.textContent='در حال ارسال و بررسی ثبت در Google Sheets…';
      try {
        const result = await submitAndConfirm(payload);
        if (!result.success) throw new Error(result.message || result.error || 'ثبت در شیت تأیید نشد.');
        window.dispatchEvent(new CustomEvent('axvorq:form-submitted',{detail:{type:payload.submission_type,values,form,feedback}}));
        feedback.className='form-feedback form-feedback-message success';
        feedback.textContent='ثبت در Google Sheets تأیید شد. کد پیگیری: '+(result.submission_id||'ثبت‌شده');
        form.reset();
      } catch (error) {
        console.error('AXVORQ Sheets submission:',error);
        feedback.className='form-feedback form-feedback-message error';
        feedback.textContent=error.message||'نتیجه ارسال قابل تأیید نیست. چند دقیقه بعد شیت را بررسی کنید.';
      } finally { button.disabled=false; }
    });
  });
  function makeNonce(){const bytes=new Uint8Array(16);crypto.getRandomValues(bytes);return [...bytes].map(b=>b.toString(16).padStart(2,'0')).join('');}
  function submitAndConfirm(payload){return new Promise((resolve,reject)=>{
    const nonce=payload.nonce, iframe=document.createElement('iframe'), target='axvorq-sheet-'+nonce, hiddenForm=document.createElement('form');
    iframe.name=target;iframe.title='نتیجه ثبت فرم';iframe.hidden=true;iframe.setAttribute('aria-hidden','true');
    hiddenForm.hidden=true;hiddenForm.method='POST';hiddenForm.action=endpoint;hiddenForm.target=target;hiddenForm.acceptCharset='UTF-8';
    Object.entries(payload).forEach(([key,value])=>{const input=document.createElement('input');input.type='hidden';input.name=key;input.value=String(value??'');hiddenForm.appendChild(input);});
    let finished=false;const cleanup=()=>{window.removeEventListener('message',onMessage);clearTimeout(timer);iframe.remove();hiddenForm.remove();};
    const done=(fn,value)=>{if(finished)return;finished=true;cleanup();fn(value);};
    const onMessage=event=>{if(event.source!==iframe.contentWindow||!allowedOrigins.has(event.origin))return;const d=event.data;if(!d||d.type!=='AXVORQ_SHEETS_RESULT'||d.nonce!==nonce)return;done(resolve,d);};
    const timer=setTimeout(()=>done(reject,new Error('زمان پاسخ Google Sheets تمام شد؛ نتیجه ثبت از این صفحه تأیید نشد.')) ,20000);
    window.addEventListener('message',onMessage);document.body.append(iframe,hiddenForm);hiddenForm.submit();
  });}
})();
