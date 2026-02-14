import { Suspense } from "react";
import { getAllTools, searchTools } from "@/lib/db/tools";
import SearchResultsClient from "./search-results";

export default async function SearchPage() {
  // Pre-fetch all tools on the server so they're available for client-side filtering
  const allTools = await getAllTools();

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-12 rounded-2xl bg-card" />
            <div className="h-8 w-48 rounded bg-card" />
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-40 rounded-2xl bg-card" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <SearchResultsClient allTools={allTools} />
    </Suspense>
  );
}
