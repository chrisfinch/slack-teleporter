
// <https://alert-system.com/alerts/1234|Click here>

function formatLink (alternate) {
    console.log('called')
    return '<' + alternate.uri + '|' + alternate.page.component + ':' + alternate.page.facet + '>';
}

module.exports = {
    formatToSlackUrlString: function (alternates) {

        var links = [];

        alternates.forEach(function (alternate) {
            links.push(formatLink(alternate));
        });

        return links;
    },
    formatLink: formatLink
}
