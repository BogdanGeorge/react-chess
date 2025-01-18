import React, { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard"; // Biblioteca pentru tabla de șah
import { Chess, validateFen } from "chess.js"; // Biblioteca pentru logica jocului
import {
  Button,
  TextField,
  Box,
  Typography,
  List,
  ListItem,
  Switch,
  FormControlLabel,
} from "@mui/material";

const App: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [fenInput, setFenInput] = useState<string>(game.fen());
  const [isComputerPlaying, setIsComputerPlaying] = useState<boolean>(false); // Switch pentru modul de joc

  useEffect(() => {
    // Verificăm dacă este rândul calculatorului să joace
    if (isComputerPlaying && game.turn() === "b") {
      makeComputerMove();
    }
  }, [game]);

  const getFen = () => {
    return game.fen();
  };

  const loadNewFen = () => {
    const newGame = new Chess(fenInput);
    if (validateFen(fenInput).ok === true) {
      setGame(newGame);
      setMoveHistory([]); // Resetăm istoricul mutărilor la încărcarea unui nou FEN
    } else {
      alert("FEN invalid!");
    }
  };

  const handleMove = (from: string, to: string) => {
    const newGame = new Chess(game.fen());
    const move = newGame.move({ from, to, promotion: "q" }); // Promovare implicită la regină

    if (move) {
      setGame(newGame);
      const moveDescription = `${move.piece.toUpperCase()} ${move.from}-${
        move.to
      }`; // Adăugăm piesa mutată
      setMoveHistory([...moveHistory, moveDescription]);
      setFenInput(getFen());

      return true;
    }

    return false;
  };

  const resetGame = () => {
    setGame(new Chess());
    setMoveHistory([]);
  };

  const makeComputerMove = async () => {
    try {
      const response = await fetch("https://chess-api.com/v1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fen: getFen() }),
      });

      const data = await response.json();
      handleMove(data.from, data.to);
    } catch (error) {
      console.error("Error fetching computer move:", error);
    }
  };

  const highlightBestMove = async () => {
    try {
      const response = await fetch("https://chess-api.com/v1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fen: getFen() }),
      });
      const data = await response.json();
      console.log("Best move:", data); // Procesare pentru afișare sau evidențiere

      // Adăugarea mutării în istoricul jocului
      const move = data.text; // De exemplu, "b8=Q+"
      const newMoveHistory: string[] = [...moveHistory, move];
      setMoveHistory(newMoveHistory);

      // Evidențierea mutării pe tablă
      highlightMoveOnBoard(data.from, data.to);
    } catch (error) {
      console.error("Error fetching best move:", error);
    }
  };

  const highlightMoveOnBoard = (from: string, to: string) => {
    const fromSquare = document.querySelector(`[data-square="${from}"]`);
    const toSquare = document.querySelector(`[data-square="${to}"]`);

    if (fromSquare && toSquare) {
      // Adăugăm o clasă CSS pentru evidențiere
      fromSquare.classList.add("highlight");
      toSquare.classList.add("highlight");

      // Poți adăuga o animație CSS pentru efectul vizual
      setTimeout(() => {
        fromSquare.classList.remove("highlight");
        toSquare.classList.remove("highlight");
      }, 2000); // După 2 secunde, eliminăm evidențierea
    }
  };

  // Funcția pentru a dezface ultima mutare
  const undoMove = () => {
    const newGame = new Chess(game.fen());
    newGame.undo();

    // Dacă există o mutare anterioară, o eliminăm din istoricul mutărilor
    if (moveHistory.length > 0) {
      const newMoveHistory = [...moveHistory];
      newMoveHistory.pop();
      setMoveHistory(newMoveHistory);
    }

    setGame(newGame);
    setFenInput(getFen());
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
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", md: "auto" },
          maxWidth: "500px",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Chess App
        </Typography>
        <Chessboard
          position={game.fen()}
          onPieceDrop={(sourceSquare, targetSquare) =>
            handleMove(sourceSquare, targetSquare)
          }
          boardWidth={500}
        />

        {/* FEN input și Load New FEN buton sub tabla de șah */}
        <Box sx={{ marginTop: "20px", width: "100%" }}>
          <TextField
            label="FEN"
            value={fenInput}
            onChange={(e) => setFenInput(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={loadNewFen}
            sx={{ marginTop: "10px", width: "100%" }}
          >
            Load New FEN
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          width: { xs: "100%", md: "300px" },
          marginLeft: { xs: 0, md: "20px" },
        }}
      >
        {/* Switch pe un rând separat */}
        <Box sx={{ marginBottom: "20px" }}>
          <FormControlLabel
            control={
              <Switch
                checked={isComputerPlaying}
                onChange={(e) => setIsComputerPlaying(e.target.checked)}
                color="primary"
              />
            }
            label="Computer Play"
          />
        </Box>

        {/* Butoane pe rândul următor */}
        <Box sx={{ display: "flex", marginBottom: "20px", gap: "10px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={resetGame}
            sx={{ flex: 1 }}
          >
            Reset Game
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={highlightBestMove}
            sx={{ flex: 1 }}
          >
            Highlight Best Move
          </Button>
        </Box>

        <Button
          variant="contained"
          color="warning"
          onClick={undoMove}
          sx={{ width: "100%", marginBottom: "20px" }}
        >
          Undo Move
        </Button>

        <Typography variant="h6" gutterBottom>
          Move History:
        </Typography>
        <Box
          sx={{
            backgroundColor: "#f0f0f0",
            border: "1px solid #000",
            borderRadius: "5px",
            padding: "10px",
            height: "300px",
            overflowY: "auto",
          }}
        >
          <List sx={{ padding: 0, listStyleType: "none" }}>
            {moveHistory.map((move, index) => (
              <ListItem key={index} sx={{ marginBottom: "5px" }}>
                {move}
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default App;
