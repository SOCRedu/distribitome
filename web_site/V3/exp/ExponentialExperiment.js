//Exponential Experiment
var stepID, runID;
var runCount = 0, stopCount = 0, stopFreq = 10;
var currentRecord, completeRecord = "", header = "Run\tT";;
var dist, distGraph, nParam, rParam;
var recordTable, distTable, timeline;
var runButton, stepButton, distCanvas, showCheck;
var r = 5, t, T, time;

function initializeExperiment(){
	runButton = document.getElementById("runButton");
	stepButton = document.getElementById("stepButton");
	recordTable = document.getElementById("recordTable");
	distCanvas = document.getElementById("distCanvas");
	distTable = document.getElementById("distTable");
	stopSelect = document.getElementById("stopSelect").value = "10";
	showCheck = document.getElementById("showCheck");
	showCheck.checked = true;
	distCanvas = document.getElementById("distCanvas");
	rParam = new Parameter(document.getElementById("rInput"), document.getElementById("rLabel"));
	rParam.setProperties(1, 10, 0.1, r, "<var>r</var>");
	resetExperiment();
}

function stepExperiment(){
	stepButton.disabled = true;
	runButton.disabled = true;
	time = 0;
	timeline.reset();
	computeArrivalTimes();
	stepID = setInterval(increaseTime, 50);
}


function runExperiment(){
	runID = setInterval(experiment, 20);
	stepButton.disabled = true;
	runButton.disabled = true;
	stopSelect.disabled = true;
}

function stopExperiment(){
	stopCount = 0;
	clearInterval(stepID);
	clearInterval(runID);
	stepButton.disabled = false;
	runButton.disabled = false;
	stopSelect.disabled = false;
	if (runCount > 0) recordTable.value = completeRecord;
}

function resetExperiment(){
	stopExperiment();
	runCount = 0; stopCount = 0;
	completeRecord = header;
	recordTable.value = completeRecord;
	r = rParam.getValue();
	dist = new ExponentialDistribution(1/r);
	distGraph = new DistributionGraph(distCanvas, dist, "T");
	showDist(showCheck.checked);
	T = dist.maxValue();
	timeline = new Timeline(document.getElementById("timeline"), 0, T, dist.step());
	timeline.setFormat(1);
	timeline.setMargins(30, 10, 10, 10);
	timeline.draw(0);
}

function experiment(){
	runCount++;
	stopCount++;
	timeline.reset();
	computeArrivalTimes();
	timeline.draw(t);
	currentRecord = runCount + "\t" + t.toFixed(2);
	recordTable.value = header + "\n" + currentRecord;
	completeRecord = completeRecord + "\n" + currentRecord;
	dist.setValue(t);
	distGraph.draw();
	distTable.value = distGraph.text();
	if (stopCount == stopFreq) stopExperiment();
}

function computeArrivalTimes(){
	t = -Math.log(1 - Math.random()) / r;
	timeline.addArrival(t, "red");
}

function increaseTime(){
	time = time + T / 200;
	timeline.draw(time);
	if (time >= t || time >= T){
		runCount++;
		currentRecord = runCount + "\t" + t.toFixed(2);
		completeRecord = completeRecord + "\n" + currentRecord;
		dist.setValue(t);
		distGraph.draw();
		distTable.value = distGraph.text();
		stopExperiment();
	}
}

function showDist(b){
	distGraph.showDist(b);
	distTable.value = distGraph.text();
}
	
	



