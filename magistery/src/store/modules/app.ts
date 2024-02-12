import { getSidebarStatus, getSize, setSidebarStatus, setLanguage, setSize } from '@/utils/auth';
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getLocale } from '@/language';

export enum DeviceType {
  Mobile,
  Desktop,
}

export interface IAppState {
  device: DeviceType;
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
  };
  language: string;
  size: string;
}

@Module({ dynamic: true, store, name: 'app' })
class App extends VuexModule implements IAppState {
  public sidebar = {
    opened: getSidebarStatus() !== 'closed',
    withoutAnimation: false,
  };

  public device = DeviceType.Desktop;
  public language = getLocale();
  public size = getSize() || 'medium';

  @Action({ commit: 'TOGGLE_SIDEBAR', rawError: true })
  public ToggleSideBar(withoutAnimation: boolean) {
    return withoutAnimation;
  }

  @Action({ commit: 'CLOSE_SIDEBAR', rawError: true })
  public CloseSideBar(withoutAnimation: boolean) {
    return withoutAnimation;
  }

  @Action({ commit: 'TOGGLE_DEVICE', rawError: true })
  public ToggleDevice(device: DeviceType) {
    return device;
  }

  @Action({ commit: 'SET_LANGUAGE', rawError: true })
  public SetLanguage(language: string) {
    return language;
  }

  @Action({ commit: 'SET_SIZE', rawError: true })
  public SetSize(size: string) {
    return size;
  }

  @Mutation
  private TOGGLE_SIDEBAR(withoutAnimation: boolean) {
    if (this.sidebar.opened) {
      setSidebarStatus('closed');
    } else {
      setSidebarStatus('opened');
    }
    this.sidebar.opened = !this.sidebar.opened;
    this.sidebar.withoutAnimation = withoutAnimation;
  }

  @Mutation
  private CLOSE_SIDEBAR(withoutAnimation: boolean) {
    setSidebarStatus('closed');
    this.sidebar.opened = false;
    this.sidebar.withoutAnimation = withoutAnimation;
  }

  @Mutation
  private TOGGLE_DEVICE(device: DeviceType) {
    this.device = device;
  }

  @Mutation
  private SET_LANGUAGE(language: string) {
    this.language = language;
    setLanguage(this.language);
  }

  @Mutation
  private SET_SIZE(size: string) {
    setSize(size);
    this.size = size;
  }
}

export const AppModule = getModule(App);
