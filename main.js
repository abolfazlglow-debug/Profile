// AXVORQ shared navigation, language switcher and partial loading.
(async () => {
  const FALLBACK_PARTIALS = {
    header: "<div class=\"top-auth-bar\" aria-label=\"حساب کاربری و زبان\">\n  <a class=\"btn btn-secondary btn-sm\" href=\"auth.html\" data-auth-link=\"login\" data-fa=\"ورود\" data-en=\"Sign in\">ورود</a>\n  <a class=\"btn btn-primary btn-sm\" href=\"auth.html?mode=signup\" data-auth-link=\"signup\" data-fa=\"عضویت\" data-en=\"Sign up\">عضویت</a>\n  <button class=\"lang-btn\" type=\"button\" data-language-toggle title=\"تغییر زبان\" aria-label=\"تغییر زبان به انگلیسی\">EN</button>\n</div>\n\n<aside class=\"site-sidebar\" aria-label=\"منوی اصلی\">\n  <div class=\"sidebar-top\">\n    <a class=\"brand\" href=\"index.html\" title=\"AXVORQ\" aria-label=\"AXVORQ - خانه\">\n      <span class=\"brand-mark\">\n        <img src=\"assets/images/axvorq-mark.webp\" alt=\"لوگوی AXVORQ\" width=\"44\" height=\"44\" decoding=\"async\" onerror=\"this.style.display='none';this.nextElementSibling.style.display='grid'\">\n        <span class=\"brand-fallback\" style=\"display:none\">AX</span>\n      </span>\n      <span class=\"sidebar-label brand-text\">AXVORQ</span>\n    </a>\n    <div class=\"mobile-top-actions\">\n      <a class=\"btn btn-secondary btn-sm\" href=\"auth.html\" data-auth-link=\"login\" data-fa=\"ورود\" data-en=\"Sign in\">ورود</a>\n      <a class=\"btn btn-primary btn-sm\" href=\"auth.html?mode=signup\" data-auth-link=\"signup\" data-fa=\"عضویت\" data-en=\"Sign up\">عضویت</a>\n      <button class=\"lang-btn\" type=\"button\" data-language-toggle title=\"تغییر زبان\" aria-label=\"تغییر زبان به انگلیسی\">EN</button>\n      <button class=\"menu-btn\" type=\"button\" aria-expanded=\"false\" aria-controls=\"primary-navigation\" aria-label=\"باز کردن منو\">☰</button>\n    </div>\n  </div>\n  <nav class=\"sidebar-nav\" id=\"primary-navigation\" aria-label=\"ناوبری اصلی\">\n    <a href=\"index.html\" data-nav=\"index.html\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z\"/></svg><span class=\"sidebar-label\" data-fa=\"خانه\" data-en=\"Home\">خانه</span></a>\n    <a href=\"articles.html\" data-nav=\"articles.html\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 5h16M4 10h16M4 15h10M4 20h7\"/></svg><span class=\"sidebar-label\" data-fa=\"مقاله‌ها\" data-en=\"Articles\">مقاله‌ها</span></a>\n    <a href=\"experts.html\" data-nav=\"experts.html\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75\"/></svg><span class=\"sidebar-label\" data-fa=\"کارشناسان\" data-en=\"Experts\">کارشناسان</span></a>\n    <a href=\"projects.html\" data-nav=\"projects.html\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/></svg><span class=\"sidebar-label\" data-fa=\"پروژه‌ها\" data-en=\"Projects\">پروژه‌ها</span></a>\n    <a href=\"join.html\" data-nav=\"join.html\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M23 11h-6\"/></svg><span class=\"sidebar-label\" data-fa=\"پیوستن به شبکه\" data-en=\"Join the network\">پیوستن به شبکه</span></a>\n    <a href=\"about.html\" data-nav=\"about.html\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm0-10v4m0-8h.01\"/></svg><span class=\"sidebar-label\" data-fa=\"درباره ما\" data-en=\"About us\">درباره ما</span></a>\n    <a href=\"contact.html\" data-nav=\"contact.html\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm18 2-10 7L2 6\"/></svg><span class=\"sidebar-label\" data-fa=\"تماس با ما\" data-en=\"Contact us\">تماس با ما</span></a>\n    <a href=\"https://t.me/axvorq\" target=\"_blank\" rel=\"noopener noreferrer\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m21 3-7.2 18-3.6-7.2L3 10.2 21 3Zm-10.8 10.8L21 3\"/></svg><span class=\"sidebar-label\" data-fa=\"پشتیبانی تلگرام\" data-en=\"Telegram support\">پشتیبانی تلگرام</span></a>\n    <a href=\"dashboard.html\" data-nav=\"dashboard.html\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M3 13h8V3H3zm10 8h8V11h-8zM3 21h8v-6H3zm10-10h8V3h-8z\"/></svg><span class=\"sidebar-label\" data-fa=\"داشبورد کاربری\" data-en=\"User dashboard\">داشبورد کاربری</span></a>\n  </nav>\n</aside>\n<div class=\"sidebar-backdrop\" aria-hidden=\"true\"></div>",
    footer: "<footer class=\"site-footer\">\n  <div class=\"container\">\n    <div class=\"footer-minimal\">\n      <div class=\"footer-brand-row\">\n        <a class=\"brand\" href=\"index.html\">AXVORQ</a>\n        <p data-fa=\"رسانه تخصصی و شبکه‌ای برای همکاری، ایده و ساخت.\" data-en=\"A specialist media & expert network for collaboration, ideas, and building.\">رسانه تخصصی و شبکه‌ای برای همکاری، ایده و ساخت.</p>\n      </div>\n      <div class=\"footer-bottom\">© <span data-year></span> AXVORQ · <span data-fa=\"تمامی حقوق محفوظ است.\" data-en=\"All rights reserved.\">تمامی حقوق محفوظ است.</span></div>\n    </div>\n  </div>\n</footer>"
  };
  const includeNodes = [...document.querySelectorAll('[data-include]')];
  await Promise.all(includeNodes.map(async node => {
    const name = node.dataset.include;
    try {
      const response = await fetch(`partials/${name}.html`);
      if (!response.ok) throw new Error(`Partial ${name}: HTTP ${response.status}`);
      node.innerHTML = await response.text();
    } catch (error) {
      if (FALLBACK_PARTIALS[name]) {
        node.innerHTML = FALLBACK_PARTIALS[name];
      } else {
        console.warn('AXVORQ partial could not load:', name, error);
      }
    }
  }));

  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-nav a[data-nav]').forEach(link => {
    if (link.dataset.nav === current) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  const breadcrumbLabels = {
    'about.html':'درباره ما','articles.html':'مقاله‌ها','article.html':'مقاله',
    'experts.html':'کارشناسان','expert.html':'پروفایل کارشناس','projects.html':'پروژه‌ها',
    'join.html':'پیوستن به شبکه','contact.html':'تماس با ما'
  };
  if (breadcrumbLabels[current]) {
    const main=document.querySelector('main');
    if(main&&!main.querySelector('.breadcrumb-nav')){
      const nav=document.createElement('nav');nav.className='breadcrumb-nav container';nav.setAttribute('aria-label','مسیر صفحه');
      nav.innerHTML=`<a href="index.html">خانه</a><span aria-hidden="true">/</span><span class="breadcrumb-current">${breadcrumbLabels[current]}</span>`;
      main.prepend(nav);
      const ld=document.createElement('script');ld.type='application/ld+json';ld.dataset.breadcrumb='true';
      ld.textContent=JSON.stringify({'@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'خانه','item':'https://www.axvorq.ir/'},{'@type':'ListItem','position':2,'name':breadcrumbLabels[current],'item':`https://www.axvorq.ir/${current}`} ]});document.head.appendChild(ld);
    }
  }

  const hasValidSession = Object.keys(localStorage).some(key => {
    if (!key.startsWith('sb-') || !key.endsWith('-auth-token')) return false;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      const token = parsed?.access_token || parsed?.currentSession?.access_token;
      const expiresAt = parsed?.expires_at || parsed?.currentSession?.expires_at;
      if (!token) return false;
      if (expiresAt && Number(expiresAt) * 1000 < Date.now()) return false;
      return true;
    } catch {
      return false;
    }
  });

  if (hasValidSession) {
    document.querySelectorAll('[data-auth-link="signup"]').forEach(el => { el.style.display = 'none'; });
    document.querySelectorAll('[data-auth-link="login"], [data-auth-link=""]').forEach(link => {
      link.href = 'dashboard.html';
      link.dataset.fa = 'پنل کاربری';
      link.dataset.en = 'My account';
      link.textContent = document.documentElement.lang === 'en' ? 'My account' : 'پنل کاربری';
    });
  }

  const savedLanguage = localStorage.getItem('axvorq-language');
  if (savedLanguage === 'en') setLanguage(true, false);
  else setLanguage(false, false);
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();

function setLanguage(english, persist = true) {
  document.documentElement.lang = english ? 'en' : 'fa';
  document.documentElement.dir = english ? 'ltr' : 'rtl';
  document.querySelectorAll('[data-fa], [data-en]').forEach(el => {
    const value = el.dataset[english ? 'en' : 'fa'];
    if (value !== undefined) el.textContent = value;
  });
  document.querySelectorAll('[data-fa-placeholder], [data-en-placeholder]').forEach(el => {
    const ph = el.dataset[english ? 'enPlaceholder' : 'faPlaceholder'];
    if (ph !== undefined) el.placeholder = ph;
  });
  document.querySelectorAll('[data-language-toggle]').forEach(button => {
    button.textContent = english ? 'FA' : 'EN';
    button.setAttribute('aria-label', english ? 'Switch to Persian' : 'تغییر زبان به انگلیسی');
  });
  if (persist) localStorage.setItem('axvorq-language', english ? 'en' : 'fa');
  window.dispatchEvent(new CustomEvent('axvorq:lang', { detail: { english } }));
}

function closeMobileMenu() {
  const sidebar = document.querySelector('.site-sidebar');
  const button = document.querySelector('.menu-btn');
  sidebar?.classList.remove('open');
  button?.setAttribute('aria-expanded', 'false');
}

document.addEventListener('click', event => {
  const languageButton = event.target.closest('[data-language-toggle]');
  if (languageButton) setLanguage(document.documentElement.lang !== 'en');

  const menuButton = event.target.closest('.menu-btn');
  if (menuButton) {
    const sidebar = document.querySelector('.site-sidebar');
    const isOpen = sidebar?.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(!!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'بستن منو' : 'باز کردن منو');
  }
  if (event.target.closest('.sidebar-backdrop') || event.target.closest('.sidebar-nav a')) closeMobileMenu();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMobileMenu();
});
