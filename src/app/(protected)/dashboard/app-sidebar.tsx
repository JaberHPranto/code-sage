"use client";
import {
  BookOpenText,
  Bot,
  CreditCard,
  LayoutDashboard,
  Plus,
  Presentation,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import useProjects from "~/hooks/use-projects";
import useRefetch from "~/hooks/use-refetch";
import { cn } from "~/lib/utils";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Q&A",
    url: "/qa",
    icon: Bot,
  },
  {
    title: "Documentation",
    url: "/documentation",
    icon: BookOpenText,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
];

const AppSidebar = () => {
  const pathname = usePathname();
  const { open } = useSidebar();

  const { projects, selectedProjectId, setSelectedProjectId } = useProjects();

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Image
            src={"/logo.png"}
            alt="logo"
            width={42}
            height={40}
            className="mt-0.5"
          />

          {open && (
            <h1 className="text-primary/80 text-xl font-bold text-nowrap">
              Code Sage
            </h1>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn({
                        "!bg-primary !text-white": item.url === pathname,
                      })}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>My Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects?.map((project) => (
                <SidebarMenuItem
                  key={project.name}
                  onClick={() => setSelectedProjectId(project.id)}
                  className="cursor-pointer"
                >
                  <SidebarMenuButton asChild>
                    <div>
                      <div
                        className={cn(
                          "text-primary -ml-1 flex size-6 min-w-6 items-center justify-center rounded-sm border bg-white text-sm",
                          {
                            "bg-primary text-white":
                              project.id === selectedProjectId,
                          },
                        )}
                      >
                        {project.name[0]}
                      </div>
                      <span>{project.name}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            <SidebarMenu>
              <Link href="/create">
                <Button variant={"outline"} size={"sm"} className="mt-2 w-full">
                  <Plus />
                  {open && <span>Create Project</span>}
                </Button>
              </Link>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
export default AppSidebar;
