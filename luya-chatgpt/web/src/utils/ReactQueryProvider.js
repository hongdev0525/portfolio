"use client";

import {
  QueryClient,
  QueryClientProvider,
  Hydrate,
} from "react-query";
import { useState } from "react";


export default function ReactQueryProvider({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}