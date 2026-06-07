import React from "react";

const ChessVersionInfo = () => {
  const chessVersions = [
    {
      version: "v2.9",
      summary: "Current Python route engine with a fixed move-time budget and richer search debug output.",
      featuresImplemented: [
        "Keeps iterative deepening, negamax with alpha-beta pruning, quiescence search, and transposition-table reuse under a fixed 1-second move budget.",
        "Extends the v2 line with positional evaluation updates, including rook file bonuses, passed-pawn pressure, and knight outpost scoring.",
        "The endpoint now returns debug data such as selected UCI/SAN move, score, completed depth, timeout status, node counts, move counts, and transposition-table activity.",
      ],
      stockfish1350Score:
        "C# v2.9 scored 324.0/500 against stockfish-1350 across 500 games: 271 wins, 106 draws, 123 losses, score rate 0.6480.",
      limitations: [
        "TBD...",
      ],
    },
    {
      version: "v0",
      summary: "Random legal-moves",
      featuresImplemented: [
        "Chooses a random legal move from the current position.",
        "The endpoint exposes debug data for the selected UCI move and legal move count.",
      ],
      stockfish1350Score: "Not benchmarked against stockfish-1350.",
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
              <span className="font-bold">Score against stockfish-1350:</span>{" "}
              {versionInfo.stockfish1350Score}
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
