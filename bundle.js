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
/* harmony export */   "renderLandscape": () => (/* binding */ renderLandscape),
/* harmony export */   "addListeners": () => (/* binding */ addListeners),
/* harmony export */   "showErrorMsg": () => (/* binding */ showErrorMsg),
/* harmony export */   "showResultMsg": () => (/* binding */ showResultMsg)
/* harmony export */ });
var QUERY = {
    LANDSCAPE: '#landscape',
    START_BTN: '#start',
    LANDSCAPE_INPUT: '#landscapeEl',
    TIME_INPUT: '#time',
    ERROR_MSG: '#error',
    RESULT_MSG: '#result',
};
var BOARD_SIZE = {
    WIDTH: 1000,
    HEIGHT: 500,
};
var ENTER_KEY = 'Enter';
var getSegmentEl = function (width, height) { return function (segment) {
    var segmentHeight = segment.height, water = segment.water;
    return "\n        <div class=\"segment\" style=\"width: " + width + "px\">\n            <div class=\"total\">" + (segmentHeight + water) + "</div>\n            <div class=\"water\" style=\"height: " + water * height + "px\"></div>\n            <div class=\"ground\" style=\"height: " + segmentHeight * height + "px\"></div>\n            <div class=\"water-level\">" + water + "</div>\n        </div>\n    ";
}; };
var getLandscapeEl = function (landscape) {
    var length = landscape.length;
    var maxHeight = Math.max.apply(Math, landscape.map(function (_a) {
        var height = _a.height, water = _a.water;
        return height + water;
    }));
    if (length === 0) {
        return "<div class=\"empty\" style=\"width: " + BOARD_SIZE.WIDTH + "px; height: " + BOARD_SIZE.HEIGHT + "px; line-height: " + BOARD_SIZE.HEIGHT + "px;\">Please, provide the landscape</div>";
    }
    var heightLimit = Math.floor(1.3 * maxHeight);
    var segmentWidth = BOARD_SIZE.WIDTH / length;
    var segmentHeight = BOARD_SIZE.HEIGHT / heightLimit;
    var getSegmentElWithSize = getSegmentEl(segmentWidth, segmentHeight);
    return "\n        <div class=\"board-wrapper\" style=\"width: " + BOARD_SIZE.WIDTH + "px; height: " + BOARD_SIZE.HEIGHT + "px;\">\n            " + Array(heightLimit).fill(0).map(function (_, i) { return "<div class=\"line\" style=\"height:" + segmentHeight + "px\"></div>"; }).join('') + "\n            <div class=\"board\">\n                " + landscape.map(getSegmentElWithSize).join('') + "\n                <div class=\"ruler\">\n                    " + Array(heightLimit).fill(0).map(function (_, i) { return "<div class=\"ruler-item\" style=\"height:" + segmentHeight + "px\"><div class=\"ruler-number\" style=\"bottom:-10px\">" + i + "</div></div>"; }).join('') + "\n                </div>\n            </div>\n        </div>\n    ";
};
var renderLandscape = function (landscape) {
    document.querySelector(QUERY.LANDSCAPE).innerHTML = getLandscapeEl(landscape);
};
var addListeners = function (onCalc) {
    var handler = function () {
        hideErrorMsg();
        hideResultMsg();
        onCalc(document.querySelector(QUERY.LANDSCAPE_INPUT).value, document.querySelector(QUERY.TIME_INPUT).value);
    };
    var keyPressHandler = function (event) {
        if (event.key === ENTER_KEY) {
            handler();
        }
    };
    document.querySelector(QUERY.START_BTN).addEventListener('click', handler);
    document.querySelector(QUERY.LANDSCAPE_INPUT).addEventListener('keypress', keyPressHandler);
    document.querySelector(QUERY.TIME_INPUT).addEventListener('keypress', keyPressHandler);
};
var showErrorMsg = function (msg) {
    document.querySelector(QUERY.ERROR_MSG).innerHTML = msg;
};
var hideErrorMsg = function () {
    document.querySelector(QUERY.ERROR_MSG).innerHTML = '';
};
var showResultMsg = function (msg) {
    document.querySelector(QUERY.RESULT_MSG).innerHTML = msg;
};
var hideResultMsg = function () {
    document.querySelector(QUERY.RESULT_MSG).innerHTML = '';
};


/***/ }),

/***/ "./src/algo.ts":
/*!*********************!*\
  !*** ./src/algo.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getWaterLevels": () => (/* binding */ getWaterLevels)
/* harmony export */ });
var __spreadArrays = (undefined && undefined.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var subtract = function (a, b) { return Number((a - b).toFixed(5)); };
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
/* harmony import */ var _algo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./algo */ "./src/algo.ts");


var onCalc = function (heightsValue, timeValue) {
    var heights = heightsValue.split(',').map(function (height) { return parseFloat(height); });
    var time = parseFloat(timeValue);
    if (heights.some(function (height) { return isNaN(height) || height < 0; })) {
        (0,_UI__WEBPACK_IMPORTED_MODULE_0__.showErrorMsg)('There is invalid landscape: every segment should be valid positive number');
        return;
    }
    if (isNaN(time) || time < 0) {
        (0,_UI__WEBPACK_IMPORTED_MODULE_0__.showErrorMsg)('There is invalid time period: it should be positive');
        return;
    }
    var landscape = heights.map(function (height) { return ({
        height: height,
        water: 0,
    }); });
    var waterLevel = (0,_algo__WEBPACK_IMPORTED_MODULE_1__.getWaterLevels)(landscape, time);
    (0,_UI__WEBPACK_IMPORTED_MODULE_0__.renderLandscape)(waterLevel);
    (0,_UI__WEBPACK_IMPORTED_MODULE_0__.showResultMsg)(waterLevel.map(function (_a) {
        var water = _a.water;
        return water;
    }).join(','));
};
(0,_UI__WEBPACK_IMPORTED_MODULE_0__.addListeners)(onCalc);
(0,_UI__WEBPACK_IMPORTED_MODULE_0__.renderLandscape)([]);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93YXRlci1sZXZlbHMtcHJvYmxlbS8uL3NyYy9VSS50cyIsIndlYnBhY2s6Ly93YXRlci1sZXZlbHMtcHJvYmxlbS8uL3NyYy9hbGdvLnRzIiwid2VicGFjazovL3dhdGVyLWxldmVscy1wcm9ibGVtL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dhdGVyLWxldmVscy1wcm9ibGVtL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93YXRlci1sZXZlbHMtcHJvYmxlbS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dhdGVyLWxldmVscy1wcm9ibGVtL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2F0ZXItbGV2ZWxzLXByb2JsZW0vLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QztBQUM3QztBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSwrRUFBK0UscUNBQXFDLDBDQUEwQztBQUM5SjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkZBQTZGLHFDQUFxQyxxRUFBcUUsOEVBQThFLEVBQUUsd09BQXdPLHNKQUFzSixFQUFFO0FBQ3ZwQjtBQUNPO0FBQ1A7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDN0RBLHNCQUFzQixTQUFJLElBQUksU0FBSTtBQUNsQyxpREFBaUQsUUFBUTtBQUN6RCx3Q0FBd0MsUUFBUTtBQUNoRCx3REFBd0QsUUFBUTtBQUNoRTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsbUNBQW1DO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0EsU0FBUztBQUNULGFBQWE7QUFDYjtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0EsU0FBUztBQUNULGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLFNBQVM7QUFDVDtBQUNBLDBCQUEwQixpREFBaUQ7QUFDM0UsS0FBSztBQUNMO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsc0NBQXNDO0FBQ3ZELEtBQUs7QUFDTDs7Ozs7OztVQ3hHQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0NyQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7Ozs7Ozs7O0FDTm1GO0FBQzNDO0FBQ3hDO0FBQ0EsaUVBQWlFLDJCQUEyQixFQUFFO0FBQzlGO0FBQ0Esd0NBQXdDLG9DQUFvQyxFQUFFO0FBQzlFLFFBQVEsaURBQVk7QUFDcEI7QUFDQTtBQUNBO0FBQ0EsUUFBUSxpREFBWTtBQUNwQjtBQUNBO0FBQ0EsbURBQW1EO0FBQ25EO0FBQ0E7QUFDQSxLQUFLLEVBQUUsRUFBRTtBQUNULHFCQUFxQixxREFBYztBQUNuQyxJQUFJLG9EQUFlO0FBQ25CLElBQUksa0RBQWE7QUFDakI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGlEQUFZO0FBQ1osb0RBQWUiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFFVRVJZID0ge1xuICAgIExBTkRTQ0FQRTogJyNsYW5kc2NhcGUnLFxuICAgIFNUQVJUX0JUTjogJyNzdGFydCcsXG4gICAgTEFORFNDQVBFX0lOUFVUOiAnI2xhbmRzY2FwZUVsJyxcbiAgICBUSU1FX0lOUFVUOiAnI3RpbWUnLFxuICAgIEVSUk9SX01TRzogJyNlcnJvcicsXG4gICAgUkVTVUxUX01TRzogJyNyZXN1bHQnLFxufTtcbnZhciBCT0FSRF9TSVpFID0ge1xuICAgIFdJRFRIOiAxMDAwLFxuICAgIEhFSUdIVDogNTAwLFxufTtcbnZhciBFTlRFUl9LRVkgPSAnRW50ZXInO1xudmFyIGdldFNlZ21lbnRFbCA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0KSB7IHJldHVybiBmdW5jdGlvbiAoc2VnbWVudCkge1xuICAgIHZhciBzZWdtZW50SGVpZ2h0ID0gc2VnbWVudC5oZWlnaHQsIHdhdGVyID0gc2VnbWVudC53YXRlcjtcbiAgICByZXR1cm4gXCJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcInNlZ21lbnRcXFwiIHN0eWxlPVxcXCJ3aWR0aDogXCIgKyB3aWR0aCArIFwicHhcXFwiPlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInRvdGFsXFxcIj5cIiArIChzZWdtZW50SGVpZ2h0ICsgd2F0ZXIpICsgXCI8L2Rpdj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ3YXRlclxcXCIgc3R5bGU9XFxcImhlaWdodDogXCIgKyB3YXRlciAqIGhlaWdodCArIFwicHhcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImdyb3VuZFxcXCIgc3R5bGU9XFxcImhlaWdodDogXCIgKyBzZWdtZW50SGVpZ2h0ICogaGVpZ2h0ICsgXCJweFxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwid2F0ZXItbGV2ZWxcXFwiPlwiICsgd2F0ZXIgKyBcIjwvZGl2PlxcbiAgICAgICAgPC9kaXY+XFxuICAgIFwiO1xufTsgfTtcbnZhciBnZXRMYW5kc2NhcGVFbCA9IGZ1bmN0aW9uIChsYW5kc2NhcGUpIHtcbiAgICB2YXIgbGVuZ3RoID0gbGFuZHNjYXBlLmxlbmd0aDtcbiAgICB2YXIgbWF4SGVpZ2h0ID0gTWF0aC5tYXguYXBwbHkoTWF0aCwgbGFuZHNjYXBlLm1hcChmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIGhlaWdodCA9IF9hLmhlaWdodCwgd2F0ZXIgPSBfYS53YXRlcjtcbiAgICAgICAgcmV0dXJuIGhlaWdodCArIHdhdGVyO1xuICAgIH0pKTtcbiAgICBpZiAobGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBcIjxkaXYgY2xhc3M9XFxcImVtcHR5XFxcIiBzdHlsZT1cXFwid2lkdGg6IFwiICsgQk9BUkRfU0laRS5XSURUSCArIFwicHg7IGhlaWdodDogXCIgKyBCT0FSRF9TSVpFLkhFSUdIVCArIFwicHg7IGxpbmUtaGVpZ2h0OiBcIiArIEJPQVJEX1NJWkUuSEVJR0hUICsgXCJweDtcXFwiPlBsZWFzZSwgcHJvdmlkZSB0aGUgbGFuZHNjYXBlPC9kaXY+XCI7XG4gICAgfVxuICAgIHZhciBoZWlnaHRMaW1pdCA9IE1hdGguZmxvb3IoMS4zICogbWF4SGVpZ2h0KTtcbiAgICB2YXIgc2VnbWVudFdpZHRoID0gQk9BUkRfU0laRS5XSURUSCAvIGxlbmd0aDtcbiAgICB2YXIgc2VnbWVudEhlaWdodCA9IEJPQVJEX1NJWkUuSEVJR0hUIC8gaGVpZ2h0TGltaXQ7XG4gICAgdmFyIGdldFNlZ21lbnRFbFdpdGhTaXplID0gZ2V0U2VnbWVudEVsKHNlZ21lbnRXaWR0aCwgc2VnbWVudEhlaWdodCk7XG4gICAgcmV0dXJuIFwiXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJib2FyZC13cmFwcGVyXFxcIiBzdHlsZT1cXFwid2lkdGg6IFwiICsgQk9BUkRfU0laRS5XSURUSCArIFwicHg7IGhlaWdodDogXCIgKyBCT0FSRF9TSVpFLkhFSUdIVCArIFwicHg7XFxcIj5cXG4gICAgICAgICAgICBcIiArIEFycmF5KGhlaWdodExpbWl0KS5maWxsKDApLm1hcChmdW5jdGlvbiAoXywgaSkgeyByZXR1cm4gXCI8ZGl2IGNsYXNzPVxcXCJsaW5lXFxcIiBzdHlsZT1cXFwiaGVpZ2h0OlwiICsgc2VnbWVudEhlaWdodCArIFwicHhcXFwiPjwvZGl2PlwiOyB9KS5qb2luKCcnKSArIFwiXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYm9hcmRcXFwiPlxcbiAgICAgICAgICAgICAgICBcIiArIGxhbmRzY2FwZS5tYXAoZ2V0U2VnbWVudEVsV2l0aFNpemUpLmpvaW4oJycpICsgXCJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicnVsZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgXCIgKyBBcnJheShoZWlnaHRMaW1pdCkuZmlsbCgwKS5tYXAoZnVuY3Rpb24gKF8sIGkpIHsgcmV0dXJuIFwiPGRpdiBjbGFzcz1cXFwicnVsZXItaXRlbVxcXCIgc3R5bGU9XFxcImhlaWdodDpcIiArIHNlZ21lbnRIZWlnaHQgKyBcInB4XFxcIj48ZGl2IGNsYXNzPVxcXCJydWxlci1udW1iZXJcXFwiIHN0eWxlPVxcXCJib3R0b206LTEwcHhcXFwiPlwiICsgaSArIFwiPC9kaXY+PC9kaXY+XCI7IH0pLmpvaW4oJycpICsgXCJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgXCI7XG59O1xuZXhwb3J0IHZhciByZW5kZXJMYW5kc2NhcGUgPSBmdW5jdGlvbiAobGFuZHNjYXBlKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihRVUVSWS5MQU5EU0NBUEUpLmlubmVySFRNTCA9IGdldExhbmRzY2FwZUVsKGxhbmRzY2FwZSk7XG59O1xuZXhwb3J0IHZhciBhZGRMaXN0ZW5lcnMgPSBmdW5jdGlvbiAob25DYWxjKSB7XG4gICAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGhpZGVFcnJvck1zZygpO1xuICAgICAgICBoaWRlUmVzdWx0TXNnKCk7XG4gICAgICAgIG9uQ2FsYyhkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFFVRVJZLkxBTkRTQ0FQRV9JTlBVVCkudmFsdWUsIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoUVVFUlkuVElNRV9JTlBVVCkudmFsdWUpO1xuICAgIH07XG4gICAgdmFyIGtleVByZXNzSGFuZGxlciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQua2V5ID09PSBFTlRFUl9LRVkpIHtcbiAgICAgICAgICAgIGhhbmRsZXIoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihRVUVSWS5TVEFSVF9CVE4pLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlcik7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihRVUVSWS5MQU5EU0NBUEVfSU5QVVQpLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywga2V5UHJlc3NIYW5kbGVyKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFFVRVJZLlRJTUVfSU5QVVQpLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywga2V5UHJlc3NIYW5kbGVyKTtcbn07XG5leHBvcnQgdmFyIHNob3dFcnJvck1zZyA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFFVRVJZLkVSUk9SX01TRykuaW5uZXJIVE1MID0gbXNnO1xufTtcbnZhciBoaWRlRXJyb3JNc2cgPSBmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihRVUVSWS5FUlJPUl9NU0cpLmlubmVySFRNTCA9ICcnO1xufTtcbmV4cG9ydCB2YXIgc2hvd1Jlc3VsdE1zZyA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFFVRVJZLlJFU1VMVF9NU0cpLmlubmVySFRNTCA9IG1zZztcbn07XG52YXIgaGlkZVJlc3VsdE1zZyA9IGZ1bmN0aW9uICgpIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFFVRVJZLlJFU1VMVF9NU0cpLmlubmVySFRNTCA9ICcnO1xufTtcbiIsInZhciBfX3NwcmVhZEFycmF5cyA9ICh0aGlzICYmIHRoaXMuX19zcHJlYWRBcnJheXMpIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxuICAgICAgICAgICAgcltrXSA9IGFbal07XG4gICAgcmV0dXJuIHI7XG59O1xudmFyIHN1YnRyYWN0ID0gZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIE51bWJlcigoYSAtIGIpLnRvRml4ZWQoNSkpOyB9O1xudmFyIFdBVEVSX1BFUl9USU1FID0gMTtcbnZhciBnZXRXaG9sZSA9IGZ1bmN0aW9uIChsYW5kc2NhcGUpIHtcbiAgICByZXR1cm4gbGFuZHNjYXBlLnJlZHVjZShmdW5jdGlvbiAoYWNjdW0sIF9hKSB7XG4gICAgICAgIHZhciBoZWlnaHQgPSBfYS5oZWlnaHQsIHdhdGVyID0gX2Eud2F0ZXI7XG4gICAgICAgIHJldHVybiBhY2N1bSArIGhlaWdodCArIHdhdGVyO1xuICAgIH0sIDApO1xufTtcbnZhciBob3dNdWNoID0gZnVuY3Rpb24gKGxhbmRzY2FwZSwgdGFyZ2V0SGVpZ2h0KSB7XG4gICAgcmV0dXJuIHN1YnRyYWN0KHRhcmdldEhlaWdodCAqIGxhbmRzY2FwZS5sZW5ndGgsIGdldFdob2xlKGxhbmRzY2FwZSkpO1xufTtcbnZhciBzcHJlYWRXYXRlckxldmVsID0gZnVuY3Rpb24gKGxhbmRzY2FwZSkge1xuICAgIGlmIChsYW5kc2NhcGUubGVuZ3RoIDwgMikge1xuICAgICAgICByZXR1cm4gbGFuZHNjYXBlO1xuICAgIH1cbiAgICB2YXIgbWF4ID0gTWF0aC5tYXguYXBwbHkoTWF0aCwgbGFuZHNjYXBlLm1hcChmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIGhlaWdodCA9IF9hLmhlaWdodDtcbiAgICAgICAgcmV0dXJuIGhlaWdodDtcbiAgICB9KSk7XG4gICAgdmFyIHNxdWFyZSA9IG1heCAqIGxhbmRzY2FwZS5sZW5ndGg7XG4gICAgdmFyIHdob2xlID0gZ2V0V2hvbGUobGFuZHNjYXBlKTtcbiAgICBpZiAoc3F1YXJlIDw9IHdob2xlKSB7XG4gICAgICAgIHZhciBsZXZlbF8xID0gd2hvbGUgLyBsYW5kc2NhcGUubGVuZ3RoO1xuICAgICAgICByZXR1cm4gbGFuZHNjYXBlLm1hcChmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSBfYS5oZWlnaHQ7XG4gICAgICAgICAgICByZXR1cm4gKHtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgICAgICAgICB3YXRlcjogc3VidHJhY3QobGV2ZWxfMSwgaGVpZ2h0KSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgdmFyIGhpZ2hlc3RTZWdtZW50cyA9IGxhbmRzY2FwZS5maWx0ZXIoZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciBoZWlnaHQgPSBfYS5oZWlnaHQ7XG4gICAgICAgIHJldHVybiBoZWlnaHQgPT09IG1heDtcbiAgICB9KTtcbiAgICB2YXIgbWF4V2F0ZXJMZXZlbCA9IE1hdGgubWF4LmFwcGx5KE1hdGgsIGhpZ2hlc3RTZWdtZW50cy5tYXAoZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciB3YXRlciA9IF9hLndhdGVyO1xuICAgICAgICByZXR1cm4gd2F0ZXI7XG4gICAgfSkpO1xuICAgIHZhciBpbmRleCA9IGxhbmRzY2FwZS5maW5kSW5kZXgoZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciBoZWlnaHQgPSBfYS5oZWlnaHQsIHdhdGVyID0gX2Eud2F0ZXI7XG4gICAgICAgIHJldHVybiBoZWlnaHQgPT09IG1heCAmJiB3YXRlciA9PT0gbWF4V2F0ZXJMZXZlbDtcbiAgICB9KTtcbiAgICB2YXIgbWF4U2VnbWVudCA9IGxhbmRzY2FwZVtpbmRleF07XG4gICAgdmFyIGxlZnQgPSBsYW5kc2NhcGUuc2xpY2UoMCwgaW5kZXgpO1xuICAgIHZhciByaWdodCA9IGxhbmRzY2FwZS5zbGljZShpbmRleCArIDEpO1xuICAgIHZhciBsZWZ0TmVlZGVkID0gaG93TXVjaChsZWZ0LCBtYXgpO1xuICAgIHZhciByaWdodE5lZWRlZCA9IGhvd011Y2gocmlnaHQsIG1heCk7XG4gICAgdmFyIGhhbGZPZldhdGVyID0gbWF4V2F0ZXJMZXZlbCAvIDI7XG4gICAgaWYgKGxlZnROZWVkZWQgPj0gaGFsZk9mV2F0ZXIgJiYgcmlnaHROZWVkZWQgPj0gaGFsZk9mV2F0ZXIpIHtcbiAgICAgICAgcmV0dXJuIF9fc3ByZWFkQXJyYXlzKHNwcmVhZFdhdGVyTGV2ZWwobGVmdC5tYXAoZnVuY3Rpb24gKHYsIGkpIHtcbiAgICAgICAgICAgIHJldHVybiBpID09PSBsZWZ0Lmxlbmd0aCAtIDFcbiAgICAgICAgICAgICAgICA/IHsgaGVpZ2h0OiB2LmhlaWdodCwgd2F0ZXI6IHYud2F0ZXIgKyBoYWxmT2ZXYXRlciB9XG4gICAgICAgICAgICAgICAgOiB2O1xuICAgICAgICB9KSksIFtcbiAgICAgICAgICAgIHsgaGVpZ2h0OiBtYXhTZWdtZW50LmhlaWdodCwgd2F0ZXI6IDAgfVxuICAgICAgICBdLCBzcHJlYWRXYXRlckxldmVsKHJpZ2h0Lm1hcChmdW5jdGlvbiAodiwgaSkge1xuICAgICAgICAgICAgcmV0dXJuIGkgPT09IDBcbiAgICAgICAgICAgICAgICA/IHsgaGVpZ2h0OiB2LmhlaWdodCwgd2F0ZXI6IHYud2F0ZXIgKyBoYWxmT2ZXYXRlciB9XG4gICAgICAgICAgICAgICAgOiB2O1xuICAgICAgICB9KSkpO1xuICAgIH1cbiAgICBpZiAobGVmdE5lZWRlZCA8IGhhbGZPZldhdGVyKSB7XG4gICAgICAgIHJldHVybiBfX3NwcmVhZEFycmF5cyhzcHJlYWRXYXRlckxldmVsKGxlZnQubWFwKGZ1bmN0aW9uICh2LCBpKSB7XG4gICAgICAgICAgICByZXR1cm4gaSA9PT0gbGVmdC5sZW5ndGggLSAxXG4gICAgICAgICAgICAgICAgPyB7IGhlaWdodDogdi5oZWlnaHQsIHdhdGVyOiB2LndhdGVyICsgbGVmdE5lZWRlZCB9XG4gICAgICAgICAgICAgICAgOiB2O1xuICAgICAgICB9KSksIFtcbiAgICAgICAgICAgIHsgaGVpZ2h0OiBtYXhTZWdtZW50LmhlaWdodCwgd2F0ZXI6IDAgfVxuICAgICAgICBdLCBzcHJlYWRXYXRlckxldmVsKHJpZ2h0Lm1hcChmdW5jdGlvbiAodiwgaSkge1xuICAgICAgICAgICAgcmV0dXJuIGkgPT09IDBcbiAgICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB2LmhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgd2F0ZXI6IHN1YnRyYWN0KHYud2F0ZXIgKyBtYXhXYXRlckxldmVsLCBsZWZ0TmVlZGVkKSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgOiB2O1xuICAgICAgICB9KSkpO1xuICAgIH1cbiAgICByZXR1cm4gX19zcHJlYWRBcnJheXMoc3ByZWFkV2F0ZXJMZXZlbChsZWZ0Lm1hcChmdW5jdGlvbiAodiwgaSkge1xuICAgICAgICByZXR1cm4gaSA9PT0gbGVmdC5sZW5ndGggLSAxXG4gICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHYuaGVpZ2h0LFxuICAgICAgICAgICAgICAgIHdhdGVyOiBzdWJ0cmFjdCh2LndhdGVyICsgbWF4V2F0ZXJMZXZlbCwgcmlnaHROZWVkZWQpLFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgOiB2O1xuICAgIH0pKSwgW1xuICAgICAgICB7IGhlaWdodDogbWF4U2VnbWVudC5oZWlnaHQsIHdhdGVyOiAwIH1cbiAgICBdLCBzcHJlYWRXYXRlckxldmVsKHJpZ2h0Lm1hcChmdW5jdGlvbiAodiwgaSkge1xuICAgICAgICByZXR1cm4gaSA9PT0gMCA/IHsgaGVpZ2h0OiB2LmhlaWdodCwgd2F0ZXI6IHYud2F0ZXIgKyByaWdodE5lZWRlZCB9IDogdjtcbiAgICB9KSkpO1xufTtcbmV4cG9ydCB2YXIgZ2V0V2F0ZXJMZXZlbHMgPSBmdW5jdGlvbiAobGFuZHNjYXBlLCB0aW1lKSB7XG4gICAgdmFyIGRpZmYgPSB0aW1lICogV0FURVJfUEVSX1RJTUU7XG4gICAgcmV0dXJuIHNwcmVhZFdhdGVyTGV2ZWwobGFuZHNjYXBlLm1hcChmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIGhlaWdodCA9IF9hLmhlaWdodCwgd2F0ZXIgPSBfYS53YXRlcjtcbiAgICAgICAgcmV0dXJuICh7IGhlaWdodDogaGVpZ2h0LCB3YXRlcjogd2F0ZXIgKyBkaWZmIH0pO1xuICAgIH0pKTtcbn07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBhZGRMaXN0ZW5lcnMsIHJlbmRlckxhbmRzY2FwZSwgc2hvd0Vycm9yTXNnLCBzaG93UmVzdWx0TXNnLCB9IGZyb20gJy4vVUknO1xuaW1wb3J0IHsgZ2V0V2F0ZXJMZXZlbHMgfSBmcm9tICcuL2FsZ28nO1xudmFyIG9uQ2FsYyA9IGZ1bmN0aW9uIChoZWlnaHRzVmFsdWUsIHRpbWVWYWx1ZSkge1xuICAgIHZhciBoZWlnaHRzID0gaGVpZ2h0c1ZhbHVlLnNwbGl0KCcsJykubWFwKGZ1bmN0aW9uIChoZWlnaHQpIHsgcmV0dXJuIHBhcnNlRmxvYXQoaGVpZ2h0KTsgfSk7XG4gICAgdmFyIHRpbWUgPSBwYXJzZUZsb2F0KHRpbWVWYWx1ZSk7XG4gICAgaWYgKGhlaWdodHMuc29tZShmdW5jdGlvbiAoaGVpZ2h0KSB7IHJldHVybiBpc05hTihoZWlnaHQpIHx8IGhlaWdodCA8IDA7IH0pKSB7XG4gICAgICAgIHNob3dFcnJvck1zZygnVGhlcmUgaXMgaW52YWxpZCBsYW5kc2NhcGU6IGV2ZXJ5IHNlZ21lbnQgc2hvdWxkIGJlIHZhbGlkIHBvc2l0aXZlIG51bWJlcicpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChpc05hTih0aW1lKSB8fCB0aW1lIDwgMCkge1xuICAgICAgICBzaG93RXJyb3JNc2coJ1RoZXJlIGlzIGludmFsaWQgdGltZSBwZXJpb2Q6IGl0IHNob3VsZCBiZSBwb3NpdGl2ZScpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBsYW5kc2NhcGUgPSBoZWlnaHRzLm1hcChmdW5jdGlvbiAoaGVpZ2h0KSB7IHJldHVybiAoe1xuICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgd2F0ZXI6IDAsXG4gICAgfSk7IH0pO1xuICAgIHZhciB3YXRlckxldmVsID0gZ2V0V2F0ZXJMZXZlbHMobGFuZHNjYXBlLCB0aW1lKTtcbiAgICByZW5kZXJMYW5kc2NhcGUod2F0ZXJMZXZlbCk7XG4gICAgc2hvd1Jlc3VsdE1zZyh3YXRlckxldmVsLm1hcChmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIHdhdGVyID0gX2Eud2F0ZXI7XG4gICAgICAgIHJldHVybiB3YXRlcjtcbiAgICB9KS5qb2luKCcsJykpO1xufTtcbmFkZExpc3RlbmVycyhvbkNhbGMpO1xucmVuZGVyTGFuZHNjYXBlKFtdKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=