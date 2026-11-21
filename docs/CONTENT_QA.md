# Content QA & Automated Validation Workflow

Run the automated content validator before any release:

```bash
npm run validate:content
```

## Automated Checks Performed (`scripts/validate_content.ts`)
1. **Unique ID Enforcement**: verifies zero duplicate IDs across courses, lessons, exercises, exams, projects, videos, and glossary entries.
2. **Reference Integrity**: checks that every `courseId`, `prerequisites`, `relatedVideos`, and `relatedExercises` entry resolves to an existing record.
3. **Prerequisite DAG Cycle Detection**: performs depth-first search over all lesson prerequisites to guarantee zero dependency cycles.
4. **Live Python 3 Execution Check**: runs every lesson code example inside the isolated `python -I -B` sandbox and verifies exit code `0` and exact `expectedOutput` match.
5. **Honest Status Accounting**: reports exact counts separating `v2.0 full-depth` lessons from standard `v1` lessons so progress metrics are never inflated.
