import { createClient } from "../sdk";

export const sdk = createClient({
  url: process.env.NEXT_PUBLIC_GRAPHQL_URL!,
});
