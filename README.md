
# BoardroomAI — Stage 1 (Most Complete Starter)

This package includes:
- Board templates (E‑commerce, SaaS)
- Role agents (CFO, CMO, COO, Legal, Compliance, Ethics, PM, PMO)
- Orchestrator with consensus + Decision Memo
- Deliverables: TDL + SOW, with buttons to create tasks (Asana mock) and send SOW (DocuSign mock)
- Customers tab powered by mock CRM data
- Decisions persisted to `data/decisions.json` with History view

## Run
```
npm install
npm run dev
# http://localhost:3000/boardroom
```

## Where to add real integrations
- Create real connectors under `lib/connectors/{vendor}` using the mock interfaces as guides.
- Replace `/api/customers` to query HubSpot/Salesforce.
- Replace `/api/create-tdl` with Jira/Asana OAuth and task creation.
- Replace `/api/send-sow` with DocuSign/Ironclad e-signature flow.
