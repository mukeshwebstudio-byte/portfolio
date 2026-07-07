/* ===========================================================================
   GenMB Contact Form SDK (Capability)
   Submits contact form messages that get emailed to the app owner.
   =========================================================================== */
// GenMB contact-form SDK (Capability)
(function() {
/**
 * GenMB Contact Form SDK (Connector)
 * Submit contact form messages that get emailed to the app owner.
 * Build your own contact form UI.
 *
 * Available at window.genmb.contactForm:
 *   window.genmb.contactForm.submit({ name, email, subject?, message })
 */

class GenMBContactForm {
  constructor(config) {
    if (!config.appId) {
      throw new Error('GenMBContactForm: appId is required')
    }
    this.appId = config.appId
    this.baseUrl = (config.baseUrl || '').replace(/\/$/, '')
  }

  /**
   * Submit a contact form message. Emails are sent to the app owner.
   * @param {Object} data
   * @param {string} data.name - Sender name (1-200 chars, required)
   * @param {string} data.email - Sender email (valid email, required)
   * @param {string} [data.subject] - Subject line (0-500 chars, optional)
   * @param {string} data.message - Message body (1-5000 chars, required)
   * @returns {Promise<{ success: boolean }>}
   */
  async submit(data) {
    if (!data || !data.name || !data.email || !data.message) {
      throw new Error('Missing required fields: name, email, message')
    }

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      throw new Error('Invalid email address')
    }

    var controller = new AbortController()
    var timer = setTimeout(function () { controller.abort() }, 30000)

    var res
    try {
      res = await fetch(this.baseUrl + '/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: this.appId,
          name: data.name.trim(),
          email: data.email.trim(),
          subject: (data.subject || '').trim(),
          message: data.message.trim()
        }),
        signal: controller.signal
      })
    } catch (err) {
      clearTimeout(timer)
      if (err.name === 'AbortError') throw new Error('Request timed out')
      throw err
    }
    clearTimeout(timer)

    var json = await res.json()

    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to submit contact form')
    }

    return { success: true }
  }

  // Backward-compat stubs (old widget API — no-op)
  open() {}
  close() {}
  toggle() {}
  setTheme() {}
}


// Auto-initialize
window.genmb = window.genmb || {};
const config = {
  "appId": "yGqMagLQFM4q"
};
window.genmb.contactForm = new GenMBContactForm(config);
})();

/* ===========================================================================
   Site interactions: loading screen, scroll progress, cursor glow, nav,
   reveal-on-scroll, typing effect, stat counters, tilt/magnetic effects,
   testimonial slider, and contact form handling.
   =========================================================================== */
const loadingScreen = document.getElementById('loadingScreen');
window.addEventListener('load', () => {
  if(loadingScreen) loadingScreen.classList.add('hide');
});
setTimeout(() => {
  if(loadingScreen) loadingScreen.classList.add('hide');
}, 1400);

const scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress(){
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  if(scrollProgress) scrollProgress.style.width = progress + '%';
}
updateScrollProgress();
window.addEventListener('scroll', updateScrollProgress, {passive:true});

const cursorGlow = document.getElementById('cursorGlow');
if(cursorGlow){
  document.addEventListener('pointermove', event => {
    cursorGlow.style.left = event.clientX + 'px';
    cursorGlow.style.top = event.clientY + 'px';
  }, {passive:true});
}

const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, {passive:true});

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded','false');
  });
});

const roles = ['Web Developer','Civil-Tech Creator','E-Commerce Specialist','Digital Solutions Expert'];
const typed = document.getElementById('typed');
let roleIndex = 0;
let charIndex = 0;
let deleting = false;
function typeLoop(){
  const current = roles[roleIndex];
  typed.textContent = current.slice(0, charIndex);
  if(!deleting && charIndex < current.length){
    charIndex += 1;
    setTimeout(typeLoop, 78);
    return;
  }
  if(!deleting && charIndex === current.length){
    deleting = true;
    setTimeout(typeLoop, 1500);
    return;
  }
  if(deleting && charIndex > 0){
    charIndex -= 1;
    setTimeout(typeLoop, 42);
    return;
  }
  deleting = false;
  roleIndex = (roleIndex + 1) % roles.length;
  setTimeout(typeLoop, 260);
}
typeLoop();

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const siblings = entry.target.parentElement ? Array.from(entry.target.parentElement.children).filter(el => el.classList.contains('reveal')) : [entry.target];
      const order = Math.max(0, siblings.indexOf(entry.target));
      entry.target.style.transitionDelay = Math.min(order * 90, 360) + 'ms';
      entry.target.classList.add('on');
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

let counted = false;
const statsGrid = document.getElementById('statsGrid');
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting && !counted){
      counted = true;
      document.querySelectorAll('.stat-num').forEach(number => {
        const target = Number(number.dataset.target || 0);
        const suffix = number.dataset.suffix || '';
        const duration = 1100;
        const start = performance.now();
        function update(now){
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          number.textContent = Math.round(target * eased) + suffix;
          if(progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
      });
    }
  });
}, {threshold:.35});
if(statsGrid) countObserver.observe(statsGrid);

function initTilt(){
  const canHover = window.matchMedia('(hover:hover)').matches;
  if(!canHover) return;
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.transform = `perspective(1000px) rotateX(${-y * 8}deg) rotateY(${x * 10}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}
initTilt();

function initMagnetic(){
  if(!window.matchMedia('(hover:hover)').matches) return;
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('pointermove', event => {
      const rect = btn.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      btn.style.transform = `translate(${x * 14}px, ${y * 10 - 3}px)`;
    });
    btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
  });
}
initMagnetic();

const cubeTilt = document.getElementById('cubeTilt');
const heroArt = document.querySelector('.hero-art');
if(cubeTilt && heroArt && window.matchMedia('(hover:hover)').matches){
  heroArt.addEventListener('pointermove', event => {
    const rect = heroArt.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    cubeTilt.style.transform = `rotateX(${-y * 14}deg) rotateY(${x * 16}deg)`;
  });
  heroArt.addEventListener('pointerleave', () => {
    cubeTilt.style.transform = '';
  });
}

const heroSection = document.getElementById('home');
if(heroSection){
  heroSection.addEventListener('pointermove', event => {
    const rect = heroSection.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    heroSection.style.setProperty('--mx', x.toFixed(3));
    heroSection.style.setProperty('--my', y.toFixed(3));
  }, {passive:true});
  heroSection.addEventListener('pointerleave', () => {
    heroSection.style.setProperty('--mx', '.5');
    heroSection.style.setProperty('--my', '.5');
  });
}

const slides = document.getElementById('slides');
const slideItems = Array.from(slides.children);
const prevSlide = document.getElementById('prevSlide');
const nextSlide = document.getElementById('nextSlide');
let activeSlide = 0;
function showSlide(index){
  activeSlide = (index + slideItems.length) % slideItems.length;
  slides.style.transform = `translateX(-${activeSlide * 100}%)`;
}
prevSlide.addEventListener('click', () => showSlide(activeSlide - 1));
nextSlide.addEventListener('click', () => showSlide(activeSlide + 1));
let autoSlide = setInterval(() => showSlide(activeSlide + 1), 5200);
[prevSlide, nextSlide].forEach(button => {
  button.addEventListener('click', () => {
    clearInterval(autoSlide);
    autoSlide = setInterval(() => showSlide(activeSlide + 1), 5200);
  });
});

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const contactSubmit = document.getElementById('contactSubmit');
const setFormStatus = (message, type = '') => {
  formStatus.textContent = message;
  formStatus.className = 'form-status' + (type ? ' ' + type : '');
};
if(contactForm){
  contactForm.addEventListener('submit', async event => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const subject = String(formData.get('subject') || 'Premium portfolio inquiry').trim();
    const message = String(formData.get('message') || '').trim();
    if(!name || !email || !message){
      setFormStatus('Please add your name, email, and message before sending.', 'error');
      return;
    }
    const controls = Array.from(contactForm.querySelectorAll('input, textarea, button'));
    controls.forEach(control => control.disabled = true);
    contactSubmit.innerHTML = '<span class="spinner" aria-hidden="true"></span> Sending...';
    setFormStatus('Sending your inquiry securely...', '');
    try{
      if(!window.genmb || !window.genmb.contactForm){
        throw new Error('Contact service is not available yet. Please try again in a moment.');
      }
      await window.genmb.contactForm.submit({
        name,
        email,
        subject: subject || 'Premium portfolio inquiry',
        message: phone ? `Phone / WhatsApp: ${phone}\n\n${message}` : message
      });
      contactForm.reset();
      setFormStatus('Thank you — your inquiry was sent successfully. I’ll get back to you soon.', 'success');
    }catch(error){
      setFormStatus(error && error.message ? error.message : 'Something went wrong while sending. Please try again.', 'error');
    }finally{
      controls.forEach(control => control.disabled = false);
      contactSubmit.textContent = 'Send Project Inquiry';
    }
  });
}
