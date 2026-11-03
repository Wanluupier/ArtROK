'use strict';
// ARTROK — servidor completo (sem dependências). Rode com:  node server.js
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const { words: themeWords, THEME_IDS } = require('./palavras.js');

const PORT = process.env.PORT || 3000;
const DATA = path.join(__dirname, 'data'); fs.mkdirSync(DATA, { recursive: true });
let CONFIG = {}; try { CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8')); } catch (e) {}
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || CONFIG.googleClientId || '';

const ROUND_SECONDS = 80, BETWEEN_MS = 4500, MAX_PLAYERS = 10, BAN_MS = 60 * 60 * 1000;   // ban dura 1 hora
const MAX_FRAME = 12 * 1024 * 1024, MAX_IMG = 7200000;
const LANGS = ['pt', 'en', 'es'];

// ---------------------------------------------------------------- textos (3 idiomas)
const MSG = {
  roomFull: { pt: 'Sala cheia.', en: 'Room is full.', es: 'Sala llena.' },
  notFound: { pt: 'Sala não encontrada.', en: 'Room not found.', es: 'Sala no encontrada.' },
  needGoogle: { pt: 'Faça login com o Google para criar salas personalizadas.', en: 'Sign in with Google to create custom rooms.', es: 'Inicia sesión con Google para crear salas personalizadas.' },
  badName: { pt: 'Dê um nome à sala.', en: 'Give the room a name.', es: 'Ponle un nombre a la sala.' },
  needWords: { pt: 'Adicione pelo menos uma palavra.', en: 'Add at least one word.', es: 'Agrega al menos una palabra.' },
  tooMany: { pt: 'Você já tem salas demais. Use uma das suas.', en: 'You already have too many rooms. Use one of yours.', es: 'Ya tienes demasiadas salas. Usa una de las tuyas.' },
  noCodes: { pt: 'Sem códigos livres agora. Tente de novo.', en: 'No free codes right now. Try again.', es: 'No hay códigos libres ahora. Inténtalo de nuevo.' },
  timeUp: { pt: 'Tempo Esgotado!', en: "Time's up!", es: '¡Se acabó el tiempo!' },
  skipped: { pt: 'Desenho Pulado!', en: 'Drawing skipped!', es: '¡Dibujo saltado!' },
  allGot: { pt: 'Todos Acertaram!', en: 'Everyone got it!', es: '¡Todos acertaron!' },
  reported: { pt: 'Desenho denunciado!', en: 'Drawing reported!', es: '¡Dibujo denunciado!' },
  drawerLeft: { pt: 'O desenhista saiu!', en: 'The drawer left!', es: '¡Quien dibujaba salió!' },
  guessed: { pt: '{n} acertou a palavra! (+{p} pts)', en: '{n} guessed the word! (+{p} pts)', es: '¡{n} adivinó la palabra! (+{p} pts)' },
  joined: { pt: '{n} entrou na sala.', en: '{n} joined the room.', es: '{n} entró a la sala.' },
  left: { pt: '{n} saiu da sala.', en: '{n} left the room.', es: '{n} salió de la sala.' },
  banned: { pt: '{n} foi banido da sala por 1 hora.', en: '{n} was banned from the room for 1 hour.', es: '{n} fue baneado de la sala por 1 hora.' },
  banReason: { pt: 'Você foi banido por votação dos jogadores por 1 hora.', en: 'You were banned by player vote for 1 hour.', es: 'Fuiste baneado por votación de los jugadores por 1 hora.' },
  banSpam: { pt: 'Você foi banido por spam no chat por 1 hora.', en: 'You were banned for chat spam for 1 hour.', es: 'Fuiste baneado por spam en el chat por 1 hora.' },
  banAuto: { pt: 'Você foi banido por autodraw (desenho automático) por 1 hora.', en: 'You were banned for autodraw (automatic drawing) for 1 hour.', es: 'Fuiste baneado por autodraw (dibujo automático) por 1 hora.' },
  bannedSpam: { pt: '{n} foi banido por spam por 1 hora.', en: '{n} was banned for spam for 1 hour.', es: '{n} fue baneado por spam por 1 hora.' },
  bannedAuto: { pt: '{n} foi banido por autodraw por 1 hora.', en: '{n} was banned for autodraw for 1 hour.', es: '{n} fue baneado por autodraw por 1 hora.' },
  banVote: { pt: '{n} votou para banir {t} ({c}/{r}).', en: '{n} voted to ban {t} ({c}/{r}).', es: '{n} votó para banear a {t} ({c}/{r}).' },
  reportVote: { pt: '{n} denunciou o desenho de {d} ({c}/{r}).', en: '{n} reported {d}\'s drawing ({c}/{r}).', es: '{n} denunció el dibujo de {d} ({c}/{r}).' },
  reportDrop: { pt: 'O desenho de {d} foi derrubado por denúncia. Passando a vez!', en: '{d}\'s drawing was taken down by reports. Next turn!', es: 'El dibujo de {d} cayó por denuncias. ¡Siguiente turno!' },
  anon: { pt: 'Anônimo', en: 'Anonymous', es: 'Anónimo' },
};
const tx = (lang, key, v) => ((MSG[key][lang] || MSG[key].pt)).replace(/\{(\w+)\}/g, (_, k) => (v && v[k] !== undefined ? v[k] : ''));

// ---------------------------------------------------------------- utilidades
const clean = (s, n) => String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f<>]/g, '').trim().slice(0, n);
const norm = s => { const x = String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, ''); return x || String(s).trim().toLowerCase(); };
const ART = /^(the|a|an|o|os|as|um|uma|el|la|los|las|un|una)\s+/i;
const sameWord = (a, b) => norm(a) === norm(b) || norm(a.replace(ART, '')) === norm(b.replace(ART, ''));
const rnd = n => crypto.randomInt(n);
const loadJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8')); } catch (e) { return d; } };
const saveTimers = {};
const saveJSON = (f, obj) => { clearTimeout(saveTimers[f]); saveTimers[f] = setTimeout(() => fs.writeFile(path.join(DATA, f), JSON.stringify(obj), () => {}), 500); };
const safeImg = s => typeof s === 'string' && s.length < MAX_IMG && /^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+\/=]+$/.test(s);

// ---------------------------------------------------------------- HTTP
const htmlPath = ['artrok.html', 'index.html'].map(f => path.join(__dirname, f)).find(f => fs.existsSync(f));
const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  if (url === '/' || url === '/index.html' || url === '/artrok.html') {
    if (!htmlPath) { res.writeHead(500); return res.end('artrok.html não encontrado ao lado do server.js'); }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
    return fs.createReadStream(htmlPath).pipe(res);
  }
  if (url === '/config.js') {
    res.writeHead(200, { 'Content-Type': 'application/javascript', 'Cache-Control': 'no-cache' });
    return res.end('window.ARTROK_CONFIG=' + JSON.stringify({ googleClientId: GOOGLE_CLIENT_ID }) + ';');
  }
  if (url === '/health') { res.writeHead(200); return res.end('ok'); }
  res.writeHead(404); res.end('not found');
});

// ---------------------------------------------------------------- WebSocket (RFC 6455, mínimo)
const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
function wsSend(sock, str, op = 0x1) {
  if (!sock.writable) return;
  const data = Buffer.from(str), len = data.length; let head;
  if (len < 126) head = Buffer.from([0x80 | op, len]);
  else if (len < 65536) { head = Buffer.alloc(4); head[0] = 0x80 | op; head[1] = 126; head.writeUInt16BE(len, 2); }
  else { head = Buffer.alloc(10); head[0] = 0x80 | op; head[1] = 127; head.writeBigUInt64BE(BigInt(len), 2); }
  sock.write(Buffer.concat([head, data]));
}
server.on('upgrade', (req, socket) => {
  const key = req.headers['sec-websocket-key'];
  if (!key) return socket.destroy();
  socket.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ' +
    crypto.createHash('sha1').update(key + GUID).digest('base64') + '\r\n\r\n');
  socket.setNoDelay(true);
  const p = new Player(socket);
  let buf = Buffer.alloc(0), frags = [], fragLen = 0;
  socket.on('data', chunk => {
    buf = Buffer.concat([buf, chunk]);
    while (buf.length >= 2) {
      const fin = !!(buf[0] & 0x80), op = buf[0] & 0x0f, masked = !!(buf[1] & 0x80);
      let len = buf[1] & 0x7f, off = 2;
      if (len === 126) { if (buf.length < 4) return; len = buf.readUInt16BE(2); off = 4; }
      else if (len === 127) { if (buf.length < 10) return; const big = buf.readBigUInt64BE(2); if (big > BigInt(MAX_FRAME)) return socket.destroy(); len = Number(big); off = 10; }
      if (len > MAX_FRAME) return socket.destroy();
      const total = off + (masked ? 4 : 0) + len;
      if (buf.length < total) return;
      let payload = Buffer.from(buf.subarray(off + (masked ? 4 : 0), total));
      if (masked) { const m = buf.subarray(off, off + 4); for (let i = 0; i < payload.length; i++) payload[i] ^= m[i & 3]; }
      buf = buf.subarray(total);
      if (op === 0x8) { wsSend(socket, '', 0x8); return socket.end(); }
      if (op === 0x9) { wsSend(socket, payload.toString('latin1'), 0xA); continue; }
      if (op === 0xA) continue;
      if (op === 0x1 || op === 0x2) { frags = [payload]; fragLen = payload.length; }
      else if (op === 0x0) { frags.push(payload); fragLen += payload.length; if (fragLen > MAX_FRAME) return socket.destroy(); }
      if (fin) { const text = Buffer.concat(frags).toString('utf8'); frags = []; fragLen = 0; let m = null; try { m = JSON.parse(text); } catch (e) {} if (m && typeof m.type === 'string') { try { onMessage(p, m); } catch (e) { console.error('erro:', e); } } }
    }
  });
  socket.on('close', () => onClose(p));
  socket.on('error', () => socket.destroy());
});
setInterval(() => { for (const p of conns) { if (p.socket.writable) wsSend(p.socket, '', 0x9); } }, 25000);

// ---------------------------------------------------------------- dados
const conns = new Set(), byId = new Map();
const rooms = new Map();           // id -> room
const bans = new Map(Object.entries(loadJSON('bans.json', {})).filter(([, u]) => u > Date.now()));   // chave -> até quando (salvo em disco; expira sozinho)
const saveBans = () => saveJSON('bans.json', Object.fromEntries(bans));
setInterval(() => { const now = Date.now(); let ch = false; for (const [k, u] of bans) if (u <= now) { bans.delete(k); ch = true; } if (ch) saveBans(); }, 60 * 1000);
const accounts = loadJSON('accounts.json', {});
const savedCustom = loadJSON('rooms.json', []);

class Player {
  constructor(socket) {
    this.socket = socket; this.id = null; this.name = ''; this.bio = ''; this.av = 4; this.img = null; this.imgRev = '';
    this.lang = 'pt'; this.device = ''; this.gid = null; this.verified = false; this.verifying = null;
    this.roomId = null; this.score = 0; this.free = false; this.freeWatch = null; this.freeSnap = null;
    this.guessed = false; this.sentImg = {}; this.chatTimes = []; conns.add(this);
  }
  send(o) { try { wsSend(this.socket, JSON.stringify(o)); } catch (e) {} }
  err(key) { this.send({ type: 'ERROR', msg: tx(this.lang, key) }); }
  get shownName() { return this.name || tx(this.lang, 'anon'); }
}

// ---------------------------------------------------------------- salas
function mkRoom(o) {
  const r = Object.assign({ players: new Map(), order: [], phase: 'waiting', drawerId: '', word: '', hint: '', revealed: new Set(),
    guessed: new Set(), reports: new Set(), votes: new Map(), timeLeft: 0, interval: null, timer: null, snapshot: null,
    roundsDone: 0, maxRounds: 0, recent: [], history: [], emptySince: Date.now(), turn: -1 }, o);
  rooms.set(r.id, r); return r;
}
function publicRoom(theme, lang) {
  const id = theme + ':' + lang;
  return rooms.get(id) || mkRoom({ id, kind: 'public', name: theme, themeId: theme, themeName: '', lang, words: themeWords(theme, lang) });
}
function persistCustom() {
  saveJSON('rooms.json', [...rooms.values()].filter(r => r.kind === 'custom').map(r => ({ id: r.id, name: r.name, themeId: r.themeId, themeName: r.themeName, words: r.words, lang: r.lang, ownerGid: r.ownerGid, created: r.created })));
}
for (const c of savedCustom) mkRoom({ id: c.id, kind: 'custom', name: c.name, themeId: c.themeId, themeName: c.themeName, words: c.words, lang: c.lang, ownerGid: c.ownerGid, created: c.created || Date.now() });

function view(room, to) {
  return {
    id: room.id, name: room.name, code: room.code || null, phase: room.phase, hint: room.hint, drawerId: room.drawerId,
    themeId: room.themeId, themeName: room.themeName || room.name,
    players: [...room.players.values()].map(pl => {
      const e = { id: pl.id, name: pl.name, score: pl.score, free: pl.free, guessed: pl.guessed, bio: pl.bio, av: pl.av, imgRev: pl.imgRev || undefined };
      if (pl.img && to.sentImg[pl.id] !== pl.imgRev) { e.img = pl.img; to.sentImg[pl.id] = pl.imgRev; }
      return e;
    })
  };
}
const toRoom = (room, fn) => { for (const pl of room.players.values()) fn(pl); };
// avisa quem está desenhando no modo livre quantas pessoas estão assistindo
// banimento automático (spam / autodraw): 1 hora, mesmo esquema do ban por votação
function autoBan(room, t, kind) {
  const until = Date.now() + BAN_MS; bans.set('*|' + t.id, until); if (t.device) bans.set('*|' + t.device, until); saveBans();   // ban GLOBAL (vale em todas as salas)
  const nm = t.shownName; room.votes.delete(t.id);
  t.send({ type: 'BANNED', room: room.kind === 'public' ? room.themeId : room.name, reason: tx(t.lang, kind === 'spam' ? 'banSpam' : 'banAuto'), until });
  leaveRoom(t, true); sysPub(room, kind === 'spam' ? 'bannedSpam' : 'bannedAuto', { n: nm });
}
// mais de 10 mensagens em 5 s = spam
function spamCheck(room, p) {
  const now = Date.now(); p.spamTs = (p.spamTs || []).filter(t => now - t < 5000); p.spamTs.push(now);
  if (p.spamTs.length > 10) { p.spamTs = []; autoBan(room, p, 'spam'); return true; } return false;
}
// 50 traços/cliques em 10 s = autodraw (cada traço termina com um SNAPSHOT / FREE_SNAP)
function strokeCheck(room, p) {
  const now = Date.now(); p.strokeTs = (p.strokeTs || []).filter(t => now - t < 10000); p.strokeTs.push(now);
  if (p.strokeTs.length >= 50) { p.strokeTs = []; autoBan(room, p, 'auto'); return true; } return false;
}
const needVotes = room => Math.floor(room.players.size / 2) + 1;   // 2 jogadores=2, 3=2, 4=3, 6=4 ...
function notifyWatchers(room, id) {
  const t = room && room.players.get(id); if (!t) return;
  let n = 0; for (const o of room.players.values()) if (o.freeWatch === id) n++;
  t.send({ type: 'FREE_WATCHERS', count: n });
}
const broadcastRoom = room => toRoom(room, pl => pl.send({ type: 'ROOM', room: view(room, pl) }));
const sysPub = (room, key, v) => toRoom(room, pl => pl.send({ type: 'CHAT', channel: 'system', scope: 'public', text: tx(pl.lang, key, v) }));
const sys = (room, key, v) => toRoom(room, pl => pl.send({ type: 'CHAT', channel: 'system', text: tx(pl.lang, key, v), ok: key === 'guessed' }));

let lobbyTimer = null;
function lobbyFor(p) {
  const list = THEME_IDS.map(t => { const r = rooms.get(t + ':' + p.lang); return { id: t, kind: 'public', name: t, themeId: t, count: r ? r.players.size : 0 }; });
  for (const r of rooms.values()) if (r.kind === 'custom') list.push({ id: r.id, kind: 'custom', name: r.name, themeId: r.themeId, themeName: r.themeName, count: r.players.size, mine: !!(p.gid && r.ownerGid === p.gid) });
  return list;
}
function sendLobby(p) { p.send({ type: 'LOBBY', rooms: lobbyFor(p) }); }
function lobbyAll() { clearTimeout(lobbyTimer); lobbyTimer = setTimeout(() => { for (const p of conns) if (p.id) sendLobby(p); }, 150); }

function roomKey(room) { return room.kind === 'public' ? room.id : room.id; }
function isBanned(p, room) { const now = Date.now(); for (const k of [p.id, p.device]) { if (!k) continue; for (const pre of [room.id, '*']) { const u = bans.get(pre + '|' + k); if (u && u > now) return u; } } return 0; }

function leaveRoom(p, silent) {
  const room = p.roomId && rooms.get(p.roomId); if (!room) { p.roomId = null; return; }
  room.players.delete(p.id); room.order = room.order.filter(i => i !== p.id); room.votes.delete(p.id);
  const prevW = p.freeWatch;
  p.roomId = null; p.free = false; p.freeWatch = null; p.guessed = false;
  for (const o of room.players.values()) if (o.freeWatch === p.id) { o.freeWatch = null; o.send({ type: 'FREE_OFF', from: p.id }); }
  if (prevW) notifyWatchers(room, prevW);
  if (!silent) sys(room, 'left', { n: p.shownName });
  if (room.players.size === 0) {
    clearInterval(room.interval); clearTimeout(room.timer); room.interval = room.timer = null; room.phase = 'waiting'; room.drawerId = ''; room.snapshot = null; room.emptySince = Date.now();
    if (room.kind === 'private') rooms.delete(room.id);
  } else {
    if (room.phase === 'drawing' && room.drawerId === p.id) endRound(room, 'drawerLeft');
    else if (room.players.size < 2) { clearInterval(room.interval); clearTimeout(room.timer); room.phase = 'waiting'; room.drawerId = ''; room.hint = ''; room.roundsDone = 0; broadcastRoom(room); }
    else { room.votes.forEach(v => v.delete(p.id)); broadcastRoom(room); }
  }
  lobbyAll();
}

function joinRoom(p, room) {
  if (!p.id) return;
  if (p.roomId === room.id) { p.send({ type: 'JOINED', room: view(room, p) }); return; }
  const until = isBanned(p, room);
  if (until) { p.send({ type: 'BANNED', room: room.kind === 'public' ? room.themeId : room.name, reason: tx(p.lang, 'banReason'), until }); return; }
  if (room.players.size >= MAX_PLAYERS) return p.err('roomFull');
  leaveRoom(p);
  room.players.set(p.id, p); room.order.push(p.id); p.roomId = room.id; p.score = 0; p.guessed = false; p.free = false; p.freeWatch = null;
  p.sentImg = {};
  p.send({ type: 'JOINED', room: view(room, p) });
  if (room.history.length) p.send({ type: 'CHAT_HISTORY', items: room.history.slice(-30) });
  if (room.phase === 'drawing' && room.snapshot) p.send({ type: 'SNAPSHOT', data: room.snapshot });
  for (const o of room.players.values()) if (o !== p) o.send({ type: 'ROOM', room: view(room, o) });
  sys(room, 'joined', { n: p.shownName });
  if (room.phase === 'waiting' && room.players.size >= 2) startGame(room);
  lobbyAll();
}

// ---------------------------------------------------------------- partida
function mask(room) {
  return [...room.word].map((ch, i) => (ch === ' ' ? ' ' : (room.revealed.has(i) ? ch : '_'))).join(' ').replace(/ {3}/g, '   ');
}
function startGame(room) {
  room.roundsDone = 0; room.maxRounds = Math.max(6, room.players.size * 2);
  for (const pl of room.players.values()) pl.score = 0;
  nextRound(room);
}
function pickWord(room) {
  const list = room.words.length ? room.words : ['?'];
  let w, tries = 0;
  do { w = list[rnd(list.length)]; tries++; } while (room.recent.includes(w) && tries < 20 && list.length > 1);
  room.recent.push(w); if (room.recent.length > Math.min(20, Math.floor(list.length / 2))) room.recent.shift();
  return w;
}
function nextRound(room) {
  clearInterval(room.interval); clearTimeout(room.timer);
  const ids = [...room.players.keys()];
  if (ids.length < 2) { room.phase = 'waiting'; room.drawerId = ''; broadcastRoom(room); return; }
  room.turn = (room.turn + 1) % room.order.length;
  let drawer = room.order[room.turn]; if (!room.players.has(drawer)) { room.turn = 0; drawer = room.order[0]; }
  room.drawerId = drawer; room.word = pickWord(room); room.revealed = new Set(); room.hint = mask(room);
  room.phase = 'drawing'; room.guessed = new Set(); room.reports = new Set(); room.timeLeft = ROUND_SECONDS; room.snapshot = null;
  toRoom(room, pl => { pl.guessed = false; });
  const d = room.players.get(drawer);
  if (d.free) { d.free = false; d.send({ type: 'FREE_BLOCKED' }); for (const o of room.players.values()) if (o.freeWatch === d.id) { o.freeWatch = null; o.send({ type: 'FREE_OFF', from: d.id }); } d.send({ type: 'FREE_WATCHERS', count: 0 }); }
  toRoom(room, pl => pl.send({ type: 'CANVAS_CLEAR' }));
  broadcastRoom(room);                      // primeiro o estado da sala (o cliente zera a palavra quando o desenhista muda)...
  d.send({ type: 'WORD', word: room.word }); // ...depois a palavra secreta só para quem desenha
  toRoom(room, pl => pl.send({ type: 'TICK', t: room.timeLeft }));
  room.interval = setInterval(() => {
    room.timeLeft--;
    toRoom(room, pl => pl.send({ type: 'TICK', t: room.timeLeft }));
    const letters = [...room.word].map((c, i) => i).filter(i => room.word[i] !== ' ');
    if (letters.length >= 5 && (room.timeLeft === Math.floor(ROUND_SECONDS / 2) || room.timeLeft === Math.floor(ROUND_SECONDS / 4))) {
      const hidden = letters.filter(i => !room.revealed.has(i)); if (hidden.length > 2) { room.revealed.add(hidden[rnd(hidden.length)]); room.hint = mask(room); broadcastRoom(room); }
    }
    if (room.timeLeft <= 0) endRound(room, 'timeUp');
  }, 1000);
}
function endRound(room, kind) {
  if (room.phase !== 'drawing') return;
  clearInterval(room.interval); room.interval = null; room.phase = 'between';
  const word = room.word;
  toRoom(room, pl => pl.send({ type: 'ROUND_END', kind: kind === 'skipped' ? 'skip' : kind === 'reported' ? 'report' : 'end', title: tx(pl.lang, kind), word }));
  room.hint = word; broadcastRoom(room);
  room.roundsDone++;
  room.timer = setTimeout(() => {
    if (room.players.size < 2) { room.phase = 'waiting'; room.drawerId = ''; room.hint = ''; broadcastRoom(room); return; }
    if (room.roundsDone >= room.maxRounds) gameOver(room); else nextRound(room);
  }, BETWEEN_MS);
}
function gameOver(room) {
  const best = [...room.players.values()].sort((a, b) => b.score - a.score)[0];
  toRoom(room, pl => pl.send({ type: 'GAME_OVER', name: best ? best.shownName : '', score: best ? best.score : 0 }));
  room.phase = 'waiting'; room.drawerId = ''; room.hint = '';
  toRoom(room, pl => { pl.score = 0; pl.guessed = false; });
  broadcastRoom(room);
  room.timer = setTimeout(() => { if (room.players.size >= 2) startGame(room); }, 11000);
}

function handleChat(p, room, m) {
  if (spamCheck(room, p)) return;
  const text = clean(m.text, 120); if (!text) return;
  const now = Date.now(); p.chatTimes = p.chatTimes.filter(t => now - t < 4000); if (p.chatTimes.length >= 6) return; p.chatTimes.push(now);
  if (m.channel === 'public') {
    const line = p.shownName + ': ' + text; room.history.push(line); if (room.history.length > 60) room.history.shift();
    toRoom(room, pl => pl.send({ type: 'CHAT', channel: 'public', text: line })); return;
  }
  if (room.phase !== 'drawing' || p.id === room.drawerId) return;
  if (!p.guessed && sameWord(text, room.word)) {
    const pts = Math.max(20, Math.round(100 * room.timeLeft / ROUND_SECONDS) + 20 - 10 * room.guessed.size);
    p.guessed = true; room.guessed.add(p.id); p.score += pts;
    const d = room.players.get(room.drawerId); if (d) d.score += 20;
    toRoom(room, pl => pl.send({ type: 'CHAT', channel: 'system', text: tx(pl.lang, 'guessed', { n: p.shownName, p: pts }), ok: true }));
    broadcastRoom(room);
    if (room.guessed.size >= room.players.size - 1) endRound(room, 'allGot');
    return;
  }
  const line = p.shownName + ': ' + text;
  toRoom(room, pl => { if (!p.guessed || pl.guessed || pl.id === room.drawerId) pl.send({ type: 'CHAT', channel: 'guess', text: line }); });
}

// ---------------------------------------------------------------- Google
async function verifyGoogle(p, token, gid) {
  if (!token) return false;
  if (p.verifying && p.verifying.token === token) return p.verifying.promise;
  const promise = (async () => {
    try {
      const r = await fetch('https://oauth2.googleapis.com/tokeninfo?access_token=' + encodeURIComponent(token));
      if (!r.ok) return false; const u = await r.json();
      if (!u.sub || (gid && u.sub !== gid)) return false;
      if (GOOGLE_CLIENT_ID && u.aud !== GOOGLE_CLIENT_ID && u.azp !== GOOGLE_CLIENT_ID) return false;
      p.gid = u.sub; p.verified = true; return true;
    } catch (e) { return false; }
  })();
  p.verifying = { token, promise }; return promise;
}
const snap = p => ({ name: p.name, bio: p.bio, av: p.av, img: p.img });
async function googleLogin(p, token, gid) {
  const ok = await verifyGoogle(p, token, gid);
  if (!ok) return;
  const acc = accounts[p.gid];
  if (acc) { p.name = clean(acc.name, 50); p.bio = clean(acc.bio, 50); p.av = Number.isInteger(acc.av) ? acc.av : p.av; if (safeImg(acc.img)) setImg(p, acc.img); else if (acc.av != null) setImg(p, null); p.send({ type: 'ACCOUNT', profile: acc }); }
  else { accounts[p.gid] = snap(p); saveJSON('accounts.json', accounts); }
  const room = p.roomId && rooms.get(p.roomId); if (room) broadcastRoom(room);
  sendLobby(p);
}
function setImg(p, img) { p.img = img || null; p.imgRev = img ? crypto.createHash('md5').update(img).digest('hex').slice(0, 10) : ''; }

// ---------------------------------------------------------------- mensagens
function onMessage(p, m) {
  if (m.type === 'PROFILE') {
    const id = String(m.id || '').match(/^[\w-]{1,64}$/) ? String(m.id) : null; if (!id) return;
    if (p.id && p.id !== id) { leaveRoom(p, true); byId.delete(p.id); }
    const old = byId.get(id); if (old && old !== p) { leaveRoom(old, true); try { old.socket.destroy(); } catch (e) {} conns.delete(old); }
    p.id = id; byId.set(id, p);
    p.name = clean(m.name, 50); p.bio = clean(m.bio, 50); p.av = Number.isInteger(m.av) && m.av >= 0 && m.av < 5 ? m.av : 4;
    p.device = clean(m.device, 80); if (LANGS.includes(m.lang)) p.lang = m.lang;
    if (safeImg(m.img)) setImg(p, m.img); else if (!m.hasImg) setImg(p, null);   // hasImg sem img = mantém a foto atual
    if (p.verified && accounts[p.gid]) { accounts[p.gid] = snap(p); saveJSON('accounts.json', accounts); }
    else if (m.gtoken && !p.verified) googleLogin(p, m.gtoken, m.gid);
    const room = p.roomId && rooms.get(p.roomId); if (room) broadcastRoom(room);
    sendLobby(p); return;
  }
  if (!p.id) return;
  const room = p.roomId ? rooms.get(p.roomId) : null;
  switch (m.type) {
    case 'GOOGLE_LOGIN': googleLogin(p, m.token, m.gid); break;
    case 'GOOGLE_LOGOUT': p.verified = false; p.gid = null; p.verifying = null; break;
    case 'JOIN': {
      if (LANGS.includes(m.lang)) p.lang = m.lang;
      const id = String(m.roomId || '');
      const r = THEME_IDS.includes(id) ? publicRoom(id, p.lang) : rooms.get(id);
      if (!r || r.kind === 'private') return p.err('notFound');
      joinRoom(p, r); break;
    }
    case 'JOIN_CODE': {
      if (LANGS.includes(m.lang)) p.lang = m.lang;
      const code = parseInt(m.code, 10);
      const r = [...rooms.values()].find(x => x.kind === 'private' && x.code === code);
      if (!r) return p.err('notFound');
      joinRoom(p, r); break;
    }
    case 'CREATE_PRIVATE': {
      if (LANGS.includes(m.lang)) p.lang = m.lang;
      const used = new Set([...rooms.values()].filter(x => x.kind === 'private').map(x => x.code));
      let code = 0; for (let i = 0; i < 60 && !code; i++) { const c = 100 + rnd(900); if (!used.has(c)) code = c; }
      if (!code) return p.err('noCodes');
      const pool = ['alimentos', 'gerais', 'animais', 'verbos', 'bandeiras'].flatMap(t => themeWords(t, p.lang));
      const r = mkRoom({ id: 'p_' + code + '_' + Date.now().toString(36), kind: 'private', name: 'Sala #' + code, themeId: 'gerais', themeName: '#' + code, code, lang: p.lang, words: pool });
      joinRoom(p, r); break;
    }
    case 'CREATE_CUSTOM': {
      if (LANGS.includes(m.lang)) p.lang = m.lang;
      if (!p.verified) return p.err('needGoogle');
      const name = clean(m.name, 30); if (!name) return p.err('badName');
      const themeId = String(m.themeId || 'outros');
      let list = Array.isArray(m.words) ? [...new Set(m.words.map(w => clean(w, 15)).filter(Boolean))].slice(0, 300) : [];
      if (!list.length) { if (themeId === 'outros' || !THEME_IDS.includes(themeId)) return p.err('needWords'); list = themeWords(themeId, p.lang); }
      const mine = [...rooms.values()].filter(r => r.kind === 'custom' && r.ownerGid === p.gid).length;
      if (mine >= 5) return p.err('tooMany');
      const theme = THEME_IDS.includes(themeId) ? themeId : 'outros';
      const r = mkRoom({ id: 'c_' + crypto.randomBytes(4).toString('hex'), kind: 'custom', name, themeId: theme, themeName: theme === 'outros' ? name : '', words: list, lang: p.lang, ownerGid: p.gid, created: Date.now() });
      persistCustom(); joinRoom(p, r); lobbyAll(); break;
    }
    case 'LEAVE': leaveRoom(p); break;
    case 'CHAT': if (room) handleChat(p, room, m); break;
    case 'SKIP': if (room && room.phase === 'drawing' && room.drawerId === p.id) endRound(room, 'skipped'); break;
    case 'REPORT': {
      if (!room || room.phase !== 'drawing' || room.drawerId === p.id) break;
      if (room.reports.has(p.id)) break;
      room.reports.add(p.id);
      const dr = room.players.get(room.drawerId); if (!dr) break;
      const valid = [...room.reports].filter(id => room.players.has(id) && id !== dr.id).length, need = needVotes(room);
      sysPub(room, 'reportVote', { n: p.shownName, d: dr.shownName, c: valid, r: need });
      if (valid >= need) { sysPub(room, 'reportDrop', { d: dr.shownName }); endRound(room, 'reported'); }
      break;
    }
    case 'VOTE_BAN': {
      if (!room) break; const t = room.players.get(String(m.targetId)); if (!t || t === p) break;
      const v = room.votes.get(t.id) || new Set(); if (v.has(p.id)) break;
      v.add(p.id); room.votes.set(t.id, v);
      const valid = [...v].filter(id => room.players.has(id) && id !== t.id).length, need = needVotes(room);
      sysPub(room, 'banVote', { n: p.shownName, t: t.shownName, c: valid, r: need });
      if (valid >= need) {
        const until = Date.now() + BAN_MS; bans.set(room.id + '|' + t.id, until); if (t.device) bans.set(room.id + '|' + t.device, until); saveBans();
        const nm = t.shownName; room.votes.delete(t.id);
        t.send({ type: 'BANNED', room: room.kind === 'public' ? room.themeId : room.name, reason: tx(t.lang, 'banReason'), until });
        leaveRoom(t, true); sysPub(room, 'banned', { n: nm });
      }
      break;
    }
    case 'CANVAS_DRAW': case 'CANVAS_CLEAR': {
      if (!room || room.phase !== 'drawing' || room.drawerId !== p.id) break;
      if (m.type === 'CANVAS_CLEAR') room.snapshot = null;
      const out = Object.assign({}, m); delete out.roomId;
      toRoom(room, pl => { if (pl !== p) pl.send(out); }); break;
    }
    case 'SNAPSHOT': {
      if (room && strokeCheck(room, p)) break;
      if (!room || room.phase !== 'drawing' || room.drawerId !== p.id || typeof m.data !== 'string' || m.data.length > 4e6) break;
      room.snapshot = m.data; toRoom(room, pl => { if (pl !== p) pl.send({ type: 'SNAPSHOT', data: m.data }); }); break;
    }
    case 'FREE_ON': if (room && !(room.phase === 'drawing' && room.drawerId === p.id)) { p.free = true; broadcastRoom(room); } break;
    case 'FREE_OFF': if (room) { const prevW = p.freeWatch; p.freeWatch = null; if (prevW) notifyWatchers(room, prevW); p.free = false; p.freeSnap = null; p.send({ type: 'FREE_WATCHERS', count: 0 }); toRoom(room, pl => { if (pl.freeWatch === p.id) { pl.freeWatch = null; pl.send({ type: 'FREE_OFF', from: p.id }); } }); broadcastRoom(room); } break;
    case 'FREE_WATCH': {
      if (!room) break; const t = m.targetId ? room.players.get(String(m.targetId)) : null;
      const prevW = p.freeWatch;
      p.freeWatch = t && t.free && t.id !== p.id ? t.id : null;
      if (p.freeWatch) p.send({ type: 'FREE_SNAP', from: t.id, data: t.freeSnap || null });
      if (prevW && prevW !== p.freeWatch) notifyWatchers(room, prevW);
      if (p.freeWatch) notifyWatchers(room, p.freeWatch);
      break;
    }
    case 'FREE_DRAW': case 'FREE_CLEAR': case 'FREE_SNAP': {
      if (m.type === 'FREE_SNAP' && room && strokeCheck(room, p)) break;
      if (!room || !p.free) break;
      if (m.type === 'FREE_SNAP') { if (typeof m.data !== 'string' || m.data.length > 4e6) break; p.freeSnap = m.data; }
      if (m.type === 'FREE_CLEAR') p.freeSnap = null;
      const out = Object.assign({}, m, { from: p.id });
      toRoom(room, pl => { if (pl.freeWatch === p.id) pl.send(out); }); break;
    }
  }
}
function onClose(p) {
  conns.delete(p); leaveRoom(p);
  if (p.id && byId.get(p.id) === p) byId.delete(p.id);
}

// limpa salas personalizadas vazias há mais de 24h
setInterval(() => {
  let changed = false;
  for (const r of [...rooms.values()]) if (r.kind === 'custom' && r.players.size === 0 && Date.now() - r.emptySince > 24 * 3600 * 1000) { rooms.delete(r.id); changed = true; }
  if (changed) { persistCustom(); lobbyAll(); }
}, 3600 * 1000);

server.listen(PORT, () => {
  console.log('\n  ARTROK rodando!  Abra no navegador:  http://localhost:' + PORT + '\n');
  if (!htmlPath) console.log('  ATENÇÃO: coloque o artrok.html na mesma pasta do server.js\n');
  if (!GOOGLE_CLIENT_ID) console.log('  (Login com Google desligado: falta o googleClientId no config.json)\n');
});
