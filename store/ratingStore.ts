import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RatingState {
  ratings: Record<string, number>; // key = `${mediaType}-${id}`
  setRating: (id: number, mediaType: string, rating: number) => void;
  getRating: (id: number, mediaType: string) => number;
  removeRating: (id: number, mediaType: string) => void;
}

export const useRatingStore = create<RatingState>()(
  persist(
    (set, get) => ({
      ratings: {},

      setRating: (id, mediaType, rating) => {
        set((state) => ({
          ratings: { ...state.ratings, [`${mediaType}-${id}`]: rating },
        }));
      },

      getRating: (id, mediaType) => {
        return get().ratings[`${mediaType}-${id}`] || 0;
      },

      removeRating: (id, mediaType) => {
        set((state) => {
          const ratings = { ...state.ratings };
          delete ratings[`${mediaType}-${id}`];
          return { ratings };
        });
      },
    }),
    { name: 'cineverse-ratings' }
  )
);
