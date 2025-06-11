export interface User {
  id: string;
  createdAt: string;
}
export interface SignInRequest {
  publicKey: string;
  signature: string;
  message: string;
}

export interface SignInResponseData {
  token: string;
  user: User;
}

export interface VerifyTokenResponseData {
  valid: boolean;
  user: Pick<User, "id">;
}
