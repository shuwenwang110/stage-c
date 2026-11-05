(() => {
  const config = {
    trailCount: 10,
    followEase: 0.075,
    starLayers: [
      { speed: 0.016, count: 90, size: 1.1 },
      { speed: 0.04, count: 70, size: 1.6 },
      { speed: 0.07, count: 42, size: 2.2 }
    ],
    ...(window.SpaceEffectsConfig || {})
  };

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let mouseX = targetX;
  let mouseY = targetY;

  document.addEventListener("mousemove", event => {
    targetX = event.clientX;
    targetY = event.clientY;
  });

  function makeElement(selector, tag, setup) {
    let element = document.querySelector(selector);
    if (!element) {
      element = document.createElement(tag);
      setup(element);
      document.body.prepend(element);
    }
    return element;
  }

  function setupStars() {
    const canvas = makeElement("#starsCanvas", "canvas", element => {
      element.id = "starsCanvas";
      element.setAttribute("aria-hidden", "true");
    });
    const ctx = canvas.getContext("2d");
    const layers = config.starLayers.map(layer => ({ ...layer, stars: [] }));

    function resize() {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    }

    function buildStars() {
      layers.forEach(layer => {
        layer.stars = Array.from({ length: layer.count }, () => ({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * layer.size + 0.25,
          twinkle: Math.random() * Math.PI * 2
        }));
      });
    }

    function draw() {
      mouseX += (targetX - mouseX) * config.followEase;
      mouseY += (targetY - mouseY) * config.followEase;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      layers.forEach(layer => {
        const offsetX = (mouseX - window.innerWidth / 2) * layer.speed;
        const offsetY = (mouseY - window.innerHeight / 2) * layer.speed;
        layer.stars.forEach(star => {
          const pulse = 0.58 + Math.sin(performance.now() * 0.0014 + star.twinkle) * 0.32;
          ctx.beginPath();
          ctx.arc(star.x + offsetX, star.y + offsetY, star.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${pulse})`;
          ctx.shadowBlur = 9;
          ctx.shadowColor = "rgba(255,255,255,0.8)";
          ctx.fill();
        });
      });

      requestAnimationFrame(draw);
    }

    resize();
    buildStars();
    draw();
    window.addEventListener("resize", () => {
      resize();
      buildStars();
    });
  }

  function setupCursor() {
    const cursor = makeElement(".cursor", "div", element => {
      element.className = "cursor";
      element.setAttribute("aria-hidden", "true");
    });
    const trails = Array.from({ length: config.trailCount }, () => {
      const element = document.createElement("div");
      element.className = "trail";
      element.setAttribute("aria-hidden", "true");
      document.body.appendChild(element);
      return { element, x: targetX, y: targetY };
    });

    document.addEventListener("mousemove", event => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
      trails[0].x = event.clientX;
      trails[0].y = event.clientY;
    });

    function animate() {
      for (let i = 1; i < trails.length; i += 1) {
        trails[i].x += (trails[i - 1].x - trails[i].x) * 0.48;
        trails[i].y += (trails[i - 1].y - trails[i].y) * 0.48;
      }

      trails.forEach((trail, index) => {
        const scale = 1 - index / config.trailCount;
        trail.element.style.width = `${11 * scale}px`;
        trail.element.style.height = `${11 * scale}px`;
        trail.element.style.opacity = `${0.86 * scale}`;
        trail.element.style.left = `${trail.x}px`;
        trail.element.style.top = `${trail.y}px`;
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  function setupFade() {
    const light = makeElement("#light", "div", element => {
      element.id = "light";
      element.setAttribute("aria-hidden", "true");
    });
    window.addEventListener("load", () => {
      setTimeout(() => {
        light.style.opacity = "0";
      }, 120);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setupFade();
      setupStars();
      setupCursor();
    });
  } else {
    setupFade();
    setupStars();
    setupCursor();
  }
})();
