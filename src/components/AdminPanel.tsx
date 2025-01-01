import React, { useState } from 'react';
import { Quest, Quester } from '../types';
import { Lock, Trash2 } from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  quests: Quest[];
  questers: Quester[];
  onUpdateQuester: (quester: Quester) => void;
  onAddQuest: (quest: Quest) => void;
  onDeleteQuester: (questerId: string) => void;
}

export function AdminPanel({ 
  isOpen, 
  onClose, 
  quests, 
  questers, 
  onUpdateQuester, 
  onAddQuest,
  onDeleteQuester 
}: AdminPanelProps) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newQuest, setNewQuest] = useState({ title: '', description: '', points: 0 });

  const handleAuthenticate = () => {
    if (password === '117') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  const handleClose = () => {
    onClose();
    setIsAuthenticated(false);
    setPassword('');
    setNewQuest({ title: '', description: '', points: 0 });
  };

  if (!isOpen) return null;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="pixel-panel w-full max-w-md">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-amber-400" />
            <h2 className="font-pixel text-xl text-amber-400">Admin Access</h2>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full p-2 bg-slate-700 border border-amber-400 rounded text-white mb-4"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-amber-400 hover:bg-slate-700 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleAuthenticate}
              className="pixel-button"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="pixel-panel w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <h2 className="font-pixel text-2xl text-amber-400 mb-6">Admin Panel</h2>
        
        <div className="mb-8">
          <h3 className="font-pixel text-xl text-amber-400 mb-4">Add New Quest</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Quest Title"
              value={newQuest.title}
              onChange={(e) => setNewQuest({ ...newQuest, title: e.target.value })}
              className="w-full p-2 bg-slate-700 border border-amber-400 rounded text-white"
            />
            <textarea
              placeholder="Quest Description"
              value={newQuest.description}
              onChange={(e) => setNewQuest({ ...newQuest, description: e.target.value })}
              className="w-full p-2 bg-slate-700 border border-amber-400 rounded text-white"
            />
            <input
              type="number"
              placeholder="Points"
              value={newQuest.points}
              onChange={(e) => setNewQuest({ ...newQuest, points: parseInt(e.target.value) })}
              className="w-full p-2 bg-slate-700 border border-amber-400 rounded text-white"
            />
            <button
              onClick={() => {
                onAddQuest({
                  id: Date.now().toString(),
                  ...newQuest,
                  unlocked: true
                });
                setNewQuest({ title: '', description: '', points: 0 });
              }}
              className="pixel-button w-full"
            >
              Add Quest
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-pixel text-xl text-amber-400 mb-4">Manage Questers</h3>
          <div className="space-y-4">
            {questers.map(quester => (
              <div key={quester.id} className="flex items-center gap-4 bg-slate-700 p-4 pixel-corners">
                <span className="flex-1 text-white">{quester.name} ({quester.nickname})</span>
                <input
                  type="number"
                  value={quester.points}
                  onChange={(e) => onUpdateQuester({
                    ...quester,
                    points: parseInt(e.target.value)
                  })}
                  className="w-24 p-2 bg-slate-600 border border-amber-400 rounded text-white"
                />
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${quester.name}?`)) {
                      onDeleteQuester(quester.id);
                    }
                  }}
                  className="p-2 text-red-400 hover:bg-slate-600 rounded-full"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleClose}
          className="pixel-button w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
}