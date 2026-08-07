import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner Skeleton */}
      <Card className="p-6 flex flex-col md:flex-row justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </Card>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-5 space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-28" />
          </Card>
        ))}
      </div>

      {/* Alert & Trend Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 space-y-4">
          <Skeleton className="h-6 w-48" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </Card>
        <Card className="p-5 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </Card>
      </div>
    </div>
  );
}
