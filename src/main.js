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

function DOMEffects(text$) {
    text$.subscribe(text => {
        "use strict";

        const container = document.querySelector('#app');
        container.textContent = text;
    });
}

function consoleEffect(text$) {
    "use strict";

    text$.subscribe(text => console.log(text));
}

const sinks = main();

consoleEffect(sinks.console)
DOMEffects(sinks.DOM);

