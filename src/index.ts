import {
    addListeners,
    renderLandscape,
    showErrorMsg,
    showResultMsg,
} from './UI';
import { getWaterLevels } from './algo';
import { Segment } from './model';

import { buildTree, getTreeWaterLevels } from './tree';

const onCalc = (heightsValue: string, timeValue: string): void => {
    const heights = heightsValue.split(',').map((height) => parseFloat(height));
    const time = parseFloat(timeValue);

    if (heights.some((height) => isNaN(height) || height < 0)) {
        showErrorMsg(
            'There is invalid landscape: every segment should be valid positive number'
        );
        return;
    }

    if (isNaN(time) || time < 0) {
        showErrorMsg('There is invalid time period: it should be positive');
        return;
    }

    const landscape: Array<Segment> = heights.map((height) => ({
        height,
        water: 0,
    }));

    const waterLevel = getWaterLevels(landscape, time);

    renderLandscape(waterLevel);

    showResultMsg(waterLevel.map(({ water }) => water).join(','));
};

addListeners(onCalc);

renderLandscape([]);

/* ---------------------------------------------- */
const landscape = [4, 1, 1, 5, 2, 4, 9, 8, 7, 6, 8];

console.log(getTreeWaterLevels(landscape, 1));

console.log(
    getWaterLevels(
        landscape.map((height) => ({ height, water: 0 })),
        1
    ).map(({ water }) => water)
);

const landscape1 = [1, 2, 3, 4, 1];

console.log('----------------------------------------');

console.log(getTreeWaterLevels(landscape1, 1));

console.log(
    getWaterLevels(
        landscape1.map((height) => ({ height, water: 0 })),
        1
    ).map(({ water }) => water)
);
