import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WatchlistItem, MediaItem, WatchStatus } from '@/types';

interface WatchlistState {
  items: WatchlistItem[];
  addItem: (item: MediaItem, status?: WatchStatus) => void;
  removeItem: (id: number, mediaType: string) => void;
  updateStatus: (id: number, mediaType: string, status: WatchStatus) => void;
  isInWatchlist: (id: number, mediaType: string) => boolean;
  getItem: (id: number, mediaType: string) => WatchlistItem | undefined;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, status = 'plan_to_watch') => {
        const existing = get().items.find(
          (i) => i.id === item.id && i.mediaType === item.mediaType
        );
        if (existing) return;

        set((state) => ({
          items: [
            ...state.items,
            { ...item, addedAt: Date.now(), status },
          ],
        }));
      },

      removeItem: (id, mediaType) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.id === id && i.mediaType === mediaType)
          ),
        }));
      },

      updateStatus: (id, mediaType, status) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id && i.mediaType === mediaType ? { ...i, status } : i
          ),
        }));
      },

      isInWatchlist: (id, mediaType) => {
        return get().items.some((i) => i.id === id && i.mediaType === mediaType);
      },

      getItem: (id, mediaType) => {
        return get().items.find((i) => i.id === id && i.mediaType === mediaType);
      },
    }),
    { name: 'cineverse-watchlist' }
  )
);
