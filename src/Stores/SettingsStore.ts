import { Store } from "pullstate";

interface ISettingsStore {
  blurredBackground: boolean;
  blurLevel: number;
  brightnessLevel: number;
  fontSize: number;
  fontSpacing: number;
}

const SettingsStore = new Store<ISettingsStore>({
  blurredBackground: true,
  blurLevel: 30,
  fontSize: 1.2,
  fontSpacing: 8,
  brightnessLevel: 40,
});

export default SettingsStore;
