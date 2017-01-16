var app = angular.module('MyApp', []);

app.controller('ResizableController', ['$scope', function($scope) {

    $scope.resizableMode = false;
    var selectedElementClass = 'selected-element';

    $scope.resizableData = {
        widthParent: 0,
        widthWrap: 0,
        widthElement: 0,
        gridStep: 0,
        cols: 0,
        display: 'sm',
        className: '',
        milimetric: null
    };

    $scope.resizableData.display = $('#users-device-size').find('div:visible').first().attr('id');

    var convertToCol = function(size) {
        var cols = size / $scope.resizableData.gridStep;
        if (cols < 1) {
            cols = 1;
        } else {
            if (cols > Math.round(cols) && cols < Math.round(cols) + 1)
                cols = Math.round(cols) + 1;
            cols = Math.round(cols);
        }
        $scope.resizableData.cols = cols;
    };

    var extractResizableData = function(element) {
        $scope.resizableData.widthParent = $(element).parent().outerWidth();
        $scope.resizableData.widthElement = $(element).outerWidth();
        var sizeFloatDiv = 0;
        if ($scope.resizableData.milimetric) {
            sizeFloatDiv = $scope.resizableData.widthElement
        } else {
            $scope.resizableData.gridStep = Math.round($scope.resizableData.widthParent / 12);
            sizeFloatDiv = $scope.resizableData.widthElement / $scope.resizableData.gridStep;
            if (sizeFloatDiv < 1) {
                sizeFloatDiv = $scope.resizableData.gridStep;
            } else {
                if (sizeFloatDiv > Math.round(sizeFloatDiv) && sizeFloatDiv < Math.round(sizeFloatDiv) + 1)
                    sizeFloatDiv = Math.round(sizeFloatDiv) + 1;
                sizeFloatDiv = $scope.resizableData.gridStep * sizeFloatDiv;
            }
        }
        $scope.resizableData.widthWrap = sizeFloatDiv;
    };

    var removeColClassName = function(elem, updateOriginal) {
        var className = $(elem).attr('class');
        className = className.split(' ');
        className.filter(function(className) {
            if (className.startsWith('col-' + $scope.resizableData.display)) {
                if (updateOriginal)
                    $scope.resizableData.className = className;
                $(elem).removeClass(className);
            }
        });
    };

    var startResizableMode = function() {
        $scope.resizableData.display = $('#users-device-size').find('div:visible').first().attr('id');
        $('.' + selectedElementClass).each(function(idx, elem) {
            $('body').append('<div id="resizable" />');
            extractResizableData(elem);

            $('#resizable').outerWidth($scope.resizableData.widthWrap);
            $('#resizable').outerHeight($(elem).outerHeight());
            $('#resizable').css('position', 'fixed');
            $('#resizable').offset($(elem).offset());

            $('#resizable').resize(function() {

                var sizeInformation = $('#resizable').outerWidth() + 'px';
                if (!$scope.resizableData.milimetric) {
                    convertToCol(Math.round($('#resizable').outerWidth()));
                    sizeInformation = 'col-' + $scope.resizableData.display + '-' + $scope.resizableData.cols;
                }
                $('#resizable').html('');
                $('#resizable').append('<div class="pixelInformation" />');
                $('#resizable div').html(sizeInformation);
            });

            var options = {
                handles: "e, w",
                containment: "parent",
                stop: function(event, ui) {
                    if (!$scope.resizableData.milimetric)
                        $scope.resizableData.className = className = 'col-' + $scope.resizableData.display + '-' + $scope.resizableData.cols;
                }
            };

            if (!$scope.resizableData.milimetric)
                options.grid = $scope.resizableData.gridStep;

            $('#resizable').resizable(options);
        });
        $scope.resizableMode = true;
    };

    var stopResizableMode = function() {
        $('.' + selectedElementClass).each(function(idx, elem) {
            if ($scope.resizableData.milimetric) {
                $(elem).outerWidth($('#resizable').outerWidth());
            } else {
                $(elem).css('width', '');
                removeColClassName(elem, false);
                $(elem).addClass($scope.resizableData.className);
            }
            $scope.resizableMode = false;
            $('#resizable').remove();
        });
    };

    $scope.toggleResizableMode = function() {
        if ($scope.resizableMode)
            stopResizableMode();
        else
            startResizableMode();
    };

    $('.row div').click(function() {
        selectElement(this);
    });

    var selectElement = function(elem) {
        $('.' + selectedElementClass).removeClass(selectedElementClass);
        $(elem).addClass(selectedElementClass);
    };

}]);