"use client";

import "../../styles/globals.css";

import { useEffect, useRef, useState } from "react";

interface connect {
  startDot: null | [number, number];
  endDot: null | [number, number];
}

export default function Dashboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ width: 7, height: 6 });
  const dotSize = 15; // Size of each dot
  const dotSpacing = 40; // Spacing between dots

  const [currentPlayer, setCurrentPlayer] = useState<"player1" | "player2">(
    "player1",
  );
  const [completedSquares, setCompletedSquares] = useState<Set<string>>(
    new Set(),
  );

  const [history, setHistory] = useState<connect[]>([]);

  const [scores, setScores] = useState<{ player1: number; player2: number }>({
    player1: 0,
    player2: 0,
  });

  const [connect, setConnect] = useState<connect>({
    startDot: null,
    endDot: null,
  });

  const getCursorPositionInPixels = (
    e: React.MouseEvent<HTMLCanvasElement>,
  ): [number, number] | null => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const x =
      e.clientX -
      rect.left -
      (window.scrollX || document.documentElement.scrollLeft);
    const y =
      e.clientY -
      rect.top -
      (window.scrollY || document.documentElement.scrollTop);
    return [x, y];
  };

  const getDotFromCoordinates = (
    position: [number, number],
  ): [number, number] => {
    const [x, y] = position;
    const col = Math.floor(x / dotSpacing);
    const row = Math.floor(y / dotSpacing);
    return [row, col];
  };

  const handleDotClick = (
    e: React.MouseEvent<HTMLCanvasElement>,
    option: "startDot" | "endDot",
  ) => {
    const cursorPosition = getCursorPositionInPixels(e);
    if (cursorPosition) {
      const [row, col] = getDotFromCoordinates(cursorPosition);
      if (option === "startDot") {
        setConnect({ startDot: [row, col], endDot: null });
      } else if (option === "endDot" && connect.startDot) {
        const [startRow, startCol] = connect.startDot;
        const isValidMove =
          Math.abs(row - startRow) <= 1 && Math.abs(col - startCol) <= 1;
        if (isValidMove) {
          setConnect((prevState) => ({
            ...prevState,
            endDot: [row, col],
          }));
        } else {
          console.log("Invalid move!");
        }
      }
    }
  };

  // Set canvas and dots
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Canvas context is not supported");
      return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw dots
    for (let rowIndex = 0; rowIndex < size.height; rowIndex++) {
      for (let colIndex = 0; colIndex < size.width; colIndex++) {
        const x = colIndex * dotSpacing + dotSpacing / 2;
        const y = rowIndex * dotSpacing + dotSpacing / 2;
        ctx.beginPath();
        ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = "#2e026d"; // Dot color
        ctx.fill();
      }
    }
  }, [size]);

  // Draw lines between dots
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (connect.startDot && connect.endDot) {
      let [x1, y1] = connect.startDot;
      let [x2, y2] = connect.endDot;

      if(x1 === x2 && y1 === y2){
        return;
      }

      // Swap the positions if necessary to ensure x1 and y1 are always smaller than x2 and y2
      if (x1 > x2 || (x1 === x2 && y1 > y2)) {
        [x1, x2] = [x2, x1];
        [y1, y2] = [y2, y1];
      }

      if (Math.abs(x1 - x2) > 0 && Math.abs(y1 - y2) > 0) {
        return; // Return without drawing the diagonal line
      }

      // Check if the line already exists in history
      const lineExists = history.some(
        (entry) =>
          entry.startDot &&
          entry.endDot &&
          ((entry.startDot[0] === x1 &&
            entry.startDot[1] === y1 &&
            entry.endDot[0] === x2 &&
            entry.endDot[1] === y2) ||
            (entry.startDot[0] === x2 &&
              entry.startDot[1] === y2 &&
              entry.endDot[0] === x1 &&
              entry.endDot[1] === y1)),
      );

      if (lineExists) {
        return; // Don't draw the line if it already exists
      }

      ctx.beginPath();
      ctx.moveTo(
        y1 * dotSpacing + dotSpacing / 2,
        x1 * dotSpacing + dotSpacing / 2,
      );
      ctx.lineTo(
        y2 * dotSpacing + dotSpacing / 2,
        x2 * dotSpacing + dotSpacing / 2,
      );
      ctx.strokeStyle = currentPlayer === "player1" ? "#22d3ee" : "#fb7185"; // Line color
      ctx.lineWidth = 2; // Line width
      ctx.stroke();

      // Update history with the dots in the correct order
      setHistory((prevHistory) => [
        ...prevHistory,
        { startDot: [x1, y1], endDot: [x2, y2] },
      ]);
    }
  }, [connect]);

  //check for squares
  useEffect(() => {
    const checkForSquares = () => {
      history.forEach(({ startDot, endDot }) => {
        if (startDot && endDot) {
          const [x1, y1] = startDot;
          const [x2, y2] = endDot;

          // Check for vertical and horizontal lines
          if (x1 === x2 || y1 === y2) {
            const [topLeft, topRight, bottomLeft, bottomRight] = [
              [x1, y1],
              x1 === x2 ? [x1, y1 + 1] : [x1 + 1, y1],
              x1 === x2 ? [x1 + 1, y1] : [x1, y1 + 1],
              [x1 + 1, y1 + 1],
            ];

            // Check if all sides of a square are present
            const squareSides = [
              [
                [topLeft, topRight],
                [bottomLeft, bottomRight],
              ],
              [
                [topLeft, bottomLeft],
                [topRight, bottomRight],
              ],
            ];
            const allSidesPresent = squareSides.every((sides) =>
              sides.every(([start, end]) =>
                history.some(
                  (line) =>
                    line.startDot &&
                    line.endDot &&
                    start &&
                    end &&
                    ((line.startDot[0] === start[0] &&
                      line.startDot[1] === start[1] &&
                      line.endDot[0] === end[0] &&
                      line.endDot[1] === end[1]) ||
                      (line.startDot[0] === end[0] &&
                        line.startDot[1] === end[1] &&
                        line.endDot[0] === start[0] &&
                        line.endDot[1] === start[1])),
                ),
              ),
            );

            if (allSidesPresent) {
              const squareKey = `${topLeft}-${topRight}-${bottomLeft}-${bottomRight}`;
              if (!completedSquares.has(squareKey)) {
                completedSquares.add(squareKey);
                setCompletedSquares(completedSquares);

                // Award a point to the player who completed the square
                setScores((prevScores) => ({
                  ...prevScores,
                  [currentPlayer]: scores[currentPlayer] + 1,
                }));

                // Fill the square with the color of the player who completed it
                const ctx = canvasRef.current?.getContext("2d");
                if (ctx) {
                  const fillColor =
                    currentPlayer === "player1"
                      ? "rgba(251, 113, 133, 0.3)"
                      : "rgba(34, 211, 238, 0.3)";
                  ctx.fillStyle = fillColor;
                  ctx.fillRect(
                    y1 * dotSpacing + dotSpacing / 2,
                    x1 * dotSpacing + dotSpacing / 2,
                    dotSpacing,
                    dotSpacing,
                  );
                }
              }
            }
          }
        }
      });
    };

    checkForSquares();

    setCurrentPlayer(() =>
      currentPlayer === "player1" ? "player2" : "player1",
    );
  }, [history]);

  return (
    <div className="flex h-full w-full flex-col justify-between gap-4 px-[1%] pb-[4%] pt-[1%] md:h-[65%]">
      <div className="flex flex-col gap-2 text-slate-200">
        <h2 className="text-2xl">Score</h2>
        <div className="flex flex-col">
          <p className="text-lg">Player1: {scores.player1}</p>
          <p className="text-lg">Player2: {scores.player2}</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <h2 className="text-xl text-slate-200">
          <span
            className={`${currentPlayer === "player1" ? "text-[#22d3ee]" : "text-[#fb7185]"} text-2xl`}
          >
            {currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}
          </span>
          's turn!
        </h2>
        <canvas
          ref={canvasRef}
          width={size.width * dotSpacing}
          height={size.height * dotSpacing}
          onMouseDown={(e: React.MouseEvent<HTMLCanvasElement>) =>
            handleDotClick(e, "startDot")
          }
          onMouseUp={(e: React.MouseEvent<HTMLCanvasElement>) =>
            handleDotClick(e, "endDot")
          }
        />
      </div>
    </div>
  );
}
