"use client";

import { RepoList } from "./repo-list";

const DocListPage = () => {
  return (
    <div className="p-4">
      <main className="container mx-auto">
        <div className="flex flex-col gap-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Your Projects</h2>
            <p className="text-muted-foreground">
              Manage and generate documentation for your repositories.
            </p>
          </section>
          <RepoList />
        </div>
      </main>
    </div>
  );
};
export default DocListPage;
