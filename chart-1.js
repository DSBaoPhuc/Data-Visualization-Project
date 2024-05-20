function drawChart1(label, data) {
  var svg = document.querySelector("#chart-1 > svg");
  if (svg) {
    document.getElementById("chart-1").removeChild(svg);
  }

  svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", 400);
  svg.setAttribute("height", 300);
  document.getElementById("chart-1").prepend(svg);

  var colorFirstRow = data.map(() => randomRgbColor());
  var svg = d3.select("#chart-1 svg"),
    width = svg.attr("width"),
    height = svg.attr("height"),
    radius = Math.min(width, height) / 2.8,
    g = svg
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var color = d3.scaleOrdinal(colorFirstRow);
  var pie = d3.pie();

  // Generate the arcs
  var arc = d3.arc().innerRadius(0).outerRadius(radius);

  //Generate groups
  var arcs = g
    .selectAll("arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");

  //Draw arc paths
  arcs
    .append("path")
    .attr("fill", function (d, i) {
      return color(i);
    })
    .attr("d", arc);

  arcs
    .append("text")
    .attr("transform", (d) => {
      const pos = arc.centroid(d);
      const midAngle = Math.atan2(pos[1], pos[0]);
      const x = Math.cos(midAngle) * (radius * 1.2);
      const y = Math.sin(midAngle) * (radius * 1.2);
      return `translate(${x},${y})`;
    })
    .attr("text-anchor", "middle")
    .text((d) => `${d.data.toFixed(2)}%`);

  // Query to colorList
  var colorList = document.querySelector("#color-list-1");
  colorList.innerHTML = "";

  colorFirstRow.map((ele, i) => {
    // Create colorItem
    var colorItem = document.createElement("div");
    colorItem.style.display = "flex";
    var colorBlock = document.createElement("span");
    colorBlock.style.display = "block";
    colorBlock.style.width = "20px";
    colorBlock.style.height = "20px";

    var spanLanguage = document.createElement("span");

    colorBlock.style.backgroundColor = ele;
    spanLanguage.textContent = label[i];
    colorItem.appendChild(colorBlock);
    colorItem.appendChild(spanLanguage);
    colorList.appendChild(colorItem);
  });
}
