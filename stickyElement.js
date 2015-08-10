(function () {
    if (typeof $M === 'undefined') {
        $M = {};
    }

    function setup(element) {

        var $document = $(document),
            $recapDataContainer = $(element),
            recapDataContainerHeight,
            pos,
            newPos,
            asideHigherThanViewPort,
            viewPortHeight,
            originalAsideTop;

        function initMeasures() {
            recapDataContainerHeight = $recapDataContainer.outerHeight(true);
            originalAsideTop = $recapDataContainer.offset().top;
            viewPortHeight = document.documentElement.clientHeight;
            (recapDataContainerHeight > (viewPortHeight - originalAsideTop)) ? asideHigherThanViewPort = true : asideHigherThanViewPort = false;
        }

        initMeasures();
        $(window).resize(function () {
            initMeasures();
        });

        $document.scroll(function () {
            pos = $document.scrollTop();

            setTimeout(function () {
                newPos = $document.scrollTop();
                if (newPos == pos) {
                    moveAside(newPos);
                }
            }, 200);
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
                $recapDataContainer.css('top', newAsideTop);
            }
        }
    }

    function init(element) {
        try {
            setup(element);
        }
        catch (e) {
            $Y.debug.errorManager(e);
        }
    }

    $M.stickyElement = init;
}());