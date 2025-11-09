import { create } from 'zustand';
import { Preferences } from '@/lib/types';
import * as prefsRepo from '@/lib/db/repo/preferences';

interface PreferencesState {
  preferences: Preferences | null;
  loading: boolean;
  error: string | null;
  loadPreferences: () => Promise<void>;
  savePreferences: (prefs: Preferences) => Promise<void>;
}

export const usePreferences = create<PreferencesState>((set) => ({
  preferences: null,
  loading: false,
  error: null,

  loadPreferences: async () => {
    set({ loading: true, error: null });
    try {
      const preferences = await prefsRepo.getPreferences();
      set({ preferences, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to load preferences',
        loading: false,
      });
    }
  },

  savePreferences: async (prefs: Preferences) => {
    try {
      await prefsRepo.savePreferences(prefs);
      set({ preferences: prefs });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to save preferences',
      });
      throw error;
    }
  },
}));
