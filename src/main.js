import Rx from 'rx';
import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';

const {button, div,p, label, makeDOMDriver} = CycleDOM;

function main(source) {
    "use strict";

    const decrements$ = source.DOM
        .select('.decrement')
        .events('click')
        .map(event => -1);

    const increments$ = source.DOM
        .select('.increment')
        .events('click')
        .map(event => 1);

    const changeEvents$ = Rx.Observable.of(0)
        .merge(decrements$)
        .merge(increments$)
        .scan((soFar, current) => soFar = soFar + current);

    return {
        DOM: changeEvents$.map(number =>
            div([
                button('.decrement', 'Decrement'),
                button('.increment', 'Increment'),
                p([
                    label(`${number}`)
                ])
            ])
        )
    };

}


const drivers = {
    DOM: makeDOMDriver('#app')
};


Cycle.run(main, drivers);
