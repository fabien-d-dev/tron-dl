import { Router } from "express";
import { createAiModel, decideDirection } from "../model-tensorflow/aiModel.js";

const router = Router();

// import { loadOrCreateModel } from "../model-tensorflow/aiModel.js";

const models = {
  novice: createAiModel("novice"),
  intermediate: createAiModel("intermediate"),
  expert: createAiModel("expert"),
};

router.post("/decision", async (req, res) => {
  const { level, state } = req.body;
  const result = await decideDirection(models[level], state);

  return res.json(result);
});

// Receive the dataset and train the model
router.post("/train", async (req, res) => {
  try {
    const { level, dataset } = req.body;

    if (!dataset || dataset.length === 0) {
      return res.status(400).json({ message: "empty dataset" });
    }

    // Load or create the model
    const model = await loadOrCreateModel(level);

    // Prepare X and Y
    const X = dataset.map(d => [
      d.state.playerX,
      d.state.playerY,
      d.state.playerDX,
      d.state.playerDY,
      d.state.aiX,
      d.state.aiY,
      d.state.aiDX,
      d.state.aiDY,
    ]);

    const Y = dataset.map(d => [
      d.direction.dx === -2 ? 1 : 0,
      d.direction.dx === 2 ? 1 : 0,
      d.direction.dy === -2 ? 1 : 0,
      d.direction.dy === 2 ? 1 : 0,
    ]);

    // Convert to tensors
    const tf = await import("@tensorflow/tfjs-node");
    const xs = tf.tensor2d(X);
    const ys = tf.tensor2d(Y);

    // Training
    await model.fit(xs, ys, { epochs: 5 });

    // Backup
    await model.save(`file://./models/ai-${level}`);

    xs.dispose();
    ys.dispose();

    res.json({ message: "Trained and saved model!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error during training" });
  }
});

export default router;
