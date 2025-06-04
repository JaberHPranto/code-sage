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
        <div className="border-sidebar-border bg-background h-[calc(100vh-1rem)] overflow-y-auto rounded-md border p-4 shadow">
          <div className="border-sidebar-border bg-background mb-4 flex items-center gap-2 rounded-md border px-4 py-2 shadow">
            <SidebarTrigger className="-ml-1" />
            <div className="ml-auto">
              <UserButton />
            </div>
          </div>
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
};
export default SidebarLayout;
