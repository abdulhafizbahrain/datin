let mdBidangId = "1s9cIOdQ9KxS6CBf1Kb6gMDoZAn4_VbD-U6lWIAhmqlA";
let mdPuskesmasId = "1diXkJCO4jLQxVC_RaEJbjHYvNCteTA5qGJ_mb9_xg10";

window.addEventListener("DOMContentLoaded", (event) => {
  namaBidang(mdBidangId, "MASTER", "SELECT * WHERE  B > 0 AND C > 0");
  namaPuskesmas(mdPuskesmasId, "MASTER", "SELECT * WHERE  B > 0 AND C > 0");
  curveChart(mdBidangId, "BIDANG_BULANAN", "SELECT * WHERE A = 'SDK'");
  pieChart(
    mdBidangId,
    "MASTER",
    "SELECT * WHERE A = 'SDK' AND B > 0 AND C > 0"
  );
  tabelData(
    mdBidangId,
    "MASTER",
    "SELECT F,G,H WHERE A = 'SDK' AND F <> '' ",
    [2, 3]
  );

  getSheetData(
    mdBidangId,
    "MASTER",
    "SELECT * WHERE A = 'SDK'",
    (sheetData) => {
      totalProgram(sheetData);
      totalKegiatan(sheetData);
      totalTarget(sheetData);
      totalCapaian(sheetData);
      totalSasaran(sheetData);
    }
  );
});

function namaBidang(linkId, sheet, query) {
  getSheetData(linkId, sheet, query, (sheetData) => {
    let html = "";
    sheetData.forEach((element) => {
      html =
        html +
        `
    <li>
      <a
        class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-teal-600"
        href="` +
        element.BIDANG.toLowerCase() +
        `.html"
      >
        ` +
        element.BIDANG +
        `
      </a>
    </li>

    `;
      document.getElementById("menuBidang").innerHTML = html;
    });
  });
}

function namaPuskesmas(linkId, sheet, query) {
  getSheetData(linkId, sheet, query, (sheetData) => {
    let html = "";
    sheetData.forEach((element) => {
      html =
        html +
        `
    <li>
      <a
        class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-teal-600"
        href="` +
        element.PUSKESMAS.toLowerCase() +
        `.html"
      >
        ` +
        element.PUSKESMAS +
        `
      </a>
    </li>

    `;
      document.getElementById("menuPuskesmas").innerHTML = html;
    });
  });
}

function totalProgram(sData) {
  let html = 0;
  sData.forEach((element) => {
    if (element.TARGET_PROGRAM > 0 && element.CAPAIAN_PROGRAM > 0) {
      html++;
    }
  });
  document.getElementById("totalProgram").innerHTML = html;
}

function totalKegiatan(sData) {
  let html = 0;

  sData.forEach((element) => {
    html++;
  });
  document.getElementById("totalKegiatan").innerHTML = html;
}

function totalTarget(sData) {
  let html = 0;

  sData.forEach((element) => {
    html = html + element.TARGET;
  });
  document.getElementById("totalTarget").innerHTML =
    (html * 100).toFixed(2) + "%";
}

function totalCapaian(sData) {
  let html = 0;

  sData.forEach((element) => {
    html = html + element.CAPAIAN;
  });
  document.getElementById("totalCapaian").innerHTML =
    (html * 100).toFixed(2) + "%";
}

function totalSasaran(sData) {
  let html = 0;

  sData.forEach((element) => {
    if (element.SASARAN_KEGIATAN) {
      html += element.SASARAN_KEGIATAN;
    }
  });
  document.getElementById("totalSasaran").innerHTML = html;
}

function tabelData(linkId, sheet, query, formatPersentase = []) {
  formatPersentase.toSorted(function (a, b) {
    return a - b;
  });
  getSheetData(linkId, sheet, query, (sheetData) => {
    let tHead = `<th scope="col" class="p-2 text-start text-gray-800">NO</th>`;
    let tBody = `<tr class="odd:bg-white even:bg-teal-100 hover:bg-teal-100">`;

    for (
      let i = 0;
      i <= Object.getOwnPropertyNames(sheetData[0]).length - 1;
      i++
    ) {
      tHead =
        tHead +
        `
      <th scope="col" class="p-2 text-start text-gray-800">` +
        Object.getOwnPropertyNames(sheetData[0])[i];
      +`
      </th>`;
    }
    for (let i = 0; i < sheetData.length; i++) {
      tBody =
        tBody +
        `<tr ><td class="size-px p-2 whitespace-nowrap">` +
        (i + 1) +
        `</td>`;

      for (
        let ii = 0, iii = 0;
        ii <= Object.getOwnPropertyNames(sheetData[0]).length - 1;
        ii++
      ) {
        let val = 0;
        if (formatPersentase[iii] - 1 === ii) {
          val = (Object.values(sheetData[i])[ii] * 100).toFixed(2) + "%";
          iii++;
        } else {
          val = Object.values(sheetData[i])[ii];
        }
        tBody =
          tBody + `<td  class="size-px p-2 whitespace-nowrap">` + val + `</td>`;
      }

      tBody = tBody + `</tr>`;
      document.getElementById("jumlahRow").innerHTML = i + 1;
    }
    document.getElementById("tHead").innerHTML = tHead;
    document.getElementById("tBody").innerHTML = tBody;
  });
}

function curveChart(linkId, sheet, query) {
  getSheetData(linkId, sheet, query, (sheetData) => {
    let target = [];
    let capaian = [];
    let kategori = [];
    sheetData.forEach((element) => {
      target.push(Number((element.TARGET * 100).toFixed(2)));
      capaian.push(Number((element.PERSENTASE * 100).toFixed(2)));
      kategori.push(element.BULAN + " ");
    });
    (function () {
      buildChart(
        "#hs-curved-area-charts",
        (mode) => ({
          chart: {
            height: 300,
            type: "area",
            toolbar: {
              show: false,
            },
            zoom: {
              enabled: false,
            },
          },
          series: [
            {
              name: "Target",
              data: [],
            },
            {
              name: "Capaian",
              data: capaian,
            },
          ],
          legend: {
            show: true,
          },
          dataLabels: {
            enabled: true,
          },
          stroke: {
            curve: "smooth",
            width: 2,
          },
          grid: {
            strokeDashArray: 2,
          },
          fill: {
            type: "gradient",
            gradient: {
              type: "vertical",
              shadeIntensity: 1,
              opacityFrom: 0.1,
              opacityTo: 0.8,
            },
          },
          xaxis: {
            type: "Kategori",
            tickPlacement: "on",
            categories: kategori,
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
            crosshairs: {
              stroke: {
                dashArray: 0,
              },
              dropShadow: {
                show: true,
              },
            },
            tooltip: {
              enabled: true,
            },
            labels: {
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
            labels: {
              align: "left",
              minWidth: 0,
              maxWidth: 140,
              style: {
                colors: "#9ca3af",
                fontSize: "13px",
                fontFamily: "Inter, ui-sans-serif",
                fontWeight: 400,
              },
              formatter: (value) =>
                value >= 1000 ? `${value / 1000}k` : value,
            },
          },
          tooltip: {
            x: {
              format: "MMMM yyyy",
            },
            y: {
              formatter: (value) =>
                `$${value >= 10 ? `${value / 1000}k` : value}`,
            },
            custom: function (props) {
              const { categories } = props.ctx.opts.xaxis;
              const { dataPointIndex } = props;
              const title = categories[dataPointIndex].split(" ");
              const newTitle = `${title[0]} ${title[1]}`;

              return buildTooltip(props, {
                title: newTitle,
                mode,
                hasTextLabel: true,
                wrapperExtClasses: "min-w-28",
                labelDivider: ":",
                labelExtClasses: "ms-2",
              });
            },
          },
          responsive: [
            {
              breakpoint: 568,
              options: {
                chart: {
                  height: 300,
                },
                labels: {
                  style: {
                    colors: "#9ca3af",
                    fontSize: "11px",
                    fontFamily: "Inter, ui-sans-serif",
                    fontWeight: 400,
                  },
                  offsetX: -2,
                  formatter: (title) => title.slice(0, 3),
                },
                yaxis: {
                  labels: {
                    align: "left",
                    minWidth: 0,
                    maxWidth: 140,
                    style: {
                      colors: "#9ca3af",
                      fontSize: "11px",
                      fontFamily: "Inter, ui-sans-serif",
                      fontWeight: 400,
                    },
                    formatter: (value) =>
                      value >= 1000 ? `${value / 1000}k` : value,
                  },
                },
              },
            },
          ],
        }),
        {
          colors: ["#16a34a", "#facc15"],
          fill: {
            gradient: {
              stops: [0, 90, 100],
            },
          },
          xaxis: {
            labels: {
              style: {
                colors: "#042f2e",
              },
            },
          },
          yaxis: {
            labels: {
              style: {
                colors: "#042f2e",
              },
            },
          },
          grid: {
            borderColor: "#042f2e",
          },
        },
        {
          colors: ["#16a34a", "#facc15"],
          fill: {
            gradient: {
              stops: [100, 90, 0],
            },
          },
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

function pieChart(linkId, sheet, query) {
  getSheetData(linkId, sheet, query, (sheetData) => {
    let target = [];
    let capaian = [];
    let kategori = [];
    sheetData.forEach((element) => {
      target.push(Number(element.TARGET * 100).toFixed(2));
      capaian.push(Number(element.CAPAIAN * 100).toFixed(2));
      kategori.push(element.BIDANG);
    });

    for (let i = 0; i < kategori.length; i++) {
      (function () {
        buildChart(
          "#hs-pie-chart",
          () => ({
            chart: {
              height: "100%",
              type: "pie",
              zoom: {
                enabled: false,
              },
            },
            series: [
              Number(capaian[i]),
              Number(target[i]) - Number(capaian[i]),
            ],
            labels: ["Direct", "Organic search", "Referral"],
            title: {
              show: false,
            },
            dataLabels: {
              style: {
                fontSize: "20px",
                fontFamily: "Inter, ui-sans-serif",
                fontWeight: "400",
                colors: ["#fff", "#fff", "#1f2937"],
              },
              dropShadow: {
                enabled: false,
              },
              formatter: (value) => `${value.toFixed(2)} %`,
            },
            plotOptions: {
              pie: {
                dataLabels: {
                  offset: -15,
                },
              },
            },
            legend: {
              show: false,
            },
            stroke: {
              width: 4,
            },
            grid: {
              padding: {
                top: -10,
                bottom: -14,
                left: -9,
                right: -9,
              },
            },
            tooltip: {
              enabled: false,
            },
            states: {
              hover: {
                filter: {
                  type: "none",
                },
              },
            },
          }),
          {
            colors: ["#16a34a", "#facc15", "#e5e7eb"],
            stroke: {
              colors: ["rgb(255, 255, 255)"],
            },
          },
          {
            colors: ["#16a34a", "#facc15", "#404040"],
            stroke: {
              colors: ["rgb(38, 38, 38)"],
            },
          }
        );
      })();
    }
  });
}
