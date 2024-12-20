import { create } from "zustand";

interface PaidSuccessStoreInterface {
  isPaid: boolean;
  setPaid: (item: boolean) => void;
}

const usePaidSuccessStore = create<PaidSuccessStoreInterface>((set) => ({
  isPaid: false,
  setPaid: (item) => set({ isPaid: item }),
}));

export default usePaidSuccessStore;
