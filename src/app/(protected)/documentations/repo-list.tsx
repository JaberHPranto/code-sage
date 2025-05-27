"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import {
  RefreshCw,
  FileText,
  Github,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Clock,
} from "lucide-react";
import useProjects from "~/hooks/use-projects";
import type { IProject } from "~/types";
import { formatTimeAgo } from "~/utils/helper";

export function RepoList() {
  const [repositories, setRepositories] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingDocs, setGeneratingDocs] = useState<Record<string, boolean>>(
    {},
  );

  const { projects } = useProjects();

  useEffect(() => {
    if (projects) {
      setRepositories(projects);
      setLoading(false);
    }
  }, [projects]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>

            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (repositories.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No repositories found</CardTitle>
          <CardDescription>
            Connect your GitHub account to see your repositories here.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="w-full">
            <Github className="mr-2 h-4 w-4" />
            Connect GitHub Account
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Showing {repositories.length} repositories
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {repositories.map((repo, index) => (
          <Card
            key={repo.id}
            className="group border-l-primary/20 hover:border-l-primary/60 border-l-4 p-4 transition-all duration-200 hover:shadow-sm"
          >
            <div className="space-y-3">
              {/* Header with repo name and status */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <Github className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                  <h3 className="group-hover:text-primary truncate text-sm font-semibold transition-colors">
                    {repo.name}
                  </h3>
                </div>
                <div className="flex flex-shrink-0 items-center gap-1">
                  {index === 0 ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  )}
                  <span className="text-xs font-medium">
                    {index === 0 ? "Docs" : "No Docs"}
                  </span>
                </div>
              </div>

              {/* Info row with link and updated time */}
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <a
                  href={repo.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>View on GitHub</span>
                </a>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimeAgo(repo.updatedAt.toString())}</span>
                </div>
              </div>

              {/* Action button */}
              <div className="pt-4">
                {index === 0 ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-full text-xs"
                    asChild
                  >
                    <a
                      href={`/documentation/${repo.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText className="mr-1.5 h-3 w-3" />
                      View Documentation
                    </a>
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="h-8 w-full text-xs"
                    // onClick={() =>
                    //   handleGenerateDocumentation(repo.id, repo.name)
                    // }
                    disabled={generatingDocs[repo.id]}
                  >
                    {generatingDocs[repo.id] ? (
                      <>
                        <RefreshCw className="mr-1.5 h-3 w-3 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-1.5 h-3 w-3" />
                        Generate Docs
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
