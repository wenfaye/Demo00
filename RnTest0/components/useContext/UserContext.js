import { createContext, useState } from 'react'
export const UserContext = createContext();

const { Provider } = UserContext;

export const UserContextProvider = ({ children }) => {

  const [userInfo, setUserInfo] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const login = () => {
    setIsAuth(true)
    setUserInfo({ username: 'alex', status: true })
  }
  const logout = () => {
    setIsAuth(false);
    setUserInfo(null);
  }

  return (
    <Provider value={{ userInfo, isAuth, login, logout }}>{children}</Provider>
  )
}
