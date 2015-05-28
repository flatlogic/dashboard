(function() {
  'use strict';

  var terminalModule = angular.module('qorDash.widget.timeline')
    .directive('qlTimeline', qlTimeline)
  ;

  qlTimeline.$inject = ['$timeout', '$window'];
  function qlTimeline($timeout, $window) {
    var adaptHeight = function(element) {
      element.height(element.parent().parent().parent().height());
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
        });
      }
    }
  }

  var timelineController = angular.createAuthorizedController('TimelineController', ['$scope', '$rootScope', '$timeout', 'terminal', function($scope, $rootScope, $timeout, terminal) {
    // List of all events
    $scope.events = [];

    var socketMessage = function(event) {
      parseInput(event.data);
    } ;

    // Get WebSocket url from attribute
    var ws = new WebSocket($scope.wsUrl);

    // Handle messages from WebSocket
    ws.onmessage = socketMessage;


    $rootScope.$on('timeline:newWsUrl', function(event, newUrl) {
      ws.close();
      $timeout(function() {
        $scope.$apply(function () {
          $scope.events = [];
          $scope.allMessages = {};
        });
      });
      try {
        ws = new WebSocket(newUrl);
        ws.onmessage = socketMessage;
      } catch (e) {
        alert('Wrong WebSocket url' + e);
      }
    });

    // Create Event object from input string
    var createEvent = function(input, event_icon_class) {
      return {
        title: input[3],
        timestamp: input[2],
        text: input[4],
        event_icon_class: event_icon_class,
        id: btoa(input[3]),
        isInfoCollapsed: true
      }
    };

    var updateCard = function(title, eventIconClass, time) {
      var card = $('#' + btoa(title).substr(0, 7));
      card.children('span').removeClass('event-icon-primary').addClass(eventIconClass);
      var timeLabel = card.children('section').children('footer').children('ul').children('li').children('a');
      timeLabel.text((time - timeLabel.attr('data-original')) + ' seconds');
    };

    // Store all messages
    $scope.allMessages = {};

    var currentId = '';

    function parseInput(input) {
      var result = input.split(',');

      switch (result[0]) {
        case '****':
          if (result[1] == '[') {
            currentId = result[3];
            $scope.$apply(function () {
              $scope.events.push(createEvent(result, 'event-icon-primary'));
            });
          } else if (result[1] == ']') {
            updateCard(result[3], 'event-icon-primary', result[2]);
            currentId = '';
          }
          break;
        case '????':
          if (result[1] == '[') {
            currentId = result[3];
            $scope.$apply(function () {
              $scope.events.push(createEvent(result, 'event-icon-warning'));
            });
          } else {
            updateCard(result[3], 'event-icon-warning', result[2]);
          }
          break;
        case '!!!!':
          if (result[1] == '[') {
            currentId = result[3];
            $scope.$apply(function () {
              $scope.events.push(createEvent(result, 'event-icon-danger'));
            });
          } else {
            updateCard(result[3], 'event-icon-danger', result[2]);
          }
          break;
        default:
          if (input) {
            // Prevent undefined string
            if (!$scope.allMessages[currentId]) {
              $scope.allMessages[currentId] = '';
            }
            $scope.allMessages[currentId] += input + '\n';
          }
      }

      // Auto scroll after adding new card
      var elem = document.getElementById('timeline');
      elem.scrollTop = elem.scrollHeight;
    }

    $scope.showDetails = function(title){
      var card = $('#' + btoa(title).substr(0, 7));
      var domTerminal = card.children('section').children('footer').children('div');
      var _terminal = terminal.initTerminalByObject(domTerminal.children('div'), {greetings: false, enabled : false});

      _terminal.disable();

      if (!!domTerminal.attr('collapse')) {
        _terminal.clear();
        _terminal.echo($scope.allMessages[title]);
        domTerminal.toggle();
        domTerminal.css('height', '100%');
      } else {
        _terminal.clear();
        domTerminal.toggle();
      }
    };
  }]);

  terminalModule.controller(timelineController);

})();
