(function() {
  'use strict';

  angular
    .module('angularRouterSwipes')
    .controller('BoxController', BoxController);

  /** @ngInject */
  function BoxController($state, $window, box, swipeElements) {
    var vm = this;

    vm.box = box;
    vm.swipeElements = swipeElements;
  }
})();
