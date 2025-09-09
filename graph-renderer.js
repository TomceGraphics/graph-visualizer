const container = document.getElementById("graph-container");
const input = document.getElementById("edges-input");
const renderBtn = document.getElementById("render-btn");
const layoutSelect = document.getElementById("layout-select");
const zoomInBtn = document.getElementById("zoom-in");
const zoomOutBtn = document.getElementById("zoom-out");
const resetViewBtn = document.getElementById("reset-view");

let renderer;

// Enhanced regex parser for multiple formats
function parseLine(line) {
  // Skip empty lines
  if (!line.trim()) return null;
  
  // Try to parse standard format: 'a b 2' or 'a b'
  const standardMatch = line.trim().match(/^\s*([^\s\d\W_]+)\s+([^\s\d\W_]+)(?:\s+(\d+(?:\.\d+)?))?\s*$/);
  if (standardMatch) {
    const node1 = standardMatch[1];
    const node2 = standardMatch[2];
    const weight = standardMatch[3] ? parseFloat(standardMatch[3]) : 1;
    return [node1, node2, weight];
  }
  
  // Try to parse compact format: 'ab1' or 'ab'
  const compactMatch = line.trim().match(/^\s*([^\d\W_]+?)([^\d\W_]+?)(\d+)?\s*$/);
  if (compactMatch) {
    const node1 = compactMatch[1];
    const node2 = compactMatch[2];
    const weight = compactMatch[3] ? parseFloat(compactMatch[3]) : 1;
    return [node1, node2, weight];
  }
  
  // Try to parse formats with separators: 'a-b 1', 'a_b-2', 'a-b(2)', etc.
  const separatorMatch = line.trim().match(/^\s*([^\d\W_]+?)[\s\W_]+([^\d\W_]+?)(?:[\s\W_]+(\d+(?:\.\d+)?))?\s*$/);
  if (separatorMatch) {
    const node1 = separatorMatch[1];
    const node2 = separatorMatch[2];
    const weight = separatorMatch[3] ? parseFloat(separatorMatch[3]) : 1;
    return [node1, node2, weight];
  }
  
  // If no format matches, try to extract any two words and a number
  const fallbackMatch = line.trim().match(/([^\s\W_]+)[\s\W]*(\S+)(?:[\s\W]*(\d+(?:\.\d+)?))?/);
  if (fallbackMatch) {
    const node1 = fallbackMatch[1];
    const node2 = fallbackMatch[2];
    const weight = fallbackMatch[3] ? parseFloat(fallbackMatch[3]) : 1;
    return [node1, node2, weight];
  }
  
  return null;
}

function applyLayout(graph, layoutType) {
  const nodes = graph.nodes();
  const center = { x: 0, y: 0 };
  const radius = 150;
  
  if (layoutType === 'circle') {
    // Circular layout
    const angle = (2 * Math.PI) / nodes.length;
    nodes.forEach((node, i) => {
      graph.setNodeAttribute(node, 'x', radius * Math.cos(i * angle));
      graph.setNodeAttribute(node, 'y', radius * Math.sin(i * angle));
    });
  } else if (layoutType === 'force') {
    // Basic force-directed layout (simplified)
    nodes.forEach(node => {
      graph.setNodeAttribute(node, 'x', (Math.random() - 0.5) * 200);
      graph.setNodeAttribute(node, 'y', (Math.random() - 0.5) * 200);
    });
    
    // Simple force-directed iteration
    for (let iter = 0; iter < 50; iter++) {
      nodes.forEach(node => {
        let dx = 0, dy = 0;
        
        // Repulsion from other nodes
        nodes.forEach(otherNode => {
          if (node !== otherNode) {
            const x1 = graph.getNodeAttribute(node, 'x');
            const y1 = graph.getNodeAttribute(node, 'y');
            const x2 = graph.getNodeAttribute(otherNode, 'x');
            const y2 = graph.getNodeAttribute(otherNode, 'y');
            
            const dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) || 0.001;
            const force = 100 / (dist * dist);
            
            dx += (x1 - x2) / dist * force;
            dy += (y1 - y2) / dist * force;
          }
        });
        
        // Attraction from edges
        graph.forEachEdge(node, (edge, attr, source, target) => {
          const otherNode = source === node ? target : source;
          const x1 = graph.getNodeAttribute(node, 'x');
          const y1 = graph.getNodeAttribute(node, 'y');
          const x2 = graph.getNodeAttribute(otherNode, 'x');
          const y2 = graph.getNodeAttribute(otherNode, 'y');
          
          const dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) || 0.001;
          const force = dist / 10;
          
          dx += (x2 - x1) / dist * force;
          dy += (y2 - y1) / dist * force;
        });
        
        // Center gravity
        const x = graph.getNodeAttribute(node, 'x');
        const y = graph.getNodeAttribute(node, 'y');
        dx += (center.x - x) * 0.01;
        dy += (center.y - y) * 0.01;
        
        // Update position
        graph.setNodeAttribute(node, 'x', x + dx * 0.1);
        graph.setNodeAttribute(node, 'y', y + dy * 0.1);
      });
    }
  } else {
    // Random layout
    nodes.forEach(node => {
      graph.setNodeAttribute(node, 'x', (Math.random() - 0.5) * 200);
      graph.setNodeAttribute(node, 'y', (Math.random() - 0.5) * 200);
    });
  }
}

function renderGraph() {
  const text = input.value.trim();
  if (!text) return;

  // Clear previous graph if it exists
  if (renderer) {
    renderer.kill();
    container.innerHTML = '';
  }

  const Graph = graphology;
  const graph = new Graph();

  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const nodes = new Set();
  const edges = [];

  // Parse all lines first
  lines.forEach(line => {
    const parsed = parseLine(line);
    if (parsed) {
      const [src, tgt, weight] = parsed;
      nodes.add(src);
      nodes.add(tgt);
      edges.push({ source: src, target: tgt, weight: weight });
    }
  });

  // Add nodes to graph
  nodes.forEach(node => {
    graph.addNode(node, {
      label: node,
      size: 15,
      color: "#2563eb"
    });
  });

  // Add edges to graph
  edges.forEach(edge => {
    if (!graph.hasEdge(edge.source, edge.target)) {
      graph.addEdge(edge.source, edge.target, {
        size: 2 + edge.weight/5,
        label: edge.weight.toString(),
        color: "#6b7280"
      });
    }
  });

  // Apply selected layout
  applyLayout(graph, layoutSelect.value);

  // Render the graph with Sigma
  try {
    renderer = new Sigma(graph, container, {
      renderEdgeLabels: true,
      settings: {
        minNodeSize: 8,
        maxNodeSize: 25,
        minEdgeSize: 1,
        maxEdgeSize: 5,
        edgeLabelSize: 12,
        labelSize: 14,
        defaultNodeColor: '#2563eb',
        defaultEdgeColor: '#6b7280',
        font: 'monospace',
      }
    });
    window.sigmaInstance = renderer;
    // --- hover highlight (minimal, add only this) ---
    let hoveredNode = null;

    renderer.setSetting("edgeReducer", (edge, data) => {
      if (!hoveredNode) return data;
      const [s, t] = graph.extremities(edge);
      return (s === hoveredNode || t === hoveredNode)
        ? { ...data, color: "#2563eb", size: data.size + 1 }
        : { ...data, color: "#ccc " };
    });

    renderer.setSetting("nodeReducer", (node, data) => {
      if (!hoveredNode) return data;
      // use a Set for quick lookup
      const nbrs = new Set(graph.neighbors(hoveredNode));
      return node === hoveredNode || nbrs.has(node)
        ? data
        : { ...data, color: "#ddd", size: Math.max(1, data.size * 0.8) };
    });

    renderer.on("enterNode", ({ node }) => {
      hoveredNode = node;
      renderer.refresh();
    });

    renderer.on("leaveNode", () => {
      hoveredNode = null;
      renderer.refresh();
    });
// --- end hover highlight ---
  } catch (error) {
    console.error("Error rendering graph:", error);
    alert("Error rendering graph: " + error.message);
  }
}

// Event listeners
renderBtn.addEventListener("click", renderGraph);

// Add event listener for refresh layout button
document.getElementById('refresh-layout-btn').addEventListener('click', function() {
  if (window.sigmaInstance) {
    const layoutType = document.getElementById('layout-select').value;
    applyLayout(window.sigmaInstance.graph, layoutType);
  }
});

layoutSelect.addEventListener("change", function() {
  if (renderer) {
    const graph = renderer.getGraph();
    applyLayout(graph, this.value);
    renderer.refresh();
  }
});

zoomInBtn.addEventListener("click", function() {
  if (renderer) {
    const camera = renderer.getCamera();
    camera.animatedZoom({ factor: 1.5, duration: 300 });
  }
});

zoomOutBtn.addEventListener("click", function() {
  if (renderer) {
    const camera = renderer.getCamera();
    camera.animatedUnzoom({ factor: 1.5, duration: 300 });
  }
});

resetViewBtn.addEventListener("click", function() {
  if (renderer) {
    const camera = renderer.getCamera();
    camera.animatedReset({ duration: 400 });
  }
});

// Initial render
renderGraph();