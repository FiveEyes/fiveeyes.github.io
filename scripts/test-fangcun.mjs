import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// The blog intentionally has no package.json. Load the browser ES module as-is.
const source = await readFile(new URL('../assets/games/fangcun/puzzles.js', import.meta.url), 'utf8');
const { cases, solvePuzzle, validatePlacement, candidateCells, deriveObjective } =
  await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

const normalize = (value) => Object.fromEntries(Object.entries(value).sort());

// Pairwise candidate elimination models human deductions: eliminate a candidate
// if another person's remaining possibilities all clash with it. No branching,
// solution enumeration, answer lookup, or trial placement is used here.
function deduceWithoutGuessing(puzzle) {
  const domains = Object.fromEntries(puzzle.people.map(({ id }) => [id, candidateCells(puzzle, {}, id)]));
  let changed = true;
  while (changed) {
    changed = false;
    for (const { id } of puzzle.people) {
      const remaining = domains[id].filter((at) => puzzle.people.every(({ id: other }) =>
        id === other || domains[other].some((there) =>
          validatePlacement(puzzle, { [id]: at, [other]: there }).valid)));
      if (remaining.length !== domains[id].length) { domains[id] = remaining; changed = true; }
    }
  }
  return domains;
}

assert.equal(cases.length, 3);
assert.equal(new Set(cases.map(({ id }) => id)).size, 3);
assert.equal(new Set(cases.map(({ objective }) => objective.type)).size, 3, 'case goals must differ');

for (const puzzle of cases) {
  assert.equal(puzzle.cells.length, 36, `${puzzle.id}: board dimensions`);
  assert.equal(puzzle.people.length, 6);
  assert.equal(new Set(puzzle.people.map(({ id }) => id)).size, 6);
  assert.ok(puzzle.cells.every(({ room }) => puzzle.rooms.some(({ id }) => room === id)));
  assert.ok(puzzle.people.every(({ clue }) => clue.length > 0));
  assert.ok(puzzle.objectiveOptions.some(({ id }) => id === puzzle.answer));
  assert.deepEqual(validatePlacement(puzzle, {}), { complete: false, valid: true, errors: [] });

  const solutions = solvePuzzle(puzzle);
  assert.equal(solutions.length, 1, `${puzzle.id}: exactly one arrangement`);
  assert.deepEqual(normalize(solutions[0]), normalize(puzzle.solution));
  assert.deepEqual(validatePlacement(puzzle, puzzle.solution), { complete: true, valid: true, errors: [] });
  assert.equal(deriveObjective(puzzle, solutions[0]), puzzle.answer);

  const domains = deduceWithoutGuessing(puzzle);
  for (const { id } of puzzle.people) {
    assert.deepEqual(domains[id], [puzzle.solution[id]], `${puzzle.id}/${id}: solvable by elimination, without guessing`);
  }

  // Canonical answer data is documentation only; neither solver nor checker may
  // secretly consult it, and the case answer must follow its published rule.
  const misleadingReference = { ...puzzle, solution: {}, answer: 'deliberately-wrong' };
  assert.deepEqual(normalize(solvePuzzle(misleadingReference)[0]), normalize(puzzle.solution));
  assert.equal(deriveObjective(misleadingReference, puzzle.solution), puzzle.answer);
  assert.equal(validatePlacement(misleadingReference, puzzle.solution).valid, true);

  const partial = {};
  for (const { id } of puzzle.people) {
    assert.ok(candidateCells(puzzle, partial, id).includes(puzzle.solution[id]));
    assert.equal(deriveObjective(puzzle, partial), null, 'do not reveal an objective from an unfinished board');
    partial[id] = puzzle.solution[id];
    assert.equal(validatePlacement(puzzle, partial).valid, true);
  }
  assert.equal(validatePlacement(puzzle, partial).complete, true);
  assert.deepEqual(normalize(solvePuzzle(puzzle, 2, { A: puzzle.solution.A })[0]), normalize(puzzle.solution));

  const blocked = puzzle.cells.findIndex(({ walkable }) => !walkable);
  assert.equal(validatePlacement(puzzle, { A: blocked }).valid, false);
  assert.equal(validatePlacement(puzzle, { A: puzzle.solution.A, B: puzzle.solution.A }).valid, false);
  assert.equal(validatePlacement(puzzle, { A: 36 }).valid, false);
  assert.equal(validatePlacement(puzzle, { A: -1 }).valid, false);
  assert.equal(validatePlacement(puzzle, { A: '1' }).valid, false);
  assert.equal(validatePlacement(puzzle, { X: 1 }).valid, false);
  assert.equal(validatePlacement(puzzle, { A: null }).valid, true);
  assert.deepEqual(solvePuzzle(puzzle, 0), []);
  assert.deepEqual(solvePuzzle(puzzle, 2, { A: blocked }), []);
  assert.deepEqual(candidateCells(puzzle, {}, 'X'), []);
  assert.equal(deriveObjective(puzzle, { ...puzzle.solution, B: puzzle.solution.A }), null);

  for (const hint of puzzle.hints) {
    assert.ok(hint.text.length > 15);
    if (hint.person) assert.equal(hint.cell, puzzle.solution[hint.person], `${puzzle.id}: hint agrees with solution`);
  }

  // Every one-cell deviation from the completed solution must be rejected. This
  // checks the actual feedback path, including rows, columns, furniture & clues.
  for (const { id } of puzzle.people) {
    for (let cell = 0; cell < 36; cell += 1) {
      if (cell !== puzzle.solution[id]) {
        assert.equal(validatePlacement(puzzle, { ...puzzle.solution, [id]: cell }).valid, false);
      }
    }
  }

  console.log(`✓ ${puzzle.title}: unique solution, human deductions, objective, candidates and feedback`);
}

// Explicit edge cases for adjacency: diagonals, row wrapping, room boundaries.
const adjacencyFixture = {
  ...cases[0],
  cells: Array.from({ length: 36 }, (_, i) => ({ room: i === 11 ? 'b' : 'a', walkable: true, ...(i === 5 ? { id: 'target', object: 'box' } : {}) })),
  constraints: [{ type: 'adjacent', person: 'A', target: 'target' }],
};
assert.equal(validatePlacement(adjacencyFixture, { A: 4 }).valid, true);
assert.equal(validatePlacement(adjacencyFixture, { A: 6 }).valid, false, 'no wrapping across row ends');
assert.equal(validatePlacement(adjacencyFixture, { A: 10 }).valid, false, 'no diagonal adjacency');
assert.equal(validatePlacement(adjacencyFixture, { A: 11 }).valid, false, 'no adjacency across regions');
assert.equal(validatePlacement({ ...adjacencyFixture, constraints: [{ ...adjacencyFixture.constraints[0], sameRoom: false }] }, { A: 11 }).valid, true);

// The objective evaluator must refuse ambiguous or unmet goal conditions.
assert.equal(deriveObjective({ ...cases[0], objective: { type: 'soleOccupant', room: 'b' } }, cases[0].solution), null);
assert.equal(deriveObjective({ ...cases[1], objectiveOptions: [...cases[1].objectiveOptions, { id: 'duplicate-safe', cell: 17 }] }, cases[1].solution), null);
assert.equal(deriveObjective({ ...cases[2], objective: { type: 'overCapacity', capacity: 3 } }, cases[2].solution), null);

console.log('✓ Adjacency boundaries and ambiguous-objective handling');
console.log('All 方寸疑案 puzzle checks passed.');
