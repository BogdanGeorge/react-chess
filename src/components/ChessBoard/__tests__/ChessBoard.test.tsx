import React from "react";
import { render, screen } from "@testing-library/react";
import ChessBoard from "../ChessBoard";
import { Chess } from "chess.js";

describe("ChessBoard", () => {
  const mockOnMove = jest.fn();
  const game = new Chess();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the chessboard", () => {
    render(<ChessBoard game={game} onMove={mockOnMove} />);
    // Verify the chessboard is rendered (specific assertions depend on react-chessboard's implementation)
    expect(screen.getByTestId("chessboard")).toBeInTheDocument();
  });

  // Note: Testing drag and drop functionality would require more complex setup
  // and integration with react-chessboard's testing utilities
});
