import React from "react";

const ChessVersionInfo = () => {
  const chessVersions = [
    {
      version: "v1.5",
      summary: "Time-budgeted search with stronger move selection.",
      featuresImplemented: [
        "Uses iterative deepening so it can keep improving its answer until the move timer runs out.",
        "Applies minimax with alpha-beta pruning and quiescence search to avoid wasting work and to handle tactical capture sequences more cleanly.",
        "Reuses earlier search results through a transposition table for better move ordering and fewer repeated calculations.",
      ],
      bestFor: "Actual play against a bot that searches ahead and uses its time budget more effectively.",
      limitations: [
        "Still bounded by a short think-time window, so deep tactics can be missed.",
        "Stronger than the baseline, but not close to a full-strength chess engine.",
      ],
    },
    {
      version: "v0",
      summary: "Random legal-moves",
      featuresImplemented: [
        "None, just random moves XD",
      ],
      bestFor: "There's really no reason to ever use this AHAHA",
      limitations: [
        "Absolutely no strategies involved",
      ],
    },
  ];

  return (
    <div className="mt-4 p-4 text-[color:var(--site-text)]">
      <h1
        className="site-section-heading z-[6] mx-auto mb-3 w-[90%] border-b-2 pt-5 text-center text-[1.4rem]
        max-lg:pt-3 lg:text-[1.8rem] xl:mb-5 xl:text-[2rem] xxl:text-[2.4rem]"
      >
        Information Panel for Chess Bot Versions
      </h1>
      <div className="space-y-4">
        {chessVersions.map((versionInfo, index) => (
          <div key={index} className="site-surface-card rounded-lg p-4">
            <h2 className="text-2xl font-semibold">
              Chess Bot {versionInfo.version}
            </h2>
            <p className="mt-2">
              <span className="font-bold">Summary:</span>{" "}
              {versionInfo.summary}
            </p>
            <p className="mt-2">
              <span className="font-bold">What changed:</span>
            </p>
            <ul className="list-disc list-inside mt-1">
              {versionInfo.featuresImplemented.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
            <p className="mt-2">
              <span className="font-bold">Best for:</span>{" "}
              {versionInfo.bestFor}
            </p>
            <p className="mt-2">
              <span className="font-bold">Limitations:</span>
            </p>
            <ul className="list-disc list-inside mt-1">
              {versionInfo.limitations.map((limitation, idx) => (
                <li key={idx}>{limitation}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChessVersionInfo;
