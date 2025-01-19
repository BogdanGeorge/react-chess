import React from "react";
import { Chessboard as ReactChessboard } from "react-chessboard";
import { Chess } from "chess.js";

interface ChessBoardProps {
  game: Chess;
  onMove: (from: string, to: string) => boolean;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ game, onMove }) => {
  return (
    <div data-testid="chessboard">
      <ReactChessboard
        position={game.fen()}
        onPieceDrop={(sourceSquare, targetSquare) =>
          onMove(sourceSquare, targetSquare)
        }
        boardWidth={500}
      />
    </div>
  );
};

export default ChessBoard;
