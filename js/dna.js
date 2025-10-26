    // show year
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // mobile menu toggle
    document.getElementById('menu-btn').addEventListener('click', () => {
      document.getElementById('mobile-menu').classList.toggle('hidden');
    });

    /* ---------- DNA particle animation (exact look kept; canvas now full-screen) ---------- */
    const canvas = document.getElementById('dna-bg');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 60;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = 2 + Math.random() * 2;
        this.speedX = (Math.random() - 0.5) * 1;
        this.speedY = (Math.random() - 0.5) * 1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(173, 216, 230, 0.7)';
        ctx.fill();
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        this.draw();
      }
    }

    function connectParticles() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x;
          let dy = particles[a].y - particles[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(173, 216, 230, 0.2)';
            ctx.lineWidth = 1;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => p.update());
      connectParticles();
      requestAnimationFrame(animate);
    }

    initParticles();
    animate();

    /* ---------- Fade-in on scroll: IntersectionObserver ---------- */
    const options = { threshold: 0.18, root: null, rootMargin: '0px 0px -10% 0px' };
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          // we allow fade-out when leaving viewport so repeated clicks show effect again
          entry.target.classList.remove('visible');
        }
      });
    }, options);

    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => io.observe(el));

    /* ---------- Smooth scroll + ensure fade plays on click ---------- */
    function handleNavClick(e){
      // only handle internal anchors
      const href = this.getAttribute('href');
      if (!href || href.indexOf('#') !== 0) return; // allow external links (CV etc.)
      e.preventDefault();
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      // Remove visible from target and its fade children to force re-play
      target.classList.remove('visible');
      target.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(ch => ch.classList.remove('visible'));

      // Scroll smoothly to section (account for fixed header height)
      const headerOffset = document.querySelector('header').offsetHeight || 72;
      const rect = target.getBoundingClientRect();
      const absoluteY = window.scrollY + rect.top - headerOffset - 18; // small top gap
      window.scrollTo({ top: absoluteY, behavior: 'smooth' });

      // Guarantee the fade-in plays after scroll finishes (approx)
      // Use a timeout tuned for typical viewport height and smooth scroll speed.
      // This is client-side animation scheduling (safe & expected).
      const timeout = 600; // ms — quick and smooth
      setTimeout(() => {
        // add visible to the section and its child animated parts
        target.classList.add('visible');
        target.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(ch => ch.classList.add('visible'));
      }, timeout);
    }

    // Attach handler to header nav links and mobile links
    document.querySelectorAll('a.nav-link').forEach(a => a.addEventListener('click', handleNavClick));
    document.querySelectorAll('#mobile-menu a.nav-link').forEach(a => a.addEventListener('click', (e) => {
      // also close mobile menu
      document.getElementById('mobile-menu').classList.add('hidden');
      handleNavClick.call(a, e);
    }));

    // Adjust body padding-top to header height (when JS runs)
    function adjustBodyPadding(){
      const h = document.querySelector('header').offsetHeight || 72;
      document.body.style.paddingTop = h + 'px';
    }
    adjustBodyPadding();
    window.addEventListener('resize', adjustBodyPadding);

    // If IntersectionObserver is not supported, make everything visible as fallback
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => el.classList.add('visible'));
    }