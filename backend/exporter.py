# backend/exporter.py
import json, os
from boardroom_graph_engine import Graph

def graph_to_json(g: Graph) -> dict:
    nodes = [{"id": n, **g.node_attrs(n)} for n in g.nodes()]
    links = []
    for u, v, data in g.edges():
        links.append({
            "source": u,
            "target": v,
            "weight": float(data.get("weight", 1.0)),
            **{k: v for k, v in data.items() if k not in {"weight"}}
        })
    return {"nodes": nodes, "links": links}

def write_graph_json(g: Graph):
    payload = graph_to_json(g)
    os.makedirs("backend/data", exist_ok=True)
    with open("backend/data/graph.json", "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)
    os.makedirs("public", exist_ok=True)
    with open("public/graph.json", "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)
    print("Wrote backend/data/graph.json and public/graph.json")

if __name__ == "__main__":
    from demo_boardroom_graph import build_boardroom_graph
    g = build_boardroom_graph()
    write_graph_json(g)
