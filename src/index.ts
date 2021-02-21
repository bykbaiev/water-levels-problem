import data from './data';
import {
    addListeners,
    renderLandscape,
    showErrorMsg,
    showResultMsg,
} from './UI';
import { getWaterLevels } from './tree';

const calculateWaterLevels = (landscape: Array<number>, time: number): void => {
    const waterLevels = getWaterLevels(landscape, time);

    renderLandscape(
        landscape.map((height, index) => ({
            height,
            water: waterLevels[index],
        }))
    );

    showResultMsg(`
    LANDSCAPE:${landscape.join(', ')}
    <br/>
    TIME:${time}
    <br/>
    WATER LEVELS: ${waterLevels
        .map((level) => Number(level.toFixed(3)))
        .join(', ')}
    `);
};

const onStart = (heights: string, timeValue: string): void => {
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

    calculateWaterLevels(landscape, time);
};

const onStartRandom = () => {
    const index = Math.round(Math.random() * data.length);
    const { landscape, time } = data[index];
    calculateWaterLevels(landscape, time);
};

addListeners(onStart, onStartRandom);

renderLandscape([]);
