const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Dark / light mode */
const root = document.documentElement;
$('#theme').addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch (e) {}
});

/* Mobile menu */
const menu = $('#menu');
$('#burger').addEventListener('click', () => menu.classList.toggle('open'));
$$('a', menu).forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

/* Big title: letter-by-letter entrance */
const title = $('#bigtitle');
title.innerHTML = [...title.textContent].map((c, i) => `<span style="animation-delay:${i * 0.07}s">${c}</span>`).join('');

/* Typing effect */
const words = ['UI/UX Designer', 'Digital Marketer', 'Brand Designer', 'SEO Specialist'];
const typed = $('#typed');
let w = 0, c = 0, del = false;
(function type() {
  const word = words[w];
  typed.textContent = word.slice(0, c);
  if (reduce) { typed.textContent = words[0]; return; }
  if (!del && c === word.length) { del = true; return setTimeout(type, 1400); }
  if (del && c === 0) { del = false; w = (w + 1) % words.length; }
  c += del ? -1 : 1;
  setTimeout(type, del ? 45 : 90);
})();

/* Scroll: progress bar, nav shadow, back to top */
const nav = $('#nav'), bar = $('#progress');
addEventListener('scroll', () => {
  const h = document.documentElement;
  bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
  nav.classList.toggle('scrolled', h.scrollTop > 20);
}, { passive: true });
$('#top').addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

/* Active nav link (scroll spy) */
const links = $$('nav a', nav);
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
$$('main section').forEach(s => spy.observe(s));

/* Reveal on scroll + counters + skill bars */
function count(el) {
  const end = +el.dataset.n; let n = 0;
  const t = setInterval(() => { n = Math.min(end, n + Math.max(1, Math.round(end / 40))); el.textContent = n; if (n >= end) clearInterval(t); }, 35);
}
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target; el.classList.add('in');
  $$('[data-n]', el).forEach(count);
  $$('.bar', el).forEach(b => b.querySelector('i').style.width = b.dataset.v + '%');
  io.unobserve(el);
}), { threshold: .18 });
$$('.reveal').forEach(el => io.observe(el));

/* Project filters */
$$('.f').forEach(btn => btn.addEventListener('click', () => {
  $$('.f').forEach(b => b.classList.toggle('active', b === btn));
  $$('.card').forEach(card => card.classList.toggle('hide', btn.dataset.f !== 'all' && card.dataset.c !== btn.dataset.f));
}));

/* 3D tilt on project cards */
if (!reduce && matchMedia('(hover:hover)').matches) {
  $$('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });
}

/* Contact form: opens visitor's email app */
$('#form').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  const body = encodeURIComponent(`Name: ${f.n.value}\nEmail: ${f.e.value}\n\n${f.m.value}`);
  location.href = `mailto:yourname@gmail.com?subject=${encodeURIComponent('Portfolio enquiry from ' + f.n.value)}&body=${body}`;
  $('#msg').textContent = 'Opening your email app. Thank you!';
});


/* Project details popup */
const PROJECTS = [
  { cat:'Portfolio', title:'Dynamic Creative Portfolio',
    desc:'A modern, highly interactive portfolio website for Saravanakumar, showcasing expertise in UI/UX design, brand identity, and front-end development, built to grab client attention and spark collaboration.',
    result:'Faster checkout and more repeat orders.',
    tools:['Figma','User Research','Prototyping'], 
    link:'' },

  { cat:'Fresh Mart — Online Organic Fruits', title:'Fresh Mart',
    desc:'Built a vibrant, user-friendly WordPress e-commerce store for Fresh Mart, allowing customers to browse and buy fresh, 100% organic fruits online with a seamless checkout experience.',
    problem:'Low online visibility and very few enquiries.',
    solution:'Targeted ad creatives, audience testing and weekly optimisation.',
    result:'+240% leads in 3 months.',
    tools:['Meta Ads','Google Ads','Analytics'], link:'' },

  { cat:'Fresh Mart Mobile App', title:'Fresh Mart: Custom Figma Mobile App UI Design',
    desc:'Designed an intuitive, high-fidelity mobile app UI for Fresh Mart in Figma, focusing on a seamless "farm-to-table" fruit shopping experience with a fresh, natural aesthetic.',
    problem:'The old page had a high bounce rate.',
    solution:'New layout, stronger headlines and a clear call to action.',
    result:'Higher sign-ups and longer time on page.',
    tools:['Figma','Webflow','SEO'], link:'' },

  { cat:'Wordpress', title:'Golden Glory Jewels',
    desc:'Designed and developed a high-end, responsive e-commerce website for Golden Glory Jewels using WordPress and deployed on the Pantheon WebOps platform for enterprise-grade speed, security, and scalability.On-page SEO and a content plan to improve search ranking.',
    problem:'The cafe had no consistent brand look.',
    solution:'Logo, colour palette, typography and ready-to-use post templates.',
    result:'A consistent brand across menu, signage and Instagram.',
    tools:['Illustrator','Photoshop','Canva'], link:'' },

  { cat:'Digital Marketing Agency', title:'Responsive HTML5 Website Template',
    desc:'Designed and developed a high-converting, responsive Digital Marketing Agency website template using clean HTML5 and CSS3, crafted to showcase marketing services, client success, and lead generation.',
    problem:'The website was not showing up on Google.',
    solution:'Keyword research, page optimisation and monthly blog content.',
    result:'Key pages ranking on page 1.',
    tools:['SEMrush','Google Analytics','Content'], link:'' },

  { cat:'AI', title:'Generative Image & Video Creation Platform',
    desc:'Built a high-performance generative AI workspace interface that empowers users to seamlessly generate, render, and edit cinematic 8K images and immersive videos from simple natural language prompts.',
    problem:'Users found the data confusing.',
    solution:'Simple charts, clear hierarchy and a consistent design system.',
    result:'Easier decisions and better user feedback.',
    tools:['Figma','Design System','Prototyping'], link:'' }
];

const modal = $('#modal');
const cards = $$('.card');

function openProject(i) {
  const p = PROJECTS[i]; if (!p) return;
  const media = $('#m-media');
  media.innerHTML = '';
  media.appendChild(cards[i].querySelector('.poster').cloneNode(true));
  $('#m-cat').textContent = p.cat;
  $('#m-title').textContent = p.title;
  $('#m-desc').textContent = p.desc;
 /* $('#m-prob').textContent = p.problem;
  $('#m-sol').textContent = p.solution;
  $('#m-res').textContent = p.result;*/
  $('#m-tags').innerHTML = p.tools.map(t => `<span>${t}</span>`).join('');
  const link = $('#m-link');
  link.style.display = p.link ? '' : 'none';
  link.href = p.link || '#';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lock');
  $('#m-close').focus();
}
function closeProject() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lock');
}
cards.forEach((card, i) => card.addEventListener('click', e => { e.preventDefault(); openProject(i); }));
$('#m-close').addEventListener('click', closeProject);
modal.addEventListener('click', e => { if (e.target === modal) closeProject(); });
addEventListener('keydown', e => { if (e.key === 'Escape') closeProject(); });

/* Letter hover effect on headings */
function splitLetters(el) {
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(tok => {
          if (!tok) return;
          if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span'); w.className = 'word';
          [...tok].forEach(c => {
            const s = document.createElement('span'); s.className = 'ch'; s.textContent = c; w.appendChild(s);
          });
          frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && !n.classList.contains('word')) walk(n);
    });
  };
  walk(el);
}
$$('.script-title,.hello,.brush-sm,.script-sub,.logo').forEach(splitLetters);