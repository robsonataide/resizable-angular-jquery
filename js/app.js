var app = angular.module('MyApp', []);

app.controller('ResizableController', ['$scope', function($scope) {

    $scope.resizableMode = false;
    var selectedElementClass = 'selected-element';

    var resizableData = {
        widthParent: 0,
        widthWrap: 0,
        widthElement: 0,
        gridStep: 0,
        cols: 0,
        display: 'sm',
        className: '',
        milimetric: null
    };

    resizableData.display = $('#users-device-size').find('div:visible').first().attr('id');

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
    };

    var extractResizableData = function(element) {
        resizableData.widthParent = $(element).parent().outerWidth();
        resizableData.widthElement = $(element).outerWidth();
        resizableData.gridStep = Math.round(resizableData.widthParent / 12);
        var sizeFloatDiv = resizableData.widthElement / resizableData.gridStep;
        if (sizeFloatDiv < 1) {
            sizeFloatDiv = resizableData.gridStep;
        } else {
            if (sizeFloatDiv > Math.round(sizeFloatDiv) && sizeFloatDiv < Math.round(sizeFloatDiv) + 1)
                sizeFloatDiv = Math.round(sizeFloatDiv) + 1;
            sizeFloatDiv = resizableData.gridStep * sizeFloatDiv;
        }
        resizableData.widthWrap = sizeFloatDiv;
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

    var startResizableMode = function(milimetric) {
        if (!$scope.resizableMode && milimetric != resizableData.milimetric) {
            console.log('start with milimetric:' + milimetric);
            resizableData.milimetric = milimetric;
            $('.' + selectedElementClass).each(function(idx, elem) {
                $('body').append('<div id="resizable" />');
                extractResizableData(elem);

                $('#resizable').outerWidth(resizableData.widthWrap);
                $('#resizable').outerHeight($(elem).outerHeight());
                $('#resizable').css('position', 'fixed');
                $('#resizable').offset($(elem).offset());

                $('#resizable').resize(function() {
                    //TODO: make tooltip for size infomation in pixels 
                    if (!milimetric)
                        convertToCol($('#resizable').outerWidth());
                });

                var options = {
                    handles: "e, w",
                    containment: "parent",
                    stop: function(event, ui) {
                        if (!resizableData.milimetric)
                            resizableData.className = className = 'col-' + resizableData.display + '-' + resizableData.cols;
                    }
                };

                if (!resizableData.milimetric)
                    options.grid = resizableData.gridStep;

                $('#resizable').resizable(options);
            });
            $scope.resizableMode = true;
        }
    };

    var stopResizableMode = function() {
        $('.' + selectedElementClass).each(function(idx, elem) {
            if (resizableData.milimetric) {
                $(elem).outerWidth($('#resizable').outerWidth());
            } else {
                removeColClassName(elem, false);
                $(elem).addClass(resizableData.className);
            }
            $scope.resizableMode = false;
            resizableData.milimetric = null;
            $('#resizable').remove();
        });
    };

    $(document).keydown(function(e) {
        if (e.shiftKey)
            console.log('Shift')
        if (e.ctrlKey)
            startResizableMode(e.shiftKey);
        e.preventDefault();
    });

    $(document).keyup(function(e) {
        if ($scope.resizableMode)
            stopResizableMode();
    });

    $('.row div, button').click(function() {
        selectElement(this);
    });

    $('body').resize(function() {
        resizableData.display = $('#users-device-size').find('div:visible').first().attr('id');
    });
}]);