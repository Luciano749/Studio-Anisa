(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const form = $('#booking-form'), result = $('#form-result'), preview = $('#message-preview');
  const link = $('#whatsapp-link'), error = $('#form-error'), dateInput = $('#data');
  const menu = $('.menu-toggle'), nav = $('.site-nav');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  // Cada metade deve cobrir a faixa inteira para não revelar espaço vazio no loop.
  const ribbon = $('.service-ribbon'), ribbonTrack = $('.ribbon-track');
  const ribbonGroup = ribbonTrack.querySelector('.ribbon-group');
  const ribbonItems = [...ribbonGroup.children].map(item => item.cloneNode(true));
  const fillRibbon = () => {
    ribbonGroup.replaceChildren(...ribbonItems.map(item => item.cloneNode(true)));
    const baseWidth = ribbonGroup.getBoundingClientRect().width;
    if (!baseWidth) return;
    const repeats = Math.max(1, Math.ceil(ribbon.clientWidth / baseWidth));
    const extraItems = [];
    for (let repetition = 1; repetition < repeats; repetition++) {
      const copies = ribbonItems.map(item => {
        const copy = item.cloneNode(true);
        copy.setAttribute('aria-hidden', 'true');
        return copy;
      });
      extraItems.push(...copies);
    }
    ribbonGroup.append(...extraItems);
    const duplicate = ribbonGroup.cloneNode(true);
    duplicate.setAttribute('aria-hidden', 'true');
    ribbonTrack.replaceChildren(ribbonGroup, duplicate);
  };
  fillRibbon();
  if ('ResizeObserver' in window) {
    new ResizeObserver(fillRibbon).observe(ribbon);
  } else {
    window.addEventListener('resize', fillRibbon);
  }
  if (document.fonts) document.fonts.ready.then(fillRibbon);
  const today = () => { const d = new Date(); return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10); };
  const clean = (v,n) => String(v || '').replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g,' ').trim().slice(0,n);
  $('#year').textContent = String(new Date().getFullYear());
  dateInput.min = today();
  const setMenu = open => {
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
  };
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {setMenu(false); menu.focus();} });
  document.addEventListener('click', e => {if (!e.target.closest('.nav-wrap')) setMenu(false);});
  matchMedia('(min-width: 901px)').addEventListener('change', () => setMenu(false));
  const clearResult = () => {
    result.hidden = true; preview.textContent = ''; link.removeAttribute('href'); error.hidden = true;
    form.querySelectorAll('input,select,textarea').forEach(el => {el.setCustomValidity(''); el.removeAttribute('aria-invalid');});
  };
  form.addEventListener('input', clearResult);
  form.addEventListener('change', clearResult);
  form.addEventListener('submit', e => {
    e.preventDefault(); clearResult(); dateInput.min = today();
    const f = new FormData(form), name = clean(f.get('nome'),80), phone = clean(f.get('telefone'),24);
    const digits = phone.replace(/\D/g,''), local = digits.startsWith('55') && digits.length >= 12 ? digits.slice(2) : digits;
    const service = clean(f.get('servico'),100), date = clean(f.get('data'),10), period = clean(f.get('periodo'),60), note = clean(f.get('observacao'),300);
    const fail = (s,msg) => {const el=$(s); el.setCustomValidity(msg); el.setAttribute('aria-invalid','true'); error.textContent=msg; error.hidden=false; el.reportValidity(); el.focus();};
    if (name.length < 2) return fail('#nome','Informe seu nome com pelo menos dois caracteres.');
    if (!/^[+\d\s().-]+$/.test(phone) || !/^[1-9]{2}\d{8,9}$/.test(local)) return fail('#telefone','Informe WhatsApp com DDD e 10 ou 11 dígitos, com +55 opcional.');
    if (![...$('#servico').options].some(o => !o.disabled && o.value===service)) return fail('#servico','Selecione um serviço disponível.');
    if (![...$('#periodo').options].some(o => o.value===period)) return fail('#periodo','Selecione um período disponível.');
    let dateLabel='Sem preferência de data';
    if (date) {
      const parsed=new Date(`${date}T12:00:00Z`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0,10)!==date || date<today()) return fail('#data','Escolha uma data válida a partir de hoje.');
      dateLabel=new Intl.DateTimeFormat('pt-BR',{dateStyle:'long',timeZone:'UTC'}).format(parsed);
    }
    if (!form.reportValidity()) return;
    const message=['Olá, Studio Anisa! Gostaria de solicitar um horário.','',`Nome: ${name}`,`Meu WhatsApp: +55 ${local}`,`Serviço: ${service}`,`Data de preferência: ${dateLabel}`,`Período: ${period || 'Tenho flexibilidade'}`,...(note ? [`Observação: ${note}`] : []),'','Se possível, me envie as opções disponíveis. Obrigada!'].join('\n');
    // Renderiza os dados como texto; o visitante revisa antes de abrir o WhatsApp.
    preview.textContent=message;
    link.href=`https://wa.me/5534998724407?text=${encodeURIComponent(message)}`;
    result.hidden=false;
    result.scrollIntoView({behavior:motion.matches?'instant':'smooth',block:'nearest'});
    link.focus({preventScroll:true});
  });
  $('#copy-message').addEventListener('click',async e => {
    const button=e.currentTarget;
    try {await navigator.clipboard.writeText(preview.textContent); button.textContent='Mensagem copiada';}
    catch {const range=document.createRange(); range.selectNodeContents(preview); const sel=getSelection(); sel.removeAllRanges(); sel.addRange(range); button.textContent='Use Ctrl+C ou copie o texto selecionado';}
    setTimeout(()=>{button.textContent='Copiar mensagem';},3000);
  });
  if ('IntersectionObserver' in window && !motion.matches) {
    const observer=new IntersectionObserver(entries=>{for(const entry of entries) if(entry.isIntersecting) {entry.target.classList.add('is-visible'); observer.unobserve(entry.target);}},{threshold:.08});
    document.querySelectorAll('.service-card,.studio-copy,.steps-list li,.booking-form').forEach(el=>{el.classList.add('reveal'); observer.observe(el);});
    motion.addEventListener('change',e=>{if(e.matches){observer.disconnect(); document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));}});
  }
})();


