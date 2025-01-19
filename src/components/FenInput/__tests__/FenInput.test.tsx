import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import FenInput from "../FenInput";

describe("FenInput", () => {
  const mockOnFenChange = jest.fn();
  const mockOnLoadFen = jest.fn();
  const testFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders input and button", () => {
    render(
      <FenInput
        fenInput={testFen}
        onFenChange={mockOnFenChange}
        onLoadFen={mockOnLoadFen}
      />
    );

    expect(screen.getByLabelText("FEN")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Load New FEN" })
    ).toBeInTheDocument();
  });

  it("calls onFenChange when input changes", () => {
    render(
      <FenInput
        fenInput={testFen}
        onFenChange={mockOnFenChange}
        onLoadFen={mockOnLoadFen}
      />
    );

    const input = screen.getByLabelText("FEN");
    fireEvent.change(input, { target: { value: "new fen" } });

    expect(mockOnFenChange).toHaveBeenCalledWith("new fen");
  });

  it("calls onLoadFen when button is clicked", () => {
    render(
      <FenInput
        fenInput={testFen}
        onFenChange={mockOnFenChange}
        onLoadFen={mockOnLoadFen}
      />
    );

    const button = screen.getByRole("button", { name: "Load New FEN" });
    fireEvent.click(button);

    expect(mockOnLoadFen).toHaveBeenCalled();
  });
});
