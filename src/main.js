import Rx from 'rx';

function main() {
    "use strict";

    let source = Rx.Observable
        .timer(0, 1000);
    return {
        DOM: source
            .map(index => `Seconds elapsed ${index}`),
        console: source.map(index => index * 2)
    };
}

function DOMDriver(text$) {
    text$.subscribe(text => {
        "use strict";

        const container = document.querySelector('#app');
        container.textContent = text;
    });
}

function consoleDriver(text$) {
    "use strict";

    text$.subscribe(text => console.log(text));
}

const drivers = {
    DOM: DOMDriver,
    console: consoleDriver
};

function run(main, drivers) {
    const sinks = main();

    Object.keys(drivers).forEach(key => drivers[key](sinks[key]));
}

run(main, drivers);
