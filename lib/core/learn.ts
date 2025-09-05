import { loadTraining } from "./training_store";

export async function learnWeights(role: string) {
  const items = await loadTraining(role);
  if (!items || items.length < 5) return null; // need a few samples

  // initialize similar to vote logic
  let w = { risk: -0.3, growth: 0.4, profit: 0.3, compliance: 0.2 };
  const lr = 0.05;

  for (const it of items) {
    const f = it.features as {risk:number;growth:number;profit:number;compliance:number};
    const score = w.growth*f.growth + w.profit*f.profit + w.compliance*f.compliance + w.risk*f.risk;
    const yhat = score > 0.3 ? 1 : 0;
    const err = (it.outcome as 0|1) - yhat;
    w.growth += lr * err * f.growth;
    w.profit += lr * err * f.profit;
    w.compliance += lr * err * f.compliance;
    w.risk    += lr * err * f.risk;
  }
  return w;
}
