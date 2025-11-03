AOS.init({ duration: 900, once: true });

var heroSwiper = new Swiper('.swiper-container', {
  loop: true,
  pagination: { el: '.swiper-pagination', clickable: true },
  autoplay: { delay: 3000 },
});

function smoothScrollTo(hash) {
  const el = document.querySelector(hash);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.pageYOffset - 70;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

document.querySelectorAll('a[href^="#sec-"]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    smoothScrollTo(a.getAttribute('href'));
  });
});

const dots = Array.from(document.querySelectorAll('.page-dots a'));
const sections = Array.from(document.querySelectorAll('section.section'));
const map = new Map(sections.map((s,i) => [s.id, dots[i]]));

const io = new IntersectionObserver((entries) => {
  entries.forEach(ent => {
    if (ent.isIntersecting) {
      dots.forEach(d => d.classList.remove('active'));
      const dot = map.get(ent.target.id);
      dot && dot.classList.add('active');
    }
  });
}, { root: null, threshold: 0.5 });

sections.forEach(s => io.observe(s));

function pageTo(dir) {
  const y = window.scrollY;
  const order = sections.sort((a,b)=>a.offsetTop-b.offsetTop);
  let idx = order.findIndex(s => y + 100 < s.offsetTop + s.offsetHeight);
  if (idx < 0) idx = order.length - 1;
  const nextIdx = Math.min(order.length - 1, Math.max(0, idx + dir));
  smoothScrollTo('#' + order[nextIdx].id);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'PageDown') { e.preventDefault(); pageTo(+1); }
  if (e.key === 'PageUp')   { e.preventDefault(); pageTo(-1); }
});
