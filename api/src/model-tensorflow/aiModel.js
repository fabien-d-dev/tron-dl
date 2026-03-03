import * as tf from "@tensorflow/tfjs";

/*
┌───────────────────────────────────────┐
│ Creating a Neural Model               │
└───────────────────────────────────────┘
The model follows this structure:
- 8 inputs describing the game state
- 32 hidden neurons
- 4 outputs = the 4 possible directions
*/
export function createAiModel(level) {
  const model = tf.sequential();

  model.add(
    tf.layers.dense({
      units: 32,
      activation: "relu",
      inputShape: [8],
    })
  );

  model.add(tf.layers.dense({ units: 32, activation: "relu" }));
  model.add(tf.layers.dense({ units: 4 }));

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: "meanSquaredError",
  });

/*
┌───────────────────────────────────────────┐
│ AI Experiment Simulation                  │
└───────────────────────────────────────────┘
  The higher the level,
  the less random error we add to the weights.
  This is NOT training, only imitation!
*/
  const noise =
    level === "novice" ? 0.5 : level === "intermediate" ? 0.2 : 0.05;

  model.layers.forEach((layer) => {
    const newWeights = layer
      .getWeights()
      .map((w) => tf.add(w, tf.randomNormal(w.shape, 0, noise)));
    layer.setWeights(newWeights);
  });

  return model;
}

/*
┌───────────────────────────────────────────┐
│ AI Direction Prediction                   │
└───────────────────────────────────────────┘
  We transform the game state into a tensor,
  the model calculates 4 values,
  and we take the one with the highest score.
*/
export async function decideDirection(model, state) {
  const input = tf.tensor2d([
    [
      state.playerX,
      state.playerY,
      state.playerDX,
      state.playerDY,
      state.aiX,
      state.aiY,
      state.aiDX,
      state.aiDY,
    ],
  ]);

  // Prediction
  const output = model.predict(input);
  const data = await output.data();

  // Memory clearing
  input.dispose();
  output.dispose();

  // Find the highest value stock
  const maxIndex = data.indexOf(Math.max(...data));

  switch (maxIndex) {
    case 0:
      return { dx: -2, dy: 0 };
    case 1:
      return { dx: 2, dy: 0 };
    case 2:
      return { dx: 0, dy: -2 };
    case 3:
      return { dx: 0, dy: 2 };
    default:
      return { dx: 0, dy: 0 };
  }
}
