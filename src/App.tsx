import React, { useEffect, useState, useCallback } from "react";
import { Chess, Move, validateFen } from "chess.js";
import { Box, Typography } from "@mui/material";
import { fetchBestMove } from "./services/chessApi";
import GameModeDialog from "./components/GameModeDialog/GameModeDialog";
import ChessBoard from "./components/ChessBoard/ChessBoard";
import FenInput from "./components/FenInput/FenInput";
import GameControls from "./components/GameControls/GameControls";
import MoveHistory from "./components/MoveHistory/MoveHistory";
import GameEndDialog from "./components/GameEndDialog/GameEndDialog";
import {
  PLAY_MODES,
  GameMode,
  GAME_WINNER,
  GameWinner,
} from "./constants/gameConstants";

const App: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [fenInput, setFenInput] = useState<string>(game.fen());
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [showModeDialog, setShowModeDialog] = useState(true);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [gameWinner, setGameWinner] = useState<GameWinner | null>(null);

  const getFen = useCallback(() => game.fen(), [game]);

  const handleModeSelect = (mode: GameMode) => {
    setGameMode(mode);
    if (mode === PLAY_MODES.BLACK_VS_COMPUTER) {
      makeComputerMove();
    }
    setShowModeDialog(false);
  };

  const isComputerTurn = (gameMode: GameMode, game: Chess) => {
    if (
      (gameMode === PLAY_MODES.WHITE_VS_COMPUTER && game.turn() === "b") ||
      (gameMode === PLAY_MODES.BLACK_VS_COMPUTER && game.turn() === "w")
    ) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    if (isComputerTurn(gameMode, game)) {
      makeComputerMove();
    }
  }, [fenInput, gameMode]);

  const handleMove = useCallback(
    (from: string, to: string) => {
      const newGame = new Chess(game.fen());
      const move = newGame.move({ from, to, promotion: "q" });

      if (!move) return false;

      updateGameState(newGame, move);
      checkGameEnd(newGame);

      return true;
    },
    [game, gameMode]
  );

  // Helper function to update game state
  const updateGameState = (newGame: Chess, move: Move) => {
    setGame(newGame);
    const moveDescription = formatMoveDescription(move);
    setMoveHistory((history) => [...history, moveDescription]);
    setFenInput(newGame.fen());
  };

  // Helper function to format move description
  const formatMoveDescription = (move: Move): string => {
    return `${(move.piece || "").toUpperCase()} ${move.from}-${move.to}`;
  };

  // Helper function to check if the game has ended
  const checkGameEnd = (newGame: Chess) => {
    if (newGame.isCheckmate()) {
      const winner = determineWinner(newGame);
      setGameWinner(winner);
      setShowEndDialog(true);
    }
  };

  // Helper function to determine the winner
  const determineWinner = (newGame: Chess): GameWinner => {
    if (gameMode === PLAY_MODES.HUMAN_VS_HUMAN) {
      return GAME_WINNER.HUMAN; // In human vs human, the player who just moved won
    }

    if (isComputerTurn(gameMode, newGame)) {
      return GAME_WINNER.COMPUTER;
    }

    return GAME_WINNER.HUMAN;
  };

  const makeComputerMove = useCallback(async () => {
    try {
      const data = await fetchBestMove(getFen());
      handleMove(data.from, data.to);
    } catch (error) {
      console.error("Error fetching computer move:", error);
    }
  }, [getFen, handleMove]);

  const loadNewFen = () => {
    if (validateFen(fenInput).ok) {
      setGame(new Chess(fenInput));
      setMoveHistory([]);
    } else {
      alert("FEN invalid!");
    }
  };

  const resetGame = () => {
    setGame(new Chess());
    setMoveHistory([]);
  };

  const highlightBestMove = async () => {
    try {
      const data = await fetchBestMove(getFen());
      const move = data.text;
      setMoveHistory((history) => [...history, move ?? ""]);
    } catch (error) {
      console.error("Error fetching best move:", error);
    }
  };

  const undoMove = () => {
    const moves = game.history();
    if (moves.length === 0) return; // No moves to undo

    const newGame = new Chess();
    console.log(moves);

    // If computer made the last move (in computer vs human modes), undo both moves
    if (
      gameMode !== PLAY_MODES.HUMAN_VS_HUMAN &&
      ((gameMode === PLAY_MODES.WHITE_VS_COMPUTER && game.turn() === "w") ||
        (gameMode === PLAY_MODES.BLACK_VS_COMPUTER && game.turn() === "b"))
    ) {
      moves.slice(0, -2).forEach((move) => {
        newGame.move(move);
      });
      setMoveHistory((history) => history.slice(0, -2));
    } else {
      // Replay all moves except the last one
      moves.slice(0, -1).forEach((move) => {
        newGame.move(move);
      });
      setMoveHistory((history) => history.slice(0, -1));
    }

    setGame(newGame);
    setFenInput(newGame.fen());
  };

  const handleRematch = () => {
    resetGame();
    setShowEndDialog(false);
  };

  const handleEndDialogClose = () => {
    setShowEndDialog(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "center",
        alignItems: { xs: "center", md: "flex-start" },
        padding: "20px",
        gap: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <Box sx={{ width: { xs: "100%", md: "auto" }, maxWidth: "500px" }}>
        <Typography variant="h4" gutterBottom>
          React Chess
        </Typography>
        <ChessBoard game={game} onMove={handleMove} />
        <FenInput
          fenInput={fenInput}
          onFenChange={setFenInput}
          onLoadFen={loadNewFen}
        />
      </Box>

      <Box
        sx={{
          width: { xs: "100%", md: "300px" },
          marginLeft: { xs: 0, md: "20px" },
          display: "flex",
          flexDirection: "column",
          height: "fit-content",
          alignSelf: "flex-start",
        }}
      >
        <GameControls
          onReset={resetGame}
          onHighlightBest={highlightBestMove}
          onUndo={undoMove}
        />
        <MoveHistory moves={moveHistory} />
      </Box>

      <GameModeDialog open={showModeDialog} onModeSelect={handleModeSelect} />
      <GameEndDialog
        open={showEndDialog}
        winner={gameWinner}
        onRematch={handleRematch}
        onClose={handleEndDialogClose}
      />
    </Box>
  );
};

export default App;
