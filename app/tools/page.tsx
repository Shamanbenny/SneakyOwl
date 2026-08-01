import type { Metadata } from "next";

import ToolsShowcase from "@/app/components/tools/ToolsShowcase";
import NavBar from "@/app/components/shared/navigation/NavBar";

export const metadata: Metadata = {
  title: "Tools",
};

export default function ToolsPage() {
  return (
    <div className="site-page-shell min-h-screen">
      <NavBar />
      <ToolsShowcase />
    </div>
  );
}
