(() => {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const fieldset = form.querySelector('fieldset');
  const button = form.querySelector('button');
  const status = document.querySelector('#contact-status');
  let token = '';
  let widget;
  let submitting = false;
  const announce = (message, error = false) => {
    status.textContent = message;
    status.classList.toggle('contact-error', error);
  };
  const reset = () => {
    token = '';
    button.disabled = true;
    if (widget !== undefined) window.turnstile.reset(widget);
  };
  // File previews and local HTTP previews never send real email or load production challenges.
  if (!['craigieburn.nz', 'www.craigieburn.nz', 'craigieburntrapping.nz', 'www.craigieburntrapping.nz', 'craigieburn-trapping-7pd.pages.dev'].includes(location.hostname) || location.protocol !== 'https:') {
    announce('This is a preview. Messages can be sent from the online website.');
    document.querySelector('#contact-online').hidden = false;
    return;
  }
  fieldset.disabled = false;
  const loadChallenge = () => {
    announce('Loading the security check…');
    window.ctaContactReady = () => {
      widget = window.turnstile.render('#contact-challenge', {
        sitekey: form.dataset.sitekey,
        action: 'contact', theme: 'light', size: form.clientWidth < 300 ? 'compact' : 'flexible',
        callback: value => {
          token = value;
          button.disabled = submitting;
          if (status.textContent === 'Loading the security check…') announce('Ready to send.');
        },
        'expired-callback': () => { token = ''; button.disabled = true; announce('Please complete the security check again.'); },
        'error-callback': () => { token = ''; button.disabled = true; announce('The security check could not load. Please refresh the page or try again later.', true); },
      });
    };
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=ctaContactReady&render=explicit';
    script.async = true;
    script.onerror = () => announce('The security check could not load. Please refresh the page or try again later.', true);
    document.head.append(script);
  };
  // Only load Turnstile when someone approaches the contact form.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); loadChallenge(); }
    }, { rootMargin: '300px' });
    observer.observe(form);
  } else loadChallenge();
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting || !form.reportValidity()) return;
    if (!token) { announce('Please complete the security check.', true); return; }
    const fields = new FormData(form);
    submitting = true;
    button.disabled = true;
    fieldset.disabled = true;
    button.textContent = 'Sending…';
    announce('Sending your message…');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(form.action, {
        method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fields.get('name').trim(), email: fields.get('email').trim(), message: fields.get('message').trim(), website: fields.get('website'), token }),
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error(result.message || 'We could not send your message. Please try again later.');
      form.reset();
      announce('Thank you. Your message has been sent to the CTA team. We’ll reply to the email address you provided.');
      status.focus({ preventScroll: true });
    } catch (error) {
      announce(error instanceof TypeError || error.name === 'AbortError'
        ? 'We couldn’t confirm delivery. Your message is still here; please check your connection before trying again.'
        : error.message, true);
    } finally {
      clearTimeout(timer);
      submitting = false;
      fieldset.disabled = false;
      button.textContent = 'Send message';
      reset();
    }
  });
})();
