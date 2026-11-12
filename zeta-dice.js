/* 랜덤 데이트 발생기 · 제타용 작은 버튼 (북마클릿·유저스크립트 공용) */
(() => {
  if (window.__RDE__) { window.__RDE__.toggle(); return; }
  const ORIGIN = window.__RDE_ORIGIN__ || 'https://randomevent.vercel.app';
  const TA = 'textarea[name="message"],textarea[testid="chat-message-input"],[data-sentry-component="ChatInput"] textarea';
  const KEY = 'rde-fab-pos';
  const ls = { get(k) { try { return localStorage.getItem(k) } catch (e) { return null } }, set(k, v) { try { localStorage.setItem(k, v) } catch (e) {} } };

  const host = document.createElement('div');
  host.id = 'rde-host';
  host.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147483646';
  const sh = host.attachShadow({ mode: 'open' });
  sh.innerHTML = `<style>
  *{box-sizing:border-box}
  .fab{pointer-events:auto;position:fixed;width:30px;height:30px;padding:0;border:0;background:#ff5c8d;display:grid;place-items:center;cursor:pointer;opacity:.55;touch-action:none;
    box-shadow:0 -2px 0 #2b1d3a,0 2px 0 #2b1d3a,-2px 0 0 #2b1d3a,2px 0 0 #2b1d3a;transition:opacity .15s}
  .fab:hover,.fab.on{opacity:1}
  .fab svg{width:18px;height:18px;shape-rendering:crispEdges}
  .pane{pointer-events:auto;position:fixed;right:16px;top:64px;width:360px;height:min(540px,calc(100vh - 140px));min-width:300px;min-height:320px;max-width:calc(100vw - 20px);max-height:calc(100vh - 20px);background:#fbf1dc;display:flex;flex-direction:column;
    box-shadow:0 -4px 0 #2b1d3a,0 4px 0 #2b1d3a,-4px 0 0 #2b1d3a,4px 0 0 #2b1d3a,8px 10px 0 2px rgba(0,0,0,.35)}
  .pane[hidden]{display:none}
  .bar{background:#2b1d3a;color:#ffd23f;font:600 13px/1 system-ui,sans-serif;padding:8px 8px 8px 12px;display:flex;align-items:center;gap:8px;cursor:move;touch-action:none}
  .bar b{font-weight:600}
  .bar button{margin-left:auto;background:none;border:0;color:#fdf6e8;font:600 18px/1 system-ui;cursor:pointer;padding:2px 6px}
  iframe{flex:1;width:100%;border:0;background:#fbf1dc}
  .grip{position:absolute;left:-4px;bottom:-4px;width:18px;height:18px;cursor:nesw-resize;touch-action:none;background:linear-gradient(45deg,#2b1d3a 0 50%,transparent 50%)}
  .pane.drag iframe{pointer-events:none}
  .fail{padding:24px 18px;font:14px/1.6 system-ui,sans-serif;color:#2b1d3a}
  .fail a{display:inline-block;margin-top:10px;background:#ff5c8d;color:#fff;padding:8px 14px;text-decoration:none}
  .toast{position:fixed;left:50%;bottom:120px;transform:translateX(-50%);background:#ffd23f;color:#2b1d3a;font:600 13px system-ui,sans-serif;padding:8px 14px;
    box-shadow:0 -2px 0 #2b1d3a,0 2px 0 #2b1d3a,-2px 0 0 #2b1d3a,2px 0 0 #2b1d3a;opacity:0;transition:opacity .2s;pointer-events:none}
  .toast.show{opacity:1}
  @media (max-width:640px){.pane{left:0!important;right:0!important;top:auto!important;bottom:0;width:auto!important;height:58vh!important;max-width:none}.grip{display:none}}
  </style>
  <button class="fab" title="랜덤 데이트 발생기" aria-label="랜덤 데이트 발생기 열기"><svg viewBox="0 0 8 8"><path fill="#fffaf0" d="M1 1h6v6H1z"/><path fill="#2b1d3a" d="M1 0h6v1H1zM0 1h1v6H0zM7 1h1v6H7zM1 7h6v1H1zM2 2h1v1H2zM5 2h1v1H5zM2 5h1v1H2zM5 5h1v1H5z"/></svg></button>
  <div class="pane" hidden><div class="bar"><b>▶ 랜덤 데이트 발생기</b><button class="x" title="닫기" aria-label="닫기">×</button></div><div class="body"></div><div class="grip" title="끌어서 크기 조절"></div></div>
  <div class="toast"></div>`;
  (document.body || document.documentElement).appendChild(host);
  const fab = sh.querySelector('.fab'), pane = sh.querySelector('.pane'), body = sh.querySelector('.body'), toastEl = sh.querySelector('.toast');
  body.style.cssText = 'flex:1;display:flex;flex-direction:column;min-height:0';

  const toast = m => { toastEl.textContent = m; toastEl.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => toastEl.classList.remove('show'), 1600); };

  // 버튼 위치 (끌어서 옮길 수 있고, 위치는 기억)
  const place = (x, y) => { x = Math.max(4, Math.min(innerWidth - 34, x)); y = Math.max(4, Math.min(innerHeight - 34, y)); fab.style.left = x + 'px'; fab.style.top = y + 'px'; };
  const saved = (ls.get(KEY) || '').split(',').map(Number);
  if (saved.length === 2 && saved.every(n => !isNaN(n))) place(saved[0] * innerWidth, saved[1] * innerHeight); else place(innerWidth - 46, innerHeight - 150);
  let drag = null, moved = false;
  fab.addEventListener('pointerdown', e => { drag = { dx: e.clientX - fab.offsetLeft, dy: e.clientY - fab.offsetTop }; moved = false; fab.setPointerCapture(e.pointerId); });
  fab.addEventListener('pointermove', e => { if (!drag) return; const x = e.clientX - drag.dx, y = e.clientY - drag.dy; if (Math.abs(x - fab.offsetLeft) + Math.abs(y - fab.offsetTop) > 3) moved = true; if (moved) place(x, y); });
  fab.addEventListener('pointerup', () => { if (drag && moved) ls.set(KEY, (fab.offsetLeft / innerWidth).toFixed(4) + ',' + (fab.offsetTop / innerHeight).toFixed(4)); drag = null; });
  addEventListener('resize', () => place(fab.offsetLeft, fab.offsetTop));

  // 창 열기/닫기 — 처음 열 때만 발생기를 불러옴
  let frame = null, ready = false, popup = null;
  const load = () => {
    if (frame) return;
    frame = document.createElement('iframe');
    frame.src = ORIGIN + '/?embed=1';
    frame.allow = 'autoplay; clipboard-write';
    frame.title = '랜덤 데이트 발생기';
    body.appendChild(frame);
    setTimeout(() => { if (!ready) { // 사이트가 창 안에 못 뜨면 새 창으로 여는 버튼
      body.innerHTML = '<div class="fail">이 화면에서는 발생기 창을 띄울 수 없어요.<br>아래 버튼을 누르면 작은 새 창으로 열려요. 새 창에서도 [입력창에 넣기]가 돼요.<br><a href="#" class="pop">새 창으로 열기</a></div>';
      body.querySelector('.pop').onclick = ev => { ev.preventDefault(); popup = window.open(ORIGIN + '/?embed=1', 'rde', 'popup,width=440,height=800'); };
    } }, 6000);
  };
  const open = () => { load(); pane.hidden = false; fab.classList.add('on'); };
  const close = () => { pane.hidden = true; fab.classList.remove('on'); };
  const toggle = () => pane.hidden ? open() : close();
  fab.addEventListener('click', () => { if (!moved) toggle(); });
  sh.querySelector('.x').onclick = close;

  // 창 끌어서 옮기기 (PC)
  const bar = sh.querySelector('.bar'); let pd = null;
  bar.addEventListener('pointerdown', e => { if (e.target.closest('button') || innerWidth <= 640) return; pd = { dx: e.clientX - pane.offsetLeft, dy: e.clientY - pane.offsetTop }; pane.classList.add('drag'); bar.setPointerCapture(e.pointerId); });
  bar.addEventListener('pointermove', e => { if (!pd) return; pane.style.left = Math.max(0, e.clientX - pd.dx) + 'px'; pane.style.top = Math.max(0, e.clientY - pd.dy) + 'px'; pane.style.right = 'auto'; });
  bar.addEventListener('pointerup', () => { pd = null; pane.classList.remove('drag'); });


  // 왼쪽 아래 모서리를 끌어서 창 크기 조절 (크기 기억)
  const SKEY = 'rde-pane-size', grip = sh.querySelector('.grip');
  const ss = (ls.get(SKEY) || '').split(',').map(Number);
  if (ss.length === 2 && ss.every(n => n > 0)) { pane.style.width = ss[0] + 'px'; pane.style.height = ss[1] + 'px'; }
  let rs = null;
  grip.addEventListener('pointerdown', e => { const r = pane.getBoundingClientRect(); rs = { x: e.clientX, y: e.clientY, w: r.width, h: r.height, right: r.right }; pane.classList.add('drag'); grip.setPointerCapture(e.pointerId); e.preventDefault(); });
  grip.addEventListener('pointermove', e => { if (!rs) return; const w = Math.max(300, rs.w + (rs.x - e.clientX)), h = Math.max(320, rs.h + (e.clientY - rs.y)); pane.style.width = w + 'px'; pane.style.height = h + 'px'; if (pane.style.left) pane.style.left = (rs.right - w) + 'px'; });
  grip.addEventListener('pointerup', () => { if (!rs) return; rs = null; pane.classList.remove('drag'); ls.set(SKEY, Math.round(pane.offsetWidth) + ',' + Math.round(pane.offsetHeight)); });
  // 발생기에서 [입력창에 넣기]를 누르면 제타 입력칸에 글을 넣음
  const insert = text => {
    const ta = [...document.querySelectorAll(TA)].find(t => t.offsetParent !== null) || document.querySelector(TA);
    if (!ta) return false;
    const cur = ta.value.trim();
    const v = cur ? ta.value.replace(/\s+$/, '') + '\n' + text : text;
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(ta, v);
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    try { ta.focus({ preventScroll: true }); ta.setSelectionRange(v.length, v.length); } catch (e) {}
    return true;
  };
  addEventListener('message', e => {
    if (e.origin !== ORIGIN || !e.data || e.data.src !== 'rde') return;
    if (e.data.type === 'ready') { ready = true; return; }
    if (e.data.type === 'insert') {
      const ok = insert(String(e.data.text || ''));
      e.source && e.source.postMessage({ src: 'rde', type: 'inserted', ok, kind: e.data.kind }, ORIGIN);
      if (ok) { toast(e.data.kind === 'course' ? '▶ 데이트 코스 START!' : '▶ 데이트 이벤트 발생!'); if (innerWidth <= 640) close(); }
      else toast('채팅방 입력칸을 못 찾았어요. [복사]를 써주세요');
    }
  });

  window.__RDE__ = { toggle, open, close };
})();
