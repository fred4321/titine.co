/* Interactions autonomes de la copie statique de Titine.co. */
(() => {
  'use strict';
  const script = document.querySelector('script[data-titine-runtime]');
  const home = new URL('../../index.html', script.src).href;
  const content = document.querySelector('#s-content');
  const nav = document.querySelector('#s-nav');
  if (content && nav) {
    document.querySelectorAll('#s-header .logo-image, #s-header .logo-image-fixed, #s-header .logo-title').forEach(el => {
      el.style.cursor = 'pointer'; el.tabIndex = 0; el.setAttribute('role','link');
      el.setAttribute('aria-label','Accueil');
      el.addEventListener('click', () => location.href = home);
      el.addEventListener('keydown', e => { if (e.key === 'Enter') location.href = home; });
    });
    const mobile = document.createElement('div'); mobile.className = 's-navbar-container';
    mobile.innerHTML = '<div class="navbar-drawer-bar"><div class="drawer-container"><div class="navbar s-mobile-nav-bar" role="button" tabindex="0" aria-label="Menu" aria-expanded="false" aria-controls="nav-drawer-list"><div class="navbar-icons"><span></span><span></span><span></span></div></div><div class="navbar-drawer-title-container"></div></div></div><div id="navbar-drawer-mask"></div><div class="navbar-drawer strikingly-drawer bottom-border"><ul id="nav-drawer-list"></ul></div>';
    const list = mobile.querySelector('ul');
    nav.querySelectorAll('.s-nav-item').forEach(link => {
      const li = document.createElement('li'), span = document.createElement('span'), a = link.cloneNode(true);
      a.className = 'navbar-drawer-item s-font-body'; span.append(a); li.append(span); list.append(li);
    });
    document.querySelector('#s-header').after(mobile);
    const toggle = mobile.querySelector('[role="button"]'), bar = mobile.querySelector('.navbar-drawer-bar'), drawer = mobile.querySelector('.navbar-drawer'), mask = mobile.querySelector('#navbar-drawer-mask');
    const setMenu = open => {
      toggle.setAttribute('aria-expanded', String(open)); bar.classList.toggle('drawer-open', open);
      drawer.classList.toggle('translate', open); mask.style.display = open ? 'block' : 'none'; mask.style.opacity = open ? '1' : '0';
      drawer.inert = !open;
    };
    setMenu(false);
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    toggle.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle.click(); } });
    mask.addEventListener('click', () => setMenu(false));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
    const first = content.querySelector('.s-section');
    const layout = () => { if(first) first.style.paddingTop = '100px'; if(innerWidth>727)setMenu(false); };
    layout(); addEventListener('resize',layout);
    const setRows = () => {
      [...new Set([...document.querySelectorAll('.s-repeatable-item')].map(el=>el.parentElement))].forEach(group => {
        const items = [...group.children].filter(el=>el.classList.contains('s-repeatable-item'));
        items.forEach(el=>el.classList.remove('s-last-row'));
        const lastTop = Math.max(...items.map(el=>el.getBoundingClientRect().top));
        items.forEach(el=>el.classList.toggle('s-last-row',el.getBoundingClientRect().top===lastTop));
      });
    };
    setRows(); addEventListener('resize',setRows); document.fonts.ready.then(setRows);
    const sections = [...content.querySelectorAll('.s-section')];
    sections.forEach((el,i)=>{if(el.classList.contains('s-no-bg') && sections[i+1]?.classList.contains('s-no-bg'))el.classList.add('collapse-bottom-padding');});
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!reduced && innerWidth>727) {
      const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.remove('s-animation-page-slide_in-before');entry.target.classList.add('s-animation-page-slide_in');observer.unobserve(entry.target);}
      }),{rootMargin:'0px 0px -30px 0px'});
      content.querySelectorAll('.s-section .s-component, .process-item-infos, .s-item-text-group').forEach(el=>{
        if(el.closest('.s-section')===first || el.parentElement.closest('.s-component,.s-item-text-group,.process-item-infos'))return;
        el.classList.add('s-animation-page-slide_in-before');observer.observe(el);
      });
    }
    const backgrounds = sections.filter(el=>el!==first && el.style.backgroundImage && el.style.backgroundImage!=='none');
    let scheduled=false;
    const onScroll = () => {
      scheduled=false; nav.classList.toggle('fixed',innerWidth>727 && scrollY>100);
      if(innerWidth<=727||reduced)return;
      backgrounds.forEach(el=>{
        const r=el.getBoundingClientRect();
        if(r.bottom<0||r.top>innerHeight)return;
        el.style.backgroundAttachment='fixed';
        el.style.backgroundPosition='50% calc(50% + '+(r.top*.3)+'px)';
      });
    };
    addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(onScroll);}},{passive:true});
    addEventListener('resize',()=>{backgrounds.forEach(el=>{el.style.backgroundAttachment='';el.style.backgroundPosition='50% 50%';});onScroll();});

  }
  document.querySelectorAll('.s-email-form-field-input input, .s-email-form-field-input textarea').forEach(field => {
    const update = () => field.parentElement.classList.toggle('has-value', !!field.value);
    field.addEventListener('input', update); update();
  });
  const cookie = document.querySelector('.s-cookie-notification-bar');
  if(cookie) {
    let accepted = false; try { accepted = localStorage.getItem('titine-cookie-consent') === 'accepted'; } catch(_) {}
    // Le bandeau d'origine est masqué par son style inline ; conserver cet état.
    cookie.querySelector('button')?.addEventListener('click', () => { try {localStorage.setItem('titine-cookie-consent','accepted');} catch(_) {} cookie.remove(); });
  }
  const form = document.querySelector('#contact-form');
  form?.addEventListener('submit', async event => {
    event.preventDefault();
    if(!form.reportValidity()) return;
    const status = document.querySelector('#contact-status');
    const cfg = window.TITINE_CONTACT || {};
    const data = new FormData(form);
    const values = Object.fromEntries(data);
    const endpoint = cfg.endpoint || form.getAttribute('action');
    const button = form.querySelector('button[type=submit]');
    if(!endpoint) {
      status.textContent = 'Pour envoyer votre demande, ouvrez votre messagerie puis confirmez l’envoi.';
      const link = document.createElement('a'); link.textContent = ' Ouvrir mon e-mail';
      link.href = 'mailto:' + (cfg.email || 'contact@novelios.com') + '?subject=' + encodeURIComponent('Contact Titine.co — ' + values.name) + '&body=' + encodeURIComponent('Nom / association : '+values.name+'\nEmail : '+values.email+'\nTéléphone : '+values.phone+'\n\n'+values.message);
      status.append(link); return;
    }
    button.disabled = true; status.textContent = 'Envoi en cours…';
    try {
      const response = await fetch(endpoint,{method:'POST',headers:{'Accept':'application/json'},body:data,signal:AbortSignal.timeout(20000)});
      if(!response.ok) throw new Error('send');
      status.textContent = 'Merci ! Votre message a été envoyé.'; form.reset();
      form.querySelectorAll('.has-value').forEach(el=>el.classList.remove('has-value'));
    } catch(_) { status.textContent = 'L’envoi a échoué. Réessayez ou contactez-nous à contact@novelios.com.'; }
    finally { button.disabled = false; }
  });
})();
