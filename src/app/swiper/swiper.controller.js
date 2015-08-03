(function() {
  'use strict';

  angular
    .module('angularRouterSwipes')
    .controller('SwiperController', SwiperController);

  /** @ngInject */
  function SwiperController(swipeElements) {
    var vm = this;

    vm.swipeElements = swipeElements;
  }
})();
