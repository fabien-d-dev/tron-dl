import { useEffect, useRef, useState } from "react";
import "./App.css";
import TypeIt from "typeit-react";
// import * as tf from "@tensorflow/tfjs";
// import * as tfvis from "@tensorflow/tfjs-vis";
import axios from "axios";

// const aiDatasetRef = useRef<{ state: any; direction: any }[]>([]);

export async function getAiDirection(
  level: "novice" | "intermediate" | "expert",
  gameState: any
) {
  const res = await axios.post("http://localhost:3000/api/ai/decision", {
    level,
    state: gameState,
  });

  return res.data;
}

// const sendAiDataset = async () => {
//   if (aiDatasetRef.current.length === 0) return;
//   try {
//     await axios.post("http://localhost:3000/api/ai/train", {
//       level: "expert",
//       dataset: aiDatasetRef.current,
//     });
//     aiDatasetRef.current = []; // reset après envoi
//     console.log("AI dataset sent for training!");
//   } catch (err) {
//     console.error("Error sending AI dataset :", err);
//   }
// };


function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gameState, setGameState] = useState<"menu" | "playing" | "gameover">(
    "menu"
  );
  const [gameMessage, setGameMessage] = useState("");
  
  // const recordAiDecision = (state: any, direction: any) => {
  //   // Saves each decision along with the game state and the chosen action
  //   aiDatasetRef.current.push({ state, direction });
  // };

  useEffect(() => {
    if (gameState !== "playing") return;

    playerDir.dx = 2;
    playerDir.dy = 0;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    // const aiModel = createAiModel("novice");

    ctx.clearRect(0, 0, 500, 500);

    // --------------------
    // Player
    // --------------------
    let player = { x: 100, y: 250, dx: 2, dy: 0, color: "cyan" };
    let ai = { x: 400, y: 250, dx: -2, dy: 0, color: "red" };

    const playerTrail: { x: number; y: number }[] = [];
    const aiTrail: { x: number; y: number }[] = [];

    const drawPoint = (p: any) => {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 2, 2);
    };

    const checkCollision = (
      x: number,
      y: number,
      trail: { x: number; y: number }[]
    ) => trail.some((pt) => pt.x === x && pt.y === y);

    const outOfBounds = (p: any) =>
      p.x < 0 || p.x >= 500 || p.y < 0 || p.y >= 500;

    const endGame = (msg: string) => {
      setGameMessage(msg);
      setGameState("gameover");

      // sendAiDataset();
    };

    let lastAiDecision = 0;

    // -------------------
    // Main loop
    // -------------------
    const update = async () => {
      if (gameState !== "playing") return;

      player.dx = playerDir.dx;
      player.dy = playerDir.dy;

      player.x += player.dx;
      player.y += player.dy;

      // -------------------
      // AI
      // -------------------
      // ai.x += ai.dx;
      // ai.y += ai.dy;

      // const danger = (nx: number, ny: number) => {

      //   if (nx < 0 || nx >= 500 || ny < 0 || ny >= 500) return true;

      //   if (aiTrail.some((t) => t.x === nx && t.y === ny)) return true;

      //   if (playerTrail.some((t) => t.x === nx && t.y === ny)) return true;

      //   return false;
      // };

      // const dirs = [
      //   { dx: -2, dy: 0 },
      //   { dx: 2, dy: 0 },
      //   { dx: 0, dy: -2 },
      //   { dx: 0, dy: 2 },
      // ];

      // const nextX = ai.x + ai.dx;
      // const nextY = ai.y + ai.dy;

      // let mustTurn = danger(nextX, nextY);

      // if (mustTurn || Math.random() < 0.02) {

      //   const safeDirs = dirs.filter((d) => {
      //     const nx = ai.x + d.dx;
      //     const ny = ai.y + d.dy;

      //     if (d.dx === -ai.dx && d.dy === -ai.dy) return false;

      //     return !danger(nx, ny);
      //   });

      //   if (safeDirs.length > 0) {
      //     const pick = safeDirs[Math.floor(Math.random() * safeDirs.length)];
      //     ai.dx = pick.dx;
      //     ai.dy = pick.dy;
      //   } else {

      //     const desperate = dirs.filter(
      //       (d) => !(d.dx === -ai.dx && d.dy === -ai.dy)
      //     );
      //     const pick = desperate[Math.floor(Math.random() * desperate.length)];
      //     ai.dx = pick.dx;
      //     ai.dy = pick.dy;
      //   }
      // }

      // AI : State
      const state = {
        playerX: player.x,
        playerY: player.y,
        playerDX: player.dx,
        playerDY: player.dy,
        aiX: ai.x,
        aiY: ai.y,
        aiDX: ai.dx,
        aiDY: ai.dy,
      };

      // TODO: backend AI
      // const iaMove = await getAiDirection("expert", {
      //   playerX,
      //   playerY,
      //   playerDX,
      //   playerDY,
      //   aiX,
      //   aiY,
      //   aiDX,
      //   aiDY,
      // });

      // AI decides
      // const next = await decideDirection(aiModel, state);
      
      const now = performance.now();

     if (now - lastAiDecision > 100) {
       const next = await getAiDirection("expert", state);

       // Interdire le demi-tour
       if (!(next.dx === -ai.dx && next.dy === -ai.dy)) {
         ai.dx = next.dx;
         ai.dy = next.dy;
       }

      // --------------------
      // Recording of the AI ​​decision
      // --------------------
      //  recordAiDecision(state, { dx: ai.dx, dy: ai.dy });

       lastAiDecision = now;
     }

      // ai.dx = next.dx;
      // ai.dy = next.dy;

      ai.x += ai.dx;
      ai.y += ai.dy;

      playerTrail.push({ x: player.x, y: player.y });
      aiTrail.push({ x: ai.x, y: ai.y });

      drawPoint(player);
      drawPoint(ai);

      // Collisions
      if (outOfBounds(player)) return endGame("Le joueur sort du terrain !");
      if (outOfBounds(ai)) return endGame("L'IA sort du terrain !");

      if (checkCollision(player.x, player.y, playerTrail.slice(0, -3)))
        return endGame("Le joueur touche sa propre ligne !");
      if (checkCollision(ai.x, ai.y, aiTrail.slice(0, -3)))
        return endGame("L'IA touche sa propre ligne !");

      if (checkCollision(player.x, player.y, aiTrail))
        return endGame("Le joueur touche la ligne de l'IA !");
      if (checkCollision(ai.x, ai.y, playerTrail))
        return endGame("L'IA touche la ligne du joueur !");

      if (player.x === ai.x && player.y === ai.y)
        return endGame("Collision frontale !");

      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }, [gameState]);

  // --------------------
  // Controls
  // --------------------
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Menu → Start
      if (gameState === "menu") {
        if (e.code === "Space") {
          // Reset the direction
          playerDir.dx = 2;
          playerDir.dy = 0;
          setGameState("playing");
        }
        return;
      }

      // Player controls
      if (gameState === "playing") {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        ctx;

        if (e.key === "ArrowUp") {
          if (playerDir.dy === 0) {
            playerDir.dx = 0;
            playerDir.dy = -2;
          }
        }

        if (e.key === "ArrowDown") {
          if (playerDir.dy === 0) {
            playerDir.dx = 0;
            playerDir.dy = 2;
          }
        }

        if (e.key === "ArrowLeft") {
          if (playerDir.dx === 0) {
            playerDir.dx = -2;
            playerDir.dy = 0;
          }
        }

        if (e.key === "ArrowRight") {
          if (playerDir.dx === 0) {
            playerDir.dx = 2;
            playerDir.dy = 0;
          }
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameState]);

  const playerDir = useRef({ dx: 2, dy: 0 }).current;

  return (
    <>
      <header className="flex">
        <div className="mt-2">
          <TypeIt
            className="text-4xl text-white tracking-wide"
            getBeforeInit={(instance) => {
              instance
                .type("Tron DL")
                .pause(750)
                .delete(2)
                .pause(500)
                .type("Deep Learning");
              return instance;
            }}
          />
        </div>
      </header>

      <div className="flex justify-center relative">
        <div className="mr-10 flex justify-center relative">
          <canvas
            ref={canvasRef}
            id="tron-canvas"
            width={500}
            height={500}
            className="border border-slate-700 rounded-lg bg-black"
          />

          {/* -------- Menu -------- */}
          {gameState === "menu" && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <p className="text-white text-2xl">Press SPACE to start</p>
            </div>
          )}

          {/* -------- Game Over -------- */}
          {gameState === "gameover" && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4">
              <p className="text-red-400 text-xl">{gameMessage}</p>
              <button
                className="px-4 py-2 bg-white text-black rounded"
                onClick={() => setGameState("menu")}
              >
                Restart
              </button>
            </div>
          )}
        </div>

        {/* AI Panel */}
        <div
          id="ai-panel"
          className="w-80 h-[500px] border border-slate-700 rounded-lg bg-slate-900 p-2 overflow-auto"
        />
      </div>
    </>
  );
}

export default App;
