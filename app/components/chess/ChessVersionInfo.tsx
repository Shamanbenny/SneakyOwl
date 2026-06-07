import React from "react";

const ChessVersionInfo = () => {
  const chessVersions = [
    {
      version: "v3.0",
      summary:
        "Current Flask route wrapper that checks an opening book first, then falls back to the v2.9 search engine with optional per-game transposition-table reuse.",
      featuresImplemented: [
        "Adds the /chess_v3_0 endpoint with game_id-backed warm-instance search context.",
        "Adds opening book lookup to deal with poor opening decision, and an optional per-game transposition-table reuse",
        "Returns opening-book diagnostics and transposition-table context details in the debug payload.",
      ],
      stockfish1350Score:
        "C# v3.0 scored 305.5/500 against stockfish-1350 across 500 games: 254 wins, 103 draws, 143 losses, score rate 0.6110",
      limitations: [
        "The benchmark is below the approved v2.9 score rate of 0.6480, so v3.0 is a usable major-version baseline rather than a playing-strength promotion over v2.9.",
        "Context reuse depends on the same warm server instance receiving future requests, so cold starts or different instances may begin with an empty cache.",
      ],
    },
    {
      version: "v2.9",
      summary:
        "Python route engine with a fixed move-time budget and richer search debug output.",
      featuresImplemented: [
        "Extends v2.0 with positional evaluation updates, including rook file bonuses, passed-pawn pressure, and knight outpost scoring.",
      ],
      stockfish1350Score:
        "C# v2.9 scored 324.0/500 against stockfish-1350 across 500 games: 271 wins, 106 draws, 123 losses, score rate 0.6480.",
      limitations: ["Poor opening plays, and unnecessary search during opening plays"],
    },
    {
      version: "v2.0",
      summary:
        "Earlier Python v2 route built around the same fixed move-time search structure before the later positional evaluation additions.",
      featuresImplemented: [
        "Uses iterative deepening, negamax with alpha-beta pruning, quiescence search, and transposition-table reuse under a fixed 1-second move budget.",
      ],
      stockfish1350Score:
        "C# v2.0 scored 207.0/500 against stockfish-1350 across 500 games: 160 wins, 94 draws, 246 losses, score rate 0.4140.",
      limitations: [
        "Due to the lack of understanding of what makes a 'good' position, the engine tends to make moves that provides no tactical advantage whenever there are no obvious advantageous move to make.",
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
      limitations: ["Absolutely no strategies involved"],
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
              <span className="font-bold">Summary:</span> {versionInfo.summary}
            </p>
            <p className="mt-2">
              <span className="font-bold">What changed:</span>
            </p>
            <ul className="mt-1 list-inside list-disc">
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
            <ul className="mt-1 list-inside list-disc">
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
