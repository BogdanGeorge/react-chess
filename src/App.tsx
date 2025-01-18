import React, { useEffect, useState, useCallback } from "react";
import { Chess, validateFen } from "chess.js";
import { Box, Typography } from "@mui/material";
import { fetchBestMove } from "./services/chessApi";
import GameModeDialog from "./components/GameModeDialog";
import ChessBoard from "./components/ChessBoard/ChessBoard";
import FenInput from "./components/FenInput/FenInput";
import GameControls from "./components/GameControls/GameControls";
import MoveHistory from "./components/MoveHistory/MoveHistory";
import { PLAY_MODES, GameMode } from "./constants/gameConstants";

const App: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [fenInput, setFenInput] = useState<string>(game.fen());
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [showModeDialog, setShowModeDialog] = useState(true);

  const getFen = useCallback(() => game.fen(), [game]);

  const handleModeSelect = (mode: GameMode) => {
    setGameMode(mode);
    if (mode === PLAY_MODES.BLACK_VS_COMPUTER) {
      makeComputerMove();
    }
    setShowModeDialog(false);
  };

  useEffect(() => {
    if (
      (gameMode === PLAY_MODES.WHITE_VS_COMPUTER && game.turn() === "b") ||
      (gameMode === PLAY_MODES.BLACK_VS_COMPUTER && game.turn() === "w")
    ) {
      makeComputerMove();
    }
  }, [game, gameMode]);

  const handleMove = useCallback(
    (from: string, to: string) => {
      const newGame = new Chess(game.fen());
      const move = newGame.move({ from, to, promotion: "q" });

      if (move) {
        setGame(newGame);
        const moveDescription = `${(move.piece || "").toUpperCase()} ${
          move.from
        }-${move.to}`;
        setMoveHistory((history) => [...history, moveDescription]);
        setFenInput(getFen());
        return true;
      }
      return false;
    },
    [game, getFen]
  );

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
    const newGame = new Chess(game.fen());
    newGame.undo();
    if (moveHistory.length > 0) {
      setMoveHistory((history) => history.slice(0, -1));
    }
    setGame(newGame);
    setFenInput(newGame.fen());
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
    </Box>
  );
};

export default App;
