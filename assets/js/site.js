/* Endow Crafts — site behaviour.
   Content lives in the _data folder and is edited in Pages CMS; nothing here needs changing for content updates. */
(function(){
"use strict";
const SETTINGS = JSON.parse(document.getElementById('site-settings').textContent || '{}');
const GALLERY = JSON.parse(document.getElementById('portfolio-data').textContent || '[]');
const WA = String(SETTINGS.whatsapp || '').replace(/\D/g, '');
const CATEGORIES = [["all","All"],["personal","Personalized Gifts"],["corporate","Corporate"],["events","Events & Parties"],["cricut","Cricut Creations"],["seasonal","Seasonal"],["qatar","Qatar Collection"],["kids","Kids & School"]];
const catName = Object.fromEntries(CATEGORIES);
const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const smooth = () => reduce() ? 'auto' : 'smooth';

/* ---------- Illustrated placeholders (used until a real photo is uploaded) ---------- */
const SERIF = "Didot,'Bodoni 72','Bodoni MT',Georgia,serif";
const TONES = {
  sand:{bg:['#EFE6D8','#DCCBB3'],p:'#FBF8F2',s:'#D9CBB6',i:'#3A3530',a:'#A8704A'},
  teal:{bg:['#DDE7E4','#B5C9C5'],p:'#F8F6F1',s:'#C4D3CF',i:'#26403F',a:'#3E6B6A'},
  graphite:{bg:['#41464B','#25292D'],p:'#EDE6DA',s:'#BFB6A8',i:'#17191B',a:'#C9A77C',lbl:'#EDE6DA'},
  blush:{bg:['#F2E5DE','#E0C6BA'],p:'#FFFBF7',s:'#E6D1C6',i:'#5E4038',a:'#B47A62'},
  maroon:{bg:['#EFE6E1','#D7C3BA'],p:'#FBF8F4',s:'#E2D3CB',i:'#4A1A24',a:'#8A1538'},
  sage:{bg:['#E6E9DF','#C8D0BC'],p:'#FAF9F4',s:'#D5DBCB',i:'#37412F',a:'#6C7C5A'},
  champagne:{bg:['#F4EDE1','#E2D0B2'],p:'#FFFDF8',s:'#E9DCC6',i:'#43382B',a:'#B08D55'}
};
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const SHAPES = {
  mug:(t,w)=>`<path d="M68 -122 c52 0 52 78 0 78" fill="none" stroke="${t.s}" stroke-width="15"/>
    <rect x="-72" y="-160" width="144" height="160" rx="16" fill="${t.p}"/>
    <rect x="-66" y="-150" width="18" height="140" rx="9" fill="#fff" opacity=".45"/>
    <ellipse cx="0" cy="-160" rx="72" ry="9" fill="${t.s}"/>
    <text x="0" y="-62" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="64" fill="${t.a}">${esc(w||'A')}</text>
    <rect x="-26" y="-44" width="52" height="2" fill="${t.a}" opacity=".6"/>`,
  tumbler:(t,w)=>`<rect x="12" y="-300" width="9" height="90" rx="4" fill="${t.a}"/>
    <path d="M-56 -212 H56 L44 0 H-44 Z" fill="${t.p}"/>
    <path d="M-50 -212 H-34 L-28 0 H-40 Z" fill="#fff" opacity=".45"/>
    <rect x="-62" y="-232" width="124" height="24" rx="8" fill="${t.s}"/>
    <text x="0" y="-100" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="30" fill="${t.i}">${esc(w||'Maryam')}</text>`,
  cups:(t)=>['Ali','Noor','Sara'].map((n,k)=>`<g transform="translate(${(k-1)*96} 0) scale(.66)">${SHAPES.tumbler({...t,a:[t.a,TONES.teal.a,TONES.sand.a][k]},n)}</g>`).join(''),
  box:(t,w)=>`<rect x="-92" y="-122" width="184" height="122" fill="${t.p}"/>
    <rect x="-92" y="-122" width="184" height="10" fill="#000" opacity=".06"/>
    <rect x="-100" y="-156" width="200" height="36" rx="3" fill="${t.p}" stroke="${t.s}" stroke-width="2"/>
    <rect x="-11" y="-156" width="22" height="156" fill="${t.a}"/>
    <ellipse cx="-26" cy="-166" rx="28" ry="13" fill="none" stroke="${t.a}" stroke-width="9" transform="rotate(-18 -26 -166)"/>
    <ellipse cx="26" cy="-166" rx="28" ry="13" fill="none" stroke="${t.a}" stroke-width="9" transform="rotate(18 26 -166)"/>
    <path d="M62 -120 l30 26" stroke="${t.s}" stroke-width="1.5"/>
    <g transform="rotate(12 104 -80)"><rect x="76" y="-96" width="60" height="30" rx="3" fill="${t.s}"/>
    <text x="106" y="-76" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="13" fill="${t.i}">${esc(w||'for you')}</text></g>`,
  shirt:(t,w)=>`<path d="M-62 -236 L-24 -250 Q0 -232 24 -250 L62 -236 L106 -192 L80 -164 L62 -180 L62 0 L-62 0 L-62 -180 L-80 -164 L-106 -192 Z" fill="${t.p}"/>
    <path d="M-24 -250 Q0 -232 24 -250" fill="none" stroke="${t.s}" stroke-width="5"/>
    <circle cx="0" cy="-140" r="38" fill="none" stroke="${t.a}" stroke-width="3"/>
    <text x="0" y="-134" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" letter-spacing="3" font-size="16" fill="${t.a}">${esc(w||'TEAM')}</text>`,
  cushion:(t,w)=>{const d="M-104 -208 Q0 -192 104 -208 Q92 -104 104 0 Q0 -14 -104 0 Q-92 -104 -104 -208Z";return `<path d="${d}" fill="${t.p}"/><path d="${d}" fill="none" stroke="${t.s}" stroke-width="4"/>
    <text x="0" y="-80" text-anchor="middle" font-family="${SERIF}" font-size="96" fill="${t.a}">${esc(w||'N')}</text>
    <text x="0" y="-48" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="16" fill="${t.i}">our home</text>`},
  crystal:(t)=>`<rect x="-80" y="-22" width="160" height="22" rx="2" fill="${t.i}"/>
    <path d="M-60 -22 V-190 L-32 -236 H32 L60 -190 V-22Z" fill="#fff" opacity=".6"/>
    <path d="M-60 -190 L-32 -236 H32 L60 -190Z" fill="#fff" opacity=".55"/>
    <path d="M24 -22 V-190 L60 -190 V-22Z" fill="${t.s}" opacity=".45"/>
    <path d="M-60 -22 V-190 L-32 -236 H32 L60 -190 V-22Z" fill="none" stroke="#fff" stroke-width="1.5"/>
    <circle cx="-18" cy="-148" r="18" fill="none" stroke="${t.i}" stroke-width="2" opacity=".75"/>
    <rect x="-48" y="-112" width="60" height="3" fill="${t.i}" opacity=".6"/>
    <rect x="-42" y="-100" width="48" height="2" fill="${t.i}" opacity=".45"/>
    <rect x="-46" y="-90" width="56" height="2" fill="${t.i}" opacity=".45"/>`,
  glass:(t)=>[[-48,-4,'S'],[48,4,'A']].map(([x,r,l])=>`<g transform="translate(${x} 0) rotate(${r})">
    <ellipse cx="0" cy="-6" rx="34" ry="6" fill="${t.s}"/><rect x="-3" y="-150" width="6" height="144" fill="#fff" opacity=".85"/>
    <path d="M-36 -250 Q-40 -160 0 -148 Q40 -160 36 -250 Z" fill="#fff" opacity=".55"/>
    <path d="M-33 -205 Q0 -195 33 -205 Q30 -160 0 -150 Q-30 -160 -33 -205Z" fill="${t.a}" opacity=".35"/>
    <path d="M-36 -250 Q-40 -160 0 -148 Q40 -160 36 -250 Z" fill="none" stroke="#fff" stroke-width="1.5"/>
    <text x="0" y="-222" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="20" fill="${t.i}">${l}</text></g>`).join(''),
  stickers:(t)=>{let g='';[-70,0,70].forEach((y,r)=>[-70,0,70].forEach((x,c)=>{const k=(r*3+c)%3,cy=y-125;
      g+= k===0?`<circle cx="${x}" cy="${cy}" r="27" fill="${t.a}"/><text x="${x}" y="${cy+6}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="18" fill="#fff">${'ABCDEFGHI'[r*3+c]}</text>`
        : k===1?`<rect x="${x-26}" y="${cy-20}" width="52" height="40" rx="9" fill="${t.s}" stroke="${t.i}" stroke-opacity=".3"/>`
        : `<circle cx="${x}" cy="${cy}" r="27" fill="none" stroke="${t.i}" stroke-width="1.5" stroke-dasharray="4 4"/>`;}));
    return `<g transform="rotate(-5)"><rect x="-112" y="-250" width="224" height="250" rx="10" fill="${t.p}"/>${g}</g>`},
  topper:(t,w)=>`<rect x="-118" y="-112" width="236" height="112" rx="8" fill="${t.p}"/>
    <path d="M-118 -104 ${'q19.67 26 39.33 0 '.repeat(6)}V-112 H-118Z" fill="${t.s}"/>
    <rect x="-80" y="-196" width="160" height="88" rx="8" fill="${t.p}"/>
    <rect x="-80" y="-196" width="160" height="12" rx="6" fill="${t.s}"/>
    <line x1="-40" y1="-196" x2="-40" y2="-238" stroke="${t.i}" stroke-width="2"/>
    <line x1="40" y1="-196" x2="40" y2="-238" stroke="${t.i}" stroke-width="2"/>
    <text x="0" y="-242" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="44" fill="${t.a}">${esc(w||'Happy 5th')}</text>`,
  bag:(t,w)=>`<path d="M-44 -212 Q-44 -268 0 -268 Q44 -268 44 -212" fill="none" stroke="${t.s}" stroke-width="8"/>
    <path d="M-86 -214 H86 L96 0 H-96Z" fill="${t.p}"/>
    <rect x="-86" y="-214" width="172" height="26" fill="${t.a}"/>
    <circle cx="0" cy="-110" r="42" fill="none" stroke="${t.a}" stroke-width="2"/>
    <text x="0" y="-102" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="24" fill="${t.i}">${esc(w||'Zayd')}</text>
    <text x="0" y="-44" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" letter-spacing="3" fill="${t.i}" opacity=".7">THANK YOU</text>`,
  tote:(t)=>{const b=[[-70,12,40],[-56,12,62],[12,14,80],[28,12,50],[42,10,92],[54,16,34]].map(([x,wd,h])=>`<rect x="${x}" y="${-62-h}" width="${wd}" height="${h}"/>`).join('');
    return `<path d="M-50 -226 Q-50 -290 0 -290 Q50 -290 50 -226" fill="none" stroke="${t.s}" stroke-width="7"/>
    <rect x="-98" y="-228" width="196" height="228" rx="4" fill="${t.p}"/>
    <g fill="${t.a}">${b}<path d="M-42 -62 V-160 Q-42 -196 -32 -202 Q-22 -196 -22 -160 V-62Z"/><path d="M-14 -62 L-8 -176 L-2 -186 L4 -176 L8 -62Z"/></g>
    <rect x="-72" y="-62" width="144" height="2" fill="${t.a}"/>
    <text x="0" y="-36" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" letter-spacing="6" fill="${t.i}">DOHA</text>`},
  dallah:(t)=>`<g transform="translate(-34 0)">
    <path d="M44 -66 Q98 -110 30 -146" fill="none" stroke="${t.a}" stroke-width="7" stroke-linecap="round"/>
    <path d="M-40 -100 Q-80 -140 -112 -186" fill="none" stroke="${t.a}" stroke-width="9" stroke-linecap="round"/>
    <path d="M-52 0 Q-74 -60 -38 -108 L-28 -150 H28 L38 -108 Q74 -60 52 0Z" fill="${t.a}"/>
    <path d="M-44 -4 Q-62 -60 -32 -106 L-26 -140 H-18 L-22 -106 Q-46 -60 -32 -4Z" fill="#fff" opacity=".25"/>
    <path d="M-32 -150 Q0 -196 32 -150Z" fill="${t.a}"/><rect x="-2" y="-196" width="4" height="22" fill="${t.a}"/><circle cx="0" cy="-200" r="8" fill="${t.a}"/></g>
    ${[70,122].map(x=>`<path d="M${x} 0 L${x-6} -38 H${x+38} L${x+32} 0Z" fill="${t.p}"/><ellipse cx="${x+16}" cy="-38" rx="22" ry="4" fill="${t.s}"/>`).join('')}`,
  notebook:(t,w)=>`<g transform="rotate(-6)"><rect x="-88" y="-250" width="176" height="250" rx="8" fill="${t.a}"/>
    <rect x="-88" y="-250" width="18" height="250" rx="6" fill="#000" opacity=".15"/>
    <rect x="-52" y="-182" width="116" height="62" rx="6" fill="${t.p}"/>
    <text x="6" y="-152" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="24" fill="${t.i}">${esc(w||'Layla')}</text>
    <rect x="-28" y="-144" width="68" height="1.5" fill="${t.i}" opacity=".4"/>
    <text x="6" y="-130" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" letter-spacing="2" fill="${t.i}">GRADE 3</text></g>
    <g transform="translate(112 -10) rotate(-78)"><rect x="0" y="-7" width="150" height="14" fill="${TONES.sand.a}"/><path d="M150 -7 L172 0 L150 7Z" fill="${t.p}"/><rect x="-12" y="-7" width="12" height="14" fill="${t.i}" opacity=".5"/></g>`,
  lantern:(t)=>`<circle cx="0" cy="-130" r="130" fill="#FFD98A" opacity=".16"/>
    <circle cx="0" cy="-292" r="10" fill="none" stroke="${t.a}" stroke-width="4"/>
    <path d="M-40 -238 Q0 -300 40 -238Z" fill="${t.a}"/>
    <rect x="-56" y="-242" width="112" height="16" rx="3" fill="${t.a}"/>
    <path d="M-50 -226 H50 L58 -60 H-58Z" fill="${t.a}"/>
    <path d="M-30 -80 V-170 Q0 -214 30 -170 V-80Z" fill="#FFE8B8"/>
    <ellipse cx="0" cy="-112" rx="14" ry="24" fill="#fff" opacity=".8"/>
    <rect x="-66" y="-60" width="132" height="16" rx="3" fill="${t.a}"/>
    <path d="M-54 -44 H54 L44 0 H-44Z" fill="${t.i}" opacity=".8"/>`,
  bunting:(t,w)=>{let p='';for(let k=0;k<8;k++){const x=-158+k*45.2,y=-300+25*(1-(x/190)**2);p+=`<path d="M${x-19} ${y} L${x+19} ${y} L${x} ${y+46}Z" fill="${k%2?t.p:t.a}"/>`;}
    return `<path d="M-190 -300 Q0 -250 190 -300" stroke="${t.i}" stroke-width="1.5" fill="none"/>${p}<g transform="translate(0 0) scale(.78)">${SHAPES.box(t,w)}</g>`},
  invite:(t)=>`<g transform="rotate(5)"><rect x="-112" y="-170" width="224" height="150" rx="4" fill="${t.s}"/><path d="M-112 -170 L0 -100 L112 -170" fill="none" stroke="${t.i}" stroke-opacity=".25" stroke-width="1.5"/></g>
    <g transform="rotate(-6)"><rect x="-80" y="-290" width="160" height="220" rx="3" fill="${t.p}"/>
    <rect x="-68" y="-278" width="136" height="196" fill="none" stroke="${t.a}" stroke-width="1"/>
    <text x="0" y="-238" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" letter-spacing="3" fill="${t.i}">SAVE THE DATE</text>
    <text x="0" y="-196" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="30" fill="${t.a}">Omar</text>
    <text x="0" y="-170" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="18" fill="${t.i}">&amp;</text>
    <text x="0" y="-140" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="30" fill="${t.a}">Hana</text>
    <rect x="-24" y="-116" width="48" height="1" fill="${t.i}" opacity=".4"/></g>
    <circle cx="74" cy="-50" r="20" fill="${t.a}"/><circle cx="74" cy="-50" r="13" fill="none" stroke="#fff" stroke-opacity=".5"/>`,
  kit:(t)=>`<g transform="translate(0 -150) skewX(-10)"><rect x="-110" y="-120" width="230" height="112" rx="6" fill="${t.a}"/>
    <text x="5" y="-56" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="30" fill="${t.p}">Welcome</text></g>
    <rect x="-122" y="-150" width="244" height="150" rx="6" fill="${t.a}"/>
    <rect x="-110" y="-140" width="220" height="130" rx="4" fill="${t.i}" opacity=".85"/>
    <rect x="-98" y="-132" width="104" height="114" rx="4" fill="${t.p}"/>
    <circle cx="-46" cy="-84" r="20" fill="none" stroke="${t.a}" stroke-width="2"/>
    <text x="-46" y="-80" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="9" letter-spacing="1.5" fill="${t.a}">LOGO</text>
    <rect x="20" y="-126" width="10" height="100" rx="5" fill="${t.s}"/>
    <rect x="42" y="-122" width="58" height="94" rx="4" fill="${t.s}"/>`
};
let artN = 0;
function art(spec){
  const [shape,tone='sand',hs='500',...rest] = spec.split(':');
  const word = rest.join(':'); const h = +hs || 500;
  const t = TONES[tone] || TONES.sand, id = 'g'+(++artN);
  const fy = Math.round(h*0.82), sc = Math.min(1.2, (h*0.7)/300).toFixed(3);
  const body = (SHAPES[shape]||SHAPES.box)(t, word);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 ${h}" width="400" height="${h}" preserveAspectRatio="xMidYMid slice">
<defs><linearGradient id="${id}" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="${t.bg[0]}"/><stop offset="1" stop-color="${t.bg[1]}"/></linearGradient>
<radialGradient id="${id}l" cx=".28" cy=".18" r=".85"><stop offset="0" stop-color="#fff" stop-opacity=".4"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
<rect width="400" height="${h}" fill="url(#${id})"/><rect y="${fy}" width="400" height="${h-fy}" fill="#000" opacity=".05"/>
<rect width="400" height="${h}" fill="url(#${id}l)"/>
<ellipse cx="200" cy="${fy}" rx="${Math.round(125*sc)}" ry="${Math.max(5,Math.round(10*sc))}" fill="#000" opacity=".13"/>
<g transform="translate(200 ${fy}) scale(${sc})">${body}</g>
<text x="18" y="${h-14}" font-family="Arial,sans-serif" font-size="${h<260?8:10}" letter-spacing="2.4" fill="${t.lbl||t.i}" opacity=".55">PHOTO PLACEHOLDER</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

document.querySelectorAll('img[data-art]').forEach(img => { if(!img.getAttribute('src')) img.src = art(img.dataset.art); });

/* ---------- WhatsApp & empty links ---------- */
const waLink = (msg) => `https://wa.me/${WA}` + (msg ? `?text=${encodeURIComponent(msg)}` : '');
document.querySelectorAll('.js-wa').forEach(a => a.href = waLink(SETTINGS.greeting || ''));
document.querySelectorAll('a[href="#"]').forEach(a => { a.removeAttribute('target'); a.title = 'Link coming soon'; a.addEventListener('click', e => e.preventDefault()); });

async function copyText(text, btn){
  try{ await navigator.clipboard.writeText(text); const o = btn.innerHTML; btn.textContent = 'Copied'; setTimeout(() => btn.innerHTML = o, 1600); }
  catch(e){ const t = btn.parentElement.querySelector('.val'); if(t){ const r = document.createRange(); r.selectNodeContents(t); const s = getSelection(); s.removeAllRanges(); s.addRange(r); } }
}
document.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', () => copyText(b.dataset.copy, b)));

/* ---------- Header, menu, back-to-top ---------- */
const header = document.querySelector('.site-header'), toTop = document.getElementById('toTop');
const onScroll = () => { header.classList.toggle('scrolled', scrollY > 8); toTop.hidden = scrollY < 700; };
addEventListener('scroll', onScroll, {passive:true}); onScroll();
toTop.addEventListener('click', () => scrollTo({top:0, behavior:smooth()}));
const menuBtn = document.getElementById('menuBtn');
function setMenu(open){ document.body.classList.toggle('menu-open', open); menuBtn.setAttribute('aria-expanded', open); menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); }
menuBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
document.querySelectorAll('#nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', e => { if(e.key === 'Escape') setMenu(false); });

function goContact(service, message){
  const sel = document.getElementById('c-service');
  if(service) [...sel.options].forEach(o => { if(o.text === service) sel.value = o.value || o.text; });
  if(message){ const m = document.getElementById('c-msg'); if(!m.value.trim()) m.value = message; }
  document.getElementById('contact').scrollIntoView({behavior:smooth()});
}
document.querySelectorAll('[data-service]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); goContact(a.dataset.service); }));

/* ---------- Exhibition filters ---------- */
const gal = document.getElementById('gallery'), filterBar = document.getElementById('filters');
filterBar.querySelectorAll('.filter').forEach(b => {
  const k = b.dataset.f, n = k === 'all' ? GALLERY.length : GALLERY.filter(g => (g.categories || []).includes(k)).length;
  if(k !== 'all' && n === 0) b.hidden = true;
  const s = document.createElement('span'); s.className = 'n'; s.textContent = n; b.appendChild(s);
});
function applyFilter(f){
  filterBar.querySelectorAll('.filter').forEach(b => b.setAttribute('aria-pressed', b.dataset.f === f));
  gal.classList.add('fading');
  setTimeout(() => { gal.querySelectorAll('.piece').forEach(p => p.hidden = !(f === 'all' || p.dataset.cats.split(' ').includes(f))); gal.classList.remove('fading'); }, 220);
}
filterBar.addEventListener('click', e => { const b = e.target.closest('.filter'); if(b) applyFilter(b.dataset.f); });
document.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', e => {
  e.preventDefault(); applyFilter(b.dataset.filter); document.getElementById('portfolio').scrollIntoView({behavior:smooth()});
}));

/* ---------- Lightbox ---------- */
const lb = document.getElementById('lb'); let lbIndex = 0, lastFocus = null;
const escHtml = s => String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const pieceEl = i => gal.querySelector(`.piece[data-i="${i}"]`);
const visible = () => [...gal.querySelectorAll('.piece:not([hidden])')].map(p => +p.dataset.i);
function fillLb(i){
  const g = GALLERY[i] || {}, el = pieceEl(i), no = el ? el.dataset.no : '';
  lbIndex = i;
  const img = document.getElementById('lbImg'), thumb = el && el.querySelector('img');
  img.src = thumb ? (thumb.currentSrc || thumb.src) : ''; img.alt = g.title || '';
  document.getElementById('lbCat').textContent = `No. ${no}` + ((g.categories||[]).length ? ' · ' + g.categories.map(c => catName[c] || c).join(' · ') : '');
  document.getElementById('lb-title').textContent = g.title || '';
  document.getElementById('lbDesc').textContent = g.description || '';
  document.getElementById('lbOpts').innerHTML = (g.options || []).map(o => `<span class="chip">${escHtml(o)}</span>`).join('');
  document.getElementById('lbOcc').textContent = g.occasion || '';
  document.getElementById('lbMed').textContent = g.materials || '';
  document.getElementById('lbWa').href = waLink(`Hello! I saw "${g.title}" (No. ${no}) on your website and would like something similar.`);
}
function openLb(i){ lastFocus = document.activeElement; fillLb(i); lb.hidden = false; document.body.style.overflow = 'hidden'; requestAnimationFrame(() => lb.classList.add('open')); document.getElementById('lbClose').focus(); }
function closeLb(){ lb.classList.remove('open'); document.body.style.overflow = ''; setTimeout(() => { lb.hidden = true; if(lastFocus) lastFocus.focus(); }, 200); }
function stepLb(d){ const v = visible(); const k = v.indexOf(lbIndex); fillLb(v[(k + d + v.length) % v.length]); }
gal.addEventListener('click', e => { const p = e.target.closest('.piece'); if(p && e.target.closest('button')) openLb(+p.dataset.i); });
document.getElementById('lbClose').addEventListener('click', closeLb);
document.getElementById('lbPrev').addEventListener('click', () => stepLb(-1));
document.getElementById('lbNext').addEventListener('click', () => stepLb(1));
lb.addEventListener('click', e => { if(e.target === lb) closeLb(); });
lb.addEventListener('keydown', e => {
  if(e.key === 'Escape') closeLb();
  if(e.key === 'ArrowRight') stepLb(1);
  if(e.key === 'ArrowLeft') stepLb(-1);
  if(e.key === 'Tab'){ const f = [...lb.querySelectorAll('button,a[href]')]; const first = f[0], last = f[f.length-1];
    if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); } }
});
document.getElementById('lbReq').addEventListener('click', () => {
  const g = GALLERY[lbIndex] || {}, c = g.categories || [], no = (pieceEl(lbIndex) || {dataset:{}}).dataset.no; closeLb();
  const svc = c.includes('corporate') ? 'Corporate Gifting' : c.includes('events') ? 'Event & Party Favors' : c.includes('cricut') ? 'Cricut / Custom Crafting' : 'Personalized Gift';
  goContact(svc, `I'd like something similar to "${g.title}" (No. ${no}). `);
});

/* ---------- Forms: validation + WhatsApp hand-off ---------- */
const today = new Date(); today.setHours(0,0,0,0);
const iso = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
document.querySelectorAll('input[type="date"]').forEach(d => d.min = iso(today));
function validateField(el){
  const v = el.value.trim(); let msg = '';
  const label = el.closest('.field').querySelector('label').childNodes[0].textContent.trim().toLowerCase();
  if(el.required && !v) msg = el.tagName === 'SELECT' ? `Please choose a ${label}.` : `Please enter your ${label}.`;
  else if(v && el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = 'Enter an email like name@example.com.';
  else if(v && el.type === 'tel' && v.replace(/\D/g,'').length < 8) msg = 'Enter a phone number with at least 8 digits.';
  else if(v && el.type === 'number' && !(+v >= 1)) msg = 'Quantity should be 1 or more.';
  else if(v && el.type === 'date' && v < iso(today)) msg = 'Choose today or a future date.';
  const err = document.getElementById(el.id + '-err');
  if(err){ err.textContent = msg; el.setAttribute('aria-describedby', err.id); }
  el.setAttribute('aria-invalid', msg ? 'true' : 'false');
  return !msg;
}
document.querySelectorAll('.form').forEach(form => {
  form.querySelectorAll('input:not([type=file]),select,textarea').forEach(el => {
    el.addEventListener('blur', () => { if(el.value.trim() || el.getAttribute('aria-invalid') === 'true') validateField(el); });
    el.addEventListener('input', () => { if(el.getAttribute('aria-invalid') === 'true') validateField(el); });
  });
  const file = form.querySelector('input[type=file]');
  file.addEventListener('change', () => { const lbl = document.getElementById(file.id + '-lbl'); if(file.files[0]) lbl.innerHTML = `${escHtml(file.files[0].name)}<small>Attach this file in the WhatsApp chat after sending</small>`; });
  form.addEventListener('submit', e => handleSubmit(e, form));
});
/* To also receive enquiries by email, send new FormData(form) to a form service (e.g. Formspree) inside handleSubmit. */
function handleSubmit(e, form){
  e.preventDefault();
  const fields = [...form.querySelectorAll('input:not([type=file]),select,textarea')];
  if(!fields.map(validateField).every(Boolean)){ const bad = form.querySelector('[aria-invalid="true"]'); if(bad) bad.focus(); return; }
  const lines = fields.filter(f => f.value.trim()).map(f => `${f.name}: ${f.value.trim()}`);
  const file = form.querySelector('input[type=file]').files[0];
  if(file) lines.push(`Reference file: ${file.name} (attaching in chat)`);
  const text = `Hello! ${form.dataset.kind} from the website:\n\n` + lines.join('\n');
  const old = form.querySelector('.success'); if(old) old.remove();
  const box = document.createElement('div'); box.className = 'success'; box.setAttribute('role','status');
  box.innerHTML = `<h4>Your enquiry is ready to send</h4>
    <p>Open WhatsApp to send these details to our team${file ? ' — then attach your reference file in the chat' : ''}. Prefer email? Copy the details and send them to <b>${escHtml(SETTINGS.email)}</b>.</p>
    <div class="btn-row"><a class="btn btn-wa" href="${waLink(text)}" target="_blank" rel="noopener"><svg><use href="#i-wa"/></svg>Send on WhatsApp</a>
    <button class="btn btn-ghost" type="button">Copy details</button></div>`;
  form.querySelector('.form-actions').before(box);
  const cb = box.querySelector('button');
  cb.addEventListener('click', async () => { try{ await navigator.clipboard.writeText(text); cb.textContent = 'Copied'; }catch(err){ cb.textContent = 'Copy not available — use WhatsApp'; } });
  box.querySelector('a').focus();
}

/* ---------- Gentle reveal (content always visible) ---------- */
if(!reduce() && 'IntersectionObserver' in window){
  const io = new IntersectionObserver(es => es.forEach(en => { if(en.isIntersecting){ en.target.classList.remove('pre'); io.unobserve(en.target); } }), {rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.rv').forEach(el => { if(el.getBoundingClientRect().top > innerHeight){ el.classList.add('pre'); io.observe(el); } });
}
})();
