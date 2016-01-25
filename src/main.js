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

function DOMSource(){
    "use strict";

    return Rx.Observable.fromEvent(document, 'click');
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

function run(main, drivers, source) {
    'use strict';
    
    const sinks = main(source);
    Object.keys(sinks).forEach(key => drivers[key](sinks[key]));
}

run(main, drivers, DOMSource());
