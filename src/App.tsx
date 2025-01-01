import React, { useState, useEffect } from 'react';
import { Settings, Scroll } from 'lucide-react';
import { Quest, Quester, CompletedQuest } from './types';
import { QuestPicker } from './components/QuestPicker';
import { AddQuester } from './components/AddQuester';
import { QuestBoard } from './components/QuestBoard';
import { AdminPanel } from './components/AdminPanel';
import { useQuests } from './hooks/useQuests';
import { calculateQuestPoints } from './utils/points';

export default function App() {
  const { quests, loading: questsLoading } = useQuests();
  const [questers, setQuesters] = useState<Quester[]>(() => {
    const saved = localStorage.getItem('questers');
    return saved ? JSON.parse(saved) : [];
  });

  const [completedQuests, setCompletedQuests] = useState<CompletedQuest[]>(() => {
    const saved = localStorage.getItem('completedQuests');
    return saved ? JSON.parse(saved) : [];
  });

  const [showQuestPicker, setShowQuestPicker] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    localStorage.setItem('questers', JSON.stringify(questers));
  }, [questers]);

  useEffect(() => {
    localStorage.setItem('completedQuests', JSON.stringify(completedQuests));
  }, [completedQuests]);

  const handleAddQuester = (name: string, nickname: string) => {
    const newQuester: Quester = {
      id: Date.now().toString(),
      name,
      nickname,
      points: 0
    };
    setQuesters([...questers, newQuester]);
  };

  const handleCompleteQuest = (questId: string, participants: string[]) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    const points = calculateQuestPoints(quest.points, participants.length);
    const pointsPerParticipant = points / participants.length;

    setQuesters(questers.map(quester => {
      if (participants.includes(quester.id)) {
        return {
          ...quester,
          points: quester.points + pointsPerParticipant
        };
      }
      return quester;
    }));

    setCompletedQuests([
      ...completedQuests,
      { questId, participants, timestamp: Date.now() }
    ]);
  };

  const handleUpdateQuester = (updatedQuester: Quester) => {
    setQuesters(questers.map(q => 
      q.id === updatedQuester.id ? updatedQuester : q
    ));
  };

  const handleAddQuest = (quest: Quest) => {
    // This will be handled by Supabase
  };

  const handleDeleteQuester = (questerId: string) => {
    setQuesters(questers.filter(q => q.id !== questerId));
  };

  if (questsLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-amber-400 font-pixel">Loading quests...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Scroll className="w-8 h-8 text-amber-400" />
            <h1 className="font-pixel text-3xl text-amber-400">Quest Party</h1>
          </div>
          <button
            onClick={() => setShowAdminPanel(true)}
            className="p-2 hover:bg-slate-800 rounded-full text-amber-400"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        <div className="grid gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button
              onClick={() => setShowQuestPicker(true)}
              className="h-48 pixel-button flex items-center justify-center"
            >
              PICK A QUEST
            </button>
            <AddQuester onAddQuester={handleAddQuester} />
          </div>

          <QuestBoard questers={questers} />
        </div>

        {showQuestPicker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-2xl">
              <QuestPicker
                quests={quests}
                questers={questers}
                onCompleteQuest={handleCompleteQuest}
                onClose={() => setShowQuestPicker(false)}
              />
            </div>
          </div>
        )}

        <AdminPanel
          isOpen={showAdminPanel}
          onClose={() => setShowAdminPanel(false)}
          quests={quests}
          questers={questers}
          onUpdateQuester={handleUpdateQuester}
          onAddQuest={handleAddQuest}
          onDeleteQuester={handleDeleteQuester}
        />
      </div>
    </div>
  );
}