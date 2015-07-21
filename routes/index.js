var express = require('express');
var router = express.Router();

var TeleporterApi = new (require('./../modules/teleporterApi'));
var TeleportResultFormatter = require('./../modules/teleporterResultFormatter');

var request = require('request');

var SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';

var responseToRequest = function(req, res, next) {

    console.log(req);

    var URL_REGEX = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

    var url = req.body && req.body.text ? req.body.text.match(URL_REGEX)[0] : false;

    res.setHeader('Content-Type', 'application/json');

    if (url) {

        TeleporterApi.getUrls(url).then(function resolve (response) {

            request.post({
                url: SLACK_WEBHOOK_URL,
                json: true,
                body: {
                    'text': TeleportResultFormatter.formatToSlackUrlString(response.alternates).join(', ')
                }
            });

            res.setStatus(200).send();
        }, function reject (error) {

            res.setStatus(500).send(error);
        });
    } else {

        res.setStatus(500).send(error);
    }


};

/* GET home page. */
router.get('/teleport', responseToRequest);

router.post('/teleport', responseToRequest);

module.exports = router;
