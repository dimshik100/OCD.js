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
			debug: false
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

	/*region Private Functions*/

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
		//log: this.options.debug ? console.log.bind(window.console) : function () {}
		log: undefined
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

	/*region Public Functions*/

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

			loadScript("../externals/blast/jquery.blast.min.js", this.blast, {
				selector: 'div',
				delimiter: "letter",
				minFontSize: 15,
				maxFontSize: 40,
				numOfElements: 10
			});

			this.tiltHeading("h2", 4);
		},

		blast: function (params) {

			var $selector = $(params.selector);
			$selector.blast({
				delimiter: params.delimiter
			});

			var $letters = $('.blast');

			for (var i = 0; i < params.numOfElements; i++) {
				var $letter = $letters.eq(utils.randomIntFromInterval(0, $letters.length));

				var fontSize = utils.randomIntFromInterval(params.minFontSize, params.maxFontSize);
				$letter.css({
					"font-size": fontSize
				});

				logString = 'enlarged letter to: ' + fontSize + 'px';

				utils.log('%cOCD.js:', utils.getLogStyle(), $letter[0], logString);
			}



		},

		tiltHeading: function (tag, deg) {
			var allHeadings = this.element.getElementsByTagName(tag),
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
		},

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
