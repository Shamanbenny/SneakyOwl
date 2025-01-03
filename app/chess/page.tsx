import { Roboto_Mono, Poppins } from "next/font/google";

import NavBar from "../components/NavBar";
import Loader from "../components/Loader";
import Chess from "../components/Chess";

const monoFont = Roboto_Mono({ subsets: ["latin"] });
const chessFont = Poppins({ weight: "400", subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <div>
        {/* [START] Loader Components - Repeated Per Page */}
        <div
          className={
            monoFont.className +
            " loader absolute z-[9999] h-full w-full bg-neutral-900 opacity-100 transition-opacity duration-[50ms] ease-linear"
          }
        >
          <h1 className="loader_string absolute top-[45%] w-full text-center text-[2.5rem] text-emerald-500 sm:text-[4rem]"></h1>
        </div>
        <Loader />
        {/* [END] Loader Components - Repeated Per Page */}
        <div className="apps">
          {/* [START] NavBar Components - Repeated Per Page */}
          <NavBar />
          {/* [END] NavBar Components - Repeated Per Page */}

          <div className={"appContent " + chessFont.className}>
            {/* [START] Page Components - Unique Per Page */}
            {/* Path: "/" */}
            <Chess />
            {/* [END] Page Components - Unique Per Page */}
          </div>
        </div>
      </div>
    </>
  );
}
