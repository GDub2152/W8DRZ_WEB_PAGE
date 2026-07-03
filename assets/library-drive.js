
(function(){
  const cfg = window.TBOP_LIBRARY_CONFIG || {};
  const endpoint = (cfg.appsScriptUrl || '').trim();
  const status = document.getElementById('driveLibraryStatus');
  const grid = document.getElementById('driveLibraryGrid');
  const search = document.getElementById('driveLibrarySearch');
  const category = document.getElementById('driveLibraryCategory');
  const updated = document.getElementById('driveLibraryUpdated');
  let files = [];

  function setStatus(text){ if(status) status.textContent = text; }
  function escapeHTML(s){return String(s||'').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
  function iconFor(name, mime){
    const lower = (name||'').toLowerCase();
    if(lower.endsWith('.pdf') || /pdf/.test(mime||'')) return 'PDF';
    if(/image/.test(mime||'') || /\.(png|jpe?g|gif|webp|svg)$/i.test(lower)) return 'IMG';
    if(/sheet|excel/.test(mime||'')) return 'XLS';
    if(/document|word/.test(mime||'')) return 'DOC';
    return 'FILE';
  }
  function normalizeFile(f){
    return {
      name: f.name || f.title || 'Untitled file',
      url: f.url || f.webViewLink || f.alternateLink || '#',
      category: f.category || f.folder || 'Other',
      description: f.description || '',
      mimeType: f.mimeType || '',
      modifiedTime: f.modifiedTime || f.modified || '',
      size: f.size || ''
    };
  }
  function render(){
    if(!grid) return;
    const q = (search?.value || '').toLowerCase().trim();
    const cat = category?.value || 'All';
    const shown = files.filter(f => {
      const hay = [f.name,f.category,f.description].join(' ').toLowerCase();
      return (!q || hay.includes(q)) && (cat === 'All' || f.category === cat);
    });
    if(!shown.length){
      grid.innerHTML = '<div class="card"><h3>No files found</h3><p>Try another search or category.</p></div>';
      return;
    }
    grid.innerHTML = shown.map(f => `
      <a class="drive-file" href="${escapeHTML(f.url)}" target="_blank" rel="noopener">
        <span class="pdf-icon">${iconFor(f.name, f.mimeType)}</span>
        <span>
          <strong>${escapeHTML(f.name.replace(/\.[^.]+$/, ''))}</strong>
          <small>${escapeHTML(f.category)}${f.modifiedTime ? ' • Updated ' + escapeHTML(String(f.modifiedTime).slice(0,10)) : ''}</small>
          ${f.description ? `<em>${escapeHTML(f.description)}</em>` : ''}
        </span>
      </a>`).join('');
  }
  function populateCategories(){
    if(!category) return;
    const cats = ['All', ...Array.from(new Set(files.map(f=>f.category||'Other'))).sort()];
    category.innerHTML = cats.map(c => `<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join('');
  }
  async function load(){
    if(!endpoint){
      setStatus('Google Drive auto-library is ready. Add your Apps Script Web App URL in assets/library-config.js to turn it on. The original PDF library remains below.');
      return;
    }
    try{
      setStatus('Loading files from Google Drive…');
      const res = await fetch(endpoint, {cache:'no-store'});
      if(!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      files = (Array.isArray(data) ? data : (data.files || [])).map(normalizeFile);
      populateCategories();
      render();
      setStatus(files.length + ' Google Drive files loaded.');
      if(updated) updated.textContent = new Date().toLocaleString();
    }catch(err){
      console.error(err);
      setStatus('Could not load Google Drive files. Check the Apps Script URL and sharing permissions. The original PDF library remains below.');
    }
  }
  search?.addEventListener('input', render);
  category?.addEventListener('change', render);
  load();
})();
