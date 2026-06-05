import React, { useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { ToastContainer, toast, Slide } from "react-toastify";
import ChessVersionInfo from "./ChessVersionInfo";

const CHESS_BOT_OPTIONS = [
  {
    label: "Chess Bot v0",
    route: "chess_v0",
    value: "v0",
  },
  {
    label: "Chess Bot v2.0",
    route: "chess_v2_0",
    value: "v2.0",
  },
] as const;

type ChessBotVersion = (typeof CHESS_BOT_OPTIONS)[number]["value"];

const ChessContent = () => {
  const [game, setGame] = useState(new Chess());
  const [turnMessage, setTurnMessage] = useState("Your turn");
  const [pieceDraggable, setPieceDraggable] = useState(true);
  const [botVersion, setBotVersion] = useState<ChessBotVersion>("v2.0");
  const fenInputRef = useRef<HTMLInputElement>(null); // Ref for the FEN input field

  const onDrop = (sourceSquare: any, targetSquare: any) => {
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
      CHESS_BOT_OPTIONS[1];
    setPieceDraggable(false); // Disable piece dragging while bot is playing OR game over

    // Check for Checkmate or Stalemate
    if (currGame.isCheckmate()) {
      setTurnMessage("Checkmate! You win!");
      return; // Stop execution, as the game has ended
    }
    if (currGame.isStalemate()) {
      setTurnMessage("Stalemate! Draw.");
      return; // Stop execution, as the game has ended
    }

    try {
      setTurnMessage("Bot's turn");

      // [API CALL] Fetch the bot's move from the server
      const response = await fetch(`https://chess.sneakyowl.net/${selectedBot.route}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.CHESS_API_KEY}`, // Use environment variable for the API key
        },
        body: JSON.stringify({ fen: currGame.fen() }),
      });
  
      const responseBody = await response.json();

      if (!response.ok) {
        const errorDetails =
          typeof responseBody?.error === "string"
            ? responseBody.error
            : JSON.stringify(responseBody);
        throw new Error(
          `API Error: ${response.status} ${response.statusText}. ${errorDetails}`
        );
      }

      const { move, processing_time, moves_evaluated } = responseBody;
      console.log(
        `[Chess ${selectedBot.value}]:`,
        move,
        `Processing Time: ${processing_time}s, Moves Evaluated: ${moves_evaluated ?? "n/a"}`,
      );
  
      if (move) {
        currGame.move(move);
        setGame(new Chess(currGame.fen()));
        if (fenInputRef.current) fenInputRef.current.value = currGame.fen(); // Update FEN input

        // Check for Checkmate or Stalemate after bot's move
        if (currGame.isCheckmate()) {
          setTurnMessage("Checkmate! You lose.");
          return; // Game over
        }
        if (currGame.isStalemate()) {
          setTurnMessage("Stalemate! Draw.");
          return; // Game over
        }

        // If the game is still on, let the player play
        setTurnMessage("Your turn");
        setPieceDraggable(true); // Enable piece dragging after bot's move
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
    const fen = fenInputRef.current?.value; // Access the FEN input value
    if (!fen) return;

    try {
      const newGame = new Chess(fen); // Validate and create a new Chess instance
      setGame(newGame);

      if (newGame.turn() === "b") {
        setTurnMessage("Bot's turn");
        makeBotMove(); // Trigger bot's move if it's Black's turn
      } else {
        setTurnMessage("Your turn");
        setPieceDraggable(true);
      }
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

  return (
    <>
      <div className="text-center text-2xl mt-4">{turnMessage}</div>
      <div className="mx-auto w-[500px] items-center justify-center border-4 border-[color:var(--site-border-strong)] text-center max-sm:w-[230px] max-xs:w-[230px]">
        <Chessboard
          position={game.fen()}
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
        <br />
        <button
          className="site-button-primary mt-2 rounded px-4 py-2"
          onClick={handleFenSubmit}
        >
          Submit FEN
        </button>
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
