// Set the dimensions of the chart
const width3 = 1200;
const height3 = 600;
const margin3 = { top: 20, right: 20, bottom: 30, left: 50 };

// Create a table of programming languages
const table = d3.select("#table").append("table");

// Create the table below the chart for the legend
const legendTable = d3.select("#legend").append("table");

// Fetch the data from data.json
d3.json(
  "https://raw.githubusercontent.com/TP-O/data-visualization-project_l-ToT-l/main/data.json"
).then((data) => {
  // Parse the date format
  const parseDate = d3.timeParse("%B %Y");

  // Format the data
  data.forEach((d) => {
    d.Date = parseDate(d.Date);
    // Convert the values from strings to numbers
    Object.keys(d).forEach((key) => {
      if (key !== "Date") {
        d[key] = +d[key];
      }
    });
  });

  // Get the programming language names from the dataset
  const programmingLanguages = Object.keys(data[0]).filter(
    (key) => key !== "Date"
  );

  // Create the scales
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.Date))
    .range([margin3.left, width3 - margin3.right]);

  const yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, (d) => d3.max(programmingLanguages, (key) => d[key])),
    ])
    .range([height3 - margin3.bottom, margin3.top]);

  // Create the line generator
  const lineGenerator = d3
    .line()
    .x((d) => xScale(d.Date))
    .y((d) => yScale(d.Rating))
    .curve(d3.curveMonotoneX); // Add curve for smooth lines

  // Create the SVG element
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width3)
    .attr("height", height3);

  // Add x-axis
  svg
    .append("g")
    .attr("transform", `translate(0, ${height3 - margin3.bottom})`)
    .call(d3.axisBottom(xScale));

  // Add y-axis
  svg
    .append("g")
    .attr("transform", `translate(${margin3.left}, 0)`)
    .call(d3.axisLeft(yScale));

  // Add axis labels and chart title
  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height3 / 2))
    .attr("y", margin3.left - 10)
    .text("Rating");

  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("x", width3 / 2)
    .attr("y", height3 - margin3.bottom + 30)
    .text("Date");

  // Update the scales with the data domain
  xScale.domain(d3.extent(data, (d) => d.Date));
  yScale.domain([
    0,
    d3.max(data, (d) => d3.max(programmingLanguages, (key) => d[key])),
  ]);

  // Initialize an empty array to store selected languages
  let selectedLanguages = [];

  // Add rows to the table
  const rows = table
    .selectAll("tr")
    .data(programmingLanguages)
    .enter()
    .append("tr")
    .on("click", function (d) {
      const selectedLanguage = d3.select(this).datum();
      const isSelected = d3.select(this).classed("selected");

      // Toggle selection
      d3.select(this).classed("selected", !isSelected);

      // Update the selectedLanguages array
      if (isSelected) {
        selectedLanguages = selectedLanguages.filter(
          (lang) => lang !== selectedLanguage
        );
      } else {
        selectedLanguages.push(selectedLanguage);
      }

      // Clear the SVG element
      svg.selectAll(".line").remove();

      // Add the line chart paths for the selected languages
      selectedLanguages.forEach((language, i) => {
        const filteredData = data.map((d) => ({
          Date: d.Date,
          Rating: d[language],
        }));

        svg
          .append("path")
          .datum(filteredData)
          .attr("class", "line")
          .attr("d", lineGenerator)
          .attr("fill", "none")
          .attr("stroke", getColor(i))
          .attr("stroke-width", 2);
      });

      // Update the legend table
      updateLegendTable(selectedLanguages);
    });

  // Add cells to the rows
  rows
    .selectAll("td")
    .data((d) => [d])
    .enter()
    .append("td")
    .text((d) => d)
    .style("color", (d, i) => getColor(i));

  // Update the x-axis with the date format
  svg.select("g").call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y")));

  // Function to generate different colors for programming languages
  function getColor(index) {
    const colors = [
      "steelblue",
      "darkorange",
      "green",
      "red",
      "purple",
      "teal",
      "gold",
      "blueviolet",
    ];
    return colors[index % colors.length];
  }

  // Function to update the legend table
  function updateLegendTable(languages) {
    // Remove existing rows
    legendTable.selectAll("tr").remove();

    // Add rows to the legend table
    const legendRows = legendTable
      .selectAll("tr")
      .data(languages)
      .enter()
      .append("tr");

    // Add color swatch cells
    legendRows
      .append("td")
      .attr("class", "legend-color")
      .style("background-color", (d, i) => getColor(i));

    // Add language name cells
    legendRows.append("td").text((d) => d);
  }
});

const randomRgbColor = () => {
  let r = Math.floor(Math.random() * 256); // Random between 0-255
  let g = Math.floor(Math.random() * 256); // Random between 0-255
  let b = Math.floor(Math.random() * 256); // Random between 0-255
  return "rgb(" + r + "," + g + "," + b + ")";
};
