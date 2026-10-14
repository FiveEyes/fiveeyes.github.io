// Keep all module assets on the same build version, including after a Pages update.
const assetVersion = new URL(import.meta.url).search;
const [{ cases, validatePlacement, deriveObjective }, { sceneArt, objectIcon, avatar }] = await Promise.all([
  import(`./puzzles.js${assetVersion}`),
  import(`./art.js${assetVersion}`),
]);

const $ = (selector) => document.querySelector(selector);
const escape = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const storageKey = 'fangcun-casebook-v1';
const clone = (value) => JSON.parse(JSON.stringify(value));
const coord = (cell) => `${Math.floor(cell / 6) + 1} 行 ${cell % 6 + 1} 列`;
const fresh = () => ({ placements: {}, notes: {}, excluded: [], solved: false, hint: -1 });
let storageAvailable = true;
let saved;
try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch { saved = {}; }
if (!saved || typeof saved !== 'object' || Array.isArray(saved)) saved = {};
const records = Object.fromEntries(cases.map(puzzle => [puzzle.id, restore(puzzle, saved[puzzle.id])]));
const histories = Object.fromEntries(cases.map(puzzle => [puzzle.id, []]));
let caseIndex = Math.max(0, cases.findIndex(p => p.id === location.hash.slice(1)));
let selected = cases[caseIndex].people[0].id;
let mode = 'place';
let hintOpen = false;
let chosenAnswer = null;
let dialogReturnFocus = null;
const dialog = $('#game-dialog');

function restore(puzzle, value) {
  const result = fresh();
  if (!value || typeof value !== 'object') return result;
  const ids = new Set(puzzle.people.map(p => p.id));
  const isCell = n => Number.isInteger(n) && n >= 0 && n < 36;
  for (const [id, cell] of Object.entries(value.placements || {})) {
    if (ids.has(id) && isCell(cell) && puzzle.cells[cell].walkable) result.placements[id] = cell;
  }
  for (const [cell, notes] of Object.entries(value.notes || {})) {
    if (isCell(Number(cell)) && Array.isArray(notes)) result.notes[cell] = [...new Set(notes.filter(id => ids.has(id)))];
  }
  result.excluded = Array.isArray(value.excluded) ? [...new Set(value.excluded.filter(isCell))] : [];
  result.hint = Number.isInteger(value.hint) ? Math.max(-1, Math.min(puzzle.hints.length - 1, value.hint)) : -1;
  const check = validatePlacement(puzzle, result.placements);
  result.solved = value.solved === true && check.complete && check.valid && deriveObjective(puzzle, result.placements) === puzzle.answer;
  return result;
}
function puzzle() { return cases[caseIndex]; }
function state() { return records[puzzle().id]; }
function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(records)); storageAvailable = true; } catch { storageAvailable = false; }
  $('#save-status').textContent = storageAvailable ? '进度自动保存在当前浏览器' : '浏览器暂不允许存档；本次仍可正常游玩';
}
function checkpoint() {
  const history = histories[puzzle().id];
  history.push(clone(state()));
  if (history.length > 80) history.shift();
}
function feedback(text = '', type = '') {
  $('#feedback').textContent = text;
  $('#feedback').className = `feedback ${type ? `is-${type}` : ''}`;
}
function renderCases() {
  $('#case-selector').innerHTML = cases.map((item, i) => `<button type="button" class="case-card ${i === caseIndex ? 'is-active' : ''} ${records[item.id].solved ? 'is-solved' : ''}" data-case="${i}" aria-pressed="${i === caseIndex}"><div class="case-art" aria-hidden="true">${sceneArt(i)}</div><div class="case-card-body"><span class="case-number">CASE ${String(i + 1).padStart(2, '0')}</span><span class="case-title">${escape(item.title)}</span><p class="case-subtitle">${escape(item.location)} · ${escape(item.mission)}</p><span class="case-status">${records[item.id].solved ? '✓ 已结案' : i === caseIndex ? '正在调查 ↗' : '打开案件 ↗'}</span></div></button>`).join('');
  $('#total-progress').innerHTML = `${String(cases.filter(p => records[p.id].solved).length).padStart(2, '0')} / 03 <small>已结案</small>`;
}
function renderCase() {
  const p = puzzle();
  renderCases();
  $('#case-kicker').textContent = `案件 ${String(caseIndex + 1).padStart(2, '0')} / ${p.difficulty} / ${p.duration}`;
  $('#case-title').textContent = p.title;
  $('#case-intro').textContent = p.intro;
  $('#case-mission').textContent = p.mission;
  $('#objective-rule').textContent = `案件线索：${p.objectiveRule}`;
  $('#room-legend').innerHTML = p.rooms.map(room => `<span class="legend-item"><i style="background:${escape(room.color)}"></i>${escape(room.name)}</span>`).join('');
  renderPlay();
  renderHint();
}
function renderPlay() {
  const p = puzzle(), s = state();
  const entries = Object.entries(s.placements);
  const person = p.people.find(item => item.id === selected);
  const activeCell = document.activeElement?.dataset?.cell;
  $('#person-picker').innerHTML = p.people.map(item => `<button type="button" data-person="${item.id}" aria-pressed="${selected === item.id}" class="${selected === item.id ? 'is-selected' : ''}"><b>${item.id}</b>${escape(item.name)}</button>`).join('');
  $('#mobile-clue').textContent = `${person.name}：${person.clue}`;
  $('#board').innerHTML = p.cells.map((cell, i) => {
    const room = p.rooms.find(r => r.id === cell.room);
    const roomStart = p.cells.findIndex(c => c.room === cell.room) === i;
    const occupantId = entries.find(([, c]) => c === i)?.[0];
    const occupant = p.people.find(item => item.id === occupantId);
    const taken = entries.some(([id, c]) => id !== selected && (Math.floor(c / 6) === Math.floor(i / 6) || c % 6 === i % 6));
    const crossed = !occupant && (s.excluded.includes(i) || (cell.walkable && taken));
    const borders = [[i < 6 || p.cells[i-6].room !== cell.room, 'top'], [i >= 30 || p.cells[i+6].room !== cell.room, 'bottom'], [i % 6 === 0 || p.cells[i-1].room !== cell.room, 'left'], [i % 6 === 5 || p.cells[i+1].room !== cell.room, 'right']].filter(([show]) => show).map(([,side]) => `room-${side}`).join(' ');
    const label = [coord(i), room.name, cell.label, occupant ? `${occupant.id} ${occupant.name}` : '', !cell.walkable ? '家具，不可站立' : '', crossed ? '已排除' : '', s.notes[i]?.length ? `笔记 ${s.notes[i].join('、')}` : ''].filter(Boolean).join('，');
    return `<button type="button" class="cell ${borders} ${!cell.walkable ? 'blocked' : ''} ${occupant ? 'occupied' : ''} ${crossed ? 'eliminated' : ''} ${occupantId === selected ? 'highlight' : ''} ${mode === 'note' ? 'note-mode' : ''}" data-cell="${i}" style="--room-color:${escape(room.color)}" aria-label="${escape(label)}" aria-disabled="${!cell.walkable && mode !== 'erase'}">${roomStart ? `<span class="cell-room-label">${escape(room.name)}</span>` : ''}${cell.object ? `<span class="object-art" aria-hidden="true">${objectIcon(cell.object)}</span><span class="cell-object-label">${escape(cell.label || '')}</span>` : ''}${occupant ? `<span class="person-token" style="--person-color:${escape(occupant.color)}" aria-hidden="true">${occupant.id}</span>` : ''}${crossed ? '<span class="cell-cross" aria-hidden="true">×</span>' : ''}${!occupant && !crossed && s.notes[i]?.length ? `<span class="pencil-notes" aria-hidden="true">${s.notes[i].map(id => `<span>${id}</span>`).join('')}</span>` : ''}</button>`;
  }).join('');
  if (activeCell !== undefined) $(`[data-cell="${activeCell}"]`)?.focus({ preventScroll: true });
  $('#people-list').innerHTML = p.people.map((item, i) => `<button type="button" class="person-card ${selected === item.id ? 'is-selected' : ''} ${s.placements[item.id] !== undefined ? 'is-placed' : ''}" data-person="${item.id}" aria-pressed="${selected === item.id}"><span class="person-avatar" style="--person-color:${escape(item.color)}" aria-hidden="true">${avatar(i)}<span class="person-letter">${item.id}</span></span><span class="person-content"><span class="person-name">${escape(item.name)} <span class="person-role">${escape(item.role)}</span></span><span class="person-clue">${escape(item.clue)}</span></span><span class="person-location">${s.placements[item.id] !== undefined ? coord(s.placements[item.id]) : '待定位'}</span></button>`).join('');
  $('#selected-person').textContent = mode === 'place' ? `当前人物：${person.id} ${person.name}。点击格子放置；再次点击原位置可取回。` : mode === 'note' ? `正在为 ${person.id} ${person.name} 记笔记。点击格子添加或移除候选字母。` : mode === 'exclude' ? '点击空格标记 ×，再次点击取消排除。' : '点击格子，清除该格的人物、笔记或排除标记。';
  document.querySelectorAll('[data-mode]').forEach(button => { button.classList.toggle('is-active', button.dataset.mode === mode); button.setAttribute('aria-pressed', button.dataset.mode === mode); });
  $('#placed-count').textContent = `${entries.length} / 6 已就位`;
  $('#progress-label').textContent = s.solved ? '案件已结 · 可以继续探索其他现场' : `还原 ${entries.length} / 6 人的位置`;
  $('#progress-fill').style.width = `${entries.length / 6 * 100}%`;
  $('#undo-button').disabled = histories[p.id].length === 0;
  $('#check-button').innerHTML = s.solved ? '查看结案手记 <span aria-hidden="true">↗</span>' : entries.length === 6 ? '推理案件答案 <span aria-hidden="true">→</span>' : '核对现场 <span aria-hidden="true">→</span>';
  save();
}
function editCell(index) {
  const p = puzzle(), s = state();
  const cell = p.cells[index];
  if (!cell.walkable && mode !== 'erase') { feedback(`${cell.label || '这个物件'}占据了这里，人物不能站在此处。`); return; }
  const occupant = Object.keys(s.placements).find(id => s.placements[id] === index);
  if (mode === 'place') {
    if (occupant && occupant !== selected) { feedback('这里已经有人了。先选中原人物移走，或使用擦除。', 'error'); return; }
    const conflict = p.people.find(item => item.id !== selected && s.placements[item.id] !== undefined && (Math.floor(s.placements[item.id] / 6) === Math.floor(index / 6) || s.placements[item.id] % 6 === index % 6));
    if (conflict) { feedback(`与 ${conflict.id} ${conflict.name} 同行或同列。每行、每列只能有一个人。`, 'error'); return; }
    checkpoint();
    if (occupant === selected) delete s.placements[selected];
    else { s.placements[selected] = index; delete s.notes[index]; s.excluded = s.excluded.filter(n => n !== index); }
  } else if (mode === 'note') {
    if (occupant) { feedback('这个格子已经放置了人物，先取回人物才能记笔记。'); return; }
    checkpoint();
    const notes = s.notes[index] || [];
    s.notes[index] = notes.includes(selected) ? notes.filter(id => id !== selected) : [...notes, selected].sort();
    s.excluded = s.excluded.filter(n => n !== index);
  } else if (mode === 'exclude') {
    if (occupant) { feedback('不能排除已放置人物的格子，先取回人物。'); return; }
    checkpoint();
    s.excluded = s.excluded.includes(index) ? s.excluded.filter(n => n !== index) : [...s.excluded, index];
  } else {
    if (!occupant && !s.notes[index]?.length && !s.excluded.includes(index)) return;
    checkpoint();
    if (occupant) delete s.placements[occupant];
    delete s.notes[index]; s.excluded = s.excluded.filter(n => n !== index);
  }
  if (mode === 'place' || mode === 'erase') s.solved = false;
  feedback(); renderPlay(); renderCases();
}
function chooseCase(index) {
  caseIndex = index; selected = puzzle().people[0].id; mode = 'place'; hintOpen = false;
  history.replaceState(null, '', `#${puzzle().id}`);
  feedback(); renderCase();
}
function renderHint() {
  const panel = $('#hint-panel');
  panel.hidden = !hintOpen;
  if (!hintOpen) return;
  const s = state(), p = puzzle();
  s.hint = Math.max(0, s.hint);
  panel.innerHTML = `<div><span class="hint-label">推理手记 · ${s.hint + 1} / ${p.hints.length}</span><p class="hint-text">${escape(p.hints[s.hint].text)}</p></div><div class="hint-actions"><button type="button" class="tool-button" data-hint="prev" ${s.hint === 0 ? 'disabled' : ''}>上一条</button><button type="button" class="tool-button" data-hint="next" ${s.hint === p.hints.length - 1 ? 'disabled' : ''}>再给一点</button><button type="button" class="tool-button" data-hint="close">收起</button></div>`;
  save();
}
function openDialog(kicker, body) {
  if (!dialog.open) dialogReturnFocus = document.activeElement;
  $('#dialog-kicker').textContent = kicker;
  $('#dialog-body').innerHTML = body;
  if (!dialog.open) dialog.showModal();
}
function closeDialog() { dialog.close(); }
function help() {
  openDialog('初次调查 / HOW TO PLAY', `<h2 id="dialog-title">六个人，一张现场。</h2><p>你的任务是依据线索，找到每个人当时的位置，再解开这个现场独有的问题。</p><ol class="rules-list"><li><strong>每行、每列各一人。</strong>六个人分别占据六行和六列。人物都只占一个格子。</li><li><strong>线索全部为真。</strong>无需判断谁说谎；按证词一步步排除。</li><li><strong>看清场景。</strong>房间用色块和粗线分隔。家具格不可站立，椅子等可用位置会在格子信息中说明。</li><li><strong>“旁边”指上下左右。</strong>不包含斜角，且必须在同一区域。“东／西／南／北”只比较方向，不要求相邻。</li><li><strong>先选人物，再点格子。</strong>“笔记”记录可能的位置，“排除”画 ×；“擦除”和“撤销”让你随时修改。格子支持方向键移动。</li><li><strong>还原现场后结案。</strong>点击“推理案件答案”，结合任务规则作出最后判断。遇到困难可逐条查看提示。</li></ol><p class="subtle">无需登录。三个案件分别存档；清除浏览器数据会清除进度。</p><button type="button" class="primary-button" data-dialog-action="close">开始调查 →</button>`);
}
function check() {
  const p = puzzle(), s = state();
  if (s.solved) { showResult(); return; }
  const result = validatePlacement(p, s.placements);
  if (!result.valid) { feedback(result.errors[0] || '还有位置与线索不符，请重新核对。', 'error'); return; }
  if (!result.complete) { feedback(`目前没有发现规则冲突。还有 ${6 - Object.keys(s.placements).length} 人待定位；这不代表已放置的位置一定正确。`, 'success'); return; }
  chosenAnswer = null;
  openDialog('03 / 最后一问', `<h2 id="dialog-title">${escape(p.objectivePrompt)}</h2><p>${escape(p.objectiveRule)}</p><p class="subtle">现场位置已全部核对正确。根据上面的案件规则，作出最后判断。</p><div class="objective-options" role="group" aria-label="案件答案">${p.objectiveOptions.map(option => `<button type="button" class="objective-option" data-answer="${escape(option.id)}" aria-pressed="false"><strong>${escape(option.label)}</strong>${option.description ? `<span>${escape(option.description)}</span>` : ''}${option.cell !== undefined ? `<span>${coord(option.cell)}</span>` : ''}</button>`).join('')}</div><p id="answer-feedback" class="feedback" role="status"></p><button type="button" class="primary-button" data-dialog-action="submit" disabled>提交判断 →</button>`);
}
function submitAnswer() {
  if (chosenAnswer === null) return;
  const correct = deriveObjective(puzzle(), state().placements);
  if (chosenAnswer !== correct) { $('#answer-feedback').textContent = '这个判断还不符合案件规则。结合已还原的现场，再想一想。'; $('#answer-feedback').classList.add('is-error'); return; }
  state().solved = true; save(); renderPlay(); renderCases(); showResult();
}
function showResult() {
  const p = puzzle();
  const allSolved = cases.every(item => records[item.id].solved);
  openDialog('结案手记 / CASE CLOSED', `<div class="result-badge" aria-hidden="true">✓</div><h2 id="dialog-title" class="result-title">${escape(p.title)} · 已结案</h2><p class="result-copy">${escape(p.resolution)}</p><p class="subtle">${allSolved ? '三桩案件，三种真相。这一册手记已经写完了。' : `你已经完成 ${cases.filter(item => records[item.id].solved).length} / 3 桩案件。下一处现场，还有另一种谜题。`}</p><div class="result-actions"><button type="button" class="primary-button" data-dialog-action="next">${allSolved ? '回到手记' : '打开下一个案件 →'}</button><button type="button" class="secondary-button" data-dialog-action="close">查看现场</button></div>`);
}

$('#case-selector').addEventListener('click', event => { const button = event.target.closest('[data-case]'); if (button) chooseCase(Number(button.dataset.case)); });
$('#people-list').addEventListener('click', event => { const button = event.target.closest('[data-person]'); if (button) { selected = button.dataset.person; if (!['place','note'].includes(mode)) mode = 'place'; feedback(); renderPlay(); $(`#people-list [data-person="${selected}"]`).focus({ preventScroll: true }); } });
$('#person-picker').addEventListener('click', event => { const button = event.target.closest('[data-person]'); if (button) { selected = button.dataset.person; if (!['place','note'].includes(mode)) mode = 'place'; feedback(); renderPlay(); $(`#person-picker [data-person="${selected}"]`).focus({ preventScroll: true }); } });
$('#board').addEventListener('click', event => { const button = event.target.closest('[data-cell]'); if (button) editCell(Number(button.dataset.cell)); });
$('#board').addEventListener('keydown', event => {
  const cell = Number(event.target.dataset.cell);
  if (!Number.isInteger(cell)) return;
  const offsets = { ArrowUp: -6, ArrowDown: 6, ArrowLeft: -1, ArrowRight: 1 };
  if (!(event.key in offsets)) return;
  event.preventDefault();
  const next = cell + offsets[event.key];
  if (next >= 0 && next < 36 && (Math.abs(offsets[event.key]) === 6 || Math.floor(next / 6) === Math.floor(cell / 6))) $(`[data-cell="${next}"]`).focus();
});
document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => { mode = button.dataset.mode; feedback(); renderPlay(); }));
$('#undo-button').addEventListener('click', () => { const previous = histories[puzzle().id].pop(); if (previous) { records[puzzle().id] = previous; feedback('已撤销上一步。'); renderPlay(); renderCases(); renderHint(); } });
$('#reset-button').addEventListener('click', () => openDialog('重新调查', '<h2 id="dialog-title">重新整理这个现场？</h2><p>将清空本案的人物、笔记与结案状态，其他案件不受影响。清空后仍可用“撤销”恢复。</p><div class="result-actions"><button type="button" class="primary-button" data-dialog-action="reset">重新开始</button><button type="button" class="secondary-button" data-dialog-action="close">继续调查</button></div>'));
$('#hint-button').addEventListener('click', () => { hintOpen = !hintOpen; renderHint(); });
$('#hint-panel').addEventListener('click', event => { const button = event.target.closest('[data-hint]'); if (!button) return; if (button.dataset.hint === 'close') hintOpen = false; else state().hint = Math.max(0, Math.min(puzzle().hints.length - 1, state().hint + (button.dataset.hint === 'next' ? 1 : -1))); renderHint(); });
$('#help-button').addEventListener('click', help);
$('[data-action="help"]').addEventListener('click', help);
$('#check-button').addEventListener('click', check);
$('#dialog-close').addEventListener('click', closeDialog);
dialog.addEventListener('close', () => { if (dialogReturnFocus?.isConnected) dialogReturnFocus.focus({ preventScroll: true }); });
$('#dialog-body').addEventListener('click', event => {
  const answer = event.target.closest('[data-answer]');
  if (answer) { chosenAnswer = answer.dataset.answer; document.querySelectorAll('[data-answer]').forEach(button => { button.classList.toggle('is-selected', button === answer); button.setAttribute('aria-pressed', button === answer); }); $('[data-dialog-action="submit"]').disabled = false; $('#answer-feedback').textContent = ''; return; }
  const button = event.target.closest('[data-dialog-action]');
  if (!button) return;
  switch (button.dataset.dialogAction) {
    case 'close': closeDialog(); break;
    case 'submit': submitAnswer(); break;
    case 'reset': checkpoint(); records[puzzle().id] = fresh(); hintOpen = false; closeDialog(); feedback('现场已清空，可以重新开始。'); renderCase(); break;
    case 'next': {
      closeDialog(); const next = cases.findIndex(item => !records[item.id].solved);
      if (next !== -1) chooseCase(next);
      else $('#case-selector').scrollIntoView({ behavior: 'smooth', block: 'start' });
      break;
    }
  }
});
window.addEventListener('hashchange', () => { const index = cases.findIndex(item => item.id === location.hash.slice(1)); if (index !== -1 && index !== caseIndex) chooseCase(index); });
renderCase();
