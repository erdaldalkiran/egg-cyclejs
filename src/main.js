import Rx from 'rx';
import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';

const {h, h1, span, makeDOMDriver} = CycleDOM;

function main(source) {
    "use strict";

    const observable = source.DOM
        .select('span')
        .events('mouseover')
        .startWith(null)
        .flatMapLatest(() => Rx.Observable.timer(0, 1000));

    return {
        DOM: observable
            .map(index => {
                return h1([
                    span([
                            `Seconds elapsed ${index}`
                        ]
                    )]
                );
            }),
        console: observable.map(index => index * 2)
    };
}

function consoleDriver(text$) {
    "use strict";

    text$.subscribe(text => console.log(text));
}

const drivers = {
    DOM: makeDOMDriver('#app'),
    console: consoleDriver
};


Cycle.run(main, drivers);
