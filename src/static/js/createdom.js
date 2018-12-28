var message=require('./../data/index.json');
module.exports = function() {
    var greet = document.createElement('div');
    greet.innerHTML = "<p>" + message.name + "</p>" + "<p>" + message.content + "</p>" + "<p>" + message.start + "</p>";
    return greet;
}