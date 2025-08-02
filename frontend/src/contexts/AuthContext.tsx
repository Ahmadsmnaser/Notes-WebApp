import React, { createContext, useReducer, useContext, ReactNode } from 'react';

type AuthState = {
  token: string | null;
  name: string | null;
  email: string | null;
};

type AuthAction =
  | { type: 'LOGIN'; payload: { token: string; name: string; email: string } }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  token: null,
  name: null,
  email: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return {
        token: action.payload.token,
        name: action.payload.name,
        email: action.payload.email,
      };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}>({ state: initialState, dispatch: () => null });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
