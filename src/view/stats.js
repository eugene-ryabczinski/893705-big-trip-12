import Smart from './smart';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {EVENT_TRANSFER_LIST} from '../const';
import moment from 'moment';
const BAR_HEIGHT = 55;

const renderMoneyChart = (events) => {
  const moneyCtx = document.querySelector(`.statistics__chart--money`);

  const costMap = events
  .reduce((prev, cur) => {
    let cost = 0;
    if (prev[cur.type]) {
      cost = prev[cur.type] + cur.cost;
    } else {
      cost = cur.cost;
    }
    prev[cur.type] = cost;
    return prev;
  }, {});

  const costMapSortedDescArray = Object.entries(costMap)
  .sort((a, b) => {
    return costMap[b[0]] - costMap[a[0]];
  })
  .map((a) => {
    const key = a[0];
    const value = a[1];
    return {
      [key]: value
    };
  });

  const costSortedMap = new Map(costMapSortedDescArray.map((item) => {
    const key = Object.keys(item)[0];
    const value = Object.values(item)[0];
    return [key, value];
  }));

  moneyCtx.height = BAR_HEIGHT * Object.keys(costMap).length;

  const moneyChart = new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Array.from(costSortedMap.keys()).map((type) => type.toUpperCase()),
      // labels: costSortedMap.keys().map((type) => type.toUpperCase()),
      datasets: [{
        // data: Object.values(costMap),
        data: Array.from(costSortedMap.values()),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
  return moneyChart;
};

const renderTransportChart = (events) => {
  const transportCtx = document.querySelector(`.statistics__chart--transport`);

  const transportMap = events
    .map((event) => event.type)
    .filter((type) => EVENT_TRANSFER_LIST.includes(type))
    .reduce((prev, cur) => {
      prev[cur] = (prev[cur] || 0) + 1;
      return prev;
    }, {});

  const transportMapSortedDescArray = Object.entries(transportMap)
  .sort((a, b) => {
    return transportMap[b[0]] - transportMap[a[0]];
  })
  .map((a) => {
    const key = a[0];
    const value = a[1];
    return {
      [key]: value
    };
  });

  const transportSortedMap = new Map(transportMapSortedDescArray.map((item) => {
    const key = Object.keys(item)[0];
    const value = Object.values(item)[0];
    return [key, value];
  }));

  transportCtx.height = BAR_HEIGHT * Object.keys(transportMap).length;

  const transportChart = new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      // labels: Object.keys(transportMap).map((type) => type.toUpperCase()),
      labels: Array.from(transportSortedMap.keys()).map((type) => type.toUpperCase()),
      datasets: [{
        // data: Object.values(transportMap),
        data: Array.from(transportSortedMap.values()),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TRANSPORT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });

  return transportChart;
};

const renderTimeSpentChart = (events) => {
  const timeSpentCtx = document.querySelector(`.statistics__chart--time`);

  const getDuration = (start, end) => {
    const momentStart = moment(start);
    const momentEnd = moment(end);

    const diff = momentEnd.diff(momentStart);
    return diff;
  };

  const format = (val) => {
    const momentDuration = moment.duration(val);
    const dateParts = [`days`, `hours`, `minutes`];
    let formatedDuration = ``;
    for (let part of dateParts) {
      if (momentDuration[part]() !== 0) {
        formatedDuration = formatedDuration.concat(`${momentDuration[part]()}${(part.substring(0, 1)).toUpperCase()} `);
      }
    }
    return formatedDuration;
  };

  const durationMap = events
  .reduce((prev, cur) => {
    let duration = 0;
    if (prev[cur.type]) {
      duration = prev[cur.type] + getDuration(cur.startDate, cur.endDate);
    } else {
      duration = getDuration(cur.startDate, cur.endDate);
    }
    prev[cur.type] = duration;
    return prev;
  }, {});

  const durationMapSortedDescArray = Object.entries(durationMap)
  .sort((a, b) => {
    return durationMap[b[0]] - durationMap[a[0]];
  })
  .map((a) => {
    const key = a[0];
    const value = a[1];
    return {
      [key]: value
    };
  });

  const durationSortedMap = new Map(durationMapSortedDescArray.map((item) => {
    const key = Object.keys(item)[0];
    const value = Object.values(item)[0];
    return [key, value];
  }));

  timeSpentCtx.height = BAR_HEIGHT * Object.keys(durationMap).length;

  const timeSpentChart = new Chart(timeSpentCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      // labels: Object.keys(durationMap).map((type) => type.toUpperCase()),
      labels: Array.from(durationSortedMap.keys()).map((type) => type.toUpperCase()),
      datasets: [{
        data: Array.from(durationSortedMap.values()),
        // data: Object.values(durationMap),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: format
        }
      },
      title: {
        display: true,
        text: `TIME SPENT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });

  return timeSpentChart;
};

const createStatsTemplate = () => {
  return `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
  </section>`;
};

export default class Stats extends Smart {
  constructor(events) {
    super();

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpentChart = null;

    this._evets = events;
  }

  init() {
    this._setCharts();
  }

  getTemplate() {
    return createStatsTemplate();
  }

  removeElement() {
    super.removeElement();
    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpentChart = null;
  }

  _setCharts() {
    this._transportChart = renderTransportChart(this._evets);
    this._moneyChart = renderMoneyChart(this._evets);
    this._timeSpentChart = renderTimeSpentChart(this._evets);
  }
}