import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const html = `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;700;900&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  width: 1200px; height: 630px;
  background: linear-gradient(135deg, #0a0c14 0%, #12152a 60%, #0a0c14 100%);
  font-family: 'Heebo', sans-serif;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
}
/* Grid pattern */
body::before {
  content: '';
  position: absolute; inset: 0;
  background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}
/* Top accent bar */
body::after {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 4px;
  background: linear-gradient(90deg, #d97757, #6a9bcc);
}
.content { position: relative; z-index: 1; text-align: center; }
.emoji { font-size: 64px; margin-bottom: 16px; }
.title { font-size: 96px; font-weight: 900; color: #eae8e4; line-height: 1; margin-bottom: 12px; }
.subtitle { font-size: 32px; font-weight: 700; color: #d97757; margin-bottom: 24px; }
.desc { font-size: 22px; color: #8b92a8; letter-spacing: 2px; }
.desc span { color: #d97757; }
/* Bottom accent */
.bottom-bar {
  position: absolute; bottom: 0; left: 0; right: 0; height: 4px;
  background: linear-gradient(90deg, #6a9bcc, #d97757);
}
/* Glow effects */
.glow1 {
  position: absolute; top: -100px; right: -50px; width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(217,119,87,0.12) 0%, transparent 70%);
  border-radius: 50%;
}
.glow2 {
  position: absolute; bottom: -80px; left: -30px; width: 350px; height: 350px;
  background: radial-gradient(circle, rgba(106,155,204,0.1) 0%, transparent 70%);
  border-radius: 50%;
}
</style>
</head>
<body>
  <div class="glow1"></div>
  <div class="glow2"></div>
  <div class="content">
    <div class="emoji">🚀</div>
    <div class="title">המקפצה</div>
    <div class="subtitle">אקדמיית AI למגזר הציבורי</div>
    <div class="desc">16 יחידות מעשיות <span>·</span> חינם <span>·</span> ללא הרשמה</div>
  </div>
  <div class="bottom-bar"></div>
</body>
</html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.setContent(html, { waitUntil: 'networkidle' });
  // Wait for fonts
  await page.waitForTimeout(2000);
  const outputPath = join(__dirname, '..', 'public', 'og-image.png');
  await page.screenshot({ path: outputPath, type: 'png' });
  await browser.close();
  console.log('✅ og-image.png created at', outputPath);
})();
