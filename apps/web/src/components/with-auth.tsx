"use client";

import React, { useEffect, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import { useAuthQueries } from "@/hooks/useAuthQueries";
import { toast } from "sonner";
import Loader from "./loader";

export function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  const AuthenticatedComponent = (props: P) => {
    const router = useRouter();
    const {
      isAuthenticated,
      isLoading,
      isVerifyingToken,
      token,
      verifyToken,
      verifyTokenError,
    } = useAuthQueries();

    useEffect(() => {
      if (!isAuthenticated && !isVerifyingToken) {
        console.log(token, isAuthenticated, isVerifyingToken);
        verifyToken().catch(() => {});
      }
    }, []);

    useEffect(() => {
      if (verifyTokenError && !isVerifyingToken) {
        toast.error("Session expired. Please sign in again.");
        router.push("/");
      }
    }, [verifyTokenError, isVerifyingToken, router]);

    if (isLoading || isVerifyingToken) {
      return <Loader />;
    }

    if (!isAuthenticated) {
      console.log("hi");
      return null;
    }
    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return AuthenticatedComponent;
}
