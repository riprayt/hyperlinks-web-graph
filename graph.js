// ===========================
// Graph Data & Logic
// ===========================

const nodes = ["A", "B", "C", "D"];

const links = [
  { source: "A", target: "C" },
  { source: "B", target: "A" },
  { source: "B", target: "D" },
  { source: "C", target: "A" },
  { source: "C", target: "D" },
  { source: "D", target: "D" },
];

// Build adjacency list representation
function buildAdjacencyMap(nodes, links) {
  return nodes.reduce((acc, node) => {
    acc[node] = links
      .filter((link) => link.source === node)
      .map((link) => link.target);
    return acc;
  }, {});
}

// Get outgoing links from a node
function getOutgoingLinks(node, links) {
  return links
    .filter((link) => link.source === node)
    .map((link) => link.target);
}

// Get incoming links to a node
function getIncomingLinks(node, links) {
  return links
    .filter((link) => link.target === node)
    .map((link) => link.source);
}

// ===========================
// DOM Elements
// ===========================

function selectElements() {
  return {
    nodeEls: document.querySelectorAll(".node"),
    edgeEls: document.querySelectorAll(".edge"),
    currentPage: document.getElementById("currentPage"),
    pageSummary: document.getElementById("pageSummary"),
    outgoingList: document.getElementById("outgoingList"),
    incomingList: document.getElementById("incomingList"),
    adjacency: document.getElementById("adjacency"),
    randomClick: document.getElementById("randomClick"),
    resetView: document.getElementById("resetView"),
  };
}

// ===========================
// Graph Visualization
// ===========================

function highlightGraph(selected, nodeEls, edgeEls) {
  // Highlight selected node
  nodeEls.forEach((node) => {
    node.classList.toggle("active", node.dataset.id === selected);
  });

  // Highlight edges
  edgeEls.forEach((edge) => {
    const isOutgoing = edge.dataset.source === selected;
    const isIncoming = edge.dataset.target === selected;
    
    edge.classList.remove("outgoing", "incoming");
    
    if (isOutgoing) {
      edge.classList.add("outgoing");
      edge.style.opacity = "0.95";
    } else if (isIncoming) {
      edge.classList.add("incoming");
      edge.style.opacity = "0.95";
    } else {
      edge.style.opacity = "0.25";
    }
  });
}

// ===========================
// UI Updates
// ===========================

function updatePanel(selected, outgoing, incoming, elements) {
  const { currentPage, pageSummary, outgoingList, incomingList } = elements;

  currentPage.textContent = selected;
  
  // Update page summary
  if (outgoing.length === 0) {
    pageSummary.textContent = "This page has no outgoing links.";
  } else if (outgoing.length === 1) {
    pageSummary.textContent = "This page links out to one other page.";
  } else {
    pageSummary.textContent = `This page links out to ${outgoing.length} other pages.`;
  }

  // Update outgoing links list
  outgoingList.innerHTML = outgoing.length > 0
    ? outgoing.map((node) => `<li>${node}</li>`).join("")
    : "<li>None</li>";

  // Update incoming links list
  incomingList.innerHTML = incoming.length > 0
    ? incoming.map((node) => `<li>${node}</li>`).join("")
    : "<li>None</li>";
}

function updateAdjacencyDisplay(adjacencyMap, nodes, adjacencyElement) {
  adjacencyElement.textContent = nodes
    .map((node) => `${node}: [${adjacencyMap[node].join(", ")}]`)
    .join("\n");
}

// ===========================
// Event Handlers
// ===========================

function setupEventHandlers(elements, selectNodeCallback, links, nodes) {
  const { nodeEls, randomClick, resetView, currentPage } = elements;

  // Add click event to each node
  nodeEls.forEach((node) => {
    node.addEventListener("click", () => {
      selectNodeCallback(node.dataset.id);
    });
  });

  // Random click button
  randomClick.addEventListener("click", () => {
    const current = currentPage.textContent;
    const options = links
      .filter((link) => link.source === current)
      .map((link) => link.target);
    
    const next = options.length > 0
      ? options[Math.floor(Math.random() * options.length)]
      : nodes[Math.floor(Math.random() * nodes.length)];
    
    selectNodeCallback(next);
  });

  // Reset view button
  resetView.addEventListener("click", () => {
    selectNodeCallback("A");
  });
}

// ===========================
// Application Initialization
// ===========================

function init() {
  // Get all DOM elements
  const elements = selectElements();

  // Build adjacency map
  const adjacencyMap = buildAdjacencyMap(nodes, links);
  updateAdjacencyDisplay(adjacencyMap, nodes, elements.adjacency);

  // Node selection handler
  function selectNode(selected) {
    const outgoing = getOutgoingLinks(selected, links);
    const incoming = getIncomingLinks(selected, links);

    updatePanel(selected, outgoing, incoming, elements);
    highlightGraph(selected, elements.nodeEls, elements.edgeEls);
  }

  // Setup event handlers
  setupEventHandlers(elements, selectNode, links, nodes);

  // Initialize with node A
  selectNode("A");
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
