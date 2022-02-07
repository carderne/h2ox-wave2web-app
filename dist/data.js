export const dams = [
  {
    name: "krishnaraja_sagar",
    label: "Krishnaraja Sagar",
    max: 1163,
    level: 560,
    fut: 100,
    sel: true,
  },
  {
    name: "harangi",
    label: "Harangi",
    max: 220,
    level: 180,
    fut: 10,
    sel: false,
  },
  {
    name: "hemavathy",
    label: "Hemavathy",
    max: 927,
    level: 300,
    fut: 100,
    sel: false,
  },
  {
    name: "kabini",
    label: "Kabini",
    max: 444,
    level: 90,
    fut: 10,
    sel: false,
  },
  {
    name: "bhadra",
    label: "Bhadra",
    max: 1785,
    level: 1500,
    fut: 100,
    sel: false,
  },
  {
    name: "lower_bhawani",
    label: "Lower Bhawani",
    max: 792,
    level: 400,
    fut: 100,
    sel: false,
  },
];

export const checkBoxes = {
  res: {
    label: "Reservoirs",
    checked: true,
    layers: ["res-fill", "res-line", "res-name"],
    class: "inline-block w-4 h-4 mb-1 align-middle mr-4 rounded",
    style: "background-color:#0ee1e1;border-color:#0707e4;border-width:2px;",
  },
  riv: {
    label: "Rivers",
    checked: true,
    layers: ["rivers"],
    class: "inline-block w-4 h-1 mb-1 align-middle mr-4 rounded",
    style: "background-color:#061e99;",
  },
  basins: {
    label: "Basins",
    checked: true,
    layers: ["basins"],
    class: "inline-block w-4 h-1 mb-1 align-middle mr-4 rounded",
    style: "background-color: #120514;",
  },
  aqueduct: {
    label: "Aqueduct baseline risk",
    checked: false,
    layers: ["aqueduct"],
    class: "inline-block w-4 h-4 mb-1 align-middle mr-4 rounded",
    style: "background-color:#fdcc8a;",
  },
  precip: {
    label: "Mean precipitation",
    checked: false,
    layers: ["precip"],
    class: "inline-block w-4 h-4 mb-1 align-middle mr-4 rounded",
    style: "background-color:#2b8cbe;",
  },
  benga: {
    label: "Bengaluru",
    checked: true,
    layers: ["bengaluru"],
    class: "inline-block w-4 h-4 mb-1 align-middle mr-4 rounded",
    style: "background-color:#382323;",
  },
  canal: {
    label: "Bengaluru canal",
    checked: false,
    layers: ["canal-line"],
    class: "inline-block w-4 h-1 mb-1 align-middle mr-4 rounded",
    style: "background-color: #195700;",
  },
};
