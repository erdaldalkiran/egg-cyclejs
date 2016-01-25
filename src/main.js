import Rx from 'rx';

function main(DOMSource$) {
    "use strict";

    const observable = DOMSource$
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
    const proxyDOMSource = new Rx.Subject();
    const sinks = main(proxyDOMSource);
    const DOMSource = drivers.DOM(sinks.DOM);
    DOMSource.subscribe(click => proxyDOMSource.onNext(click));

    drivers.console(sinks.console);
}

run(main, drivers);
