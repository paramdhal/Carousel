Carousel
========

This is the basic HTML structure required (element agnostic):
-------------

```html
	<div id="carousel">
		<div class="carouselCont">
			<div id="carouselMask">
				<div class="slide"><img src="images/image1.jpg"></div>
				<div class="slide"><img src="images/image2.jpg"></div>
				<div class="slide"><img src="images/image3.jpg"></div>
			</div>
		</div>	
		<a class="prev" href="#">Previous</a>
		<a class="next" href="#">Next</a>	
	</div>
```

### Here's the JavaScript:

```javascript
	$().ready(function(){
		$('#carousel').carousel();
	});
```	
## DOCS

### Requirements

* jQuery
* jQuery 'easing' plugin  

### Overview

Javascript/CSS3 based carousel widget. Uses css3 animations and easings when available and falls back to jquery animations and easings in browsers without css3.

### Options

#### speed: 500 (number)
Time that animation takes place in ms

#### auto: true (boolean)
Whether the carousel should auto play or not

#### autoplay: 4000 (number)
Autoplay time between slides in ms 

#### prev: 'prev' (string)
class of previous button

#### prev: 'next' (string)
class of next button 

#### easing: 'linear' (string)
Easing - see available easings below

### Easing

* linear
* easeIn
* easeOut
* easeInOut
* easeInQuad
* easeOutQuad
* easeInOutQuad
* easeInCubic
* easeOutCubic
* easeInOutCubic
* easeInQuart
* easeOutQuart
* easeInOutQuart
* easeInQuint
* easeOutQuint
* easeInOutQuint
* easeInSine
* easeOutSine
* easeInOutSine
* easeInExpo
* easeOutExpo
* easeInOutExpo
* easeInCirc
* easeOutCirc
* easeInOutCirc
* easeInBack
* easeOutBack
* easeInOutBack

### Events

Carousel class exposes two events for hooking into carousel functionality.
	
#### slide: null (function)
This event fires immediately when the slide instance method is invoked.

#### slid: null (function)
This event is fired when the carousel has completed its slide transition.