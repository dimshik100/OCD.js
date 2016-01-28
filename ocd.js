/*jslint sloppy: true*/

var debug = true;

var utils = {
	randomIntFromInterval: function (min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	},
	getRandomColor: function () {
		var letters = '0123456789ABCDEF'.split(''),
			color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	},
	getLogStyle: function () {
		var logStyle = 'text-decoration:underline; font-weight:bold; color:white; background:' + this.getRandomColor() + '; font-size:' + this.randomIntFromInterval(15, 30) + 'px;'

		return logStyle;
	},
	log: debug ? console.log.bind(window.console) : function () {}
}


function tiltHeading(tag, deg) {
	var allHeadings = document.getElementsByTagName(tag),
		index = 0,
		selectedHeading;

	if (allHeadings.length > 1) {
		index = utils.randomIntFromInterval(0, allHeadings.length - 1);
		selectedHeading = allHeadings[index];
	} else if (allHeadings.length === 1) {
		selectedHeading = allHeadings[index];
	}

	selectedHeading.style.transform = "rotate(" + deg + "deg)";

	logString = 'rotated: ' + deg + ' degrees';

	utils.log('%cOCD.js:', utils.getLogStyle(), selectedHeading, logString);
}


tiltHeading("h2", 4);
