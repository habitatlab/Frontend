const tasks = [
  {
    id: 2,
    title: "In Progress",
    tasks: [
      {
        id: 21,
        description: "Set up New Garden Bed in Backyard",
        members: [
          {
            username: "",
            userImg: "avatar7",
          },
        ],
        status: "Complete",
        budget: "$198",
      },
      {
        id: 22,
        description: "Plant Apple Tree Guild in Southwest Corner",
        members: [
          {
            username: "",
          },
          {
            username: "",
            userImg: "avatar8",
          },
          {
            username: "",
            userImg: "avatar1",
          },
        ],
        status: "Pending",
        budget: "$125",
      },
    ],
  },
  {
    id: 3,
    title: "Completed",
    tasks: [
      {
        id: 31,
        description: "Plan design of garden for 2021",
        members: [
          {
            username: "",
            userImg: "avatar6",
          },
          {
            username: "Fransis",
          },
        ],
        status: "Complete",
        budget: "$175",
      },
      {
        id: 32,
        description: "Order seeds for planting for 2021",
        members: [
          {
            username: "",
            userImg: "avatar7",
          },
        ],
        status: "Complete",
        budget: "$135",
      },
    ],
  },
]

const series = [
  {
    name: "Pounds of Harvest",
    type: "column",
    data: [8, 15, 30, 35, 41, 45, 52, 60, 34, 12, 10],
  },
]

const options = {
  chart: { height: 280, type: "line", stacked: !1, toolbar: { show: !1 } },
  stroke: { width: [0, 2, 5], curve: "smooth" },
  plotOptions: { bar: { columnWidth: "20%", endingShape: "rounded" } },
  colors: ["#556ee6", "#34c38f"],
  fill: {
    gradient: {
      inverseColors: !1,
      shade: "light",
      type: "vertical",
      opacityFrom: 0.85,
      opacityTo: 0.55,
      stops: [0, 100, 100, 100],
    },
  },
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
  ],
  markers: { size: 0 },
  yaxis: { min: 0 },
}

const statusClasses = {
  waiting: "badge-soft-secondary",
  approved: "badge-soft-primary",
  complete: "badge-soft-success",
  pending: "badge-soft-warning",
}

export { tasks, series, options, statusClasses }
