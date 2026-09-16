const gardenScreen=document.querySelector('#garden-screen');
const voidScreen=document.querySelector('#void-screen');
const gardenButton=document.querySelector('#show-garden');
const voidButton=document.querySelector('#show-void');
const modeButton=document.querySelector('#mode');
const themeMeta=document.querySelector('meta[name="theme-color"]');

function showScreen(isVoid){
  gardenScreen.hidden=isVoid;
  voidScreen.hidden=!isVoid;
  document.body.classList.toggle('void-mode',isVoid);
  gardenButton.setAttribute('aria-pressed',String(!isVoid));
  voidButton.setAttribute('aria-pressed',String(isVoid));
  modeButton.hidden=isVoid;
  themeMeta.content=isVoid?'#070b18':'#f5eee8';
  document.title=isVoid?'Rosie — Chạm vào vô hạn':'Rosie — Một vườn hồng mộng mơ';
  if(!isVoid) resize();
}
gardenButton.addEventListener('click',()=>showScreen(false));
voidButton.addEventListener('click',()=>showScreen(true));
document.querySelector('#return-garden').addEventListener('click',()=>{
  showScreen(false);
  gardenButton.focus();
});

document.querySelector('#expand-domain').addEventListener('click',event=>{
  const expanded=voidScreen.classList.toggle('domain-expanded');
  event.currentTarget.setAttribute('aria-pressed',String(expanded));
  document.querySelector('#domain-label').textContent=expanded?'Thu hồi lãnh địa':'Khai triển lãnh địa';
  document.querySelector('#domain-status').textContent=expanded?'Vô lượng không xứ — Chào mừng đến với vô hạn.':'Một cử chỉ. Một thế giới vô tận.';
});
document.querySelectorAll('[data-energy]').forEach(button=>{
  button.addEventListener('click',()=>{
    voidScreen.classList.toggle('energy-purple',button.dataset.energy==='purple');
    voidScreen.classList.toggle('energy-red',button.dataset.energy==='red');
    document.querySelectorAll('[data-energy]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  });
});
