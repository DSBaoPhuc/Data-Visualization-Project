const select = document.querySelector("#select-date");

d3.csv(
  "https://raw.githubusercontent.com/TP-O/data-visualization-project_l-ToT-l/main/data.csv"
).then(function (data) {
  data
    .map((d) => d["Date"])
    .forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.textContent = option;
      optionElement.value = option;
      select.appendChild(optionElement);
    });

  chart1(data);
  updateHoriztonalBarChart(select.value, data);

  select.addEventListener("input", () => {
    chart1(data);
    updateHoriztonalBarChart(select.value, data);
  });
});

function chart1(data) {
  const labelChart1 = ["Others"];
  const dataChart1 = [0];
  let row = null;

  for (const d of data) {
    if (d["Date"] === select.value) {
      row = d;
    }
  }

  if (!row) {
    return;
  }

  Object.entries(row).forEach(([label, val]) => {
    val = parseFloat(val, 10);
    if (isNaN(val)) {
      return;
    } else if (val <= 5) {
      dataChart1[0] += val;
    } else {
      labelChart1.push(label);
      dataChart1.push(val);
    }
  });

  drawChart1(labelChart1, dataChart1);
}
