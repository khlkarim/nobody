import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PreferencesState = {
  avatarColors: Record<string, string>; 
  setAvatarColor: (userId: string, color: string) => void;
};

export const useUserPreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      avatarColors: {},
      setAvatarColor: (userId, color) => 
        set((state) => ({
          avatarColors: { ...state.avatarColors, [userId]: color }
        })),
    }),
    {
      name: 'user-preferences', 
    }
  )
);