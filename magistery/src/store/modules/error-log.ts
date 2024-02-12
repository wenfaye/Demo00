import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';

interface IErrorLog {
  err: Error
  vm: any
  info: string
  url: string
}

export interface IErrorLogState {
  logs: IErrorLog[]
}

@Module({ dynamic: true, store, name: 'errorLog' })
class ErrorLog extends VuexModule implements IErrorLogState {
  public logs: IErrorLog[] = []

  @Mutation
  private ADD_ERROR_LOG(log: IErrorLog) {
    this.logs.push(log);
  }

  @Mutation
  private CLEAR_ERROR_LOG() {
    this.logs.splice(0);
  }

  @Action({ commit: 'ADD_ERROR_LOG' })
  public AddErrorLog(log: IErrorLog) {
    return log;
  }

  @Action({ commit: 'CLEAR_ERROR_LOG' })
  public ClearErrorLog() {
  }
}

export const ErrorLogModule = getModule(ErrorLog);