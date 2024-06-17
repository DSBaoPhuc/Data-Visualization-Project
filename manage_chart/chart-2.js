// Chart dimensions
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 1200 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;
const barHeight = 20;

// Create the SVG container
const svg = d3.select(".chart-2").attr("width", width).attr("height", height);

function sortData(data) {
  return data.sort((a, b) => b.popularity - a.popularity);
}

// Function to update the chart based on the selected date
function updateHoriztonalBarChart(selectedDate, data) {
  const selectedData = data.find((d) => d.Date === selectedDate);
  if (!selectedData) {
    // If the selected date is not present in the data, show an alert
    alert("No data available for the selected date");
    return;
  }
  const languageData = Object.entries(selectedData)
    .filter(([key, value]) => key !== "Date")
    .map(([language, popularity]) => ({
      language,
      //round the popularity value to 2 decimal places
      popularity: Math.round(popularity * 100) / 100,
    }));

  // Sort the data based on popularity
  const sortedData = sortData(languageData);

  // Define the x-axis scale
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(sortedData, (d) => d.popularity)])
    .range([0, width]);

  // Add x-axis to the chart
  // Check if the x-axis is already present, if yes, update it
  const xAxis = svg.select(".x-axis");
  if (xAxis.empty()) {
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(100, ${sortedData.length * barHeight})`)
      .call(d3.axisBottom(xScale));
  } else {
    xAxis
      .transition()
      .duration(500)
      .attr("transform", `translate(100, ${sortedData.length * barHeight})`)
      .call(d3.axisBottom(xScale));
  }

  // Add labels to the x-axis
  svg
    .append("text")
    .attr("class", "x-axis-label")
    .attr("transform", `translate(${width / 2}, ${height - 100})`)
    .style("text-anchor", "middle")
    .text("% Popularity");

  // Update the bars
  const bars = svg.selectAll(".bar").data(sortedData, (d) => d.language);

  // Enter selection
  const barsEnter = bars
    .enter()
    .append("g")
    .attr("class", "bar")
    .attr("transform", (d, i) => `translate(100, ${i * barHeight})`);

  barsEnter
    .append("rect")
    .attr("height", barHeight - 1)
    .attr("width", 0)
    .transition()
    .duration(500)
    .attr("width", (d) => xScale(d.popularity));

  // Update selection
  bars
    .merge(barsEnter)
    .attr("transform", (d, i) => `translate(100, ${i * barHeight})`);

  bars
    .merge(barsEnter)
    .select("rect")
    .transition()
    .duration(500)
    .attr("width", (d) => xScale(d.popularity));

  // Add event handlers to the merged selection of bars
  bars
    .merge(barsEnter)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

  bars.exit().remove();

  // Update the text labels
  const textLabels = svg
    .selectAll(".bar-text")
    .data(sortedData, (d) => d.language);

  // Transition the text labels
  textLabels
    .enter()
    .append("g")
    .attr("class", "bar-text")
    .attr("transform", (d, i) => `translate(0, ${i * barHeight})`)
    .append("text")
    .attr("x", 0)
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text((d) => d.language)
    .style("opacity", 0)
    .transition() // Add transition for entering text labels
    .duration(500)
    .style("opacity", 1);

  textLabels
    .transition() // Add transition for updating text labels
    .duration(500)
    .attr("transform", (d, i) => `translate(0, ${i * barHeight})`);

  textLabels.exit().remove();
}

// Define the event handlers separately
function handleMouseOver(event, d) {
  const tooltip = d3.select(".tooltip");
  // Create the tooltip if it doesn't exist
  if (tooltip.empty()) {
    d3.select("#chart-2")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  }

  const x = event.screenX;
  const y = event.screenY;

  // Update the tooltip position and content
  tooltip
    .style("left", `${x + 20}px`)
    .style("top", `${y - 100}px`)
    .transition()
    .duration(200)
    .style("opacity", 0.9)
    .text(`${d.language}: ${d.popularity}%`);

  // Highlight the bar
  d3.select(this).style("fill", "orange");
}

function handleMouseOut() {
  const tooltip = d3.select(".tooltip");
  tooltip.style("opacity", 0);
  d3.select(this).style("fill", "steelblue");
}
