import { Quest } from '../types';

// Keep track of recently shown quests to avoid repetition
let recentQuests = new Set<string>();

export function getRandomQuests(quests: Quest[], count: number = 6): Quest[] {
  // Filter out recently shown quests
  const availableQuests = quests.filter(quest => !recentQuests.has(quest.id));
  
  // If we've shown too many quests recently, reset the history
  if (availableQuests.length < count) {
    recentQuests.clear();
  }

  // Shuffle available quests
  const shuffled = [...availableQuests].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  // Add selected quests to recent history
  selected.forEach(quest => recentQuests.add(quest.id));

  // Keep recent history to a reasonable size
  if (recentQuests.size > quests.length / 2) {
    const oldestQuests = Array.from(recentQuests).slice(0, count);
    oldestQuests.forEach(id => recentQuests.delete(id));
  }

  return selected;
}