import { ArrowLeft, Command, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

interface Props {
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DocHeader = ({ setSearchOpen }: Props) => {
  return (
    <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/dashboard">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="logo" width={32} height={32} />
            <h1 className="text-primary/80 -ml-2 text-lg font-bold text-nowrap">
              Code Sage
            </h1>
          </div>
        </Link>

        <Button
          variant="outline"
          className="gap-2 border-blue-200 hover:border-blue-300"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-4 w-4" />
          <span className="mr-8 hidden sm:inline">Search docs...</span>
          <div className="ml-2 hidden items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500 sm:flex">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        </Button>
      </div>
    </header>
  );
};
