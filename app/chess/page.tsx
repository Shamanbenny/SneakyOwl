import { Poppins } from "next/font/google";

import NavBar from "../components/NavBar";
import ChessPage from "../components/ChessPage";

const chessFont = Poppins({ weight: "400", subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <NavBar />
      <div className={"appContent " + chessFont.className}>
        <ChessPage />
      </div>
    </div>
  );
}
