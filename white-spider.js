(() => {
  let sketchInstance = null;
  let clearTrail = null;
  const mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    px: window.innerWidth / 2,
    py: window.innerHeight / 2,
    moved: false
  };

  document.addEventListener("mousemove", event => {
    mouse.px = mouse.x;
    mouse.py = mouse.y;
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    mouse.moved = true;
  });

  function initWhiteSpider() {
    if (sketchInstance || !window.p5) return;

    sketchInstance = new p5(p => {
      let trail = [];

      p.setup = function () {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.id("whiteSpiderCanvas");
        p.noCursor();
        p.clear();
      };

      p.draw = function () {
        p.clear();
        const speed = p.dist(mouse.x, mouse.y, mouse.px, mouse.py);

        if (mouse.moved && speed > 0.5 && p.random() < 0.7) {
          trail.push({
            x: mouse.x + p.random(-10, 10),
            y: mouse.y + p.random(-10, 10),
            size: p.random(6, 14),
            alpha: 255
          });
        }
        mouse.moved = false;

        if (trail.length > 80) {
          trail.shift();
        }

        p.strokeWeight(0.8);
        for (let i = 1; i < trail.length; i += 1) {
          const previous = trail[i - 1];
          const current = trail[i];
          p.stroke(255, p.min(previous.alpha, current.alpha) * 0.5);
          p.line(previous.x, previous.y, current.x, current.y);
        }

        p.noStroke();
        trail.forEach(point => {
          p.fill(255, point.alpha);
          p.ellipse(point.x, point.y, point.size, point.size);
          point.alpha -= 4;
        });

        trail = trail.filter(point => point.alpha > 0);
      };

      p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        p.clear();
      };

      clearTrail = function () {
        trail = [];
        p.clear();
      };
    });
  }

  function init() {
    initWhiteSpider();
    document.body.classList.add("white-spider-mode");
    window.WhiteSpiderCursor = {
      clear: () => clearTrail?.()
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
