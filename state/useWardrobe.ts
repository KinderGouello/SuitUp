import { create } from 'zustand';
import { Item } from '@/lib/types';
import * as itemsRepo from '@/lib/db/repo/items';

interface WardrobeState {
  items: Item[];
  loading: boolean;
  error: string | null;
  loadItems: () => Promise<void>;
  addItem: (item: Item) => Promise<void>;
  updateItem: (item: Item) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  searchItems: (query: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useWardrobe = create<WardrobeState>((set) => ({
  items: [],
  loading: false,
  error: null,

  loadItems: async () => {
    set({ loading: true, error: null });
    try {
      const items = await itemsRepo.getAllItems();
      set({ items, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load items',
        loading: false,
      });
    }
  },

  addItem: async (item: Item) => {
    try {
      await itemsRepo.createItem(item);
      set((state) => ({ items: [item, ...state.items] }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add item',
      });
      throw error;
    }
  },

  updateItem: async (item: Item) => {
    try {
      await itemsRepo.updateItem(item);
      set((state) => ({
        items: state.items.map((i) => (i.id === item.id ? item : i)),
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to update item',
      });
      throw error;
    }
  },

  deleteItem: async (id: string) => {
    try {
      await itemsRepo.deleteItem(id);
      set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to delete item',
      });
      throw error;
    }
  },

  searchItems: async (query: string) => {
    set({ loading: true, error: null });
    try {
      const items = query
        ? await itemsRepo.searchItems(query)
        : await itemsRepo.getAllItems();
      set({ items, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to search items',
        loading: false,
      });
    }
  },

  refresh: async () => {
    const { loadItems } = useWardrobe.getState();
    await loadItems();
  },
}));
