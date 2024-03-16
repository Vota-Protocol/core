import create from "zustand";

interface UserRegisteredStore {
  isRegistered: boolean;
  setIsRegistered: (data: boolean) => void;
}

const useUserRegisteredStore = create<UserRegisteredStore>(set => ({
  isRegistered: false,
  setIsRegistered: data => set({ isRegistered: data }),
}));

export default useUserRegisteredStore;
