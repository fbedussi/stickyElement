(function () {
    function setup(element, yOffset) {

        var $document = $(document),
            $element = $(element),
            elementHeight,
            pos,
            newPos,
            elementHigherThanViewPort,
            viewPortHeight,
            elementOriginalAbsoluteTop,
            elementOriginalRelativeTop,
            containerAvailableHeight,
            $parentElement = $element.parent();
        
        if (typeof yOffset === "undefined") {
            yOffset = 0;
        }

        function getElementCssTop() {
            return $element.css('top').replace("auto", "0").replace("px", "");
        }

        function initMeasures() {
            elementHeight = $element.outerHeight(true);
            elementOriginalAbsoluteTop = $element.offset().top - getElementCssTop();
            elementOriginalRelativeTop = $element.position().top - $parentElement.css('padding-top').replace("px", "") - getElementCssTop();
            viewPortHeight = document.documentElement.clientHeight;
            containerAvailableHeight = $parentElement.height() - elementOriginalRelativeTop;
            (elementHeight > viewPortHeight) ? elementHigherThanViewPort = true : elementHigherThanViewPort = false;
        }

        function reset() {
            initMeasures();
            moveAside($document.scrollTop());
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
            var currentElementRelativeTop = getElementCssTop(),
                currentElementAbsoluteTop = $element.offset().top,
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
                    $(element).addClass('bottomReached');
                } else {
                    $(element).removeClass('bottomReached');
                }

                $element.css('top', elementNewTop);
            }
        }

        $document.scroll(function () {
            
            pos = $document.scrollTop();

            setTimeout(function () {
                newPos = $document.scrollTop();
                if (newPos === pos) {
                    moveAside(newPos);
                }
            }, 200);
        });
    }

    stickyElement = setup;
}());