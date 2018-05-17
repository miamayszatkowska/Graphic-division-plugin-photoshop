
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

var initialBuffer = preferences.numberOfHistoryStates;
preferences.numberOfHistoryStates = 80;

//colors
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
  //grey
    var greyColorObj = new CMYKColor();
      var cc = 50;
      greyColorObj.cyan = cc;  greyColorObj.magenta  = cc;
      greyColorObj.yellow = cc;  greyColorObj.black = cc;

var baner = new PrefObj(
  "🎂 Banery | Banner"  ,//name
  false, //overlapWithGraphic
  false, //addScaffolding
  1, //overlap
  4, //merger
  0.2, //frameSize
  490, //maximumDivision
  71, //minimumDivision
  80, //optimalDivision
  true, //optimal
  "_br_bryt_", // suffix
  50, //lines_Distance
  0.1, //lineWidth
  1 //lineLongitude
);

var blockout = new PrefObj(
  "🏀 Blockout"  ,//name
  false, //overlapWithGraphic
  false, //addScaffolding
  1, //overlap
  4, //merger
  0.2, //frameSize
  310, //maximumDivision
  71, //minimumDivision
  80, //optimalDivision
  true, //optimal
  "_bt_bryt_", // suffix
  50, //lines_Distance
  0.1, //lineWidth
  1 //lineLongitude
);

var epson = new PrefObj(
  "🎉 Tekstylia | Textiles" ,//name
  true, //overlapWithGraphic
  true, //addScaffolding
  3, //overlap
  0, //merger
  0.2, //frameSize
  290, //maximumDivision
  71, //minimumDivision
  80, //optimalDivision
  true, //optimal
  "_en_bryt_", // suffix
  50, //lines_Distance
  0.3, //lineWidth
  1 //lineLongitude
);

function PrefObj (
  name,
  overlapWithGraphic,
  addScaffolding,
  overlap,
  merger,
  frameSize,
  maximumDivision,
  minimumDivision,
  optimalDivision,
  optimal,
  suffix,
  lines_Distance,
  lineWidth,
  lineLongitude
  )   {
  this.name = name;
  this.overlapWithGraphic = overlapWithGraphic;
  this.addScaffolding = addScaffolding;
  this.overlap = overlap;
  this.merger = merger;
  this.frameSize = frameSize;
  this.maximumDivision = maximumDivision;
  this.minimumDivision = minimumDivision;
  this.optimalDivision = optimalDivision;
  this.optimal = optimal;
  this.suffix = suffix;
  this.lines_Distance = lines_Distance;
  this.lineWidth = lineWidth;
  this.lineLongitude = lineLongitude;
}

var ToverlapWithGraphic = "Uzyj laczenia z grafiki | Create overlap from graphic:";
var TaddScaffolding = "Uzyj znacznikow laczenia | Use merging markers:";
var Toptimal = "Uzywaj mniejszych brytow, gdy to tylko mozliwe | Use smaller divisions whenever possible:";
var Toverlap = "Szerokosc overlapu | Graphics' overlap:";
var Tmerger = "Szerokosc zgrzewu | Width of weld:";
var TmaximumDivision = "Maksymalna szerokosc brytu | Maximal division width:";
var TminimumDivision = "Minimalna szerokosc brytu | Minimal division width:";
var ToptimalDivision = "Szerokosc optymalna minimalnego brytu | Optimal width for leftovers' fixing:";
var Tsuffix = "Suffix:";
var Tlines_Distance = "Pionowa odleglosc pomiedzy liniami znacznikow | Vertical distance between markers:";
var TlineWidth = "Grubosc znacznika | Width of marker:";
var TlineLongitude = "Szerokosc znacznika | How long is a marker:";
var Tframe = "Grubosc obrysowania | Width of framing:";

var choosePref = [baner,blockout,epson];

var Toverlap = "Szerokosc overlapu | Graphics' overlap:";

var w = new Window ('dialog {orientation: "row", alignChildren: [" ", "top"]}',
"Brytowanie grafiki | Graphic division", undefined);

var myDropdown = w.add ("dropdownlist", undefined, []);

for (var i = 0; i < choosePref.length; i++) {
   myDropdown.add('item',choosePref[i].name,i);
}

var tab = w.add ('group {orientation: "column", alignChildren: ["fill","fill"]} ');

myDropdown.selection = 1;

tab.add("statictext", undefined, Toverlap);
tab.overlap = tab.add("edittext", undefined, ' ');

tab.add("statictext", undefined, Tmerger);
tab.merger =             tab.add("edittext", undefined, ' ');

tab.add("statictext", undefined, TmaximumDivision);
tab.maximumDivision =    tab.add("edittext", undefined, ' ');

tab.add("statictext", undefined, TminimumDivision);
tab.minimumDivision =    tab.add("edittext", undefined, ' ');

tab.add("statictext", undefined, ToptimalDivision);
tab.optimalDivision =    tab.add("edittext", undefined, ' ');

tab.add("statictext", undefined, Tframe);
tab.frameSize =    tab.add("edittext", undefined, ' ');

w.add("panel");

tab.optimal =            tab.add("checkbox", undefined, Toptimal);
                                  tab.optimal.value = false;

                                  tab.add("statictext", undefined, Tsuffix);
tab.suffix =             tab.add("edittext", undefined, ' ');


tab.overlapWithGraphic = tab.add("checkbox", undefined, ToverlapWithGraphic);
tab.overlapWithGraphic.value = false;

tab.addScaffolding =     tab.add("checkbox", undefined, TaddScaffolding);
tab.addScaffolding.value = false;

tab.add("statictext", undefined, Tlines_Distance);
tab.lines_Distance =
tab.add("edittext", undefined, ' ');

tab.add("statictext", undefined, TlineWidth);
tab.lineWidth =          tab.add("edittext", undefined, ' ');

tab.add("statictext", undefined, TlineLongitude);
tab.lineLongitude =      tab.add("edittext", undefined, ' ');

var tab2 =  w.add ('group {orientation: "column", alignChildren: ["fill","fill"]} ');

tab2.add("statictext", undefined, "Kolor znacznika | Marker's color:");
var colorPanel = tab2.add("group {preferredSize: [500, 10]}", undefined, " ");
colorPanel.graphics.backgroundColor = tab2.graphics.newBrush (w.graphics.BrushType.SOLID_COLOR, [0.3, 0.3, 0.3]);

var buttonColor = tab2.add ("button", undefined, "Zmien kolor znacznikow | Change markers' color");

l_color = greyColorObj;

buttonColor.onClick = function () {
  tempColor = new CMYKColor();
  color1 = Math.random() * 100;
  color2 = Math.random() * 100;
  color3 = Math.random() * 100;
  color4 = Math.random() * 100;
    tempColor.cyan = color1;  tempColor.magenta  = color2;
    tempColor.yellow = color3;  tempColor.black = color4;
  app.foregroundColor.cmyk = tempColor;
  colorPanel.graphics.backgroundColor = colorPanel.graphics.newBrush (w.graphics.BrushType.SOLID_COLOR, [
    mapRGB(app.foregroundColor.rgb.red,0,255,0,1), mapRGB(app.foregroundColor.rgb.green,0,255,0,1),
    mapRGB(app.foregroundColor.rgb.blue,0,255,0,1)]);
  l_color = app.foregroundColor.cmyk;
}

function mapRGB (num, in_min, in_max, out_min, out_max) {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

myDropdown.onChange = function () {

  for (var i = 0; i < choosePref.length; i++) {
    if (choosePref[i].name.toString() == myDropdown.selection.toString()) {

      tab.compareName = choosePref[i].name;
      tab.overlap.text =  choosePref[i].overlap;
      tab.merger.text =  choosePref[i].merger;
      tab.maximumDivision.text =    choosePref[i].maximumDivision;
      tab.minimumDivision.text =    choosePref[i].minimumDivision;
      tab.optimalDivision.text =     choosePref[i].optimalDivision;
      tab.frameSize.text =   choosePref[i].frameSize;
      tab.optimal.value = choosePref[i].optimal;
      tab.suffix.text = choosePref[i].suffix;
      tab.overlapWithGraphic.value = choosePref[i].overlapWithGraphic;
      tab.addScaffolding.value = choosePref[i].addScaffolding;
      tab.lines_Distance.text =  choosePref[i].lines_Distance;
      tab.lineWidth.text =          choosePref[i].lineWidth;
      tab.lineLongitude.text =      choosePref[i].lineLongitude;

    }
  }

}

var okButton = tab2.add ("iconbutton", undefined, ScriptUI.newImage (File(new File((new File($.fileName)).parent +"/img.png"))));

var cancelButton = tab2.add ("button", undefined, "Anuluj | Cancel", {name: "cancel"});

var appStarted = false;
var pref;

    //// click OK !
    okButton.onClick = function (){
      ///// -- !!!!!!!!!!! pass values to algorithm !!!!!!!!!!! -- /////
        pref = {};

          pref.overlapWithGraphic = tab.overlapWithGraphic.value;
          pref.addScaffolding = tab.addScaffolding.value;
          pref.overlap = parseFloat(tab.overlap.text);
          pref.merger = parseFloat(tab.merger.text);
          pref.frameSize = parseFloat(tab.frameSize.text);
          pref.maximumDivision = parseFloat(tab.maximumDivision.text);
          pref.minimumDivision = parseFloat(tab.minimumDivision.text);
          pref.optimalDivision = parseFloat(tab.optimalDivision.text);
          pref.optimal = tab.optimal.value;
          pref.suffix = tab.suffix.text;
          pref.lines_Distance = parseFloat(tab.lines_Distance.text);
          pref.lineWidth = parseFloat(tab.lineWidth.text);
          pref.lineLongitude = parseFloat(tab.lineLongitude.text);

          appStarted = true;
          w.close();
        }

cancelButton.onClick = function (){
  pref = {};
  pref.overlapWithGraphic = false;
  pref.addScaffolding = false;
  pref.overlap = 0;
  pref.merger = 0;
  pref.frameSize = 0;
  pref.maximumDivision = 0;
  pref.minimumDivision = 0;
  pref.optimalDivision = 0;
  pref.optimal = false;
  pref.suffix = 0
  pref.lines_Distance = 0;
  pref.lineWidth = 0;
  pref.lineLongitude = 0;
  appStarted = false;
  w.close();
}

myDropdown.selection = 2;
w.show ();

// alert(pref.overlap);
//save history state
// var startHistory;

//units
var originalUnit = preferences.rulerUnits;
preferences.rulerUnits = Units.CM;

//background to white
app.backgroundColor.cmyk =  whiteColorObj;

//declare global variables
var overlap, merger, frameSize, cacheWidth, cacheHeight, maximumDivision;
var minimumDivision, optimalDivision, divisionAmount, dividedFully, cacheWidth, cacheHeight;
var lastDivision, preLastDivision, optimal, Sum, explicitAmount, divisionWidthsArr;

overlap = pref.overlap;
merger = pref.merger;
frameSize = pref.frameSize;
maximumDivision = pref.maximumDivision;
minimumDivision = pref.minimumDivision;
optimalDivision = pref.optimalDivision;

function calculate() {

  cacheWidth = app.activeDocument.width.value;
  cacheHeight = app.activeDocument.height.value;

  divisionAmount = cacheWidth / maximumDivision;

  dividedFully = Math.floor(divisionAmount);
  lastDivision = cacheWidth - dividedFully * maximumDivision;
  preLastDivision;

  optimal = pref.optimal;

  lastDivisionIsTooSmall = false;
  Sum;

  if (lastDivision < minimumDivision && optimal == true) {
  var Deq = optimalDivision - lastDivision;
  lastDivision = optimalDivision;
  preLastDivision = maximumDivision - Deq;
  lastDivisionIsTooSmall = true;
  } else if (optimal === false) {
  Sum = maximumDivision + lastDivision;
  preLastDivision = Sum / 2;
  lastDivision = preLastDivision;
  lastDivisionIsTooSmall = true;
  }

  explicitAmount = dividedFully + 1;

  //create array with division widths or empty existing
  divisionWidthsArr = [];

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
}

// var myPath = (app.activeDocument.path).toString().replace(/\\/g, '/');

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
var myPath ;
if (appStarted!=false) {
  if (pref!==null && pref!==undefined) {
    if (app.documents.length !== 0) {
      myPath = app.activeDocument.path;
    } else {
      myPath = Folder.selectDialog("Select output folder / Wybierz folder wyjsciowy", false, false);
    }
  }
}

var inputFolder, inputFiles;
if (appStarted!=false) {
  if (app.documents.length===0) {
    var inputFolder = Folder.selectDialog("Otworz folder do przetworzenia / Open folder for processing");
    if (inputFolder != null)  {  inputFiles = inputFolder.getFiles();  }
    loopThroughFolder();
  } else {
    loop();
  }
}

var extension, splitPath;
function loopThroughFolder() {
  for (var i = 0; i < inputFiles.length; i++){
    splitPath = inputFiles[i].toString().split(".");
    extension = splitPath[splitPath.length-1];
    if (
    extension=='TIF'      ||
    extension=='tif'      ||
    extension=='jpeg'     ||
    extension=='jpg'      ||
    extension=='JPEG'     ||
    extension=='JPG'
    ) {
      openedFile = app.open(inputFiles[i]);
      app.activeDocument = openedFile;
      calculate();
      divide ();
      // if (pref.closing) {
      //   app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
      //   continue;
      // }
    }
  }
}

function loop() {
  for (var i = 0; i < app.documents.length; i++) {
    app.activeDocument = app.documents[i];
    app.activeDocument.flatten();
    if (myPath===null || myPath===undefined) {
      alert("Path error / Blad sciezki !")
    } else {
      calculate();
      divide ();
      // if (pref.closing) {
      //   app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
      //   continue;
      // }
    }
  }
}

//////////////////

function divide (){

  folderLoc = new Folder(myPath) + "/";

  Name = app.activeDocument.name.replace(/\.[^\.]+$/, '');
  //init history
  // startHistory = app.activeDocument.activeHistoryState ;

  for (var j = 0; j < divisionWidthsArr.length; j++) {

    if (pref.overlapWithGraphic===true) {
      if (j === 0) {
        saveState();
        resizeForDivision(divisionWidthsArr[j]+overlap,"left");

        if (pref.addScaffolding) {  drawLines("right");   }
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

        if (pref.addScaffolding) { drawLines("left"); }
        if (pref.addScaffolding) { drawLines("right"); }
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

        if (pref.addScaffolding) { drawLines("left"); }
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
  //
  // //undo all
  // undo (startHistory);

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

function ParaDrawLines (startXY, endXY, width ) {
  // two element array of numbers for x,y start of line,
// two element array of numbers for x,y endof line,
//number;line width in pixels
// uses foreground color
     var desc = new ActionDescriptor();
        var lineDesc = new ActionDescriptor();
            var startDesc = new ActionDescriptor();
            startDesc.putUnitDouble( charIDToTypeID('Hrzn'), charIDToTypeID('#Pxl'), startXY[0] );
            startDesc.putUnitDouble( charIDToTypeID('Vrtc'), charIDToTypeID('#Pxl'), startXY[1] );
        lineDesc.putObject( charIDToTypeID('Strt'), charIDToTypeID('Pnt '), startDesc );
            var endDesc = new ActionDescriptor();
            endDesc.putUnitDouble( charIDToTypeID('Hrzn'), charIDToTypeID('#Pxl'), endXY[0] );
            endDesc.putUnitDouble( charIDToTypeID('Vrtc'), charIDToTypeID('#Pxl'), endXY[1] );
        lineDesc.putObject( charIDToTypeID('End '), charIDToTypeID('Pnt '), endDesc );
        lineDesc.putUnitDouble( charIDToTypeID('Wdth'), charIDToTypeID('#Pxl'), width );
    desc.putObject( charIDToTypeID('Shp '), charIDToTypeID('Ln  '), lineDesc );
    desc.putBoolean( charIDToTypeID('AntA'), true );
    executeAction( charIDToTypeID('Draw'), desc, DialogModes.NO );
}

var startPoint, endPoint, lineWidth, lines, y_cord, initialCmyk, multi, factor, lines_Distance;

function drawLines (side){

  app.foregroundColor.cmyk =  l_color;
  app.backgroundColor.cmyk =  l_color;

  //correct cm to px
  app.preferences.rulerUnits = Units.CM;
  oCM = app.activeDocument.width.value;
  app.preferences.rulerUnits = Units.PIXELS;
  oPX = app.activeDocument.width.value;
  factor = oPX/oCM; // --> factor
  // alert(rmmW +"mm / "+rpixW +"pix\n factor " + factor);

  lines = [];
  lineWidth = pref.lineWidth * factor;
  lineLongitude = pref.lineLongitude * factor;
  lines_Distance = pref.lines_Distance * factor;

  //index has to be an integer
  num_of_lines = parseInt(Math.floor( app.activeDocument.height.value / lines_Distance));

  // populate array accord.:
  // passing array values to drawing function
  // startPoint = [118,434];
  // endPoint = [335,434];

  if (side == "right"){
    for (var i = 1; i < num_of_lines+1; i++) {
      y_cord = lines_Distance*i;
      lines[i] =  {
        start : [ app.activeDocument.width.value - lineLongitude , y_cord],
        end : [ app.activeDocument.width.value , y_cord]
      }

    }
  } else if (side == "left") {
    for (var i = 1; i < num_of_lines+1; i++) {
      y_cord = lines_Distance*i;

      lines[i] =  {
        start : [ 0, y_cord],
        end : [ lineLongitude , y_cord]
      }

    }
  }

  // alert(lines[1].start)

  //for every object in array, draw line
  for (var i = 1; i < lines.length; i++) {
    ParaDrawLines ( lines[i].start , lines[i].end , lineWidth);
  }

   app.foregroundColor.cmyk =  blackColorObj;
   app.backgroundColor.cmyk =  whiteColorObj;
   app.preferences.rulerUnits = Units.CM;
}

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
preferences.numberOfHistoryStates = initialBuffer;
