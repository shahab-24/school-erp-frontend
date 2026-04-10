// src/components/AuthInitializer.tsx
"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetMeQuery } from "@/lib/services/authApi";
import { setUser, clearUser } from "@/lib/features/authSlice";

/**
 * AuthInitializer runs once on app load.
 * Calls GET /auth/me using the stored token (cookie or header via baseQuery).
 * On success → hydrates Redux with user data.
 * On error   → clears any stale Redux state.
 *
 * This means on hard refresh, the user stays logged in
 * as long as the backend token is still valid.
 */
export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const { data, isSuccess, isError } = useGetMeQuery();

  useEffect(() => {
    if (isSuccess && data?.user) {
      dispatch(
  setUser(data.user))}

    if (isError) {
      dispatch(clearUser());
    }
  }, [isSuccess, isError, data, dispatch]);

  return <>{children}</>;
}
