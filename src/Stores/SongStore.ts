import { Store } from "pullstate";

interface ISongStore {
  songData?: null;
}

const SongStore = new Store<ISongStore>({});

export default SongStore;
