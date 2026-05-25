import { Poppins } from "next/font/google";

import ChessPage from "../components/ChessPage";

const chessFont = Poppins({ weight: "400", subsets: ["latin"] });

export default function Home() {
  return (
    <div className={"appContent " + chessFont.className}>
      <ChessPage />
    </div>
  );
}
