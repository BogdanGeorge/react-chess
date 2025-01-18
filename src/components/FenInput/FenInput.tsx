import React from "react";
import { TextField, Button, Box } from "@mui/material";

interface FenInputProps {
  fenInput: string;
  onFenChange: (fen: string) => void;
  onLoadFen: () => void;
}

const FenInput: React.FC<FenInputProps> = ({
  fenInput,
  onFenChange,
  onLoadFen,
}) => {
  return (
    <Box sx={{ marginTop: "20px", width: "100%" }}>
      <TextField
        label="FEN"
        value={fenInput}
        onChange={(e) => onFenChange(e.target.value)}
        fullWidth
        variant="outlined"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={onLoadFen}
        sx={{ marginTop: "10px", width: "100%" }}
      >
        Load New FEN
      </Button>
    </Box>
  );
};

export default FenInput;
