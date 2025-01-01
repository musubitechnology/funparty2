import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Quest } from '../types';

export function useQuests() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuests();
  }, []);

  async function fetchQuests() {
    try {
      const { data, error } = await supabase
        .from('quests')
        .select('*')
        .order('points', { ascending: true });

      if (error) throw error;

      // Transform the data to match our Quest type
      const transformedQuests: Quest[] = (data || []).map(quest => ({
        id: quest.id,
        title: quest.title,
        description: quest.description,
        points: quest.points,
        unlocked: true
      }));

      setQuests(transformedQuests);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching quests:', err);
    } finally {
      setLoading(false);
    }
  }

  async function completeQuest(questId: string, participantIds: string[]) {
    try {
      const { data: completedQuest, error: completedQuestError } = await supabase
        .from('completed_quests')
        .insert([{ quest_id: questId }])
        .select()
        .single();

      if (completedQuestError) throw completedQuestError;

      const participantRecords = participantIds.map(questerId => ({
        completed_quest_id: completedQuest.id,
        quester_id: questerId
      }));

      const { error: participantsError } = await supabase
        .from('quest_participants')
        .insert(participantRecords);

      if (participantsError) throw participantsError;

      return completedQuest;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error completing quest:', err);
      return null;
    }
  }

  return {
    quests,
    loading,
    error,
    completeQuest,
    refreshQuests: fetchQuests
  };
}