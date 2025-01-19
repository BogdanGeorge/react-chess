import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import MoveHistory from "../MoveHistory";

describe("MoveHistory", () => {
  const mockMoves = ["e2-e4", "e7-e5", "Nf3"];

  it("renders the move history title", () => {
    render(<MoveHistory moves={mockMoves} />);
    expect(screen.getByText("Move History:")).toBeInTheDocument();
  });

  it("renders all moves in the list", () => {
    render(<MoveHistory moves={mockMoves} />);

    mockMoves.forEach((move) => {
      expect(screen.getByText(move)).toBeInTheDocument();
    });
  });

  it("renders empty list when no moves are provided", () => {
    render(<MoveHistory moves={[]} />);
    expect(screen.getByRole("list")).toBeEmptyDOMElement();
  });
});
