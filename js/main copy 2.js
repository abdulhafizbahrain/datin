window.addEventListener("DOMContentLoaded", (event) => {
  curveChart();
});

function getData(sheet, query) {
  getSheetData(sheet, query, (sheetData) => {
    pieChart(sheetData);
    curveChart(sheetData);
    // console.log(sheetData.length);
  });
}

function curveChart() {
  let p3kl = [];
  let kesmas = [];
  let yankes = [];
  let sdk = [];
  let bulan = [];
  getSheetData("BIDANG_BULANAN", "SELECT *", (sheetData) => {
    sheetData.forEach((element) => {
      element.BIDANG == "P3KL"
        ? p3kl.push(Number((element.PERSENTASE * 100).toFixed(2)))
        : 0;
      element.BIDANG == "KESMAS"
        ? kesmas.push(Number((element.PERSENTASE * 100).toFixed(2)))
        : 0;
      element.BIDANG == "YANKES"
        ? yankes.push(Number((element.PERSENTASE * 100).toFixed(2)))
        : 0;
      element.BIDANG == "SDK"
        ? sdk.push(Number((element.PERSENTASE * 100).toFixed(2)))
        : 0;
      element.BIDANG == "SDK" ? bulan.push(element.BULAN + " ") : 0;
    });
    (function () {
      buildChart(
        "#hs-curved-line-charts",
        (mode) => ({
          chart: {
            height: 250,
            type: "line",
            toolbar: {
              show: false,
            },
            zoom: {
              enabled: false,
            },
          },
          series: [
            {
              name: "Income",
              data: yankes,
            },
            {
              name: "Outcome",
              data: p3kl,
            },
            {
              name: "Others",
              data: kesmas,
            },
            {
              name: "Othes",
              data: sdk,
            },
          ],
          dataLabels: {
            enabled: true,
          },
          stroke: {
            curve: "smooth",
            width: [4, 4, 4, 4],
            dashArray: [0, 0, 0, 0],
          },
          title: {
            show: false,
          },
          legend: {
            show: false,
          },
          grid: {
            strokeDashArray: 0,
            borderColor: "#e5e7eb",
            padding: {
              top: -20,
              right: 0,
            },
          },
          xaxis: {
            type: "category",
            categories: bulan,
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
            tooltip: {
              enabled: false,
            },
            labels: {
              offsetY: 5,
              style: {
                colors: "#9ca3af",
                fontSize: "13px",
                fontFamily: "Inter, ui-sans-serif",
                fontWeight: 400,
              },
              formatter: (title) => {
                let t = title;

                if (t) {
                  const newT = t.split(" ");
                  t = `${newT[0]} ${newT[1].slice(0, 3)}`;
                }

                return t;
              },
            },
          },
          yaxis: {
            min: 0,
            tickAmount: 4,
            labels: {
              align: "left",
              minWidth: 0,
              maxWidth: 140,
              style: {
                colors: "#9ca3af",
                fontSize: "12px",
                fontFamily: "Inter, ui-sans-serif",
                fontWeight: 400,
              },
              formatter: (value) =>
                value >= 1000 ? `${value / 1000}k` : value,
            },
          },
          tooltip: {
            custom: function (props) {
              const { categories } = props.ctx.opts.xaxis;
              const { dataPointIndex } = props;
              const title = categories[dataPointIndex].split(" ");
              const newTitle = `${title[0]} ${title[1]}`;

              return buildTooltip(props, {
                title: newTitle,
                mode,
                hasTextLabel: true,
                wrapperExtClasses: "min-w-36",
                labelDivider: ":",
                labelExtClasses: "ms-2",
              });
            },
          },
        }),
        {
          colors: [],
          xaxis: {
            labels: {
              style: {
                colors: "#9ca3af",
              },
            },
          },
          yaxis: {
            labels: {
              style: {
                colors: "#9ca3af",
              },
            },
          },
          grid: {
            borderColor: "#e5e7eb",
          },
        },
        {
          colors: [],
          xaxis: {
            labels: {
              style: {
                colors: "#a3a3a3",
              },
            },
          },
          yaxis: {
            labels: {
              style: {
                colors: "#a3a3a3",
              },
            },
          },
          grid: {
            borderColor: "#404040",
          },
        }
      );
    })();
  });
}
