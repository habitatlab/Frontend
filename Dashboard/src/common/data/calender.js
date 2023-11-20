const events = [
  {
    id: 1,
    title: "Tomato Seed Starting",
    start: new Date('2021-01-12T00:00:00'),
    className: "bg-success text-white",
  },
  {
    id: 2,
    title: "Tomato Transplanting",
    start: new Date().setDate(new Date().getDate() + 14), 
    end: new Date(),
    className: "bg-secondary text-white",
  },
  {
    id: 3,
    title: "Weed The Garden",
    start: new Date().setDate(new Date().getDate() + 8),
    className: "bg-primary text-white",
  },
  {
    id: 4,
    title: "Harvest Carrots",
    start: new Date().setDate(new Date().getDate() + 7),
    className: "bg-warning text-white",
  },
]

const calenderDefaultCategories = [
  {
    id: 1,
    title: "Seed Starting Date",
    type: "bg-success",
  },
  {
    id: 2,
    title: "Transplanting Date",
    type: "bg-secondary",
  },
  {
    id: 3,
    title: "Harvest Date",
    type: "bg-warning",
  },
  {
    id: 4,
    title: "Garden Task",
    type: "bg-primary",
  },
]

export { calenderDefaultCategories, events }
