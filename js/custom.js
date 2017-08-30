var cardArr = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
var maxNum = 8;
var len = 4;

function setCardArr(h, w, cardNum) {
	//if (h >= 1 && h <= 4) && (w >= 1 && w <= 4) {
		cardArr[h - 1][w - 1] = cardNum;
	//}
}

function getCardArr(h, w) {
	return cardArr[h - 1][w - 1];
}

function randomizeCardArr() {
	var assignedArr = [0, 0, 0, 0, 0, 0, 0, 0];
	var x;
	
	for (var h = 1; h <= len; h++) {
		for (var w = 1; w <= len; w++) {
			while (getCardArr(h, w) == 0) {
				x = Math.floor((Math.random() * maxNum) + 1); // 1 to maxNum
				if (assignedArr[x - 1] < 2) {
					setCardArr(h, w, x);
					assignedArr[x - 1]++;
				}
			}
		}
	}
}

var stage, canvas;
var img, prevImg;
var loader;
var update = true;
var flipped = false, flippable = true;
var flips = 0, matches = 0, prevCardNum = 0;

function init() {	
	canvas = document.getElementById("game-canvas");     
	stage = new createjs.Stage(canvas);

	var manifest = [
		{id:"front", src:"images/front.jpg"},
		{id:"card1", src:"images/card1.jpg"},
		{id:"card2", src:"images/card2.jpg"},
		{id:"card3", src:"images/card3.jpg"},
		{id:"card4", src:"images/card4.jpg"},
		{id:"card5", src:"images/card5.jpg"},
		{id:"card6", src:"images/card6.jpg"},
		{id:"card7", src:"images/card7.jpg"},
		{id:"card8", src:"images/card8.jpg"},
		{id:"bg", src:"images/bg4.jpg"}
	];

	loader = new createjs.LoadQueue(false);
	loader.on("complete", setImages, this);
	loader.loadManifest(manifest);
}

function setImages() {
	var path;
	var tempX, tempY, tempScaleX;
	var cardNum = 0;
	
	setTimeout(function() {
		$("#game-screen").show(0);
		$("#game-screen").fadeTo(300, 1, function() {
			$("#loading-screen").hide(0);
		});
	}, 600);
	
	randomizeCardArr();
	//console.log(cardArr);
		
	for (var h = 1; h <= len; h++) {
		for (var w = 1; w <= len; w++) {
			path = loader.getResult("front").src;
			img = new createjs.Bitmap(path);
			
			stage.addChild(img);
			img.x = (w - 1) * 190;
			img.y = (h - 1) * 190;
			//img.scaleX = img.scaleY = img.scale = 1.267;
			img.scaleX = img.scaleY = img.scale = 1;
			img.name = "bmp_" + h + "_" + w;
			img.id = 0;
			//img.cache(0, 0, 190, 190);
			
			img.on("mouseover", function (event) {
				this.cursor = "pointer";
			});
			
			img.on("click", function (event) {				
				if (this.id == 0 && flippable == true) {
					this.id = 1;
					tempX = this.x;
					tempScaleX = this.scaleX;
					var curImg = this;
					
					var strArr = this.name.split("_");
					cardNum = getCardArr(strArr[1], strArr[2]);
					path = loader.getResult("card" + cardNum.toString()).src;
					var imgFlip = new createjs.Bitmap(path);
					
					/*var box = new createjs.Shape();
					box.graphics.beginLinearGradientFill(["rgba(0, 0, 0, 0)", "#000"], [0, 1], 0, 95, 190, 95);
					box.graphics.drawRect(0, 0, 190, 190);
					box.cache(0, 0, 190, 190);
					var shadow = new createjs.AlphaMaskFilter(box.cacheCanvas);
					
					var boxReverse = new createjs.Shape();
					boxReverse.graphics.beginLinearGradientFill(["rgba(0, 0, 0, 0)", "#000"], [1, 0], 0, 95, 190, 95);
					boxReverse.graphics.drawRect(0, 0, 190, 190);
					boxReverse.cache(0, 0, 190, 190);
					var shadowReverse = new createjs.AlphaMaskFilter(boxReverse.cacheCanvas);*/
					
					createjs.Tween.get(this, {loop: false})
						.to({x: tempX + 95, regY: 3, skewY: 15, scaleX: 0}, 150, createjs.Ease.getPowInOut(8))
						.to({x: tempX + 95, regY: -3, skewY: -15, scaleX: 0, image: imgFlip.image}, 0)
						.to({x: tempX, regY: 0, skewY: 0, scaleX: tempScaleX}, 150, createjs.Ease.getPowInOut(2));
					
					if (flipped == true) {
						flippable = false;
						setTimeout(function() {
							flipped = false;
							flips++;
							
							if (cardNum == prevCardNum) {
								matches++;
								
								tempX = curImg.x;
								tempY = curImg.y;
								createjs.Tween.get(curImg, {loop: false})
									.to({x: tempX + 95, y: tempY + 95, scaleX: 0, scaleY: 0}, 300, createjs.Ease.getPowInOut(2));
								
								tempX = prevImg.x;
								tempY = prevImg.y;								
								createjs.Tween.get(prevImg, {loop: false})
									.to({x: tempX + 95, y: tempY + 95, scaleX: 0, scaleY: 0}, 300, createjs.Ease.getPowInOut(2));
								
								if (matches >= 8) {
									$("#game-canvas").fadeTo(300, 0, function() {
										$("#game-canvas").hide(0);
										$("#game-over h2").text("You completed the game in " + flips.toString() + " attempts.");
										$("#game-over").show(0);
										$("#game-over").fadeTo(300, 1, function() {
											
										});
									});
								}
							} else {
								path = loader.getResult("front").src;
								img = new createjs.Bitmap(path);
			
								curImg.id = 0;
								tempX = curImg.x;
								tempScaleX = curImg.scaleX;
								createjs.Tween.get(curImg, {loop: false})
									.to({x: tempX + 95, regY: 3, skewY: 15, scaleX: 0}, 150, createjs.Ease.getPowInOut(8))
									.to({x: tempX + 95, regY: -3, skewY: -15, scaleX: 0, image: img.image}, 0)
									.to({x: tempX, regY: 0, skewY: 0, scaleX: tempScaleX}, 150, createjs.Ease.getPowInOut(2));
								
								prevImg.id = 0;
								tempX = prevImg.x;
								tempScaleX = prevImg.scaleX;						
								createjs.Tween.get(prevImg, {loop: false})
									.to({x: tempX + 95, regY: 3, skewY: 15, scaleX: 0}, 150, createjs.Ease.getPowInOut(8))
									.to({x: tempX + 95, regY: -3, skewY: -15, scaleX: 0, image: img.image}, 0)
									.to({x: tempX, regY: 0, skewY: 0, scaleX: tempScaleX}, 150, createjs.Ease.getPowInOut(2));
							}
							
							flippable = true;
						}, 900);
					} else {
						flipped = true;
						prevImg = this;
						prevCardNum = cardNum;
					}
					
					//flips++;
				}
			});
		}
	} 
	
	stage.enableMouseOver(10);
	
	createjs.Ticker.setFPS(30);
	createjs.Ticker.addEventListener("tick", tick);
}

function tick(event) {
	stage.update(event);
	//img.updateCache();
}
