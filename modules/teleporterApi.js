var request = require('request');
var Q = require('q');

// https://teleporter.gutools.co.uk/api/pages?uri=http://www.theguardian.com/politics/2015/jul/21/welfare-bill-labour-emotional-trauma-revolt-david-blunkett-harriet-harman

var TeleporterApi = function () {

    var TELEPORTER_API_BASE_URL = 'https://teleporter.gutools.co.uk/api/'

    function getUrls (queryUrl) {

        return Q.Promise(function (resolve, reject) {
            request.get({
                url: TELEPORTER_API_BASE_URL + 'pages',
                // strictSSL: false,
                // rejectUnauthorized : false,
                // 'auth': {
                //   'user': 'capi',
                //   'pass': appConfig.previewApiPassword,
                //   'sendImmediately': false
                // },
                qs: {
                    'uri': queryUrl
                }
            }, function(error, response, body) {

                if (response.statusCode === 200 || error) {
                    console.log('RESOLVE', JSON.parse(body));
                    resolve(JSON.parse(body));
                } else {
                    reject(error);
                }
            });
        })
    }

    return {
        getUrls: getUrls
    }

}

module.exports = TeleporterApi;
