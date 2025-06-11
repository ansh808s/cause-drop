import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/store";
import {
  authStart,
  authSuccess,
  authFailure,
  setUser,
  logout,
} from "@/store/slices/authSlice";
import { apiClient } from "@/lib/api-client";
import type {
  SignInRequest,
  SignInResponseData,
  VerifyTokenResponseData,
} from "@/types/auth";

export const authKeys = {
  all: ["auth"] as const,
  signin: () => [...authKeys.all, "signin"] as const,
  verify: () => [...authKeys.all, "verify"] as const,
};

export const useSignIn = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation<SignInResponseData, Error, SignInRequest>({
    mutationKey: authKeys.signin(),
    mutationFn: (data) => apiClient.post("/api/auth/signin", data),
    onMutate: () => {
      dispatch(authStart());
    },
    onSuccess: ({ token, user }) => {
      dispatch(authSuccess({ token, user }));
      queryClient.invalidateQueries({ queryKey: authKeys.verify() });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Sign-in failed";
      dispatch(authFailure(message));
    },
  });
};

export const useVerifyToken = () => {
  const dispatch = useAppDispatch();

  return useMutation<VerifyTokenResponseData, Error, void>({
    mutationKey: authKeys.verify(),
    mutationFn: () => apiClient.post("/api/auth/verify"),
    onMutate: () => {
      dispatch(authStart());
    },
    onSuccess: (data) => {
      if (data.valid) {
        dispatch(setUser(data.user));
        dispatch(
          authSuccess({
            token: localStorage.getItem("auth_token") || "",
            // @ts-ignore
            user: data.user,
          })
        );
      } else {
        dispatch(logout());
      }
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error || "Token verification failed";
      dispatch(authFailure(message));
      dispatch(logout());
    },
  });
};
