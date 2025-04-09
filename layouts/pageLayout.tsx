// ui
import Navbar from "@/ui/navbar";
import Footer from "@/ui/footer";

// hooks
import { RootContextProvider } from "@/hooks/rootContext";

interface PageLayoutProps {
  root: boolean;
  children: React.ReactNode;
}

export default function PageLayout({ root, children }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <RootContextProvider root={root}>
        <Navbar />
      </RootContextProvider>

      <main className="flex-grow flex flex-col">
        <div className="flex-grow">{children}</div>
      </main>

      <Footer />
    </div>
  );
}
