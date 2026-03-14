function getProgress(){try{return JSON.parse(localStorage.getItem('hamakpetza_progress')||'{}');}catch(e){return {};}}
function setProgress(p){localStorage.setItem('hamakpetza_progress',JSON.stringify(p));}
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
const text=titles[COURSE_ID]+'\nמתוך המקפצה — אקדמיית AI למגזר הציבורי\n\nhttps://avi1840.github.io/ai-academy/site/course'+COURSE_ID+'.html';
window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank');
}
document.addEventListener('DOMContentLoaded',updateBtn);


// === FEEDBACK SYSTEM ===
const SHEET_URL = "https://script.google.com/macros/s/AKfycbwD8CMFoP5XoOwRLwK_OxMMOFKF8fS2CRpbJkNdOHjbnJIepkOLzlGrg3GQNGRqbwB6bA/exec";
const APP_NAME = "המקפצה";

async function sendFeedback({ name, category, severity, text, page }) {
  await fetch(SHEET_URL, {
    method: "POST", mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app: APP_NAME, name: name || "אנונימי",
      category: category || "כללי", severity: severity || "—",
      text: text, page: page || window.location.pathname,
    }),
  });
}

function initFeedback() {
  // Inject floating button
  const btn = document.createElement('button');
  btn.id = 'feedbackBtn';
  btn.className = 'feedback-fab';
  btn.innerHTML = '💬';
  btn.title = 'שלחו משוב';
  btn.onclick = () => document.getElementById('feedbackModal').classList.add('open');
  document.body.appendChild(btn);

  // Inject modal
  const modal = document.createElement('div');
  modal.id = 'feedbackModal';
  modal.className = 'feedback-modal';
  modal.innerHTML = `
<div class="feedback-backdrop" onclick="closeFeedback()"></div>
<div class="feedback-panel">
  <div class="feedback-header">
    <h3>💬 שלחו משוב</h3>
    <button class="feedback-close" onclick="closeFeedback()">✕</button>
  </div>
  <form id="feedbackForm" onsubmit="submitFeedback(event)">
    <input type="text" id="fbName" placeholder="שם (אופציונלי)" class="fb-input">
    <select id="fbCategory" class="fb-input">
      <option value="כללי">כללי</option>
      <option value="באג">באג</option>
      <option value="שיפור">שיפור</option>
      <option value="תוכן">תוכן</option>
      <option value="עיצוב">עיצוב</option>
    </select>
    <select id="fbSeverity" class="fb-input">
      <option value="—">חומרה (אופציונלי)</option>
      <option value="קריטי">קריטי</option>
      <option value="שיפור">שיפור</option>
      <option value="קטן">קטן</option>
    </select>
    <textarea id="fbText" placeholder="מה תרצו לשפר?" class="fb-input fb-textarea" required></textarea>
    <button type="submit" class="fb-submit" id="fbSubmitBtn">שליחה</button>
  </form>
  <div id="fbSuccess" class="fb-success" style="display:none">
    <span>✅</span> תודה! המשוב נשלח בהצלחה
  </div>
</div>`;
  document.body.appendChild(modal);
}

function closeFeedback() {
  document.getElementById('feedbackModal').classList.remove('open');
}

async function submitFeedback(e) {
  e.preventDefault();
  const btn = document.getElementById('fbSubmitBtn');
  btn.textContent = 'שולח...'; btn.disabled = true;
  await sendFeedback({
    name: document.getElementById('fbName').value,
    category: document.getElementById('fbCategory').value,
    severity: document.getElementById('fbSeverity').value,
    text: document.getElementById('fbText').value,
  });
  document.getElementById('feedbackForm').style.display = 'none';
  document.getElementById('fbSuccess').style.display = 'flex';
  setTimeout(() => {
    closeFeedback();
    document.getElementById('feedbackForm').style.display = '';
    document.getElementById('feedbackForm').reset();
    document.getElementById('fbSuccess').style.display = 'none';
    btn.textContent = 'שליחה'; btn.disabled = false;
  }, 2500);
}

document.addEventListener('DOMContentLoaded', initFeedback);
