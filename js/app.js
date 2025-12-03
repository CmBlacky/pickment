'use strict';
let currentEditingColumn, currentColors = [], currentFont = "'Inter', sans-serif", darkModeEnabled = false;
let lockedColors = [false, false, false, false, false, false];
let rerollCoolingDown = false; const rerollCooldownMs = 1000;
const animatingCols = new Set();
let paletteReady = false;

// Treat mobile based on input capability / user agent, not viewport width
function isMobileDevice(){
  try{
    return (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }catch(e){ return false; }
}

function setUIEnabled(enabled) {
  const tab = document.getElementById('menuTab');
  const reroll = document.getElementById('rerollBtn');
  const mobileBtn = document.querySelector('.mobile-btn-roll');
  const items = document.querySelectorAll('.menu-item');
  [tab, reroll].forEach(el => { if (el) el.classList.toggle('disabled', !enabled); });
  if (mobileBtn) mobileBtn.classList.toggle('cooldown', !enabled);
  items.forEach(el => el.classList.toggle('disabled', !enabled));
}

const colorDatabase = {"#4100F5":"Klein Blue","#CDF564":"Citric","#9BF0E1":"Aquamarine","#F037A5":"Fuchsia","#FF4632":"Tangerine","#191414":"Black","#00D084":"Gradient","#FF0000":"Red","#00FF00":"Lime","#0000FF":"Blue","#FFFF00":"Yellow","#FF00FF":"Magenta","#00FFFF":"Cyan","#FFA500":"Orange","#800080":"Purple","#FFC0CB":"Pink","#A52A2A":"Brown","#808080":"Gray","#000000":"Black","#FFFFFF":"White","#FFD700":"Gold","#C0C0C0":"Silver","#4B0082":"Indigo","#EE82EE":"Violet","#F5DEB3":"Wheat","#8B4513":"Saddle Brown","#2F4F4F":"Dark Slate","#00CED1":"Dark Turquoise","#9400D3":"Dark Violet","#FF1493":"Deep Pink","#00BFFF":"Deep Sky","#696969":"Dim Gray","#1E90FF":"Dodger Blue","#B22222":"Fire Brick","#228B22":"Forest Green","#DCDCDC":"Gainsboro","#DAA520":"Goldenrod","#008000":"Green","#ADFF2F":"Green Yellow","#F0FFF0":"Honeydew","#FF69B4":"Hot Pink","#CD5C5C":"Indian Red","#FFFFF0":"Ivory","#F0E68C":"Khaki","#E6E6FA":"Lavender","#7CFC00":"Lawn Green","#FFFACD":"Lemon Chiffon","#ADD8E6":"Light Blue","#F08080":"Light Coral","#E0FFFF":"Light Cyan","#90EE90":"Light Green","#FFB6C1":"Light Pink","#FFA07A":"Light Salmon","#20B2AA":"Light Sea","#87CEFA":"Light Sky","#778899":"Light Slate","#B0C4DE":"Light Steel","#FFFFE0":"Light Yellow","#32CD32":"Lime Green","#FAF0E6":"Linen","#800000":"Maroon","#66CDAA":"Medium Aqua","#0000CD":"Medium Blue","#BA55D3":"Medium Orchid","#9370DB":"Medium Purple","#3CB371":"Medium Sea","#7B68EE":"Medium Slate","#00FA9A":"Medium Spring","#48D1CC":"Medium Turquoise","#C71585":"Medium Violet","#191970":"Midnight Blue","#F5FFFA":"Mint Cream","#FFE4E1":"Misty Rose","#FFE4B5":"Moccasin","#FFDEAD":"Navajo White","#000080":"Navy","#FDF5E6":"Old Lace","#808000":"Olive","#6B8E23":"Olive Drab","#FF4500":"Orange Red","#DA70D6":"Orchid","#EEE8AA":"Pale Goldenrod","#98FB98":"Pale Green","#AFEEEE":"Pale Turquoise","#DB7093":"Pale Violet","#FFEFD5":"Papaya Whip","#FFDAB9":"Peach Puff","#CD853F":"Peru","#DDA0DD":"Plum","#B0E0E6":"Powder Blue","#BC8F8F":"Rosy Brown","#4169E1":"Royal Blue","#FA8072":"Salmon","#F4A460":"Sandy Brown","#2E8B57":"Sea Green","#FFF5EE":"Seashell","#A0522D":"Sienna","#87CEEB":"Sky Blue","#6A5ACD":"Slate Blue","#708090":"Slate Gray","#FFFAFA":"Snow","#00FF7F":"Spring Green","#4682B4":"Steel Blue","#D2B48C":"Tan","#008080":"Teal","#D8BFD8":"Thistle","#FF6347":"Tomato","#40E0D0":"Turquoise","#F5DEB3":"Wheat","#F5F5F5":"White Smoke","#9ACD32":"Yellow Green","#E0FFFF":"Azure","#F0F8FF":"Alice Blue","#FAEBD7":"Antique White","#F5FFFA":"Mint Cream","#E6F2FF":"Alice Blue","#F0FFFF":"Azure","#FFFAFA":"Snow","#F5F5DC":"Beige","#FFE4C4":"Bisque","#FFEBCD":"Blanched Almond","#8A2BE2":"Blue Violet","#A9A9A9":"Dark Gray","#006666":"Dark Cyan","#8B008B":"Dark Magenta","#556B2F":"Dark Khaki","#DC143C":"Crimson","#00008B":"Dark Blue","#008B8B":"Dark Cyan","#8B0000":"Dark Red","#4169E1":"Royal Blue","#1C1C1C":"Ebon","#2F4F4F":"Dark Slate Gray","#97FFFF":"Dark Turquoise Light","#00CED1":"Dark Turquoise","#9400D3":"Dark Violet","#FF8C00":"Dark Orange","#8FBC8F":"Dark Sea Green","#3CB371":"Medium Sea Green","#20B2AA":"Light Sea Green","#FFB6C1":"Light Pink","#FFC0CB":"Pink","#FFB347":"Pastel Orange","#FFDAB9":"Peach Puff","#B0E0E6":"Powder Blue","#87CEEB":"Sky Blue","#87CEFA":"Light Sky Blue","#00BFFF":"Deep Sky Blue","#ADD8E6":"Light Blue","#B0C4DE":"Light Steel Blue","#BFEFFF":"Light Cyan","#D3D3D3":"Light Gray","#FFE4B5":"Moccasin","#8B7355":"Burlywood","#CD5C5C":"Indian Red","#F08080":"Light Coral","#FA8072":"Salmon","#FF7F50":"Coral","#FFD700":"Gold","#FFA500":"Orange","#FF8C00":"Dark Orange","#FF6347":"Tomato","#FF4500":"Orange Red","#DC143C":"Crimson","#C71585":"Medium Violet Red","#FF1493":"Deep Pink","#FF69B4":"Hot Pink","#FFB6C1":"Light Pink","#FFC0CB":"Pink","#FFDAB9":"Peach Puff","#FFEFD5":"Papaya Whip","#FFEBCD":"Blanched Almond","#FFE4B5":"Moccasin","#FFDEAD":"Navajo White","#FFDBAC":"Peach","#E9967A":"Dark Salmon","#F08080":"Light Salmon","#CD5C5C":"Indian Red","#8B4513":"Saddle Brown","#A0522D":"Sienna","#D2B48C":"Tan","#DEB887":"Burlywood","#D2691E":"Chocolate","#BC8F8F":"Rosy Brown","#CD853F":"Peru","#DAA520":"Goldenrod","#B8860B":"Dark Goldenrod","#FFD700":"Gold","#FFFF00":"Yellow","#FFFFE0":"Light Yellow","#FFFACD":"Lemon Chiffon","#FAFAD2":"Light Goldenrod","#FFEFD5":"Papaya Whip","#FFEBCD":"Blanched Almond","#FFDAB9":"Peach Puff","#FFDEAD":"Navajo White","#FFDBAC":"Peach","#FFE4B5":"Moccasin","#ADFF2F":"Green Yellow","#7FFF00":"Chartreuse","#7CFC00":"Lawn Green","#00FF00":"Lime","#32CD32":"Lime Green","#3CB371":"Medium Sea Green","#2E8B57":"Sea Green","#228B22":"Forest Green","#008000":"Green","#006400":"Dark Green","#556B2F":"Dark Khaki","#6B8E23":"Olive Drab","#808000":"Olive","#9ACD32":"Yellow Green","#FFFACD":"Lemon Chiffon","#F0E68C":"Khaki","#EEE8AA":"Pale Goldenrod","#BDB76B":"Dark Khaki","#F5DEB3":"Wheat","#FFD700":"Gold","#DAA520":"Goldenrod","#B8860B":"Dark Goldenrod","#CD853F":"Peru","#DEB887":"Burlywood","#D2B48C":"Tan","#BC8F8F":"Rosy Brown","#8B4513":"Saddle Brown","#A0522D":"Sienna","#D2691E":"Chocolate","#FF8C00":"Dark Orange","#FFA500":"Orange","#FF6347":"Tomato","#FF4500":"Orange Red","#DC143C":"Crimson","#FF0000":"Red","#8B0000":"Dark Red","#800000":"Maroon","#CD5C5C":"Indian Red","#F08080":"Light Coral","#FA8072":"Salmon","#E9967A":"Dark Salmon","#FF7F50":"Coral","#FF6347":"Tomato","#FF69B4":"Hot Pink","#FF1493":"Deep Pink","#C71585":"Medium Violet Red","#EE82EE":"Violet","#DA70D6":"Orchid","#BA55D3":"Medium Orchid","#9370DB":"Medium Purple","#8B008B":"Dark Magenta","#800080":"Purple","#4B0082":"Indigo","#9932CC":"Dark Orchid","#9400D3":"Dark Violet","#6A0DAD":"Blue Violet","#8A2BE2":"Blue Violet","#0000CD":"Medium Blue","#0000FF":"Blue","#00008B":"Dark Blue","#000080":"Navy","#191970":"Midnight Blue","#00CED1":"Dark Turquoise","#40E0D0":"Turquoise","#20B2AA":"Light Sea Green","#48D1CC":"Medium Turquoise","#7FFFD4":"Aquamarine","#AFEEEE":"Pale Turquoise","#00FFFF":"Cyan","#00FF00":"Lime","#32CD32":"Lime Green","#00FA9A":"Medium Spring Green","#F0FFF0":"Honeydew","#F5FFFA":"Mint Cream","#F0FFFF":"Azure","#E0FFFF":"Light Cyan","#FFFF00":"Yellow","#FFFACD":"Lemon Chiffon","#FFFAF0":"Floral White","#FFFFF0":"Ivory","#FFFBF0":"Old Lace"};

const pickRandomContrastingColor = (idx) => {
  const pairIdx = idx ^ 1;
  const pairColor = currentColors[pairIdx] || '#000000';
  const minContrast = 3;
  let attempts = 0;
  while (attempts++ < 50) {
    const candidate = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6,'0').toUpperCase();
    if (candidate !== currentColors[idx] && getContrastRatio(candidate, pairColor) >= minContrast) return candidate;
  }
  return getOppositeColor(pairColor).toUpperCase();
};

async function animateColumnUpdate(idx, newColor){
  if (animatingCols.has(idx)) return;
  animatingCols.add(idx);
  setUIEnabled(false);
  document.getElementById(`color${idx+1}`).value = newColor;
  currentColors[idx] = newColor;
  const palette = document.getElementById('palette');
  const primaryCol = palette.children[idx];
  const pairIdx = idx ^ 1;
  const pairedCol = palette.children[pairIdx];
  const gradientCol = palette.children[6];
  if (!primaryCol){ animatingCols.delete(idx); setUIEnabled(true); return; }
  primaryCol.style.animation = 'fallOut .4s ease-in forwards';
  if (pairedCol) pairedCol.style.animation = 'fallOut .4s ease-in forwards';
  if (gradientCol) gradientCol.style.animation = 'fallOut .4s ease-in forwards';
  setTimeout(async () => {
    const colors = currentColors.slice(0,6);
    const textColorArray = [colors[1],colors[0],colors[3],colors[2],colors[5],colors[4]];
    primaryCol.style.transform = isMobileDevice() ? 'translateX(-140vw)' : 'translateY(-140vh)';
    primaryCol.style.animation = '';
    primaryCol.style.backgroundColor = newColor;
    {
      const rgb = hexToRgb(newColor);
      const cmyk = rgbToCmyk(rgb.r,rgb.g,rgb.b);
      const name = await deduceColorName(newColor);
      const textColor = textColorArray[idx];
      const colorInfoText=isMobileDevice()?`${newColor.toUpperCase()} · RGB ${rgb.r},${rgb.g},${rgb.b} · C${cmyk.c} M${cmyk.m} Y${cmyk.y} K${cmyk.k}`:`${newColor.toUpperCase()}<br>RGB ${rgb.r} ${rgb.g} ${rgb.b}<br>C${cmyk.c} M${cmyk.m} Y${cmyk.y} K${cmyk.k}`;
      primaryCol.innerHTML = `<div class="color-info" style="color:${textColor};font-family:${currentFont}">${colorInfoText}</div><div class="color-name" style="color:${textColor};font-family:${currentFont}">${name}</div>`;
      const info = primaryCol.querySelector('.color-info');
      info.addEventListener('click', e=>{e.stopPropagation();copyToClipboard(newColor,info)});
      const lockIndicator = document.createElement('div');
      lockIndicator.className = 'lock-indicator';
      lockIndicator.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
      lockIndicator.style.display = lockedColors[idx] ? 'block':'none';
      lockIndicator.style.cursor = 'pointer';
      lockIndicator.addEventListener('click',e=>{e.stopPropagation();lockedColors[idx]=!lockedColors[idx];localStorage.setItem('lockedColors',JSON.stringify(lockedColors));primaryCol.classList.toggle('locked',lockedColors[idx]);lockIndicator.style.display=lockedColors[idx]?'block':'none'; if(isMobileDevice()){ primaryCol.classList.add('swipe-lock'); setTimeout(()=>primaryCol.classList.remove('swipe-lock'),300); triggerHaptic(lockedColors[idx]?'lock':'unlock'); }});
      primaryCol.appendChild(lockIndicator);
      primaryCol.classList.toggle('locked', lockedColors[idx]);
      primaryCol.style.animation = 'fallHeavy .6s cubic-bezier(0.68,-0.55,0.265,1.55) forwards';
    }
    if (pairedCol){
      const pairColor = colors[pairIdx];
      pairedCol.style.transform = isMobileDevice() ? 'translateX(-140vw)' : 'translateY(-140vh)';
      pairedCol.style.animation = '';
      pairedCol.style.backgroundColor = pairColor;
      const rgbP = hexToRgb(pairColor);
      const cmykP = rgbToCmyk(rgbP.r,rgbP.g,rgbP.b);
      const nameP = await deduceColorName(pairColor);
      const textColorP = textColorArray[pairIdx];
      const colorInfoTextP=isMobileDevice()?`${pairColor.toUpperCase()} · RGB ${rgbP.r},${rgbP.g},${rgbP.b} · C${cmykP.c} M${cmykP.m} Y${cmykP.y} K${cmykP.k}`:`${pairColor.toUpperCase()}<br>RGB ${rgbP.r} ${rgbP.g} ${rgbP.b}<br>C${cmykP.c} M${cmykP.m} Y${cmykP.y} K${cmykP.k}`;
      pairedCol.innerHTML = `<div class="color-info" style="color:${textColorP};font-family:${currentFont}">${colorInfoTextP}</div><div class="color-name" style="color:${textColorP};font-family:${currentFont}">${nameP}</div>`;
      const infoP = pairedCol.querySelector('.color-info');
      infoP.addEventListener('click', e=>{e.stopPropagation();copyToClipboard(pairColor,infoP)});
      const lockIndicatorP = document.createElement('div');
      lockIndicatorP.className = 'lock-indicator';
      lockIndicatorP.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
      lockIndicatorP.style.display = lockedColors[pairIdx] ? 'block':'none';
      lockIndicatorP.style.cursor = 'pointer';
      lockIndicatorP.addEventListener('click',e=>{e.stopPropagation();lockedColors[pairIdx]=!lockedColors[pairIdx];localStorage.setItem('lockedColors',JSON.stringify(lockedColors));pairedCol.classList.toggle('locked',lockedColors[pairIdx]);lockIndicatorP.style.display=lockedColors[pairIdx]?'block':'none'});
      pairedCol.appendChild(lockIndicatorP);
      pairedCol.classList.toggle('locked', lockedColors[pairIdx]);
      pairedCol.style.animation = 'fallHeavy .6s cubic-bezier(0.68,-0.55,0.265,1.55) forwards';
    }
    if (gradientCol){
      const sortedColors = sortColorsByHue(colors);
      const avgColor = getAverageColor(sortedColors);
      const gradTextColor = getOppositeColor(avgColor);
      const gradNames = await Promise.all(sortedColors.map(c=>deduceColorName(c)));
      gradientCol.style.transform = isMobileDevice() ? 'translateX(-140vw)' : 'translateY(-140vh)';
      gradientCol.style.animation = '';
      const gradDirection = isMobileDevice() ? 'to right' : 'to bottom';
      gradientCol.style.background = `linear-gradient(${gradDirection}, ${sortedColors.join(', ')})`;
      gradientCol.innerHTML = `<div class="color-name" style="color:${gradTextColor};font-family:${currentFont}">Gradient</div>`;
      gradientCol.style.animation = 'fallHeavy .6s cubic-bezier(0.68,-0.55,0.265,1.55) forwards';
    }
    setTimeout(()=>{
      animatingCols.delete(idx);
      if(animatingCols.size === 0) setUIEnabled(true);
      localStorage.setItem('currentColors', JSON.stringify(currentColors.slice(0,6)));
      updateURL();
    },650);
  },400);
}

const hex = h=>h.replace('#','');
const hexToRgb = h=>{const x=h.replace('#','');return{r:parseInt(x.substring(0,2),16),g:parseInt(x.substring(2,4),16),b:parseInt(x.substring(4,6),16)}};
const rgbToCmyk=(r,g,b)=>{let c=1-(r/255),m=1-(g/255),y=1-(b/255),k=Math.min(c,m,y);if(k===1)return{c:0,m:0,y:0,k:100};c=Math.round(((c-k)/(1-k))*100);m=Math.round(((m-k)/(1-k))*100);y=Math.round(((y-k)/(1-k))*100);k=Math.round(k*100);return{c,m,y,k}};
const colorDistance=(a,b)=>Math.sqrt((a.r-b.r)**2+(a.g-b.g)**2+(a.b-b.b)**2);

async function deduceColorName(h){h=h.toUpperCase().replace('#','');const hh='#'+h; if(colorDatabase[hh])return colorDatabase[hh];
  try{const r=await fetch(`https://www.thecolorapi.com/id?hex=${h}`);const d=await r.json();if(d?.name?.value)return d.name.value;}catch(e){console.log('API 1 failed')}
  try{const r=await fetch(`https://api.color.pizza/v1/?values=${h}`);const d=await r.json();if(d?.colors?.[0]?.name)return d.colors[0].name;}catch(e){console.log('API 2 failed')}
  try{const r=await fetch(`https://www.colourlovers.com/api/color/${h}`);const d=await r.json();if(d?.[0]?.title)return d[0].title;}catch(e){console.log('API 3 failed')}
  const targetRgb=hexToRgb(hh);let closest='Custom',min=Infinity;for(const [knownHex,name]of Object.entries(colorDatabase)){const dist=colorDistance(targetRgb,hexToRgb(knownHex));if(dist<min){min=dist;closest=name}}if(min<30)return closest;const {r,g,b}=targetRgb;const bright=(r+g+b)/3; if(bright<30)return 'Pitch Black'; if(bright<60)return 'Dark Night'; if(bright<100)return 'Deep Charcoal'; if(bright<150)return 'Medium Shade'; if(bright>230)return 'Pure White'; if(bright>200)return 'Bright Ivory'; if(bright>180)return 'Off-White'; if(r>g&&r>b)return g>100?'Coral Red':'Deep Crimson'; if(g>r&&g>b)return b>100?'Turquoise Green':'Forest Emerald'; if(b>r&&b>g)return r>100?'Purple Haze':'Deep Azure'; if(Math.abs(r-g)<30 && Math.abs(g-b)<30) return bright>128?'Soft Gray':'Stone Gray'; return 'Mystery Color';}

const getOppositeColor = h=>{const rgb=hexToRgb(h);const r=255-rgb.r,g=255-rgb.g,b=255-rgb.b;return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`};
const getAverageColor = (colors)=>{let r=0,g=0,b=0;colors.forEach(c=>{const x=hexToRgb(c);r+=x.r;g+=x.g;b+=x.b});r=Math.round(r/colors.length);g=Math.round(g/colors.length);b=Math.round(b/colors.length);return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`};

const toggleBurgerMenu = ()=>{ if(!paletteReady) return; document.getElementById('burgerMenu').classList.toggle('active'); document.getElementById('menuTab').classList.toggle('active'); };
const toggleDarkMode = ()=>{ darkModeEnabled=!darkModeEnabled; document.body.classList.toggle('dark-mode'); localStorage.setItem('darkModeEnabled', darkModeEnabled); const label=document.getElementById('darkModeLabel'); const moonIcon=document.getElementById('moonIcon'); const sunIcon=document.getElementById('sunIcon'); const labelM=document.getElementById('darkModeLabelMobile'); const moonIconM=document.getElementById('moonIconMobile'); const sunIconM=document.getElementById('sunIconMobile'); if(label) label.textContent = darkModeEnabled?'Light':'Dark'; if(labelM) labelM.textContent = darkModeEnabled?'Light':'Dark'; if(moonIcon) moonIcon.style.display = darkModeEnabled?'none':'block'; if(sunIcon) sunIcon.style.display = darkModeEnabled?'block':'none'; if(moonIconM) moonIconM.style.display = darkModeEnabled?'none':'block'; if(sunIconM) sunIconM.style.display = darkModeEnabled?'block':'none'; };
const initDarkMode = ()=>{ darkModeEnabled = localStorage.getItem('darkModeEnabled')==='true'; if(darkModeEnabled){ document.body.classList.add('dark-mode'); const label=document.getElementById('darkModeLabel'); const moonIcon=document.getElementById('moonIcon'); const sunIcon=document.getElementById('sunIcon'); const labelM=document.getElementById('darkModeLabelMobile'); const moonIconM=document.getElementById('moonIconMobile'); const sunIconM=document.getElementById('sunIconMobile'); if(label) label.textContent='Light'; if(labelM) labelM.textContent='Light'; if(moonIcon) moonIcon.style.display='none'; if(sunIcon) sunIcon.style.display='block'; if(moonIconM) moonIconM.style.display='none'; if(sunIconM) sunIconM.style.display='block'; } };

const getContrastRatio=(h1,h2)=>{const lum=h=>{const rgb=hexToRgb(h);const [r,g,b]=[rgb.r,rgb.g,rgb.b].map(x=> x/255<=0.03928? x/255/12.92 : Math.pow((x/255+0.055)/1.055,2.4));return .2126*r+.7152*g+.0722*b};const l1=lum(h1),l2=lum(h2);const L=Math.max(l1,l2),D=Math.min(l1,l2);return (L+0.05)/(D+0.05)};
const rgbToHsv=(r,g,b)=>{r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b);let h=0,s=max===0?0:(max-min)/max,v=max;if(max!==min){const d=max-min;if(max===r)h=((g-b)/d+(g<b?6:0))/6;else if(max===g)h=((b-r)/d+2)/6;else h=((r-g)/d+4)/6}return{h,s,v}};
const sortColorsByHue=colors=>colors.map((c,i)=>{const rgb=hexToRgb(c);const hsv=rgbToHsv(rgb.r,rgb.g,rgb.b);return{color:c,hue:hsv.h,originalIndex:i}}).sort((a,b)=>a.hue-b.hue).map(it=>it.color);

const generatePaletteWithContrast = ()=>{const minContrast=3;let valid=false;let colors=[];while(!valid){colors=[];for(let i=0;i<6;i++){if(lockedColors[i]){colors.push(document.getElementById(`color${i+1}`).value)}else{colors.push('#'+Math.floor(Math.random()*16777215).toString(16).padStart(6,'0').toUpperCase())}}const p1=getContrastRatio(colors[0],colors[1]);const p2=getContrastRatio(colors[2],colors[3]);const p3=getContrastRatio(colors[4],colors[5]);if(p1>=minContrast&&p2>=minContrast&&p3>=minContrast){valid=true}}for(let i=1;i<=6;i++){document.getElementById(`color${i}`).value=colors[i-1]}document.getElementById('color7').value='#00D084'};

document.addEventListener('click',e=>{const menu=document.getElementById('burgerMenu');const tab=document.getElementById('menuTab');if(!menu.contains(e.target)&&!tab.contains(e.target)){menu.classList.remove('active');tab.classList.remove('active')}});

const colorPickerInput=document.getElementById('colorPickerInput');
const colorPickerHex=document.getElementById('colorPickerHex');
const colorPickerPreview=document.getElementById('colorPickerPreview');
colorPickerInput.addEventListener('input',e=>{colorPickerHex.value=e.target.value;colorPickerPreview.style.backgroundColor=e.target.value});
colorPickerHex.addEventListener('input',e=>{let h=e.target.value.trim();if(!h.startsWith('#')) h='#'+h;if(/^#[0-9A-F]{6}$/i.test(h)){colorPickerInput.value=h;colorPickerPreview.style.backgroundColor=h}});
colorPickerPreview.addEventListener('click',()=>colorPickerInput.click());

let fontSwitchCoolingDown=false; const fontSwitchCooldownMs=1000;
document.querySelectorAll('.font-item').forEach(item=>{
  item.addEventListener('click',function(){ if(!paletteReady||fontSwitchCoolingDown) return; fontSwitchCoolingDown=true; const items=document.querySelectorAll('.font-item'); items.forEach(i=>i.classList.remove('active')); this.classList.add('active'); currentFont=this.dataset.font; items.forEach(i=>i.classList.add('cooldown')); applyColors(); setTimeout(()=>{fontSwitchCoolingDown=false; items.forEach(i=>i.classList.remove('cooldown'))}, fontSwitchCooldownMs); });
  item.addEventListener('mouseenter',function(){document.querySelectorAll('.color-column').forEach(col=>{const nameEl=col.querySelector('.color-name'); if(nameEl) nameEl.style.fontFamily=this.dataset.font;})});
  item.addEventListener('mouseleave',()=>{document.querySelectorAll('.color-column').forEach(col=>{const nameEl=col.querySelector('.color-name'); if(nameEl) nameEl.style.fontFamily=currentFont;})});
});

function openColorPicker(i){ if(i===6) return; currentEditingColumn=i; const color=currentColors[i]; colorPickerInput.value=color; colorPickerHex.value=color; colorPickerPreview.style.backgroundColor=color; document.getElementById('colorPickerOverlay').classList.add('active'); }
function toggleLockColor(i){ if(i<6){ lockedColors[i]=!lockedColors[i]; localStorage.setItem('lockedColors', JSON.stringify(lockedColors)); const column=document.querySelectorAll('.color-column')[i]; if(column){ column.classList.toggle('locked', lockedColors[i]); const li=column.querySelector('.lock-indicator'); if(li) li.style.display=lockedColors[i]?'block':'none'; if(isMobileDevice()){ column.classList.add('swipe-lock'); setTimeout(()=>column.classList.remove('swipe-lock'),300); triggerHaptic(lockedColors[i]?'lock':'unlock'); } } } }
const initLockedColors=()=>{ const saved=localStorage.getItem('lockedColors'); if(saved){ lockedColors=JSON.parse(saved); } };

async function confirmColorChange(){ if(currentEditingColumn===null) return; let newColor=colorPickerInput.value; if(!newColor.startsWith('#')) newColor='#'+newColor; await animateColumnUpdate(currentEditingColumn,newColor); document.getElementById('colorPickerOverlay').classList.remove('active'); currentEditingColumn=null; }
const cancelColorChange=()=>{ document.getElementById('colorPickerOverlay').classList.remove('active'); currentEditingColumn=null; };

async function exportPalette(){ if(!paletteReady) return; const colors=currentColors.slice(0,6); const colorNames=[]; for(let i=0;i<6;i++) colorNames.push(await deduceColorName(colors[i])); colorNames.push('Gradient'); const svgWidth=1400, svgHeight=800, colWidth=svgWidth/7; const sortedColors=sortColorsByHue(colors); let svg=`<?xml version="1.0" encoding="UTF-8"?><svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%" gradientUnits="objectBoundingBox">`; for(let i=0;i<sortedColors.length;i++){const offset=(i/(sortedColors.length-1))*100; svg+=`<stop offset="${offset}%" style="stop-color:${sortedColors[i]};stop-opacity:1" />`; } svg+=`</linearGradient></defs><metadata><palette>`; for(let i=0;i<7;i++) svg+=`<color index="${i}">${i===6?'#GRADIENT':colors[i]}</color>`; svg+=`</palette></metadata>`; for(let i=0;i<6;i++){ const x=i*colWidth; const textColor=[colors[1],colors[0],colors[3],colors[2],colors[5],colors[4]][i]; const rgb=hexToRgb(colors[i]); const cmyk=rgbToCmyk(rgb.r,rgb.g,rgb.b); svg+=`<rect x="${x}" y="0" width="${colWidth}" height="${svgHeight}" fill="${colors[i]}" />`; const cx=x+colWidth/2; const yb=40; svg+=`<text x="${cx}" y="${yb}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="600" font-style="normal" fill="${textColor}">${colors[i].toUpperCase()}</text>`; svg+=`<text x="${cx}" y="${yb+15}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="600" font-style="normal" fill="${textColor}">HEX ${colors[i].substring(1).toUpperCase()}</text>`; svg+=`<text x="${cx}" y="${yb+30}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="600" font-style="normal" fill="${textColor}">C${cmyk.c} M${cmyk.m} Y${cmyk.y} K${cmyk.k}</text>`; const name=colorNames[i].toUpperCase(); const nx=x+colWidth-5; const ny=svgHeight-40; svg+=`<text x="${nx}" y="${ny}" font-family="Inter, Arial, sans-serif" font-size="72" font-weight="900" font-style="normal" fill="${textColor}" writing-mode="tb" glyph-orientation-vertical="0" transform="rotate(270 ${nx} ${ny})">${name}</text>`; }
  const avg=getAverageColor(sortedColors); const gt=getOppositeColor(avg); svg+=`<rect x="${6*colWidth}" y="0" width="${colWidth}" height="${svgHeight}" fill="url(#gradient)" />`; const gCenterX=6*colWidth+colWidth/2; svg+=`<text x="${gCenterX}" y="40" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="600" font-style="normal" fill="${gt}">GRADIENT</text>`; svg+=`<text x="${gCenterX}" y="55" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="600" font-style="normal" fill="${gt}">AUTO-GENERATED</text>`; const gnx=6*colWidth+colWidth-5; const gny=svgHeight-40; svg+=`<text x="${gnx}" y="${gny}" font-family="Inter, Arial, sans-serif" font-size="72" font-weight="900" font-style="normal" fill="${gt}" writing-mode="tb" glyph-orientation-vertical="0" transform="rotate(270 ${gnx} ${gny})">GRADIENT</text>`; svg+=`</svg>`; const blob=new Blob([svg],{type:'image/svg+xml'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='palette.svg'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); toggleBurgerMenu(); }

function importPalette(event){ const file=event.target.files[0]; if(!file) return; const reader=new FileReader(); reader.onload=e=>{const svgDoc=new DOMParser().parseFromString(e.target.result,'image/svg+xml'); const els=svgDoc.querySelectorAll('metadata palette color'); if(els.length>=7){ for(let i=0;i<7;i++){const val=els[i].textContent.trim(); if(val!=='#GRADIENT') document.getElementById(`color${i+1}`).value=val; } applyColors(); } else { alert('Format de palette invalide.'); } }; reader.readAsText(file); event.target.value=''; toggleBurgerMenu(); }

const generateRandomColors=()=>{ if(!paletteReady) return; generatePaletteWithContrast(); applyColors(); toggleBurgerMenu(); };

async function applyColors(){ const palette=document.getElementById('palette'); palette.style.visibility='hidden'; palette.innerHTML=''; paletteReady=false; setUIEnabled(false); const colors=[]; for(let i=1;i<=7;i++) colors.push(document.getElementById(`color${i}`).value||'#000000'); currentColors=[...colors]; const allCols=[]; for(let index=0; index<6; index++){ const color=colors[index]; const column=document.createElement('div'); column.className='color-column preload'; if(lockedColors[index]) column.classList.add('locked'); column.addEventListener('click',()=>openColorPicker(index)); column.style.backgroundColor=color; const textColor=[colors[1],colors[0],colors[3],colors[2],colors[5],colors[4]][index]; const rgb=hexToRgb(color); const cmyk=rgbToCmyk(rgb.r,rgb.g,rgb.b); const name=await deduceColorName(color); const colorInfoText=isMobileDevice()?`${color.toUpperCase()} · RGB ${rgb.r},${rgb.g},${rgb.b} · C${cmyk.c} M${cmyk.m} Y${cmyk.y} K${cmyk.k}`:`${color.toUpperCase()}<br>RGB ${rgb.r} ${rgb.g} ${rgb.b}<br>C${cmyk.c} M${cmyk.m} Y${cmyk.y} K${cmyk.k}`; column.innerHTML=`<div class="color-info" style="color:${textColor};font-family:${currentFont}">${colorInfoText}</div><div class="color-name" style="color:${textColor};font-family:${currentFont}">${name}</div>`; const lockIndicator=document.createElement('div'); lockIndicator.className='lock-indicator'; lockIndicator.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>'; lockIndicator.style.display=lockedColors[index]?'block':'none'; lockIndicator.style.cursor='pointer'; lockIndicator.addEventListener('click',e=>{e.stopPropagation();lockedColors[index]=!lockedColors[index];localStorage.setItem('lockedColors',JSON.stringify(lockedColors));column.classList.toggle('locked',lockedColors[index]);lockIndicator.style.display=lockedColors[index]?'block':'none'}); column.appendChild(lockIndicator); palette.appendChild(column); const colorInfo=column.querySelector('.color-info'); colorInfo.addEventListener('click',e=>{e.stopPropagation();copyToClipboard(color,colorInfo)}); column.addEventListener('wheel',async(e)=>{ e.preventDefault(); if(!paletteReady) return; if(e.deltaY<0){ lockedColors[index]=!lockedColors[index]; localStorage.setItem('lockedColors', JSON.stringify(lockedColors)); column.classList.toggle('locked', lockedColors[index]); const li=column.querySelector('.lock-indicator'); if(li) li.style.display=lockedColors[index]?'block':'none'; return; } if(lockedColors[index]) return; if(animatingCols.has(index)) return; const newColor=pickRandomContrastingColor(index); await animateColumnUpdate(index,newColor); },{passive:false}); allCols.push(column); }
  const sortedColors=sortColorsByHue(colors.slice(0,6)); const gradientColumn=document.createElement('div'); gradientColumn.className='color-column preload'; const gradDirection=isMobileDevice()?'to right':'to bottom'; gradientColumn.style.background=`linear-gradient(${gradDirection}, ${sortedColors.join(', ')})`; const avgColor=getAverageColor(sortedColors); const gradTextColor=getOppositeColor(avgColor); gradientColumn.innerHTML=`<div class=\"color-name\" style=\"color:${gradTextColor};font-family:${currentFont}\">Gradient</div>`; palette.appendChild(gradientColumn); allCols.push(gradientColumn);
  requestAnimationFrame(()=>{ let completed=0; const total=allCols.length; const onEnd=()=>{completed++; if(completed>=total){ paletteReady=true; setUIEnabled(true); updateURL(); }}; allCols.forEach(col=>{ const delay=Math.random()*1.0; col.style.transform= isMobileDevice() ? 'translateX(-140vw)' : 'translateY(-140vh)'; col.classList.remove('preload'); col.style.animation=`fallHeavy .6s cubic-bezier(0.68,-0.55,0.265,1.55) forwards ${delay}s`; setTimeout(()=>{ palette.classList.add('shake'); setTimeout(()=>palette.classList.remove('shake'),80); }, delay*1000+450); col.addEventListener('animationend', onEnd, {once:true}); }); palette.style.visibility='visible'; });
  localStorage.setItem('currentColors', JSON.stringify(colors.slice(0,6)));
}

const copyToClipboard=(hex,el)=>{navigator.clipboard.writeText(hex).then(()=>{el.classList.add('copied');setTimeout(()=>el.classList.remove('copied'),500)}).catch(err=>console.error('Erreur copie:',err))};
const showToast=msg=>{const t=document.createElement('div'); t.className='toast'; t.textContent=msg; document.body.appendChild(t); requestAnimationFrame(()=>t.classList.add('show')); setTimeout(()=>{t.classList.remove('show'); setTimeout(()=>t.remove(),200)},1800)};
const getCurrentPaletteLink=()=>{const colors=[];for(let i=1;i<=6;i++){const v=(document.getElementById(`color${i}`).value||'').toUpperCase(); colors.push(/^#[0-9A-F]{6}$/i.test(v)?v:'#000000')} const params=new URLSearchParams(); params.set('palette',colors.join('-')); params.set('font',encodeURIComponent(currentFont)); params.set('dark',darkModeEnabled?'1':'0'); return `${location.origin}${location.pathname}?${params.toString()}`};
const updateURL=()=>{const colors=[];for(let i=1;i<=6;i++){const v=(document.getElementById(`color${i}`).value||'').toUpperCase(); colors.push(/^#[0-9A-F]{6}$/i.test(v)?v:'#000000')} const params=new URLSearchParams(); params.set('palette',colors.join('-')); params.set('font',encodeURIComponent(currentFont)); params.set('dark',darkModeEnabled?'1':'0'); const newURL=`${location.pathname}?${params.toString()}`; history.replaceState(null,'',newURL)};

async function sharePalette(){ if(!paletteReady) return; const url=getCurrentPaletteLink(); try{ if(navigator.share){ await navigator.share({title:'My Palette',url}); showToast('Shared'); } else if(navigator.clipboard){ await navigator.clipboard.writeText(url); showToast('Link copied'); } else { window.prompt('Copy this link', url); } } catch(e){ if(navigator.clipboard){ await navigator.clipboard.writeText(url); showToast('Link copied'); } } toggleBurgerMenu(); }

const parsePaletteFromURL=()=>{const qs=new URLSearchParams(location.search); const pal=qs.get('palette')||qs.get('p'); if(pal){ const parts=pal.split(/[,-]/).map(s=>s.trim()); if(parts.length>=6){ for(let i=0;i<6;i++){ let h=parts[i]; if(!h.startsWith('#')) h='#'+h; if(/^#[0-9A-F]{6}$/i.test(h)){ document.getElementById(`color${i+1}`).value=h.toUpperCase(); } } } } const f=qs.get('font'); if(f){ try{ const decoded=decodeURIComponent(f); currentFont=decoded; document.querySelectorAll('.font-item').forEach(i=>{ i.classList.toggle('active', i.dataset.font===decoded); }); }catch{} } const d=qs.get('dark'); if(d==='1'){ if(!darkModeEnabled) toggleDarkMode(); } };

function rerollPalette(){ if(!paletteReady||rerollCoolingDown) return; rerollCoolingDown=true; setUIEnabled(false); const palette=document.getElementById('palette'); const cols=palette.querySelectorAll('.color-column'); cols.forEach(col=>{ col.style.animation='fallOut .4s ease-in forwards'; }); palette.classList.add('shake'); setTimeout(()=>palette.classList.remove('shake'),300); setTimeout(async()=>{ generatePaletteWithContrast(); await applyColors(); },450); setTimeout(()=>{ rerollCoolingDown=false; }, rerollCooldownMs); }

window.addEventListener('load',()=>{ initDarkMode(); initLockedColors(); parsePaletteFromURL(); const saved=localStorage.getItem('currentColors'); if(saved){ try{ const arr=JSON.parse(saved); if(Array.isArray(arr)&&arr.length>=6){ for(let i=1;i<=6;i++){ if(typeof arr[i-1]==='string' && /^#[0-9A-F]{6}$/i.test(arr[i-1])){ document.getElementById(`color${i}`).value=arr[i-1].toUpperCase(); } } } }catch(e){} }
  document.getElementById('color7').value='#00D084';
  const yEl=document.getElementById('legalYear'); if(yEl) yEl.textContent=new Date().getFullYear().toString();
  const ovDesktop=document.getElementById('onboardOverlay');
  const ovMobile=document.getElementById('onboardOverlayMobile');
  if(isMobileDevice()){
    if(ovMobile){ ovMobile.classList.add('active'); }
    if(ovDesktop){ ovDesktop.classList.remove('active'); }
  } else {
    if(ovDesktop){ ovDesktop.classList.add('active'); }
    if(ovMobile){ ovMobile.classList.remove('active'); }
  }
  // If neither overlay exists, apply colors immediately
  if(!ovDesktop && !ovMobile){ applyColors(); }
});

function dismissOnboarding(){
  const overlays=[document.getElementById('onboardOverlay'), document.getElementById('onboardOverlayMobile')];
  let anyActive=false;
  overlays.forEach(o=>{ if(o && o.classList.contains('active')){ o.classList.remove('active'); anyActive=true; } });
  // Only apply colors after closing an active overlay or if palette not ready
  if(anyActive || !paletteReady){ applyColors(); }
}

// Mobile swipe handling
function triggerHaptic(type){
  if(!isMobileDevice()) return;
  try{
    if('vibrate' in navigator){
      if(type==='lock') navigator.vibrate([8,12,8]);
      else if(type==='unlock') navigator.vibrate(16);
      else if(type==='reroll') navigator.vibrate(25);
    }
  }catch(e){}
}
let touchStartX=0,touchStartY=0,touchEndX=0,touchEndY=0;
function handleSwipe(index,direction){
  if(!paletteReady) return;
  const column=document.querySelectorAll('.color-column')[index];
  if(!column||index===6) return;
  if(direction==='left'){
    column.classList.add('swipe-lock');
    setTimeout(()=>column.classList.remove('swipe-lock'),300);
    lockedColors[index]=!lockedColors[index];
    localStorage.setItem('lockedColors',JSON.stringify(lockedColors));
    column.classList.toggle('locked',lockedColors[index]);
    const li=column.querySelector('.lock-indicator');
    if(li) li.style.display=lockedColors[index]?'block':'none';
    triggerHaptic(lockedColors[index]?'lock':'unlock');
  }else if(direction==='right'&&!lockedColors[index]){
    column.classList.add('swipe-reroll');
    setTimeout(()=>column.classList.remove('swipe-reroll'),300);
    triggerHaptic('reroll');
    if(!animatingCols.has(index)){
      const newColor=pickRandomContrastingColor(index);
      animateColumnUpdate(index,newColor);
    }
  }
}

function setupMobileSwipes(){
  const palette=document.getElementById('palette');
  if(!palette) return;
  
  let startTarget=null;
  let startX=0;
  let startY=0;
  
  const handleTouchStart=(e)=>{
    const col=e.target.closest('.color-column');
    if(col){
      startTarget=col;
      const touch=e.touches[0];
      startX=touch.clientX;
      startY=touch.clientY;
      touchStartX=startX;
      touchStartY=startY;
    }
  };
  
  const handleTouchEnd=(e)=>{
    if(!startTarget) return;
    
    const touch=e.changedTouches[0];
    const endX=touch.clientX;
    const endY=touch.clientY;
    const deltaX=endX-startX;
    const deltaY=endY-startY;
    
    // Swipe horizontal: au moins 50px et plus horizontal que vertical
    if(Math.abs(deltaX)>50 && Math.abs(deltaX)>Math.abs(deltaY)){
      const cols=Array.from(palette.querySelectorAll('.color-column'));
      const index=cols.indexOf(startTarget);
      if(index>=0 && index<6){
        if(deltaX<0){
          handleSwipe(index,'left');
        }else{
          handleSwipe(index,'right');
        }
      }
    }
    
    startTarget=null;
  };
  
  palette.addEventListener('touchstart',handleTouchStart,{passive:true});
  palette.addEventListener('touchend',handleTouchEnd,{passive:true});
}

function openMobileSettings(){
  const overlay=document.getElementById('mobileSettingsOverlay');
  if(!overlay) return;
  overlay.classList.remove('closing');
  // force reflow to ensure transition when re-opening quickly
  void overlay.offsetHeight;
  overlay.classList.add('active');
}

function closeMobileSettings(){
  const overlay=document.getElementById('mobileSettingsOverlay');
  if(!overlay) return;
  overlay.classList.remove('active');
  overlay.classList.add('closing');
  const onEnd=()=>{
    overlay.classList.remove('closing');
    overlay.removeEventListener('transitionend', onEnd);
  };
  overlay.addEventListener('transitionend', onEnd, {once:false});
}



// Setup mobile font items
document.addEventListener('DOMContentLoaded',()=>{
  // Set dynamic bottom bar height for responsive row sizing
  const setBottomBarHeight=()=>{
    const mc=document.getElementById('mobileControls');
    if(mc){
      const h=mc.offsetHeight || 80;
      document.documentElement.style.setProperty('--mobile-bottom-bar-height', h+'px');
    }
  };
  setBottomBarHeight();
  window.addEventListener('resize', setBottomBarHeight);
  setupMobileSwipes();
  document.querySelectorAll('.font-item-mobile').forEach(item=>{
    item.addEventListener('click',function(){
      if(!paletteReady||fontSwitchCoolingDown) return;
      fontSwitchCoolingDown=true;
      const items=document.querySelectorAll('.font-item,.font-item-mobile');
      items.forEach(i=>i.classList.remove('active'));
      this.classList.add('active');
      document.querySelectorAll('.font-item[data-font="'+this.dataset.font+'"]').forEach(i=>i.classList.add('active'));
      currentFont=this.dataset.font;
      items.forEach(i=>i.classList.add('cooldown'));
      const overlay=document.getElementById('mobileSettingsOverlay');
      if(overlay) overlay.classList.remove('active');
      applyColors();
      setTimeout(()=>{
        fontSwitchCoolingDown=false;
        items.forEach(i=>i.classList.remove('cooldown'));
      },fontSwitchCooldownMs);
    });
  });
});

// Ensure inline handlers can access functions
Object.assign(window, { toggleBurgerMenu, exportPalette, sharePalette, toggleDarkMode, importPalette, confirmColorChange, cancelColorChange, rerollPalette, dismissOnboarding, openMobileSettings, closeMobileSettings });
