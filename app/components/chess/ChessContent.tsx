import React, { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { ToastContainer, toast, Slide } from "react-toastify";
import ChessVersionInfo from "./ChessVersionInfo";

const CHESS_BOT_OPTIONS = [
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

const CHESS_API_BASE_URL = "https://chess.sneakyowl.net";
const STARTING_FEN = new Chess().fen();

const logChessEndpointDebug = (
  selectedBot: (typeof CHESS_BOT_OPTIONS)[number],
  endpoint: string,
  fen: string,
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
  console.info("Request", { fen });
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
  const [botVersion, setBotVersion] = useState<ChessBotVersion>("v2.9");
  const [playerColor, setPlayerColor] = useState<PlayerColor>("w");
  const fenInputRef = useRef<HTMLInputElement>(null); // Ref for the FEN input field

  const syncTurnState = (currentGame: Chess) => {
    if (currentGame.isCheckmate()) {
      const playerWon = currentGame.turn() !== playerColor;
      setTurnMessage(playerWon ? "Checkmate! You win!" : "Checkmate! You lose.");
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
    const isLegalMove = legalMoves.some( (move) => move.to === targetSquare );

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

      // [API CALL] Fetch the bot's move from the server
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.CHESS_API_KEY}`, // Use environment variable for the API key
        },
        body: JSON.stringify({ fen: currGame.fen() }),
      });
  
      const responseBody = (await response.json()) as ChessApiResponse;
      logChessEndpointDebug(
        selectedBot,
        endpoint,
        currGame.fen(),
        response,
        responseBody,
      );

      if (!response.ok) {
        const errorDetails =
          typeof responseBody?.error === "string"
            ? responseBody.error
            : JSON.stringify(responseBody);
        throw new Error(
          `API Error: ${response.status} ${response.statusText}. ${errorDetails}`
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
      <div className="text-center text-2xl mt-4">{turnMessage}</div>
      <div className="mx-auto w-[500px] items-center justify-center border-4 border-[color:var(--site-border-strong)] text-center max-sm:w-[230px] max-xs:w-[230px]">
        <Chessboard
          position={game.fen()}
          boardOrientation={playerColor === "w" ? "white" : "black"}
          onPieceDrop={onDrop}
          customLightSquareStyle={{ backgroundColor: "#d1fae5" }}
          customDarkSquareStyle={{ backgroundColor: "#34d399" }}
          customDropSquareStyle={{ boxShadow: 'inset 0 0 1px 6px rgba(6,95,70,1)' }}
          autoPromoteToQueen={true}
          arePiecesDraggable={pieceDraggable}
          animationDuration={150}
        />
      </div>
      <div className="text-center mt-4">
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
      <div className="text-center mt-4">
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
      <div className="text-center mt-4">
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
