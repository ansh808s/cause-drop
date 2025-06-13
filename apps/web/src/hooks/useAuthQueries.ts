import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
  authStart,
  authSuccess,
  authFailure,
  setUser,
  logout,
  initializeAuth,
} from "@/store/slices/authSlice";
import { apiClient } from "@/lib/api-client";
import type {
  SignInRequest,
  SignInResponseData,
  VerifyTokenResponseData,
} from "@/types/auth";
import type { ApiResponse } from "@/types/campaign";

const authApi = {
  signIn: async (signInData: SignInRequest): Promise<SignInResponseData> => {
    const response = await apiClient.post<ApiResponse<SignInResponseData>>(
      "/api/auth/signin",
      signInData
    );
    return response.data;
  },

  verifyToken: async (): Promise<VerifyTokenResponseData> => {
    const response = await apiClient.post<ApiResponse<VerifyTokenResponseData>>(
      "/api/auth/verify"
    );
    return response.data;
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
        const { token, user } = data;
        dispatch(authSuccess({ token, user }));
        dispatch(
          setUser({
            id: data.user.id,
          })
        );
        dispatch(initializeAuth());
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

  const verifyToken = async () => {
    return verifyTokenMutation.mutateAsync();
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
    verifyToken,
    isSigningIn: signInMutation.isPending,
    signInError: signInMutation.error,
    isVerifyingToken,
    verifyTokenError: verifyTokenMutation.error,
  };
};
