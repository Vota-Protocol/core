import create from "zustand";
import { PollData } from "~~/components/poll/PollDataModel";

interface PollState {
  pollData: PollData[] | null;
  setPollData: (data: PollData[]) => void;
}

export const usePollStore = create<PollState>(set => ({
  pollData: null,
  setPollData: data => set({ pollData: data }),
}));
