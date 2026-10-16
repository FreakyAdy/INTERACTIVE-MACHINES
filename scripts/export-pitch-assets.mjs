import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

const ffmpegPath = "C:\\Users\\FreakyAdy\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.2-full_build\\bin\\ffmpeg.exe";

async function run() {
  const scratchDir = path.resolve(process.cwd(), 'scratch/film_frames');
  fs.mkdirSync(scratchDir, { recursive: true });

  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const filmPath = path.resolve(process.cwd(), "The Inventor's Secret — Pitch Film.html");
  const fileUrl = 'file:///' + filmPath.replace(/\\/g, '/');

  console.log('Loading pitch film in headless Chrome...');
  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  await page.evaluate(() => {
    document.getElementById('start').style.display = 'none';
    document.getElementById('bar').style.display = 'none';
    document.body.style.background = '#0c0a08';
  });

  // 1. Render Video Preview Card (t = 21.0s, Title + Meshed Gears + Play badge)
  await page.evaluate(() => {
    const sc = document.getElementById('sc');
    sc.value = 21.0;
    sc.dispatchEvent(new Event('input'));
  });
  await page.waitForTimeout(200);

  // Overlay a glowing play button on the canvas for the preview card
  await page.evaluate(() => {
    const cv = document.getElementById('c');
    const x = cv.getContext('2d');
    const W = 1920, H = 1080;
    
    // Glowing central play disc
    const cx = W / 2, cy = H / 2 - 10;
    x.save();
    x.shadowColor = '#d4af37';
    x.shadowBlur = 40;
    x.fillStyle = 'rgba(12, 10, 8, 0.75)';
    x.strokeStyle = '#d4af37';
    x.lineWidth = 4;
    x.beginPath();
    x.arc(cx, cy, 64, 0, Math.PI * 2);
    x.fill();
    x.stroke();

    // Triangle
    x.fillStyle = '#f3cf65';
    x.shadowBlur = 20;
    x.beginPath();
    x.moveTo(cx - 18, cy - 28);
    x.lineTo(cx + 32, cy);
    x.lineTo(cx - 18, cy + 28);
    x.closePath();
    x.fill();

    // Bottom banner
    x.fillStyle = 'rgba(20, 16, 12, 0.85)';
    x.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    x.lineWidth = 2;
    x.beginPath();
    x.roundRect(W / 2 - 380, H - 140, 760, 64, 12);
    x.fill();
    x.stroke();

    x.shadowBlur = 0;
    x.font = "600 24px 'JetBrains Mono', monospace";
    x.fillStyle = '#f3cf65';
    x.textAlign = 'center';
    x.fillText("▶ CLICK TO LAUNCH 1080p 60FPS MOTION GRAPHIC FILM", W / 2, H - 98);
    x.restore();
  });

  const cardBuffer = await page.locator('#c').screenshot();
  const cardPath = path.resolve(process.cwd(), 'assets/pitch-film-card.jpg');
  fs.writeFileSync(cardPath, cardBuffer);
  fs.copyFileSync(cardPath, path.resolve(process.cwd(), 'public/assets/pitch-film-card.jpg'));
  console.log('Saved card poster:', cardPath);

  // 2. Render 4 seconds of looping frames (t=18.0 to 22.0) for animated WebP
  console.log('Capturing animated sequence frames...');
  const fps = 12;
  const duration = 4.0;
  const totalFrames = Math.floor(fps * duration);
  
  for (let i = 0; i < totalFrames; i++) {
    const time = 18.0 + (i / totalFrames) * duration;
    await page.evaluate((curT) => {
      const sc = document.getElementById('sc');
      sc.value = curT;
      sc.dispatchEvent(new Event('input'));
    }, time);
    await page.waitForTimeout(40);
    const frameBuf = await page.locator('#c').screenshot();
    const frameFile = path.join(scratchDir, `frame_${String(i).padStart(4, '0')}.png`);
    fs.writeFileSync(frameFile, frameBuf);
  }

  await browser.close();
  console.log(`Rendered ${totalFrames} frames.`);

  // 3. Encode to WebP using ffmpeg
  const webpOut = path.resolve(process.cwd(), 'assets/pitch-film-loop.webp');
  const ffmpegCmd = `"${ffmpegPath}" -y -framerate ${fps} -i "${scratchDir}\\frame_%04d.png" -vf "scale=640:-1:flags=lanczos" -vcodec libwebp -lossless 0 -compression_level 4 -q:v 60 -loop 0 "${webpOut}"`;
  console.log('Running ffmpeg WebP conversion...');
  execSync(ffmpegCmd);
  fs.copyFileSync(webpOut, path.resolve(process.cwd(), 'public/assets/pitch-film-loop.webp'));

  const webpSize = fs.statSync(webpOut).size;
  console.log('WebP generated successfully. Size:', webpSize, 'bytes');

  // 4. Also encode a short MP4 preview
  const mp4Out = path.resolve(process.cwd(), 'assets/pitch-film-preview.mp4');
  const mp4Cmd = `"${ffmpegPath}" -y -framerate ${fps} -i "${scratchDir}\\frame_%04d.png" -vf "scale=1280:-1:flags=lanczos,format=yuv420p" -c:v libx264 -preset slow -crf 22 "${mp4Out}"`;
  console.log('Running ffmpeg MP4 conversion...');
  execSync(mp4Cmd);
  const mp4Size = fs.statSync(mp4Out).size;
  console.log('MP4 generated successfully. Size:', mp4Size, 'bytes');

  // Clean up scratch frames
  for (const f of fs.readdirSync(scratchDir)) {
    fs.unlinkSync(path.join(scratchDir, f));
  }
  fs.rmdirSync(scratchDir);
}

run().catch(console.error);
