import Rx from 'rx';

function main(source) {
    "use strict";

    const observable = source.DOM
        .startWith(null)
        .flatMapLatest(() => Rx.Observable.timer(0, 1000));

    return {
        DOM: observable
            .map(index => `Seconds elapsed ${index}`),
        console: observable.map(index => index * 2)
    };
}

function DOMDriver(text$) {
    text$.subscribe(text => {
        "use strict";

        const container = document.querySelector('#app');
        container.textContent = text;
    });

    const DOMSource = Rx.Observable.fromEvent(document, 'click');
    return DOMSource;
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
    const proxySources = {};
    Object.keys(drivers)
        .forEach(key => {
            "use strict";

            proxySources[key] = new Rx.Subject();
        });

    const sinks = main(proxySources);

    Object.keys(drivers)
        .forEach(key => {
            "use strict";

            const source = drivers[key](sinks[key]);
            if (source) {
                source.subscribe(event => proxySources[key].onNext(event));
            }
        });
}

run(main, drivers);
