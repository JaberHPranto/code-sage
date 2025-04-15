import { UserButton } from "@clerk/nextjs";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import AppSidebar from "./dashboard/app-sidebar";

interface Props {
  children: React.ReactNode;
}

const SidebarLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="m-2 w-full">
        <div className="border-sidebar-border bg-sidebar flex items-center gap-2 rounded-md border px-4 py-2 shadow">
          <SidebarTrigger className="-ml-1" />
          {/* Searchbar */}
          <div className="ml-auto">
            <UserButton />
          </div>
        </div>
        <div className="h-4"></div>
        {/* main content */}

        <div className="border-sidebar-border bg-sidebar h-[calc(100vh-5.5rem)] overflow-y-auto rounded-md border p-4 shadow">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
};
export default SidebarLayout;
