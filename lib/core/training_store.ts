import { promises as fs } from "fs";
import path from "path";

const DATA = path.join(process.cwd(), "data");
const TRAIN = path.join(DATA, "training.json");

async function ensure() {
  await fs.mkdir(DATA, { recursive: true });
  try { await fs.access(TRAIN); } catch { await fs.writeFile(TRAIN, "[]", "utf-8"); }
}

export async function saveTrainingExample(example: {
  features: { risk:number; growth:number; profit:number; compliance:number };
  outcome: 0|1; // 1=good decision, 0=bad
  role: string;
}) {
  await ensure();
  const raw = await fs.readFile(TRAIN, "utf-8");
  const arr = JSON.parse(raw || "[]");
  arr.push({ ts: Date.now(), ...example });
  await fs.writeFile(TRAIN, JSON.stringify(arr, null, 2), "utf-8");
}

export async function loadTraining(role?: string) {
  await ensure();
  const raw = await fs.readFile(TRAIN, "utf-8");
  const arr = JSON.parse(raw || "[]");
  return role ? arr.filter((x:any)=>x.role===role) : arr;
}
