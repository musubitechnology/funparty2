import React from 'react';
import { Trophy, Users, Sword } from 'lucide-react';
import { Quester } from '../types';
import { calculatePartyTotal } from '../utils/points';

interface QuestBoardProps {
  questers: Quester[];
}

export function QuestBoard({ questers }: QuestBoardProps) {
  const sortedQuesters = [...questers].sort((a, b) => b.points - a.points);
  const partyTotal = calculatePartyTotal(questers.map(q => q.points));

  return (
    <div className="pixel-panel">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-amber-400" />
          <h2 className="font-pixel text-xl text-amber-400">Quest Board</h2>
        </div>
        <div className="flex items-center gap-3 bg-slate-700 px-4 py-2 pixel-corners">
          <Users className="w-5 h-5 text-amber-400" />
          <span className="font-pixel text-amber-400">Party: {partyTotal.toFixed(1)}</span>
        </div>
      </div>
      <div className="space-y-4">
        {sortedQuesters.map((quester, index) => (
          <div
            key={quester.id}
            className="flex items-center justify-between p-4 bg-slate-700 pixel-corners"
          >
            <div className="flex items-center gap-4">
              <span className="font-pixel text-xl text-amber-400">#{index + 1}</span>
              <div>
                <h3 className="font-pixel text-sm text-white">{quester.name}</h3>
                <p className="text-sm text-slate-400">{quester.nickname}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sword className="w-4 h-4 text-amber-400" />
              <span className="font-pixel text-amber-400">{quester.points.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}