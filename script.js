const canvas=document.querySelector('#flowers'),ctx=canvas.getContext('2d');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let width=0,height=0,wind=!reduced,palette='red',night=false,time=0,last=0,bloomStart=-10000;
const colors={red:['#f46b68','#dc343f','#ac162e','#650d22'],peach:['#ffe1bd','#f5b293','#d77b73','#ae5267'],purple:['#e4d5f4','#c6aedc','#947cb7','#65527e']};
const stems=[{x:.34,y:.43,s:.75,r:-.22},{x:.66,y:.40,s:.80,r:.25},{x:.44,y:.31,s:1.03,r:-.12},{x:.57,y:.24,s:.96,r:.13},{x:.27,y:.54,s:.80,r:-.35},{x:.70,y:.57,s:.88,r:.33},{x:.52,y:.47,s:1.1,r:.04},{x:.40,y:.60,s:.88,r:-.19},{x:.62,y:.64,s:.83,r:.19}];
const particles=Array.from({length:28},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.5+.5,s:Math.random()*.3+.15,a:Math.random()*6}));
const sparks=[];
function resize(){const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
new ResizeObserver(resize).observe(canvas);
function path(points,fill){ctx.beginPath();for(const p of points){ctx[p[0]](...p.slice(1))}ctx.fillStyle=fill;ctx.fill()}
function leaf(x,y,dx,dy,size){
ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(dy,dx));
const length=Math.hypot(dx,dy),g=ctx.createLinearGradient(0,-size,length,size);
g.addColorStop(0,'#435f50');g.addColorStop(.5,'#779477');g.addColorStop(1,'#a9b795');
ctx.beginPath();ctx.moveTo(0,0);
for(let i=1;i<=20;i++){const u=i/20;ctx.lineTo(length*u,-Math.sin(Math.PI*u)*size*(i%2?.86:1))}
for(let i=19;i>=0;i--){const u=i/20;ctx.lineTo(length*u,Math.sin(Math.PI*u)*size*(i%2?.86:1))}
ctx.closePath();ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='#d3dfb866';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(length,0);
for(let i=1;i<6;i++){const u=i/7;for(const side of [-1,1]){ctx.moveTo(length*u,0);ctx.lineTo(length*(u+.12),side*Math.sin(Math.PI*(u+.12))*size*.8)}}
ctx.stroke();ctx.restore()}
function rose(c,index,growth){
// Staggered, cupped petals spiral inward to a tightly folded center.
const layers=[{r:49,n:7,w:35,h:32},{r:35,n:6,w:29,h:27},{r:23,n:5,w:22,h:21},{r:13,n:4,w:15,h:15},{r:6,n:3,w:9,h:10}];
ctx.save();ctx.scale(.82+.18*growth,.9*(.82+.18*growth));
ctx.fillStyle=c[3];ctx.beginPath();ctx.ellipse(0,0,52,50,0,0,Math.PI*2);ctx.fill();
layers.forEach((layer,level)=>{
for(let i=0;i<layer.n;i++){
const angle=i*Math.PI*2/layer.n+level*2.4+index*.37;
ctx.save();ctx.rotate(angle);ctx.translate(0,-layer.r*.65);
const g=ctx.createLinearGradient(0,-layer.h,5,layer.h*.8);
g.addColorStop(0,c[0]);g.addColorStop(.22,c[1]);g.addColorStop(.7,c[2]);g.addColorStop(1,c[3]);
const w=layer.w,h=layer.h;
path([['moveTo',0,h*.8],['bezierCurveTo',-w*.55,h*.5,-w*1.1,-h*.22,-w*.8,-h*.68],['bezierCurveTo',-w*.6,-h*1.1,-w*.15,-h*.95,0,-h*.83],['bezierCurveTo',w*.45,-h*1.1,w*.95,-h*.75,w*.91,-h*.28],['bezierCurveTo',w*.9,h*.2,w*.36,h*.62,0,h*.8]],g);
ctx.beginPath();ctx.moveTo(-w*.8,-h*.68);ctx.bezierCurveTo(-w*.5,-h*1.04,-w*.15,-h*.95,0,-h*.83);ctx.bezierCurveTo(w*.45,-h*1.1,w*.95,-h*.75,w*.91,-h*.28);ctx.strokeStyle=c[0]+'aa';ctx.lineWidth=1.1;ctx.stroke();ctx.restore();
}
});
ctx.beginPath();for(let i=0;i<=55;i++){const a=i*.16,r=4.5*(1-i/65),x=Math.cos(a)*r,y=Math.sin(a)*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.strokeStyle=c[3];ctx.lineWidth=1.6;ctx.stroke();ctx.restore();
}
function flower(f,index,t){const unit=Math.min(width/650,height/700),s=f.s*unit;let sway=wind?Math.sin(t*.0007+index*.85)*5*unit:0;const progress=Math.min(1,Math.max(0,(t-bloomStart-index*65)/1200));const growth=bloomStart<0?1:1-Math.pow(1-progress,3);const x=f.x*width+sway,y=height*(.88-(.88-f.y)*(.75+.25*growth)),baseX=width*(.50+(f.x-.5)*.21),baseY=height*.91;
ctx.beginPath();ctx.moveTo(baseX,baseY);ctx.bezierCurveTo(baseX+(x-baseX)*.4,height*.73,x-sway,y+80*s,x,y);const stem=ctx.createLinearGradient(x,y,baseX,baseY);stem.addColorStop(0,'#8d9c73');stem.addColorStop(1,'#617c60');ctx.strokeStyle=stem;ctx.lineWidth=4.5*s;ctx.lineCap='round';ctx.stroke();
leaf(baseX+(x-baseX)*.35,height*.79,(index%2?1:-1)*(65+index*3)*s,-(45+index*3)*s,23*s);if(index%2===0)leaf(baseX,height*.86,70*s,-65*s,24*s);
ctx.save();ctx.translate(x,y);ctx.rotate(f.r+(wind?Math.sin(t*.0007+index*.85)*.025:0));ctx.scale(s*(.83+.17*growth),s*(.83+.17*growth));const c=colors[palette];
rose(c,index,growth);ctx.restore()}
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
