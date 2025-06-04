import React, { useRef, useState } from 'react'
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { ToastContainer, toast, Slide } from 'react-toastify';
import ChessVersionInfo from './ChessVersionInfo';

const ChessContent = () => {
  const [game, setGame] = useState(new Chess());
  const [turnMessage, setTurnMessage] = useState("Your turn");
  const [pieceDraggable, setPieceDraggable] = useState(true);
  const [botVersion, setBotVersion] = useState("v1-1");
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
      const response = await fetch(`https://chess.sneakyowl.net/chess_${botVersion}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CHESS_API_KEY}`, // Use environment variable for the API key
        },
        body: JSON.stringify({ fen: currGame.fen() }),
      });
  
      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(
          `API Error: ${response.status} ${response.statusText}. ${errorDetails}`
        );
      }
      
      const { move } = await response.json();
      console.log(`[Chess ${botVersion}]:`, move);
  
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
      }
    } catch (error) {
      console.error('Error fetching bot move:', error);
      setTurnMessage("Error fetching bot move");
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
      toast.error('Invalid FEN, please try again!', {
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
      <div className="max-sm:w-[230px] max-xs:w-[230px] w-[500px] mx-auto text-center justify-center items-center dark:border-4 border-4 border-neutral-900">
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
          className="border border-neutral-900 text-neutral-600 p-2 sm:w-[500px] lg:w-[550px] w-60 rounded-md"
          placeholder="Enter FEN string"
          defaultValue={game.fen()} // Set initial value as the current game's FEN
          ref={fenInputRef} // Attach the ref to the input element
        />
        <br />
        <button
          className="px-4 py-2 mt-2 dark:bg-emerald-500 dark:hover:bg-emerald-600 bg-emerald-600 hover:bg-emerald-500 text-white rounded"
          onClick={handleFenSubmit}
        >
          Submit FEN
        </button>
      </div>
      <div className="text-center mt-4">
        Current Bot Version:
        <select
          className="p-2 mx-2 border border-neutral-900 rounded text-neutral-900"
          value={botVersion}
          onChange={(e) => setBotVersion(e.target.value)}
        >
          <option value="v0">Chess Bot v0</option>
          <option value="v1">Chess Bot v1</option>
          <option value="v1-1">Chess Bot v1.1</option>
          <option value="v1-2">Chess Bot v1.2</option>
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
  )
}

export default ChessContent