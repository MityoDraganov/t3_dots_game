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

  const [history, setHistory] = useState<connect[]>([])

  const [scores, setScores] = useState<{ player1: number; player2: number }>({
    player1: 0,
    player2: 0,
  });

  const [connect, setConnect] = useState<connect>({
    startDot: null,
    endDot: null,
  });

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

  // Get cursor position in pixels
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

  // Get corresponding row and column based on dot spacing
  const getDotFromCoordinates = (
    position: [number, number],
  ): [number, number] => {
    const [x, y] = position;
    const col = Math.floor(x / dotSpacing);
    const row = Math.floor(y / dotSpacing);
    return [row, col];
  };

  // Handle dot click
  const handleDotClick = (
    e: React.MouseEvent<HTMLCanvasElement>,
    option: "startDot" | "endDot",
  ) => {
    const cursorPosition = getCursorPositionInPixels(e);
    if (cursorPosition) {
      const [row, col] = getDotFromCoordinates(cursorPosition);
      if (option === "startDot") {
        setConnect({ startDot: null, endDot: null });
      }
      setConnect((prevState) => ({
        ...prevState,
        [option]: [row, col],
      }));
    }
  };

  const checkForSquare = (dot: [number, number], canvas: any) => {
    const [row, col] = dot;
    // Check if a square is completed
    if (
      row > 0 &&
      row < size.height &&
      col > 0 &&
      col < size.width &&
      connect.endDot
    ) {
      const [x1, y1] = connect.endDot;
  
      // Check if all four sides are connected
      const side1Connected = connect.startDot && (x1 === row) && (y1 === col - 1 || y1 === col);
      const side2Connected = connect.startDot && (y1 === col) && (x1 === row - 1 || x1 === row);
      const side3Connected = connect.startDot && (x1 === row - 1) && (y1 === col - 1 || y1 === col);
      const side4Connected = connect.startDot && (y1 === col - 1) && (x1 === row - 1 || x1 === row);
  
      if (side1Connected && side2Connected && side3Connected && side4Connected) {
        // Award a point to the current player
        setScores((prevScores) => ({
          ...prevScores,
          [currentPlayer]: prevScores[currentPlayer] + 1,
        }));
        // Fill the square with the current player's color
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.fillStyle = currentPlayer === "player1" ? "#22d3ee" : "#fb7185"; // Player color
        ctx.fillRect(
          Math.min(y1, col - 1) * dotSpacing + dotSpacing / 2,
          Math.min(x1, row - 1) * dotSpacing + dotSpacing / 2,
          dotSpacing,
          dotSpacing,
        );
      }
    }
  };
  
  

 
  // Draw lines between dots
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (connect.startDot && connect.endDot) {
      const [x1, y1] = connect.startDot;
      const [x2, y2] = connect.endDot;
  
      if (Math.abs(x1 - x2) > 0 && Math.abs(y1 - y2) > 0) {
        return; // Return without drawing the diagonal line
      }
  
      ctx.beginPath();
      ctx.moveTo(y1 * dotSpacing + dotSpacing / 2, x1 * dotSpacing + dotSpacing / 2);
      ctx.lineTo(y2 * dotSpacing + dotSpacing / 2, x2 * dotSpacing + dotSpacing / 2);
      ctx.strokeStyle = currentPlayer === "player1" ? "#22d3ee" : "#fb7185"; // Line color
      ctx.lineWidth = 2; // Line width
      ctx.stroke();
  
      setCurrentPlayer(() => (currentPlayer === "player1" ? "player2" : "player1"));
      checkForSquare(connect.endDot, canvas); // Call checkForSquare with the endDot coordinates
    }
  }, [connect]);
  

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-[10%]">
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
  );
}
