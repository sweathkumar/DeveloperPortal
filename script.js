// Fixed: + and % now always show correctly at the end
  const statNumbers = document.querySelectorAll('.stat-number');

  const startCountUp = (el) => {
    // Reset display
    el.innerHTML = '<span class="number">0</span><span class="suffix"></span>';

    const targetStr = el.getAttribute('data-target');
    const isPercent = targetStr.includes('%');
    const isPlus = targetStr.includes('+') && !isPercent;

    const target = parseFloat(targetStr);
    const suffix = isPercent ? '%' : (isPlus ? '+' : '');

    // Update suffix immediately
    el.querySelector('.suffix').textContent = suffix;

    let start = 0;
    const duration = 2200;
    const increment = target / (duration / 16);

    const numberEl = el.querySelector('.number');

    const timer = setInterval(() => {
      start += increment;

      if (start >= target) {
        if (Number.isInteger(target)) {
          numberEl.textContent = target;
        } else {
          numberEl.textContent = target.toFixed(1);
        }
        clearInterval(timer);
      } else {
        if (Number.isInteger(target)) {
          numberEl.textContent = Math.floor(start);
        } else {
          numberEl.textContent = start.toFixed(1);
        }
      }
    }, 16);
  };

  // Trigger every time section enters viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNumbers.forEach(num => {
          setTimeout(() => startCountUp(num), 100);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  }