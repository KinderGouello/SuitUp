import { create } from 'zustand';
import { AppSettings } from '@/lib/types';
import * as settingsRepo from '@/lib/db/repo/settings';

interface SettingsState {
  settings: AppSettings | null;
  loading: boolean;
  error: string | null;
  loadSettings: () => Promise<void>;
  saveSettings: (settings: AppSettings) => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

export const useSettings = create<SettingsState>((set, get) => ({
  settings: null,
  loading: false,
  error: null,

  loadSettings: async () => {
    set({ loading: true, error: null });
    try {
      const settings = await settingsRepo.getSettings();
      set({ settings, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to load settings',
        loading: false,
      });
    }
  },

  saveSettings: async (settings: AppSettings) => {
    try {
      await settingsRepo.saveSettings(settings);
      set({ settings });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to save settings',
      });
      throw error;
    }
  },

  completeOnboarding: async () => {
    const currentSettings = get().settings;
    if (currentSettings) {
      await get().saveSettings({
        ...currentSettings,
        onboardingCompleted: true,
      });
    }
  },
}));
