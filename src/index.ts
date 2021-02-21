import {
    addListeners,
    renderLandscape,
    showErrorMsg,
    showResultMsg,
} from './UI';

import { getTreeWaterLevels } from './tree';

const onCalc = (heights: string, timeValue: string): void => {
    const landscape = heights.split(',').map((height) => parseFloat(height));
    const time = parseFloat(timeValue);

    if (landscape.some((height) => isNaN(height) || height < 0)) {
        showErrorMsg(
            'There is invalid landscape: every segment should be valid positive number'
        );
        return;
    }

    if (isNaN(time) || time < 0) {
        showErrorMsg('There is invalid time period: it should be positive');
        return;
    }

    const waterLevels = getTreeWaterLevels(landscape, time);

    renderLandscape(
        landscape.map((height, index) => ({
            height,
            water: waterLevels[index],
        }))
    );

    showResultMsg(`
    LANDSCAPE:${landscape.join(', ')}
    <br/>
    TIME:${timeValue}
    <br/>
    WATER LEVELS: ${waterLevels
        .map((level) => Number(level.toFixed(3)))
        .join(', ')}
    `);
};

addListeners(onCalc);

renderLandscape([]);
