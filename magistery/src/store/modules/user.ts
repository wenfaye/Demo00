import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { getUserInfo } from '@/api/login';
import store from '@/store';

export interface IUserState {
  id: number;
  name: string;
  avatar: string;
  introduction: string;
  email: string;
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public id = 0;
  public name = '';
  public avatar = '';
  public introduction = '';
  public email = '';

  // @Action({ commit: 'SET_TOKEN' })
  // public async Login(userInfo: { username: string, password: string}) {
  //   // eslint-disable-next-line prefer-const
  //   let { username, password } = userInfo;
  //   username = username.trim();
  //   const { data } = await login(username, password);
  //   setToken(data.accessToken);
  //   return data.accessToken;
  // }

  // @Action({ commit: 'SET_TOKEN' })
  // public async currentToken() {
  //   const { token, expires_in } = await getCurrentToken();
  //   setToken(token);
  //   return token;
  // }

  // @Action({ commit: 'SET_TOKEN' })
  // public async GetToken() {
  //   const token = getToken();
  //   if (token === undefined || token === null || token === '') {
  //     return null;
  //   }
  //   return token;
  // }

  // @Action({ commit: 'SET_TOKEN' })
  // public setToken(token: string) {
  //   return token;
  // }

  // @Action({ commit: 'SET_TOKEN' })
  // public ResetToken() {
  //   removeToken();
  //   return '';
  // }

  // @Action({ commit: 'SET_TOKEN' })
  // public async FedLogOut() {
  //   removeToken();
  //   return '';
  // }

  @Action({ commit: 'SET_USER', rawError: true })
  public async GetUserInfo() {
    // const token = getToken();
    // if (token === undefined || token === null || token === '') {
    //   throw Error('getUserInfo: token is undefined!');
    // }

    const user: { id: number, name: string, avatar: string, introduction: string, email: string } = await getUserInfo();
    if (!user.id) {
      throw Error('Verification failed, please Login again.');
    }
    return user;
  }

  @Action({ commit: 'SET_USER' })
  public async LogOut() {
    return { id: 0, name: '', avatar: '', introduction: '', email: '' };
  }

  // @Mutation
  // private SET_TOKEN(token: string) {
  //   this.token = token;
  // }

  @Mutation
  private SET_USER(user: { id: number, name: string, avatar: string, introduction: string, email: string }) {
    this.id = user.id;
    this.name = user.name;
    this.avatar = user.avatar;
    this.introduction = user.introduction;
    this.email = user.email;
  }
}

export const UserModule = getModule(User);
