(() => {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.hidden = false;
    nav.classList.add('collapsible');
    const close = () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
    nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { close(); toggle.focus(); }
    });
  }
  const filters = document.querySelector('.category-filters');
  if (filters) {
    const entries = [...document.querySelectorAll('.archive-page .entry')];
    const count = document.querySelector('.archive-count');
    filters.hidden = false;
    filters.addEventListener('click', event => {
      const button = event.target.closest('button[data-filter]');
      if (!button) return;
      const category = button.dataset.filter;
      filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      let visible = 0;
      entries.forEach(entry => {
        entry.hidden = !!category && !entry.dataset.categories.split('|').includes(category);
        if (!entry.hidden) visible++;
      });
      count.textContent = `${category || '全部'} · ${visible} 篇`;
    });
  }
  const body = document.querySelector('.reading-body');
  if (body) {
    const headings = [...body.querySelectorAll('h2, h3')];
    if (headings.length >= 4) {
      const toc = document.createElement('details');
      toc.className = 'article-toc';
      const summary = document.createElement('summary');
      summary.textContent = '本文目录';
      const list = document.createElement('ol');
      headings.forEach((heading, index) => {
        if (!heading.id) {
          let id = `section-${index + 1}`;
          while (document.getElementById(id)) id += '-heading';
          heading.id = id;
        }
        const item = document.createElement('li');
        if (heading.tagName === 'H3') item.className = 'toc-subheading';
        const link = document.createElement('a');
        link.href = `#${encodeURIComponent(heading.id)}`;
        link.textContent = heading.textContent;
        item.append(link); list.append(item);
      });
      toc.append(summary, list); body.before(toc);
    }
  }
})();
