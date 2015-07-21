
// <https://alert-system.com/alerts/1234|Click here>

function formatLink (alternate) {
    return '<' + alternate.uri + '|' + alternate.page.system + ':' + alternate.page.component + '>';
}

module.exports = {
    formatToSlackUrlString: function (alternates) {

        var links = [];

        alternates.forEach(function (alternate) {
            links.push(formatLink(alternate));
        });

        return links;
    }
}
