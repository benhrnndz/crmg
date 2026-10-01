/* ══════════════════════════════════════════════
   1. PARTICLE CANVAS
══════════════════════════════════════════════ */
(function () {
  var canvas = document.getElementById('particleCanvas');
  var ctx    = canvas.getContext('2d');
  var W, H;
  var mouse  = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });
  document.addEventListener('mouseleave', function ()  { mouse.x = -9999;     mouse.y = -9999; });

  function Particle() { this.reset(); }
  Particle.prototype.reset = function () {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.36;
    this.vy = (Math.random() - 0.5) * 0.36;
    this.r  = Math.random() * 2.4 + 0.8;
    this.a  = Math.random() * 0.22 + 0.07;
  };
  Particle.prototype.update = function () {
    var dx = this.x - mouse.x;
    var dy = this.y - mouse.y;
    var d  = Math.sqrt(dx * dx + dy * dy);
    if (d < 110 && d > 0) {
      var force = (110 - d) / 110;
      this.vx  += (dx / d) * force * 0.22;
      this.vy  += (dy / d) * force * 0.22;
    }
    this.vx *= 0.975;
    this.vy *= 0.975;
    this.x  += this.vx;
    this.y  += this.vy;
    if (this.x < 0) this.x = W;
    if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H;
    if (this.y > H) this.y = 0;
  };
  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(200,16,46,' + this.a + ')';
    ctx.fill();
  };

  var COUNT = 55;
  var LINK  = 125;
  var pts   = [];
  for (var i = 0; i < COUNT; i++) pts.push(new Particle());

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < pts.length; i++) {
      pts[i].update();
      pts[i].draw();
      for (var j = i + 1; j < pts.length; j++) {
        var dx = pts[i].x - pts[j].x;
        var dy = pts[i].y - pts[j].y;
        var d  = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = 'rgba(200,16,46,' + ((1 - d / LINK) * 0.11) + ')';
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  })();
})();

/* ══════════════════════════════════════════════
   2. DRAWER TOGGLE LOGIC
══════════════════════════════════════════════ */
var drawer = document.getElementById('scholarshipDrawer');
var overlay = document.getElementById('drawerOverlay');
var closeBtn = document.getElementById('closeDrawer');
var openBtns = document.querySelectorAll('.open-drawer-btn');

function openDrawer() {
  drawer.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
  if (applicants && applicants.length > 0) {
    animateCount(totalCountEl, applicants.length, 1200);
  }
}

function closeDrawer() {
  drawer.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = ''; // Restore scrolling
}

openBtns.forEach(function(btn) {
  btn.addEventListener('click', openDrawer);
});
closeBtn.addEventListener('click', closeDrawer);
overlay.addEventListener('click', closeDrawer);

/* ══════════════════════════════════════════════
   3. DATA LOADING + ANIMATED COUNTER
══════════════════════════════════════════════ */
var applicants     = [];
var resultsEl      = document.getElementById('results');
var inputEl        = document.getElementById('searchInput');
var clearBtn       = document.getElementById('clearButton');
var resultsCountEl = document.getElementById('resultsCount');
var totalCountEl   = document.getElementById('totalCount');

function animateCount(el, target, ms, suffix) {
  if (!el) return;
  suffix = suffix || '';
  var start = null;
  if (el._animId) cancelAnimationFrame(el._animId);

  function step(timestamp) {
    if (!start) start = timestamp;
    var progress = Math.min((timestamp - start) / ms, 1);
    // Linear: steady, constant speed ticking from start to finish
    var val = Math.floor(progress * target);
    el.textContent = val.toLocaleString() + suffix;
    if (progress < 1) {
      el._animId = requestAnimationFrame(step);
    } else {
      el.textContent = target.toLocaleString() + suffix;
      el._animId = null;
    }
  }
  el._animId = requestAnimationFrame(step);
}

var homeStatsAnimated = false;
function animateHomeStats() {
  if (homeStatsAnimated) return;
  var statEls = document.querySelectorAll('.stat-number');
  if (!statEls.length) return;
  homeStatsAnimated = true;
  statEls.forEach(function (el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    animateCount(el, target, 1600, suffix);
  });
}

fetch('applicants.json')
  .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
  .then(function (data) {
    applicants = Array.isArray(data) ? data : [];
    animateCount(totalCountEl, applicants.length, 1400);
    showEmptyState();
  })
  .catch(function () {
    totalCountEl.textContent = '0';
    resultsEl.innerHTML = '<div class="no-results">We could not load the applicant records. Please try again later.</div>';
    resultsCountEl.textContent = '0 matches';
  });

function formatName(p) {
  var first  = (p.first_name  || '').trim();
  var middle = (p.middle_name || '').trim();
  var last   = (p.last_name   || '').trim();
  var mi = middle
    ? middle.split(/\s+/).filter(Boolean).map(function (s) { return s.charAt(0).toUpperCase() + '.'; }).join(' ')
    : '';
  return last.toUpperCase() + ', ' + first + (mi ? ' ' + mi : '');
}

function showEmptyState() {
  resultsEl.innerHTML = '<div class="empty-state">Type at least 4 characters to search for an applicant.</div>';
  resultsCountEl.textContent = '0 matches';
}

function renderResults(list) {
  if (!list.length) {
    resultsEl.innerHTML = '<div class="no-results">No match found. Please check your spelling or try a different keyword.</div>';
    resultsCountEl.textContent = '0 matches';
    return;
  }
  resultsEl.innerHTML = list.slice(0, 50).map(function (person, i) {
    return '<div class="person-card" style="animation-delay:' + (i * 0.045) + 's">' +
      '<p class="person-name">' + formatName(person) + '</p>' +
      '<span class="badge">Qualified</span>' +
    '</div>';
  }).join('');
  attachCardTilt();
  resultsCountEl.textContent = list.length === 1 ? '1 match' : list.length + ' matches';
}

function attachCardTilt() {
  document.querySelectorAll('.person-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width  - 0.5;
      var y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform  = 'perspective(700px) rotateX(' + (-y * 5) + 'deg) rotateY(' + (x * 5) + 'deg) translateY(-3px)';
      card.style.boxShadow  = '0 8px 20px rgba(31,36,48,0.08), 0 0 0 1px rgba(200,16,46,0.13)';
      card.style.borderColor = 'rgba(200,16,46,0.18)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform  = '';
      card.style.boxShadow  = '';
      card.style.borderColor = '';
    });
  });
}

inputEl.addEventListener('input', function (e) {
  var query = e.target.value.trim();
  clearBtn.hidden = !query;

  if (!query || query.length < 4) { showEmptyState(); return; }

  var norm  = query.toLowerCase();
  var exact = applicants.filter(function (p) {
    return (p.student_num || '').trim().toLowerCase() === norm;
  });
  var filtered = exact.length ? exact : applicants.filter(function (p) {
    var name = ((p.first_name || '') + ' ' + (p.middle_name || '') + ' ' + (p.last_name || '')).toLowerCase();
    return name.includes(norm);
  });
  renderResults(filtered);
});

clearBtn.addEventListener('click', function () {
  inputEl.value   = '';
  clearBtn.hidden = true;
  showEmptyState();
  inputEl.focus();
});

/* ══════════════════════════════════════════════
   4. NAV TAB SWITCHING WITH RIPPLE
══════════════════════════════════════════════ */
var tabs  = document.querySelectorAll('.nav-tab');
var pages = document.querySelectorAll('.page');

pages.forEach(function (p) {
  if (!p.classList.contains('active')) p.style.display = 'none';
});

function switchPage(id) {
  var current = document.querySelector('.page.active');
  var target  = document.getElementById('page-' + id);
  if (!target || current === target) return;

  current.classList.remove('visible');
  setTimeout(function () {
    current.classList.remove('active');
    current.style.display = 'none';
    
    target.style.display = 'block';
    target.classList.add('active');
    
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        target.classList.add('visible');
        triggerReveal();
        if (id === 'home') animateHomeStats();
      });
    });
  }, 280);
}

tabs.forEach(function (tab) {
  tab.addEventListener('click', function (e) {
    var span = document.createElement('span');
    span.className = 'ripple';
    var r = this.getBoundingClientRect();
    span.style.left = (e.clientX - r.left) + 'px';
    span.style.top  = (e.clientY - r.top)  + 'px';
    this.appendChild(span);
    setTimeout(function () { span.remove(); }, 700);

    tabs.forEach(function (t) { t.classList.remove('active'); t.removeAttribute('aria-current'); });
    this.classList.add('active');
    this.setAttribute('aria-current', 'page');

    switchPage(this.dataset.page);
  });
});

/* ══════════════════════════════════════════════
   5. SCROLL REVEAL (Intersection Observer)
══════════════════════════════════════════════ */
var revealObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      if (entry.target.classList.contains('stats-row') || entry.target.querySelector('.stat-number')) {
        animateHomeStats();
      }
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

function triggerReveal() {
  var idx = 0;
  document.querySelectorAll('.page.active .reveal:not(.in-view)').forEach(function (el) {
    el.style.transitionDelay = (idx * 0.1) + 's';
    revealObs.observe(el);
    idx++;
  });
}

triggerReveal();
setTimeout(animateHomeStats, 250);

/* ══════════════════════════════════════════════
   6. FAQ ACCORDION
══════════════════════════════════════════════ */
document.querySelectorAll('.faq-question').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var body   = this.nextElementSibling;
    var isOpen = this.getAttribute('aria-expanded') === 'true';

    document.querySelectorAll('.faq-question[aria-expanded="true"]').forEach(function (q) {
      q.setAttribute('aria-expanded', 'false');
      q.nextElementSibling.classList.remove('open');
    });

    if (!isOpen) {
      this.setAttribute('aria-expanded', 'true');
      body.classList.add('open');
    }
  });
});
