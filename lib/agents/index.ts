import { Proposal } from "@/lib/core/types";
import { evaluateCFO } from "./x_cfo";
import { evaluateCMO } from "./x_cmo";
import { evaluateCOO } from "./x_coo";
import { evaluateLegal } from "./x_legal";
import { evaluateCompliance } from "./x_compliance";
import { evaluateEthics } from "./x_ethics";
import { evaluatePM } from "./x_pm";
import { evaluatePMO } from "./x_pmo";
export async function evaluateByRole(role:string,p:Proposal,m:any){
 switch(role){
  case "financial officer": case "cfo": return evaluateCFO(p,m);
  case "marketing officer": case "cmo": return evaluateCMO(p,m);
  case "operations officer": case "coo": return evaluateCOO(p,m);
  case "counsel": case "legal": return evaluateLegal(p,m);
  case "compliance": return evaluateCompliance(p,m);
  case "ethics & trust": case "ethics": return evaluateEthics(p,m);
  case "project manager": case "pm": return evaluatePM(p,m);
  case "portfolio manager": case "pmo": return evaluatePMO(p,m);
  default: return `${m.name}: No specific guidance. Consider adding a custom agent.`; }
}
