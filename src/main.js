import Rx from 'rx';
import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';

const {input, label, div, h2, makeDOMDriver} = CycleDOM;

function intent(DOMSource) {
    const weight$ = DOMSource
        .select('.weight')
        .events('input')
        .map(event => event.target.value);

    const height$ = DOMSource
        .select('.height')
        .events('input')
        .map(event => event.target.value);

    return {weight$, height$};
}

function model(weight$, height$) {
    return Rx.Observable.combineLatest(
        weight$.startWith(70),
        height$.startWith(170),
        (weight, height) => {
            "use strict";
            const heightMeters = height * 0.01;
            const bmi = Math.round(weight / Math.pow(heightMeters, 2));
            return {
                bmi,
                height,
                weight
            };
        }
    );
}

function view(state$) {
    return state$.map(state =>
        div([
            div([
                label(`Weight: ${state.weight} kg`),
                input('.weight', {type: 'range', min: 40, max: 150, value: state.weight})
            ]),
            div([
                label(`Height: ${state.height} cm`),
                input('.height', {type: 'range', min: 140, max: 200, value: state.height})
            ]),
            h2(`BMI is ${state.bmi}`)
        ])
    );
}
function main(sources) {
    const {weight$, height$} = intent(sources.DOM);

    const state$ = model(weight$, height$);

    const vtree$ = view(state$);

    return {
        DOM: vtree$
    };
}

const drivers = {
    DOM: makeDOMDriver('#app')
}

Cycle.run(main, drivers);










