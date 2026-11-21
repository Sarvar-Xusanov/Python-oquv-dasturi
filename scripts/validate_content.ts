import { COURSES, LESSONS } from '../src/data/curriculum.ts';
import { EXERCISES } from '../src/data/exercises.ts';
import { DIAGNOSTIC_EXAM, EXAMINATIONS, GLOSSARY_TERMS, PROJECTS, VIDEO_CATALOG } from '../src/data/exams_and_projects.ts';
import { runPythonCode } from '../server/sandbox.ts';

async function main() {
  const errors: string[] = [];

  // 1. Unique ID checks
  const checkUnique = (label: string, ids: string[]) => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (seen.has(id)) {
        errors.push(`Duplicate ${label} ID: ${id}`);
      }
      seen.add(id);
    }
  };

  checkUnique('course', COURSES.map((c) => c.id));
  checkUnique('lesson', LESSONS.map((l) => l.id));
  checkUnique('exercise', EXERCISES.map((e) => e.id));
  checkUnique('exam', [DIAGNOSTIC_EXAM, ...EXAMINATIONS].map((e) => e.id));
  checkUnique('project', PROJECTS.map((p) => p.id));
  checkUnique('video', VIDEO_CATALOG.map((v) => v.id));
  checkUnique('glossary', GLOSSARY_TERMS.map((g) => g.id));

  // 2. Reference integrity & prerequisite DAG check
  const courseIds = new Set(COURSES.map((c) => c.id));
  const lessonIds = new Set(LESSONS.map((l) => l.id));
  const exerciseIds = new Set(EXERCISES.map((e) => e.id));
  const videoIds = new Set(VIDEO_CATALOG.map((v) => v.id));

  for (const c of COURSES) {
    for (const p of c.prerequisites) {
      if (!courseIds.has(p)) {
        errors.push(`Course ${c.id} references unknown prerequisite course: ${p}`);
      }
    }
  }

  for (const l of LESSONS) {
    if (!courseIds.has(l.courseId)) {
      errors.push(`Lesson ${l.id} references unknown courseId: ${l.courseId}`);
    }
    for (const p of l.prerequisites) {
      if (!lessonIds.has(p)) {
        errors.push(`Lesson ${l.id} references unknown prerequisite lesson: ${p}`);
      }
    }
    for (const v of l.relatedVideos) {
      if (!videoIds.has(v)) {
        errors.push(`Lesson ${l.id} references unknown videoId: ${v}`);
      }
    }
    for (const ex of l.relatedExercises) {
      if (!exerciseIds.has(ex)) {
        errors.push(`Lesson ${l.id} references unknown exerciseId: ${ex}`);
      }
    }
    if (!l.theory.uz.trim() || !l.theory.en.trim()) {
      errors.push(`Lesson ${l.id} is missing UZ or EN theory.`);
    }
  }

  // Cycle detection on lesson prerequisites
  const visitState = new Map<string, 'visiting' | 'done'>();
  const lessonMap = new Map(LESSONS.map((l) => [l.id, l]));
  const dfs = (id: string, stack: string[]) => {
    const st = visitState.get(id);
    if (st === 'visiting') {
      errors.push(`Cycle detected in lesson prerequisites: ${[...stack, id].join(' -> ')}`);
      return;
    }
    if (st === 'done') return;
    visitState.set(id, 'visiting');
    const lesson = lessonMap.get(id);
    if (lesson) {
      for (const p of lesson.prerequisites) {
        dfs(p, [...stack, id]);
      }
    }
    visitState.set(id, 'done');
  };
  for (const l of LESSONS) {
    dfs(l.id, []);
  }

  // 3. Execute all lesson code examples in Python sandbox and verify expectedOutput
  let totalExamples = 0;
  let verifiedExamples = 0;
  for (const l of LESSONS) {
    for (const ex of l.examples) {
      totalExamples += 1;
      const res = await runPythonCode(ex.code);
      if (res.exitCode !== 0 || res.timedOut || res.blockedReason) {
        errors.push(`Example "${ex.title.en}" in ${l.id} failed execution: ${res.stderr}`);
        continue;
      }
      if (ex.expectedOutput !== undefined) {
        const actual = res.stdout.trim().replace(/\r\n/g, '\n');
        const expected = ex.expectedOutput.trim().replace(/\r\n/g, '\n');
        if (actual !== expected) {
          errors.push(
            `Output mismatch in ${l.id} ("${ex.title.en}"):\n  expected: ${JSON.stringify(expected)}\n  actual:   ${JSON.stringify(actual)}`,
          );
          continue;
        }
      }
      verifiedExamples += 1;
    }
  }

  const v2ReviewedCount = LESSONS.filter((l) => l.contentVersion === '2.0').length;
  const totalQuizQuestions = LESSONS.reduce((s, l) => s + l.quiz.length, 0);

  console.log('=== Python Mastery Content & Pedagogy Audit ===');
  console.log(`Courses:              ${COURSES.length}`);
  console.log(`Modules:              ${COURSES.reduce((s, c) => s + c.modules.length, 0)}`);
  console.log(`Lessons (total):      ${LESSONS.length}`);
  console.log(`  - v2.0 full-depth:  ${v2ReviewedCount}`);
  console.log(`  - standard v1:      ${LESSONS.length - v2ReviewedCount}`);
  console.log(`Verified examples:    ${verifiedExamples}/${totalExamples}`);
  console.log(`Quiz questions:       ${totalQuizQuestions}`);
  console.log(`Exercises:            ${EXERCISES.length}`);
  console.log(`Examinations:         ${EXAMINATIONS.length + 1} (incl. diagnostic)`);
  console.log(`Projects:             ${PROJECTS.length}`);
  console.log(`Video resources:      ${VIDEO_CATALOG.length}`);
  console.log(`Glossary terms:       ${GLOSSARY_TERMS.length}`);

  if (errors.length > 0) {
    console.error('\nValidation Errors:');
    for (const err of errors) {
      console.error(` - ${err}`);
    }
    process.exit(1);
  }

  console.log('\nPASS: All IDs, DAG prerequisites, references, and Python code examples verified.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
