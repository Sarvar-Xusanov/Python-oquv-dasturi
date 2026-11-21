import type { Course, Lesson } from '../types/domain';
import { ALL_COURSES } from './courses_catalog';
import { ALL_LESSONS } from './lessons';

export const COURSES: Course[] = ALL_COURSES;
export const LESSONS: Lesson[] = ALL_LESSONS;

export function getLessonsForCourse(courseId: string): Lesson[] {
  return LESSONS.filter((l) => l.courseId === courseId).sort((a, b) => a.order - b.order);
}

export function getLessonById(lessonId: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === lessonId);
}

export function getCourseById(courseId: string): Course | undefined {
  return COURSES.find((c) => c.id === courseId);
}
