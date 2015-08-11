(function ($) {
    $.fn.stickyElement = function () {

        var $document = $(document),
            $recapDataContainer = this,
            recapDataContainerHeight,
            pos,
            newPos,
            asideHigherThanViewPort,
            viewPortHeight,
            originalAsideTop,
			containerHeight;

        function initMeasures() {
            recapDataContainerHeight = $recapDataContainer.outerHeight(true);
            originalAsideTop = $recapDataContainer.offset().top;
            viewPortHeight = document.documentElement.clientHeight;
            (recapDataContainerHeight > (viewPortHeight - originalAsideTop)) ? asideHigherThanViewPort = true : asideHigherThanViewPort = false;
			containerHeight = $recapDataContainer.parent().height();
        }

        initMeasures();
        $(window).resize(function () {
            initMeasures();
        });

        function moveAside(newPos) {
            var asideTop = $recapDataContainer.offset().top,
                newAsideTop = newPos - originalAsideTop,
                asideBottom, windowBottom;

            if (asideHigherThanViewPort) {
                asideBottom = asideTop + recapDataContainerHeight;
                windowBottom = newPos + viewPortHeight;
                if (windowBottom != asideBottom) {
                    newAsideTop = newAsideTop - (recapDataContainerHeight - viewPortHeight);
                }
            }

            if (asideTop != newAsideTop) {
                if (newAsideTop < 0) {
                    newAsideTop = 0;
                }
				if (newAsideTop + recapDataContainerHeight > containerHeight) {
                    newAsideTop = containerHeight - recapDataContainerHeight;
                }
                $recapDataContainer.css('top', newAsideTop);
            }
        }
		
		$document.scroll(function () {
            pos = $document.scrollTop();

            setTimeout(function () {
                newPos = $document.scrollTop();
                if (newPos == pos) {
                    moveAside(newPos);
                }
            }, 200);
        });
		
		return this;
    }

}(jQuery));