import { OrchestratorResult } from "./types"; import { promises as fs } from "fs"; import path from "path";
const DATA=path.join(process.cwd(),"data"); const FILE=path.join(DATA,"decisions.json");
async function ensure(){ try{ await fs.mkdir(DATA,{recursive:true}); await fs.access(FILE); }catch{ await fs.writeFile(FILE,"[]","utf-8"); } }
export async function saveDecision(r:OrchestratorResult){ await ensure(); const raw=await fs.readFile(FILE,"utf-8"); const arr=JSON.parse(raw||"[]"); arr.unshift({ ts: Date.now(), ...r }); await fs.writeFile(FILE, JSON.stringify(arr,null,2)); }
export async function listDecisions(){ await ensure(); const raw=await fs.readFile(FILE,"utf-8"); return JSON.parse(raw||"[]"); }
