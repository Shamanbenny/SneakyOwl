import React from "react";

import ChessScoreRateGraph, {
  getEvaluationOpponentNames,
  type ChessMetadata,
  type ChessVersionMetadata,
} from "./ChessScoreRateGraph";

export type { ChessMetadata, ChessVersionMetadata };

type ChessVersionInfoProps = {
  versions: ChessVersionMetadata[];
  metadata?: ChessMetadata;
  isLoading: boolean;
  error: string | null;
  showFallbackGraphOnError?: boolean;
};

const formatVersionLabel = (version: string) =>
  version.startsWith("v") ? `V${version.slice(1)}` : version;

const getVersionSortValue = (version: string) =>
  version
    .replace(/^v/i, "")
    .split(".")
    .map((part) => Number.parseInt(part, 10) || 0);

const compareVersionsDescending = (
  leftVersion: string,
  rightVersion: string,
) => {
  const leftParts = getVersionSortValue(leftVersion);
  const rightParts = getVersionSortValue(rightVersion);
  const maxLength = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < maxLength; index += 1) {
    const difference = (rightParts[index] ?? 0) - (leftParts[index] ?? 0);
    if (difference !== 0) {
      return difference;
    }
  }

  return 0;
};

const formatOpponentName = (name: string) => name.replace(/-/g, " ");

const getBenchmarkTexts = (versionInfo: ChessVersionMetadata) => {
  const benchmarkEntries = Object.entries(versionInfo.evaluation_opponents ?? {})
    .map(([opponentName, result]) => ({
      opponentName,
      text: result.text,
    }))
    .filter((entry) => entry.text);

  if (benchmarkEntries.length > 0) {
    return benchmarkEntries;
  }

  if (versionInfo.stockfish_1350?.text) {
    return [
      {
        opponentName: "stockfish-1350",
        text: versionInfo.stockfish_1350.text,
      },
    ];
  }

  return [];
};

const ChessVersionInfo = ({
  versions,
  metadata,
  isLoading,
  error,
  showFallbackGraphOnError = false,
}: ChessVersionInfoProps) => {
  const approvedVersions = versions.filter(
    (versionInfo) => versionInfo.status === "approved",
  );
  const latestServedVersion = [...approvedVersions]
    .filter((versionInfo) => versionInfo.served)
    .sort((leftVersion, rightVersion) =>
      compareVersionsDescending(leftVersion.version, rightVersion.version),
    )[0]?.version;
  const orderedVersions = [...approvedVersions].sort((leftVersion, rightVersion) =>
    compareVersionsDescending(leftVersion.version, rightVersion.version),
  );
  const graphMetadata = metadata ?? { versions };
  const opponentNames = getEvaluationOpponentNames(graphMetadata);
  const shouldShowFallbackGraphOnly =
    showFallbackGraphOnError && !isLoading && Boolean(error);

  return (
    <div className="mt-4 p-4 text-[color:var(--site-text)]">
      <h2
        className="site-section-heading z-[6] mx-auto mb-3 w-[90%] border-b-2 pt-5 text-center text-[1.4rem]
        max-lg:pt-3 lg:text-[1.8rem] xl:mb-5 xl:text-[2rem] xxl:text-[2.4rem]"
      >
        Information Panel
      </h2>
      {isLoading ? (
        <p className="site-surface-card rounded-lg p-4 text-center text-[color:var(--site-text-muted)]">
          Loading chess engine metadata...
        </p>
      ) : null}
      {error ? (
        <p className="site-surface-card rounded-lg p-4 text-center text-[color:var(--site-text-muted)]">
          Unable to load live chess engine metadata: {error}
        </p>
      ) : null}
      {!isLoading && !error && orderedVersions.length === 0 ? (
        <p className="site-surface-card rounded-lg p-4 text-center text-[color:var(--site-text-muted)]">
          No approved chess bot information is available right now.
        </p>
      ) : null}
      {!isLoading && !error && opponentNames.length > 0 ? (
        <div className="mb-5 space-y-4">
          {opponentNames.map((opponentName) => (
            <ChessScoreRateGraph
              key={opponentName}
              opponentName={opponentName}
              metadata={graphMetadata}
              axisTitleClassName="text-[12px] leading-none"
              useSvgYAxisTitle
            />
          ))}
        </div>
      ) : null}
      {shouldShowFallbackGraphOnly ? (
        <div className="mb-5 space-y-4">
          <ChessScoreRateGraph
            opponentName="stockfish-1350"
            title="Autoresearch Score Rate vs Stockfish 1350"
            axisTitleClassName="text-[12px] leading-none"
            useSvgYAxisTitle
          />
        </div>
      ) : null}
      {!shouldShowFallbackGraphOnly ? (
        <div className="space-y-4">
        {orderedVersions.map((versionInfo) => (
          <div key={versionInfo.version} className="site-surface-card rounded-lg p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-semibold">
                Chess Bot {formatVersionLabel(versionInfo.version)}
              </h2>
              {versionInfo.version === latestServedVersion ? (
                <span className="rounded-full border border-[color:var(--site-accent-teal)] bg-[color:var(--site-bg-soft)] px-2 py-1 text-xs uppercase tracking-[0.12em] text-[color:var(--site-accent-teal)]">
                  latest
                </span>
              ) : null}
              <span
                className={`rounded-full border px-2 py-1 text-xs uppercase tracking-[0.12em] ${
                  versionInfo.served
                    ? "border-[color:rgba(110,231,183,0.4)] bg-[color:rgba(16,185,129,0.14)] text-[color:var(--site-accent-soft)]"
                    : "border-[color:var(--site-border)] text-[color:var(--site-text-muted)]"
                }`}
              >
                {versionInfo.served ? "Served" : "Not served"}
              </span>
            </div>
            <p className="mt-2">
              <strong className="font-semibold text-[color:var(--site-text-strong)]">
                Summary:
              </strong>{" "}
              {versionInfo.summary ??
                versionInfo.implementation_summary ??
                "No summary recorded."}
            </p>
            <p className="mt-2">
              <strong className="font-semibold text-[color:var(--site-text-strong)]">
                Hypotheses:
              </strong>
            </p>
            <ul className="mt-1 list-inside list-disc">
              {versionInfo.hypotheses.length > 0 ? (
                versionInfo.hypotheses.map((hypothesis) => (
                  <li key={hypothesis}>{hypothesis}</li>
                ))
              ) : (
                <li>No hypotheses recorded.</li>
              )}
            </ul>
            <div className="mt-2">
              <strong className="font-semibold text-[color:var(--site-text-strong)]">
                Benchmark results:
              </strong>{" "}
              {getBenchmarkTexts(versionInfo).length > 0 ? (
                <ul className="mt-1 list-inside list-disc">
                  {getBenchmarkTexts(versionInfo).map((entry) => (
                    <li key={entry.opponentName}>
                      <span className="capitalize">
                        {formatOpponentName(entry.opponentName)}:
                      </span>{" "}
                      {entry.text}
                    </li>
                  ))}
                </ul>
              ) : (
                "Not benchmarked."
              )}
            </div>
            {versionInfo.limitations.length > 0 ? (
              <>
                <p className="mt-2">
                  <strong className="font-semibold text-[color:var(--site-text-strong)]">
                    Limitations:
                  </strong>
                </p>
                <ul className="mt-1 list-inside list-disc">
                  {versionInfo.limitations.map((limitation) => (
                    <li key={limitation}>{limitation}</li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        ))}
        </div>
      ) : null}
    </div>
  );
};

export default ChessVersionInfo;
