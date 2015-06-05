(function() {
  'use strict';

  var terminalModule = angular.module('qorDash.widget.terminal')
    .directive('qlTerminal', qlTerminal)
    .service('terminal', terminalService)
  ;

  qlTerminal.$inject = ['$timeout', '$window'];
  function qlTerminal($timeout, $window){
    var adaptHeight = function(element) {
      element.height(element.parent().parent().parent().height() - 20);
    };

    return {
      link: function(scope, element, attrs, ctrl) {
        $timeout(function(){
          adaptHeight(element);
          scope.onresize = function() {
            adaptHeight(element);
          };
          angular.element($window).bind('resize', function() {
            scope.onresize();
          });
          angular.element('.ui-splitbar').children()[1].click()
        });
      }
    }
  }

  terminalService.$inject = [];
  function terminalService() {
    var self = this;

    self.initTerminalById = function(id, params, sendCallback) {
      return $('#' + id).terminal(sendCallback,params);
    };

    self.initTerminalByObject = function(object, params, sendCallback) {
      if (!params) {
        params = {greetings: false};
      }
      return object.terminal(sendCallback, params);
    };
  }

  var terminalController = angular.createAuthorizedController('TerminalController', ['$scope', '$rootScope', '$timeout', 'terminal', function($scope, $rootScope, $timeout, terminal) {

    // Initialize terminal
    var terminal = terminal.initTerminalById('terminal', {greetings: false});

    $scope.clearTerminal = function() {
      terminal.clear();
    };

    // Get WebSocket url from attribute
    var ws = new WebSocket($scope.wsUrl);

    var socketMessage = function(event) {
      var data = parseInput(event.data);
      if (data) {
        terminal.echo(data);
      }
    };

    ws.onmessage = socketMessage;

      $scope.$on("$destroy", function(){
          ws.close();
      });

    $rootScope.$on('terminal:newWsUrl', function(event, newUrl) {
      ws.close();
      $timeout(function() {
        $scope.$apply(function () {
          $scope.clearTerminal();
        });
      });
      try {
        ws = new WebSocket(newUrl);
        ws.onmessage = socketMessage;
      } catch (e) {
        alert('Wrong WebSocket url' + e);
      }
    });


    function parseInput(input) {
      var result = input.split(',');

      switch (result[0]) {
        case '****':
          return result[3];
          break;
        case '????':
          return '[[;#7f7f00;]' + result[3] + ']';
          break;
        case '!!!!':
          return '[[;#7f0000;]' + result[3] + ']';
          break;
        default:
          return input;
      }
    }

  }]);

  terminalModule.controller(terminalController);

})();
