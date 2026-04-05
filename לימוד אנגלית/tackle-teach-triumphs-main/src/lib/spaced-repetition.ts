// Returns days until next review based on mastery level
export const getNextReviewDays = (mastery: number): number => {
  const schedule: Record<number, number> = {
    0: 0,
    1: 1,
    2: 3,
    3: 7,
    4: 14,
    5: 999, // mastered
  };
  return schedule[mastery] ?? 0;
};

export const getNextReviewDate = (mastery: number): string => {
  const days = getNextReviewDays(mastery);
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};
