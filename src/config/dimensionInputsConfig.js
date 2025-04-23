const dimensionInputsConfig = {
  "Прямая": {
    dataType: "priamaya",
    inputs: [
      { field: "length", top: "45%", left: "5%" },
      { field: "width", top: "5%", left: "45%" },
    ],
  },
  "Г-образная": {
    dataType: "gobraz",
    inputs: [
      { field: "length1", top: "5%", left: "25%" },
      { field: "length2", top: "45%", left: "5%" },
      { field: "width1", top: "5%", left: "70%" },
    ],
  },
  "П - образная": {
    dataType: "pobraz",
    inputs: [
      { field: "length1", top: "5%", left: "20%" },
      { field: "length2", top: "45%", left: "5%" },
      { field: "length3", top: "85%", left: "20%" },
      { field: "width1", top: "5%", left: "70%" },
      { field: "width2", top: "45%", left: "70%" },
      { field: "width3", top: "85%", left: "70%" },
    ],
  },
  "Радиальная": {
    dataType: "fartuk",
    inputs: [
      { field: "length", top: "8%", left: "50%" },
      { field: "width", top: "73%", left: "6%" },
    ],
  },
}


export default dimensionInputsConfig
