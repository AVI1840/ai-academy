function getProgress(){try{return JSON.parse(localStorage.getItem('hamakpetza_v2')||'{}');}catch(e){return {};}}
function setProgress(p){localStorage.setItem('hamakpetza_v2',JSON.stringify(p));}
function updateBtn(){
const p=getProgress();const btn=document.getElementById('completeBtn');
if(p['course_'+COURSE_ID]){btn.textContent='✓ הושלם!';btn.classList.add('done');}
else{btn.textContent='✓ סיימתי יחידה זו';btn.classList.remove('done');}
}
function toggleComplete(){
const p=getProgress();p['course_'+COURSE_ID]=!p['course_'+COURSE_ID];setProgress(p);updateBtn();
}
function copyPrompt(el){
const text=el.innerText.replace(/^💬.*\n/,'');
navigator.clipboard.writeText(text).then(()=>{el.classList.add('copied');setTimeout(()=>el.classList.remove('copied'),2000);});
}
function shareCourse(){
const titles={1:'🧠 אוריינות AI ועבודה אחראית',2:'🗺️ מפת המודלים — במה להשתמש ומתי',3:'✍️ הנדסת הנחיות (Prompt Engineering)',4:'📝 AI לכתיבה ותקשורת',5:'📊 AI לניתוח נתונים',6:'🔍 חיפוש ומחקר עם AI',7:'💡 AI לחשיבה ופתרון בעיות',8:'🛡️ אתיקה ובטיחות AI בממשלה',9:'🏛️ AI לשירות הציבור',10:'⚙️ אוטומציה ותהליכי עבודה',11:'🗄️ RAG — חיבור AI למאגרי ידע',12:'💻 Claude Code — למפתחים'};
const text=titles[COURSE_ID]+'\nמתוך המקפצה — אקדמיית AI למגזר הציבורי\n\nhttps://avi1840.github.io/ai-academy/site2/course'+COURSE_ID+'.html';
window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank');
}
document.addEventListener('DOMContentLoaded',updateBtn);