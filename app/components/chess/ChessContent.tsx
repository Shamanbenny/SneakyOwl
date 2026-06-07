import React, { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { ToastContainer, toast, Slide } from "react-toastify";
import ChessVersionInfo from "./ChessVersionInfo";
import InfoTooltip from "@/app/components/shared/feedback/InfoTooltip";

const CHESS_BOT_OPTIONS = [
  {
    label: "Chess Bot v3.0",
    route: "chess_v3_0",
    value: "v3.0",
  },
  {
    label: "Chess Bot v2.9",
    route: "chess_v2_9",
    value: "v2.9",
  },
  {
    label: "Chess Bot v2.0",
    route: "chess_v2_0",
    value: "v2.0",
  },
  {
    label: "Chess Bot v0",
    route: "chess_v0",
    value: "v0",
  },
] as const;

type ChessBotVersion = (typeof CHESS_BOT_OPTIONS)[number]["value"];
type PlayerColor = "w" | "b";

type ChessApiDebugDetails = Record<string, unknown>;

type DebugDetailItem = {
  label: string;
  tooltip?: React.ReactNode;
  value: unknown;
};

type ChessApiDebug = {
  version?: string;
  engine?: string;
  selected_move_uci?: string;
  selected_move_san?: string;
  score?: number;
  completed_depth?: number;
  time_limit_seconds?: number;
  timed_out?: boolean;
  moves_evaluated?: number;
  nodes_searched?: number;
  tt_entries?: number;
  tt_probes?: number;
  tt_hits?: number;
  tt_cutoffs?: number;
  opening_book?: ChessApiDebugDetails;
  tt_context?: ChessApiDebugDetails;
  processing_time?: number;
  status?: number;
  reason?: string;
  [key: string]: unknown;
};

type ChessApiResponse = {
  move?: string;
  processing_time?: number;
  debug?: ChessApiDebug;
  error?: string;
};

type ChessApiRequestPayload = {
  fen: string;
  game_id?: string;
  reset_context?: boolean;
};

const CHESS_API_BASE_URL = "https://chess.sneakyowl.net";
const STARTING_FEN = new Chess().fen();
const BOARD_CONTAINER_CLASS =
  "mx-auto w-[500px] items-center justify-center text-center max-sm:w-[230px] max-xs:w-[230px]";

const createGameId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const formatDebugValue = (value: unknown) => {
  if (typeof value === "number") {
    return Number.isInteger(value) ? value.toLocaleString() : value.toFixed(3);
  }

  if (typeof value === "boolean") {
    return value ? "yes" : "no";
  }

  if (value === null || value === undefined || value === "") {
    return "n/a";
  }

  return String(value);
};

const getNumberDebugValue = (
  debug: ChessApiDebug | undefined,
  key: keyof ChessApiDebug,
) => {
  const value = debug?.[key];
  return typeof value === "number" ? value : undefined;
};

const getDetailValue = (details: ChessApiDebugDetails | undefined, key: string) =>
  details?.[key];

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const getEvalFillPercentage = (whitePerspectiveScore: number) => {
  const absScore = Math.abs(whitePerspectiveScore);

  if (absScore >= 999000) {
    return whitePerspectiveScore >= 0 ? 100 : 0;
  }

  if (absScore >= 500) {
    const extraFill = ((absScore - 500) / (999000 - 500)) * 5;
    const base = 95 + extraFill;
    return whitePerspectiveScore >= 0 ? base : 100 - base;
  }

  const base = 50 + (absScore / 500) * 45;
  return whitePerspectiveScore >= 0 ? base : 100 - base;
};

const SCORE_TOOLTIP_CONTENT = (
  <div className="space-y-3">
    <p className="m-0">
      The engine reports score in centipawns from the side-to-move perspective. Just to put that
      into perspective, a pawn is worth about <strong>100</strong> points.
    </p>
    <p className="m-0">
      For you as the player: A{" "}
      <strong>negative</strong> score is better for you, while a{" "}
      <strong>positive</strong> score is better for the agent.
    </p>
    <div>
      <p className="m-0 font-semibold text-[color:var(--site-text-strong)]">Quick reference</p>
      <div className="mt-2 overflow-hidden rounded-md border border-[color:var(--site-border)]">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="bg-[color:var(--site-bg-soft)] text-[color:var(--site-text-strong)]">
            <tr>
              <th className="px-2 py-1.5 font-semibold">Score</th>
              <th className="px-2 py-1.5 font-semibold">Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-[color:var(--site-border)]">
              <td className="px-2 py-1.5">0 to 30</td>
              <td className="px-2 py-1.5">Roughly equal</td>
            </tr>
            <tr className="border-t border-[color:var(--site-border)]">
              <td className="px-2 py-1.5">30 to 100</td>
              <td className="px-2 py-1.5">Small edge</td>
            </tr>
            <tr className="border-t border-[color:var(--site-border)]">
              <td className="px-2 py-1.5">100 to 300</td>
              <td className="px-2 py-1.5">Clear advantage</td>
            </tr>
            <tr className="border-t border-[color:var(--site-border)]">
              <td className="px-2 py-1.5">300+</td>
              <td className="px-2 py-1.5">Large advantage</td>
            </tr>
            <tr className="border-t border-[color:var(--site-border)]">
              <td className="px-2 py-1.5">~999999</td>
              <td className="px-2 py-1.5">Forced mate territory</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div>
      <p className="m-0 font-semibold text-[color:var(--site-text-strong)]">Piece values</p>
      <div className="mt-2 overflow-hidden rounded-md border border-[color:var(--site-border)]">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="bg-[color:var(--site-bg-soft)] text-[color:var(--site-text-strong)]">
            <tr>
              <th className="px-2 py-1.5 font-semibold">Piece</th>
              <th className="px-2 py-1.5 font-semibold">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-[color:var(--site-border)]">
              <td className="px-2 py-1.5">Pawn</td>
              <td className="px-2 py-1.5">100</td>
            </tr>
            <tr className="border-t border-[color:var(--site-border)]">
              <td className="px-2 py-1.5">Knight</td>
              <td className="px-2 py-1.5">320</td>
            </tr>
            <tr className="border-t border-[color:var(--site-border)]">
              <td className="px-2 py-1.5">Bishop</td>
              <td className="px-2 py-1.5">330</td>
            </tr>
            <tr className="border-t border-[color:var(--site-border)]">
              <td className="px-2 py-1.5">Rook</td>
              <td className="px-2 py-1.5">500</td>
            </tr>
            <tr className="border-t border-[color:var(--site-border)]">
              <td className="px-2 py-1.5">Queen</td>
              <td className="px-2 py-1.5">900</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <p className="m-0">
      This is an internal evaluation scale, not a win probability. Because the engine is
      heuristic-driven, treat score values as a rough directional signal rather
      than a precise measurement.
    </p>
  </div>
);

const EvaluationBar = ({
  score,
  playerColor,
}: {
  score: number | undefined;
  playerColor: PlayerColor;
}) => {
  const botColor = playerColor === "w" ? "b" : "w";

  if (typeof score !== "number") {
    return (
      <div className={`${BOARD_CONTAINER_CLASS} mt-3`}>
        <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-[0.12em] text-[color:var(--site-text-muted)]">
          <span>Evaluation</span>
          <span>n/a</span>
        </div>
        <div className="h-4 overflow-hidden border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-soft)]">
          <div className="h-full w-full bg-[color:var(--site-text-faint)]" />
        </div>
      </div>
    );
  }

  const whitePerspectiveScore = botColor === "w" ? score : -score;
  const whiteFill = clamp(getEvalFillPercentage(whitePerspectiveScore), 0, 100);
  const userPerspectiveScore = playerColor === "w" ? whitePerspectiveScore : -whitePerspectiveScore;
  const absScore = Math.abs(userPerspectiveScore);
  const evaluationText =
    userPerspectiveScore > 0
      ? `You're winning by ${absScore}`
      : userPerspectiveScore < 0
        ? `You're losing by ${absScore}`
        : "Position is equal";

  return (
    <div className={`${BOARD_CONTAINER_CLASS} mt-3`}>
      <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-[0.12em] text-[color:var(--site-text-muted)]">
        <span>Evaluation</span>
        <span>{evaluationText}</span>
      </div>
      <div className="flex h-4 overflow-hidden border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-soft)]">
        <div
          className="h-full bg-white transition-[width] duration-200"
          style={{ width: `${whiteFill}%` }}
        />
        <div
          className="h-full bg-black transition-[width] duration-200"
          style={{ width: `${100 - whiteFill}%` }}
        />
      </div>
    </div>
  );
};

const getBooleanLikeValue = (value: unknown) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (normalized === "yes" || normalized === "true") {
      return true;
    }

    if (normalized === "no" || normalized === "false") {
      return false;
    }
  }

  return undefined;
};

const getNumericLikeValue = (value: unknown) => {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  return undefined;
};

const getDeltaAsBoolean = (
  beforeValue: unknown,
  afterValue: unknown,
) => {
  const before = getNumericLikeValue(beforeValue);
  const after = getNumericLikeValue(afterValue);

  if (typeof before !== "number" || typeof after !== "number") {
    return undefined;
  }

  return after > before;
};

const DebugLabel = ({
  label,
  tooltip,
}: {
  label: string;
  tooltip?: React.ReactNode;
}) => (
  <span className="inline-flex items-center gap-1 text-[color:var(--site-text-muted)]">
    <span>{label}</span>
    {tooltip ? (
      <InfoTooltip
        ariaLabel={`${label} explanation`}
        panelClassName="border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-elevated)] text-[color:var(--site-text-muted)] shadow-[0_18px_45px_rgba(0,0,0,0.28)]"
        preferredPlacement="top"
        className="shrink-0"
      >
        {tooltip}
      </InfoTooltip>
    ) : null}
  </span>
);

const DebugMetric = ({
  label,
  tooltip,
  value,
}: {
  label: string;
  tooltip?: React.ReactNode;
  value: unknown;
}) => (
  <div className="rounded-md border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)] px-3 py-2 text-left">
    <p className="text-xs">
      <DebugLabel label={label} tooltip={tooltip} />
    </p>
    <p className="mt-1 text-sm font-semibold text-[color:var(--site-text-strong)]">
      {formatDebugValue(value)}
    </p>
  </div>
);

const DebugDetails = ({
  title,
  summary,
  items,
}: {
  title: string;
  summary?: string;
  items: DebugDetailItem[];
}) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="rounded-md border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)] px-3 py-3 text-left">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-[color:var(--site-text-strong)]">
          {title}
        </h3>
      </div>
      {summary ? (
        <p className="mt-2 text-xs leading-5 text-[color:var(--site-text-muted)]">
          {summary}
        </p>
      ) : null}
      <dl className="mt-3 grid gap-2 text-xs text-[color:var(--site-text-muted)] sm:grid-cols-2">
        {items.map(({ label, tooltip, value }) => (
          <div key={label} className="min-w-0">
            <dt className="break-words">
              <DebugLabel label={label} tooltip={tooltip} />
            </dt>
            <dd className="mt-1 break-words font-medium text-[color:var(--site-text)]">
              {formatDebugValue(value)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

const getOpeningBookSummary = (details: ChessApiDebugDetails | undefined) => {
  if (!details) {
    return undefined;
  }

  const matchedPosition = getBooleanLikeValue(getDetailValue(details, "matched_position"));
  const selectedMove = getDetailValue(details, "selected_move_uci");
  const skippedReason = getDetailValue(details, "skipped_reason");

  if (matchedPosition && selectedMove) {
    return `This move came from the opening book. The engine matched the current position and selected ${formatDebugValue(
      selectedMove,
    )} without running the main search.`;
  }

  if (skippedReason && formatDebugValue(skippedReason) !== "n/a") {
    return `The opening book did not provide a move for this request: ${formatDebugValue(skippedReason)}.`;
  }

  return "These fields describe the opening-book lookup path that runs before the engine falls back to search.";
};

const getOpeningBookItems = (
  details: ChessApiDebugDetails | undefined,
): DebugDetailItem[] => {
  if (!details) {
    return [];
  }

  const cacheHitThisRequest = getDeltaAsBoolean(
    getDetailValue(details, "cache_hits_before"),
    getDetailValue(details, "cache_hits_after"),
  );
  const cacheMissThisRequest = getDeltaAsBoolean(
    getDetailValue(details, "cache_misses_before"),
    getDetailValue(details, "cache_misses_after"),
  );

  return [
    {
      label: "Book enabled",
      tooltip: "Whether opening-book lookup was allowed to run for this request.",
      value: getDetailValue(details, "enabled"),
    },
    {
      label: "Book match found",
      tooltip: "Whether the current normalized position existed in the opening-book file.",
      value: getDetailValue(details, "matched_position"),
    },
    {
      label: "Selected book move",
      tooltip: "The move chosen from the opening book in UCI notation.",
      value: getDetailValue(details, "selected_move_uci"),
    },
    {
      label: "Candidate moves",
      tooltip: "How many move options were stored for this exact book position.",
      value: getDetailValue(details, "candidate_move_count"),
    },
    {
      label: "Legal book moves",
      tooltip: "How many stored book moves were legal in the current board position.",
      value: getDetailValue(details, "legal_candidate_move_count"),
    },
    {
      label: "Cache hit this request",
      tooltip: "True means the opening book was already loaded in process memory and this call reused it.",
      value: cacheHitThisRequest,
    },
    {
      label: "Cache miss this request",
      tooltip: "True means the loader had to fetch the opening-book data instead of reusing the in-process cache.",
      value: cacheMissThisRequest,
    },
    {
      label: "Loaded from disk this call",
      tooltip: "Whether the opening-book file was freshly loaded during this request.",
      value: getDetailValue(details, "lookup_loaded_during_call"),
    },
    {
      label: "Lookup file",
      tooltip: "The backing file used for opening-book lookups.",
      value: getDetailValue(details, "lookup_file"),
    },
    {
      label: "Book positions",
      tooltip: "How many distinct normalized positions exist in the lookup file.",
      value: getDetailValue(details, "lookup_position_count"),
    },
    {
      label: "Lookup time",
      tooltip: "Time spent preparing the opening-book data for this request. Cached reads are usually near zero.",
      value: getDetailValue(details, "lookup_load_elapsed_seconds"),
    },
    {
      label: "Position key",
      tooltip:
        "The normalized FEN used for lookup. It keeps board layout, side to move, castling rights, and en passant square, but ignores move counters.",
      value: getDetailValue(details, "fen_key"),
    },
    {
      label: "Current piece count",
      tooltip: "The number of pieces currently on the board.",
      value: getDetailValue(details, "position_piece_count"),
    },
    {
      label: "Required piece count",
      tooltip: "The opening book only runs when this many pieces remain on the board.",
      value: getDetailValue(details, "requires_full_starting_piece_count"),
    },
    {
      label: "Skipped reason",
      tooltip: "Why the opening book did not return a move. n/a means nothing was skipped.",
      value: getDetailValue(details, "skipped_reason"),
    },
  ];
};

const getTtContextSummary = (details: ChessApiDebugDetails | undefined) => {
  if (!details) {
    return undefined;
  }

  const contextCreated = getBooleanLikeValue(getDetailValue(details, "context_created"));
  const contextFound = getBooleanLikeValue(getDetailValue(details, "context_found"));
  const resetRequested = getBooleanLikeValue(getDetailValue(details, "reset_requested"));
  const skippedReason = getDetailValue(details, "skipped_reason");

  if (contextCreated) {
    return `Per-game transposition-table context was enabled and a new context was created for this request${
      resetRequested ? " because a reset was requested" : ""
    }.`;
  }

  if (contextFound) {
    return "Per-game transposition-table context reused an existing saved context for this request.";
  }

  if (skippedReason && formatDebugValue(skippedReason) !== "n/a") {
    return `Context handling was skipped: ${formatDebugValue(skippedReason)}.`;
  }

  return "These fields describe the request-level transposition-table context that can persist engine state across moves in the same game.";
};

const getTtContextItems = (
  details: ChessApiDebugDetails | undefined,
): DebugDetailItem[] => {
  if (!details) {
    return [];
  }

  return [
    {
      label: "Context enabled",
      tooltip: "Whether per-game context reuse was enabled for this request.",
      value: getDetailValue(details, "enabled"),
    },
    {
      label: "Context id",
      tooltip: "The identifier used to look up this game or session context.",
      value: getDetailValue(details, "context_id"),
    },
    {
      label: "Existing context found",
      tooltip: "True means the server already had saved state for this context id before handling the request.",
      value: getDetailValue(details, "context_found"),
    },
    {
      label: "Created new context",
      tooltip: "True means a fresh context object was created during this request.",
      value: getDetailValue(details, "context_created"),
    },
    {
      label: "Reset requested",
      tooltip: "Whether the request explicitly asked the server to reset the saved context first.",
      value: getDetailValue(details, "reset_requested"),
    },
    {
      label: "Context reset",
      tooltip: "True means an existing context was cleared and restarted during this request.",
      value: getDetailValue(details, "context_reset"),
    },
    {
      label: "Searches before request",
      tooltip: "How many searches had already been run inside this context before this request started.",
      value: getDetailValue(details, "search_count_before"),
    },
    {
      label: "Searches after request",
      tooltip: "How many searches had been completed in this context after this request finished.",
      value: getDetailValue(details, "search_count_after"),
    },
    {
      label: "TT entries before search",
      tooltip: "The sampled number of transposition-table entries before search began. n/a usually means no search ran.",
      value: getDetailValue(details, "tt_entries_before"),
    },
    {
      label: "TT entries after search",
      tooltip: "The sampled number of transposition-table entries after search ended. n/a usually means no search ran.",
      value: getDetailValue(details, "tt_entries_after"),
    },
    {
      label: "Active contexts in memory",
      tooltip: "How many per-game contexts the process was holding after this request.",
      value: getDetailValue(details, "cache_size_after"),
    },
    {
      label: "Contexts evicted",
      tooltip: "How many old contexts were removed during this request because of expiry or cache limits.",
      value: getDetailValue(details, "evicted_context_count"),
    },
    {
      label: "Skipped reason",
      tooltip: "Why context handling was skipped. n/a means it ran normally.",
      value: getDetailValue(details, "skipped_reason"),
    },
  ];
};

const ChessDebugPanel = ({
  response,
}: {
  response: ChessApiResponse | null;
}) => {
  const debug = response?.debug;
  const ttProbes = getNumberDebugValue(debug, "tt_probes");
  const ttHits = getNumberDebugValue(debug, "tt_hits");
  const ttHitRate =
    ttProbes && ttProbes > 0 && typeof ttHits === "number"
      ? `${((ttHits / ttProbes) * 100).toFixed(2)}%`
      : "n/a";
  const openingBookItems = getOpeningBookItems(debug?.opening_book);
  const ttContextItems = getTtContextItems(debug?.tt_context);

  if (!response) {
    return null;
  }

  return (
    <section className="mx-auto mt-5 w-[300px] text-[color:var(--site-text)] sm:w-[560px] md:w-[680px] lg:w-[910px] xl:w-[1160px] xxl:w-[1480px]">
      <details open className="site-surface-card rounded-lg p-4">
        <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
          <div className="flex flex-col gap-1 text-left sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[color:var(--site-text-strong)]">
                Latest Debug Information
              </h2>
              <p className="text-sm text-[color:var(--site-text-muted)]">
                {debug?.engine ?? "Unknown engine"}
              </p>
            </div>
            <p className="pr-5 text-sm text-[color:var(--site-text-muted)] sm:pr-0">
              {response.error ?? response.move ?? "No move returned"}
            </p>
          </div>
        </summary>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <DebugMetric label="Version" value={debug?.version} />
          <DebugMetric
            label="Selected move"
            tooltip="The SAN move returned by the engine for this request."
            value={debug?.selected_move_san ?? response.move}
          />
          <DebugMetric
            label="Depth"
            tooltip="The deepest completed search depth. n/a means the move came from the opening book instead of search."
            value={debug?.completed_depth}
          />
          <DebugMetric
            label="Score"
            tooltip={SCORE_TOOLTIP_CONTENT}
            value={debug?.score}
          />
          <DebugMetric
            label="Processing time"
            tooltip="Total server-side handling time for this move request."
            value={response.processing_time ?? debug?.processing_time}
          />
          <DebugMetric
            label="Nodes searched"
            tooltip="How many search-tree positions the engine explored while choosing the move."
            value={debug?.nodes_searched}
          />
          <DebugMetric
            label="Moves evaluated"
            tooltip="How many candidate moves the engine actively evaluated during the search loop."
            value={debug?.moves_evaluated}
          />
          <DebugMetric
            label="TT hit rate"
            tooltip="Transposition-table hit rate: how often the search found a previously cached position during TT probes."
            value={ttHitRate}
          />
        </div>
        <div className="mt-3 grid gap-2 lg:grid-cols-2">
          <DebugDetails
            title="Opening Book"
            summary={getOpeningBookSummary(debug?.opening_book)}
            items={openingBookItems}
          />
          <DebugDetails
            title="TT Context"
            summary={getTtContextSummary(debug?.tt_context)}
            items={ttContextItems}
          />
        </div>
      </details>
    </section>
  );
};

const logChessEndpointDebug = (
  selectedBot: (typeof CHESS_BOT_OPTIONS)[number],
  endpoint: string,
  requestBody: ChessApiRequestPayload,
  response: Response,
  responseBody: ChessApiResponse,
) => {
  const debug = responseBody.debug ?? {};
  const processingTime =
    responseBody.processing_time ?? debug.processing_time ?? "n/a";

  console.groupCollapsed(
    `[Chess ${selectedBot.value}] ${response.status} ${response.statusText || "response"}: ${
      responseBody.move ?? responseBody.error ?? "no move"
    }`,
  );
  console.info("Endpoint", {
    url: endpoint,
    route: selectedBot.route,
    version: selectedBot.value,
    status: response.status,
    ok: response.ok,
  });
  console.info("Request", requestBody);
  console.info("Response", {
    move: responseBody.move,
    error: responseBody.error,
    processing_time: processingTime,
  });
  console.info("Debug", debug);

  if (typeof debug.tt_probes === "number" && debug.tt_probes > 0) {
    console.info("Derived debug", {
      tt_hit_rate: `${(((debug.tt_hits ?? 0) / debug.tt_probes) * 100).toFixed(2)}%`,
    });
  }

  console.groupEnd();
};

const ChessContent = () => {
  const [game, setGame] = useState(new Chess());
  const [turnMessage, setTurnMessage] = useState("Your turn");
  const [pieceDraggable, setPieceDraggable] = useState(true);
  const [botVersion, setBotVersion] = useState<ChessBotVersion>("v3.0");
  const [playerColor, setPlayerColor] = useState<PlayerColor>("w");
  const [latestApiResponse, setLatestApiResponse] =
    useState<ChessApiResponse | null>(null);
  const fenInputRef = useRef<HTMLInputElement>(null); // Ref for the FEN input field
  const gameIdRef = useRef<string | null>(null);
  const resetContextOnNextMoveRef = useRef(true);
  const lastPlayerPositionFenRef = useRef<string | null>(null);
  const activeBotRequestIdRef = useRef(0);

  if (gameIdRef.current === null) {
    gameIdRef.current = createGameId();
  }

  const syncTurnState = (currentGame: Chess) => {
    if (currentGame.isCheckmate()) {
      const playerWon = currentGame.turn() !== playerColor;
      setTurnMessage(
        playerWon ? "Checkmate! You win!" : "Checkmate! You lose.",
      );
      setPieceDraggable(false);
      return;
    }

    if (currentGame.isStalemate()) {
      setTurnMessage("Stalemate! Draw.");
      setPieceDraggable(false);
      return;
    }

    const isPlayerTurn = currentGame.turn() === playerColor;
    setTurnMessage(isPlayerTurn ? "Your turn" : "Bot's turn");
    setPieceDraggable(isPlayerTurn);
  };

  const loadGameFromFen = (fen: string) => {
    const nextFen = fen.trim() || STARTING_FEN;
    const newGame = new Chess(nextFen);

    activeBotRequestIdRef.current += 1;
    gameIdRef.current = createGameId();
    resetContextOnNextMoveRef.current = true;
    lastPlayerPositionFenRef.current = null;
    setLatestApiResponse(null);
    setGame(newGame);
    if (fenInputRef.current) {
      fenInputRef.current.value = nextFen;
    }

    if (newGame.turn() !== playerColor) {
      setTurnMessage("Bot's turn");
      setPieceDraggable(false);
      setTimeout(() => {
        makeBotMove();
      }, 0);
      return;
    }

    syncTurnState(newGame);
  };

  const onDrop = (sourceSquare: any, targetSquare: any) => {
    if (game.turn() !== playerColor) {
      return false;
    }

    // Get all legal moves for the current position
    const legalMoves = game.moves({ square: sourceSquare, verbose: true });
    // Check if the target square is a valid destination
    const isLegalMove = legalMoves.some((move) => move.to === targetSquare);

    if (!isLegalMove) {
      console.log(`Illegal move from ${sourceSquare} to ${targetSquare}`);
      return false; // Reject the move
    }

    const previousFen = game.fen();
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // Auto-promote to queen for simplicity
    });

    if (move === null) return false; // Invalid move
    lastPlayerPositionFenRef.current = previousFen;
    setGame(new Chess(game.fen())); // Update game state
    if (fenInputRef.current) fenInputRef.current.value = game.fen(); // Update FEN input

    makeBotMove(); // After player's move, let the bot play
    return true;
  };

  const makeBotMove = async () => {
    const requestId = activeBotRequestIdRef.current + 1;
    activeBotRequestIdRef.current = requestId;
    const currGame = new Chess(fenInputRef.current?.value);
    const selectedBot =
      CHESS_BOT_OPTIONS.find((option) => option.value === botVersion) ??
      CHESS_BOT_OPTIONS[0];
    setPieceDraggable(false); // Disable piece dragging while bot is playing OR game over

    // Check for Checkmate or Stalemate
    if (currGame.isCheckmate()) {
      syncTurnState(currGame);
      return; // Stop execution, as the game has ended
    }
    if (currGame.isStalemate()) {
      syncTurnState(currGame);
      return; // Stop execution, as the game has ended
    }

    try {
      setTurnMessage("Bot's turn");
      const endpoint = `${CHESS_API_BASE_URL}/${selectedBot.route}`;
      const requestBody: ChessApiRequestPayload = { fen: currGame.fen() };

      if (selectedBot.value === "v3.0") {
        requestBody.game_id = gameIdRef.current ?? createGameId();
        requestBody.reset_context = resetContextOnNextMoveRef.current;
      }

      // [API CALL] Fetch the bot's move from the server
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CHESS_API_KEY}`, // Use environment variable for the API key
        },
        body: JSON.stringify(requestBody),
      });

      const responseBody = (await response.json()) as ChessApiResponse;
      if (activeBotRequestIdRef.current !== requestId) {
        return;
      }
      resetContextOnNextMoveRef.current = false;
      setLatestApiResponse(responseBody);
      logChessEndpointDebug(
        selectedBot,
        endpoint,
        requestBody,
        response,
        responseBody,
      );

      if (!response.ok) {
        const errorDetails =
          typeof responseBody?.error === "string"
            ? responseBody.error
            : JSON.stringify(responseBody);
        throw new Error(
          `API Error: ${response.status} ${response.statusText}. ${errorDetails}`,
        );
      }

      const { move } = responseBody;

      if (move) {
        currGame.move(move);
        if (activeBotRequestIdRef.current !== requestId) {
          return;
        }
        setGame(new Chess(currGame.fen()));
        if (fenInputRef.current) fenInputRef.current.value = currGame.fen(); // Update FEN input

        syncTurnState(currGame);
      } else {
        throw new Error("API response did not include a move.");
      }
    } catch (error) {
      if (activeBotRequestIdRef.current !== requestId) {
        return;
      }
      console.error("Error fetching bot move:", error);
      setTurnMessage("Error fetching bot move");
      setPieceDraggable(true);
    }
  };

  const handleFenSubmit = () => {
    try {
      const fen = fenInputRef.current?.value ?? "";
      loadGameFromFen(fen);
    } catch (error) {
      toast.error("Invalid FEN, please try again!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
    }
  };

  const handleReset = () => {
    loadGameFromFen(STARTING_FEN);
  };

  const handleUndoPlayerMove = () => {
    const previousFen = lastPlayerPositionFenRef.current;

    if (!previousFen) {
      return;
    }

    loadGameFromFen(previousFen);
  };

  useEffect(() => {
    syncTurnState(game);

    if (!game.isGameOver() && game.turn() !== playerColor) {
      makeBotMove();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerColor]);

  return (
    <>
      <div className="mt-4 text-center text-2xl">{turnMessage}</div>
      <EvaluationBar
        score={typeof latestApiResponse?.debug?.score === "number" ? latestApiResponse.debug.score : undefined}
        playerColor={playerColor}
      />
      <div
        className={`${BOARD_CONTAINER_CLASS} border-4 border-[color:var(--site-border-strong)]`}
      >
        <Chessboard
          position={game.fen()}
          boardOrientation={playerColor === "w" ? "white" : "black"}
          showBoardNotation={true}
          onPieceDrop={onDrop}
          customLightSquareStyle={{ backgroundColor: "#d1fae5" }}
          customDarkSquareStyle={{ backgroundColor: "#34d399" }}
          customDropSquareStyle={{
            boxShadow: "inset 0 0 1px 6px rgba(6,95,70,1)",
          }}
          autoPromoteToQueen={true}
          arePiecesDraggable={pieceDraggable}
          animationDuration={150}
        />
      </div>
      <div className="mt-4 text-center">
        <input
          type="text"
          className="site-input w-60 rounded-md p-2 sm:w-[500px] lg:w-[550px]"
          placeholder="Enter FEN string"
          defaultValue={game.fen()} // Set initial value as the current game's FEN
          ref={fenInputRef} // Attach the ref to the input element
        />
        <div className="mt-2 flex items-center justify-center gap-2">
          <button
            className="site-button-primary rounded px-4 py-2"
            onClick={handleFenSubmit}
          >
            Submit FEN
          </button>
          <button
            className="site-button-primary rounded px-4 py-2"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            className="site-button-primary rounded px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleUndoPlayerMove}
            disabled={!lastPlayerPositionFenRef.current}
          >
            Undo player move
          </button>
        </div>
      </div>
      <div className="mt-4 text-center">
        Play as (You):
        <select
          className="site-select mx-2 rounded p-2"
          value={playerColor}
          onChange={(e) => setPlayerColor(e.target.value as PlayerColor)}
        >
          <option value="w">White</option>
          <option value="b">Black</option>
        </select>
      </div>
      <div className="mt-4 text-center">
        Current Bot Version:
        <select
          className="site-select mx-2 rounded p-2"
          value={botVersion}
          onChange={(e) => setBotVersion(e.target.value as ChessBotVersion)}
        >
          {CHESS_BOT_OPTIONS.map((option) => (
            <option key={option.route} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <ChessDebugPanel response={latestApiResponse} />
      <ChessVersionInfo />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        limit={3}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="dark"
        transition={Slide}
      />
    </>
  );
};

export default ChessContent;
