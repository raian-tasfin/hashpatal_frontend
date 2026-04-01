import { createClient } from "../sdk";

export const sdk = createClient({
  url: process.env.NEXT_PUBLIC_GRAPHQL_URL!,
  headers: (): Record<string, string> => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});
