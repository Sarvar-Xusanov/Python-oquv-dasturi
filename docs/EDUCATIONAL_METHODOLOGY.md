# Educational Methodology — Python Mastery v2.0

## 1. Learning Cycle
Every lesson and concept follows the 7-step cycle:
`UNDERSTAND -> OBSERVE -> PRACTICE -> SOLVE -> TEST -> REVIEW -> BUILD`

Reading theory or watching an external video alone does not verify programming competence. Learners demonstrate understanding through runnable code examples, knowledge-check quizzes, auto-graded exercises, checkpoint exams, and multi-milestone projects.

## 2. Teaching Language Policy
- Primary instructional language: clear, grammatically consistent **Uzbek (Latin script)**, with full **English** parity for UI and core lessons.
- Python keywords (`if`, `elif`, `def`, `class`, `yield`, `return`) and standard technical terms remain in English and are explained in Uzbek on first introduction.

## 3. 6-State Mastery & Spaced Repetition Model
Mastery is tracked per `concept_id` in `knowledge_mastery`:
- `not_started`: no assessed activity yet
- `learning` (`< 40%`): initial exposure, needs foundational reinforcement
- `practicing` (`40% – 64%`): active exercises/quizzes required
- `needs_review` (`< 70%` or spaced interval elapsed): surfaced in Dashboard **Review Queue**
- `proficient` (`70% – 89%`, within interval): solid working grasp
- `mastered` (`>= 90%`, within interval): demonstrated via quiz/exercise/exam evidence

Spaced review intervals adapt to mastery level: `1 -> 3 -> 7 -> 14 -> 30 days`.
