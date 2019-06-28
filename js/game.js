// Todo: Tie thresholds to a difficulty system
// Todo: Move hardcoded strings to variables.

const game = {
  currentLevel: parseInt(localStorage.currentLevel, 10) || 0
};

const maxLevel = levels.length;

const swatch = document.querySelector("#colorBox");
const paint = document.querySelector("#paletteBox");
const messageBox = document.querySelector("#message");
const codeBox = document.querySelector("#code");

const currentColor = block => {
  return window.getComputedStyle(block).backgroundColor;
};

const colorArray = colorStr => {
  const c = colorStr
    .substring(colorStr.lastIndexOf("(") + 1, colorStr.lastIndexOf(")"))
    .split(",")
    .map(Number);
  if (c.length <= 3) {
    c.push(1);
  }
  return c;
};

const resetMessageStyles = () => {
  messageBox.classList.remove("perfect");
  messageBox.classList.remove("good");
  messageBox.classList.remove("bad");
};

const getColorType = () => {
  const colorEntry = codeBox.value;
  console.log(`giving type for ${colorEntry}`);
  if (colorEntry.substr(0, 1) == "#") {
    return "hex";
  } else if (colorEntry.substr(0, 4) == "rgba") {
    return "rgba";
  } else if (colorEntry.substr(0, 3) == "rgb") {
    return "rgb";
  } else {
    return "named";
  }
};

const matchType = (lType, pType) => {
  console.log(`Level type = ${lType} and player type = ${pType}`);
  return pType == lType;
};

//todo: Move hard coded thresholds to a difficulty system
const checkGame = e => {
  console.log("Checking...");
  const targetColors = colorArray(currentColor(swatch));
  const playerColors = colorArray(currentColor(paint));
  const levelType = levels[game.currentLevel].targetType;
  const playerType = getColorType();
  const typeMatched = matchType(levelType, playerType);

  resetMessageStyles();

  if (!typeMatched) {
    console.log("Mismatch");
    messageBox.textContent =
      "Sorry, not the right color model.";
    messageBox.classList.add("bad");
  } else if (
    targetColors.every(
      (v, i) =>
        channelChecker(v, playerColors[i], 0) &&
        totalChecker(targetColors, playerColors, 0) &&
        alphaChecker(targetColors, playerColors, 0)
    )
  ) {
    console.log("Perfect");
    messageBox.textContent = "PEFECT MATCH!";
    messageBox.classList.add("perfect");
  } else if (
    targetColors.every(
      (v, i) =>
        channelChecker(v, playerColors[i], 25) &&
        totalChecker(targetColors, playerColors, 60) &&
        alphaChecker(targetColors, playerColors, 0.2)
    )
  ) {
    console.log("Close");
    messageBox.textContent = "Close. Good job.";
    messageBox.classList.add("good");
  } else {
    console.log("Bad color");
    messageBox.textContent = "Sorry, not close enough.";
    messageBox.classList.add("bad");
  }
};

const channelChecker = (v, target, threshold) => {
  return Math.abs(target - v) <= threshold;
};

const totalChecker = (v, target, threshold) => {
  const runningTotal = Math.abs(
    target.reduce((sum, x) => sum + x) - v.reduce((sum, x) => sum + x)
  );
  console.log(`Running total = ${runningTotal}`);
  return runningTotal <= threshold;
};

const alphaChecker = (v, target, threshold) => {
  if (v.length < 4 || target.length < 4) {
    console.error("Alpha channel is missing");
    return false;
  } else {
    const alphaDiff = Math.abs(target[3] - v[3]);
    console.log(`Alpha Channel Diff = ${alphaDiff}`);
    return alphaDiff <= threshold;
  }
};

codeBox.onkeypress = e => {
  const keyCode = e.keyCode || e.which;
  if (keyCode == "13") {
    checkGame();
  }
};

codeBox.oninput = e => {
  paint.style.backgroundColor = e.target.value;
};

const changeLevel = level => {
  resetMessageStyles();
  swatch.style.backgroundColor = levels[level].targetColor;
  messageBox.textContent = levels[level].description;
  codeBox.value = "";
  game.currentLevel = level;
  localStorage.setItem("currentLevel", level);
};

const prevLevel = e => {
  const prev = game.currentLevel - 1 >= 0 ? game.currentLevel - 1 : 0;
  changeLevel(prev);
};

const nextLevel = e => {
  const next =
    game.currentLevel + 1 <= maxLevel ? game.currentLevel + 1 : maxLevel;
  changeLevel(next);
};

const getLevel = () => {
  return game.currentLevel;
};

//start game
changeLevel(game.currentLevel);
