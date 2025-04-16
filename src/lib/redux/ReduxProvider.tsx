"use client";

import { Provider, useDispatch } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { login } from "./userSlice";

function ReduxInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const savedUser = localStorage.getItem("userInfo");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      dispatch(
        login({
          user: JSON.parse(savedUser),
          token: savedToken,
        })
      );
    }
  }, []);

  return null;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ReduxInitializer />
      {children}
    </Provider>
  );
}
