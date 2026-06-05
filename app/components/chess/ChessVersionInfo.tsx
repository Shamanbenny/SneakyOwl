import React from "react";

const ChessVersionInfo = () => {
  const chessVersions = [
    {
      version: "v2.0",
      summary: "Same broad search identity as v1.6, but rebuilt on a cheaper in-house board engine.",
      featuresImplemented: [
        "Keeps iterative deepening, negamax with alpha-beta pruning, quiescence search, and fixed-size transposition-table reuse from the accepted v1.6 structure.",
        "Moves the inner search off the library-backed board hot path onto an in-house board representation with encoded moves, direct make/unmake, internal repetition history, and internal attack detection.",
        "Generates legal moves, updates transposition keys, and tracks repetition directly inside the native engine state so the engine's time budget is spent on more meaningful node expansion.",
      ],
      bestFor: "Actual play and future search experiments where a cheaper per-node cost matters more than changing the engine's overall search identity.",
      limitations: [
        "The broad algorithm intentionally stays close to v1.6, so this version is more about substrate efficiency than a brand-new search style.",
        "It is still bounded by a fixed move-time budget, so deep tactics and full-engine strength remain out of scope.",
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
