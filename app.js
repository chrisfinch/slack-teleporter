var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var TeleporterApi = new (require('./modules/teleporterApi'));
var TeleportResultFormatter = require('./modules/teleporterResultFormatter');

var _ = require('lodash');

var Slack = require('slack-client');

var token = "xoxb-8032694705-VdbzPry1KbNqbMN5OhKFGaAP",
    autoReconnect = true,
    autoMark = true;

var slack = new Slack(token, autoReconnect, autoMark)

slack.on('open', function () {
    var channels = [],
        groups = [],
        unreads = slack.getUnreadCount();

    console.info("Slack Bot Logged in.")

});

slack.on('message', function (message) {

    var channel = slack.getChannelGroupOrDMByID(message.channel);
    var user = slack.getUserByID(message.user);

    if (message.type == 'message' && message.text && user && user.name !== 'teleporterbot') {

        var URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

        var matches = message.text.match(URL_REGEX)

        if (matches && matches.length) {

            console.info("Found a URL");

            TeleporterApi.getUrls(matches[0]).then(function (response) {

                console.info("Got a teleporter result>>");

                var attachment = {
                  "title": response.identifiers.webTitle,
                  "fallback": response.identifiers.webTitle,
                  "text": "Here are the results that TeleporterBot found for you :-)",
                  "fields": [],
                  "color": "#ff69b4",
                  "mrkdwn_in": ["text", "title", "fallback"]
                };

                var grouped = _.groupBy(response.alternates, function (a) {
                    return a.page.system;
                });

                for (var key in grouped) {

                    var a = {
                        "title": key,
                        "value": "",
                        "short": true
                    };
                    grouped[key].forEach(function (g) {
                        a.value += (TeleportResultFormatter.formatLink(g) + " ");
                    });

                    attachment.fields.push(a);
                }

                _.map(grouped, function (group) {
                    console.log(group);
                    // attachment.fields.push({
                    //     //"title":  alternate.page.system + ':' + alternate.page.component,
                    //     "value": TeleportResultFormatter.formatLink(alternate),
                    //     "short": true
                    // });
                });

                msgpack = {
                  type: "message",
                  username: "TeleporterBot",
                  text: "Looks like you mentioned a guardian URL!",
                  icon_url: "https://lh5.ggpht.com/JM5DXvrl0c7ZY0OqFL5bnkkb0dQ7o1NfnRiQI22VnGiK4q2SjZi3DhAv4gAlXiRSoA=w300",
                  attachments: JSON.stringify([attachment])
                }

                msgpack.token = token
                msgpack.channel = channel.id

                slack._apiCall("chat.postMessage", msgpack, function(err, res){
                  console.error("postMessage result:", err, res)
                })

            }, function (error) {
                channel.send("Doesn't look like a guardian url...");
            });
        }

    }


});

slack.login();

module.exports = app;
