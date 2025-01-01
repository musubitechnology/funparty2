import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Quester } from '../types';

export function useQuesters() {
  const [questers, setQuesters] = useState<Quester[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuesters();
  }, []);

  async function fetchQuesters() {
    try {
      const { data, error } = await supabase
        .from('questers')
        .select('*')
        .order('points', { ascending: false });

      if (error) throw error;
      setQuesters(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function addQuester(name: string, nickname: string) {
    try {
      const { data, error } = await supabase
        .from('questers')
        .insert([{ name, nickname, points: 0 }])
        .select()
        .single();

      if (error) throw error;
      setQuesters([...questers, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }

  async function updateQuesterPoints(questerId: string, points: number) {
    try {
      const { error } = await supabase
        .from('questers')
        .update({ points })
        .eq('id', questerId);

      if (error) throw error;
      await fetchQuesters();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  return {
    questers,
    loading,
    error,
    addQuester,
    updateQuesterPoints,
    refreshQuesters: fetchQuesters
  };
}