import { createStore } from 'vuex';
import { IAppState } from './modules/app';
import { IUserState } from './modules/user';
import { IDevconfigState } from './modules/devconfig';
import { IErrorLogState } from './modules/error-log';
import { IPermissionState } from './modules/permission';
import { ISettingsState } from './modules/settings';

export interface IRootState {
  app: IAppState;
  user: IUserState;
  devconfig: IDevconfigState;
  errorLog: IErrorLogState;
  permission: IPermissionState;
  settings: ISettingsState;
}

// Declare empty store first, dynamically register all modules later.
const store = createStore<IRootState>({});
export default store;
