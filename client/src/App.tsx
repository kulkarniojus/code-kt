import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/lib/theme";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Architecture from "@/pages/Architecture";
import Explorer from "@/pages/Explorer";
import Chat from "@/pages/Chat";
import Workflows from "@/pages/Workflows";
import Config from "@/pages/Config";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/architecture" component={Architecture} />
      <Route path="/explorer" component={Explorer} />
      <Route path="/chat" component={Chat} />
      <Route path="/workflows" component={Workflows} />
      <Route path="/config" component={Config} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3.5rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <SidebarProvider style={sidebarStyle as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1 min-w-0">
                <Header />
                <main className="flex-1 overflow-auto">
                  <Router />
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
