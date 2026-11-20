window.AXVORQData = {
  articles: [],
  experts: [],
  projects: [],
  t: (v) => {
    if (typeof v !== 'object' || v === null) return v ?? '';
    return document.documentElement.lang === 'en' ? (v.en || v.fa || '') : (v.fa || v.en || '');
  },
  esc: (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),
  safeUrl: (url) => {
    const s = String(url ?? '').trim();
    if (!s) return '';
    if (/^(https?:\/\/|\/|\.\/|[a-zA-Z0-9_-]+\/|[a-zA-Z0-9_%.-]+\.(webp|png|jpe?g|svg|gif))/.test(s)) return s;
    return '';
  },
  sanitizeHtml: (html) => {
    const doc = new DOMParser().parseFromString(String(html ?? ''), 'text/html');
    doc.querySelectorAll('script,iframe,object,embed,style,link,meta,base,form').forEach(el => el.remove());
    doc.querySelectorAll('*').forEach(el => {
      [...el.attributes].forEach(attr => {
        const name = attr.name.toLowerCase();
        const val = attr.value.trim().toLowerCase();
        if (name.startsWith('on') || name === 'srcdoc' || name === 'style' || ((name === 'href' || name === 'src' || name === 'xlink:href') && !/^(https?:|mailto:|tel:|\/|\.\/|#)/i.test(val))) {
          el.removeAttribute(attr.name);
        }
      });
    });
    return doc.body.innerHTML;
  },
  _normalize: (kind, row) => {
    if (kind === 'articles') {
      return {
        slug: row.slug,
        title: { fa: row.title_fa || row.title || '', en: row.title_en || '' },
        excerpt: { fa: row.excerpt_fa || row.excerpt || '', en: row.excerpt_en || '' },
        category: row.category || row.category_id || row.content_type || 'general',
        cover: row.cover_image_url || row.cover || '',
        date: row.published_at || row.publish_at || row.created_at || '',
        body: { fa: row.body_fa || row.body || '', en: row.body_en || '' },
        type: row.content_type || 'article'
      };
    }
    if (kind === 'experts') {
      return {
        id: row.id || row.expert_id || row.slug,
        name: row.name_fa || row.name_en || row.name || '',
        role: row.role_fa || row.role_en || row.role || '',
        skills: Array.isArray(row.skills) ? row.skills : String(row.skills || '').split(',').map(x => x.trim()).filter(Boolean),
        bio: row.bio_fa || row.bio_en || row.bio || '',
        status: row.availability || (row.status === 'published' ? 'available' : row.status) || 'available',
        avatar: row.avatar_url || row.avatar || '',
        slug: row.slug
      };
    }
    if (kind === 'projects') {
      return {
        id: row.project_id || row.slug,
        title: row.title_fa || row.title_en || '',
        category: row.category_id || '',
        budget: row.budget || 'قابل مذاکره',
        brief: row.description_fa || row.description_en || '',
        deadline: row.deadline || '',
        slug: row.slug
      };
    }
    return row;
  },
  load: async (k) => {
    const fallback = window.AXVORQData[k] || [];
    // Prefer the protected-by-RLS Supabase content tables when configured.
    const supabase = window.AXVORQ_SUPABASE || {};
    const table = k === 'articles' ? 'axvorq_articles' : k === 'experts' ? 'axvorq_experts' : null;
    if (table && supabase.url && supabase.anonKey) {
      try {
        const query = `${supabase.url.replace(/\/$/, '')}/rest/v1/${table}?select=*&status=eq.published&order=created_at.desc`;
        const res = await fetch(query, { headers: { apikey: supabase.anonKey }, cache: 'no-store' });
        if (!res.ok) throw Error(`Supabase status ${res.status}`);
        const rows = await res.json();
        if (Array.isArray(rows) && rows.length) return rows.map(row => window.AXVORQData._normalize(k, row));
      } catch (e) { console.warn('AXVORQ Supabase public content fallback:', k, e); }
    }
    const endpoint = window.AXVORQ_SHEETS_API;
    if (!endpoint) return fallback;
    try {
      const res = await fetch(endpoint + '?action=' + encodeURIComponent(k), { cache: 'no-store' });
      if (!res.ok) throw Error('API status');
      const json = await res.json();
      if (!json.success || !Array.isArray(json.data)) throw Error('API format');
      return json.data.map(row => window.AXVORQData._normalize(k, row));
    } catch (e) {
      console.warn('AXVORQ Sheets API fallback:', k, e);
      return fallback;
    }
  }
};
