/* global Vue mapboxgl Chart */

import { makeChart, trendLineConfig } from "./chart.js";
import { dams, checkBoxes } from "./data.js";

// Global variables and helpers
let chart;
const updateChart = (data) => {
  const [forecast, historic] = data;
  chart = makeChart(chart, forecast, historic);
};
const date = "2021-09-08";

const baseUrl = window.location.href.includes("h2ox")
  ? "https://h2ox-api-kdjsv6lupq-ez.a.run.app/api/"
  : "http://localhost:5111/api/";

const getHeaders = () => {
  const headers = new Headers();
  const username = "wave2web";
  const password = "climateemergency";
  const userPassEnc = btoa(`${username}:${password}`);
  headers.set("Authorization", `Basic ${userPassEnc}`);
  return headers;
};

const fetchOptions = { method: "GET", headers: getHeaders() };

const loadData = (activeReservoir) => {
  const urlForecast = new URL(`${baseUrl}forecast`);
  const urlHistoric = new URL(`${baseUrl}historic`);
  [urlForecast, urlHistoric].forEach((url) => {
    url.searchParams.append("reservoir", activeReservoir);
    url.searchParams.append("date", date);
  });

  Promise.all([
    fetch(urlForecast, fetchOptions).then((resp) => resp.json()),
    fetch(urlHistoric, fetchOptions).then((resp) => resp.json()),
  ]).then((data) => updateChart(data));
};

Vue.component("Trend", {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    data: function () {
      this.makeChart();
    },
  },
  methods: {
    makeChart() {
      const canvas = this.$refs.canvas.getContext("2d");
      const config = trendLineConfig(this.data);
      // eslint-disable-next-line
      new Chart(canvas, config);
    },
  },
  template: `
    <div>
      <canvas ref="canvas" width="0" height="0"></canvas>
    </div>
  `,
});

// Vue app for dam selectors and info
const app = new Vue({
  el: "#body",
  data: {
    dams: dams,
    active: dams[0].name,
    levels: dams.reduce((acc, el) => ((acc[el.name] = el.level), acc), {}),
    futs: dams.reduce((acc, el) => ((acc[el.name] = el.fut), acc), {}),
    checks: checkBoxes,
    lastUpdate: date,
    fc: dams.reduce((acc, el) => ((acc[el.name] = []), acc), {}),
    search: "",
  },
  computed: {
    searchLow: function () {
      return this.search.toLowerCase();
    },
    includeRes: function () {
      return this.dams
        .filter((d) => d.name.toLowerCase().includes(this.searchLow))
        .map((d) => d.name);
    },
    dirs: function () {
      return this.dams.reduce(
        (acc, el) => (
          (acc[el.name] = this.futs[el.name] > this.levels[el.name]), acc
        ),
        {}
      );
    },
    dirSymbs: function () {
      return this.dams.reduce(
        (acc, el) => (
          (acc[el.name] =
            this.futs[el.name] > this.levels[el.name] ? "↑" : "↓"),
          acc
        ),
        {}
      );
    },
  },
  watch: {
    active: function () {
      loadData(this.active);
    },
  },
  methods: {
    update: function (layers, checked) {
      layers.forEach((lay) => {
        // eslint-disable-next-line no-use-before-define
        map.setLayoutProperty(lay, "visibility", checked ? "visible" : "none");
      });
    },
  },
});

mapboxgl.accessToken =
  "pk.eyJ1IjoiY2FyZGVybmUiLCJhIjoiY2puMXN5cnBtNG53NDN2bnhlZ3h4b3RqcCJ9.eNjrtezXwvM7Ho1VSxo06w";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/carderne/ckrjgvfbr8auv19nzc3fir8p9?fresh=true",
  bounds: [73.94, 11.18, 83.35, 14.04], // bbox is in order west, south, east, north
  maxBounds: [71, 7, 86, 17],
  minZoom: 5,
  maxZoom: 11,
});
map.dragRotate.disable();
map.touchZoomRotate.disableRotation();

const getAllLevels = () => {
  const latest = (data) => {
    const [levels, forecasts] = data;
    levels.forEach((el) => {
      const name = el.reservoir;
      app.levels[name] = el.volume;
      app.futs[name] = el.forecast;
    });
    forecasts.forEach((el) => {
      const fc = el.forecast.map((f) => f.y);
      app.fc[el.reservoir] = fc;
    });
  };

  const urlLevels = new URL(`${baseUrl}levels`);
  const urlForecasts = new URL(`${baseUrl}forecasts`);
  urlForecasts.searchParams.append("date", app.lastUpdate);

  Promise.all([
    fetch(urlLevels, fetchOptions).then((resp) => resp.json()),
    fetch(urlForecasts, fetchOptions).then((resp) => resp.json()),
  ]).then((data) => latest(data));
};

const pointer = () => (map.getCanvas().style.cursor = "pointer");
const nopointer = () => (map.getCanvas().style.cursor = "");

const handleClick = (e) => {
  e.preventDefault();
  const clickedName = e.features[0].properties.name;
  if (dams.map((el) => el.name).includes(clickedName)) app.active = clickedName;
};

map.on("load", () => {
  map.on("mouseenter", "res-fill", pointer);
  map.on("mouseleave", "res-fill", nopointer);
  map.on("click", "res-fill", handleClick);
  map.on("click", "res-line", handleClick);
  map.on("click", "res-name", handleClick);
});

// Load data on first load
loadData(app.active);
getAllLevels();
