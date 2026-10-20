// 작은 캔버스에만 픽셀 그림을 그립니다. 캔버스 안에는 글자를 넣지 않습니다.
(function () {
  const P = {};

  function makeCanvas(className) {
    const canvas = document.createElement('canvas');
    canvas.className = className || '';
    canvas.width = 128;
    canvas.height = 72;
    canvas.setAttribute('aria-hidden', 'true');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    return { canvas, ctx };
  }

  function block(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  function line(ctx, x, y, w, color) {
    block(ctx, x, y, w, 1, color);
  }

  function roomBase(ctx, room) {
    block(ctx, 0, 0, 128, 72, '#183433');
    block(ctx, 0, 0, 128, 22, room === 'restricted' ? '#1d2d32' : '#244745');
    block(ctx, 0, 22, 128, 50, room === 'restricted' ? '#344d4b' : '#47726b');
    line(ctx, 0, 21, 128, '#102524');
    for (let x = 0; x < 128; x += 16) {
      line(ctx, x, 24, 12, '#3b625d');
      line(ctx, x + 7, 36, 9, '#3b625d');
      line(ctx, x + 2, 50, 11, '#3b625d');
      line(ctx, x + 10, 64, 6, '#3b625d');
    }
    block(ctx, 0, 68, 128, 4, '#25413f');
    line(ctx, 0, 68, 128, '#69918a');
  }

  function drawObserve(ctx, t) {
    block(ctx, 7, 7, 31, 11, '#17282c');
    block(ctx, 9, 9, 27, 7, '#4b9690');
    block(ctx, 11, 11, 8, 3, '#77c8b3');
    block(ctx, 21, 10, 12, 1, '#a2ddc2');
    block(ctx, 21, 13, 9, 1, '#2b605e');
    block(ctx, 48, 7, 31, 11, '#17282c');
    block(ctx, 50, 9, 27, 7, '#39736f');
    block(ctx, 55, 10, 14, 2, '#7bc1ae');
    block(ctx, 50, 14, 8, 1, '#88d3b8');
    block(ctx, 12, 46, 42, 5, '#684e3d');
    block(ctx, 15, 42, 5, 4, '#8b6b50');
    block(ctx, 45, 42, 5, 4, '#8b6b50');
    line(ctx, 14, 52, 2, '#2b3635');
    line(ctx, 49, 52, 2, '#2b3635');
    block(ctx, 91, 9, 20, 2, '#6e9c91');
    block(ctx, 99, 10, 3, 18, '#46716d');
    block(ctx, 94, 28, 23, 2, '#2a4d4a');
    block(ctx, 98, 29, 14, 1, '#79a99c');
    const blink = Math.floor(t / 420) % 2;
    block(ctx, 114, 8, 2, 2, blink ? '#f0a63a' : '#6e847d');
  }

  function drawServer(ctx, t) {
    for (let r = 0; r < 4; r += 1) {
      const x = 8 + r * 27;
      block(ctx, x, 8, 22, 48, '#1b2b32');
      block(ctx, x + 2, 10, 18, 44, '#2c4148');
      line(ctx, x + 3, 17, 16, '#54706f');
      line(ctx, x + 3, 29, 16, '#54706f');
      line(ctx, x + 3, 41, 16, '#54706f');
      for (let k = 0; k < 3; k += 1) {
        const on = (Math.floor(t / (500 + r * 120 + k * 90)) + r + k) % 3 !== 0;
        block(ctx, x + 5 + k * 4, 13, 2, 2, on ? (k === 1 ? '#f0a63a' : '#70d6a3') : '#35504f');
        block(ctx, x + 5 + k * 4, 25, 2, 2, on ? '#70d6a3' : '#35504f');
        block(ctx, x + 5 + k * 4, 37, 2, 2, on ? '#70d6a3' : '#35504f');
      }
    }
    block(ctx, 101, 59, 16, 2, '#1a2b30');
    block(ctx, 104, 56, 10, 3, '#6f847d');
    block(ctx, 108, 54, 2, 2, '#b1c7a8');
  }

  function drawLab(ctx, t) {
    block(ctx, 7, 8, 26, 13, '#1d3034');
    block(ctx, 9, 10, 22, 9, '#5b8e86');
    block(ctx, 13, 12, 8, 3, '#a6dbc0');
    block(ctx, 25, 12, 4, 4, '#2e5754');
    block(ctx, 42, 43, 17, 14, '#9a7550');
    block(ctx, 45, 46, 11, 2, '#c19a69');
    line(ctx, 50, 49, 1, '#745039');
    block(ctx, 66, 35, 10, 22, '#7f9081');
    block(ctx, 69, 37, 5, 18, '#a8b5a0');
    block(ctx, 89, 48, 17, 9, '#9a7550');
    block(ctx, 93, 50, 9, 2, '#c19a69');
    block(ctx, 112, 47, 8, 10, '#7b543b');
    block(ctx, 109, 44, 15, 6, '#4f7a55');
    block(ctx, 112, 41, 9, 5, '#67985e');
    block(ctx, 115, 38, 3, 5, '#77a869');
    const pulse = Math.floor(t / 650) % 2;
    block(ctx, 80, 12, 2, 2, pulse ? '#f0a63a' : '#6e847d');
  }

  function drawRestricted(ctx, t) {
    block(ctx, 8, 7, 112, 12, '#203238');
    for (let x = 10; x < 118; x += 12) {
      block(ctx, x, 10, 8, 5, '#3e5a5c');
      line(ctx, x + 1, 11, 6, '#79928a');
    }
    block(ctx, 14, 31, 30, 28, '#2a3b40');
    block(ctx, 19, 36, 20, 18, '#152225');
    for (let x = 21; x < 39; x += 5) block(ctx, x, 36, 1, 18, '#8a9d91');
    block(ctx, 65, 33, 46, 24, '#455b58');
    block(ctx, 70, 38, 36, 15, '#2b3d40');
    line(ctx, 73, 42, 30, '#6d857d');
    line(ctx, 73, 47, 30, '#6d857d');
    const lamp = Math.floor(t / 500) % 2;
    block(ctx, 111, 25, 4, 3, lamp ? '#f0a63a' : '#8d6f41');
    for (let x = 11; x < 120; x += 14) {
      block(ctx, x, 62, 7, 1, '#9d8b5c');
    }
  }

  function lerp(a, b, amount) {
    return a + (b - a) * amount;
  }

  function walkPoint(room, seed, t) {
    const paths = {
      observe: [[18, 58], [54, 58], [82, 43], [106, 58], [18, 58]],
      server: [[18, 61], [42, 61], [70, 61], [98, 61], [18, 61]],
      lab: [[20, 61], [38, 61], [58, 61], [80, 61], [104, 61], [20, 61]],
      restricted: [[50, 61], [61, 61], [77, 61], [94, 61], [50, 61]],
    };
    const path = paths[room] || paths.observe;
    const speed = room === 'restricted' ? 0.00016 : 0.00022;
    const cycle = (t * speed + seed * 0.17) % (path.length - 1);
    const index = Math.floor(cycle);
    const local = cycle - index;
    const from = path[index];
    const to = path[index + 1];
    const eased = local < 0.5 ? local * 2 * local : 1 - ((1 - local) * 2) * ((1 - local) * 2) / 2;
    return { x: lerp(from[0], to[0], eased), y: lerp(from[1], to[1], eased), frame: Math.floor(t / 180 + seed) % 2, facing: to[0] >= from[0] ? 1 : -1 };
  }

  function drawYb(ctx, point, color, seed) {
    const x = Math.round(point.x);
    const y = Math.round(point.y);
    const bob = point.frame ? 0 : 1;
    block(ctx, x - 4, y + 5, 9, 2, 'rgba(12, 24, 26, .42)');
    block(ctx, x - 3, y - 10 - bob, 6, 6, color);
    block(ctx, x - 2, y - 11 - bob, 4, 1, '#e8f1dc');
    block(ctx, x - 2, y - 7 - bob, 1, 1, '#172429');
    block(ctx, x + 1, y - 7 - bob, 1, 1, '#172429');
    block(ctx, x - 5, y - 3 - bob, 10, 8, color);
    block(ctx, x - 6, y - 1 - bob, 1, 5, color);
    block(ctx, x + 5, y - 1 - bob, 1, 5, color);
    block(ctx, x - 3, y + 5 - bob, 2, 4, '#e8f1dc');
    block(ctx, x + 1, y + 5 - bob, 2, 4, '#e8f1dc');
    if (seed % 2 === 0) block(ctx, x + 4, y - 8 - bob, 2, 2, '#f0a63a');
  }

  function drawScreen(canvas, room, seed, now) {
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    roomBase(ctx, room);
    if (room === 'observe') drawObserve(ctx, now);
    if (room === 'server') drawServer(ctx, now);
    if (room === 'lab') drawLab(ctx, now);
    if (room === 'restricted') drawRestricted(ctx, now);
    const point = walkPoint(room, seed, now);
    drawYb(ctx, point, window.Play.data.ybs[seed].color, seed);
  }

  P.makeCanvas = makeCanvas;
  P.drawScreen = drawScreen;
  P.drawYb = drawYb;
  window.Play = window.Play || {};
  window.Play.pixel = P;
})();
