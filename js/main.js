window.addEventListener("DOMContentLoaded", (event) => {
  getSheetData("DIKES_BULANAN", "SELECT *", (sheetData) => {
    let target = [];
    let capaian = [];
    let bulan = [];
    sheetData.forEach((element) => {
      target.push(Number((element.TARGET * 100).toFixed(2)));
      capaian.push(Number((element.PERSENTASE * 100).toFixed(2)));
      bulan.push(element.BULAN + " ");
    });
    curveChart(target, capaian, bulan);
  });

  getSheetData("MASTER", "SELECT * WHERE B > 0 AND C > 0", (sheetData) => {
    let target = [];
    let capaian = [];
    let bidang = [];
    sheetData.forEach((element) => {
      target.push(Number(element.TARGET * 100).toFixed(2));
      capaian.push(Number(element.CAPAIAN * 100).toFixed(2));
      bidang.push(element.BIDANG);
    });
    pieChart(target, capaian, bidang);
  });
  btnBidang();
});

function btnBidang() {
  getSheetData("MASTER", "SELECT A WHERE B > 0 AND C > 0", (sheetData) => {
    let btnHtml = "";
    sheetData.forEach((element) => {
      btnHtml =
        btnHtml +
        `
    <button
    onClick="` +
        element.BIDANG +
        `();"
      class="flex items-center gap-x-3.5 py-2 px-3 w-full rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-teal-500"
    >
      ` +
        element.BIDANG +
        `
    </button>
    `;
    });
    document.getElementById("btnBidang").innerHTML = btnHtml;
  });
}

function SDK() {
  cleanContent();
}

function cleanContent() {
  document.getElementById("content").innerHTML = "iuoiu";
}

function showTabel(sheet, query, formatPersentase = [0]) {
  getSheetData(sheet, query, (sheetData) => {
    tabelData(sheetData, formatPersentase);
  });
}

function showCurveChart(sheet, query) {
  getSheetData(sheet, query, (sheetData) => {
    let target = [];
    let capaian = [];
    let kategori = [];
    sheetData.forEach((element) => {
      target.push(Number((element.TARGET * 100).toFixed(2)));
      capaian.push(Number((element.PERSENTASE * 100).toFixed(2)));
      kategori.push(element.BULAN + " ");
    });
    curveChart(target, capaian, kategori);
  });
}

function showPieChart(sheet, query) {
  getSheetData(sheet, query, (sheetData) => {
    let target = [];
    let capaian = [];
    let kategori = [];
    sheetData.forEach((element) => {
      target.push(Number(element.TARGET * 100).toFixed(2));
      capaian.push(Number(element.CAPAIAN * 100).toFixed(2));
      kategori.push(element.BIDANG);
    });
    pieChart(target, capaian, kategori);
  });
}

function tabelData(sData, formatPersentase = [0]) {
  let tHead = `<th
                  scope="col"
                  class="px-6 py-3 text-left text-white text-xs font-medium  uppercase "> NO
                </th>`;
  let tBody = `<tr class="odd:bg-white even:bg-teal-100 hover:bg-teal-100">`;
  formatPersentase.sort();
  for (let i = 0; i < Object.getOwnPropertyNames(sData[0]).length - 1; i++) {
    tHead =
      tHead +
      `
      <th
        scope="col"
        class="px-6 py-3 text-left text-white text-xs font-medium  uppercase "
      >
        ` +
      Object.getOwnPropertyNames(sData[0])[i];
    +`
      </th>`;
  }
  for (let i = 0; i < sData.length; i++) {
    tBody =
      tBody +
      `<tr class="odd:bg-teal-50 even:bg-teal-100 hover:bg-teal-200"><td
            class="px-6 py-4 whitespace-nowrap text-sm font-medium text-teal-800"
          >
            ` +
      (i + 1) +
      `
      </td>`;
    let iii = 0;
    for (
      let ii = 0;
      ii < Object.getOwnPropertyNames(sData[0]).length - 1;
      ii++
    ) {
      let val = 0;
      if (formatPersentase[iii] - 1 === ii) {
        val = (Object.values(sData[i])[ii] * 100).toFixed(2) + "%";
        iii++;
        console.log(iii);
      } else {
        val = Object.values(sData[i])[ii];
      }
      tBody =
        tBody +
        `<td
            class="px-6 py-4 whitespace-nowrap text-sm font-medium text-teal-800"
          >
            ` +
        val +
        `
      </td>`;
    }

    tBody = tBody + `</tr>`;
  }
  document.getElementById("tHead").innerHTML = tHead;
  document.getElementById("tBody").innerHTML = tBody;
}

function curveChart(target, capaian, kategori) {
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
            data: target,
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
            formatter: (value) => (value >= 1000 ? `${value / 1000}k` : value),
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
}

function pieChart(target, capaian, kategori) {
  let pieHtml = "";
  for (let i = 0; i < kategori.length; i++) {
    pieHtml =
      pieHtml +
      `

            <div class="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3   ">
              <div class="flex flex-col border shadow-sm rounded-xl bg-teal-700">
              <div class="w-full py-2 justify-center flex ">
                <h3 class="text-lg font-medium text-white">` +
      kategori[i] +
      `</h3>
              </div>
                      <!-- pie chart -->
                      <div class="p-4 bg-teal-50">
                        <div class="flex flex-col justify-center items-center h-auto">
                          <div id="hs-pie-chart` +
      kategori[i] +
      `"></div>

                          <!-- Legend Indicator -->
                          <div
                            class="flex justify-center md:justify-end items-center gap-x-4 mt-3 md:mt-6"
                          >
                            <div class="inline-flex items-center">
                              <span
                                class="size-2.5 inline-block bg-yellow-400 rounded-sm me-2"
                              ></span>
                              <span class="text-[13px] text-teal-600"> Belum Tercapai</span>
                            </div>
                            <div class="inline-flex items-center">
                              <span
                                class="size-2.5 inline-block bg-green-400 rounded-sm me-2"
                              ></span>
                              <span class="text-[13px] text-teal-600"> Capaian </span>
                            </div>

                          </div>
                          <!-- End Legend Indicator -->
                        </div>
                      </div>
                      <!-- pie chart end -->
                      <div class="p-3 md:p-5 bg-teal-50 border-t">
                      
                        <p class="mt-1 text-teal-600">
                          Data bidang ` +
      kategori[i] +
      ` terpenuhi sebesar ` +
      capaian[i] +
      `% dari target ` +
      target[i] +
      `%
                </p>
                <button
                onClick="showTabel('MASTER','SELECT *');" 
                  class="mt-2 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:pointer-events-none"
                  
                >
                  Selengkapnya
                </button>
              </div>
            </div>
          </div>

      `;
  }

  document.getElementById("pieChart").innerHTML = pieHtml;
  // console.log(target);

  for (let i = 0; i < kategori.length; i++) {
    (function () {
      buildChart(
        "#hs-pie-chart" + kategori[i],
        () => ({
          chart: {
            height: "100%",
            type: "pie",
            zoom: {
              enabled: false,
            },
          },
          series: [Number(capaian[i]), Number(target[i]) - Number(capaian[i])],
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
}
