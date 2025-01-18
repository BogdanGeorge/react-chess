interface ChessMove {
  from: string;
  to: string;
  text?: string;
}

export const fetchBestMove = async (fen: string): Promise<ChessMove> => {
  const response = await fetch("https://chess-api.com/v1", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fen }),
  });
  return response.json();
};
