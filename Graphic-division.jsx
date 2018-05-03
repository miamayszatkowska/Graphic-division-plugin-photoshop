
var pluginName = "Graphic-division";

var licenceAuthor = "00"

// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop

// debug level: 0-2 (0:disable, 1:break on error, 2:break at beginning)
$.level = 0;
//debugger; // launch debugger on next line

// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details
$.localize = true;

var gScriptResult;

//no dialogs
// displayDialogs = DialogModes.NO  ;

//add json parser
// var scriptF = new File((new File($.fileName)).parent + "/json2.js");
//     scriptF.open('r');
//     var jsonParser = scriptF.read();
//     scriptF.close();

//config

// var jsfile = new File((new File($.fileName)).parent + "/Config/default.js");
//
//      jsfile.open("r");
//      config = eval(jsfile.read());
//      jsfile.close();

//write to js
// jsfile.open('w')
// jsfile.write(data.toSource())
// jsfile.close()

#include df.js;

var pref = blockout;

// alert(pref.material);

//save history state
var startHistory;

//units
var originalUnit = preferences.rulerUnits;
preferences.rulerUnits = Units.CM;

//background templates
  //white
  var whiteColorObj = new CMYKColor();
    var am = 0;
    whiteColorObj.cyan = am;  whiteColorObj.magenta  = am;
    whiteColorObj.yellow = am;  whiteColorObj.black = am;
  //black
  var blackColorObj = new CMYKColor();
    var bm = 100;
    blackColorObj.cyan = bm;  blackColorObj.magenta  = bm;
    blackColorObj.yellow = bm;  blackColorObj.black = bm;

//background to white
app.backgroundColor.cmyk =  whiteColorObj;

//add new layer in case the image is flat (faster than catch(e))
var newLayerRef = app.activeDocument.artLayers.add();
    app.activeDocument.mergeVisibleLayers();

var widthTreshold = pref.widthTreshold;
var overlap = pref.overlap;
var merger = pref.merger;
var frameSize = pref.frameSize;

var cacheWidth = app.activeDocument.width.value;
var cacheHeight = app.activeDocument.height.value;

// alert(typeof(app.activeDocument.width.value));

if (cacheWidth<widthTreshold) {
  // alert("too short");
  // return;
}

var maximumDivision = pref.maximumDivision;
var minimumDivision = pref.minimumDivision;
var optimalDivision = pref.optimalDivision;

var divisionAmount = cacheWidth / maximumDivision;

var dividedFully = Math.floor(divisionAmount);
var lastDivision = cacheWidth - dividedFully * maximumDivision;
var preLastDivision;

var optimal = pref.optimal;

var lastDivisionIsTooSmall = false;
var Sum;

if (lastDivision < minimumDivision && optimal == true) {
var Deq = optimalDivision - lastDivision;
Sum = lastDivision + Deq;
lastDivision = Sum;
preLastDivision = maximumDivision - Sum;
lastDivisionIsTooSmall = true;
} else if (optimal === false) {
Sum = maximumDivision + lastDivision;
preLastDivision = Sum / 2;
lastDivision = preLastDivision;
lastDivisionIsTooSmall = true;
}

var explicitAmount = dividedFully + 1;

//create array with division widths
var divisionWidthsArr = [];

if (!lastDivisionIsTooSmall) {
  for (var i = 0; i < dividedFully; i++) {
      divisionWidthsArr.push(maximumDivision);
  }
  divisionWidthsArr.push(lastDivision);
} else {
  for (var i = 0; i < dividedFully-1; i++) {
      divisionWidthsArr.push(maximumDivision);
  }
  divisionWidthsArr.push(preLastDivision);
  divisionWidthsArr.push(lastDivision);
}

// alert(resizeCanvas().toString());
// alert(divisionWidthsArr.toString());

// var myPath = (app.activeDocument.path).toString().replace(/\\/g, '/');
var myPath;
// alert(myPath);

var folderLoc;
var suffix = pref.suffix;

var Name;
var counter = 0;
var overMul;
var overDiff;
var historyStatus;
var summ;
// alert(historyStatus);

////////////////////////////////////////////////////////////////////
// all documents
for (var i = 0; i < app.documents.length; i++) {
  app.activeDocument = app.documents[i];
  divide ();
}

//////////////////

function divide (){

  myPath = (app.activeDocument.path);

  folderLoc = new Folder(myPath) + "/";

  Name = app.activeDocument.name.replace(/\.[^\.]+$/, '');
  //init history
  startHistory = app.activeDocument.activeHistoryState ;

  for (var j = 0; j < divisionWidthsArr.length; j++) {

    if (pref.overlapWithGraphic===true) {
      if (j === 0) {
        saveState();
        resizeForDivision(divisionWidthsArr[j]+overlap,"left");
        frame ();

        SaveTIFF(new File(folderLoc + Name + suffix + "_0" + (j+1) + "_" +
        Math.round(app.activeDocument.width.value) + "_x_" +
        Math.round(app.activeDocument.height.value) +
        '_' + '.tif'));

        undo(historyStatus);
      } else if (j !== divisionWidthsArr.length-1) {
        saveState();
        summ = 0;
        for (var i = 0; i < j; i++) {
          summ = summ + divisionWidthsArr[i];
        }
        resizeForDivision(app.activeDocument.width.value - summ + overlap*j,"right");
        resizeForDivision(divisionWidthsArr[j]+overlap,"left");

        frame ();

        SaveTIFF(new File(folderLoc + Name + suffix + "_0" + (j+1) + "_" +
        Math.round(app.activeDocument.width.value) + "_x_" +
        Math.round(app.activeDocument.height.value) +
        '_' + '.tif'));

        undo(historyStatus);
      } else {
        saveState();
        summ = 0;
        for (var i = 0; i < j; i++) {
          summ = summ + divisionWidthsArr[i];
        }
        resizeForDivision(app.activeDocument.width.value - summ + overlap*j,"right");
        frame ();

        SaveTIFF(new File(folderLoc + Name + suffix + "_0" + (j+1) + "_" +
        Math.round(app.activeDocument.width.value) + "_x_" +
        Math.round(app.activeDocument.height.value) +
        '_' + '.tif'));

        undo(historyStatus);
      }
    } else if (pref.overlapWithGraphic===false) {
      if (j === 0) {
        saveState();
        resizeForDivision(divisionWidthsArr[j],"left");
        resizeForDivision(divisionWidthsArr[j]+merger,"left");
        frame ();

        SaveTIFF(new File(folderLoc + Name + suffix + "_0" + (j+1) + "_" +
        Math.round(app.activeDocument.width.value) + "_x_" +
        Math.round(app.activeDocument.height.value) +
        '_' + '.tif'));

        undo(historyStatus);
      } else if (j !== divisionWidthsArr.length-1) {
        saveState();
        summ = 0;
        for (var i = 0; i < j; i++) {
          summ = summ + divisionWidthsArr[i];
        }
        resizeForDivision(app.activeDocument.width.value - summ + overlap*j,"right");
        resizeForDivision(divisionWidthsArr[j],"left");
        resizeForDivision(divisionWidthsArr[j]+merger,"left");
        frame ();

        SaveTIFF(new File(folderLoc + Name + suffix + "_0" + (j+1) + "_" +
        Math.round(app.activeDocument.width.value) + "_x_" +
        Math.round(app.activeDocument.height.value) +
        '_' + '.tif'));

        undo(historyStatus);
      } else {
        saveState();
        summ = 0;
        for (var i = 0; i < j; i++) {
          summ = summ + divisionWidthsArr[i];
        }
        resizeForDivision(app.activeDocument.width.value - summ + overlap*j,"right");
        frame ();

        SaveTIFF(new File(folderLoc + Name + suffix + "_0" + (j+1) + "_" +
        Math.round(app.activeDocument.width.value) + "_x_" +
        Math.round(app.activeDocument.height.value) +
        '_' + '.tif'));

        undo(historyStatus);
      }
    }

  }  //end of loop

  //undo all
  undo (startHistory);

} //end of divide

///////////////////////////////////

//obligatory function
function undo (state) {
 app.activeDocument.activeHistoryState = state;
}

function saveState () {
  historyStatus = app.activeDocument.activeHistoryState ;
}

function resizeForDivision (am , side) {
  if (side=="left") {
    activeDocument.resizeCanvas(am, cacheHeight, AnchorPosition.MIDDLELEFT);
  }
  if (side=="right") {
    activeDocument.resizeCanvas(am, cacheHeight, AnchorPosition.MIDDLERIGHT);
  }
  if (side=="center") {
    activeDocument.resizeCanvas(am, cacheHeight, AnchorPosition.MIDDLECENTER);
  }
}

function frame () {
  app.backgroundColor.cmyk =  blackColorObj;

    activeDocument.resizeCanvas(
      app.activeDocument.width.value + frameSize,
      app.activeDocument.height.value + frameSize,
      AnchorPosition.MIDDLECENTER);

  app.backgroundColor.cmyk =  whiteColorObj;
}

function resolutionDown(num){
  app.activeDocument.resizeImage(
    null,
    null,
    num,
    ResampleMethod.BICUBIC
  );
}

// SaveTIFF(new File(folderLoc + Name + ' ' + '.tif'));

function SaveTIFF(saveFile){
tiffSaveOptions = new TiffSaveOptions();
tiffSaveOptions.embedColorProfile = true;
tiffSaveOptions.alphaChannels = true;
tiffSaveOptions.layers = true;
tiffSaveOptions.imageCompression = TIFFEncoding.TIFFLZW;
// tiffSaveOptions.jpegQuality=12;
activeDocument.saveAs(saveFile, tiffSaveOptions, true, Extension.LOWERCASE);
}



// reset Units
preferences.rulerUnits = originalUnit;
