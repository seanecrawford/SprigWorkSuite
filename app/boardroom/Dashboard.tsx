
"use client";
import React from "react";

type Vote="yes"|"no"|"warn";
type Member={id:string;name:string;role:string;weights:{risk:number;growth:number;profit:number;compliance:number};voteWeight:number;style:string;macro?:string;};

const templates: Record<string, Member[]> = {
  ecommerce: [
    {id:"cfo",name:"CFO AI",role:"Financial Officer",weights:{risk:0.25,growth:0.4,profit:0.9,compliance:0.7},voteWeight:1.2,style:"conservative",macro:"Finance/Ops"},
    {id:"cmo",name:"CMO AI",role:"Marketing Officer",weights:{risk:0.5,growth:0.95,profit:0.5,compliance:0.4},voteWeight:1.0,style:"aggressive",macro:"Market/Growth"},
    {id:"coo",name:"COO AI",role:"Operations Officer",weights:{risk:0.4,growth:0.6,profit:0.7,compliance:0.8},voteWeight:1.0,style:"balanced",macro:"Finance/Ops"},
    {id:"legal",name:"Legal AI",role:"Counsel",weights:{risk:0.3,growth:0.2,profit:0.5,compliance:0.95},voteWeight:1.1,style:"guardian",macro:"Governance"},
    {id:"compliance",name:"Compliance AI",role:"Compliance",weights:{risk:0.3,growth:0.3,profit:0.6,compliance:1.0},voteWeight:1.1,style:"guardian",macro:"Governance"},
    {id:"ethics",name:"Ethics AI",role:"Ethics & Trust",weights:{risk:0.3,growth:0.3,profit:0.5,compliance:0.9},voteWeight:1.0,style:"values",macro:"Governance"},
    {id:"pm",name:"PM AI",role:"Project Manager",weights:{risk:0.5,growth:0.5,profit:0.6,compliance:0.7},voteWeight:1.0,style:"pragmatic",macro:"Finance/Ops"},
  ],
  saas: [
    {id:"cfo",name:"CFO AI",role:"Financial Officer",weights:{risk:0.2,growth:0.5,profit:0.9,compliance:0.7},voteWeight:1.2,style:"conservative",macro:"Finance/Ops"},
    {id:"cmo",name:"CMO AI",role:"Marketing Officer",weights:{risk:0.5,growth:1.0,profit:0.6,compliance:0.4},voteWeight:1.0,style:"growth",macro:"Market/Growth"},
    {id:"pmo",name:"PMO AI",role:"Portfolio Manager",weights:{risk:0.4,growth:0.6,profit:0.7,compliance:0.8},voteWeight:1.0,style:"allocator",macro:"Finance/Ops"},
    {id:"legal",name:"Legal AI",role:"Counsel",weights:{risk:0.3,growth:0.2,profit:0.5,compliance:0.95},voteWeight:1.1,style:"guardian",macro:"Governance"},
    {id:"compliance",name:"Compliance AI",role:"Compliance",weights:{risk:0.3,growth:0.3,profit:0.6,compliance:1.0},voteWeight:1.1,style:"guardian",macro:"Governance"},
    {id:"ethics",name:"Ethics AI",role:"Ethics & Trust",weights:{risk:0.3,growth:0.3,profit:0.5,compliance:0.9},voteWeight:1.0,style:"values",macro:"Governance"},
    {id:"pm",name:"PM AI",role:"Project Manager",weights:{risk:0.5,growth:0.5,profit:0.6,compliance:0.7},voteWeight:1.0,style:"pragmatic",macro:"Finance/Ops"},
  ]
};

const defaultMembers = templates.ecommerce;

export default function Dashboard(){
  const [members,setMembers]=React.useState<Member[]>(()=>{ if(typeof window!=="undefined"){const s=localStorage.getItem("boardroom_members"); if(s) return JSON.parse(s);} return defaultMembers; });
  const [proposal,setProposal]=React.useState("Launch a premium sustainable line, raise ad spend to 15%, and pilot EU expansion in Q2.");
  const [tab,setTab]=React.useState<"discussion"|"summary"|"votes"|"deliverables"|"customers"|"history">("discussion");
  const [discussion,setDiscussion]=React.useState<string[]>([]);
  const [votes,setVotes]=React.useState<Record<string,Vote>>({});
  const [consensus,setConsensus]=React.useState("No decision yet. Run the board to generate a recommendation.");
  const [memo,setMemo]=React.useState<string|null>(null);
  const [tdl,setTDL]=React.useState<string[]>([]);
  const [sow,setSOW]=React.useState<string>("");
  const [history,setHistory]=React.useState<any[]>([]);
  const [customers,setCustomers]=React.useState<any>(null);
  const [loading,setLoading]=React.useState(false);

  React.useEffect(()=>{ if(typeof window!=="undefined"){ localStorage.setItem("boardroom_members",JSON.stringify(members)); }},[members]);

  async function runBoard(){
    setLoading(true); setDiscussion([]); setVotes({}); setConsensus("..."); setMemo(null); setTDL([]); setSOW("");
    try{
      const res = await fetch("/api/run-board",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({proposal,members})});
      const data = await res.json();
      setDiscussion(data.opinions.map((o:any)=>`${o.memberName}: ${o.narrative}`));
      setVotes(data.votes); setConsensus(data.consensus); setMemo(data.memo);
      setTDL(data.tdl || []); setSOW(data.sow || "");
      await refreshHistory();
    }catch(e){ console.error(e); setConsensus("Error running board."); } finally{ setLoading(false); }
  }

  async function refreshHistory(){
    const hx = await fetch("/api/decisions").then(r=>r.json()).catch(()=>[]);
    setHistory(hx || []);
  }

  async function createTasks(){
    if(!tdl.length){ alert("No tasks to create"); return; }
    const res = await fetch("/api/create-tdl", {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ tasks: tdl })});
    const data = await res.json();
    alert(`Created ${data.created} tasks in ${data.system}`);
  }

  async function sendSOW(){
    if(!sow){ alert("No SOW available"); return; }
    const res = await fetch("/api/send-sow", {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ sow })});
    const data = await res.json();
    alert(`SOW sent for signature via ${data.system}`);
  }

  async function loadCustomers(){
    const res = await fetch("/api/customers"); const data = await res.json(); setCustomers(data);
  }

  function downloadMemo(){
    if(!memo) return;
    const blob = new Blob([memo], {type:"text/markdown"}); const url = URL.createObjectURL(blob);
    const a=document.createElement("a"); a.href=url; a.download="decision_memo.md"; a.click(); URL.revokeObjectURL(url);
  }

  function applyTemplate(name:string){
    // Save members for template
    const t = templates[name as keyof typeof templates]; if(!t) return;
    setMembers(t); localStorage.setItem("boardroom_members", JSON.stringify(t));
  }

  return (<div className="p-6 grid grid-cols-1 xl:grid-cols-4 gap-6">
    <div className="xl:col-span-1 card p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Board Members</h2>
        <select className="input" onChange={e=>applyTemplate(e.target.value)} defaultValue="ecommerce">
          <option value="ecommerce">Template: E‑commerce</option>
          <option value="saas">Template: SaaS</option>
        </select>
      </div>
      <div className="space-y-3">
        {members.map(m=> (
          <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
            <div>
              <div className="font-medium">{m.name}</div>
              <div className="text-xs text-gray-500">{m.role} • {m.macro||""}</div>
              <div className="text-[10px] text-gray-400">risk:{m.weights.risk.toFixed(2)} growth:{m.weights.growth.toFixed(2)} profit:{m.weights.profit.toFixed(2)} comp:{m.weights.compliance.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="xl:col-span-3 card p-4">
      <h2 className="text-lg font-semibold mb-2">Boardroom</h2>
      <label className="text-xs text-gray-500">Proposal</label>
      <textarea className="input mt-1" rows={3} value={proposal} onChange={e=>setProposal(e.target.value)} />
      <div className="mt-3 space-x-2">
        <button className="btn btn-primary" onClick={runBoard} disabled={loading}>{loading?"Running...":"Run Board"}</button>
        <button className="btn" onClick={downloadMemo} disabled={!memo}>Download Memo</button>
        <button className={"btn "+(tab==="discussion"?"tab active":"tab")} onClick={()=>setTab("discussion")}>Discussion</button>
        <button className={"btn "+(tab==="summary"?"tab active":"tab")} onClick={()=>setTab("summary")}>Summary</button>
        <button className={"btn "+(tab==="votes"?"tab active":"tab")} onClick={()=>setTab("votes")}>Votes</button>
        <button className={"btn "+(tab==="deliverables"?"tab active":"tab")} onClick={()=>setTab("deliverables")}>Deliverables</button>
        <button className={"btn "+(tab==="customers"?"tab active":"tab")} onClick={()=>{setTab("customers"); if(!customers) loadCustomers();}}>Customers</button>
        <button className={"btn "+(tab==="history"?"tab active":"tab")} onClick={()=>{setTab("history"); refreshHistory();}}>History</button>
      </div>

      {tab==="discussion" && (<div className="mt-4 card p-4"><div className="font-medium mb-2">Discussion</div>{discussion.length===0?<div className="text-gray-500 text-sm">No discussion yet.</div>:<div className="space-y-2 text-sm">{discussion.map((d,i)=><div key={i}>{d}</div>)}</div>}</div>)}

      {tab==="summary" && (<div className="mt-4 card p-4"><div className="font-medium mb-2">Summary</div><div className="text-sm">{consensus}</div><pre className="mt-3 whitespace-pre-wrap text-xs">{memo}</pre></div>)}

      {tab==="votes" && (<div className="mt-4 card p-4"><div className="font-medium mb-2">Votes</div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {members.map(m=> (<div key={m.id} className="p-3 rounded-xl bg-gray-100 text-center">
            <div className="text-sm font-semibold">{m.name}</div>
            <div className="text-2xl">{votes[m.id]==="yes"?"✅":votes[m.id]==="no"?"❌":votes[m.id]==="warn"?"⚠️":"—"}</div>
          </div>))}
        </div>
      </div>)}

      {tab==="deliverables" && (<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="font-medium mb-2">Task List (TDL)</div>
          {tdl.length===0? <div className="text-sm text-gray-500">Run the board to generate tasks.</div> :
            <ul className="list-disc pl-6 text-sm space-y-1">{tdl.map((t,i)=><li key={i}>{t}</li>)}</ul>}
          <div className="mt-3"><button className="btn" onClick={createTasks} disabled={!tdl.length}>Create Tasks (Asana)</button></div>
        </div>
        <div className="card p-4">
          <div className="font-medium mb-2">Statement of Work (SOW)</div>
          {sow? <pre className="whitespace-pre-wrap text-sm">{sow}</pre> : <div className="text-sm text-gray-500">Run the board to generate SOW.</div>}
          <div className="mt-3"><button className="btn" onClick={sendSOW} disabled={!sow}>Send for Signature (DocuSign)</button></div>
        </div>
      </div>)}

      {tab==="customers" && (<div className="mt-4 card p-4">
        <div className="font-medium mb-2">Customer Overview</div>
        {!customers? <div className="text-sm text-gray-500">Loading...</div> :
          <div className="text-sm space-y-3">
            <div><span className="font-medium">NPS:</span> {customers.nps} / 100</div>
            <div><span className="font-medium">Top Segments:</span>
              <ul className="list-disc pl-6">{customers.segments.map((s:any,i:number)=>(<li key={i}>{s.name} – LTV ${s.ltv} – Churn {Math.round(s.churn*100)}%</li>))}</ul>
            </div>
            <div><span className="font-medium">Top Themes:</span>
              <ul className="list-disc pl-6">{customers.themes.map((t:string,i:number)=>(<li key={i}>{t}</li>))}</ul>
            </div>
          </div>
        }
      </div>)}

      {tab==="history" && (<div className="mt-4 card p-4">
        <div className="font-medium mb-2">Decision History</div>
        {history.length===0? <div className="text-sm text-gray-500">No decisions stored yet.</div> :
          <table className="table"><thead><tr><th>When</th><th>Consensus</th><th>Support</th><th>Excerpt</th></tr></thead><tbody>
            {history.map((h:any,i:number)=>(<tr key={i}><td>{new Date(h.ts).toLocaleString()}</td><td>{h.consensus}</td><td>{(h.supportIndex*100).toFixed(0)}%</td><td>{(h.memo||"").slice(0,60)}...</td></tr>))}
          </tbody></table>
        }
      </div>)}

    </div>
  </div>);
}
