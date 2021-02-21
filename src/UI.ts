type Segment = {
    height: number;
    water: number;
};

const QUERY = {
    LANDSCAPE: '#landscape',
    START_BTN: '#start',
    LANDSCAPE_INPUT: '#landscapeEl',
    TIME_INPUT: '#time',
    ERROR_MSG: '#error',
    RESULT_MSG: '#result',
    START_RANDOM_BTN: '#startRandom',
};

const BOARD_SIZE = {
    WIDTH: 1000,
    HEIGHT: 500,
};

const ENTER_KEY = 'Enter';

const MAX_TICKS_COUNT = 25;

const node = (elType: keyof HTMLElementTagNameMap) => (
    props: Record<string, string>,
    children: Array<Node>
) => {
    const el = document.createElement(elType);

    Object.keys(props).map((name) => el.setAttribute(name, props[name]));
    children.map((child) => el.appendChild(child));

    return el;
};

const div = node('div');

const text = (value: string) => document.createTextNode(value);

const round = (value: number): string => Number(value.toFixed(3)).toString();

const getSegmentEl = (width: number, height: number) => (
    segment: Segment
): HTMLElement => {
    const { height: segmentHeight, water } = segment;

    return div({ class: 'segment', style: `width:${width}px` }, [
        div({ class: 'total' }, [text(round(segmentHeight + water))]),
        div({ class: 'water', style: `height: ${water * height}px` }, []),
        div(
            { class: 'ground', style: `height: ${segmentHeight * height}px` },
            []
        ),
        div({ class: 'water-level' }, [text(round(water))]),
    ]);
};

const getFilteredList = (
    count: number
): { items: Array<number>; diff: number } => {
    const diff = Math.ceil(count / MAX_TICKS_COUNT);

    return {
        diff,
        items: Array(count)
            .fill(0)
            .map((_, i) => i)
            .filter((value) => value % diff === 0),
    };
};

const getRuler = (count: number, height: number) => {
    const { items, diff } = getFilteredList(count);

    return items.map((value) =>
        div(
            {
                class: 'ruler-item',
                style: `height:${height * diff}px`,
            },
            [div({ class: 'ruler-number' }, [text(value.toString())])]
        )
    );
};

const getLines = (count: number, height: number) => {
    const { items, diff } = getFilteredList(count);

    return items.map(() =>
        div({ class: 'line', style: `height:${height * diff}px` }, [])
    );
};

const getLandscapeEl = (landscape: Array<Segment>): HTMLElement => {
    const { length } = landscape;
    const maxHeight = Math.max(
        ...landscape.map(({ height, water }) => height + water)
    );

    if (length === 0) {
        return div(
            {
                class: 'empty',
                style: `width: ${BOARD_SIZE.WIDTH}px; height: ${BOARD_SIZE.HEIGHT}px; line-height: ${BOARD_SIZE.HEIGHT}px;`,
            },
            [text('Please provide the landscape')]
        );
    }

    const heightLimit = Math.ceil(1.3 * maxHeight);
    const segmentWidth = BOARD_SIZE.WIDTH / length;
    const segmentHeight = BOARD_SIZE.HEIGHT / heightLimit;

    const getSegmentElWithSize = getSegmentEl(segmentWidth, segmentHeight);

    return div(
        {
            class: 'board-wrapper',
            style: `width: ${BOARD_SIZE.WIDTH}px; height: ${BOARD_SIZE.HEIGHT}px;`,
        },
        [
            ...getLines(heightLimit, segmentHeight),
            div({ class: 'board' }, [
                ...landscape.map(getSegmentElWithSize),
                div({ class: 'ruler' }, getRuler(heightLimit, segmentHeight)),
            ]),
        ]
    );
};

export const renderLandscape = (landscape: Array<Segment>): void => {
    const el = document.querySelector(QUERY.LANDSCAPE);

    el!.innerHTML = '';
    el!.append(getLandscapeEl(landscape));
};

export const addListeners = (
    onStart: (heights: string, time: string) => void,
    onStartRandom: () => void
) => {
    const handler = () => {
        hideErrorMsg();
        hideResultMsg();
        onStart(
            document.querySelector<HTMLInputElement>(QUERY.LANDSCAPE_INPUT)!
                .value,
            document.querySelector<HTMLInputElement>(QUERY.TIME_INPUT)!.value
        );
    };

    const keyPressHandler = (event: KeyboardEvent) => {
        if (event.key === ENTER_KEY) {
            handler();
        }
    };

    document.querySelector(QUERY.START_BTN)!.addEventListener('click', handler);
    document
        .querySelector(QUERY.LANDSCAPE_INPUT)!
        .addEventListener('keypress', keyPressHandler);
    document
        .querySelector(QUERY.TIME_INPUT)!
        .addEventListener('keypress', keyPressHandler);
    document
        .querySelector(QUERY.START_RANDOM_BTN)!
        .addEventListener('click', onStartRandom);
};

export const showErrorMsg = (msg: string): void => {
    document.querySelector(QUERY.ERROR_MSG)!.innerHTML = msg;
};

const hideErrorMsg = (): void => {
    document.querySelector(QUERY.ERROR_MSG)!.innerHTML = '';
};

export const showResultMsg = (msg: string): void => {
    document.querySelector(QUERY.RESULT_MSG)!.innerHTML = msg;
};

const hideResultMsg = (): void => {
    document.querySelector(QUERY.RESULT_MSG)!.innerHTML = '';
};
