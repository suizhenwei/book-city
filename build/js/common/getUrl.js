"use strict";define(function(){return function(i){var r;return window.location.search.substr(1).split("&").map(function(t,n){t.split("=")[0]===i&&(r=t.split("=")[1])}),r}});