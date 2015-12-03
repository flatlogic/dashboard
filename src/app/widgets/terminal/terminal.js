(function () {
    'use strict';

    angular
        .module('qorDash.widget.terminal')
        .directive('qlTerminal', qlTerminal)
        .service('terminalService', terminalService);

    function qlTerminal() {
        return {
            scope: {
                'wsUrl': '@'
            },
            controller: terminalController
        }
    }

    function terminalService() {
        return {
            initTerminalById: initTerminalById,
            initTerminalByObject: initTerminalByObject
        };

        function initTerminalById(id, params, sendCallback) {
            return $('#' + id).terminal(sendCallback, params);
        }

        function initTerminalByObject(object, params, sendCallback) {
            if (!params) {
                params = {greetings: false};
            }
            return object.terminal(sendCallback, params);
        }
    }

    function terminalController($scope, $attrs, terminalService) {

        var terminalItem = terminalService.initTerminalById($attrs.id ? $attrs.id : 'terminal', {greetings: false}, sendCommand);

        var ws = new WebSocket($scope.wsUrl);
        ws.onmessage = socketMessage;

        function clearTerminal() {
            terminalItem.clear();
        }

        function sendCommand(command) {
            try {
                ws.send(command);
            } catch (error) {
                terminalItem.echo(error);
            }
        }

        function socketMessage(event) {
            var data = parseInput(event.data);
            if (data) {
                terminalItem.echo(data);
            }
        }

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

        $scope.$on("$destroy", function () {
            ws.close();
        });
    }

})();
