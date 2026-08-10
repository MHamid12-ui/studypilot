import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

/**
 * App shell: persistent sidebar on desktop (lg+), top bar + bottom
 * navigation on mobile. Content is padded on mobile so nothing is hidden
 * behind the fixed bottom bar, and offset on desktop for the fixed sidebar.
 */
export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div className="flex min-h-screen flex-col lg:pl-64">
        <TopBar />

        <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-10 lg:pb-12 lg:pt-8">
          <Outlet />
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
