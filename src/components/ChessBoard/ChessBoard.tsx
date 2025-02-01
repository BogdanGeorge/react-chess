import React, { useState } from "react";
import { Chessboard as ReactChessboard } from "react-chessboard";
import { Chess, Square } from "chess.js";

export interface CustomMove {
  from: string;
  to: string;
}

interface ChessBoardProps {
  game: Chess;
  bestMove: CustomMove | null;
  onMove: (from: string, to: string) => boolean;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ game, bestMove, onMove }) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

  function onSquareClick(square: Square) {
    // If a piece is already selected
    if (selectedSquare) {
      // If clicking the same square, deselect it
      if (square === selectedSquare) {
        setSelectedSquare(null);
        return;
      }

      // Check if the clicked square is a valid move
      const moves = game.moves({ square: selectedSquare, verbose: true });
      if (moves.some((move) => move.to === square)) {
        onMove(selectedSquare, square);
        setSelectedSquare(null);
        return;
      }

      // If clicking a different piece that can move, select it instead
      const newMoves = game.moves({ square, verbose: true });
      if (newMoves.length > 0) {
        setSelectedSquare(square);
      } else {
        setSelectedSquare(null);
      }
      return;
    }

    // If the clicked square has a piece that can move, select it
    const moves = game.moves({ square, verbose: true });
    if (moves.length > 0) {
      setSelectedSquare(square);
    }
  }

  // Get all possible moves for the selected piece
  const possibleMoves = selectedSquare
    ? game.moves({ square: selectedSquare, verbose: true })
    : [];

  // Create custom square styles for highlighting
  const customSquareStyles = {
    ...(selectedSquare && {
      [selectedSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
    }),
    ...(bestMove && {
      [bestMove.from]: { backgroundColor: "red" },
      [bestMove.to]: { backgroundColor: "red" },
    }),
    ...Object.fromEntries(
      possibleMoves.map((move) => [
        move.to,
        {
          backgroundColor: "rgba(0, 255, 0, 0.2)",
        },
      ])
    ),
  };

  return (
    <div data-testid="chessboard">
      <ReactChessboard
        position={game.fen()}
        onSquareClick={onSquareClick}
        onPieceDrop={(sourceSquare, targetSquare) =>
          onMove(sourceSquare, targetSquare)
        }
        customSquareStyles={customSquareStyles}
        showPromotionDialog={true}
        showBoardNotation={true}
        boardWidth={500}
      />
    </div>
  );
};

export default ChessBoard;
