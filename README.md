# OCD.js
A jQuery plugin that will make any OCD freak to lose his mind :)

## Features

* Tilts headings
* Change random letters font size
* on "debug" mode all affected elements are returned in console

### Usage

activate with jQuery like so:

```js
	var proPs = {
		ocdLvl: 8, // The value of OCD the page will get
		debug: true
	};

	// init OCD plugin
	$('body').ocd(proPs);
```

## Ideas

* When user clicks the "Order" button (will be added to the top corner of the screen), all the letters on the page will be rearanged in a table

Letter  | Frequency
-- | --
a  | 51
f  | 72
t  | 46

* Color random letters in random color