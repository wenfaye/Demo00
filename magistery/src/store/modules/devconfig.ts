import Cookies from 'js-cookie';
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';

export interface IDevconfigState {
  tasks: {
    index: string;
  };

  scripts: {
    index: string;
  }
}

@Module({ dynamic: true, store, name: 'devconfig' })
class Devconfig extends VuexModule implements IDevconfigState {
  public tasks = {
    index: 'by_mo',
  }

  public scripts = {
    index: 'by_name',
  }

  @Action({ commit: 'SET_TASKS_INDEX' })
  public SetTasksIndex(name: string) {
    return name;
  }

  @Mutation
  private SET_TASKS_INDEX(name: string) {
    this.tasks.index = name;
  }

  @Action({ commit: 'SET_SCRIPTS_INDEX' })
  public SetScriptsIndex(name: string) {
    return name;
  }

  @Mutation
  private SET_SCRIPTS_INDEX(name: string) {
    this.scripts.index = name;
  }
}

export const DevconfigModule = getModule(Devconfig);
