import React, { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { ToastContainer, toast, Slide } from "react-toastify";
import ChessVersionInfo from "./ChessVersionInfo";

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

const DebugMetric = ({ label, value }: { label: string; value: unknown }) => (
  <div className="rounded-md border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)] px-3 py-2 text-left">
    <p className="text-xs text-[color:var(--site-text-faint)]">{label}</p>
    <p className="mt-1 text-sm font-semibold text-[color:var(--site-text-strong)]">
      {formatDebugValue(value)}
    </p>
  </div>
);

const DebugDetails = ({
  title,
  details,
}: {
  title: string;
  details?: ChessApiDebugDetails;
}) => {
  if (!details) {
    return null;
  }

  return (
    <details className="rounded-md border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)] px-3 py-2 text-left">
      <summary className="cursor-pointer text-sm font-semibold text-[color:var(--site-text-strong)]">
        {title}
      </summary>
      <dl className="mt-2 grid gap-2 text-xs text-[color:var(--site-text-muted)] sm:grid-cols-2">
        {Object.entries(details).map(([key, value]) => (
          <div key={key} className="min-w-0">
            <dt className="break-words text-[color:var(--site-text-faint)]">
              {key}
            </dt>
            <dd className="break-words font-medium text-[color:var(--site-text)]">
              {formatDebugValue(value)}
            </dd>
          </div>
        ))}
      </dl>
    </details>
  );
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

  if (!response) {
    return null;
  }

  return (
    <section className="mx-auto mt-5 w-[300px] text-[color:var(--site-text)] sm:w-[560px] md:w-[680px] lg:w-[910px] xl:w-[1160px] xxl:w-[1480px]">
      <div className="site-surface-card rounded-lg p-4">
        <div className="flex flex-col gap-1 text-left sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[color:var(--site-text-strong)]">
              Latest engine debug
            </h2>
            <p className="text-sm text-[color:var(--site-text-muted)]">
              {debug?.engine ?? "Unknown engine"}
            </p>
          </div>
          <p className="text-sm text-[color:var(--site-text-muted)]">
            {response.error ?? response.move ?? "No move returned"}
          </p>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <DebugMetric label="Version" value={debug?.version} />
          <DebugMetric
            label="Selected move"
            value={debug?.selected_move_san ?? response.move}
          />
          <DebugMetric label="Depth" value={debug?.completed_depth} />
          <DebugMetric label="Score" value={debug?.score} />
          <DebugMetric
            label="Processing time"
            value={response.processing_time ?? debug?.processing_time}
          />
          <DebugMetric label="Nodes searched" value={debug?.nodes_searched} />
          <DebugMetric label="Moves evaluated" value={debug?.moves_evaluated} />
          <DebugMetric label="TT hit rate" value={ttHitRate} />
        </div>
        <div className="mt-3 grid gap-2 lg:grid-cols-2">
          <DebugDetails title="Opening book" details={debug?.opening_book} />
          <DebugDetails title="TT context" details={debug?.tt_context} />
        </div>
      </div>
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

    gameIdRef.current = createGameId();
    resetContextOnNextMoveRef.current = true;
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

    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // Auto-promote to queen for simplicity
    });

    if (move === null) return false; // Invalid move
    setGame(new Chess(game.fen())); // Update game state
    if (fenInputRef.current) fenInputRef.current.value = game.fen(); // Update FEN input

    makeBotMove(); // After player's move, let the bot play
    return true;
  };

  const makeBotMove = async () => {
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
        setGame(new Chess(currGame.fen()));
        if (fenInputRef.current) fenInputRef.current.value = currGame.fen(); // Update FEN input

        syncTurnState(currGame);
      } else {
        throw new Error("API response did not include a move.");
      }
    } catch (error) {
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
      <div className="mx-auto w-[500px] items-center justify-center border-4 border-[color:var(--site-border-strong)] text-center max-sm:w-[230px] max-xs:w-[230px]">
        <Chessboard
          position={game.fen()}
          boardOrientation={playerColor === "w" ? "white" : "black"}
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
