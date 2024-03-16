import { SelectMenuOption } from "../country_picker/types";

export interface PollData {
  title: string;
  options: string[];
  country: SelectMenuOption;
}

export const listOfMockPolls: PollData[] = [
  {
    title: "UP Election",
    options: ["Bharatiya Janata Party ", "Indian National Congress", "Congress"],
    country: { title: "India", value: "IN" },
  },
  {
    title: "UK Election",
    options: ["Suella Braverman", "Rachel Taylor", "Jodie Gosling"],
    country: { title: "United Kingdom", value: "GB" },
  },
  // Add more mock data objects here
];
