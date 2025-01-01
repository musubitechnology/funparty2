import { Quest } from '../types';

export const initialQuests: Quest[] = [
  {
    id: '1',
    title: 'Draw your favorite animal',
    description: 'Using only your non-dominant hand, create a masterpiece!',
    points: 2,
    unlocked: true
  },
  {
    id: '2',
    title: 'Sing Happy Birthday',
    description: 'Perform Happy Birthday in three different styles (opera, rap, whisper)',
    points: 3,
    unlocked: true
  }
];