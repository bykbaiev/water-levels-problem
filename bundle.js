/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/UI.ts":
/*!*******************!*\
  !*** ./src/UI.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "renderLandscape": () => (/* binding */ renderLandscape)
/* harmony export */ });
var QUERY = {
    LANDSCAPE: '#landscape',
};
var BOARD_SIZE = {
    WIDTH: 1000,
    HEIGHT: 500,
};
var getSegmentEl = function (width, height) { return function (segment) {
    var segmentHeight = segment.height, water = segment.water;
    return "\n        <div class=\"segment\" style=\"width: " + width + "px\">\n            <div class=\"water\" style=\"height: " + water * height + "px\" />\n            <div class=\"water\" style=\"height: " + segmentHeight * height + "px\" />\n        </div>\n    ";
}; };
var getLandscapeEl = function (landscape) {
    var length = landscape.length;
    var maxHeight = Math.max.apply(Math, landscape.map(function (_a) {
        var height = _a.height;
        return height;
    }));
    if (length === 0) {
        return '<div class="empty">Please, provide the landscape</div>';
    }
    var segmentWidth = BOARD_SIZE.WIDTH / length;
    var segmentHeight = BOARD_SIZE.HEIGHT / (2 * maxHeight);
    var getSegmentElWithSize = getSegmentEl(segmentWidth, segmentHeight);
    return "\n        <div class=\"board\" style=\"width: " + BOARD_SIZE.WIDTH + "px; height: " + BOARD_SIZE.HEIGHT + "px;\">\n            " + landscape.map(getSegmentElWithSize) + "\n        </div>\n    ";
};
var renderLandscape = function (landscape) {
    document.querySelector(QUERY.LANDSCAPE).innerHTML = getLandscapeEl(landscape);
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _UI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UI */ "./src/UI.ts");
var __spreadArrays = (undefined && undefined.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

var input2 = [4, 1, 5, 2, 4, 9, 8, 7, 6, 8].map(function (height) { return ({
    height: height,
    water: 0,
}); });
var diff2 = [1.8, 4.8, 0.8, 3.8, 1.8, 0, 1, 2, 3, 1]; // for 2 hours
var result2 = input2.map(function (_a, index) {
    var height = _a.height;
    return ({
        height: height,
        water: diff2[index],
    });
});
var sum = function (a, b) { return a + b; };
var subtract = function (a, b) { return Number((a - b).toFixed(5)); };
var isEqual = function (left, right) {
    return left.length === right.length &&
        left.every(function (el, i) { return el.height === right[i].height && el.water === right[i].water; });
};
var WATER_PER_TIME = 1;
var getWhole = function (landscape) {
    return landscape.reduce(function (accum, _a) {
        var height = _a.height, water = _a.water;
        return accum + height + water;
    }, 0);
};
var howMuch = function (landscape, targetHeight) {
    return subtract(targetHeight * landscape.length, getWhole(landscape));
};
var spreadWaterLevel = function (landscape) {
    console.log({ landscape: landscape });
    if (landscape.length < 2) {
        return landscape;
    }
    var max = Math.max.apply(Math, landscape.map(function (_a) {
        var height = _a.height;
        return height;
    }));
    var square = max * landscape.length;
    var whole = getWhole(landscape);
    if (square <= whole) {
        var level_1 = whole / landscape.length;
        console.log({ level: level_1 });
        return landscape.map(function (_a) {
            var height = _a.height;
            return ({
                height: height,
                water: subtract(level_1, height),
            });
        });
    }
    var highestSegments = landscape.filter(function (_a) {
        var height = _a.height;
        return height === max;
    });
    var maxWaterLevel = Math.max.apply(Math, highestSegments.map(function (_a) {
        var water = _a.water;
        return water;
    }));
    var index = landscape.findIndex(function (_a) {
        var height = _a.height, water = _a.water;
        return height === max && water === maxWaterLevel;
    });
    var maxSegment = landscape[index];
    var left = landscape.slice(0, index);
    var right = landscape.slice(index + 1);
    var leftNeeded = howMuch(left, max);
    var rightNeeded = howMuch(right, max);
    var halfOfWater = maxWaterLevel / 2;
    console.log({ maxWaterLevel: maxWaterLevel, halfOfWater: halfOfWater });
    console.log({ leftNeeded: leftNeeded, rightNeeded: rightNeeded });
    if (leftNeeded >= halfOfWater && rightNeeded >= halfOfWater) {
        return __spreadArrays(spreadWaterLevel(left.map(function (v, i) {
            return i === left.length - 1
                ? { height: v.height, water: v.water + halfOfWater }
                : v;
        })), [
            { height: maxSegment.height, water: 0 }
        ], spreadWaterLevel(right.map(function (v, i) {
            return i === 0
                ? { height: v.height, water: v.water + halfOfWater }
                : v;
        })));
    }
    if (leftNeeded < halfOfWater) {
        return __spreadArrays(spreadWaterLevel(left.map(function (v, i) {
            return i === left.length - 1
                ? { height: v.height, water: v.water + leftNeeded }
                : v;
        })), [
            { height: maxSegment.height, water: 0 }
        ], spreadWaterLevel(right.map(function (v, i) {
            return i === 0
                ? {
                    height: v.height,
                    water: subtract(v.water + maxWaterLevel, leftNeeded),
                }
                : v;
        })));
    }
    return __spreadArrays(spreadWaterLevel(left.map(function (v, i) {
        return i === left.length - 1
            ? {
                height: v.height,
                water: subtract(v.water + maxWaterLevel, rightNeeded),
            }
            : v;
    })), [
        { height: maxSegment.height, water: 0 }
    ], spreadWaterLevel(right.map(function (v, i) {
        return i === 0 ? { height: v.height, water: v.water + rightNeeded } : v;
    })));
};
var getWaterLevels = function (landscape, time) {
    var diff = time * WATER_PER_TIME;
    return spreadWaterLevel(landscape.map(function (_a) {
        var height = _a.height, water = _a.water;
        return ({ height: height, water: water + diff });
    }));
};
var res = getWaterLevels(input2, 2);
console.log({ res: res, equal: isEqual(res, result2) });
console.log('lalalala');
(0,_UI__WEBPACK_IMPORTED_MODULE_0__.renderLandscape)(input2);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93YXRlci1sZXZlbHMtcHJvYmxlbS8uL3NyYy9VSS50cyIsIndlYnBhY2s6Ly93YXRlci1sZXZlbHMtcHJvYmxlbS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly93YXRlci1sZXZlbHMtcHJvYmxlbS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd2F0ZXItbGV2ZWxzLXByb2JsZW0vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly93YXRlci1sZXZlbHMtcHJvYmxlbS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3dhdGVyLWxldmVscy1wcm9ibGVtLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFGQUFxRixxQ0FBcUM7QUFDMUg7QUFDTztBQUNQO0FBQ0E7Ozs7Ozs7VUMzQkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDckJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7Ozs7Ozs7O0FDTkEsc0JBQXNCLFNBQUksSUFBSSxTQUFJO0FBQ2xDLGlEQUFpRCxRQUFRO0FBQ3pELHdDQUF3QyxRQUFRO0FBQ2hELHdEQUF3RCxRQUFRO0FBQ2hFO0FBQ0E7QUFDQTtBQUN1QztBQUN2QyxtRUFBbUU7QUFDbkU7QUFDQTtBQUNBLENBQUMsRUFBRSxFQUFFO0FBQ0wscURBQXFEO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQztBQUNELDJCQUEyQixjQUFjO0FBQ3pDLGdDQUFnQyxtQ0FBbUM7QUFDbkU7QUFDQTtBQUNBLHFDQUFxQyxxRUFBcUUsRUFBRTtBQUM1RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQix1QkFBdUI7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLGlCQUFpQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQix5REFBeUQ7QUFDMUUsaUJBQWlCLG1EQUFtRDtBQUNwRTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQSxTQUFTO0FBQ1QsYUFBYTtBQUNiO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQSxTQUFTO0FBQ1QsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsU0FBUztBQUNUO0FBQ0EsMEJBQTBCLGlEQUFpRDtBQUMzRSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixzQ0FBc0M7QUFDdkQsS0FBSztBQUNMO0FBQ0E7QUFDQSxhQUFhLHlDQUF5QztBQUN0RDtBQUNBLG9EQUFlIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBRVUVSWSA9IHtcbiAgICBMQU5EU0NBUEU6ICcjbGFuZHNjYXBlJyxcbn07XG52YXIgQk9BUkRfU0laRSA9IHtcbiAgICBXSURUSDogMTAwMCxcbiAgICBIRUlHSFQ6IDUwMCxcbn07XG52YXIgZ2V0U2VnbWVudEVsID0gZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQpIHsgcmV0dXJuIGZ1bmN0aW9uIChzZWdtZW50KSB7XG4gICAgdmFyIHNlZ21lbnRIZWlnaHQgPSBzZWdtZW50LmhlaWdodCwgd2F0ZXIgPSBzZWdtZW50LndhdGVyO1xuICAgIHJldHVybiBcIlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwic2VnbWVudFxcXCIgc3R5bGU9XFxcIndpZHRoOiBcIiArIHdpZHRoICsgXCJweFxcXCI+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwid2F0ZXJcXFwiIHN0eWxlPVxcXCJoZWlnaHQ6IFwiICsgd2F0ZXIgKiBoZWlnaHQgKyBcInB4XFxcIiAvPlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcIndhdGVyXFxcIiBzdHlsZT1cXFwiaGVpZ2h0OiBcIiArIHNlZ21lbnRIZWlnaHQgKiBoZWlnaHQgKyBcInB4XFxcIiAvPlxcbiAgICAgICAgPC9kaXY+XFxuICAgIFwiO1xufTsgfTtcbnZhciBnZXRMYW5kc2NhcGVFbCA9IGZ1bmN0aW9uIChsYW5kc2NhcGUpIHtcbiAgICB2YXIgbGVuZ3RoID0gbGFuZHNjYXBlLmxlbmd0aDtcbiAgICB2YXIgbWF4SGVpZ2h0ID0gTWF0aC5tYXguYXBwbHkoTWF0aCwgbGFuZHNjYXBlLm1hcChmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIGhlaWdodCA9IF9hLmhlaWdodDtcbiAgICAgICAgcmV0dXJuIGhlaWdodDtcbiAgICB9KSk7XG4gICAgaWYgKGxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gJzxkaXYgY2xhc3M9XCJlbXB0eVwiPlBsZWFzZSwgcHJvdmlkZSB0aGUgbGFuZHNjYXBlPC9kaXY+JztcbiAgICB9XG4gICAgdmFyIHNlZ21lbnRXaWR0aCA9IEJPQVJEX1NJWkUuV0lEVEggLyBsZW5ndGg7XG4gICAgdmFyIHNlZ21lbnRIZWlnaHQgPSBCT0FSRF9TSVpFLkhFSUdIVCAvICgyICogbWF4SGVpZ2h0KTtcbiAgICB2YXIgZ2V0U2VnbWVudEVsV2l0aFNpemUgPSBnZXRTZWdtZW50RWwoc2VnbWVudFdpZHRoLCBzZWdtZW50SGVpZ2h0KTtcbiAgICByZXR1cm4gXCJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImJvYXJkXFxcIiBzdHlsZT1cXFwid2lkdGg6IFwiICsgQk9BUkRfU0laRS5XSURUSCArIFwicHg7IGhlaWdodDogXCIgKyBCT0FSRF9TSVpFLkhFSUdIVCArIFwicHg7XFxcIj5cXG4gICAgICAgICAgICBcIiArIGxhbmRzY2FwZS5tYXAoZ2V0U2VnbWVudEVsV2l0aFNpemUpICsgXCJcXG4gICAgICAgIDwvZGl2PlxcbiAgICBcIjtcbn07XG5leHBvcnQgdmFyIHJlbmRlckxhbmRzY2FwZSA9IGZ1bmN0aW9uIChsYW5kc2NhcGUpIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFFVRVJZLkxBTkRTQ0FQRSkuaW5uZXJIVE1MID0gZ2V0TGFuZHNjYXBlRWwobGFuZHNjYXBlKTtcbn07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgX19zcHJlYWRBcnJheXMgPSAodGhpcyAmJiB0aGlzLl9fc3ByZWFkQXJyYXlzKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xuICAgIHJldHVybiByO1xufTtcbmltcG9ydCB7IHJlbmRlckxhbmRzY2FwZSB9IGZyb20gJy4vVUknO1xudmFyIGlucHV0MiA9IFs0LCAxLCA1LCAyLCA0LCA5LCA4LCA3LCA2LCA4XS5tYXAoZnVuY3Rpb24gKGhlaWdodCkgeyByZXR1cm4gKHtcbiAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICB3YXRlcjogMCxcbn0pOyB9KTtcbnZhciBkaWZmMiA9IFsxLjgsIDQuOCwgMC44LCAzLjgsIDEuOCwgMCwgMSwgMiwgMywgMV07IC8vIGZvciAyIGhvdXJzXG52YXIgcmVzdWx0MiA9IGlucHV0Mi5tYXAoZnVuY3Rpb24gKF9hLCBpbmRleCkge1xuICAgIHZhciBoZWlnaHQgPSBfYS5oZWlnaHQ7XG4gICAgcmV0dXJuICh7XG4gICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgICB3YXRlcjogZGlmZjJbaW5kZXhdLFxuICAgIH0pO1xufSk7XG52YXIgc3VtID0gZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGEgKyBiOyB9O1xudmFyIHN1YnRyYWN0ID0gZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIE51bWJlcigoYSAtIGIpLnRvRml4ZWQoNSkpOyB9O1xudmFyIGlzRXF1YWwgPSBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHtcbiAgICByZXR1cm4gbGVmdC5sZW5ndGggPT09IHJpZ2h0Lmxlbmd0aCAmJlxuICAgICAgICBsZWZ0LmV2ZXJ5KGZ1bmN0aW9uIChlbCwgaSkgeyByZXR1cm4gZWwuaGVpZ2h0ID09PSByaWdodFtpXS5oZWlnaHQgJiYgZWwud2F0ZXIgPT09IHJpZ2h0W2ldLndhdGVyOyB9KTtcbn07XG52YXIgV0FURVJfUEVSX1RJTUUgPSAxO1xudmFyIGdldFdob2xlID0gZnVuY3Rpb24gKGxhbmRzY2FwZSkge1xuICAgIHJldHVybiBsYW5kc2NhcGUucmVkdWNlKGZ1bmN0aW9uIChhY2N1bSwgX2EpIHtcbiAgICAgICAgdmFyIGhlaWdodCA9IF9hLmhlaWdodCwgd2F0ZXIgPSBfYS53YXRlcjtcbiAgICAgICAgcmV0dXJuIGFjY3VtICsgaGVpZ2h0ICsgd2F0ZXI7XG4gICAgfSwgMCk7XG59O1xudmFyIGhvd011Y2ggPSBmdW5jdGlvbiAobGFuZHNjYXBlLCB0YXJnZXRIZWlnaHQpIHtcbiAgICByZXR1cm4gc3VidHJhY3QodGFyZ2V0SGVpZ2h0ICogbGFuZHNjYXBlLmxlbmd0aCwgZ2V0V2hvbGUobGFuZHNjYXBlKSk7XG59O1xudmFyIHNwcmVhZFdhdGVyTGV2ZWwgPSBmdW5jdGlvbiAobGFuZHNjYXBlKSB7XG4gICAgY29uc29sZS5sb2coeyBsYW5kc2NhcGU6IGxhbmRzY2FwZSB9KTtcbiAgICBpZiAobGFuZHNjYXBlLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgcmV0dXJuIGxhbmRzY2FwZTtcbiAgICB9XG4gICAgdmFyIG1heCA9IE1hdGgubWF4LmFwcGx5KE1hdGgsIGxhbmRzY2FwZS5tYXAoZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciBoZWlnaHQgPSBfYS5oZWlnaHQ7XG4gICAgICAgIHJldHVybiBoZWlnaHQ7XG4gICAgfSkpO1xuICAgIHZhciBzcXVhcmUgPSBtYXggKiBsYW5kc2NhcGUubGVuZ3RoO1xuICAgIHZhciB3aG9sZSA9IGdldFdob2xlKGxhbmRzY2FwZSk7XG4gICAgaWYgKHNxdWFyZSA8PSB3aG9sZSkge1xuICAgICAgICB2YXIgbGV2ZWxfMSA9IHdob2xlIC8gbGFuZHNjYXBlLmxlbmd0aDtcbiAgICAgICAgY29uc29sZS5sb2coeyBsZXZlbDogbGV2ZWxfMSB9KTtcbiAgICAgICAgcmV0dXJuIGxhbmRzY2FwZS5tYXAoZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gX2EuaGVpZ2h0O1xuICAgICAgICAgICAgcmV0dXJuICh7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgICAgICAgICAgd2F0ZXI6IHN1YnRyYWN0KGxldmVsXzEsIGhlaWdodCksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHZhciBoaWdoZXN0U2VnbWVudHMgPSBsYW5kc2NhcGUuZmlsdGVyKGZ1bmN0aW9uIChfYSkge1xuICAgICAgICB2YXIgaGVpZ2h0ID0gX2EuaGVpZ2h0O1xuICAgICAgICByZXR1cm4gaGVpZ2h0ID09PSBtYXg7XG4gICAgfSk7XG4gICAgdmFyIG1heFdhdGVyTGV2ZWwgPSBNYXRoLm1heC5hcHBseShNYXRoLCBoaWdoZXN0U2VnbWVudHMubWFwKGZ1bmN0aW9uIChfYSkge1xuICAgICAgICB2YXIgd2F0ZXIgPSBfYS53YXRlcjtcbiAgICAgICAgcmV0dXJuIHdhdGVyO1xuICAgIH0pKTtcbiAgICB2YXIgaW5kZXggPSBsYW5kc2NhcGUuZmluZEluZGV4KGZ1bmN0aW9uIChfYSkge1xuICAgICAgICB2YXIgaGVpZ2h0ID0gX2EuaGVpZ2h0LCB3YXRlciA9IF9hLndhdGVyO1xuICAgICAgICByZXR1cm4gaGVpZ2h0ID09PSBtYXggJiYgd2F0ZXIgPT09IG1heFdhdGVyTGV2ZWw7XG4gICAgfSk7XG4gICAgdmFyIG1heFNlZ21lbnQgPSBsYW5kc2NhcGVbaW5kZXhdO1xuICAgIHZhciBsZWZ0ID0gbGFuZHNjYXBlLnNsaWNlKDAsIGluZGV4KTtcbiAgICB2YXIgcmlnaHQgPSBsYW5kc2NhcGUuc2xpY2UoaW5kZXggKyAxKTtcbiAgICB2YXIgbGVmdE5lZWRlZCA9IGhvd011Y2gobGVmdCwgbWF4KTtcbiAgICB2YXIgcmlnaHROZWVkZWQgPSBob3dNdWNoKHJpZ2h0LCBtYXgpO1xuICAgIHZhciBoYWxmT2ZXYXRlciA9IG1heFdhdGVyTGV2ZWwgLyAyO1xuICAgIGNvbnNvbGUubG9nKHsgbWF4V2F0ZXJMZXZlbDogbWF4V2F0ZXJMZXZlbCwgaGFsZk9mV2F0ZXI6IGhhbGZPZldhdGVyIH0pO1xuICAgIGNvbnNvbGUubG9nKHsgbGVmdE5lZWRlZDogbGVmdE5lZWRlZCwgcmlnaHROZWVkZWQ6IHJpZ2h0TmVlZGVkIH0pO1xuICAgIGlmIChsZWZ0TmVlZGVkID49IGhhbGZPZldhdGVyICYmIHJpZ2h0TmVlZGVkID49IGhhbGZPZldhdGVyKSB7XG4gICAgICAgIHJldHVybiBfX3NwcmVhZEFycmF5cyhzcHJlYWRXYXRlckxldmVsKGxlZnQubWFwKGZ1bmN0aW9uICh2LCBpKSB7XG4gICAgICAgICAgICByZXR1cm4gaSA9PT0gbGVmdC5sZW5ndGggLSAxXG4gICAgICAgICAgICAgICAgPyB7IGhlaWdodDogdi5oZWlnaHQsIHdhdGVyOiB2LndhdGVyICsgaGFsZk9mV2F0ZXIgfVxuICAgICAgICAgICAgICAgIDogdjtcbiAgICAgICAgfSkpLCBbXG4gICAgICAgICAgICB7IGhlaWdodDogbWF4U2VnbWVudC5oZWlnaHQsIHdhdGVyOiAwIH1cbiAgICAgICAgXSwgc3ByZWFkV2F0ZXJMZXZlbChyaWdodC5tYXAoZnVuY3Rpb24gKHYsIGkpIHtcbiAgICAgICAgICAgIHJldHVybiBpID09PSAwXG4gICAgICAgICAgICAgICAgPyB7IGhlaWdodDogdi5oZWlnaHQsIHdhdGVyOiB2LndhdGVyICsgaGFsZk9mV2F0ZXIgfVxuICAgICAgICAgICAgICAgIDogdjtcbiAgICAgICAgfSkpKTtcbiAgICB9XG4gICAgaWYgKGxlZnROZWVkZWQgPCBoYWxmT2ZXYXRlcikge1xuICAgICAgICByZXR1cm4gX19zcHJlYWRBcnJheXMoc3ByZWFkV2F0ZXJMZXZlbChsZWZ0Lm1hcChmdW5jdGlvbiAodiwgaSkge1xuICAgICAgICAgICAgcmV0dXJuIGkgPT09IGxlZnQubGVuZ3RoIC0gMVxuICAgICAgICAgICAgICAgID8geyBoZWlnaHQ6IHYuaGVpZ2h0LCB3YXRlcjogdi53YXRlciArIGxlZnROZWVkZWQgfVxuICAgICAgICAgICAgICAgIDogdjtcbiAgICAgICAgfSkpLCBbXG4gICAgICAgICAgICB7IGhlaWdodDogbWF4U2VnbWVudC5oZWlnaHQsIHdhdGVyOiAwIH1cbiAgICAgICAgXSwgc3ByZWFkV2F0ZXJMZXZlbChyaWdodC5tYXAoZnVuY3Rpb24gKHYsIGkpIHtcbiAgICAgICAgICAgIHJldHVybiBpID09PSAwXG4gICAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogdi5oZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIHdhdGVyOiBzdWJ0cmFjdCh2LndhdGVyICsgbWF4V2F0ZXJMZXZlbCwgbGVmdE5lZWRlZCksXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDogdjtcbiAgICAgICAgfSkpKTtcbiAgICB9XG4gICAgcmV0dXJuIF9fc3ByZWFkQXJyYXlzKHNwcmVhZFdhdGVyTGV2ZWwobGVmdC5tYXAoZnVuY3Rpb24gKHYsIGkpIHtcbiAgICAgICAgcmV0dXJuIGkgPT09IGxlZnQubGVuZ3RoIC0gMVxuICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB2LmhlaWdodCxcbiAgICAgICAgICAgICAgICB3YXRlcjogc3VidHJhY3Qodi53YXRlciArIG1heFdhdGVyTGV2ZWwsIHJpZ2h0TmVlZGVkKSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogdjtcbiAgICB9KSksIFtcbiAgICAgICAgeyBoZWlnaHQ6IG1heFNlZ21lbnQuaGVpZ2h0LCB3YXRlcjogMCB9XG4gICAgXSwgc3ByZWFkV2F0ZXJMZXZlbChyaWdodC5tYXAoZnVuY3Rpb24gKHYsIGkpIHtcbiAgICAgICAgcmV0dXJuIGkgPT09IDAgPyB7IGhlaWdodDogdi5oZWlnaHQsIHdhdGVyOiB2LndhdGVyICsgcmlnaHROZWVkZWQgfSA6IHY7XG4gICAgfSkpKTtcbn07XG52YXIgZ2V0V2F0ZXJMZXZlbHMgPSBmdW5jdGlvbiAobGFuZHNjYXBlLCB0aW1lKSB7XG4gICAgdmFyIGRpZmYgPSB0aW1lICogV0FURVJfUEVSX1RJTUU7XG4gICAgcmV0dXJuIHNwcmVhZFdhdGVyTGV2ZWwobGFuZHNjYXBlLm1hcChmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIGhlaWdodCA9IF9hLmhlaWdodCwgd2F0ZXIgPSBfYS53YXRlcjtcbiAgICAgICAgcmV0dXJuICh7IGhlaWdodDogaGVpZ2h0LCB3YXRlcjogd2F0ZXIgKyBkaWZmIH0pO1xuICAgIH0pKTtcbn07XG52YXIgcmVzID0gZ2V0V2F0ZXJMZXZlbHMoaW5wdXQyLCAyKTtcbmNvbnNvbGUubG9nKHsgcmVzOiByZXMsIGVxdWFsOiBpc0VxdWFsKHJlcywgcmVzdWx0MikgfSk7XG5jb25zb2xlLmxvZygnbGFsYWxhbGEnKTtcbnJlbmRlckxhbmRzY2FwZShpbnB1dDIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==