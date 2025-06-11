import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/store";
import { authStart, authSuccess, authFailure } from "@/store/slices/authSlice";
import { apiClient } from "@/lib/api-client";
import type { SignInRequest, SignInResponseData } from "@/types/auth";

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
