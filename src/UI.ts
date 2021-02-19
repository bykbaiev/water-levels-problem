import { Segment } from './model';

const QUERY = {
    LANDSCAPE: '#landscape',
    START_BTN: '#start',
    LANDSCAPE_INPUT: '#landscapeEl',
    TIME_INPUT: '#time',
    ERROR_MSG: '#error',
    RESULT_MSG: '#result',
};

const BOARD_SIZE = {
    WIDTH: 1000,
    HEIGHT: 500,
};

const ENTER_KEY = 'Enter';

const getSegmentEl = (width: number, height: number) => (segment: Segment): string => {
    const { height: segmentHeight, water } = segment;

    return `
        <div class="segment" style="width: ${width}px">
            <div class="total">${segmentHeight + water}</div>
            <div class="water" style="height: ${water * height}px"></div>
            <div class="ground" style="height: ${segmentHeight * height}px"></div>
            <div class="water-level">${water}</div>
        </div>
    `
}

const getLandscapeEl = (landscape: Array<Segment>): string => {
    const { length } = landscape;
    const maxHeight = Math.max(...landscape.map(({ height, water }) => height + water));

    if (length === 0) {
        return `<div class="empty" style="width: ${BOARD_SIZE.WIDTH}px; height: ${BOARD_SIZE.HEIGHT}px; line-height: ${BOARD_SIZE.HEIGHT}px;">Please, provide the landscape</div>`;
    }

    const heightLimit = Math.floor(1.3 * maxHeight);
    const segmentWidth = BOARD_SIZE.WIDTH / length;
    const segmentHeight = BOARD_SIZE.HEIGHT / heightLimit;

    const getSegmentElWithSize = getSegmentEl(segmentWidth, segmentHeight);

    return `
        <div class="board-wrapper" style="width: ${BOARD_SIZE.WIDTH}px; height: ${BOARD_SIZE.HEIGHT}px;">
            ${Array(heightLimit).fill(0).map((_, i) => `<div class="line" style="height:${segmentHeight}px"></div>`).join('')}
            <div class="board">
                ${landscape.map(getSegmentElWithSize).join('')}
                <div class="ruler">
                    ${Array(heightLimit).fill(0).map((_, i) => `<div class="ruler-item" style="height:${segmentHeight}px"><div class="ruler-number" style="bottom:-10px">${i}</div></div>`).join('')}
                </div>
            </div>
        </div>
    `;
}

export const renderLandscape = (landscape: Array<Segment>): void => {
    document.querySelector(QUERY.LANDSCAPE).innerHTML = getLandscapeEl(landscape);
};

export const addListeners = (onCalc: (heights: string, time: string) => void) => {
    const handler = () => {
        hideErrorMsg();
        hideResultMsg();
        onCalc(
            document.querySelector<HTMLInputElement>(QUERY.LANDSCAPE_INPUT).value,
            document.querySelector<HTMLInputElement>(QUERY.TIME_INPUT).value
        );
    };

    const keyPressHandler = (event: KeyboardEvent) => {
        if (event.key === ENTER_KEY) {
            handler();
        }
    };

    document.querySelector(QUERY.START_BTN).addEventListener('click', handler);
    document.querySelector(QUERY.LANDSCAPE_INPUT).addEventListener('keypress', keyPressHandler);
    document.querySelector(QUERY.TIME_INPUT).addEventListener('keypress', keyPressHandler);
}

export const showErrorMsg = (msg: string): void => {
    document.querySelector(QUERY.ERROR_MSG).innerHTML = msg;
};

const hideErrorMsg = (): void => {
    document.querySelector(QUERY.ERROR_MSG).innerHTML = '';
};

export const showResultMsg = (msg: string): void => {
    document.querySelector(QUERY.RESULT_MSG).innerHTML = msg;
};

const hideResultMsg = (): void => {
    document.querySelector(QUERY.RESULT_MSG).innerHTML = '';
};
