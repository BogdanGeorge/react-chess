import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import GameControls from "../GameControls";

describe("GameControls", () => {
  const mockOnReset = jest.fn();
  const mockOnHighlightBest = jest.fn();
  const mockOnUndo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all buttons", () => {
    render(
      <GameControls
        onReset={mockOnReset}
        onHighlightBest={mockOnHighlightBest}
        onUndo={mockOnUndo}
      />
    );

    expect(
      screen.getByRole("button", { name: "Reset Game" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Highlight Best Move" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Undo Move" })
    ).toBeInTheDocument();
  });

  it("calls appropriate handlers when buttons are clicked", () => {
    render(
      <GameControls
        onReset={mockOnReset}
        onHighlightBest={mockOnHighlightBest}
        onUndo={mockOnUndo}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Reset Game" }));
    expect(mockOnReset).toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole("button", { name: "Highlight Best Move" })
    );
    expect(mockOnHighlightBest).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Undo Move" }));
    expect(mockOnUndo).toHaveBeenCalled();
  });
});
