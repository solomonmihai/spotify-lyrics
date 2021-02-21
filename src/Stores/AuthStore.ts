import { Store } from "pullstate";

interface IAuthStore {
  token?: string;
}

const AuthStore = new Store<IAuthStore>({});

export default AuthStore;
