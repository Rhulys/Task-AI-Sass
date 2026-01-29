import * as tf from '@tensorflow/tfjs-node';

const trainingData = [
	{ complexity: 1, category: 0, time: 2 },
	{ complexity: 2, category: 0, time: 5 },
	{ complexity: 3, category: 0, time: 8 },
	{ complexity: 4, category: 0, time: 14 },
	{ complexity: 5, category: 0, time: 20 },
	
	{ complexity: 1, category: 1, time: 4 },
	{ complexity: 2, category: 1, time: 10 },
	{ complexity: 3, category: 1, time: 18 },
	{ complexity: 4, category: 1, time: 30 },
	{ complexity: 5, category: 1, time: 45 },

	{ complexity: 1, category: 2, time: 1 },
	{ complexity: 2, category: 2, time: 3 },
	{ complexity: 3, category: 2, time: 6 },
	{ complexity: 4, category: 2, time: 10 },
	{ complexity: 5, category: 2, time: 15 },
];

export const predictTaskDuration = async (
	complexity: number,
	category: string
) => {
	const catMap: { [key: string]: number } = {
		Frontend: 0,
		Backend: 1,
		Designer: 2,
	};
	const catNum = catMap[category] || 0;

	const model = tf.sequential();

	model.add(tf.layers.dense({ units: 1, inputShape: [2], activation: 'relu' }));

	model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

	const xs = tf.tensor2d(trainingData.map((d) => [d.complexity, d.category]));
	const ys = tf.tensor2d(trainingData.map((d) => [d.time]));

	await model.fit(xs, ys, { epochs: 100 });

	const prediction = model.predict(
		tf.tensor2d([[complexity, catNum]])
	) as tf.Tensor;
	const result = await prediction.data();

	return result[0];
};
