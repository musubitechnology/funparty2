export function calculateQuestPoints(basePoints: number, participantCount: number): number {
  // Add 0.5 points for each additional participant
  const bonusPoints = Math.max(0, (participantCount - 1) * 0.5);
  return basePoints + bonusPoints;
}

export function calculatePartyTotal(points: number[]): number {
  return points.reduce((sum, points) => sum + points, 0);
}