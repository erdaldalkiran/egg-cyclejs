import Rx from 'rx';
import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';

const {input, label, div, h2, makeDOMDriver} = CycleDOM;

function intent(DOMSource) {
    return DOMSource
        .select('.slider')
        .events('input')
        .map(event => event.target.value);
}

function model(change$, props$){
    const initialValue$ = props$.map(prop => prop.init).first();
    const value$ = initialValue$.concat(change$);

    return Rx.Observable.combineLatest(
        value$,
        props$,
        (value, props) => {
            return {
                label: props.label,
                min: props.min,
                max: props.max,
                unit: props.unit,
                value: value
            }

        }
    );
}

function view(state$) {
    return state$.map(state =>
        div('.labeled-slider', [
            label('.label', `${state.label} ${state.value} ${state.unit}`),
            input('.slider', {type: 'range', min: state.min, max: state.max, value: state.value})
        ]));
}

function LabeledSlider(sources) {
    const change$ = intent(sources.DOM);
    const state$ =  model(change$, sources.props);
    const vtree$ = view(state$);

    return {
        DOM: vtree$
    };
}

const drivers = {
    DOM: makeDOMDriver('#app')
}

function main(sources){
    "use strict";

    const props$ = Rx.Observable.of({
        label: 'Height',
        unit: 'cm',
        min: 140,
        max: 220,
        init: 170
    });

    return LabeledSlider({DOM: sources.DOM, props: props$});
}

Cycle.run(main, drivers);










