"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeAuth } from "@/store/slices/authSlice";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, []);

  return <>{children}</>;
};
