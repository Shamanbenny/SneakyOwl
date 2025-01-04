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

  const makeBotMove = () => {
    const moves = game.moves();
    if (moves.length === 0) {
      if (game.isCheckmate()) {
        setTurnMessage("Checkmate! You Win!");
      } else {
        setTurnMessage("Stalemate! It's a Draw!");
      }
      return;
    }; // Game over

    setTurnMessage("Bot's turn");
    setTimeout(() => {
      botRandomMove(moves);
    }, 500);
  };

  const botRandomMove = (moves: any) => {
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    game.move(randomMove);
    setGame(new Chess(game.fen()));
    setTurnMessage("Your turn");
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
              animationDuration={300}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChessPage;
