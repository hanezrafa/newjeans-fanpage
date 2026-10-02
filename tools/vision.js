/**
 * vision.js — borrow a vision model (Gemini via 9router) to "see" images.
 *
 * The local agent model cannot see images. When a task needs vision (pick a
 * photo, judge a screenshot, compare pictures, read a rendered page), call
 * this script instead of guessing.
 *
 * Usage:
 *   node vision.js <image-path> "<question>"
 *   node vision.js <image-path> "<question>" --model gemini/gemini-3.5-flash-lite
 *
 * Prints the model's answer to stdout. Exits non-zero on failure so the caller
 * can fall back to asking the user or to a non-visual method.
 *
 * Requires the 9router gateway running on 127.0.0.1:20128 (see AGENTS.md).
 */

const fs = require('fs');
const path = require('path');

const API = process.env.NINE_ROUTER_URL || 'http://127.0.0.1:20128/v1/chat/completions';
const KEY = process.env.NINE_ROUTER_KEY || 'sk-52f2293a43fe0441-guf6d3-0503160e';

// ordered fallbacks: fast/cheap first, then stronger
const MODELS = [
  'gemini/gemini-3.5-flash-lite',
  'gemini/gemini-3-flash-preview',
  'gemini/gemini-3.7-flash',
  'gemini/gemini-3.8-flash',
];

function mime(file) {
  const e = path.extname(file).toLowerCase();
  if (e === '.png') return 'image/png';
  if (e === '.webp') return 'image/webp';
  if (e === '.gif') return 'image/gif';
  return 'image/jpeg';
}

async function ask(model, imagePath, question) {
  const b64 = fs.readFileSync(imagePath).toString('base64');
  const dataUrl = `data:${mime(imagePath)};base64,${b64}`;
  const r = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + KEY },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: question },
          { type: 'image_url', image_url: { url: dataUrl } },
        ],
      }],
      max_tokens: 1000,
    }),
    signal: AbortSignal.timeout(90000),
  });
  if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + (await r.text()).slice(0, 150));
  const text = await r.text();
  // some mirrors answer in SSE even with stream:false — handle both
  if (text.startsWith('data:')) {
    let full = '';
    for (const line of text.split('\n')) {
      if (!line.startsWith('data:')) continue;
      const d = line.slice(5).trim();
      if (d === '[DONE]') continue;
      try { const j = JSON.parse(d); full += j.choices?.[0]?.delta?.content || j.choices?.[0]?.message?.content || ''; } catch {}
    }
    if (full) return full;
  }
  const j = JSON.parse(text);
  if (j.error) throw new Error(JSON.stringify(j.error).slice(0, 150));
  return j.choices?.[0]?.message?.content ?? '';
}

(async () => {
  const args = process.argv.slice(2);
  const img = args.shift();
  const qi = args.indexOf('--model');
  let modelArg = null;
  if (qi !== -1) { modelArg = args[qi + 1]; args.splice(qi, 2); }
  const question = args.join(' ').trim();

  if (!img || !question) {
    console.error('Usage: node vision.js <image-path> "<question>" [--model <id>]');
    process.exit(1);
  }

  const models = modelArg ? [modelArg, ...MODELS] : MODELS;
  let lastErr = null;
  for (const m of models) {
    try {
      const out = await ask(m, img, question);
      if (out && out.trim()) {
        process.stdout.write(out.trim() + '\n');
        return;
      }
      lastErr = new Error('empty answer from ' + m);
    } catch (e) {
      lastErr = e;
    }
  }
  console.error('vision failed: ' + (lastErr && lastErr.message));
  process.exit(2);
})();
