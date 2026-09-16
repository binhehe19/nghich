const canvas=document.querySelector('#flowers'),ctx=canvas.getContext('2d');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let width=0,height=0,wind=!reduced,palette='pink',night=false,time=0,last=0,bloomStart=-10000;
const colors={pink:['#f8c5ce','#e89aae','#c26587','#8f3d64'],peach:['#ffe1bd','#f5b293','#d77b73','#ae5267'],purple:['#e4d5f4','#c6aedc','#947cb7','#65527e']};
const stems=[{x:.34,y:.43,s:.75,r:-.22},{x:.66,y:.40,s:.80,r:.25},{x:.44,y:.31,s:1.03,r:-.12},{x:.57,y:.24,s:.96,r:.13},{x:.27,y:.54,s:.80,r:-.35},{x:.70,y:.57,s:.88,r:.33},{x:.52,y:.47,s:1.1,r:.04},{x:.40,y:.60,s:.88,r:-.19},{x:.62,y:.64,s:.83,r:.19}];
const particles=Array.from({length:28},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.5+.5,s:Math.random()*.3+.15,a:Math.random()*6}));
const sparks=[];
function resize(){const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
new ResizeObserver(resize).observe(canvas);
function path(points,fill){ctx.beginPath();for(const p of points){ctx[p[0]](...p.slice(1))}ctx.fillStyle=fill;ctx.fill()}
function leaf(x,y,dx,dy,size){let gradient=ctx.createLinearGradient(x,y,x+dx,y+dy);gradient.addColorStop(0,'#526e58');gradient.addColorStop(.48,'#8da185');gradient.addColorStop(1,'#c2c4a3');path([['moveTo',x,y],['bezierCurveTo',x+dx*.12-size,y+dy*.35,x+dx*.8-size,y+dy*.9,x+dx,y+dy],['bezierCurveTo',x+dx*.75+size*.25,y+dy*.65,x+size*.4,y+dy*.12,x,y]],gradient);ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+dx*.5,y+dy*.55,x+dx,y+dy);ctx.strokeStyle='#d3d8b14d';ctx.lineWidth=.7;ctx.stroke()}
function flower(f,index,t){const unit=Math.min(width/650,height/700),s=f.s*unit;let sway=wind?Math.sin(t*.0007+index*.85)*5*unit:0;const progress=Math.min(1,Math.max(0,(t-bloomStart-index*65)/1200));const growth=bloomStart<0?1:1-Math.pow(1-progress,3);const x=f.x*width+sway,y=height*(.88-(.88-f.y)*(.75+.25*growth)),baseX=width*(.50+(f.x-.5)*.21),baseY=height*.91;
ctx.beginPath();ctx.moveTo(baseX,baseY);ctx.bezierCurveTo(baseX+(x-baseX)*.4,height*.73,x-sway,y+80*s,x,y);const stem=ctx.createLinearGradient(x,y,baseX,baseY);stem.addColorStop(0,'#8d9c73');stem.addColorStop(1,'#617c60');ctx.strokeStyle=stem;ctx.lineWidth=4.5*s;ctx.lineCap='round';ctx.stroke();
leaf(baseX+(x-baseX)*.35,height*.79,(index%2?1:-1)*(55+index*3)*s,-(115+index*7)*s,19*s);if(index%2===0)leaf(baseX,height*.86,80*s,-165*s,22*s);
ctx.save();ctx.translate(x,y);ctx.rotate(f.r+(wind?Math.sin(t*.0007+index*.85)*.025:0));ctx.scale(s*(.83+.17*growth),s*(.83+.17*growth));const c=colors[palette];
let g=ctx.createLinearGradient(-40,-60,35,48);g.addColorStop(0,c[0]);g.addColorStop(.45,c[1]);g.addColorStop(1,c[3]);
path([['moveTo',-38,-28],['bezierCurveTo',-38,-65,-16,-74,-7,-55],['bezierCurveTo',5,-86,25,-75,30,-49],['bezierCurveTo',54,-65,55,-28,44,9],['bezierCurveTo',33,48,5,63,-20,39],['bezierCurveTo',-40,20,-47,-8,-38,-28]],g);
g=ctx.createLinearGradient(-44,-20,24,44);g.addColorStop(0,c[0]);g.addColorStop(.4,c[1]);g.addColorStop(1,c[2]);path([['moveTo',-44,-48],['bezierCurveTo',-25,-52,7,-22,18,12],['bezierCurveTo',25,35,11,50,0,49],['bezierCurveTo',-35,45,-49,9,-44,-48]],g);
g=ctx.createLinearGradient(-5,-35,42,30);g.addColorStop(0,c[0]);g.addColorStop(.48,c[1]);g.addColorStop(1,c[2]);path([['moveTo',44,-55],['bezierCurveTo',48,-13,46,34,6,49],['bezierCurveTo',-10,51,-16,28,-8,6],['bezierCurveTo',1,-20,23,-43,44,-55]],g);
ctx.strokeStyle=c[0]+'50';ctx.lineWidth=.7;for(let j=0;j<5;j++){ctx.beginPath();ctx.moveTo(39-j*5,-43+j*4);ctx.quadraticCurveTo(20-j*5,8,5,42);ctx.stroke()}ctx.restore()}
function draw(t){const delta=Math.min(t-last,40);last=t;time=t;ctx.clearRect(0,0,width,height);for(let i=0;i<stems.length;i++)flower(stems[i],i,t);
for(const p of particles){if(wind)p.y-=delta*.000015*p.s;if(p.y<.08)p.y=.88;let x=p.x*width+(wind?Math.sin(t*.0004+p.a)*12:0),y=p.y*height;ctx.globalAlpha=.3+(Math.sin(t*.001+p.a)+1)*.22;ctx.fillStyle=night?'#f9d8ed':'#fffdf1';ctx.shadowColor=night?'#ffd7fa':'#fff';ctx.shadowBlur=8;ctx.beginPath();ctx.arc(x,y,p.r,0,Math.PI*2);ctx.fill()}ctx.shadowBlur=0;ctx.globalAlpha=1;
for(let i=sparks.length-1;i>=0;i--){const p=sparks[i];p.life-=delta*.0007;if(p.life<=0){sparks.splice(i,1);continue}p.x+=p.vx*delta*.04;p.y+=p.vy*delta*.04;ctx.globalAlpha=p.life;ctx.fillStyle=colors[palette][1];ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.life*4);ctx.beginPath();ctx.ellipse(0,0,p.size,p.size*.45,0,0,Math.PI*2);ctx.fill();ctx.restore()}ctx.globalAlpha=1;requestAnimationFrame(draw)}
requestAnimationFrame(draw);
let toastTimer;function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3500)}
function burst(x,y){if(reduced)return;for(let i=0;i<26;i++)sparks.push({x,y,vx:(Math.random()-.5)*4,vy:-Math.random()*3-.3,size:Math.random()*4+2,life:1})}
const wishes=['Mong những điều dịu dàng sẽ tìm đến bạn. ✧','Điều ước đã được gửi vào một cánh hoa. ✧','Chúc bạn một ngày đủ nắng, đủ bình yên. ✧','Cứ chậm thôi, hoa vẫn sẽ nở. ✧'];let wishIndex=0;
function makeWish(x,y){burst(x,y);toast(wishes[wishIndex++%wishes.length])}
canvas.addEventListener('click',e=>{const r=canvas.getBoundingClientRect();makeWish(e.clientX-r.left,e.clientY-r.top)});
document.querySelector('#wish').addEventListener('click',()=>makeWish(width*.65,height*.45));
document.querySelector('#bloom').addEventListener('click',()=>{bloomStart=reduced?-10000:time;burst(width*.5,height*.45);toast('Một khu vườn nhỏ vừa thức dậy vì bạn. ✿')});
document.querySelector('#mode').addEventListener('click',()=>{night=!night;document.body.classList.toggle('night',night);document.querySelector('#mode-icon').textContent=night?'☾':'☼';document.querySelector('#mode-label').textContent=night?'Mộng đêm':'Ban mai';document.querySelector('#mode').setAttribute('aria-label',night?'Chuyển sang chế độ ban mai':'Chuyển sang chế độ mộng đêm')});
document.querySelectorAll('.swatch').forEach(b=>b.addEventListener('click',()=>{palette=b.dataset.palette;document.querySelectorAll('.swatch').forEach(s=>{s.classList.toggle('active',s===b);s.setAttribute('aria-pressed',String(s===b))});document.querySelector('#palette-name').textContent=b.getAttribute('aria-label');burst(width*.5,height*.4)}));
function updateWind(){document.querySelector('#wind').setAttribute('aria-pressed',String(wind));document.querySelector('#wind-label').textContent=wind?'Đang nhẹ nhàng thổi':'Một thoáng lặng yên';document.querySelector('.wind-dot').style.opacity=wind?'1':'.3'}
document.querySelector('#wind').addEventListener('click',()=>{wind=!wind;updateWind()});updateWind();
