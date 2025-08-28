import { Suspense } from "react";

import ChurchViewPage from "./church-view-page";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const churchId = parseInt(id);

  if (isNaN(churchId)) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-destructive">Invalid church ID</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading church details...</div>}>
      <ChurchViewPage churchId={churchId} />
    </Suspense>
  );
}
