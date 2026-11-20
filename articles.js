(async () => {
  const grid = document.querySelector('#article-grid');
  const search = document.querySelector('#article-search');
  const cat = document.querySelector('#article-category');
  const type = document.querySelector('#article-type');
  if (!grid) return;

  const data = await AXVORQData.load('articles');

  function render() {
    const q = (search?.value || '').trim().toLowerCase();
    const c = cat?.value || 'all';
    const tp = type?.value || 'all';
    const items = data.filter(a =>
      (c === 'all' || a.category === c) &&
      (tp === 'all' || (a.type || 'article') === tp) &&
      (!q || AXVORQData.t(a.title).toLowerCase().includes(q) || AXVORQData.t(a.excerpt).toLowerCase().includes(q))
    );

    grid.innerHTML = items.map(a => {
      const title = AXVORQData.esc(AXVORQData.t(a.title));
      const excerpt = AXVORQData.esc(AXVORQData.t(a.excerpt));
      const cover = AXVORQData.esc(AXVORQData.safeUrl(a.cover));
      const category = AXVORQData.esc(a.category);
      const date = AXVORQData.esc(a.date);
      return `<article class="article-card"><a href="article.html?slug=${encodeURIComponent(a.slug || '')}">${cover ? `<img src="${cover}" alt="${title}" width="640" height="400" loading="lazy" decoding="async">` : ''}<div class="article-card-body"><span class="tag">${category}</span><h3>${title}</h3><p class="muted">${excerpt}</p><small>${date}</small></div></a></article>`;
    }).join('') || '<div class="empty-state">مقاله‌ای پیدا نشد.</div>';
  }

  search?.addEventListener('input', render);
  cat?.addEventListener('change', render);
  type?.addEventListener('change', render);
  window.addEventListener('axvorq:lang', render);
  render();
})();
