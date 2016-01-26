import Rx from 'rx';
import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';
import isolate from '@cycle/isolate';

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
        DOM: vtree$,
        value: state$.map(state => state.value)
    };
}

const IsolatedLabeledSlider = function (sources) {
    return isolate(LabeledSlider)(sources);
}

function main(sources){
    "use strict";

    const weightProps$ = Rx.Observable.of({
        label: 'Weight',
        unit: 'kg',
        min: 40,
        max: 150,
        init: 70
    });

    const weightSinks = IsolatedLabeledSlider({DOM: sources.DOM, props: weightProps$});
    const weightTree$ = weightSinks.DOM;
    const weightValue$ = weightSinks.value;

    const heightProps$ = Rx.Observable.of({
        label: 'Height',
        unit: 'cm',
        min: 140,
        max: 220,
        init: 170
    });

    const heightSinks = IsolatedLabeledSlider({DOM: sources.DOM, props: heightProps$});
    const heightTree$ = heightSinks.DOM;
    const heightValue$ = heightSinks.value;

    const bmi$ = Rx.Observable.combineLatest(
        weightValue$,
        heightValue$,
        (weight, height) => {
            const heightInMeters = height * 0.01;
            return Math.round(weight / Math.pow(heightInMeters, 2));
        }
    );

    const vtree$ = Rx.Observable.combineLatest(
        weightTree$,
        heightTree$,
        bmi$,
        (weightTree, heightTree, bmi) => div([
            weightTree,
            heightTree,
            h2(`BMI is ${bmi}`)
        ])
    );

    return {
        DOM: vtree$
    };
}

const drivers = {
    DOM: makeDOMDriver('#app')
}

Cycle.run(main, drivers);










