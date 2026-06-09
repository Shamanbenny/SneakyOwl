"use client";

import React, { useEffect, useMemo, useState } from "react";

export type ChessEvaluationResult = {
  games?: number | null;
  wins?: number | null;
  draws?: number | null;
  losses?: number | null;
  score?: number | null;
  score_rate?: number | null;
  text?: string;
};

export type ChessEvaluationOpponent = {
  name?: string;
  elo?: number | string;
};

export type ChessVersionMetadata = {
  version: string;
  api_version?: string;
  engine_file?: string;
  served: boolean;
  status?: string;
  hypotheses: string[];
  summary?: string;
  implementation_summary?: string;
  evaluation_opponents?: Record<string, ChessEvaluationResult>;
  stockfish_1350?: ChessEvaluationResult;
  limitations: string[];
};

export type ChessMetadata = {
  evaluation_opponents?: Record<string, ChessEvaluationOpponent>;
  versions?: ChessVersionMetadata[];
};

type ChartPoint = {
  experimentNumber: number;
  version: string;
  status: string;
  scoreRate: number;
  wins?: number | null;
  draws?: number | null;
  losses?: number | null;
  games?: number | null;
  score?: number | null;
  text?: string;
  bestSoFar: number | null;
};

type ChessScoreRateGraphProps = {
  opponentName: string;
  metadata?: ChessMetadata;
  versions?: ChessVersionMetadata[];
  title?: string;
  className?: string;
};

const CHESS_METADATA_URL = "https://chess.sneakyowl.net/api/chess/metadata";
const CHART_WIDTH = 860;
const CHART_HEIGHT = 360;
const PADDING = {
  top: 26,
  right: 28,
  bottom: 52,
  left: 54,
};

const normalizeOpponentName = (value: string) =>
  value.trim().toLowerCase().replace(/_/g, "-").replace(/\s+/g, "-");

const formatVersionLabel = (version: string) =>
  version.startsWith("v") ? `V${version.slice(1)}` : version;

const getVersionSortValue = (version: string) =>
  version
    .replace(/^v/i, "")
    .split(".")
    .map((part) => Number.parseInt(part, 10) || 0);

const compareVersionsAscending = (leftVersion: string, rightVersion: string) => {
  const leftParts = getVersionSortValue(leftVersion);
  const rightParts = getVersionSortValue(rightVersion);
  const maxLength = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < maxLength; index += 1) {
    const difference = (leftParts[index] ?? 0) - (rightParts[index] ?? 0);
    if (difference !== 0) {
      return difference;
    }
  }

  return 0;
};

const getOpponentResult = (
  version: ChessVersionMetadata,
  opponentName: string,
) => {
  const normalizedName = normalizeOpponentName(opponentName);
  const opponents = version.evaluation_opponents ?? {};
  const matchingKey = Object.keys(opponents).find(
    (key) => normalizeOpponentName(key) === normalizedName,
  );

  if (matchingKey) {
    return opponents[matchingKey];
  }

  if (normalizedName === "stockfish-1350" && version.stockfish_1350) {
    return version.stockfish_1350;
  }

  return undefined;
};

const getOpponentLabel = (metadata: ChessMetadata | undefined, opponentName: string) => {
  const normalizedName = normalizeOpponentName(opponentName);
  const entry = Object.entries(metadata?.evaluation_opponents ?? {}).find(
    ([key]) => normalizeOpponentName(key) === normalizedName,
  )?.[1];

  if (!entry) {
    return opponentName;
  }

  const name = entry.name ?? opponentName;
  return entry.elo === undefined || entry.elo === null
    ? name
    : `${name} ${entry.elo}`;
};

export const getEvaluationOpponentNames = (metadata: ChessMetadata) => {
  const names = new Set<string>();
  Object.keys(metadata.evaluation_opponents ?? {}).forEach((name) => names.add(name));
  metadata.versions?.forEach((version) => {
    Object.keys(version.evaluation_opponents ?? {}).forEach((name) => names.add(name));
    if (version.stockfish_1350) {
      names.add("stockfish-1350");
    }
  });

  return [...names].sort((left, right) => left.localeCompare(right));
};

const buildPoints = (
  versions: ChessVersionMetadata[],
  opponentName: string,
): ChartPoint[] => {
  let bestSoFar: number | null = null;

  return [...versions]
    .sort((left, right) => compareVersionsAscending(left.version, right.version))
    .map((version, index): ChartPoint | null => {
      const result = getOpponentResult(version, opponentName);
      const scoreRate =
        typeof result?.score_rate === "number" && Number.isFinite(result.score_rate)
          ? result.score_rate
          : null;

      if (scoreRate === null) {
        return null;
      }

      if (version.status === "approved") {
        bestSoFar = scoreRate;
      }

      return {
        experimentNumber: index + 1,
        version: version.version,
        status: version.status ?? "unknown",
        scoreRate,
        wins: result?.wins,
        draws: result?.draws,
        losses: result?.losses,
        games: result?.games,
        score: result?.score,
        text: result?.text,
        bestSoFar,
      };
    })
    .filter((point): point is ChartPoint => point !== null);
};

const formatRate = (value: number) => value.toFixed(4);

const pathFromPoints = (
  points: ChartPoint[],
  xScale: (value: number) => number,
  yScale: (value: number) => number,
) => {
  const validPoints = points.filter((point) => point.bestSoFar !== null);
  if (validPoints.length === 0) {
    return "";
  }

  const [firstPoint, ...remainingPoints] = validPoints;
  let path = `M ${xScale(firstPoint.experimentNumber)} ${yScale(firstPoint.bestSoFar ?? 0)}`;

  remainingPoints.forEach((point) => {
    const x = xScale(point.experimentNumber);
    const nextY = yScale(point.bestSoFar ?? 0);
    path += ` H ${x} V ${nextY}`;
  });

  return path;
};

const ChessScoreRateGraph = ({
  opponentName,
  metadata,
  versions,
  title,
  className = "",
}: ChessScoreRateGraphProps) => {
  const [fetchedMetadata, setFetchedMetadata] = useState<ChessMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(!metadata && !versions);
  const [error, setError] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);

  useEffect(() => {
    if (metadata || versions) {
      return;
    }

    let cancelled = false;

    const loadMetadata = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(CHESS_METADATA_URL);
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText || "response"}`);
        }

        const nextMetadata = (await response.json()) as ChessMetadata;
        if (!cancelled) {
          setFetchedMetadata(nextMetadata);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Unknown metadata error");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadMetadata();

    return () => {
      cancelled = true;
    };
  }, [metadata, versions]);

  const resolvedMetadata = metadata ?? fetchedMetadata ?? undefined;
  const resolvedVersions = useMemo(
    () => versions ?? resolvedMetadata?.versions ?? [],
    [resolvedMetadata?.versions, versions],
  );
  const points = useMemo(
    () => buildPoints(resolvedVersions, opponentName),
    [opponentName, resolvedVersions],
  );
  const opponentLabel = getOpponentLabel(resolvedMetadata, opponentName);
  const minExperiment = points[0]?.experimentNumber ?? 1;
  const maxExperiment = points[points.length - 1]?.experimentNumber ?? 1;
  const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const xScale = (value: number) =>
    PADDING.left +
    ((value - minExperiment) / Math.max(1, maxExperiment - minExperiment)) * plotWidth;
  const yScale = (value: number) =>
    PADDING.top + (1 - Math.min(Math.max(value, 0), 1)) * plotHeight;
  const bestPath = pathFromPoints(points, xScale, yScale);
  const xTicks = points.filter((_, index) => {
    const interval = Math.max(1, Math.ceil(points.length / 6));
    return index === 0 || index === points.length - 1 || index % interval === 0;
  });
  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <section className={`site-surface-card relative rounded-lg p-4 ${className}`}>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-[color:var(--site-text-strong)]">
            {title ?? `Score Rate vs ${opponentLabel}`}
          </h3>
          <p className="mt-1 text-sm text-[color:var(--site-text-muted)]">
            Approved and rejected experiments with the current approved score line.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-[color:var(--site-text-muted)]">
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--site-accent-soft)]" />
            approved
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-500" />
            rejected
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-0.5 w-5 bg-[color:var(--site-accent)]" />
            approved line
          </span>
        </div>
      </div>

      {isLoading ? (
        <p className="rounded border border-[color:var(--site-border)] p-4 text-sm text-[color:var(--site-text-muted)]">
          Loading score-rate metadata...
        </p>
      ) : null}
      {error ? (
        <p className="rounded border border-[color:var(--site-border)] p-4 text-sm text-[color:var(--site-text-muted)]">
          Unable to load score-rate metadata: {error}
        </p>
      ) : null}
      {!isLoading && !error && points.length === 0 ? (
        <p className="rounded border border-[color:var(--site-border)] p-4 text-sm text-[color:var(--site-text-muted)]">
          No recorded score-rate results for {opponentName}.
        </p>
      ) : null}

      {points.length > 0 ? (
        <div className="relative overflow-x-auto">
          <svg
            className="min-w-[620px]"
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            role="img"
            aria-label={`Chess engine score-rate graph against ${opponentLabel}`}
          >
            <rect
              x={PADDING.left}
              y={PADDING.top}
              width={plotWidth}
              height={plotHeight}
              rx="6"
              fill="rgba(10, 10, 10, 0.22)"
              stroke="rgba(212, 212, 216, 0.14)"
            />
            {yTicks.map((tick) => (
              <g key={tick}>
                <line
                  x1={PADDING.left}
                  y1={yScale(tick)}
                  x2={CHART_WIDTH - PADDING.right}
                  y2={yScale(tick)}
                  stroke="rgba(212, 212, 216, 0.16)"
                />
                <text
                  x={PADDING.left - 12}
                  y={yScale(tick) + 4}
                  textAnchor="end"
                  className="fill-[color:var(--site-text-muted)] text-[12px]"
                >
                  {tick.toFixed(2)}
                </text>
              </g>
            ))}
            {xTicks.map((point) => (
              <g key={point.version}>
                <line
                  x1={xScale(point.experimentNumber)}
                  y1={PADDING.top}
                  x2={xScale(point.experimentNumber)}
                  y2={CHART_HEIGHT - PADDING.bottom}
                  stroke="rgba(212, 212, 216, 0.08)"
                />
                <text
                  x={xScale(point.experimentNumber)}
                  y={CHART_HEIGHT - 24}
                  textAnchor="middle"
                  className="fill-[color:var(--site-text-muted)] text-[12px]"
                >
                  {point.experimentNumber}
                </text>
              </g>
            ))}
            <text
              x={PADDING.left + plotWidth / 2}
              y={CHART_HEIGHT - 4}
              textAnchor="middle"
              className="fill-[color:var(--site-text-muted)] text-[12px]"
            >
              Experiment number
            </text>
            <text
              x={16}
              y={PADDING.top + plotHeight / 2}
              textAnchor="middle"
              transform={`rotate(-90 16 ${PADDING.top + plotHeight / 2})`}
              className="fill-[color:var(--site-text-muted)] text-[12px]"
            >
              Score rate
            </text>
            {bestPath ? (
              <path
                d={bestPath}
                fill="none"
                stroke="var(--site-accent)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            ) : null}
            {points.map((point) => {
              const isApproved = point.status === "approved";
              const x = xScale(point.experimentNumber);
              const y = yScale(point.scoreRate);

              return (
                <g
                  key={`${point.version}-${point.experimentNumber}`}
                  role="button"
                  tabIndex={0}
                  className="cursor-pointer outline-none"
                  onMouseEnter={() => setHoveredPoint(point)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  onFocus={() => setHoveredPoint(point)}
                  onBlur={() => setHoveredPoint(null)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setHoveredPoint(point);
                    }
                  }}
                  aria-label={`${formatVersionLabel(point.version)} score rate ${formatRate(point.scoreRate)}`}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={isApproved ? 6 : 5}
                    fill={isApproved ? "var(--site-accent-soft)" : "#71717a"}
                    stroke={isApproved ? "var(--site-accent)" : "#a1a1aa"}
                    strokeWidth="2"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r="14"
                    fill="transparent"
                    stroke="transparent"
                    className="cursor-pointer"
                  />
                </g>
              );
            })}
          </svg>

          {hoveredPoint ? (
            <div className="site-tooltip-panel pointer-events-none absolute left-4 top-16 z-10 max-w-[280px] rounded-lg p-3 text-sm sm:left-auto sm:right-4">
              <div className="flex items-center justify-between gap-3">
                <strong className="text-[color:var(--site-text-strong)]">
                  {formatVersionLabel(hoveredPoint.version)}
                </strong>
                <span className="rounded-full border border-[color:var(--site-border)] px-2 py-0.5 text-[11px] uppercase tracking-[0.12em] text-[color:var(--site-text-muted)]">
                  {hoveredPoint.status}
                </span>
              </div>
              <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
                <dt className="text-[color:var(--site-text-muted)]">Experiment</dt>
                <dd className="text-right">{hoveredPoint.experimentNumber}</dd>
                <dt className="text-[color:var(--site-text-muted)]">Score rate</dt>
                <dd className="text-right">{formatRate(hoveredPoint.scoreRate)}</dd>
                <dt className="text-[color:var(--site-text-muted)]">Score</dt>
                <dd className="text-right">
                  {hoveredPoint.score ?? "n/a"}/{hoveredPoint.games ?? "n/a"}
                </dd>
                <dt className="text-[color:var(--site-text-muted)]">W/D/L</dt>
                <dd className="text-right">
                  {hoveredPoint.wins ?? "n/a"}/{hoveredPoint.draws ?? "n/a"}/
                  {hoveredPoint.losses ?? "n/a"}
                </dd>
              </dl>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
};

export default ChessScoreRateGraph;
