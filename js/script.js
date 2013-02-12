(function($, window, document, undefined) {

	var pluginName = 'carousel',
		defaults = {
			speed: 800,
			easing: 'easeInOutExpo',
			autoplay: 8000,
			auto: false,
			prev: 'prev',
			next: 'next',
			slide: null,
			slid: null,
			navigation: true,
			responsive: false
		};

	function Carousel(element, options) {
		this.el = $(element);
		this.container = this.el.children(':first-child');
		this.mask = this.container.children(':first-child');
		this.slides =  null;
		this.numberOfSlides = 0;
		this.images = this.el.find('img');
		this.slideWidth= "";
		this.current = 1;
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	var animationComplete = true,
		cTimer,bezierVal;

	Carousel.prototype = {
		init: function() {
			var obj = this;
			var tLi = $(obj.mask).children(),
				tl = tLi.size();
			obj.mask.prepend(tLi.slice(tl - 1).clone()).append(tLi.slice(0, 1).clone());
			obj.slides = obj.mask.children();
			obj.numberOfSlides = this.slides.size();
			obj.setDimensions();
			bezierVal = getEasing(obj.options.easing);
			obj.carouselButtons();
			obj.autoSlide();
			obj.hoverFunc();
			obj.createNavigation();

			if (obj.options.responsive) {
				$(window).resize(function() {
					obj.setDimensions();
				});
			}

		},
		setDimensions: function() {
			var obj = this;
			console.log(obj.slides.width());
			obj.slides.width(obj.el.width());
			obj.container.height(obj.images.height());
			obj.slideWidth = obj.slides.width();
			obj.mask.width(obj.numberOfSlides * obj.slideWidth);
			obj.mask.css('left', -obj.slideWidth * obj.current);
		},
		carouselButtons: function() {
			var obj = this;
			obj.el.find('a.' + obj.options.next).click(function() {
				obj.cAnimate(obj.current + 1);
				return false;
			});
			obj.el.find('a.' + obj.options.prev).click(function() {
				obj.cAnimate(obj.current - 1);
				return false;
			});
		},
		cAnimate: function(to) {
			var obj = this;
			if (animationComplete && obj.current !== to) {
				if (to <= -1) {
					obj.mask.css({
						left: -obj.slideWidth * (obj.numberOfSlides - 2) + "px"
					});
					obj.current = obj.numberOfSlides - 3;
				} else if (to >= obj.numberOfSlides) {
					obj.mask.css({
						left: -obj.slideWidth + "px"
					});
					obj.current = 2;
				} else {
					obj.current = to;
				}
				obj.carouselAnimation(obj.mask, obj.current * obj.slideWidth);

				if (obj.options.navigation) {
					var slide;
					if (to > obj.numberOfSlides - 2) {
						slide = parseInt(to - obj.numberOfSlides + 2, 10);
					} else if (to <= 0) {
						slide = to + obj.numberOfSlides - 2;
					} else {
						slide = to;
					}

					var navItem = obj.el.find('.carouselNavItem');
					navItem.removeClass('active');

					navItem.eq(parseInt(slide - 1, 10)).addClass('active');
				}

			}
		},
		carouselAnimation: function(element, position) {
			var obj = this;
			animationComplete = false;
			if (this.options.slide) this.options.slide();

			if ($.support.transition) {

				obj.mask.fadeIn('100', function() {
					$(element).css({
						left: "-" + position + "px"
					});
					setAnimation(element, obj.options.speed, bezierVal);
					$(element).one($.support.transition.end, function() {
						animationComplete = true;
						if (obj.options.slid) obj.options.slid();
						removeAnimation(obj.mask);
					});
				});
			} else {
				$(element).filter(':not(:animated)').animate({
					left: "-" + position + "px"
				}, obj.options.speed, obj.options.easing, function() {
					animationComplete = true;
					if (obj.options.slid) obj.options.slid();
				});
			}
		},
		autoSlide: function() {
			var obj = this;
			if (obj.options.auto === true) {
				cTimer = setInterval(function() {
					obj.cAnimate(obj.current + 1);
				}, obj.options.autoplay);
			}
		},
		hoverFunc: function() {
			var obj = this;
			obj.el.hover(function() {
				clearInterval(cTimer);
			}, function() {
				obj.autoSlide();
			});
		},
		createNavigation: function() {

			var obj = this;
			if (obj.options.navigation) {
				var html = '<div class="carousuelNav">';
				for (var i = 0; i < obj.numberOfSlides - 2; i++) {
					html += '<span class="carouselNavItem">' + parseInt(i + 1, 10) + '</span>';
				}
				html += '</div>';
				obj.el.append(html);
				obj.el.find('.carousuelNav').on('click', 'span', function() {
					var animateTo = $(this).text();
					obj.cAnimate(parseInt(animateTo, 10));
				});
				obj.el.find('.carouselNavItem:first').addClass('active');
			}

		}
	};

	function setAnimation(selector, time, bezier) {
		var prefixes = ["-webkit-", "-moz-", "-ms-", "-o-", ""];
		$(prefixes).each(function() {
			var prefix = this + 'transition',
				aniArgs = {};
			aniArgs[prefix] = 'left ' + time + 'ms cubic-bezier(' + bezier + ') 0s';
			selector.css(aniArgs);
		});
	}

	function removeAnimation(selector) {
		var prefixes = ["-webkit-", "-moz-", "-ms-", "-o-", ""];
		$(prefixes).each(function() {
			var prefix = this + 'transition',
				aniArgs = {};
			aniArgs[prefix] = 'none';
			selector.css(aniArgs);
		});
	}
	var getEasing = (function() {

		var cache = {};

		return function(n) {

			var cached = cache[n];
			if (cached) return cached;
			var ease = "ease",
				easeIn = ease + "In",
				easeOut = ease + "Out",
				easeInOut = ease + "InOut",
				names = ["Quad", "Cubic", "Quart", "Quint", "Sine", "Expo", "Circ", "Back"],
				easings = [];

			easings["linear"] = "0.000, 0.000, 1.000, 1.000";
			easings[easeIn] = "0.420, 0.000, 1.000, 1.000";
			easings[easeOut] = "0.000, 0.000, 0.580, 1.000";
			easings[easeInOut] = "0.420, 0.000, 0.580, 1.000";

			easings[easeIn + names[0]] = "0.550, 0.085, 0.680, 0.530";
			easings[easeIn + names[1]] = "0.550, 0.055, 0.675, 0.190";
			easings[easeIn + names[2]] = "0.895, 0.030, 0.685, 0.220";
			easings[easeIn + names[3]] = "0.755, 0.050, 0.855, 0.060";
			easings[easeIn + names[4]] = "0.470, 0.000, 0.745, 0.715";
			easings[easeIn + names[5]] = "0.950, 0.050, 0.795, 0.035";
			easings[easeIn + names[6]] = "0.600, 0.040, 0.980, 0.335";
			easings[easeIn + names[7]] = "0.600, -0.280, 0.735, 0.045";

			easings[easeOut + names[0]] = "0.250, 0.460, 0.450, 0.940";
			easings[easeOut + names[1]] = "0.215, 0.610, 0.355, 1.000";
			easings[easeOut + names[2]] = "0.165, 0.840, 0.440, 1.000";
			easings[easeOut + names[3]] = "0.230, 1.000, 0.320, 1.000";
			easings[easeOut + names[4]] = "0.390, 0.575, 0.565, 1.000";
			easings[easeOut + names[5]] = "0.190, 1.000, 0.220, 1.000";
			easings[easeOut + names[6]] = "0.075, 0.820, 0.165, 1.000";
			easings[easeOut + names[7]] = "0.175, 0.885, 0.320, 1.275";

			easings[easeInOut + names[0]] = "0.455, 0.030, 0.515, 0.955";
			easings[easeInOut + names[1]] = "0.645, 0.045, 0.355, 1.000";
			easings[easeInOut + names[2]] = "0.770, 0.000, 0.175, 1.000";
			easings[easeInOut + names[3]] = "0.860, 0.000, 0.070, 1.000";
			easings[easeInOut + names[4]] = "0.445, 0.050, 0.550, 0.950";
			easings[easeInOut + names[5]] = "1.000, 0.000, 0.000, 1.000";
			easings[easeInOut + names[6]] = "0.785, 0.135, 0.150, 0.860";
			easings[easeInOut + names[7]] = "0.680, -0.550, 0.265, 1.550";

			return (cache[n] = easings[n] === undefined ? "linear" : easings[n]);
		};
	}());

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new Carousel(this, options));
			}
		});
	};

})(jQuery, window, document);


!
function($) {

	$(function() {

		"use strict"; // jshint ;_;

		/* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
		 * ======================================================= */

		$.support.transition = (function() {

			var transitionEnd = (function() {

				var el = document.createElement('bootstrap'),
					transEndEventNames = {
						'WebkitTransition': 'webkitTransitionEnd',
						'MozTransition': 'transitionend',
						'OTransition': 'oTransitionEnd otransitionend',
						'transition': 'transitionend'
					},
					name;

				for (name in transEndEventNames) {
					if (el.style[name] !== undefined) {
						return transEndEventNames[name];
					}
				}

			}());

			return transitionEnd && {
				end: transitionEnd
			};

		})();

	});

}(window.jQuery);