import { SelectMenuOption } from "../country_picker/types";

export interface PollData {
  id?: number;
  title: string;
  options: string[];
  country: SelectMenuOption;
}
