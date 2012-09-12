(function($, window, document, undefined) {

	var pluginName = 'carousel',
		defaults = {
			speed: 500,
			easing: 'linear',
			autoplay: 4000,
			auto: true,
			prev: 'prev',
			next: 'next',
			slide: null,
			slid: null,
			navigation: false,
			responsive: false
		};

	function Carousel(element, options) {
		this.element = element;
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	var curr = 1,
		animationComplete = true,
		cTimer, div, ul, itemLength, liSize, bezierVal;

	Carousel.prototype = {
		init: function() {
			div = $(this.element);
			ul = $(div).children(':first-child').children(':first-child');
			var tLi = $(ul).children(),
				tl = tLi.size();
			ul.prepend(tLi.slice(tl - 1).clone()).append(tLi.slice(0, 1).clone());
			var li = $(ul).children();
			itemLength = li.size();
			this.setDimensions(li, ul);
			bezierVal = getEasing(this.options.easing);
			this.carouselButtons();
			this.autoSlide();
			this.hoverFunc();
			this.createNavigation();
			var $this = this;

			if (this.options.responsive) {
				$(window).resize(function() {
					$this.setDimensions(li, ul);
				});
			}
			
		},
		setDimensions: function(li, ul) {
			liSize = li.width();
			ul.width(itemLength * liSize);
			ul.css('left', -liSize * curr);
		},
		carouselButtons: function() {
			var $this = this;
			$($this.element).find('a.' + $this.options.next).click(function() {
				$this.cAnimate(curr + 1);
				return false;
			});
			$($this.element).find('a.' + $this.options.prev).click(function() {
				$this.cAnimate(curr - 1);
				return false;
			});
		},
		cAnimate: function(to) {
			var $this = this;
			if (animationComplete && curr !== to) {
				if (to <= -1) {
					ul.css({
						left: -liSize * (itemLength - 2) + "px"
					});
					curr = itemLength - 3;
				} else if (to >= itemLength) {
					ul.css({
						left: -liSize + "px"
					});
					curr = 2;
				} else {
					curr = to;
				}
				this.carouselAnimation(ul, curr * liSize);

				if (this.options.navigation) {
					var slide;
					if (to > itemLength - 2) {
						slide = parseInt(to - itemLength + 2,10);
					} else if (to <= 0) {
						slide = to + itemLength - 2;
					} else {
						slide = to;
					}

					var navItem = $($this.element).find('.carouselNavItem');
					navItem.removeClass('active');

					navItem.eq(parseInt(slide - 1,10)).addClass('active');
				}

			}
		},
		carouselAnimation: function(element, position) {
			var $this = this;
			animationComplete = false;
			if (this.options.slide) this.options.slide();

			if ($.support.transition) {

				ul.fadeIn('100', function() {
					$(element).css({
						left: "-" + position + "px"
					});
					setAnimation(element, $this.options.speed, bezierVal);
					$(element).one($.support.transition.end, function() {
						animationComplete = true;
						if ($this.options.slid) $this.options.slid();
						removeAnimation(ul);
					});
				});
			} else {
				$(element).filter(':not(:animated)').animate({
					left: "-" + position + "px"
				}, $this.options.speed, $this.options.easing, function() {
					animationComplete = true;
					if ($this.options.slid) $this.options.slid();
				});
			}
		},
		autoSlide: function() {
			var $this = this;
			if ($this.options.auto === true) {
				cTimer = setInterval(function() {
					$this.cAnimate(curr + 1);
				}, $this.options.autoplay);
			}
		},
		hoverFunc: function() {
			var $this = this;
			div.hover(function() {
				clearInterval(cTimer);
			}, function() {
				$this.autoSlide();
			});
		},
		createNavigation: function() {

			var $this = this;
			if (this.options.navigation) {
				var html = '<div class="carousuelNav">';
				for (var i = 0; i < itemLength - 2; i++) {
					html += '<span class="carouselNavItem">' + parseInt(i + 1,10) + '</span>';
				}
				html += '</div>';
				$(this.element).append(html);
				$(this.element).find('.carousuelNav').on('click', 'span', function() {
					var animateTo = $(this).text();
					$this.cAnimate(parseInt(animateTo,10));
				});
				$(this.element).find('.carouselNavItem:first').addClass('active');
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

!function($) {

	$(function() {

		"use strict";

		$.support.transition = (function() {
			var thisBody = document.body || document.documentElement,
				thisStyle = thisBody.style,
				support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined;

			return support && {
				end: (function() {
					var transitionEnd = "TransitionEnd";
					if ($.browser.webkit) {
						transitionEnd = "webkitTransitionEnd";
					} else if ($.browser.mozilla) {
						transitionEnd = "transitionend";
					} else if ($.browser.opera) {
						transitionEnd = "oTransitionEnd";
					}
					return transitionEnd;
				}())
			};
		})();

	});

}(window,jQuery);