// Optional browser diagnostics: open any page and inspect window.AXVORQ_DIAGNOSTICS.
(async () => {
  const report = {
    page: location.href,
    supabaseConfigured: !!(window.AXVORQ_SUPABASE?.url && window.AXVORQ_SUPABASE?.anonKey),
    sheetsConfigured: !!window.AXVORQ_SHEETS_API,
    missingAssets: [],
    checkedAt: new Date().toISOString()
  };
  const urls = [...document.querySelectorAll('script[src],link[rel="stylesheet"][href]')]
    .map(el => el.src || el.href)
    .filter(url => url && new URL(url, location.href).origin === location.origin);
  const results = await Promise.all(urls.map(async url => {
    try { const response = await fetch(url, { method: 'HEAD' }); return { url, ok: response.ok }; }
    catch { return { url, ok: false }; }
  }));
  report.missingAssets = results.filter(item => !item.ok).map(item => item.url);
  window.AXVORQ_DIAGNOSTICS = report;
  console.info('AXVORQ diagnostics:', report);
})();
