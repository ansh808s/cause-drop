import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
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

const authApi = {
  signIn: async (data: SignInRequest): Promise<SignInResponseData> => {
    return apiClient.post<SignInResponseData>("/api/auth/signin", data);
  },

  verifyToken: async (): Promise<VerifyTokenResponseData> => {
    return apiClient.post<VerifyTokenResponseData>("/api/auth/verify");
  },
};

export const authQueryKeys = {
  verify: ["auth", "verify"] as const,
};

export const useAuthQueries = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { token, isAuthenticated, user, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const signInMutation = useMutation({
    mutationFn: authApi.signIn,
    onMutate: () => {
      dispatch(authStart());
    },
    onSuccess: (data) => {
      const { token, user } = data;
      dispatch(authSuccess({ token, user }));
      queryClient.invalidateQueries({ queryKey: authQueryKeys.verify });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Authentication failed";
      dispatch(authFailure(errorMessage));
    },
  });

  const verifyTokenMutation = useMutation({
    mutationFn: authApi.verifyToken,
    onSuccess: (data) => {
      if (data.valid) {
        dispatch(
          setUser({
            id: data.user.id,
          })
        );
      } else {
        dispatch(logout());
      }
    },
    onError: () => {
      dispatch(logout());
    },
  });

  const signIn = async (signInData: SignInRequest) => {
    return signInMutation.mutateAsync(signInData);
  };

  const logoutUser = () => {
    dispatch(logout());
    queryClient.clear();
  };

  const isVerifyingToken = verifyTokenMutation.isPending;

  return {
    isAuthenticated,
    user,
    token,
    isLoading: isLoading || isVerifyingToken,
    error,
    signIn,
    logoutUser,
    isSigningIn: signInMutation.isPending,
    signInError: signInMutation.error,
    isVerifyingToken,
    verifyTokenError: verifyTokenMutation.error,
  };
};
