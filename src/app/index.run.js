(function() {
  'use strict';

  angular
    .module('angularRouterSwipes')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {
    $log.debug('runBlock end');
  }
})();
