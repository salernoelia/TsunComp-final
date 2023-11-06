let settingsGCODE = {
  inputFile: null,
  outputFile: null,
  colorCommandOn4: "\nG1 Z0 ;ON",
  colorCommandOff4: "\nG1 Z{{Zoff}} ;OFF",
  LineWithVariationIsDesactivated: true,
  start: "G1 Z{{Zoff}} F3000\n",
  end: "\nG0 X0 Y0;end of file",
  feedRate: 5000,
  seekRate: 5000,
  // offset: {
  //     x: 0,
  //     y: 0,
  //     z: -1
  // },

  // put your own folder where your svg files ares
  inputFolder: "../api/svg/",
  // put your own folder for the export gcode file
  exportFolder: "../api/gcode/",

  writeOutput: true,
  showOutput: false,
  useSvgo: true,
};

function getSettings() {
  return settingsGCODE;
}
module.exports = {
  getSettings: getSettings,
};
