"use client";

import React, { useEffect, useState } from "react";
import WorkInProgress from "./WorkInProgress";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

const ChessPage = () => {
  /* AppContent Divider Size Rendering based on User's Width*/
  const [clientWidth, setClientWidth] = useState<number>(1600);
  const [clientHeight, setClientHeight] = useState<number>(900);
  const [turnMessage, setTurnMessage] = useState("Your turn");
  const [pieceDraggable, setPieceDraggable] = useState(true);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
  });

  const handleResize = () => {
    setClientWidth(window.innerWidth);
    setClientHeight(window.innerHeight);
  };

  const [game, setGame] = useState(new Chess());

  const onDrop = (sourceSquare: any, targetSquare: any) => {
    // Get all legal moves for the current position
    const legalMoves = game.moves({ square: sourceSquare, verbose: true });

    // Check if the target square is a valid destination
    const isLegalMove = legalMoves.some(
      (move) => move.to === targetSquare
    );

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

    // After player's move, let the bot play
    makeBotMove();

    return true;
  };

  const makeBotMove = async () => {
    setPieceDraggable(false); // Disable piece dragging while bot is playing OR game over

    // Check for Checkmate or Stalemate
    if (game.isCheckmate()) {
      setTurnMessage("Checkmate! The game is over.");
      return; // Stop execution, as the game has ended
    }
    if (game.isStalemate()) {
      setTurnMessage("Stalemate! The game is over.");
      return; // Stop execution, as the game has ended
    }

    // ---API TESTING---
    try {
      const response = await fetch('https://chess.sneakyowl.net/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-vercel-protection-bypass': `${process.env.CHESS_API_KEY}`,
        },
        body: JSON.stringify({ message: 'Checking if the API call works' }),
      });
      
      if (!response.ok) {
        throw new Error('Testing Failed');
      }

      const data = await response.json();
      console.log('[Chess V1]:', data);
    } catch (error) {
      console.error('Error with API testing:', error);
    }
    // ---API TESTING---

    try {
      setTurnMessage("Bot's turn");
      const response = await fetch('/api/chess_v1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fen: game.fen() }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch bot move');
      }
  
      const { move } = await response.json();
      console.log('[Chess V1]:', move);
  
      if (move) {
        game.move(move);
        setGame(new Chess(game.fen()));
        setTurnMessage("Your turn");
        setPieceDraggable(true); // Enable piece dragging after bot's move
      }
    } catch (error) {
      console.error('Error fetching bot move:', error);
      setTurnMessage("Error fetching bot move");
    }
  };

  return (
    <>
      <div
        className={
          clientWidth < 640
            ? `z-[-1] h-full min-h-screen bg-neutral-300 pl-0 pt-[56px] 
            text-neutral-900 transition-colors duration-150 ease-linear 
            dark:bg-neutral-900 dark:text-neutral-300`
            : `z-[-1] h-full min-h-screen bg-neutral-300 pl-[64px] pt-0 
            text-neutral-900 transition-colors duration-150 ease-linear 
            dark:bg-neutral-900 dark:text-neutral-300 lg:pl-[80px]`
        }
      >
        <div
          className="mx-auto max-sm:w-[300px] max-xs:w-[230px] sm:w-[560px] md:w-[680px] lg:w-[910px] 
              xl:w-[1160px] xxl:w-[1480px]"
        >
          <WorkInProgress />

          {/* Chess Content */}
          <div className="text-center text-2xl mt-4">{turnMessage}</div>
          <div className="max-sm:w-[230px] max-xs:w-[230px] w-[500px] mx-auto text-center justify-center items-center pb-[50px]">
            <Chessboard
              position={game.fen()}
              onPieceDrop={onDrop}
              boardWidth={clientWidth < 640 ? 230 : 500} // Responsive board width
              customLightSquareStyle={{ backgroundColor: "#d1fae5" }}
              customDarkSquareStyle={{ backgroundColor: "#34d399" }}
              customDropSquareStyle={{ boxShadow: 'inset 0 0 1px 6px rgba(6,95,70,1)' }}
              autoPromoteToQueen={true}
              arePiecesDraggable={pieceDraggable}
              animationDuration={0}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChessPage;
