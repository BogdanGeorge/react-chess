import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  ButtonGroup,
  Button,
} from "@mui/material";
import { PLAY_MODES, GameMode } from "../../constants/gameConstants";

interface GameModeDialogProps {
  open: boolean;
  onModeSelect: (mode: GameMode) => void;
}

const GameModeDialog: React.FC<GameModeDialogProps> = ({
  open,
  onModeSelect,
}) => {
  return (
    <Dialog open={open} disableEscapeKeyDown>
      <DialogTitle>Choose Game Mode</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minWidth: 300,
          p: 3,
        }}
      >
        <ButtonGroup orientation="vertical" variant="contained" fullWidth>
          <Button onClick={() => onModeSelect(PLAY_MODES.WHITE_VS_COMPUTER)}>
            Play as White vs Computer
          </Button>
          <Button onClick={() => onModeSelect(PLAY_MODES.BLACK_VS_COMPUTER)}>
            Play as Black vs Computer
          </Button>
          <Button onClick={() => onModeSelect(PLAY_MODES.HUMAN_VS_HUMAN)}>
            Play vs Human
          </Button>
        </ButtonGroup>
      </DialogContent>
    </Dialog>
  );
};

export default GameModeDialog;
