import { promises as fs } from "fs";
import path from "path";

const DATA = path.join(process.cwd(), "data");
const FILE = path.join(DATA, "agent_profiles.json");

export type AgentProfile = {
  id: string;
  role: string;
  weights: { risk: number; growth: number; profit: number; compliance: number };
  voteWeight: number;
  style: string;
};

async function ensure() {
  await fs.mkdir(DATA, { recursive: true });
  try { await fs.access(FILE); } catch { await fs.writeFile(FILE, "{}", "utf-8"); }
}

export async function loadProfile(id: string): Promise<AgentProfile | null> {
  await ensure();
  const raw = await fs.readFile(FILE, "utf-8");
  const all = JSON.parse(raw || "{}");
  return all[id] || null;
}

export async function saveProfile(p: AgentProfile) {
  await ensure();
  const raw = await fs.readFile(FILE, "utf-8");
  const all = JSON.parse(raw || "{}");
  all[p.id] = p;
  await fs.writeFile(FILE, JSON.stringify(all, null, 2), "utf-8");
}

export async function mergeProfiles<T extends AgentProfile>(members: T[]): Promise<T[]> {
  await ensure();
  const raw = await fs.readFile(FILE, "utf-8");
  const all = JSON.parse(raw || "{}");
  return members.map((m) => all[m.id] ? { ...m, ...all[m.id] } : m);
}
