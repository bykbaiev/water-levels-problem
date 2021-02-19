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

const node = (elType: keyof HTMLElementTagNameMap) => (
    props: Record<string, string>,
    children: Array<Node>
) => {
    const el = document.createElement(elType);

    Object.keys(props).map((name) => el.setAttribute(name, props[name]));
    children.map(child => el.appendChild(child));

    return el;
};

const div = node('div');

const text = (value: string) => document.createTextNode(value);

const getSegmentEl = (width: number, height: number) => (
    segment: Segment
): HTMLElement => {
    const { height: segmentHeight, water } = segment;

    return div({ class: 'segment', style: `width:${width}px` }, [
        div({ class: 'total' }, [text((segmentHeight + water).toFixed(3))]),
        div({ class: 'water', style: `height: ${water * height}px` }, []),
        div({ class: 'ground', style: `height: ${segmentHeight * height}px` }, []),
        div({ class: 'water-level' }, [text(water.toFixed(3))])
    ]);
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

    const heightLimit = Math.floor(1.3 * maxHeight);
    const segmentWidth = BOARD_SIZE.WIDTH / length;
    const segmentHeight = BOARD_SIZE.HEIGHT / heightLimit;

    const getSegmentElWithSize = getSegmentEl(segmentWidth, segmentHeight);

    return div(
        {
            class: 'board-wrapper',
            style: `width: ${BOARD_SIZE.WIDTH}px; height: ${BOARD_SIZE.HEIGHT}px;`,
        },
        [
            ...Array(heightLimit)
                .fill(0)
                .map(() =>
                    div(
                        { class: 'line', style: `height:${segmentHeight}px` },
                        []
                    )
                ),
            div({ class: 'board' }, [
                ...landscape.map(getSegmentElWithSize),
                div(
                    { class: 'ruler' },
                    Array(heightLimit)
                        .fill(0)
                        .map((_, i) =>
                            div(
                                {
                                    class: 'ruler-item',
                                    style: `height:${segmentHeight}px`,
                                },
                                [
                                    div(
                                        {
                                            class: 'ruler-number',
                                            style: 'bottom:-10px',
                                        },
                                        [text(i.toString())]
                                    ),
                                ]
                            )
                        )
                ),
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
    onCalc: (heights: string, time: string) => void
) => {
    const handler = () => {
        hideErrorMsg();
        hideResultMsg();
        onCalc(
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
