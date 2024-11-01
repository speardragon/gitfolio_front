import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ToggleStoreInterface {
  toggle: boolean;
  setToggle: (val: boolean) => void;
}

export const useToggleStore = create<ToggleStoreInterface>((set) => ({
  toggle: false,
  setToggle: (val) => set((state) => ({ toggle: val })),
}));
