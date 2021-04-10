import { Store } from "pullstate";

interface ISettingsStore {
  blurLevel: number;
  brightnessLevel: number;
  fontSize: number;
  fontSpacing: number;
}

const SettingsStore = new Store<ISettingsStore>({
  blurLevel: 30,
  fontSize: 1.2,
  fontSpacing: 8,
  brightnessLevel: 40,
});

export default SettingsStore;
