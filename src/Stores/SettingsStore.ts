import { Store } from "pullstate";

interface ISettingsStore {
  blurredBackground: boolean;
  blurLevel: number;
  fontSize: number;
  fontSpacing: number;
}

const SettingsStore = new Store<ISettingsStore>({
  blurredBackground: true,
  blurLevel: 30,
  fontSize: 1.2,
  fontSpacing: 8,
});

export default SettingsStore;
