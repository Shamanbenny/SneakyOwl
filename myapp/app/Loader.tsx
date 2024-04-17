"use client";

import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import Animation from "./Animation";

const Loader: React.FC = () => {
  const [hasSeenAnimation, setHasSeenAnimation] = useState<boolean>(false);

  useEffect(() => {
    let seen = sessionStorage.getItem("hasSeenAnimation");

    if (!seen) {
      sessionStorage.setItem("hasSeenAnimation", "true");
      seen = "true";
    }

    setHasSeenAnimation(seen === "true");
  }, []);

  if (hasSeenAnimation) {
    return <Loading />;
  } else {
    return <Animation />;
  }
};

export default Loader;
