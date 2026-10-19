'use strict';
const menu = document.querySelector('.menu');
const nav = document.querySelector('#navlinks');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
nav?.addEventListener('click', event => {
  if (event.target.closest('a')) { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav?.classList.contains('open')) {
    nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.focus();
  }
});
const form = document.querySelector('#enquiry');
if (form) {
  const status = document.querySelector('#form-status');
  const prepare = document.querySelector('#prepare');
  const type = form.elements.type;
  const params = new URLSearchParams(location.search);
  const service = params.get('service') === 'data-preparation' ? 'statistical-analysis' : params.get('service');
  if (Array.from(form.elements.service.options).some(option => option.value === service)) form.elements.service.value = service;
  if (['paid','trial'].includes(params.get('type'))) type.value = params.get('type');
  const syncBudget = () => {
    const trial = type.value === 'trial';
    document.querySelector('#budget-field').hidden = trial;
    form.elements.budget.disabled = trial;
  };
  syncBudget(); type.addEventListener('change', syncBudget);
  form.addEventListener('input', event => {
    const field = event.target;
    const error = document.getElementById(`${field.id}-error`);
    if (error) { error.textContent = ''; field.removeAttribute('aria-invalid'); }
    if (status.dataset.ready) { status.replaceChildren(); delete status.dataset.ready; }
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (prepare.disabled) return;
    let firstInvalid = null;
    for (const field of form.querySelectorAll('[required], input[type="url"]')) {
      const value = field.value.trim();
      let message = !value && field.required ? 'Please complete this field.' : !field.checkValidity() ? (field.type === 'email' ? 'Enter a valid email address.' : 'Please check this field.') : '';
      if (field.name === 'reference' && value && !/^https?:\/\//i.test(value)) message = 'Use a complete http or https reference URL.';
      if (field.name === 'email' && /[\r\n]/.test(value)) message = 'Enter a valid email address.';
      const error = document.getElementById(`${field.id}-error`);
      if (error) {
        error.textContent = message;
        const ids = (field.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
        if (!ids.includes(error.id)) field.setAttribute('aria-describedby', [...ids,error.id].join(' '));
      }
      if (message) { field.setAttribute('aria-invalid','true'); firstInvalid ||= field; }
      else field.removeAttribute('aria-invalid');
    }
    if (firstInvalid) { status.textContent = 'Please correct the highlighted fields before preparing your email.'; firstInvalid.focus(); return; }
    prepare.disabled = true; prepare.textContent = 'Preparing draft…';
    const values = Object.fromEntries(new FormData(form));
    const selectedService = form.elements.service.selectedOptions[0].textContent;
    const subject = `${values.type === 'trial' ? 'Free trial' : 'Paid project'} enquiry — ${selectedService}`;
    const body = [`Name: ${values.name.trim()}`, `Email: ${values.email.trim()}`, `Organisation / website: ${values.organisation.trim() || 'Not specified'}`, `Service: ${selectedService}`, `Enquiry type: ${values.type === 'trial' ? 'Free trial' : 'Paid project'}`, `Expected deliverable: ${values.deliverable.trim()}`, `Reference link: ${values.reference.trim() || 'Not specified'}`, `Preferred deadline: ${values.deadline || 'Not specified'}`, ...(values.type === 'paid' ? [`Budget: ${values.budget?.trim() || 'Not specified'}`] : []), '', 'Project description:', values.description.trim(), ...(values.type === 'trial' ? ['', 'I understand the trial scope and delivery date must be agreed before work begins.'] : [])].join('\n');
    status.replaceChildren(); status.dataset.ready = 'true';
    const note = document.createElement('p'); note.textContent = 'Draft ready. Your enquiry has not been sent. Open your email app, review the message and send it, or copy the draft into your webmail.';
    const link = document.createElement('a'); link.className = 'btn'; link.textContent = 'Open Email Draft →'; link.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const copy = document.createElement('button'); copy.type = 'button'; copy.className = 'btn outline'; copy.textContent = 'Copy Draft'; copy.style.marginLeft = '10px';
    const draft = document.createElement('textarea'); draft.readOnly = true; draft.setAttribute('aria-label','Prepared email subject and message'); draft.rows = 10; draft.value = `To: ${form.dataset.email}\nSubject: ${subject}\n\n${body}`;
    copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(draft.value); copy.textContent = 'Draft Copied'; }
      catch { draft.focus(); draft.select(); copy.textContent = 'Select & Copy Draft'; }
    });
    status.append(note,link,copy,draft);
    prepare.disabled = false; prepare.innerHTML = 'Send Project Enquiry <span aria-hidden="true">→</span>';
  });
}
// Native controls filter server-rendered content; no user data is stored.
const projectSearch = document.querySelector('#project-search');
if (projectSearch) {
  const category = document.querySelector('#project-category');
  const evidence = document.querySelector('#project-evidence');
  const cards = [...document.querySelectorAll('[data-project]')];
  const groups = [...document.querySelectorAll('.project-group')];
  const archive = document.querySelector('#project-archive');
  const params = new URLSearchParams(location.search);
  projectSearch.value = params.get('q') || '';
  if ([...category.options].some(o => o.value === params.get('category'))) category.value = params.get('category');
  if (['supported','pending'].includes(params.get('evidence'))) evidence.value = params.get('evidence');
  function filterProjects(updateUrl = true) {
    const query = projectSearch.value.trim().toLocaleLowerCase();
    let count = 0;
    for (const card of cards) {
      const match = query.split(/\s+/).every(word => card.dataset.search.includes(word)) && (category.value === 'all' || card.dataset.category === category.value) && (evidence.value === 'all' || card.dataset.evidence === evidence.value);
      card.hidden = !match; if (match) count++;
    }
    for (const group of groups) group.hidden = ![...group.querySelectorAll('[data-project]')].some(c => !c.hidden);
    if (query || category.value !== 'all' || evidence.value !== 'all') archive.open = true;
    document.querySelector('#project-count').textContent = `${count} research record${count === 1 ? '' : 's'} match your selection`;
    document.querySelector('#project-empty').hidden = count > 0;
    if (updateUrl) {
      const url = new URL(location.href);
      for (const [key,value] of [['q',projectSearch.value],['category',category.value],['evidence',evidence.value]]) {
        if (!value || value === 'all') url.searchParams.delete(key); else url.searchParams.set(key,value);
      }
      history.replaceState(null,'',url);
    }
  }
  projectSearch.addEventListener('input', () => filterProjects());
  category.addEventListener('change', () => filterProjects());
  evidence.addEventListener('change', () => filterProjects());
  document.querySelector('#clear-projects').addEventListener('click', () => {
    projectSearch.value=''; category.value='all'; evidence.value='all'; archive.open=false; filterProjects(); projectSearch.focus();
  });
  filterProjects(false);
  window.addEventListener('popstate', () => location.reload());
}
const credentialButtons = [...document.querySelectorAll('[data-cert-filter]')];
for (const button of credentialButtons) button.addEventListener('click', () => {
  for (const control of credentialButtons) control.setAttribute('aria-pressed', String(control === button));
  let count = 0;
  for (const card of document.querySelectorAll('[data-cert-category]')) {
    card.hidden = button.dataset.certFilter !== 'all' && card.dataset.certCategory !== button.dataset.certFilter;
    if (!card.hidden) count++;
  }
  document.querySelector('#cert-count').textContent = `${count} training record${count === 1 ? '' : 's'}`;
});
const indicatorButtons = [...document.querySelectorAll('[data-chart-tab]')];
for (const button of indicatorButtons) button.addEventListener('click', () => {
  for (const control of indicatorButtons) control.setAttribute('aria-pressed', String(control === button));
  for (const panel of document.querySelectorAll('[data-chart-panel]')) panel.hidden = panel.dataset.chartPanel !== button.dataset.chartTab;
});
if (indicatorButtons.length) {
  document.querySelector('[data-chart-panel="employment"]').hidden = true;
  const country = document.querySelector('#insight-country');
  const detail = document.querySelector('#insight-detail');
  detail.textContent = 'Loading country detail. The sourced charts and accessible table remain available below.';
  fetch('/assets/insights.json').then(response => {
    if (!response.ok) throw new Error('Data unavailable');
    return response.json();
  }).then(rows => {
    const show = () => {
      const row = rows.find(r => r.country === country.value);
      if (!row) throw new Error('Country not found');
      detail.textContent = `${row.country}, 2010–2024: real GDP per capita growth ${row.growth.toFixed(2)}%. Female employment-to-population ratio (ages 15+) ${row.employment_2010.toFixed(3)}% → ${row.employment_2024.toFixed(3)}%, a change of ${(row.employment_2024-row.employment_2010).toFixed(3)} percentage points. These are descriptive comparisons, not causal estimates.`;
    };
    show(); country.addEventListener('change', show);
  }).catch(() => { detail.textContent='Country detail could not load. Please use the sourced charts and full data table below.'; detail.classList.add('insights-error'); });
}
// Escape closes the secondary desktop navigation as well as the mobile menu.
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    const more = document.querySelector('.nav-more');
    if (more?.open) { more.open = false; more.querySelector('summary').focus(); }
  }
});
