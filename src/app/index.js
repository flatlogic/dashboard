(function() {
  'use strict';

  angular.module('qorDash', [
    'qorDash.core',
    'qorDash.auth',
    'qorDash.dashboard',
    'qorDash.domains',
    'qorDash.deployment',
    'qorDash.compose',
    'qorDash.configurations',
    'qorDash.orchestrate',
    'qorDash.manage'
  ]);
})();
