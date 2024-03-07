gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
  const slides = gsap.utils.toArray(".slide");
  const activeSlideImages = gsap.utils.toArray(".active-slide img");

  function getInitialTranslateZ(slide) {
    const style = window.getComputedStyle(slide);
    const matrix = style.transform.match(/matrix3d\((.+)\)/);
    if (matrix) {
      const values = matrix[1].split(", ");
      return parseFloat(values[14] || 0);
    }
    return 0;
  }

  function mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  slides.forEach((slide, index) => {
    const initialZ = getInitialTranslateZ(slide);

    ScrollTrigger.create({
      trigger: ".container",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const zIncrement = progress * 22500;
        const currentZ = initialZ + zIncrement;

        let opacity;

        if (currentZ > -2500) {
          opacity = mapRange(currentZ, -2500, 0, 0.5, 1);
        } else {
          opacity = mapRange(currentZ, -5000, -2500, 0, 0.5);
        }

        slide.style.opacity = opacity;

        slide.style.transform = `translateX(-50%) translateY(-50%) translateZ(${currentZ}px)`;

        if (currentZ < 100) {
          gsap.to(activeSlideImages[index], 1.5, {
            opacity: 1,
            ease: "power3.out",
          });
        } else {
          gsap.to(activeSlideImages[index], 1.5, {
            opacity: 0,
            ease: "power3.out",
          });
        }
      },
    });
  });
});

const c = document.querySelector("canvas");
const audio = document.querySelector("#audio");

let opt = {
  width: c.offsetWidth,
  height: c.offsetHeight,
  midY: c.offsetHeight / 2,
  points: 80,
  stretch: 10,
  sinHeight: 0,
  speed: -0.1,
  strokeColor: "rgb(195, 230, 40)",
  strokeWidth: 1.5,
  power: false,
};

c.width = opt.width * 2;
c.height = opt.height * 2;
c.style.width = opt.width;
c.style.height = opt.height;

const ctx = c.getContext("2d");
ctx.scale(2, 2);

ctx.strokeStyle = opt.strokeColor;
ctx.lineWidth = opt.strokeWidth;
ctx.lineCap = "round";
ctx.lineJoin = "round";

let time = 0;
const render = () => {
  window.requestAnimationFrame(render);
  ctx.clearRect(0, 0, opt.width, opt.height);
  time += 1;
  ctx.beginPath();
  let increment = 0;

  for (i = 0; i <= opt.points; i++) {
    if (i < opt.points / 2) {
      increment += 0.1;
    } else {
      increment += -0.1;
    }

    const x = (opt.width / opt.points) * i;
    const y =
      opt.midY +
      Math.sin(time * opt.speed + i / opt.stretch) * opt.sinHeight * increment;
    ctx.lineTo(x, y);
  }

  ctx.stroke();
};

render();

c.addEventListener("click", () => {
  opt.power = !opt.power;

  if (opt.power) {
    audio.play();
    TweenMax.to(opt, 1, {
      sinHeight: 4,
      stretch: 5,
      ease: Power2.easeInOut,
    });
  } else {
    audio.pause();
    TweenMax.to(opt, 1, {
      sinHeight: 0,
      stretch: 10,
      ease: Power3.easeOut,
    });
  }
});
