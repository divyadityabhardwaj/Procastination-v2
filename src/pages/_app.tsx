import "@/styles/global.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getTheme } from "@/lib/theme";
import dynamic from "next/dynamic";
import { QueryClient } from "@tanstack/react-query";

// Dynamically import React Query to avoid TypeScript issues
const QueryClientProvider = dynamic(
  () =>
    import("@tanstack/react-query").then((mod) => ({
      default: mod.QueryClientProvider,
    })),
  { ssr: false }
);

const ReactQueryDevtools = dynamic(
  () =>
    import("@tanstack/react-query-devtools").then((mod) => ({
      default: mod.ReactQueryDevtools,
    })),
  { ssr: false }
);

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const theme = getTheme("dark"); // Default to dark theme

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
