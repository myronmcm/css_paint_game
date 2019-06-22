// Todo: Tie thresholds to a difficulty system
// Todo: Move hardcoded strings to variables.
// Move QuerySelectors to variables
//Reset colors on level change
//Todo: Better way to manage game state

let currentLevel = 0; //Sorry, I don't know an ES6 singletony pattern yet
const maxLevel = levels.length;

const swatch = document.querySelector("#colorBox");
const paint = document.querySelector("#paletteBox");

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

const resetMessageStyles =()=>{
  document.querySelector("#message").classList.remove("perfect");
  document.querySelector("#message").classList.remove("good");
  document.querySelector("#message").classList.remove("bad"); 
};

const getColorType =()=>{
  const colorEntry = document.querySelector("#code").value;
  console.log(`giving type for ${colorEntry}`);
    if (colorEntry.substr(0, 1) == "#") {
    return "hex";
  } else if (colorEntry.substr(0, 4) == "rgba") {
    return "rgba";
  }else if (colorEntry.substr(0, 3) == "rgb") {
    return "rgb";
  }else {
    return "named";
  }
};

const matchType =(lType, pType)=> {
  console.log(`Level type = ${lType} and player type = ${pType}`)
  return (pType == lType);
};

//todo: Move hard coded thresholds to a difficulty system
const checkGame = e => {
  console.log("Checking...")
  const targetColors = colorArray(currentColor(swatch));
  const playerColors = colorArray(currentColor(paint));
  const levelType = levels[currentLevel].targetType;
  const playerType = getColorType();
  const typeMatched = matchType(levelType, playerType);

  resetMessageStyles();

  if(!typeMatched){
    console.log("Mismatch")
    document.querySelector("#message").textContent = "Sorry, not the right color model.";
    document.querySelector("#message").classList.add("bad");    
  }
  else if (
    targetColors.every(
      (v, i) =>
        channelChecker(v, playerColors[i], 0) &&
        totalChecker(targetColors, playerColors, 0) &&
        alphaChecker(targetColors, playerColors, 0)
    )
  ) {
    console.log("Perfect")
    document.querySelector("#message").textContent = "PEFECT MATCH!";
    document.querySelector("#message").classList.add("perfect");
  } else if (
    targetColors.every(
      (v, i) =>
        channelChecker(v, playerColors[i], 25) &&
        totalChecker(targetColors, playerColors, 60) &&
        alphaChecker(targetColors, playerColors, 0.2)
    )
  ) {
    console.log("Close")
    document.querySelector("#message").textContent = "Close. Good job.";
    document.querySelector("#message").classList.add("good");
  } else {
    console.log("Bad color")
    document.querySelector("#message").textContent = "Sorry, not close enough.";
    document.querySelector("#message").classList.add("bad");
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

document.querySelector("#code").onkeypress = e =>{
   const keyCode = e.keyCode || e.which;
    if (keyCode == '13'){
      checkGame();
    }
  
}

document.querySelector("#code").oninput = e => {
  paint.style.backgroundColor = e.target.value;
 
};



const changeLevel =(level)=>{
  resetMessageStyles();
  swatch.style.backgroundColor = levels[level].targetColor;
      document.querySelector("#message").textContent =levels[level].description;
      document.querySelector("#code").value = '';
};

const prevLevel = e => {
  const prev = (currentLevel - 1 >= 0 ? currentLevel - 1 : 0);
  changeLevel(prev)
  currentLevel = prev;
};

const nextLevel = e => {
  const next = (currentLevel + 1 <= maxLevel ? currentLevel + 1 : maxLevel);
  changeLevel(next)
  currentLevel = next;
};

const getLevel =()=> {
  return currentLevel;
};

//start game
changeLevel(0);