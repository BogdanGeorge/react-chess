import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import Confetti from "react-confetti";

interface GameEndDialogProps {
  open: boolean;
  isWinner: boolean;
  onRematch: () => void;
  onClose: () => void;
}

const GameEndDialog: React.FC<GameEndDialogProps> = ({
  open,
  isWinner,
  onRematch,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      {isWinner && (
        <Confetti width={50} height={50} recycle={false} numberOfPieces={10} />
      )}
      <DialogTitle>
        {isWinner ? "Congratulations! 🎉" : "Game Over 😢"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Typography variant="h6">
            {isWinner
              ? "You won! Well played!"
              : "Unfortunately you lost. Try again!"}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: "center", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={onRematch}
          sx={{ minWidth: 100 }}
        >
          Rematch
        </Button>
        <Button variant="outlined" onClick={onClose} sx={{ minWidth: 100 }}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GameEndDialog;
