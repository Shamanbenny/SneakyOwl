import { Poppins } from "next/font/google";

import ToolsShowcase from "@/app/components/tools/ToolsShowcase";
import NavBar from "@/app/components/shared/navigation/NavBar";

const toolsFont = Poppins({ weight: "400", subsets: ["latin"] });

export default function ToolsPage() {
  return (
    <div className={`site-page-shell min-h-screen ${toolsFont.className}`}>
      <NavBar />
      <ToolsShowcase />
    </div>
  );
}
