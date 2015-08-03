(function() {
  'use strict';

  angular
    .module('angularRouterSwipes')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('swiper', {
        url: '/swiper',
        templateUrl: '/app/swiper/swiper.html',
        controller: 'SwiperController',
        controllerAs: 'swiperController',
        resolve: {
          swipeElements: getSwipeElements
        }
      })
      .state('swiper.box', {
        url: '/boxes/{boxId:int}',
        templateUrl: '/app/box/box.html',
        resolve: {
          box: getBoxFromStateParams
        },
        controller: 'BoxController',
        controllerAs: 'boxController'
      });

    $urlRouterProvider.otherwise('/swiper');
  }

  function getBoxFromStateParams($stateParams) {
    var swipeElements = getSwipeElements();
    return _.chain(swipeElements)
      .filter(function(element) {
        return element.id === $stateParams.boxId;
      })
      .first()
      .value();
  }

  function getSwipeElements() {
    return [
      {id: 1, name: 'First'},
      {id: 2, name: 'Second'},
      {id: 3, name: 'Third'},
      {id: 4, name: '4th'},
      {id: 5, name: '5th'},
      {id: 6, name: 'Last'}
    ];
  }
})();
