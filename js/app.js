var app = angular.module('MyApp', []);

app.controller('ResizableController', ['$scope', function($scope) {

    var resizableMode = false;
    var selectedElementClass = 'selected-element';

    var resizableData = {
        widthParent: 0,
        widthWrap: 0,
        widthElement: 0,
        gridStep: 0,
        cols: 0,
        display: 'sm',
        className: ''
    };

    var selectElement = function(elem) {
        $('.' + selectedElementClass).removeClass(selectedElementClass);
        $(elem).addClass(selectedElementClass);
    };

    var convertToCol = function(size) {
        var cols = size / resizableData.gridStep;
        if (cols < 1) {
            cols = 1;
        } else {
            if (cols > Math.round(cols) && cols < Math.round(cols) + 1)
                cols = Math.round(cols) + 1;
            cols = Math.round(cols);
        }
        resizableData.cols = cols;
        return "Total de colunas:" + cols;
    };

    var extractResizableData = function(element) {
        resizableData.widthParent = $(element).parent().parent().outerWidth();
        resizableData.widthElement = $(element).outerWidth();
        resizableData.gridStep = Math.round($('#resizable').parent().outerWidth() / 12);
        var sizeWrap = resizableData.widthElement / resizableData.gridStep;
        if (sizeWrap < 1) {
            sizeWrap = resizableData.gridStep;
        } else {
            if (sizeWrap > Math.round(sizeWrap) && sizeWrap < Math.round(sizeWrap) + 1)
                sizeWrap = Math.round(sizeWrap) + 1;
            sizeWrap = resizableData.gridStep * sizeWrap;
        }
        resizableData.widthWrap = sizeWrap;
    };

    var removeColClassName = function(elem, updateOriginal) {
        var className = $(elem).attr('class');
        className = className.split(' ');
        className.filter(function(className) {
            if (className.startsWith('col-' + resizableData.display)) {
                if (updateOriginal)
                    resizableData.className = className;
                $(elem).removeClass(className);
            }
        });
    };

    var startResizableMode = function() {
        if (!resizableMode) {
            $('.' + selectedElementClass).each(function(idx, elem) {
                $(elem).wrap('<div id="resizable" />');
                extractResizableData(elem);
                $('#resizable').outerWidth(resizableData.widthWrap);
                $('#resizable').outerHeight($(elem).outerHeight());
                $('#resizable').resize(function() {
                    console.log(convertToCol($('#resizable').outerWidth()));
                });

                removeColClassName(elem, true);
                $(elem).addClass('col-' + resizableData.display + '-12');

                $('#resizable').resizable({
                    handles: "e, w",
                    grid: resizableData.gridStep,
                    containment: "parent",
                    stop: function(event, ui) {
                        resizableData.className = className = 'col-' + resizableData.display + '-' + resizableData.cols
                    }

                });
            });
        }
        resizableMode = true;
    };

    var stopResizableMode = function() {
        $('.' + selectedElementClass).each(function(idx, elem) {
            $(elem).unwrap();
            removeColClassName(elem, false);
            $(elem).addClass(resizableData.className);
            resizableMode = false;
        });
    };

    $(document).keydown(function(e) {
        if (e.ctrlKey)
            startResizableMode();
    });

    $(document).keyup(function(e) {
        if (resizableMode)
            stopResizableMode();
    });

    $('.row div').click(function() {
        selectElement(this);
    });

    //$(window).resize(function() { startResizableMode(); });
}]);