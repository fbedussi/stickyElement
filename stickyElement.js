(function () {
    "use strict";
    
    function setup(element, yOffset) {

        var docBody = document.getElementsByTagName('body')[0],
            el = document.querySelector(element),
            elementHeight,
            pos,
            newPos,
            elementHigherThanViewPort,
            viewPortHeight,
            elementOriginalAbsoluteTop,
            elementOriginalRelativeTop,
            containerAvailableHeight,
            parentEl = el.parentElement;
        
        if (typeof yOffset === "undefined") {
            yOffset = 0;
        }

        function getElementCssTop(el) {
            return window.getComputedStyle(el).getPropertyValue('top').replace("auto", "0").replace("px", "");
        }

        function initMeasures() {
            elementHeight = el.offsetHeight;
            elementOriginalAbsoluteTop = el.getBoundingClientRect().top - getElementCssTop(el);
            elementOriginalRelativeTop = el.offsetTop - getElementCssTop(parentEl) - getElementCssTop(el);
            viewPortHeight = document.documentElement.clientHeight;
            containerAvailableHeight = parseInt(getComputedStyle(parentEl).height) - elementOriginalRelativeTop;
            (elementHeight > viewPortHeight) ? elementHigherThanViewPort = true : elementHigherThanViewPort = false;
        }

        function reset() {
            initMeasures();
            moveAside(docBody.scrollTop);
        }

        initMeasures();
        
        if (jQuery().resize) {
            $parentElement.resize(function () {
                reset();
            });

            $element.resize(function () {
                reset();
            });
        } else {
            $(window).resize(function () {
                reset();
            });
        }

        function moveAside(newPos) {
            var currentElementRelativeTop = getElementCssTop(el),
                currentElementAbsoluteTop = el.getBoundingClientRect().top,
                elementNewTop = newPos - elementOriginalAbsoluteTop + yOffset,
                elementBottom, windowBottom;

            if (elementHigherThanViewPort) {
                elementBottom = currentElementAbsoluteTop + elementHeight;
                windowBottom = newPos + viewPortHeight;
                if (windowBottom !== elementBottom) {
                    elementNewTop = elementNewTop - (elementHeight - viewPortHeight);
                }
            }

            if (currentElementRelativeTop !== elementNewTop) {
                if (elementNewTop < 0) {
                    elementNewTop = 0;
                }
                if (elementNewTop + elementHeight > containerAvailableHeight) {
                    elementNewTop = containerAvailableHeight - elementHeight;
                    el.classList.add('bottomReached');
                } else {
                    el.classList.remove('bottomReached');
                }

                el.style.top = elementNewTop;
            }
        }

        docBody.addEventListener('scroll', function () {
            
            pos = docBody.scrollTop;

            setTimeout(function () {
                newPos = docBody.scrollTop;
                if (newPos === pos) {
                    moveAside(newPos);
                }
            }, 200);
        });
    }

    window.stickyElement = setup;
}());


(function () {
    "use strict";

    if (typeof $M === 'undefined') {
        window.$M = {};
    }

    function setup(element, yOffset) {

        var $document = $(document),
            $element = $(element),
            elementHeight, maxScroll, yOffestResult,
            $parentElement = $element.parent(),
            parentElementOffsetTop,
            parentElementHeight;

        function getYOffset() {
            if (typeof (yOffset) === 'function') {
                yOffestResult = yOffset();
            } else {
                yOffestResult = yOffset;
            }

            if (yOffestResult === 'static') {
                $element.addClass('static');
            } else {
                $element.css('top', yOffestResult);
                $element.removeClass('static');
            }
        }

        function initMeasures() {
            elementHeight = $element.outerHeight(true);
            parentElementOffsetTop = $parentElement.offset().top;
            parentElementHeight = $parentElement.height();
            $element.css('width', '');
            $element.width($element.width());  //fix x evitare cambi di larghezza al variare del tipo di posizionamento, che fa cambiare l'elemento su cui si calcola la percentuale

            getYOffset();

            if (parentElementHeight < (elementHeight + $element.position().top)) {
                $parentElement.css('min-height', elementHeight + $element.position().top);
            }
        }

        function reset() {
            initMeasures();
            moveAside($document.scrollTop());
        }

        initMeasures();

        $parentElement.resize(function () {
            reset();
        });

        $element.resize(function () {
            reset();
        });

        function moveAside(newPos) {
            getYOffset();


            //cache off
            //maxScroll = ($parentElement.offset().top + $parentElement.height()) - ($element.outerHeight(true) + yOffestResult);

            //cache on
            maxScroll = (parentElementOffsetTop + parentElementHeight) - (elementHeight + yOffestResult);

            if (newPos > yOffestResult) {
                $element.addClass('scrolled');
            } else {
                $element.removeClass('scrolled');
            }

            if (newPos > maxScroll) {
                $element.addClass('bottomReached');
            } else {
                $element.removeClass('bottomReached');
            }
        }

        $document.on('scroll', function () {
            moveAside($document.scrollTop());

            //ricontrolliamo dopo un po' altrimenti quando si scrolla velocemente verso l'alto e si arriva a 0 non parte più lo scroll e perde l'ultimo valore
            setTimeout(function () {
                moveAside($document.scrollTop());
            }, 200);
        });
    }

    function init(element, yOffset) {
        try {
            setup(element, yOffset);
        }
        catch (e) {
            $Y.debug.errorManager(e);
        }
    }

    $M.stickyElement = init;
}());