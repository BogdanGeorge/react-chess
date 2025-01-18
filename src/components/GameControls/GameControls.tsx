import React from "react";
import { Button, Box } from "@mui/material";

interface GameControlsProps {
  onReset: () => void;
  onHighlightBest: () => void;
  onUndo: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  onReset,
  onHighlightBest,
  onUndo,
}) => {
  return (
    <Box
      sx={{
        marginBottom: "20px",
        marginTop: { xs: "20px", md: "48px" },
      }}
    >
      <Box sx={{ display: "flex", marginBottom: "10px", gap: "10px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={onReset}
          sx={{ flex: 1 }}
        >
          Reset Game
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={onHighlightBest}
          sx={{ flex: 1 }}
        >
          Highlight Best Move
        </Button>
      </Box>

      <Button variant="contained" color="warning" onClick={onUndo} fullWidth>
        Undo Move
      </Button>
    </Box>
  );
};

export default GameControls;
