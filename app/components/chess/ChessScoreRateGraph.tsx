"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import InfoTooltip from "@/app/components/shared/feedback/InfoTooltip";

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
  experimentLabel: string;
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

type TooltipPosition = {
  left: number;
  top: number;
};

type ChessScoreRateGraphProps = {
  opponentName: string;
  metadata?: ChessMetadata;
  versions?: ChessVersionMetadata[];
  title?: string;
  className?: string;
  axisTitleClassName?: string;
  useSvgYAxisTitle?: boolean;
  xAxisTitleClassName?: string;
};

const CHESS_METADATA_URL = "https://chess.sneakyowl.net/api/chess/metadata";
const CHANGELOG_FALLBACK_URL = "/blog/autoresearch-chess/CHANGELOG.json";
const GRAPH_STAGE_WIDTH = 1400;
const GRAPH_STAGE_HEIGHT = 600;
const Y_AXIS_GUTTER_WIDTH = 92;
const CHART_WIDTH = GRAPH_STAGE_WIDTH - Y_AXIS_GUTTER_WIDTH;
const CHART_HEIGHT = GRAPH_STAGE_HEIGHT;
const PADDING = {
  top: 52,
  right: 52,
  bottom: 112,
  left: 92,
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

const compareVersionsAscending = (
  leftVersion: string,
  rightVersion: string,
) => {
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

const isBaselineVersion = (version: string) => {
  const [major = 0, minor = 0, patch = 0] = getVersionSortValue(version);
  return major === 0 && minor === 0 && patch === 0;
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

const getOpponentLabel = (
  metadata: ChessMetadata | undefined,
  opponentName: string,
) => {
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
  Object.keys(metadata.evaluation_opponents ?? {}).forEach((name) =>
    names.add(name),
  );
  metadata.versions?.forEach((version) => {
    Object.keys(version.evaluation_opponents ?? {}).forEach((name) =>
      names.add(name),
    );
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
  let experimentNumber = 0;

  return [...versions]
    .sort((left, right) =>
      compareVersionsAscending(left.version, right.version),
    )
    .map((version): ChartPoint | null => {
      const result = getOpponentResult(version, opponentName);
      const scoreRate =
        typeof result?.score_rate === "number" &&
        Number.isFinite(result.score_rate)
          ? result.score_rate
          : null;

      if (scoreRate === null) {
        return null;
      }

      if (version.status === "approved") {
        bestSoFar = scoreRate;
      }

      const isBaseline = isBaselineVersion(version.version);
      if (!isBaseline) {
        experimentNumber += 1;
      }

      return {
        experimentNumber,
        experimentLabel: isBaseline ? "V0 baseline" : `${experimentNumber}`,
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

const buildYDomain = (points: ChartPoint[]) => {
  if (points.length === 0) {
    return { min: 0, max: 1 };
  }

  const values = points.flatMap((point) =>
    point.bestSoFar === null
      ? [point.scoreRate]
      : [point.scoreRate, point.bestSoFar],
  );
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = Math.max(0.001, maxValue - minValue);
  const padding = range * 0.0556;
  let min = Math.max(0, minValue - padding);
  let max = Math.min(1, maxValue + padding);

  if (max - min < 0.05) {
    const midpoint = (min + max) / 2;
    min = Math.max(0, midpoint - 0.025);
    max = Math.min(1, midpoint + 0.025);
  }

  return { min, max };
};

const buildYTicks = (min: number, max: number) =>
  Array.from({ length: 5 }, (_, index) => min + ((max - min) * index) / 4);

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
  axisTitleClassName = "text-[24px] leading-none",
  useSvgYAxisTitle = false,
  xAxisTitleClassName = "text-[24px]",
}: ChessScoreRateGraphProps) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [fetchedMetadata, setFetchedMetadata] = useState<ChessMetadata | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(!metadata && !versions);
  const [error, setError] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(
    null,
  );

  useEffect(() => {
    if (metadata || versions) {
      return;
    }

    let cancelled = false;

    const loadMetadata = async () => {
      setIsLoading(true);
      setError(null);

      let backendErrorMessage: string | null = null;

      try {
        const response = await fetch(CHESS_METADATA_URL);
        if (!response.ok) {
          throw new Error(
            `${response.status} ${response.statusText || "response"}`,
          );
        }

        const nextMetadata = (await response.json()) as ChessMetadata;
        if (!cancelled) {
          setFetchedMetadata(nextMetadata);
        }
      } catch (loadError) {
        backendErrorMessage =
          loadError instanceof Error
            ? loadError.message
            : "Unknown metadata error";

        try {
          const fallbackResponse = await fetch(CHANGELOG_FALLBACK_URL);
          if (!fallbackResponse.ok) {
            throw new Error(
              `${fallbackResponse.status} ${
                fallbackResponse.statusText || "response"
              }`,
            );
          }

          const fallbackMetadata =
            (await fallbackResponse.json()) as ChessMetadata;
          if (!cancelled) {
            setFetchedMetadata(fallbackMetadata);
          }
        } catch (fallbackError) {
          if (!cancelled) {
            const fallbackErrorMessage =
              fallbackError instanceof Error
                ? fallbackError.message
                : "Unknown fallback metadata error";
            setError(
              `backend: ${backendErrorMessage}; fallback: ${fallbackErrorMessage}`,
            );
          }
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
  const normalizedOpponentName = normalizeOpponentName(opponentName);
  const minExperiment = points[0]?.experimentNumber ?? 1;
  const maxExperiment = points[points.length - 1]?.experimentNumber ?? 1;
  const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const yDomain = buildYDomain(points);
  const xScale = (value: number) =>
    PADDING.left +
    ((value - minExperiment) / Math.max(1, maxExperiment - minExperiment)) *
      plotWidth;
  const yScale = (value: number) =>
    PADDING.top +
    (1 -
      (Math.min(Math.max(value, yDomain.min), yDomain.max) - yDomain.min) /
        Math.max(0.001, yDomain.max - yDomain.min)) *
      plotHeight;
  const bestPath = pathFromPoints(points, xScale, yScale);
  const xTicks = points.filter((_, index) => {
    const interval = Math.max(1, Math.ceil(points.length / 6));
    return index === 0 || index === points.length - 1 || index % interval === 0;
  });
  const yTicks = buildYTicks(yDomain.min, yDomain.max);

  const updateTooltipPosition = (
    event: React.MouseEvent<SVGGElement>,
  ) => {
    const tooltipOffsetX = 18;
    const tooltipOffsetY = 18;
    const tooltipWidth = tooltipRef.current?.offsetWidth ?? 360;
    const tooltipHeight = tooltipRef.current?.offsetHeight ?? 180;
    const maxLeft = GRAPH_STAGE_WIDTH - tooltipWidth - 12;
    const maxTop = GRAPH_STAGE_HEIGHT - tooltipHeight - 12;

    setTooltipPosition({
      left: Math.max(
        12,
        Math.min(event.nativeEvent.offsetX + tooltipOffsetX, maxLeft),
      ),
      top: Math.max(
        12,
        Math.min(event.nativeEvent.offsetY + tooltipOffsetY, maxTop),
      ),
    });
  };

  return (
    <section
      className={`site-surface-card relative rounded-lg p-4 ${className}`}
    >
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-[color:var(--site-text-strong)]">
            {title ?? `Score Rate vs ${opponentLabel}`}
          </h3>
          <p className="mt-1 text-sm text-[color:var(--site-text-muted)]">
            Approved and rejected experiments with the current approved score
            line.
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
            <span className="h-0.5 w-5 bg-[color:var(--site-accent-soft)] opacity-45" />
            Running latest score rate
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
          <div
            className="relative"
            style={{ width: `${GRAPH_STAGE_WIDTH}px`, height: `${GRAPH_STAGE_HEIGHT}px` }}
          >
            <div className="flex h-full items-stretch">
              <div
                className="flex shrink-0 items-center justify-center"
                style={{ width: `${Y_AXIS_GUTTER_WIDTH}px` }}
              >
                {useSvgYAxisTitle ? (
                  <div className="flex -rotate-90 items-center gap-2 whitespace-nowrap text-[color:var(--site-text-muted)]">
                    <svg
                      width="150"
                      height="30"
                      viewBox="0 0 150 30"
                      aria-hidden="true"
                      className="shrink-0 overflow-visible"
                    >
                      <text
                        x="0"
                        y="22"
                        className="fill-[color:var(--site-text-muted)] text-[24px]"
                      >
                        Score rate
                      </text>
                    </svg>
                    <InfoTooltip
                      ariaLabel="Score rate explanation"
                      preferredPlacement="top"
                      panelClassName="normal-case"
                    >
                      Higher is better. Score rate ranges from 0 to 1: 0 means the
                      engine lost every game against this evaluation opponent, while
                      1 means it won every game.
                    </InfoTooltip>
                  </div>
                ) : (
                  <div
                    className={`flex -rotate-90 items-center gap-2 whitespace-nowrap text-[color:var(--site-text-muted)] ${axisTitleClassName}`}
                  >
                    <span>Score rate</span>
                    <InfoTooltip
                      ariaLabel="Score rate explanation"
                      preferredPlacement="top"
                      panelClassName="normal-case"
                    >
                      Higher is better. Score rate ranges from 0 to 1: 0 means the
                      engine lost every game against this evaluation opponent, while
                      1 means it won every game.
                    </InfoTooltip>
                  </div>
                )}
              </div>
              <svg
                className="h-full flex-1"
                viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                role="img"
                aria-label={`Chess engine score-rate graph against ${opponentLabel}`}
              >
                <rect
                  x={PADDING.left}
                  y={PADDING.top}
                  width={plotWidth}
                  height={plotHeight}
                  rx="0"
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
                      x={PADDING.left - 20}
                      y={yScale(tick) + 8}
                      textAnchor="end"
                      className="fill-[color:var(--site-text-muted)] text-[22px]"
                    >
                      {tick.toFixed(3)}
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
                      y={CHART_HEIGHT - 48}
                      textAnchor="middle"
                      className="fill-[color:var(--site-text-muted)] text-[22px]"
                    >
                      {point.experimentLabel}
                    </text>
                  </g>
                ))}
                <text
                  x={PADDING.left + plotWidth / 2}
                  y={CHART_HEIGHT - 10}
                  textAnchor="middle"
                  className={`fill-[color:var(--site-text-muted)] ${xAxisTitleClassName}`}
                >
                  Experiment number
                </text>
                {bestPath ? (
                  <path
                    d={bestPath}
                    fill="none"
                    stroke="var(--site-accent-soft)"
                    strokeWidth="6"
                    strokeOpacity="0.42"
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
                      onMouseEnter={(event) => {
                        setHoveredPoint(point);
                        updateTooltipPosition(event);
                      }}
                      onMouseMove={(event) => {
                        setHoveredPoint(point);
                        updateTooltipPosition(event);
                      }}
                      onMouseLeave={() => {
                        setHoveredPoint(null);
                        setTooltipPosition(null);
                      }}
                      onFocus={() => {
                        const tooltipWidth = tooltipRef.current?.offsetWidth ?? 360;
                        const tooltipHeight = tooltipRef.current?.offsetHeight ?? 180;
                        setHoveredPoint(point);
                        setTooltipPosition({
                          left: Math.max(
                            12,
                            Math.min(x + 18, GRAPH_STAGE_WIDTH - tooltipWidth - 12),
                          ),
                          top: Math.max(
                            12,
                            Math.min(y + 18, GRAPH_STAGE_HEIGHT - tooltipHeight - 12),
                          ),
                        });
                      }}
                      onBlur={() => {
                        setHoveredPoint(null);
                        setTooltipPosition(null);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setHoveredPoint(point);
                          const tooltipWidth = tooltipRef.current?.offsetWidth ?? 360;
                          const tooltipHeight = tooltipRef.current?.offsetHeight ?? 180;
                          setTooltipPosition({
                            left: Math.max(
                              12,
                              Math.min(x + 18, GRAPH_STAGE_WIDTH - tooltipWidth - 12),
                            ),
                            top: Math.max(
                              12,
                              Math.min(y + 18, GRAPH_STAGE_HEIGHT - tooltipHeight - 12),
                            ),
                          });
                        }
                      }}
                      aria-label={`${formatVersionLabel(point.version)} score rate ${formatRate(point.scoreRate)}`}
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r={isApproved ? 10 : 7}
                        fill={isApproved ? "var(--site-accent-soft)" : "#71717a"}
                        stroke={
                          isApproved ? "var(--site-accent-strong)" : "#a1a1aa"
                        }
                        strokeWidth="3"
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r="24"
                        fill="transparent"
                        stroke="transparent"
                        className="cursor-pointer"
                      />
                    </g>
                  );
                })}
              </svg>

                {hoveredPoint ? (
                <div
                  ref={tooltipRef}
                  className="site-tooltip-panel pointer-events-none absolute z-10 max-w-[360px] rounded-lg p-4 text-[20px]"
                  style={{
                    left: `${tooltipPosition?.left ?? 12}px`,
                    top: `${tooltipPosition?.top ?? 12}px`,
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <strong className="text-[color:var(--site-text-strong)]">
                      {formatVersionLabel(hoveredPoint.version)}
                    </strong>
                    <span className="rounded-full border border-[color:var(--site-border)] px-2 py-0.5 text-[14px] uppercase tracking-[0.12em] text-[color:var(--site-text-muted)]">
                      {hoveredPoint.status}
                    </span>
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                    <dt className="text-[color:var(--site-text-muted)]">
                      Experiment
                    </dt>
                    <dd className="text-right">{hoveredPoint.experimentLabel}</dd>
                    <dt className="text-[color:var(--site-text-muted)]">
                      Score rate
                    </dt>
                    <dd className="text-right">
                      {formatRate(hoveredPoint.scoreRate)}
                    </dd>
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
          </div>
        </div>
      ) : null}

      {normalizedOpponentName === "stockfish-1350" ? (
        <p className="mt-3 border-t border-[color:var(--site-border)] pt-3 text-sm text-[color:var(--site-text-muted)]">
          <strong className="font-semibold text-[color:var(--site-text-strong)]">
            Note:
          </strong>{" "}
          V3.0 was a manual decision to trade short-term score rate for a major
          chess-engine architecture change. That dip reflects the project
          direction, not a flaw in the <code>autoresearch-chess</code> workflow.
        </p>
      ) : null}
    </section>
  );
};

export default ChessScoreRateGraph;
