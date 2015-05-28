(function() {
  'use strict';

  angular
    .module('qorDash.core')
    .controller('App', AppController)
    .service('dataLoader', dataLoaderService)
    .run(runCore);

  AppController.$inject = ['config', '$scope'];
  function AppController(config, $scope) {
    /*jshint validthis: true */
    var vm = this;

    vm.title = config.appTitle;

    $scope.app = config;
  }

  runCore.$inject = ['dataLoader'];
  function runCore(dataLoader) {
    dataLoader.loadGlobalPermissions();
  }

  /**
   * Service for loading JSON scripts from server
   */
  dataLoaderService.$inject = ['$window', '$http', '$q'];
  function dataLoaderService($window, $http, $q) {
    var self = this;

    // Key to store permissions in localstorage
    self.permissionsJsonKey = 'permissions_json';

    // Load and save json with permission map
    self.loadGlobalPermissions = function() {
      return $http.get('data/permissions.json')
        .then(function(result) {
          $window.localStorage[self.permissionsJsonKey] = JSON.stringify(result.data);
          return result.data;
        });
    };

    /**
     * Load json with sections which should be displayed on specified page
     */
    self.loadPageSections = function(pageName) {
      var emptySections = [];
      return $http.get('data/sections-' + pageName + '.json')
        .then(function(result) {
          $window.localStorage['sections_' + pageName] = JSON.stringify(result.data);
          return result.data;
        }, function() {
          $window.localStorage['sections_' + pageName] = JSON.stringify(emptySections);
          return emptySections;
        });
    };

    self.getGlobalPermissions = function() {
      if (!$window.localStorage[self.permissionsJsonKey]) {
        throw new Error('No global permissions loaded. Ensure that dataLoader.loadGlobalPermission has been called first');
      }
      return JSON.parse( $window.localStorage[self.permissionsJsonKey] );
    };

    self.getPageSections = function(pageName) {
      if (!$window.localStorage['sections_' + pageName]) {
        return self.loadPageSections(pageName);
      }
      return $q(function(resolve) {
        resolve(JSON.parse( $window.localStorage['sections_' + pageName] ));
      });
    };

    /**
     * Download and save all scripts. Called in page controller.
     */
    self.init = function(pageName) { // fixme returns one promise
      return self.loadGlobalPermissions().then(function(){
        //return self.loadPageSections(pageName);
      });
    }
  }

})();
