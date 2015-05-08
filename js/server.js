var http = require('http'),
    url = require('url'),
    fs = require('fs');


var server = http.createServer(function (request, response) {
    var urlParts = url.parse(request.url);
    response.writeHead(200, {'Content-Type': 'application/text', 'Access-Control-Allow-Origin': '*'});
    switch (urlParts.path) {
        case '/auth':
            response.end('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb21haW4iOiJxb3IuaW8iLCJleHAiOjE0MzM0MDQ2NjcsInBhc3Nwb3J0L0BpZCI6ImEwYThkZWQ3LWQ5MTAtMTFlNC05ZDFiLTAyNDJhYzExMDAwYyIsInBhc3Nwb3J0L0BzY29wZXMiOiJyZWdpc3Rlcl91c2VyLGFjY291bnRfcmVhZG9ubHksYWNjb3VudF91cGRhdGUsYWNjZXNzX3NvY2lhbF9uZXR3b3JrX3Byb2ZpbGUsYXBpX2FkbWluIiwicGFzc3BvcnQvQHN0YXR1cyI6IiJ9.WvUCBOrIiGKMi45--7S34BBj3E-VroqV5khZcxG9Jr4');
            break;
        case '/pjson':
            response.end('{ \
            "SomePageController": "update_account", \
            "SomeWidget": "update_account", \
            "UpdateAccountController":"update_account",\
            "UpdateAccountView":"update_account",\
            "ViewOnlyPageController":"view_account",\
            "ViewOnlyWidget":"view_account"\
    }');
        default:
            response.end('404');
    }
});

server.listen(8000);

console.log("Server running at http://127.0.0.1:8000/");