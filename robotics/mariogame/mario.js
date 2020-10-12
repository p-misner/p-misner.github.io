//universal variables
var GRAVITY = 0.3;
var DRAG = -1;
var GROUND_Y = 450;
var mario, ground, cliff, viruss;
var gameOver;
var win = false;
var inframe = false;
var added = 1;
var serial;
//var portName = '/dev/tty.usbserial-AB0JN9HX';
var inData;
var reset = true;
// Classifier Variable
//let classifier;
//// Model URL
//let imageModelURL = ' https://teachablemachine.withgoogle.com/models/TKpaxdt6b/';


//// Video
//let video;
//let flippedVideo;
//// To store the classification
//let label = "";

// Load the model first
//function preload() {
//classifier = ml5.imageClassifier(imageModelURL + 'model.json');
//}

function setup() {
	var canvas = createCanvas(1000,400);
	canvas.parent('mariocontainer');
	background('rgba(94, 177, 247,1)');

//	video = createCapture(VIDEO);
//		video.size(320, 240);
//		video.hide();
//		flippedVideo = ml5.flipImage(video);
//		// Start classifying
//		classifyVideo();

//	 //Serial Stuff
//	serial = new p5.SerialPort(); //new instance of serial port lib
//	serial.on('list', printList);
//	serial.list();
//	serial.on('connected', serverConnected);
//	serial.on('open', portOpen);
//	serial.on('data', serialEvent);
//	serial.on('error', serialError);
//	serial.on('close', portClose);
//	serial.open(portName); //open a serial port

	//Game Stuff
	marioImg = loadImage('https://i.postimg.cc/V6d5f7jV/mario.png');
	mario = createSprite(60, 3*height/4, 10,10);
	mario.addImage(marioImg);
	mario.scale = 0.5;
	mario.setDefaultCollider();

	cliff = createSprite(320, 3*height/4);
	//cliffImg = loadImage('https://i.postimg.cc/Gm4XwRN0/square.png');
	cliffImg = loadImage('https://i.postimg.cc/nVY7dLHR/pipe.png');
	cliff.addImage(cliffImg);
	cliff.scale = (.5);
	cliff.setCollider('rectangle',0,0,200,200);

	ground = createSprite(500, 480, 100,20);
	groundImg = loadImage('https://i.postimg.cc/QC1C2F34/811d7245e16a624e06a9be7b1e4bd18c.png');
	ground.addImage(groundImg);
	ground.scale = (2.4);

	sky = createSprite(370,10,10,10);
	skyImg = loadImage('https://i.postimg.cc/rm6vhj8r/a91aecff-e4dd-4d30-b2f6-d53f5ca22e79-570.jpg');
	sky.addImage(skyImg);
	sky.scale = (1.5);

	coronaImg = loadImage('https://i.postimg.cc/Cx26z5DL/corona.png');
	virus = createSprite(1050, 310, 20, 20);
	virus.setCollider('circle',0,0,20,20);
	virus.addImage(coronaImg);
	virus.scale = 0.07;

	flagImg = loadImage('https://i.postimg.cc/T1fn9WHL/flag.png');
	flag = createSprite(850, 200, 20, 20)
	flag.setCollider('rectangle',0,0,100,100);
	flag.addImage(flagImg);
	flag.scale = 0.4;

	youwinImg = loadImage('https://i.postimg.cc/D0Z9p5ZR/youwin.jpg');
	youwin = createSprite(500,200,20,20);
	youwin.addImage(youwinImg);
	youwin.scale = 1;

	gameOver = true;
	updateSprites(true);

	//updateSprites(false);

}

function draw() {
	if (gameOver && (keyWentDown('w')||keyWentDown(38))){
		newGame();
	}
	else if(!gameOver){
		if((keyWentDown('w')|| keyWentDown(38)) && reset == true){
			jump(mario);
			reset = false;
			setTimeout(function(){reset = true;}, 3000);
		}




		mario.velocity.y += GRAVITY;

		mario.velocity.x = 1;

		if(frameCount%150 == 0 && mario.position.x > 300 && mario.position.x <760 && inframe == false) {
			//console.log('inframe');
				//var virus = random(2,4);

				inframe = true;
		}

		if (virus.position.x < 320  ){
			let newpos = random(280,330);
			virus.position.x = 1050;
			virus.position.y = newpos;
			inframe = false;
		}



		if(inframe == true && mario.position.x < 650){
			virus.velocity.x = -1.5;
		}
		else {
			// virus.position.x = 320;
			// virus.velocity.x = 0;
		}
		if(mario.position.y<0)
					mario.position.y = 0;
				else if(mario.position.y>300)
					mario.position.y = 300;

		if (mario.overlap(virus)){
			console.log('overlap');
			die();
		}

		if (mario.position.x > 850){
			winner();
			die();
		}

	}
	else {
		mario.position.x = 60;
		mario.position.y = 3*height/4;
		mario.velocity.x = 0;
	}

	clear();
	background('rgba(94, 177, 247,1)');
	let c = (mario.collide(cliff));

	drawSprite(sky);
	drawSprite(virus);
	drawSprite(mario);
	drawSprite(cliff);
	drawSprite(flag);
	drawSprite(ground);

	if (win == true){
		drawSprite(youwin);
	}

}


//Game Functions
// function log() {
// 	console.log('intersect');
// }
function jump(player){
//	serial.write('j');
	player.velocity.y = -10;
	player.velocity.x = 20;
}
function moveforward(player){
	player.velocity.x = 8;
}
function movebackward(player){
	player.velocity.x = -8;
}

function newGame() {
//	serial.write('n');
	gameOver = false;
	mario.position.x = 60;
	mario.position.y = 3*height/4;
}
function die() {
//	serial.write('d');
	//updateSprites(false);
	gameOver = true;
}

function winner() {
//	serial.write('w');
	win = true;
	setTimeout(() => {  win = false; }, 2000);
}

//Video Functions
function classifyVideo() {
		flippedVideo = ml5.flipImage(video)
		classifier.classify(flippedVideo, gotResult);
		flippedVideo.remove();
 }

//	// When we get a result
//	function gotResult(error, results) {
//		// If there is an error
//		if (error) {
//			console.error(error);
//			return;
//		}
//		// The results are in an array ordered by confidence.
//		// console.log(results[0]);
//		label = results[0].label;
//		// Classifiy again!
//		classifyVideo();
//	}


//Serial Functions
function printList(portList){
	console.log(portList);
	console.log(portList.find(correctPort));

}

function correctPort(val){
	if (val.includes('usbserial')){
		return(val);
	}
}

function serverConnected() {
	console.log('connected to server.')
}

function portOpen() {
	console.log('serialport opened');
}

function serialEvent() {
	console.log('serial: ');
//	inData = Number(serial.read());
	//inData = serial.readStringUntil('\r\n');
	console.log(String.fromCharCode(int(inData)));
}

function serialError(err) {
	console.log('Error: '+ err);
}

function portClose() {
	console.log('serial port closed');
}
function keyPressed(){
	serial.write('9');
}

