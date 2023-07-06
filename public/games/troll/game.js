// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var screenXLength = w.innerWidth;
var screenYLength = w.innerHeight;
var xscale = 0;
var yscale = 0;
// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");


var border = 126;


canvas.width = window.innerWidth;
canvas.height = window.innerHeight - border;

xscale = screenXLength / window.innerWidth
yscale = screenYLength / window.innerHeight
console.log(screenYLength / window.innerHeight);

ctx.scale(xscale, yscale)
document.body.appendChild(canvas);

var filePath = "public/games/troll/Images/";

var touchPos = {};
var keysDown = {};
var amountoftiles = 0;
var numberToColour = {};
var tilesready = false;
// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = filePath + "background.png";
// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = filePath +"hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = filePath +"Bluemonster.png";

// healthy image
var healthyReady = false;
var healthyImage = new Image();
healthyImage.onload = function () {
	healthyReady = true;
};
healthyImage.src = filePath +"Health.png";

// Strong Monster image
var SmonsterReady = false;
var SmonsterImage = new Image();
SmonsterImage.onload = function () {
	SmonsterReady = true;
};
SmonsterImage.src = filePath + "Strongmonster.png";

// Heart Powerup image
var heartPowerupReady = false;
var heartPowerupImage = new Image();
heartPowerupImage.onload = function () {
	heartPowerupReady = true;
};
heartPowerupImage.src = filePath + "healthypowerup.png";

// Magnet Powerup image
var magnetPowerupReady = false;
var magnetPowerupImage = new Image();
magnetPowerupImage.onload = function () {
	magnetPowerupReady = true;
};
magnetPowerupImage.src = filePath +"Magnet.png";

// Grass Tile Images
var tile1Ready = false;
var tile1Image = new Image();
tile1Image.onload = function () {

	tile1Ready = true;
};
tile1Image.src = filePath +"Tiles/grass.png";
amountoftiles += 1;
numberToColour[amountoftiles] = tile1Image;
// Tree Tile Images
var tile2Ready = false;
var tile2Image = new Image();
tile2Image.onload = function () {

	tile2Ready = true;
};
tile2Image.src = filePath +"Tiles/tree.png";
amountoftiles += 1;
numberToColour[amountoftiles] = tile2Image;

// Bush/Berries Tile Images
var tile3Ready = false;
var tile3Image = new Image();
tile3Image.onload = function () {

	tile3Ready = true;
};
tile3Image.src = filePath +"Tiles/bush.png";
amountoftiles += 1;
numberToColour[amountoftiles] = tile3Image;

//log Tile Images
var tile4Ready = false;
var tile4Image = new Image();
tile4Image.onload = function () {

	tile4Ready = true;
};
tile4Image.src = filePath +"Tiles/logs.png";
amountoftiles += 1;
numberToColour[amountoftiles] = tile4Image;

/*
//castle Tile Images
var tile5Ready = false;
var tile5Image = new Image();
tile5Image.onload = function () {

	tile5Ready = true;
};
tile5Image.src = "Images/Tiles/castle.png";
amountoftiles += 1;
numberToColour[amountoftiles] = tile5Image;*/




// global variable
var deadready = false;
var leaderstats = 0;
var alreadycalleddead = false;
var monstersCaught = 0;
var level = 0;
var lastscore = 0;
var speedy = 1; // max of 50 for no gamebreaks
var dificulty = 1;
var MoblieX, MobileY;
var modifier; // difficulty modifier based on length of game (time)
var MoblieEventType;
var BadEyes = localStorage.getItem("BadEyes");
var timeToHeal = 10000;// 10 seconds
var beforeHealTime = 10000;
var chanceOfPowerup = 0.01;
var timeForMagnet = 200;
var godMode = false;

var map = [];
var mapsize = 320 // 10x a noraml image; // in pixels

var frame = 0; //the current frame
var magnetMode = false;
var magnetModeStart = 0;


if (localStorage.getItem("leaderstat")) {
	leaderstats = localStorage.getItem("leaderstat")
}
// Game objects
var hero = {
	healthy: 5,
	speedy: 256 * (speedy + .5),
	x: 0,
	y: 0
};
var healthy = {
	x: 0,
	y: 0,
	show: false
};
var monsterGroup = {
	amount: 1,
	m1: {
		damage: 0,
		x: 0,
		y: 0
	}
};

var healthyGroup = {
	amount: 1,
	p1: {
		type: "healthy",
		x: 0,
		y: 0,
		frameSpawned: 0
	}
};
var MagnetGroup = {
	amount: 1,
	m1: {
		x: 0,
		y: 0,
		frameSpawned: 0
	}
};

var strongGroup = {
	amount: 1,
	s1: {
		damage: 1,
		x: 0,
		y: 0
	}
};

// Handle keyboard controls
addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

addEventListener('resize', function (e) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}, false);


// touch
addEventListener("touchstart", handleTouch, false);
addEventListener("touchend", handleTouch, false);
addEventListener("touchcancel", handleTouch, false);
addEventListener("touchmove", handleTouch, false);
// mouse
addEventListener("mousemove", handleTouch, false);
addEventListener("mouseover", handleTouch, false);
addEventListener("mouseout", handleTouch, false);
addEventListener("mouseenter", handleTouch, false);
addEventListener("mouseleave", handleTouch, false);

//addEventListener("mousemove", handleTouch, false);

function handleTouch(e) {
	//e.preventDefault();

	var x;
	var y;

	if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
		var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
		var touch = evt.touches[0] || evt.changedTouches[0];
		x = touch.pageX;
		y = touch.pageY;

		MoblieEventType = e.type




	} else if (e.type == 'mousemove' || e.type == 'mouseover' || e.type == 'mouseout' || e.type == 'mouseenter' || e.type == 'mouseleave') {
		x = e.clientX;
		y = e.clientY;

		MoblieEventType = e.type


	}
	MoblieX = x;
	MoblieY = y;


	// Adjust touch to take into account canvas offset.


	// find diffrence//

	// got of internet


}

function setX(x) {
	if (x) {
		hero.x = x
	}
}

function setY(y) {
	if (y) {
		hero.y = y
	}
}

function setPos(x, y) {
	setX(x)
	setY(y)
}

function MovePlayer(XD, YD) {
	var targetX = XD
	var targetY = YD
	XD = Math.round(XD) - 16
	YD = Math.round(YD) - 16
	var rect = canvas.getBoundingClientRect();
	var targetX = XD - rect.left;
	var targetY = YD - rect.top;
	XD = targetX - hero.x;
	YD = targetY - hero.y;
	var length = Math.hypot(XD, YD);

	if (Math.abs(XD) < 8 && Math.abs(YD) < 8) {
		return;
	}

	XD /= length;
	YD /= length;

	// moving the hero//
	if (hero.x <= targetX - (speedy + 3) || hero.x >= targetX + (speedy + 3) || hero.y <= targetY - (speedy + 3) || hero.y >= targetY + (speedy + 3)) {
		setPos(hero.x + Math.round(XD * hero.speedy * modifier), hero.y + Math.round(YD * hero.speedy * modifier))
	} else {
		setPos(hero.x + Math.round(XD * modifier), hero.y + Math.round(YD * modifier))
	}

	setPos(constrain(hero.x, 1, canvas.width - 32), constrain(hero.y, 1, canvas.height - 32))
}

function constrain(val, min, max) {
	return Math.max(Math.min(val, max), min)
}

function playerAi(modifier) {

	if (MoblieEventType != "touchstart" && MoblieEventType != "mousemove" && MoblieEventType != "touchmove" && MoblieEventType != "mouseenter" || 38 in keysDown || 87 in keysDown || 40 in keysDown || 83 in keysDown || 37 in keysDown || 65 in keysDown || 39 in keysDown || 68 in keysDown) {

		if (38 in keysDown || 87 in keysDown) { // Player holding up
			if (hero.y >= 0) {
				setY(hero.y - hero.speedy * modifier);
			}

		}
		if (40 in keysDown || 83 in keysDown) { // Player holding down
			if (hero.y <= canvas.height - 32) {
				setY(hero.y + hero.speedy * modifier);
			}

		}
		if (37 in keysDown || 65 in keysDown) { // Player holding left
			if (hero.x >= 0) {
				setX(hero.x - hero.speedy * modifier);
			}

		}
		if (39 in keysDown || 68 in keysDown) { // Player holding right
			if (hero.x <= canvas.width - 32) {
				setX(hero.x + hero.speedy * modifier);
			}

		}

	} else {


		MovePlayer(MoblieX, MoblieY)

	}
}


function monsterAi(monster) {

	if (Math.hypot(monster.x - monster.RandX, monster.y - monster.RandY) < 32) {
		monster.RandX = null
		monster.RandY = null
	}

	if (!monster.RandX) {
		monster.RandX = (Math.random() * (canvas.width - 64)) + 32
	}

	if (!monster.RandY) {
		monster.RandY = (Math.random() * (canvas.height - 64)) + 32
	}



	// players postion//
	var RandX = monster.RandX
	var RandY = monster.RandY
	// find diffrence//
	var XD = RandX - monster.x;
	var YD = RandY - monster.y;

	// if the hero is to close
	if (Math.hypot(monster.x - hero.x, monster.y - hero.y) < 150) {

		XD = (hero.x - monster.x) * -1
		YD = (hero.y - monster.y) * -1

	}

	if (godMode || magnetMode) {
		XD = (hero.x - monster.x)
		YD = (hero.y - monster.y)
	}
	// got of internet
	var length = Math.hypot(XD, YD);
	XD /= length;
	YD /= length;


	// moving the monster//
	monster.x += XD * speedy;
	monster.y += YD * speedy;

	monster.x = constrain(monster.x, 32, canvas.width - 32)
	monster.y = constrain(monster.y, 32, canvas.height - 32)
	// monster Hit!
	if (
		hero.x <= (monster.x + 32) &&
		monster.x <= (hero.x + 32) &&
		hero.y <= (monster.y + 32) &&
		monster.y <= (hero.y + 32)
	) {

		AddObject("Monster", 0, 0);

		++monstersCaught;
		level += 0.1

		if (Math.random() < chanceOfPowerup) {
			if (Math.random() > 0.5) {
				AddObject('healthy Power Up', monster.x, monster.y);
				console.log('Added healthy power up');
			} else {
				AddObject('Magnet Power Up', monster.x, monster.y);
				console.log('Added magent power up');
			}


		}

		reset(monster);
	}

}


// ai for the damaging monsters
function attackAi(StrongMonster) {
	var playerX = hero.x
	var playerY = hero.y;

	// find diffrence//
	var XD = playerX - StrongMonster.x;
	var YD = playerY - StrongMonster.y;
	// got of internet

	var length = Math.sqrt(YD * YD + XD * XD);

	XD /= length;
	YD /= length;

	// moving the monster//
	StrongMonster.x += XD * speedy;
	StrongMonster.y += YD * speedy;


	/// Attacker Hit!
	if (
		hero.x <= (StrongMonster.x + 32) &&
		StrongMonster.x <= (hero.x + 32) &&
		hero.y <= (StrongMonster.y + 32) &&
		StrongMonster.y <= (hero.y + 32)
	) {
		hero.healthy -= StrongMonster.damage
		healthy.show = true
		reset(StrongMonster)
	}


}

// Reset the game when the player catches a monster
function reset(monster) {
	console.log("resetting monster");
	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
}

// Update game objects
function update(modifier) {

	if (timeToHeal != beforeHealTime) {
		clearInterval(timer);
		beforeHealTime = timeToHeal;
		timer = setInterval(counter, timeToHeal);

	}
	if (deadready == false) {
		if (dificulty <= level && godMode == false) {

			AddDifficulty();
		}
		// getting the healthy icon to follow
		healthy.x = hero.x - 20
		healthy.y = hero.y - 20
		// when they die
		if (hero.healthy <= 0) {
			dead()
			hero.healthy = 5
		}
		playerAi(modifier)
		var number;

		for (number = 1; number <= monsterGroup.amount; number++) {
			monsterAi(monsterGroup["m" + number]);
		}

		var number;
		for (number = 1; number <= strongGroup.amount; number++) {
			attackAi(strongGroup["s" + number]);
		}

		//Check power up 
		var number;
		for (number = 1; number <= healthyGroup.amount; number++) {
			healthyCheck(healthyGroup["p" + number], number);
		}

		//Check power up 
		var number;
		for (number = 1; number <= MagnetGroup.amount; number++) {
			magnetCheck(MagnetGroup["m" + number], number);
		}


	}
	if (tile1Ready) {

		tilesready = true
	}
}

function healthyCheck(powerup, number) {
	if (powerup.frameSpawned + 20 < frame) {


		if (
			hero.x <= (powerup.x + 32) &&
			powerup.x <= (hero.x + 32) &&
			hero.y <= (powerup.y + 32) &&
			powerup.y <= (hero.y + 32)
		) {
			hero.healthy += 1
			console.log("Added healthy to player");
			console.log("With frame of " + powerup.frameSpawned + " : " + frame)
			console.log("With a position of " + hero.x + " : " + hero.y +
				" and " + powerup.x + " : " + powerup.y)
			TakeObject("healthy power up", number)

		}
	}
}

function magnetCheck(powerup, number) {
	if (magnetModeStart + timeForMagnet < frame) {
		magnetMode = false;
	}
	if (powerup.frameSpawned + 20 < frame) {


		if (
			hero.x <= (powerup.x + 32) &&
			powerup.x <= (hero.x + 32) &&
			hero.y <= (powerup.y + 32) &&
			powerup.y <= (hero.y + 32)
		) {
			magnetMode = true;
			magnetModeStart = frame;
			console.log("Added magnet");
			console.log("With frame of " + powerup.frameSpawned + " : " + frame)
			console.log("With a position of " + hero.x + " : " + hero.y +
				" and " + powerup.x + " : " + powerup.y)
			TakeObject("Magnet Power Up", number)

		}
	}
}




// Draw everything
function render() {
	if (tilesready) {
		// background gets drawn
		var widthNumber = Math.ceil(canvas.width / 32)
		var heightNumber = Math.ceil(canvas.height / 32)

		for (width = 0; width <= widthNumber; width++) {



			for (height = 0; height <= heightNumber; height++) {

				todraw = map[width];
				todraw = todraw[height];

				ctx.drawImage(todraw, width * 32, height * 32);
			}
		}



	}

	if (heroReady) { // hero gets drawn
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) { // monster gets drawn
		var number;

		for (number = 1; number <= monsterGroup.amount; number++) {
			var monsterx = monsterGroup["m" + number].x;
			var monstery = monsterGroup["m" + number].y;

			ctx.drawImage(monsterImage, monsterx, monstery);
		}
	}
	if (SmonsterReady) { // monster gets drawn
		var number;

		for (number = 1; number <= strongGroup.amount; number++) {
			var monsterx = strongGroup["s" + number].x;
			var monstery = strongGroup["s" + number].y;

			ctx.drawImage(SmonsterImage, monsterx, monstery);
		}
	}
	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = (canvas.height / 150 + 24) + "px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	var i = 0
	ctx.fillText("Monsters Caught: " + monstersCaught, 0, i)
	i += (canvas.height / 150 + 32)
	ctx.fillText("High Score: " + leaderstats, 0, i)
	i += (canvas.height / 150 + 32)
	ctx.fillText("Last Score: " + lastscore, 0, i)

	// healthy icon
	if (healthy.show == true && healthyReady == true && hero.healthy >= 1 && hero.healthy < 5) {
		ctx.drawImage(healthyImage, healthy.x, healthy.y);
		if (hero.healthy >= 2) {
			ctx.drawImage(healthyImage, healthy.x + 10, healthy.y);
		}
		if (hero.healthy >= 3) {
			ctx.drawImage(healthyImage, healthy.x + 20, healthy.y);
		}
		if (hero.healthy >= 4) {
			ctx.drawImage(healthyImage, healthy.x + 30, healthy.y);
		}
		if (hero.healthy >= 5) {
			ctx.drawImage(healthyImage, healthy.x + 40, healthy.y);
		}
	}

	if (heartPowerupReady) {
		var number;
		for (number = 1; number <= healthyGroup.amount; number++) {
			var powerUpX = healthyGroup["p" + number].x;
			var powerUpy = healthyGroup["p" + number].y;

			ctx.drawImage(heartPowerupImage, powerUpX, powerUpy);
		}
	}

	if (magnetPowerupReady) {
		var number;
		for (number = 1; number <= MagnetGroup.amount; number++) {
			var powerUpX = MagnetGroup["m" + number].x;
			var powerUpy = MagnetGroup["m" + number].y;

			ctx.drawImage(magnetPowerupImage, powerUpX, powerUpy);
		}
	}


	// dead screen
	if (deadready) {
		ctx.fillStyle = "rgb(250, 0, 0)";
		ctx.font = "100px Helvetica";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText("You Died! ", 0, 32);
	}
}
// Dead Function
function dead() {
	//console.log('dead called')
	deadready = true;
	speedy = 1;
	dificulty = 1;
	level = 0
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;
	if (monstersCaught > leaderstats) {
		localStorage.setItem("leaderstat", monstersCaught);
		leaderstats = localStorage.getItem("leaderstat");

	}
	lastscore = monstersCaught;
	monstersCaught = 0
	// starting the game again


	level = 0.1;
	monsterGroup = {
		amount: 1,
		m1: {
			damage: 0,
			x: 0,
			y: 0
		}
	};

	strongGroup = {
		amount: 1,
		s1: {
			damage: 1,
			x: 0,
			y: 0
		}
	};

	setTimeout(() => {
		deadready = false;
		alreadycalleddead = false;
	}, 2000);
}

// The main game loop
function main() {
	var now = Date.now();
	var delta = now - then;
	modifier = delta / 1000
	update(modifier);
	render();
	frame++;
	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
}


function AddObject(object, spawnX = 0, spawnY = 0) {

	if (object == "Strong") { // adding a strong monster
		var x = Math.floor(Math.random() * 2);
		var y = Math.floor(Math.random() * 2);
		if (x == 1) {
			x = canvas.width
		} else if (x == 2) {
			x = -10
		}

		if (y == 1) {
			y = canvas.height
		} else if (y == 2) {
			y = -10
		}
		strongGroup.amount += 1;
		var number = strongGroup.amount;
		strongGroup["s" + number] = {
			x: x,
			y: y,
			damage: 1
		}
	} else if (object == "Monster") { // adding a running away monster
		monsterGroup.amount += 1;
		var number = monsterGroup.amount;
		monsterGroup["m" + number] = {
			x: 32 + (Math.random() * (canvas.width - 64)),
			y: 32 + (Math.random() * (canvas.width - 64))
		}
	} else if (object == "healthy Power Up") {
		healthyGroup.amount += 1;
		var number = healthyGroup.amount;
		healthyGroup["p" + number] = {
			type: "healthy",
			x: spawnX,
			y: spawnY,
			frameSpawned: frame
		}

	}
	else if (object == "Magnet Power Up") {
		MagnetGroup.amount += 1;
		var number = MagnetGroup.amount;
		MagnetGroup["m" + number] = {
			x: spawnX,
			y: spawnY,
			frameSpawned: frame
		}

	}

}


function TakeObject(object, number) { // taking away objects
	if (object == "Strong") {
		strongGroup["s" + number] = {}
	} else if (object == "Monster") {
		monsterGroup["m" + number] = {}
	}
	else if (object == "healthy power up") {
		healthyGroup["p" + number] = {};
	}
	else if (object == "Magnet Power Up") {
		MagnetGroup["m" + number] = {};
	}

}

function AddDifficulty() {
	dificulty += 1;
	var todo = Math.floor(Math.random() * 3);

	if (todo == 0) {
		AddObject("Strong");
	} else if (todo == 1) {
		speedy += 0.5;
	}
	else {
		timeToHeal += 1000;
	}
}


function generateMap() {
	var i;
	var a;

	for (i = 0; i < mapsize / 2; i++) {
		var widthlist = [];
		for (a = 0; a < mapsize / 2; a++) {


			widthlist[a] = numberToColour[(Math.floor(Math.random() * amountoftiles) + 1)];


		}



		map[i] = widthlist;
	}

}

function GodMode(password) {
	if (password == "PaSsWoRd") {
		hero.healthy = 999999999;
		strongGroup = {};
		godMode = true;
	}

}
function BADEYES() {
	localStorage.setItem("BadEyes", true);
	BadEyes = true
	monsterImage.src = "Images/ClickMe.png";
	dead()
}
// examples to use

// for statement

// var i;
//for (i = 0; i < cars.length; i++) {
//  text += cars[i] + "<br>";
//}
var count = 10; // how many seconds the game lasts for - default 30

var counter = function () {
	console.log("timer called")

	if (hero.healthy < 5) {
		hero.healthy += 1;
		console.log("Added healthy");
	}

}
// timer interval is every second (1000ms)
var timer = setInterval(counter, timeToHeal);

// notes for next time
//use canvas width and height for border radias

generateMap()
render()
console.log(BadEyes);
if (BadEyes == true || BadEyes == "true") {
	BADEYES();
}
then = Date.now()
main()
AddObject("Strong")
AddObject("Monster")
