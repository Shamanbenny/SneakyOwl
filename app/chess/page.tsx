import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import ChessPage from "@/app/components/chess/ChessPage";

const chessFont = Poppins({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chess",
};

export default function Home() {
  return (
    <div className={"appContent " + chessFont.className}>
      <ChessPage />
    </div>
  );
}
