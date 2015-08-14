(function ($) {
    $.fn.stickyElement = function () {

        var $document = $(document),
            $element = this,
            elementHeight,
            pos,
            newPos,
            elementHigherThanViewPort,
            viewPortHeight,
            elementOriginalAbsoluteTop,
            elementOriginalRelativeTop,
            containerAvailableHeight,
            $parentElement = $element.parent();

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

        initMeasures();

        $parentElement.resize(function () {
            setInterval(initMeasures, 100);
            moveAside($document.scrollTop());
        });

        function moveAside(newPos) {
            var currentElementRelativeTop = getElementCssTop(),
                currentElementAbsoluteTop = $element.offset().top,
                elementNewTop = newPos - elementOriginalAbsoluteTop,
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
		
		return this;
    }

}(jQuery));