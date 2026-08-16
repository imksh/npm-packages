import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // React Native doesn't have traditional window focus
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});
