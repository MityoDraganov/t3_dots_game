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

  const [history, setHistory] = useState<connect[]>([]);

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

  // Draw lines between dots
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (connect.startDot && connect.endDot) {
      let [x1, y1] = connect.startDot;
      let [x2, y2] = connect.endDot;

      // Swap the positions if necessary to ensure x1 and y1 are always smaller than x2 and y2
      if (x1 > x2 || (x1 === x2 && y1 > y2)) {
        [x1, x2] = [x2, x1];
        [y1, y2] = [y2, y1];
      }

      if (Math.abs(x1 - x2) > 0 && Math.abs(y1 - y2) > 0) {
        return; // Return without drawing the diagonal line
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

      setCurrentPlayer(() =>
        currentPlayer === "player1" ? "player2" : "player1",
      );

      // Update history with the dots in the correct order
      setHistory((prevHistory) => [
        ...prevHistory,
        { startDot: [x1, y1], endDot: [x2, y2] },
      ]);
    }
  }, [connect]);

  useEffect(() => {
    // Define a function to check if four dots are connected
    const checkForFourConnected = () => {
      // Iterate over each item in the history array
      for (let i = 0; i < history.length; i++) {
        const dot1 = history[i]?.startDot;
        const dot2 = history[i]?.endDot;
        
        // Check if the dots are not null
        if (dot1 && dot2) {
          // Iterate over the rest of the history array
          for (let j = i + 1; j < history.length; j++) {
            const dot3 = history[j]?.startDot;
            const dot4 = history[j]?.endDot;
            
            // Check if the dots are not null
            if (dot3 && dot4) {
              // Check if all four sides are connected
              if (
                (dot1[0] === dot3[0] && dot2[0] === dot4[0] && dot1[1] === dot2[1] && dot3[1] === dot4[1]) || // Horizontal sides
                (dot1[1] === dot3[1] && dot2[1] === dot4[1] && dot1[0] === dot2[0] && dot3[0] === dot4[0]) || // Vertical sides
                (Math.abs(dot1[0] - dot3[0]) === 1 && Math.abs(dot1[1] - dot3[1]) === 1 && 
                 Math.abs(dot1[0] - dot4[0]) === 1 && Math.abs(dot1[1] - dot4[1]) === 1) // Adjacent sides
              ) {
                console.log("Square completed!");
                // Add your logic to award points and fill the square
              }
            }
          }
        }
      }
    };
    
    // Call the function to check for four connected dots
    checkForFourConnected();
  }, [history]);
  
  

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
