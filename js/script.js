/* ============================================================================
   Edgar Ng · CV interactivo
   JavaScript sin dependencias. Todo es progresivo: sin JS la página se lee
   igual, en español, con el tema del sistema.
   ========================================================================= */

(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ── Idioma ─────────────────────────────────────────────────────────────
     El español vive en el HTML (bueno para SEO). El inglés viaja en los
     atributos data-en*. Al conmutar se intercambian y se guarda el original,
     de modo que volver a español no pierde nada. */

  var ATTRS = [
    { data: 'en',       prop: 'textContent' },
    { data: 'enAria',   attr: 'aria-label'  },
    { data: 'enTitle',  attr: 'title'       },
    { data: 'enAlt',    attr: 'alt'         },
    { data: 'enCaption',attr: 'data-caption'}
  ];

  function applyLang(lang) {
    var english = lang === 'en';

    ATTRS.forEach(function (spec) {
      var selector = '[data-' + spec.data.replace(/[A-Z]/g, function (m) {
        return '-' + m.toLowerCase();
      }) + ']';

      document.querySelectorAll(selector).forEach(function (el) {
        var store = spec.data + 'Es';
        var incoming = el.dataset[spec.data];

        // Guarda el español la primera vez que se toca el elemento.
        if (el.dataset[store] === undefined) {
          el.dataset[store] = spec.prop
            ? el.textContent.trim()
            : (el.getAttribute(spec.attr) || '');
        }

        var value = english ? incoming : el.dataset[store];
        if (spec.prop) el.textContent = value;
        else el.setAttribute(spec.attr, value);
      });
    });

    root.lang = english ? 'en' : 'es';

    var btn = document.getElementById('lang-toggle');
    if (btn) {
      // La etiqueta muestra el idioma AL QUE se cambia.
      btn.querySelector('span').textContent = english ? 'ES' : 'EN';
      btn.setAttribute('aria-label', english
        ? 'Ver esta página en español'
        : 'View this page in English');
    }

    try { localStorage.setItem('cv-lang', lang); } catch (e) {}
  }

  var langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      applyLang(root.lang === 'en' ? 'es' : 'en');
    });
  }

  // Restaura la preferencia guardada (el <head> ya fijó el atributo lang).
  var savedLang;
  try { savedLang = localStorage.getItem('cv-lang'); } catch (e) {}
  if (savedLang === 'en') applyLang('en');

  /* ── Tema claro / oscuro ───────────────────────────────────────────────── */

  function applyTheme(theme) {
    root.dataset.theme = theme;
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute('aria-pressed', String(theme === 'light'));
      btn.setAttribute('aria-label', theme === 'light'
        ? (root.lang === 'en' ? 'Switch to dark theme' : 'Cambiar a tema oscuro')
        : (root.lang === 'en' ? 'Switch to light theme' : 'Cambiar a tema claro'));
    }
    try { localStorage.setItem('cv-theme', theme); } catch (e) {}
  }

  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    applyTheme(root.dataset.theme || 'dark');
    themeBtn.addEventListener('click', function () {
      applyTheme(root.dataset.theme === 'light' ? 'dark' : 'light');
    });
  }

  // Sigue al sistema mientras el usuario no haya elegido explícitamente.
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
    var chosen;
    try { chosen = localStorage.getItem('cv-theme'); } catch (err) {}
    if (!chosen) applyTheme(e.matches ? 'light' : 'dark');
  });

  /* ── Impresión / descarga del CV ────────────────────────────────────────
     Sin PDF que mantener: la hoja @media print produce el documento. */

  ['print-btn', 'download-cv'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', function () { window.print(); });
  });

  /* ── Diálogos accesibles ────────────────────────────────────────────────
     Cada diálogo atrapa el foco, cierra con Escape o clic fuera, y devuelve
     el foco a quien lo abrió. */

  var FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function createDialog(id) {
    var overlay = document.getElementById(id);
    if (!overlay) return null;
    var opener = null;

    function trap(e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;

      var items = Array.prototype.filter.call(
        overlay.querySelectorAll(FOCUSABLE),
        function (el) { return el.offsetParent !== null; }
      );
      if (!items.length) return;

      var first = items[0];
      var last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }

    function open(trigger) {
      opener = trigger || document.activeElement;
      overlay.hidden = false;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', trap);
      var target = overlay.querySelector(FOCUSABLE);
      if (target) target.focus();
    }

    function close() {
      overlay.hidden = true;
      document.body.style.overflow = '';
      document.removeEventListener('keydown', trap);
      if (opener && typeof opener.focus === 'function') opener.focus();
      opener = null;
    }

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    overlay.querySelectorAll('.modal-close').forEach(function (btn) {
      btn.addEventListener('click', close);
    });

    return { open: open, close: close, el: overlay };
  }

  var contactDialog = createDialog('contact-modal');
  var openContact = document.getElementById('open-contact');
  if (contactDialog && openContact) {
    openContact.addEventListener('click', function () { contactDialog.open(openContact); });
  }

  var imageDialog = createDialog('image-modal');
  if (imageDialog) {
    var img = document.getElementById('modal-image');
    var titleEl = document.getElementById('image-modal-title');

    document.querySelectorAll('.cert-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var caption = btn.getAttribute('data-caption') || '';
        img.src = btn.getAttribute('data-image');
        img.alt = caption;
        titleEl.textContent = caption;
        imageDialog.open(btn);
      });
    });
  }

  /* ── Pestaña activa según la sección visible ────────────────────────────── */

  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var sections = tabs
    .map(function (t) { return document.querySelector(t.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        tabs.forEach(function (tab) {
          var active = tab.getAttribute('href') === '#' + entry.target.id;
          tab.classList.toggle('is-active', active);
          if (active) tab.setAttribute('aria-current', 'true');
          else tab.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ── Revelado al entrar en pantalla ─────────────────────────────────────── */

  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    var targets = document.querySelectorAll('.section > .card, .entry, .skill, .project');
    var reveal = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el) {
      el.classList.add('reveal');
      reveal.observe(el);
    });
  }

  /* ── Año del pie ────────────────────────────────────────────────────────── */

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ── Fondo de partículas ────────────────────────────────────────────────
     Se apaga con prefers-reduced-motion, cuando la pestaña no está visible y
     al imprimir. La densidad se limita para no castigar equipos modestos. */

  var canvas = document.getElementById('bg-canvas');
  if (canvas && !reduceMotion.matches) {
    var ctx = canvas.getContext('2d', { alpha: true });
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, particles = [], frame = null;

    function accent() {
      return getComputedStyle(root).getPropertyValue('--particle').trim() || '79, 227, 255';
    }
    var rgb = accent();

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var count = Math.min(70, Math.round(w * h / 22000));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          r: Math.random() * 1.4 + 0.6
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + rgb + ', 0.34)';
        ctx.fill();

        for (var j = i + 1; j < particles.length; j++) {
          var q = particles[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var d2 = dx * dx + dy * dy;
          if (d2 > 16900) continue;               // 130 px, sin raíz cuadrada
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(' + rgb + ', ' + (0.16 - d2 / 130000) + ')';
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
      frame = requestAnimationFrame(draw);
    }

    function start() { if (frame === null) frame = requestAnimationFrame(draw); }
    function stop() { if (frame !== null) { cancelAnimationFrame(frame); frame = null; } }

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 180);
    });

    // Ahorra batería cuando la pestaña queda en segundo plano.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    // El color de las partículas acompaña al tema.
    new MutationObserver(function () { rgb = accent(); })
      .observe(root, { attributes: true, attributeFilter: ['data-theme'] });

    resize();
    start();
  } else if (canvas) {
    canvas.remove();
  }
})();
