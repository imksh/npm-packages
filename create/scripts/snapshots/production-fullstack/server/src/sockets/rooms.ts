/**
 * Room generator functions.
 * Using a consistent namespace pattern (e.g. user:<id>) ensures
 * that rooms don't overlap and can be easily managed or targeted.
 */

export const getUserRoom = (userId: string) => `user:${userId}`;
export const getInstitutionRoom = (institutionId: string) => `institution:${institutionId}`;
export const getClassRoom = (classId: string) => `class:${classId}`;
export const getSectionRoom = (sectionId: string) => `section:${sectionId}`;
export const getTopicRoom = (topic: string) => `topic:${topic}`;
