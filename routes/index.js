var express = require('express');
var router = express.Router();

var TeleporterApi = new (require('./../modules/teleporterApi'));
var TeleportResultFormatter = require('./../modules/teleporterResultFormatter');

var request = require('request');

var SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';

var responseToRequest = function(req, res, next) {

    var URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

    var url = req.body && req.body.text ? req.body.text.match(URL_REGEX)[0] : false;

    res.setHeader('Content-Type', 'application/json');

    if (url) {

        TeleporterApi.getUrls(url).then(function (response) {

            request.post({
                url: SLACK_WEBHOOK_URL,
                json: true,
                body: {
                    'text': "OK, here are some other versions: " + TeleportResultFormatter.formatToSlackUrlString(response.alternates).join(', ')
                }
            });

            res.status(200).send();
        }, function (error) {

            request.post({
                url: SLACK_WEBHOOK_URL,
                json: true,
                body: {
                    'text': "I couldn't find that url in teleporter :-("
                }
            });

            res.status(500).send();
        });
    } else {

        res.status(500).send("Did you post a url?");
    }


};

/* GET home page. */
router.get('/teleport', responseToRequest);

router.post('/teleport', responseToRequest);

module.exports = router;
