/**
 * 方寸疑案 — original, data-driven spatial deduction cases.
 * Cells are zero-based, row-major indices on a 6 × 6 board.
 * A person occupies one walkable cell; all people have distinct rows/columns.
 * Constraints (all truthful):
 * room: person is in room; object: stands/sits on an object of this kind;
 * adjacent: orthogonally next to an object kind or a specific cell id (target),
 *           in the same room unless sameRoom:false is explicitly supplied;
 * row/column: zero-based coordinate; relative: strict coordinate comparison,
 *             without requiring a shared row/column;
 * sameRoom/alone/roomCount: room membership or exact occupancy constraints.
 * The solver and feedback use constraints, never the stored reference solution.
 */

const SIZE = 6;
const palette = ['#9a572f', '#426f75', '#8a5b80', '#60734c', '#b57537', '#596a9a'];
const coords = (index) => ({ row: Math.floor(index / SIZE), column: index % SIZE });
const neighbors = (a, b) => {
  const x = coords(a), y = coords(b);
  return Math.abs(x.row - y.row) + Math.abs(x.column - y.column) === 1;
};

function makeCells(roomRows, objects) {
  return roomRows.flatMap((row) => row.split('')).map((room, index) => ({
    room,
    walkable: true,
    ...(objects[index] || {}),
  }));
}

function person(id, name, role, clue) {
  return { id, name, role, clue, color: palette[id.charCodeAt(0) - 65] };
}

const teaPeople = [
  person('A', '阿岚', '说书人', '我紧挨着书架，而且比小陶更靠北。'),
  person('B', '小陶', '茶艺师', '停电的时候，我正坐在一把椅子上。'),
  person('C', '陈叔', '常客', '我挨着茶炉，在小陶的东边。'),
  person('D', '杜师傅', '修缮师', '我坐在院子里的长凳上。'),
  person('E', '叶青', '画师', '我在院子里，紧挨着茶桌。'),
  person('F', '方姨', '店主', '我在院子里，紧挨着盆栽。'),
];

export const cases = [
  {
    id: 'teahouse', number: '01', title: '茶馆失印', subtitle: '雨停之前，找回那枚旧印章',
    location: '听雨茶馆', difficulty: '入门', duration: '5–8 分钟', accent: '#a96735',
    intro: '雨夜短暂停电后，茶馆的旧印章不见了。六位客人都记得自己当时的位置；他们说的全是真话。还原现场，找出是谁暂时收走了印章。',
    mission: '找出收走印章的人',
    objectiveRule: '监控确认：印章由当时独自待在藏书间的人收走。先还原六人的位置，再找出藏书间唯一的人。',
    objectivePrompt: '谁收走了旧印章？',
    objective: { type: 'soleOccupant', room: 'a' },
    objectiveOptions: teaPeople.map(({ id, name, role }) => ({ id, label: name, description: role })),
    people: teaPeople,
    rooms: [
      { id: 'a', name: '藏书间', color: '#e9d8bd' },
      { id: 'b', name: '茶厅', color: '#e9e0ce' },
      { id: 'c', name: '小院', color: '#dce3ce' },
    ],
    cells: makeCells(['aaabbb', 'aaabbb', 'aaabbb', 'cccccc', 'cccccc', 'cccccc'], {
      0: { object: 'shelf', label: '书架', walkable: false },
      2: { object: 'table', label: '茶桌', walkable: false },
      3: { object: 'table', label: '茶桌', walkable: false },
      4: { object: 'chair', label: '椅子' },
      8: { object: 'shelf', label: '书架', walkable: false },
      10: { object: 'chair', label: '椅子' },
      12: { object: 'chair', label: '椅子' },
      14: { object: 'table', label: '茶桌', walkable: false },
      16: { object: 'tea', label: '茶炉', walkable: false },
      18: { object: 'bench', label: '长凳' },
      19: { object: 'shelf', label: '院中书架', walkable: false },
      25: { object: 'table', label: '院中茶桌', walkable: false },
      34: { object: 'plant', label: '盆栽', walkable: false },
    }),
    constraints: [
      { type: 'adjacent', person: 'A', object: 'shelf' },
      { type: 'relative', person: 'A', other: 'B', direction: 'north' },
      { type: 'object', person: 'B', object: 'chair' },
      { type: 'adjacent', person: 'C', object: 'tea' },
      { type: 'relative', person: 'C', other: 'B', direction: 'east' },
      { type: 'room', person: 'D', room: 'c' },
      { type: 'object', person: 'D', object: 'bench' },
      { type: 'room', person: 'E', room: 'c' },
      { type: 'adjacent', person: 'E', object: 'table' },
      { type: 'room', person: 'F', room: 'c' },
      { type: 'adjacent', person: 'F', object: 'plant' },
    ],
    hints: [
      { text: '先看杜师傅：院中只有一张长凳，位于第 4 行第 1 列。他的位置可以直接确定。', person: 'D', cell: 18 },
      { text: '杜师傅占了第 1 列，藏书间的椅子不能再坐人。小陶只能坐茶厅的两把椅子之一，两把都在第 5 列。' },
      { text: '陈叔在小陶东边，只能到第 6 列。茶炉右侧的第 3 行第 6 列就是他的位置。', person: 'C', cell: 17 },
      { text: '盆栽旁有三个位置：北侧占用小陶必在的第 5 列，东侧占用陈叔的第 6 列。方姨只能在盆栽西侧，第 6 行第 4 列。', person: 'F', cell: 33 },
      { text: '院中茶桌的西侧被杜师傅占用了同一列，南侧被方姨占用了同一行，北侧是书架。叶青只能站在东侧，第 5 行第 3 列。', person: 'E', cell: 26 },
      { text: '阿岚不能与杜师傅同在第 4 行，所以只能在藏书间的书架旁。第 1 列已被占用，他剩下第 1 或第 2 行第 2 列。' },
      { text: '阿岚比小陶靠北，而两人都只剩第 1、2 行可用。因此阿岚在第 1 行第 2 列，小陶在第 2 行第 5 列。', person: 'A', cell: 1 },
      { text: '查看藏书间：这里只有阿岚一人。根据监控提供的规则，收走印章的人就是阿岚。' },
    ],
    solution: { A: 1, B: 10, C: 17, D: 18, E: 26, F: 33 },
    answer: 'A',
    resolution: '藏书间只有阿岚。原来雨水从窗缝渗进来，他把印章收进了防水袋，准备交给店主。位置还原了，一个小误会也解开了。',
  },
  {
    id: 'night-market', number: '02', title: '夜市寻猫', subtitle: '循着鱼干香气，找回小橘',
    location: '灯笼夜市', difficulty: '进阶', duration: '6–10 分钟', accent: '#b46543',
    intro: '收摊铃刚响，夜市的小橘猫钻进了纸箱。六位摊主记得铃响时的位置。把他们放回现场，就能找出小橘躲在哪个箱子里。',
    mission: '找出小橘藏身的纸箱',
    objectiveRule: '小橘只躲在三个纸箱中的一个，而且那个纸箱上下左右紧邻的格子都没有人。跨区域不算紧邻。',
    objectivePrompt: '小橘躲在哪个纸箱里？',
    objective: { type: 'quietHideout', sameRoom: true },
    objectiveOptions: [
      { id: 'box-north', label: '北侧纸箱', description: '鱼摊区 · 第 1 行第 5 列', cell: 4 },
      { id: 'box-snack', label: '小吃纸箱', description: '小吃区 · 第 2 行第 2 列', cell: 7 },
      { id: 'box-south', label: '南侧纸箱', description: '鱼摊区 · 第 3 行第 6 列', cell: 17 },
    ],
    people: [
      person('A', '阿灯', '灯笼摊主', '我在鱼摊区，紧挨着北侧纸箱。'),
      person('B', '包姐', '点心摊主', '我在小吃区，坐在长凳上。'),
      person('C', '程哥', '糖画师', '我在小吃区最南边的一排，也就是第 3 行。'),
      person('D', '豆豆', '送货员', '我在备货区，坐在长凳上。'),
      person('E', '叶叔', '花摊摊主', '我在备货区，紧挨着盆栽。'),
      person('F', '冯姨', '鱼摊摊主', '我在备货区，紧挨着鱼摊。'),
    ],
    rooms: [
      { id: 'a', name: '小吃区', color: '#e9d6c0' },
      { id: 'b', name: '鱼摊区', color: '#d4e1df' },
      { id: 'c', name: '备货区', color: '#e4ddc7' },
    ],
    cells: makeCells(['aaabbb', 'aaabbb', 'aaabbb', 'cccccc', 'cccccc', 'cccccc'], {
      0: { object: 'table', label: '点心桌', walkable: false },
      2: { object: 'awning', label: '摊架', walkable: false },
      4: { id: 'box-north', object: 'box', label: '北侧纸箱', walkable: false },
      6: { object: 'bench', label: '长凳' },
      7: { id: 'box-snack', object: 'box', label: '小吃纸箱', walkable: false },
      9: { object: 'fish', label: '鱼摊', walkable: false },
      16: { object: 'table', label: '摊桌', walkable: false },
      17: { id: 'box-south', object: 'box', label: '南侧纸箱', walkable: false },
      20: { object: 'table', label: '备货桌', walkable: false },
      21: { object: 'bench', label: '长凳' },
      25: { object: 'fish', label: '鱼摊', walkable: false },
      27: { object: 'bench', label: '长凳' },
      32: { object: 'table', label: '备货桌', walkable: false },
      34: { object: 'plant', label: '盆栽', walkable: false },
    }),
    constraints: [
      { type: 'room', person: 'A', room: 'b' },
      { type: 'adjacent', person: 'A', target: 'box-north' },
      { type: 'room', person: 'B', room: 'a' },
      { type: 'object', person: 'B', object: 'bench' },
      { type: 'room', person: 'C', room: 'a' },
      { type: 'row', person: 'C', row: 2 },
      { type: 'room', person: 'D', room: 'c' },
      { type: 'object', person: 'D', object: 'bench' },
      { type: 'room', person: 'E', room: 'c' },
      { type: 'adjacent', person: 'E', object: 'plant' },
      { type: 'room', person: 'F', room: 'c' },
      { type: 'adjacent', person: 'F', object: 'fish' },
    ],
    hints: [
      { text: '包姐在小吃区坐长凳。这个区域只有一张长凳，在第 2 行第 1 列。', person: 'B', cell: 6 },
      { text: '豆豆的两张候选长凳都在备货区的第 4 列。虽然暂时不能确定在哪一行，但这整列已经属于豆豆。' },
      { text: '北侧纸箱旁有三个格子：西侧与豆豆同列，南侧与包姐同行。阿灯只能在东侧，第 1 行第 6 列。', person: 'A', cell: 5 },
      { text: '盆栽旁的西侧与豆豆同列，东侧与阿灯同列。叶叔只能在北侧，第 5 行第 5 列。', person: 'E', cell: 28 },
      { text: '叶叔占据第 5 行，豆豆不能再坐这一行的长凳。他在第 4 行第 4 列。', person: 'D', cell: 21 },
      { text: '备货区鱼摊旁，北侧与豆豆同行，西侧与包姐同列，东侧与叶叔同行。冯姨只能在南侧，第 6 行第 2 列。', person: 'F', cell: 31 },
      { text: '程哥在小吃区第 3 行；第 1 列属于包姐，第 2 列属于冯姨。因此他在第 3 行第 3 列。', person: 'C', cell: 14 },
      { text: '北侧纸箱紧挨阿灯，小吃纸箱紧挨包姐。只有鱼摊区的南侧纸箱四周没有人，小橘就躲在那里。' },
    ],
    solution: { A: 5, B: 6, C: 14, D: 21, E: 28, F: 31 },
    answer: 'box-south',
    resolution: '北侧纸箱旁有阿灯，小吃纸箱旁有包姐。只有南侧纸箱符合没有人紧邻的条件。掀开箱盖，小橘正抱着一小包鱼干打盹。',
  },
  {
    id: 'night-train', number: '03', title: '夜车断电', subtitle: '复原乘客位置，找出跳闸的配电箱',
    location: '山海夜行列车', difficulty: '进阶', duration: '6–10 分钟', accent: '#52747b',
    intro: '夜行列车的一组阅读灯突然熄灭。六位乘客的位置决定了各区域的用电负载。根据他们的回忆还原座次，找出需要复位的配电箱。',
    mission: '找出跳闸的配电箱',
    objectiveRule: '这是列车检修用的模拟线路：每位乘客开启一盏阅读灯，每个区域的配电箱最多支持两盏。超过两人的区域会跳闸；本次只有一处跳闸。',
    objectivePrompt: '应该复位哪个区域的配电箱？',
    objective: { type: 'overCapacity', capacity: 2 },
    objectiveOptions: [
      { id: 'panel-front', label: '前段配电箱', description: '容量：2 盏阅读灯', room: 'a', cell: 7 },
      { id: 'panel-middle', label: '中段配电箱', description: '容量：2 盏阅读灯', room: 'b', cell: 20 },
      { id: 'panel-rear', label: '后段配电箱', description: '容量：2 盏阅读灯', room: 'c', cell: 28 },
    ],
    people: [
      person('A', '安宁', '摄影师', '我在中段，紧挨着行李。'),
      person('B', '白露', '学生', '我在后段，紧挨着最北边的那件行李。'),
      person('C', '陈星', '列车员', '我在中段，紧挨着配电箱。'),
      person('D', '冬青', '作家', '我坐在中段的座椅上。'),
      person('E', '恩雅', '旅人', '我在后段，紧挨着车门。'),
      person('F', '方远', '工程师', '我坐在前段的座椅上。'),
    ],
    rooms: [
      { id: 'a', name: '前段', color: '#dbe1d4' },
      { id: 'b', name: '中段', color: '#d3e0e4' },
      { id: 'c', name: '后段', color: '#e4d9d0' },
    ],
    cells: makeCells(['aaabbc', 'aabbcc', 'aabbcc', 'abbbcc', 'abbccc', 'aabbcc'], {
      0: { object: 'seat', label: '座椅' },
      1: { object: 'plant', label: '盆栽', walkable: false },
      2: { object: 'table', label: '折叠桌', walkable: false },
      3: { object: 'seat', label: '座椅' },
      6: { object: 'seat', label: '座椅' },
      7: { id: 'panel-front', object: 'panel', label: '前段配电箱', walkable: false },
      9: { object: 'seat', label: '座椅' },
      11: { id: 'luggage-north', object: 'luggage', label: '后段北侧行李', walkable: false },
      12: { object: 'table', label: '折叠桌', walkable: false },
      15: { object: 'luggage', label: '行李', walkable: false },
      18: { object: 'table', label: '折叠桌', walkable: false },
      20: { id: 'panel-middle', object: 'panel', label: '中段配电箱', walkable: false },
      28: { id: 'panel-rear', object: 'panel', label: '后段配电箱', walkable: false },
      30: { object: 'seat', label: '座椅' },
      32: { object: 'table', label: '折叠桌', walkable: false },
      34: { object: 'luggage', label: '行李', walkable: false },
      35: { object: 'door', label: '车门', walkable: false },
    }),
    constraints: [
      { type: 'room', person: 'A', room: 'b' },
      { type: 'adjacent', person: 'A', object: 'luggage' },
      { type: 'room', person: 'B', room: 'c' },
      { type: 'adjacent', person: 'B', target: 'luggage-north' },
      { type: 'room', person: 'C', room: 'b' },
      { type: 'adjacent', person: 'C', object: 'panel' },
      { type: 'room', person: 'D', room: 'b' },
      { type: 'object', person: 'D', object: 'seat' },
      { type: 'room', person: 'E', room: 'c' },
      { type: 'adjacent', person: 'E', object: 'door' },
      { type: 'room', person: 'F', room: 'a' },
      { type: 'object', person: 'F', object: 'seat' },
    ],
    hints: [
      { text: '恩雅在后段车门旁。车门西侧是行李，唯一能站人的相邻格是北侧，第 5 行第 6 列。', person: 'E', cell: 29 },
      { text: '后段北侧行李的上、下两格都与恩雅同在第 6 列。白露只能在行李西侧，第 2 行第 5 列。', person: 'B', cell: 10 },
      { text: '中段两张座椅分别在第 1、2 行第 4 列。第 2 行已有白露，所以冬青在第 1 行第 4 列。', person: 'D', cell: 3 },
      { text: '前段三张座椅都在第 1 列。第 1 行已有冬青，第 2 行已有白露，方远只能在第 6 行第 1 列。', person: 'F', cell: 30 },
      { text: '中段行李的北侧、南侧都在冬青占用的第 4 列，东侧属于后段。安宁只能在西侧，第 3 行第 3 列。', person: 'A', cell: 14 },
      { text: '中段配电箱的北侧、南侧都在安宁占用的第 3 列，东侧在冬青的第 4 列。陈星只能在西侧，第 4 行第 2 列。', person: 'C', cell: 19 },
      { text: '数一数各区域的人数：前段 1 人，后段 2 人，中段 3 人。只有中段超过两盏灯的容量，应复位中段配电箱。' },
    ],
    solution: { A: 14, B: 10, C: 19, D: 3, E: 29, F: 30 },
    answer: 'panel-middle',
    resolution: '前段 1 人，后段 2 人，中段 3 人。中段同时开启了三盏阅读灯，超过两盏的模拟容量，因此只有中段配电箱跳闸。列车员调整了分配，阅读灯重新亮起。',
  },
];

const placed = (placements, id) => Number.isInteger(placements[id]);
const nameOf = (puzzle, id) => puzzle.people.find((p) => p.id === id)?.name || id;

function matchesConstraint(puzzle, placements, constraint, complete) {
  const { type, person: id, other } = constraint;
  const at = placements[id];
  if (type === 'roomCount') {
    const count = Object.values(placements).filter((cell) => Number.isInteger(cell) && puzzle.cells[cell]?.room === constraint.room).length;
    return count <= constraint.count && (!complete || count === constraint.count);
  }
  if (!placed(placements, id)) return true;
  const cell = puzzle.cells[at];
  if (!cell) return false;
  switch (type) {
    case 'room': return cell.room === constraint.room;
    case 'object': return cell.object === constraint.object;
    case 'row': return coords(at).row === constraint.row;
    case 'column': return coords(at).column === constraint.column;
    case 'adjacent':
      return puzzle.cells.some((target, index) =>
        (constraint.target ? target.id === constraint.target : target.object === constraint.object)
        && neighbors(at, index)
        && (constraint.sameRoom === false || target.room === cell.room));
    case 'relative': {
      if (!placed(placements, other)) return true;
      const a = coords(at), b = coords(placements[other]);
      return ({ north: a.row < b.row, south: a.row > b.row, west: a.column < b.column, east: a.column > b.column })[constraint.direction] === true;
    }
    case 'sameRoom': return !placed(placements, other) || cell.room === puzzle.cells[placements[other]]?.room;
    case 'alone': return !puzzle.people.some((p) => p.id !== id && placed(placements, p.id) && puzzle.cells[placements[p.id]]?.room === cell.room);
    default: throw new Error(`Unknown constraint type: ${type}`);
  }
}

/** Reports only contradictions to stated rules, never compares to solution. */
export function validatePlacement(puzzle, placements = {}) {
  const errors = [];
  const people = new Set(puzzle.people.map(({ id }) => id));
  const rows = new Map(), columns = new Map();
  let count = 0;
  for (const [id, at] of Object.entries(placements)) {
    if (at === null || at === undefined) continue;
    if (!people.has(id)) { errors.push(`未知人物：${id}。`); continue; }
    if (!Number.isInteger(at) || at < 0 || at >= puzzle.cells.length) { errors.push(`${nameOf(puzzle, id)}的位置不在地图上。`); continue; }
    count += 1;
    if (!puzzle.cells[at].walkable) errors.push(`${nameOf(puzzle, id)}不能站在${puzzle.cells[at].label || '障碍物'}上。`);
    const { row, column } = coords(at);
    if (rows.has(row)) errors.push(`${nameOf(puzzle, id)}与${nameOf(puzzle, rows.get(row))}在同一行。`);
    if (columns.has(column)) errors.push(`${nameOf(puzzle, id)}与${nameOf(puzzle, columns.get(column))}在同一列。`);
    rows.set(row, id); columns.set(column, id);
  }
  const complete = count === puzzle.people.length;
  // Invalid indices cannot safely participate in relational predicates.
  if (errors.some((text) => text.includes('地图') || text.includes('未知人物'))) return { complete, valid: false, errors };
  for (const constraint of puzzle.constraints) {
    if (!matchesConstraint(puzzle, placements, constraint, complete)) {
      const message = constraint.person
        ? `${nameOf(puzzle, constraint.person)}的位置不符合自己的线索。`
        : '区域人数不符合线索。';
      if (!errors.includes(message)) errors.push(message);
    }
  }
  return { complete, valid: errors.length === 0, errors };
}

/** Direct-rule candidates; other positions remain fixed. No answer lookup. */
export function candidateCells(puzzle, placements, personId) {
  if (!puzzle.people.some(({ id }) => id === personId)) return [];
  return puzzle.cells.flatMap((cell, index) => cell.walkable
    && validatePlacement(puzzle, { ...placements, [personId]: index }).valid ? [index] : []);
}

/** Enumerates at most limit solutions, optionally extending a partial board. */
export function solvePuzzle(puzzle, limit = 2, placements = {}) {
  if (!Number.isInteger(limit) || limit < 1) return [];
  if (!validatePlacement(puzzle, placements).valid) return [];
  const results = [];
  function visit(current) {
    if (results.length >= limit) return;
    const remaining = puzzle.people.filter(({ id }) => !placed(current, id));
    if (!remaining.length) { results.push({ ...current }); return; }
    let selected = null, candidates = [];
    for (const p of remaining) {
      const available = candidateCells(puzzle, current, p.id);
      if (!available.length) return;
      if (!selected || available.length < candidates.length) { selected = p; candidates = available; }
    }
    for (const at of candidates) {
      visit({ ...current, [selected.id]: at });
      if (results.length >= limit) return;
    }
  }
  visit(Object.fromEntries(Object.entries(placements).filter(([, at]) => Number.isInteger(at))));
  return results;
}

/** Compute the case's answer from positions and its published objective rule. */
export function deriveObjective(puzzle, placements) {
  const status = validatePlacement(puzzle, placements);
  if (!status.complete || !status.valid) return null;
  const positions = puzzle.people.map(({ id }) => ({ id, at: placements[id] }));
  let matching;
  switch (puzzle.objective.type) {
    case 'soleOccupant':
      matching = positions.filter(({ at }) => puzzle.cells[at].room === puzzle.objective.room).map(({ id }) => id);
      break;
    case 'quietHideout':
      matching = puzzle.objectiveOptions.filter(({ cell }) => !positions.some(({ at }) =>
        neighbors(at, cell) && (!puzzle.objective.sameRoom || puzzle.cells[at].room === puzzle.cells[cell].room))).map(({ id }) => id);
      break;
    case 'overCapacity':
      matching = puzzle.objectiveOptions.filter((option) => {
        const room = option.room || puzzle.cells[option.cell].room;
        return positions.filter(({ at }) => puzzle.cells[at].room === room).length > (option.capacity ?? puzzle.objective.capacity);
      }).map(({ id }) => id);
      break;
    default: throw new Error(`Unknown objective type: ${puzzle.objective.type}`);
  }
  return matching.length === 1 ? matching[0] : null;
}

export default cases;
