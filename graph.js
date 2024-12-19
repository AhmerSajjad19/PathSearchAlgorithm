let graphData = {
  nodes: [],
  links: []
};

const svg = d3.select("svg");

function updateCityDropdowns() {
  const fromCityDropdown = document.getElementById("fromCity");
  const toCityDropdown = document.getElementById("toCity");
  const startCityDropdown = document.getElementById("startSelect");
  const endCityDropdown = document.getElementById("endSelect");

  fromCityDropdown.innerHTML = '';
  toCityDropdown.innerHTML = '';
  startCityDropdown.innerHTML = '';
  endCityDropdown.innerHTML = '';

  graphData.nodes.forEach(city => {
    const option = new Option(city.id, city.id);
    fromCityDropdown.appendChild(option.cloneNode(true));
    toCityDropdown.appendChild(option.cloneNode(true));
    startCityDropdown.appendChild(option.cloneNode(true));
    endCityDropdown.appendChild(option.cloneNode(true));
  });

  document.getElementById("pathSelection").style.display = graphData.nodes.length >= 2 ? "block" : "none";
}

document.getElementById('addCity').addEventListener('click', () => {
  const newCity = document.getElementById('newCity').value.trim();
  if (newCity && !graphData.nodes.some(city => city.id === newCity)) {
    const newNode = { 
      id: newCity,
      x: 100 + Math.random() * 800,
      y: 100 + Math.random() * 500
    };
    graphData.nodes.push(newNode);
    updateCityDropdowns();
    updateGraph();
    document.getElementById('newCity').value = '';
    alert(`New city "${newCity}" added!`);
  } else {
    alert("Please enter a valid city name.");
  }
});

document.getElementById('addPath').addEventListener('click', () => {
  const fromCity = document.getElementById('fromCity').value;
  const toCity = document.getElementById('toCity').value;
  const cost = parseInt(document.getElementById('cost').value, 10);

  if (fromCity && toCity && cost > 0) {
    graphData.links.push({ source: fromCity, target: toCity, cost: cost });
    updateGraph();
    alert(`Path added between ${fromCity} and ${toCity} with cost ${cost}`);
  } else {
    alert("Please select cities and enter a valid cost.");
  }
});

document.getElementById('resetGraph').addEventListener('click', () => {
  graphData = { nodes: [], links: [] };
  svg.selectAll("*").remove();
  document.getElementById("result").innerHTML = "";
  updateCityDropdowns();
  alert("Graph has been reset!");
});

function updateGraph() {
  svg.selectAll("*").remove();

  svg.selectAll(".link")
    .data(graphData.links)
    .enter().append("g")
    .attr("class", "link-group")
    .each(function(d) {
      const linkGroup = d3.select(this);
      linkGroup.append("line")
        .attr("class", "link")
        .attr("x1", d => getNode(d.source).x)
        .attr("y1", d => getNode(d.source).y)
        .attr("x2", d => getNode(d.target).x)
        .attr("y2", d => getNode(d.target).y);

      linkGroup.append("text")
        .attr("class", "cost")
        .attr("x", () => (getNode(d.source).x + getNode(d.target).x) / 2)
        .attr("y", () => (getNode(d.source).y + getNode(d.target).y) / 2 - 5)
        .attr("text-anchor", "middle")
        .text(d.cost);
    });

  svg.selectAll(".node")
    .data(graphData.nodes)
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.x},${d.y})`)
    .each(function(d) {
      d3.select(this).append("circle").attr("r", 10);
      d3.select(this).append("text")
        .attr("dy", -15)
        .attr("text-anchor", "middle")
        .text(d.id);
    });
}

function getNode(cityId) {
  return graphData.nodes.find(d => d.id === cityId);
}
