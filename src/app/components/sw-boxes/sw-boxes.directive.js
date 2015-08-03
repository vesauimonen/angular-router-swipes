(function() {
  'use strict';

  angular
    .module('angularRouterSwipes')
    .directive('swBoxes', swBoxes);

  /** @ngInject */
  function swBoxes($state) {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/sw-boxes/sw-boxes.html',
      scope: {
        box: '=',
        swipeElements: '='
      },
      link: link,
      controller: BoxesController,
      controllerAs: 'boxesController',
      bindToController: true
    };

    return directive;

    function link(scope, element) {
      var mc = new Hammer.Manager(element[0]);
      var pan = new Hammer.Pan({threshold: 0, pointers: 0});
      var swipe = new Hammer.Swipe({threshold: 0, pointers: 0});
      swipe.recognizeWith(pan);
      mc.add(pan);
      mc.add(swipe);

      mc.on('panleft panright', scope.boxesController.onPan);
      mc.on('swipeleft', scope.boxesController.onSwipeLeft);
      mc.on('swiperight', scope.boxesController.onSwipeRight);
      mc.on('panend', scope.boxesController.onPanEnd);

      element.bind('webkitTransitionEnd', function() {
        $state.go('swiper.box', {boxId: scope.boxesController.box.id});
      });
    }

    /** @ngInject */
    function BoxesController($scope, $window) {
      var vm = this;

      vm.renderedBoxes = getRenderedBoxes(vm.box, vm.swipeElements);
      vm.transformValue = 'translateX(' + getInitialXOffset(vm.renderedBoxes) + 'px)';
      vm.onPan = onPan;
      vm.onPanEnd = onPanEnd;
      vm.onSwipeLeft = onSwipeLeft;
      vm.onSwipeRight = onSwipeRight;
      vm.bouncing = false;

      var START_X = getInitialXOffset(vm.renderedBoxes);

      function getRenderedBoxes() {
        var boxes;
        var indexOfCurrentBox = _.findIndex(vm.swipeElements, function(element) {
          return element.id === vm.box.id;
        });
        if (indexOfCurrentBox === 0) {
          boxes = _.take(vm.swipeElements, 2);
          boxes[0].interval = [0, $window.innerWidth];
          boxes[1].interval = [$window.innerWidth, $window.innerWidth * 2];
        } else if (indexOfCurrentBox === vm.swipeElements.length - 1) {
          boxes = _.takeRight(vm.swipeElements, 2);
          boxes[0].interval = [-$window.innerWidth, 0];
          boxes[1].interval = [0, $window.innerWidth];
        } else {
          boxes = _.chain(vm.swipeElements)
            .slice(indexOfCurrentBox - 1, indexOfCurrentBox + 2)
            .value();
          boxes[0].interval = [-$window.innerWidth, 0];
          boxes[1].interval = [0, $window.innerWidth];
          boxes[2].interval = [$window.innerWidth, $window.innerWidth * 2];
        }
        return boxes;
      }

      function getInitialXOffset(renderedBoxes) {
        return renderedBoxes[0].interval[0];
      }

      function onPan(ev) {
        vm.bouncing = false;
        translateTo(START_X + ev.deltaX);
      }

      function onPanEnd(ev) {
        var newCurrentBox = getMostVisibleBox(ev.deltaX);
        bounceToBox(newCurrentBox);
      }

      function onSwipeRight() {
        vm.bouncing = false;
        if (vm.renderedBoxes.length > 2 || vm.renderedBoxes[0].id !== vm.box.id) {
          bounceToBox(vm.renderedBoxes[0]);
        }
      }

      function onSwipeLeft() {
        vm.bouncing = false;
        if (vm.renderedBoxes.length > 2 || _.last(vm.renderedBoxes).id !== vm.box.id) {
          bounceToBox(_.last(vm.renderedBoxes));
        }
      }

      function translateTo(x) {
        vm.transformValue = 'translateX(' + x + 'px)';
        $scope.$digest();
      }

      function getMostVisibleBox(deltaX) {
        return _.max(vm.renderedBoxes, getBoxVisibleAreaAsScalar);

        function getBoxVisibleAreaAsScalar(box) {
          var screenInterval = [0, $window.innerWidth];
          var scaledInterval = _.map(box.interval, addDeltaX);
          return getIntersectionLength(scaledInterval, screenInterval);
        }

        function addDeltaX(n) {
          return n + deltaX;
        }
      }

      function getIntersectionLength(interval1, interval2) {
        var intersectionLower = _.max([interval1[0], interval2[0]]);
        var intersectionUpper = _.min([interval1[1], interval2[1]]);
        if (intersectionUpper <= intersectionLower) {
          return 0;
        }
        return intersectionUpper - intersectionLower;
      }

      function bounceToBox(box) {
        vm.bouncing = true;
        translateTo(START_X - box.interval[0]);
        START_X = START_X - box.interval[0];
        vm.box = box;
      }
    }
  }
})();
