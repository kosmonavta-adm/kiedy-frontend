import { ReactNode, createContext, useContext } from 'react';

const UserContext = createContext<{ userId: string }>({ userId: '' });

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }: { children: ReactNode }) {
  const userId = window.localStorage.getItem('userId');

  if (userId === null) {
    throw new Error('userId is not defined');
  }

  return <UserContext.Provider value={{ userId }}>{children}</UserContext.Provider>;
}
