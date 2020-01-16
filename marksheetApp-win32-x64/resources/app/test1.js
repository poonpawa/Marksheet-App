var $ = require('jquery');
var contentElement = $('#my-content');
var addButtonElement = $('#add-content');
var titleInput = $('#title-input');
var bodyInput = $('#body-input');
var Handlebars = require('handlebars');
var contentTemplate = Handlebars.compile($('#entry-template').text());
function addContent() {
    var newData = contentTemplate({
        title: titleInput.val(),
        body: bodyInput.val()
    });
    contentElement.html(newData + contentElement.html());
    // clean up inputs
    titleInput.val('');
    bodyInput.val('');
}
addButtonElement.on('click', addContent);