import type { Course, Lesson } from '../types/domain';
import { CORE_COURSES, CORE_LESSONS } from './curriculum_core';
import { PRO_COURSES, PRO_LESSONS } from './curriculum_pro';

export const COURSES: Course[] = [...CORE_COURSES, ...PRO_COURSES];
export const LESSONS: Lesson[] = [...CORE_LESSONS, ...PRO_LESSONS];

export function getLessonsForCourse(courseId: string): Lesson[] {
  return LESSONS.filter((l) => l.courseId === courseId).sort((a, b) => a.order - b.order);
}

export function getLessonById(lessonId: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === lessonId);
}

export function getCourseById(courseId: string): Course | undefined {
  return COURSES.find((c) => c.id === courseId);
}
