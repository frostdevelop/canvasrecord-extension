let emulatorScreen = document.getElementById('canvas');
if(!emulatorScreen){alert('No canvas found!');throw new Error('CanvasRecord failed to launch: No canvas')}
let timeStart = null;
let intervalUpdate = null;
let canvasRecorder = null;
let videoChunks = null;
let pauseStart = null;

const mainFrame = document.createElement('div');
mainFrame.className = 'flw-main';
const headerFrame = document.createElement('div');
headerFrame.className = 'flw-header';
const headerTitle = document.createElement('span');
headerTitle.className = 'flw-header_title';
headerTitle.innerText = 'Canvas Recorder!';
const timeText = document.createElement('span');
timeText.className = 'cr-time';
timeText.innerText = '0:00';
const fpsCont = document.createElement('div');
fpsCont.className = 'cr-fps';
fpsCont.innerText = 'FPS: ';
const fpsInput = document.createElement('input');
fpsInput.type = 'number';
fpsInput.value = 30;
fpsInput.max = 240;
fpsInput.min = 1;
fpsInput.className = 'flw-input';
const rowSet = document.createElement('div');
rowSet.className = 'flw-rowset';
const startButton = document.createElement('button');
const pauseButton = document.createElement('button');
const stopButton = document.createElement('button');
startButton.innerText = 'Start';
pauseButton.innerText = 'Pause';
stopButton.innerText = 'Stop';
startButton.classList = 'flw-button';
pauseButton.classList = 'flw-button';
stopButton.classList = 'flw-button';
pauseButton.setAttribute('disabled','');
stopButton.setAttribute('disabled','');
const selectFormat = document.createElement('select');
selectFormat.className = 'flw-input';
selectFormat.innerHTML = "<option value='video/mp4' title='.mp4'>Mpeg-4</option><option value='video/quicktime' title='.mov'>Quicktime</option><option value='video/webm' title='.webm'>Webm</option><option value='video/ogg' title='.ogg'>Ogg</option><option value='video/x-msvideo' title='.avi'>Avi</option><option value='video/mpeg' title='.mpeg'>Mpeg</option>";
const footerCont = document.createElement('div');
footerCont.className = 'flw-footer';
footerCont.innerHTML = 'CanvasRecord v1.0<br>© Frostbyte 2026. aGPLv3.0';

headerFrame.appendChild(headerTitle);
fpsCont.appendChild(fpsInput);
rowSet.appendChild(startButton);
rowSet.appendChild(pauseButton);
rowSet.appendChild(stopButton);
mainFrame.appendChild(headerFrame);
mainFrame.appendChild(timeText);
mainFrame.appendChild(fpsCont);
mainFrame.appendChild(selectFormat);
mainFrame.appendChild(rowSet);
mainFrame.appendChild(footerCont);
document.body.appendChild(mainFrame);

function updateTime(){
	let secs = Math.floor((Date.now()-timeStart)/1000);
	const mins = Math.floor(secs/60);
	secs-=mins*60;
	timeText.innerText = mins.toString()+':'+secs.toString().padStart(2,'0');
}

function startRecording(){
	stopRecording();
	timeStart = Date.now();
	intervalUpdate = setInterval(updateTime,1000);
	pauseButton.removeAttribute('disabled');
	stopButton.removeAttribute('disabled');
	selectFormat.setAttribute('disabled','');
	fpsInput.setAttribute('disabled','');
	videoChunks = [];
	canvasRecorder = new MediaRecorder(emulatorScreen.captureStream(parseInt(fpsInput.value)),{mimeType:selectFormat.value});
	canvasRecorder.ondataavailable=e=>videoChunks.push(e.data);
	canvasRecorder.onstop=()=>{
		const downloadAnchor = document.createElement('a');
		downloadAnchor.download = 'export-cr'+selectFormat.options[selectFormat.selectedIndex].title;
		downloadAnchor.href = URL.createObjectURL(new Blob(videoChunks,{type:selectFormat.value}));
		downloadAnchor.click();
		URL.revokeObjectURL(downloadAnchor.href);
	}
	canvasRecorder.start();
}

function stopRecording(){
	if(canvasRecorder?.state === 'recording' ){
		canvasRecorder.stop();
		clearInterval(intervalUpdate);
		pauseButton.setAttribute('disabled','');
		stopButton.setAttribute('disabled','');
		selectFormat.removeAttribute('disabled','');
		fpsInput.removeAttribute('disabled','');
	}
}

function pauseRecording(){
	if(canvasRecorder.state === 'recording'){
		canvasRecorder.pause();
		pauseRecording.innerText = 'Unpause';
		pauseStart = Date.now();
		clearInterval(intervalUpdate);
	}
	else{
		canvasRecorder.resume();
		pauseRecording.innerText = 'Pause';
		timeStart+=Date.now()-pauseStart;
		intervalUpdate = setInterval(updateTime,1000);
	}
}

startButton.addEventListener('click',startRecording);
stopButton.addEventListener('click',stopRecording);
pauseButton.addEventListener('click',pauseRecording);

document.addEventListener('keydown',e=>{
	if(e.ctrlKey){
		switch(e.key){
			case 'j':
				startRecording();
				break;
			case 'k':
				pauseRecording();
				break;
			case 'l':
				stopRecording();
				break;
		}
	}
});