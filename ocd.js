/*jslint sloppy: true*/
/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
;
(function ($, window, document, undefined) {

	// undefined is used here as the undefined global
	// variable in ECMAScript 3 and is mutable (i.e. it can
	// be changed by someone else). undefined isn't really
	// being passed in so we can ensure that its value is
	// truly undefined. In ES5, undefined can no longer be
	// modified.

	// window and document are passed through as local
	// variables rather than as globals, because this (slightly)
	// quickens the resolution process and can be more
	// efficiently minified (especially when both are
	// regularly referenced in your plugin).

	// Create the defaults once
	var pluginName = "ocd",
		defaults = {
			ocdLvl: 5, // The value of OCD the page will get [0..12]
			debug: false,

			letterFontSizeTolerance: 10,
			numberOfLettersToChangeSize: 10,
			numberOfLettersToFlip: 10,

			logStyleFontSizeMin: 15,
			logStyleFontSizeMax: 30,
		};

	// The actual plugin constructor
	function Plugin(element, options) {
		this.element = element;

		// jQuery has an extend method that merges the
		// contents of two or more objects, storing the
		// result in the first object. The first object
		// is generally empty because we don't want to alter
		// the default options for future instances of the plugin
		this.options = $.extend({}, defaults, options);

		this._defaults = defaults;
		this._name = pluginName;

		this.init();


		// returns the plugin object
		return this;
	}

	/*Private Functions region*/

	var utils = {
		randomIntBetween: function (min, max) {
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
			var logStyle = 'text-decoration:underline; font-weight:bold; color:white; background:' + this.getRandomColor() + '; font-size:' + this.randomIntBetween(defaults.logStyleFontSizeMin, defaults.logStyleFontSizeMax) + 'px;'

			return logStyle;
		},
		getFontSize: function (element) {
			var style = window.getComputedStyle(element, null).getPropertyValue('font-size');
			var fontSize = parseFloat(style);
			return fontSize;
		},
		//log: this.options.debug ? console.log.bind(window.console) : function () {}
		log: undefined,
		zeroPad: function (n, digits, padChar) {
			// n = number you want padded
			// digits = length you want the final output
			n = n.toString();
			while (n.length < digits) {
				n = padChar + n;
			}
			return n;
		}
	}

	function loadScript(path, callback, params) {
		$.getScript(path, function (data, textStatus, jqxhr) {
			//utils.log(data); // Data returned
			utils.log(textStatus); // Success
			utils.log(jqxhr.status); // 200
			utils.log(path + " Load was performed.");

			if (jqxhr.status === 200) {
				callback(params);
			}
		});
		//$.getScript("../externals/blast/jquery.blast.min.js");
	}

	/*endregion Private Functions*/

	/*Public Functions region */

	Plugin.prototype = {

		init: function () {
			// Place initialization logic here
			// You already have access to the DOM element and
			// the options via the instance, e.g. this.element
			// and this.options
			// you can add more functions like the one below and
			// call them like so: this.yourOtherFunction(this.element, this.options).
			//this.yourOtherFunction(this.element, this.options);

			// init logger
			utils.log = this.options.debug ? console.log.bind(window.console) : function () {}

			function fireBlastLoadedEvent() {
				// Create the event.
				var event = document.createEvent('Event');

				// Define that the event name is 'build'.
				event.initEvent('blastLoaded', true, true);

				var elem = document;

				// Dispatch the event.
				elem.dispatchEvent(event);
			}

			//TODO: change the call from "this.blast" to fire a custom event "blastLoaded", and on event call blast with params
			loadScript("../externals/blast/jquery.blast.min.js", fireBlastLoadedEvent);

			var self = this;

			document.addEventListener('blastLoaded', function () {
				var params = {
					selector: 'div',
					delimiter: "letter"
				};
				self.blast(params);
			});

			this.tiltHeading("h2", 4);



			//this.countCharacterOccurrences();
		},



		blast: function (params) {

			//TODO: change $selector from body to a generated random list of text elements (according to ocd.lvl)
			var $selector = $('body');

			$selector.blast({
				delimiter: params.delimiter
			});

			this.changeLettersSizes(this._defaults.numberOfLettersToChangeSize);

			this.flipLetters(this._defaults.numberOfLettersToFlip);

		},

		changeLettersSizes(numberOfLetters) {

			var $letters = $('.blast'),
				$letter;

			for (var i = 0; i < numberOfLetters; i++) {

				// get random letter from all letters
				$letter = $letters.eq(utils.randomIntBetween(0, $letters.length));

				this.changeLetterSize($letter, this._defaults.letterFontSizeTolerance);
			}
		},

		changeLetterSize: function ($letter, sizeTolerance) {
			var realFontSize,
				newFontSize;

			realFontSize = utils.getFontSize($letter[0]);

			newFontSize = utils.randomIntBetween(realFontSize - sizeTolerance, realFontSize + sizeTolerance);

			$letter.css({
				"font-size": newFontSize
			});

			logString = 'changed letter font-size From: ' + realFontSize + 'px To: ' + newFontSize + 'px';

			utils.log('%cOCD.js:', utils.getLogStyle(), $letter[0], logString);
		},

		flipLetters(numberOfLetters) {

			var $letters = $('.blast'),
				$letter;

			for (var i = 0; i < numberOfLetters; i++) {

				// get random letter from all letters
				$letter = $letters.eq(utils.randomIntBetween(0, $letters.length));

				// randomize the flip direction
				if (utils.randomIntBetween(0, 1) == 0) {
					this.flipLetterX($letter);
				} else {
					this.flipLetterY($letter);
				}
			}
		},

		flipLetterY: function ($letter) {
			$letter.css({
				'direction': 'rtl',
				'unicode-bidi': 'bidi-override'
			});
			utils.log('%cOCD.js:', utils.getLogStyle(), $letter[0], 'letter was flipped on Y axis');
		},
		flipLetterX: function ($letter) {
			$letter.css({
				'-webkit-transform': 'rotateX(180deg)',
				'-moz-transform': 'rotateX(180deg)',
				'-o-transform': 'rotateX(180deg)',
				'-ms-transform': 'rotateX(180deg)'
			});
			utils.log('%cOCD.js:', utils.getLogStyle(), $letter[0], 'letter was flipped on X axis');
		},


		tiltHeading: function (tag, deg) {
			var allHeadings = this.element.getElementsByTagName(tag),
				index = 0,
				selectedHeading;

			if (allHeadings.length > 1) {
				index = utils.randomIntBetween(0, allHeadings.length - 1);
				selectedHeading = allHeadings[index];
			} else if (allHeadings.length === 1) {
				selectedHeading = allHeadings[index];
			}

			selectedHeading.style.transform = "rotate(" + deg + "deg)";

			logString = 'rotated: ' + deg + ' degrees';

			utils.log('%cOCD.js:', utils.getLogStyle(), selectedHeading, logString);
		},

		countCharacterOccurrences: function () {
			//			formObj = document.forms['charCounts'];
			//			textInput = formObj.elements['textInput'];
			CountsPlaceholder = document.getElementById('CountsPlaceholder');

			$('body').append('<div class="count"><table class="count-table"></table></div>');

			//			strChars = new String(textInput.value);
			strChars = $(this.element).text();
			var arrChars = [];
			var totalCount;

			// Loop through string and accumulate character counts
			var len = strChars.length;
			for (var i = 0; i < len; i++) {
				if (!arrChars[strChars[i]]) {
					arrChars[strChars[i]] = 1;
				} else {
					arrChars[strChars[i]] += 1;
				}
			}
			countChars = arrChars.count;

			//			// Delete the character counts from previous run
			//			if (CountsPlaceholder.hasChildNodes()) {
			//				while (CountsPlaceholder.childNodes.length >= 1) {
			//					CountsPlaceholder.removeChild(CountsPlaceholder.firstChild);
			//				}
			//			}

			// Sort the characters by code
			sortedChars = [];
			for (var i in arrChars) {
				sortedChars.push(utils.zeroPad(i.charCodeAt(0), 5, '0'));
			}
			sortedChars.sort();

			// Print the character counts
			var len = sortedChars.length;
			for (i = 0; i < sortedChars.length; i++) {
				character = String.fromCharCode(sortedChars[i]);
				if (sortedChars[i] == 10) {
					character = 'LF'
				}
				if (sortedChars[i] == 9) {
					character = 'TAB'
				}
				strToPrint = '<tr><td>Code: ' + utils.zeroPad(sortedChars[i].replace(/^0+/, ""), 5, " ") + '</td>';
				strToPrint += '<td> 0x' + parseInt(sortedChars[i].replace(/^0+/, "")).toString(16).toUpperCase() + '</td>';
				strToPrint += '<td> \'' + character + '\'</td>';
				strToPrint += '<td> Count: ' + arrChars[String.fromCharCode(sortedChars[i])] + "</td></tr>";
				//var txt = document.createTextNode(strToPrint);
				//				CountsPlaceholder.appendChild(txt);

				if (character !== 'TAB' && character !== 'LF') {
					$('.count-table').append(strToPrint);
				}
			}

			//			// Print total character count
			//			CountsPlaceholder.appendChild(document.createTextNode('-----TOTAL CHARACTERS: ' + strChars.length + "\n"));
			$('.count-table').append('<tr><td colspan="4">-----TOTAL CHARACTERS: ' + strChars.length + '</td></tr>');

		}

	};

	/*endregion Public Functions*/

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName,
					new Plugin(this, options));
			}
		});
	};

})(jQuery, window, document);



//
var proPs = {
	ocdLvl: 8, // The value of OCD the page will get
	debug: true
};

// init OCD plugin
$('body').ocd(proPs);

// get reference to plugin on specific element
var pluginOcD = $('body').data('plugin_ocd');
