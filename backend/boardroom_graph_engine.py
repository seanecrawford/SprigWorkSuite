"""
BoardRoomAI Graph Engine (minimal, dependency-free except matplotlib for plotting)

Features:
- Directed/undirected graph with node/edge attributes
- BFS, DFS, Dijkstra shortest path (weighted)
- Topological sort (for DAGs)
- Simple layout + plotting utilities (matplotlib)
"""
from collections import deque, defaultdict
import math
from typing import Any, Dict, Iterable, List, Optional, Tuple


class Graph:
    def __init__(self, directed: bool = True):
        self.directed = directed
        self._adj = defaultdict(dict)     # node -> {neighbor: edge_attrs}
        self._nodes = {}                  # node -> attrs

    # --- Node & edge management ---
    def add_node(self, node: Any, **attrs):
        self._nodes.setdefault(node, {}).update(attrs)

    def add_edge(self, u: Any, v: Any, weight: float = 1.0, **attrs):
        if u not in self._nodes:
            self.add_node(u)
        if v not in self._nodes:
            self.add_node(v)
        data = {"weight": float(weight)}
        data.update(attrs)
        self._adj[u][v] = data
        if not self.directed:
            self._adj[v][u] = dict(data)

    def nodes(self) -> List[Any]:
        return list(self._nodes.keys())

    def edges(self) -> List[Tuple[Any, Any, Dict]]:
        out = []
        for u, nbrs in self._adj.items():
            for v, data in nbrs.items():
                out.append((u, v, data))
        return out

    def neighbors(self, node: Any) -> Iterable[Any]:
        return self._adj[node].keys()

    # --- Algorithms ---
    def bfs(self, start: Any, goal: Optional[Any] = None) -> List[Any]:
        visited = set()
        order = []
        q = deque([start])
        while q:
            u = q.popleft()
            if u in visited:
                continue
            visited.add(u)
            order.append(u)
            if goal is not None and u == goal:
                return order
            for v in self._adj[u]:
                if v not in visited:
                    q.append(v)
        return order

    def dfs(self, start: Any, goal: Optional[Any] = None) -> List[Any]:
        visited = set()
        order = []

        def _dfs(u):
            visited.add(u)
            order.append(u)
            if goal is not None and u == goal:
                return True
            for v in self._adj[u]:
                if v not in visited:
                    if _dfs(v):
                        return True
            return False

        _dfs(start)
        return order

    def dijkstra(self, start: Any, goal: Any) -> Tuple[float, List[Any]]:
        """Returns (total_weight, path) for shortest path from start to goal."""
        import heapq
        dist = {n: math.inf for n in self._nodes}
        prev = {n: None for n in self._nodes}
        dist[start] = 0.0
        pq = [(0.0, start)]
        while pq:
            d, u = heapq.heappop(pq)
            if d > dist[u]:
                continue
            if u == goal:
                break
            for v, data in self._adj[u].items():
                w = data.get("weight", 1.0)
                nd = d + w
                if nd < dist[v]:
                    dist[v] = nd
                    prev[v] = u
                    heapq.heappush(pq, (nd, v))
        if dist[goal] is math.inf:
            return math.inf, []
        path = []
        cur = goal
        while cur is not None:
            path.append(cur)
            cur = prev[cur]
        path.reverse()
        return dist[goal], path

    def topological_sort(self) -> List[Any]:
        if not self.directed:
            raise ValueError("Topological sort requires a directed graph.")
        indeg = {n: 0 for n in self._nodes}
        for u in self._adj:
            for v in self._adj[u]:
                indeg[v] += 1
        q = deque([n for n, d in indeg.items() if d == 0])
        order = []
        while q:
            u = q.popleft()
            order.append(u)
            for v in self._adj[u]:
                indeg[v] -= 1
                if indeg[v] == 0:
                    q.append(v)
        if len(order) != len(self._nodes):
            raise ValueError("Graph has at least one cycle; not a DAG.")
        return order

    # --- Plotting ---
    def plot(self, pos: Optional[Dict[Any, Tuple[float, float]]] = None, title: str = "Graph"):
        import matplotlib.pyplot as plt
        if pos is None:
            pos = {n: (i, 0) for i, n in enumerate(self.nodes())}
        fig, ax = plt.subplots(figsize=(8, 6))
        for u, v, data in self.edges():
            x1, y1 = pos[u]
            x2, y2 = pos[v]
            ax.annotate("",
                        xy=(x2, y2), xytext=(x1, y1),
                        arrowprops=dict(arrowstyle="->", lw=1))
        for node, (x, y) in pos.items():
            ax.plot(x, y, "o")
            ax.text(x, y, f" {node}", va="center", ha="left")
        ax.set_title(title)
        ax.axis("off")
        return fig, ax
