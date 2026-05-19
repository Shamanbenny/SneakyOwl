import { Poppins } from "next/font/google";

import NavBar from "./components/NavBar";
import { About } from "./components/About";

const aboutMeFont = Poppins({ weight: "400", subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <NavBar />
      <div className={"appContent " + aboutMeFont.className}>
        <About />
      </div>
    </div>
  );
}
