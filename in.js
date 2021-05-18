//lighting js

// ===========1st canvas=================

// helper functions
const PI2 = Math.PI * 2;
const random = (min, max) => Math.random() * (max - min + 1) + min | 0;
const timestamp = _ => new Date().getTime();

// container
class Birthday {
  constructor() {
    this.resize();

    // create a lovely place to store the firework
    this.fireworks = [];
    this.counter = 0;

  }
  
  resize() {
    this.width = canvas.width = window.innerWidth;
    let center = this.width / 2 | 0;
    this.spawnA = center - center / 4 | 0;
    this.spawnB = center + center / 4 | 0;
    
    this.height = canvas.height = window.innerHeight;
    this.spawnC = this.height * 0.1;
    this.spawnD = this.height * 0.5;
    
  }
  
  onClick(evt) {
     let x = evt.clientX || evt.touches && evt.touches[0].pageX;
     let y = evt.clientY || evt.touches && evt.touches[0].pageY;
     
     let count = random(3,5);
     for(let i = 0; i < count; i++) this.fireworks.push(new Firework(
        random(this.spawnA, this.spawnB),
        this.height,
        x,
        y,
        random(0, 260),
        random(30, 110)));
          
     this.counter = -1;
     
  }
  
  update(delta) {
    ctx.globalCompositeOperation = 'hard-light';
    ctx.fillStyle = `rgba(20,20,20,${ 7 * delta })`;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.globalCompositeOperation = 'lighter';
    for (let firework of this.fireworks) firework.update(delta);

    // if enough time passed... create new new firework
    this.counter += delta * 3; // each second
    if (this.counter >= 1) {
      this.fireworks.push(new Firework(
        random(this.spawnA, this.spawnB),
        this.height,
        random(0, this.width),
        random(this.spawnC, this.spawnD),
        random(0, 360),
        random(30, 110)));
      this.counter = 0;
    }

    // remove the dead fireworks
    if (this.fireworks.length > 1000) this.fireworks = this.fireworks.filter(firework => !firework.dead);

  }
}

class Firework {
  constructor(x, y, targetX, targetY, shade, offsprings) {
    this.dead = false;
    this.offsprings = offsprings;

    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;

    this.shade = shade;
    this.history = [];
  }
  update(delta) {
    if (this.dead) return;

    let xDiff = this.targetX - this.x;
    let yDiff = this.targetY - this.y;
    if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) { // is still moving
      this.x += xDiff * 2 * delta;
      this.y += yDiff * 2 * delta;

      this.history.push({
        x: this.x,
        y: this.y
      });

      if (this.history.length > 20) this.history.shift();

    } else {
      if (this.offsprings && !this.madeChilds) {
        
        let babies = this.offsprings / 2;
        for (let i = 0; i < babies; i++) {
          let targetX = this.x + this.offsprings * Math.cos(PI2 * i / babies) | 0;
          let targetY = this.y + this.offsprings * Math.sin(PI2 * i / babies) | 0;

          birthday.fireworks.push(new Firework(this.x, this.y, targetX, targetY, this.shade, 0));

        }

      }
      this.madeChilds = true;
      this.history.shift();
    }
    
    if (this.history.length === 0) this.dead = true;
    else if (this.offsprings) { 
        for (let i = 0; this.history.length > i; i++) {
          let point = this.history[i];
          ctx.beginPath();
          ctx.fillStyle = 'hsl(' + this.shade + ',100%,' + i + '%)';
          ctx.arc(point.x, point.y, 1, 0, PI2, false);
          ctx.fill();
        } 
      } else {
      ctx.beginPath();
      ctx.fillStyle = 'hsl(' + this.shade + ',100%,50%)';
      ctx.arc(this.x, this.y, 1, 0, PI2, false);
      ctx.fill();
    }

  }
}

let canvas = document.getElementById('birthday');
let ctx = canvas.getContext('2d');

let then = timestamp();

let birthday = new Birthday;
window.onresize = () => birthday.resize();
document.onclick = evt => birthday.onClick(evt);
document.ontouchstart = evt => birthday.onClick(evt)

  ;(function loop(){
  	requestAnimationFrame(loop);

  	let now = timestamp();
  	let delta = now - then;

    then = now;
    birthday.update(delta / 1000);

  })();

// ======================2nd canvas========================
// var c = document.getElementById("Canvas");
// var ctx = c.getContext("2d");

// var cwidth, cheight;
// var shells = [];
// var pass= [];

// var colors = ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'];

// window.onresize = function() { reset(); }
// reset();
// function reset() {

//   cwidth = window.innerWidth;
// 	cheight = window.innerHeight;
// 	c.width = cwidth;
// 	c.height = cheight;
// }

// function newShell() {

//   var left = (Math.random() > 0.5);
//   var shell = {};
//   shell.x = (1*left);
//   shell.y = 1;
//   shell.xoff = (0.01 + Math.random() * 0.007) * (left ? 1 : -1);
//   shell.yoff = 0.01 + Math.random() * 0.007;
//   shell.size = Math.random() * 6 + 3;
//   shell.color = colors[Math.floor(Math.random() * colors.length)];

//   shells.push(shell);
// }

// function newPass(shell) {

//   var pasCount = Math.ceil(Math.pow(shell.size, 2) * Math.PI);

//   for (i = 0; i < pasCount; i++) {

//     var pas = {};
//     pas.x = shell.x * cwidth;
//     pas.y = shell.y * cheight;

//     var a = Math.random() * 4;
//     var s = Math.random() * 10;

// 		pas.xoff = s *  Math.sin((5 - a) * (Math.PI / 2));
//   	pas.yoff = s *  Math.sin(a * (Math.PI / 2));

//     pas.color = shell.color;
//     pas.size = Math.sqrt(shell.size);

//     if (pass.length < 1000) { pass.push(pas); }
//   }
// }

// var lastRun = 0;
// Run();
// function Run() {

//   var dt = 1;
//   if (lastRun != 0) { dt = Math.min(50, (performance.now() - lastRun)); }
// 	lastRun = performance.now();

//   ctx.clearRect(0, 0, cwidth, cheight);
// 	ctx.fillStyle = "rgba(0,0,0,0.25)";
// 	ctx.fillRect(0, 0, cwidth, cheight);

//   if ((shells.length < 10) && (Math.random() > 0.96)) { newShell(); }

//   for (let ix in shells) {

//     var shell = shells[ix];

//     ctx.beginPath();
//     ctx.arc(shell.x * cwidth, shell.y * cheight, shell.size, 0, 2 * Math.PI);
//     ctx.fillStyle = shell.color;
//     ctx.fill();

//     shell.x -= shell.xoff;
//     shell.y -= shell.yoff;
//     shell.xoff -= (shell.xoff * dt * 0.001);
//     shell.yoff -= ((shell.yoff + 0.2) * dt * 0.00005);

//     if (shell.yoff < -0.005) {
//       newPass(shell);
//       shells.splice(ix, 1);
//     }
//   }

//   for (let ix in pass) {

//     var pas = pass[ix];

//     ctx.beginPath();
//     ctx.arc(pas.x, pas.y, pas.size, 0, 2 * Math.PI);
//     ctx.fillStyle = pas.color;
//     ctx.fill();

//     pas.x -= pas.xoff;
//     pas.y -= pas.yoff;
//     pas.xoff -= (pas.xoff * dt * 0.001);
//     pas.yoff -= ((pas.yoff + 5) * dt * 0.0005);
//     pas.size -= (dt * 0.002 * Math.random())

//     if ((pas.y > cheight)  || (pas.y < -50) || (pas.size <= 0)) {
//         pass.splice(ix, 1);
//     }
//   }
//   requestAnimationFrame(Run);
// }