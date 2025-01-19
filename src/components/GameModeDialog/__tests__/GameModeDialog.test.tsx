import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import GameModeDialog from "../GameModeDialog";
import { PLAY_MODES } from "../../../constants/gameConstants";

describe("GameModeDialog", () => {
  const mockOnModeSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dialog when open is true", () => {
    render(<GameModeDialog open={true} onModeSelect={mockOnModeSelect} />);

    expect(screen.getByText("Choose Game Mode")).toBeInTheDocument();
    expect(screen.getByText("Play as White vs Computer")).toBeInTheDocument();
    expect(screen.getByText("Play as Black vs Computer")).toBeInTheDocument();
    expect(screen.getByText("Play vs Human")).toBeInTheDocument();
  });

  it("calls onModeSelect with correct mode when buttons are clicked", () => {
    render(<GameModeDialog open={true} onModeSelect={mockOnModeSelect} />);

    fireEvent.click(screen.getByText("Play as White vs Computer"));
    expect(mockOnModeSelect).toHaveBeenCalledWith(PLAY_MODES.WHITE_VS_COMPUTER);

    fireEvent.click(screen.getByText("Play as Black vs Computer"));
    expect(mockOnModeSelect).toHaveBeenCalledWith(PLAY_MODES.BLACK_VS_COMPUTER);

    fireEvent.click(screen.getByText("Play vs Human"));
    expect(mockOnModeSelect).toHaveBeenCalledWith(PLAY_MODES.HUMAN_VS_HUMAN);
  });

  it("is not visible when open is false", () => {
    render(<GameModeDialog open={false} onModeSelect={mockOnModeSelect} />);
    expect(screen.queryByText("Choose Game Mode")).not.toBeInTheDocument();
  });
});
