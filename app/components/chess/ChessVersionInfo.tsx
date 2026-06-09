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

const ChessVersionInfo = ({
  versions,
  isLoading,
  error,
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
            <p className="mt-2">
              <strong className="font-semibold text-[color:var(--site-text-strong)]">
                Score against Stockfish:
              </strong>{" "}
              {versionInfo.stockfish_1350?.text ?? "Not benchmarked."}
            </p>
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
    </div>
  );
};

export default ChessVersionInfo;
