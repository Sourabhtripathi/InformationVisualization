let container = d3.select("#svg");
let drawspace = d3.select("#container");
let pdrawspace = d3.select("#pcontainer");
let ddrawspace = d3.select("#dcontainer");
const cHeight = container.node().getBoundingClientRect().height / 1.1;
const cWidth = container.node().getBoundingClientRect().width / 1.7;

d3.csv("./data.csv").then(function (myData) {
  myData = myData.map((d) => ({
    Year: +d.Year,
    PublicCurrency: +d.PublicCurrency,
    CirculationNotes: +d.CirculationNotes,
    CirculationRupeeCoins: +d.CirculationRupeeCoins,
    CirculationSmallCoins: +d.CirculationSmallCoins,
    CashHandBanks: +d.CashHandBanks,
    DepositPublic: +d.DepositPublic,
    DemandDepositBanks: +d.DemandDepositBanks,
    DepositReserveBank: +d.DepositReserveBank,
    TotalMoney: +d.TotalMoney,
  }));

  let mylineData = myData.map((d) => ({
    Year: d.Year,
    PublicCurrency: d.PublicCurrency,
    DepositPublic: d.DepositPublic,
    TotalMoney: d.TotalMoney,
  }));
  let yScale = d3.scaleLinear().range([cHeight, 0]).domain([0, 27000]);
  const max = d3.max(myData, (d) => d.Year);
  let xScale = d3.scaleLinear().domain([2001, max]).range([0, cWidth]);
  container
    .append("g")
    .call(d3.axisLeft(yScale))
    .attr("transform", "translate(" + cWidth / 12 + ",0)");
  container
    .append("g")
    .call(d3.axisBottom(xScale).ticks(17))
    .attr("transform", "translate(" + cWidth / 12 + "," + cHeight + ")")
    .attr("class", "xaxis");

  let mylineArray = ["PublicCurrency", "DepositPublic", "TotalMoney"];
  let cScale = d3.scaleOrdinal().domain(mylineArray).range(d3.schemeCategory10);
  mylineArray.forEach((element) => {
    let linegenerate = d3
      .line()
      .x((d) => xScale(d.Year))
      .y((d) => yScale(d[element]));
    container
      .append("path")
      .datum(mylineData)
      .attr("d", linegenerate)
      .attr("class", "path1")
      .attr("transform", "translate(" + cWidth / 12 + ",0)")
      .attr("stroke", cScale(element));
  });

  var legend = container
    .selectAll(".legend")
    .data(cScale.domain())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      var height = 22;
      var offset = (22 * cScale.domain().length) / 2;
      var horz = cWidth / 2 + 700;
      var vert = 100 + i * height - offset;
      return "translate(" + horz + "," + vert + ")";
    });
  legend
    .append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", cScale)
    .style("stroke", cScale);

  legend
    .append("text")
    .attr("x", 22)
    .attr("y", 14)
    .text((d) => {
      if (d === "PublicCurrency") return "Currency with the public";
      else if (d === "DepositPublic") return "Deposit money of the Public";
      else return "Total Money";
    });

  let mypieArray = [
    ["Currency with the public", "Deposit money of the Public"],
    [
      "Notes in Circulation",
      "Circulation of Rupee Coins",
      "Circulation of Small Coins",
    ],
    ["Demand Deposit of Banks", "'Other' Deposit with Reserve Bank"],
  ];

  let selectElement = document.querySelector("select");

  container
    .select(".xaxis")
    .selectAll(".tick")
    .select("text")
    .style("cursor", "pointer")
    .on("click", (d) => {
      selectElement.value = d.currentTarget.innerHTML.replace(
        d.currentTarget.innerHTML[1],
        ""
      );
      updatePie(selectElement.value);
    });

  selectElement.addEventListener("change", (e) => {
    if (e.target.value === "Choose Year") {
      document.querySelector(".pie-chart-div").style.display = "none";
    } else {
      document.querySelector(".pie-chart-div").style.display = "block";
    }
    updatePie(e.target.value);
  });
  function updatePie(selectYear) {
    let pieYear = selectYear;
    let mymodifiedData =
      pieYear === "Choose Year"
        ? []
        : myData.map((d) => {
            if (d.Year === +pieYear)
              return [
                {
                  category: "Currency with the public",
                  value: d.PublicCurrency,
                },
                {
                  category: "Notes in Circulation",
                  value: d.CirculationNotes,
                },
                {
                  category: "Circulation of Rupee Coins",
                  value: d.CirculationRupeeCoins,
                },
                {
                  category: "Circulation of Small Coins",
                  value: d.CirculationSmallCoins,
                },
                {
                  category: "Cash in Hand Banks",
                  value: d.CashHandBanks,
                },
                {
                  category: "Deposit money of the Public",
                  value: d.DepositPublic,
                },
                {
                  category: "Demand Deposit of Banks",
                  value: d.DemandDepositBanks,
                },
                {
                  category: "'Other' Deposit with Reserve Bank",
                  value: d.DepositReserveBank,
                },
              ];
          });
    console.log(mymodifiedData);
    if (mymodifiedData.length !== 0) {
      let myYearArray = mymodifiedData[+pieYear - 2001];

      for (let i = 0; i < 3; i++) {
        let myArray = [];
        if (i === 0) {
          myArray.push(myYearArray[0]);
          myArray.push(myYearArray[5]);
        } else if (i === 1) {
          myArray.push(myYearArray[1]);
          myArray.push(myYearArray[2]);
          myArray.push(myYearArray[3]);
        } else {
          myArray.push(myYearArray[6]);
          myArray.push(myYearArray[7]);
        }
        console.log(myArray);

        (i === 0 ? drawspace : i === 1 ? pdrawspace : ddrawspace)
          .selectAll("path")
          .remove();

        let pie = d3.pie().value((d) => d.value);
        let arc = d3.arc().outerRadius(200).innerRadius(0);
        let cScale = d3
          .scaleOrdinal()
          .range(
            i === 0
              ? d3.schemeCategory10
              : i === 1
              ? d3.schemeDark2
              : d3.schemePastel1
          )
          .domain(mypieArray[i]);
        (i === 0 ? drawspace : i === 1 ? pdrawspace : ddrawspace)
          .selectAll("path")
          .data(pie(myArray))
          .enter()
          .append("g")
          .append("path")
          .attr("d", arc)
          .attr("fill", (d) => cScale(d.data.category))
          .attr("transform", "translate(200,200)");

        var legend = (i === 0 ? drawspace : i === 1 ? pdrawspace : ddrawspace)
          .selectAll(".legend")
          .data(cScale.domain())
          .enter()
          .append("g")
          .attr("class", "legend")
          .attr("transform", function (d, j) {
            var height = 22;
            var offset = (22 * cScale.domain().length) / 2;
            var horz = 700;
            var vert = 100 + j * height - offset;
            return "translate(" + horz + "," + vert + ")";
          });
        legend
          .append("rect")
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", cScale)
          .style("stroke", cScale);

        legend
          .append("text")
          .attr("x", 22)
          .attr("y", 14)
          .text((d) => d);
      }
    }
  }
});
