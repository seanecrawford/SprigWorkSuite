import { MemberConfig, Opinion, OrchestratorResult, Proposal, Vote } from "./types";
import { evaluateByRole } from "@/lib/agents";

function voteFromWeights(w:{risk:number;growth:number;profit:number;compliance:number}):Vote{
 const score=w.growth*0.4+w.profit*0.3+w.compliance*0.2-w.risk*0.3; if(score>0.35)return "yes"; if(score<0.15)return "no"; return "warn"; }

function buildTDL(p:Proposal){
 return [
  "Market research & TAM validation",
  "Budget & CAC/LTV model review (CFO)",
  "Compliance checklists (GDPR/EU AI Act)",
  "Creative brief & ad experiments (CMO)",
  "Supplier/SLAs & dry run (COO/PM)",
  "Draft SOW & DPA (Legal)"
 ];
}

function buildSOW(p:Proposal){
 return `# Statement of Work\n\n## Scope\n${p.description}\n\n## Deliverables\n- Localized storefront\n- GDPR-compliant checkout\n- Sustainable packaging launch\n- Multi-channel marketing tests\n\n## Timeline\n- Phase 1: Research & compliance (4 weeks)\n- Phase 2: Build & dry run (8 weeks)\n- Phase 3: Pilot launch (4 weeks)\n\n## Budget\n- Capex: TBD\n- Opex: TBD\n\n## SLAs\n- Uptime 99.9%\n- Fulfillment < 48h\n\n## Acceptance Criteria\n- CAC payback < 6 months\n- Support tickets < 3% of orders\n`;
}

export async function runOrchestrator(proposal:Proposal, members:MemberConfig[]):Promise<OrchestratorResult>{
 const opinions:Opinion[]=[]; const votes:Record<string,Vote>={};
 for(const m of members){ const narrative=await evaluateByRole(m.role.toLowerCase(),proposal,m); opinions.push({memberId:m.id,memberName:m.name,role:m.role,narrative}); votes[m.id]=voteFromWeights(m.weights); }
 let tally=0, weightSum=0; for(const m of members){ const w=m.voteWeight??1; weightSum+=w; const v=votes[m.id]; if(v==="yes")tally+=1*w; if(v==="warn")tally+=0.5*w; }
 const supportIndex=tally/(weightSum||1);
 let consensus="Hold: more data needed."; if(supportIndex>=0.75)consensus="Adopt: proceed with proposal with minor safeguards."; else if(supportIndex>=0.5)consensus="Adopt with conditions: proceed in phases and add compliance gates."; else if(supportIndex<=0.25)consensus="Reject: insufficient support; redesign proposal.";
 const memo=buildMemo(proposal,opinions,votes,supportIndex,consensus);
 const tdl=buildTDL(proposal); const sow=buildSOW(proposal);
 return {opinions,votes,consensus,supportIndex,memo,tdl,sow};
}

function buildMemo(p:Proposal, ops:Opinion[], votes:Record<string,Vote>, idx:number, cons:string){
 const lines:string[]=[]; lines.push("# Decision Memo"); lines.push(`**Proposal:** ${p.title}`); lines.push(""); lines.push(p.description); lines.push(""); lines.push("---"); lines.push("## Board Opinions");
 for(const o of ops){ lines.push(`- **${o.memberName} (${o.role})**: ${o.narrative}`);} lines.push(""); lines.push("## Vote Summary");
 for(const [id,v] of Object.entries(votes)){ const who=ops.find(o=>o.memberId===id)?.memberName||id; lines.push(`- ${who}: ${v.toUpperCase()}`);} lines.push(""); lines.push(`**Support Index:** ${idx.toFixed(2)}`); lines.push(`**Consensus:** ${cons}`);
 return lines.join("\n"); }
