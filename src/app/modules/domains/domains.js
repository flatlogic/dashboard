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

      var subs = {
          "qa.foo.com": [
              {
                  "id" : "development.qa.foo.com",
                  "name": "development"
              },
              {
                  "id" : "staging.qa.foo.com",
                  "name": "staging"
              },
              {
                  "id" : "production.qa.foo.com",
                  "name": "production"
              }
          ],
          "production.foo.com": [
              {
                  "id" : "development.production.foo.com",
                  "name": "development"
              },
              {
                  "id" : "staging.production.foo.com",
                  "name": "staging"
              }
          ]
      };
         if (!$scope.details) {
             $scope.details = subs[$scope.id];
         }
  }]);

    var domainDetailsController = angular.createAuthorizedController('DomainDetailsController', ['$scope', '$location', function($scope, $location) {
        $scope.domain = {};

        $scope.id = $location.path().split('/')[4];

        $scope.domain.name = $scope.id;
    }]);

  angular.module('qorDash.domains')
    .controller(domainsController)
      .controller(domainDetailsController);

})();
