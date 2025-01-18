import React from "react";
import { Typography, List, ListItem, Box } from "@mui/material";

interface MoveHistoryProps {
  moves: string[];
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ moves }) => {
  return (
    <>
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
          {moves.map((move, index) => (
            <ListItem key={index} sx={{ marginBottom: "5px" }}>
              {move}
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );
};

export default MoveHistory;
