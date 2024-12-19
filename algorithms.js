function bfs(start, end) {
  const queue = [[start, [start], 0]];
  const visited = new Set();
  let steps = 0;

  while (queue.length > 0) {
    steps++;
    const [current, path, cost] = queue.shift();
    if (current === end) return { path, cost, steps };

    visited.add(current);

    const neighbors = graphData.links.filter(link => link.source === current);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.target)) {
        queue.push([neighbor.target, [...path, neighbor.target], cost + neighbor.cost]);
      }
    }
  }
  return null;
}

function dfs(start, end) {
  const stack = [[start, [start], 0]];
  const visited = new Set();
  let steps = 0;

  while (stack.length > 0) {
    steps++;
    const [current, path, cost] = stack.pop();
    if (current === end) return { path, cost, steps };

    visited.add(current);

    const neighbors = graphData.links.filter(link => link.source === current);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.target)) {
        stack.push([neighbor.target, [...path, neighbor.target], cost + neighbor.cost]);
      }
    }
  }
  return null;
}

function ucs(start, end) {
  const priorityQueue = [[start, [start], 0]];
  const visited = new Set();
  let steps = 0;

  while (priorityQueue.length > 0) {
    steps++;
    priorityQueue.sort((a, b) => a[2] - b[2]);
    const [current, path, cost] = priorityQueue.shift();

    if (current === end) return { path, cost, steps };

    visited.add(current);

    const neighbors = graphData.links.filter(link => link.source === current);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.target)) {
        priorityQueue.push([neighbor.target, [...path, neighbor.target], cost + neighbor.cost]);
      }
    }
  }
  return null;
}

function highlightPath(path) {
  svg.selectAll(".highlight").classed("highlight", false);
  svg.selectAll(".highlight-link").classed("highlight-link", false);

  path.forEach((city, i) => {
    if (i < path.length - 1) {
      const link = graphData.links.find(link => link.source === city && link.target === path[i + 1]);
      svg.selectAll(".link-group")
        .filter(d => d === link)
        .select("line")
        .classed("highlight-link", true);
    }

    svg.selectAll(".node")
      .filter(d => d.id === city)
      .select("circle")
      .classed("highlight", true);
  });
}

document.getElementById('findPath').addEventListener('click', () => {
  const algorithm = document.getElementById('algorithm').value;
  const startCity = document.getElementById('startSelect').value;
  const endCity = document.getElementById('endSelect').value;

  let result;
  if (algorithm === "bfs") result = bfs(startCity, endCity);
  else if (algorithm === "dfs") result = dfs(startCity, endCity);
  else if (algorithm === "ucs") result = ucs(startCity, endCity);

  if (result) {
    document.getElementById("result").innerHTML = `Path: ${result.path.join(" → ")}, Cost: ${result.cost}, Steps: ${result.steps}`;
    highlightPath(result.path);
  } else {
    document.getElementById("result").innerHTML = "No path found.";
  }
});
