import React from "react";

export type ChessVersionMetadata = {
  version: string;
  api_version?: string;
  engine_file?: string;
  served: boolean;
  status?: string;
  hypotheses: string[];
  summary?: string;
  implementation_summary?: string;
  stockfish_1350?: {
    text?: string;
  };
  limitations: string[];
};

type ChessVersionInfoProps = {
  versions: ChessVersionMetadata[];
  isLoading: boolean;
  error: string | null;
};

const formatVersionLabel = (version: string) =>
  version.startsWith("v") ? `V${version.slice(1)}` : version;

const ChessVersionInfo = ({
  versions,
  isLoading,
  error,
}: ChessVersionInfoProps) => {
  const latestServedVersion = versions.findLast((versionInfo) => versionInfo.served)?.version;
  const orderedVersions = [...versions].reverse();

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
      <div className="space-y-4">
        {orderedVersions.map((versionInfo) => (
          <div key={versionInfo.version} className="site-surface-card rounded-lg p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-semibold">
                Chess Bot {formatVersionLabel(versionInfo.version)}
              </h2>
              {versionInfo.version === latestServedVersion ? (
                <span className="rounded-full border border-[color:var(--site-border)] px-2 py-1 text-xs uppercase tracking-[0.12em] text-[color:var(--site-text-muted)]">
                  Current
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
              <span className="font-bold">Summary:</span>{" "}
              {versionInfo.summary ??
                versionInfo.implementation_summary ??
                "No summary recorded."}
            </p>
            <p className="mt-2">
              <span className="font-bold">Hypotheses:</span>
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
            <p className="mt-2">
              <span className="font-bold">Score against Stockfish (1350 Elo):</span>{" "}
              {versionInfo.stockfish_1350?.text ?? "Not benchmarked."}
            </p>
            <p className="mt-2">
              <span className="font-bold">Limitations:</span>
            </p>
            <ul className="mt-1 list-inside list-disc">
              {versionInfo.limitations.length > 0 ? (
                versionInfo.limitations.map((limitation) => (
                  <li key={limitation}>{limitation}</li>
                ))
              ) : (
                <li>No limitations recorded.</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChessVersionInfo;
