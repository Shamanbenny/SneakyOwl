import { Roboto_Mono } from "next/font/google";

import NavBar from "./components/NavBar";
import Loader from "./components/Loader";

const monoFont = Roboto_Mono({ subsets: ["latin"] });

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

          <div className="appContent">
            {/* [START] Page Components - Unique Per Page */}
            {/* Path: "/" */}
            <h1 className="h-[1600px] pt-[1600px] text-neutral-300">
              Welcome Home!!!
            </h1>
            {/* [END] Page Components - Unique Per Page */}
          </div>
        </div>
      </div>
    </>
  );
}
