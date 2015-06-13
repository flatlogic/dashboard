(function() {
  'use strict';

  angular.module('qorDash.domains')
    .controller('DomainsSidebarController', DomainsSidebarController)
  ;

  DomainsSidebarController.$inject = ['$scope'];
  function DomainsSidebarController($scope) {
    $scope.domains = [
      {"id":"qa.foo.com", "name":"QA", "url":"https://server.com/domain/qa.foo.com" },
      {"id":"production.foo.com", "name": "Production", "url":"https://server.com/domain/production.foo.com"}
    ]
  }

  var domainsController = angular.createAuthorizedController('DomainsController', ['$scope', '$location', function($scope, $location) {
    $scope.domain = {};

    $scope.id = $location.path().split('/')[3];


    var loadDomainInformation = function() {
      // TODO Add dynamic functionality
      var domains = [
        {"id":"qa.foo.com", "name":"QA", "url":"https://server.com/domain/qa.foo.com" },
        {"id":"production.foo.com", "name": "Production", "url":"https://server.com/domain/production.foo.com"}
      ];

      for (var domainIndex in domains) {
        if (domains[domainIndex].id == $scope.id) {
          $scope.domain = domains[domainIndex];
        }
      }

    };

    loadDomainInformation();
  }]);

  angular.module('qorDash.domains')
    .controller(domainsController);

})();
