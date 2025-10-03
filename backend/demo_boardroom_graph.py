from boardroom_graph_engine import Graph

def build_boardroom_graph():
    g = Graph(directed=True)
    agents = ["CEO", "CFO", "CTO", "CMO", "PMO", "InvestorAgent", "ComplianceAgent"]
    systems = ["PostgresDB", "GitHub", "Jira", "FinanceAPI", "MarketingAPI", "RiskPolicy"]

    for a in agents + systems:
        g.add_node(a, kind="agent" if a in agents else "system")

    edges = [
        ("CEO", "PMO", 1.0),
        ("PMO", "CTO", 1.0), ("PMO", "CMO", 1.0), ("PMO", "CFO", 1.0),
        ("CTO", "GitHub", 0.5), ("CTO", "PostgresDB", 0.7), ("CTO", "Jira", 0.8),
        ("CFO", "FinanceAPI", 0.6), ("InvestorAgent", "FinanceAPI", 0.5),
        ("InvestorAgent", "CFO", 0.9), ("CMO", "MarketingAPI", 0.6),
        ("ComplianceAgent", "RiskPolicy", 0.3), ("ComplianceAgent", "PMO", 0.7),
        ("GitHub", "CTO", 0.5), ("Jira", "PMO", 0.7),
        ("FinanceAPI", "CFO", 0.6), ("MarketingAPI", "CMO", 0.6),
        ("RiskPolicy", "ComplianceAgent", 0.3),
        ("CFO", "CEO", 0.9), ("CTO", "CEO", 0.9), ("CMO", "CEO", 0.9), ("PMO", "CEO", 0.9),
    ]
    for u, v, w in edges:
        g.add_edge(u, v, weight=w)

    return g

def run_demo():
    g = build_boardroom_graph()

    print("BFS from CEO:", g.bfs("CEO"))
    print("DFS from CEO:", g.dfs("CEO"))
    dist, path = g.dijkstra("CEO", "FinanceAPI")
    print("Dijkstra CEO -> FinanceAPI:", dist, path)

    pos = {
        "CEO": (0.0, 1.0), "PMO": (-0.6, 0.5), "CTO": (-0.2, 0.5),
        "CMO": (0.2, 0.5), "CFO": (0.6, 0.5),
        "InvestorAgent": (1.0, 0.2), "ComplianceAgent": (-1.0, 0.2),
        "GitHub": (-0.4, -0.2), "PostgresDB": (-0.2, -0.2), "Jira": (0.0, -0.2),
        "FinanceAPI": (0.6, -0.2), "MarketingAPI": (0.2, -0.2), "RiskPolicy": (-1.0, -0.2)
    }

    fig, ax = g.plot(pos=pos, title="BoardRoomAI – Agents & Data Flow Graph")
    fig.savefig("boardroomai_graph.png", bbox_inches="tight")
    print("Saved plot as boardroomai_graph.png")

if __name__ == "__main__":
    run_demo()
