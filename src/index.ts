import {
    addListeners,
    renderLandscape,
    showErrorMsg,
    showResultMsg,
} from './UI';
import { getWaterLevels } from './algo';
import { Segment } from './model';

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
