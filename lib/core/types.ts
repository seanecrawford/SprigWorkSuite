export type Vote="yes"|"no"|"warn";
export interface Proposal{title:string;description:string;metadata?:Record<string,any>;}
export interface Opinion{memberId:string;memberName:string;role:string;narrative:string;metrics?:Record<string,number>;}
export interface MemberConfig{id:string;name:string;role:string;weights:{risk:number;growth:number;profit:number;compliance:number};voteWeight:number;style:string;macro?:string;}
export interface OrchestratorResult{opinions:Opinion[];votes:Record<string,Vote>;consensus:string;supportIndex:number;memo:string;tdl:string[];sow:string;}
