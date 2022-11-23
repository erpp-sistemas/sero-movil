cordova.define("cordova-plugin-hkvideoplayer.HKVideoPlayer", function(require, exports, module) {
var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec');


var HKVideoPlayer = function() {
};

HKVideoPlayer.play = function(url) {
  exec(null, null, 'HKVideoPlayer', 'play', [url]);
};
HKVideoPlayer.playLocal = function(url) {
    exec(null, null, 'HKVideoPlayer', 'playLocal', [url]);
};
module.exports = HKVideoPlayer;

});
