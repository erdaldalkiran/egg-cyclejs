import Rx from 'rx';

function main() {
    "use strict";
    return Rx.Observable
        .timer(0, 1000)
        .map(index => `Seconds elapsed ${index}`);
}

function DOMEffects(text$) {
    text$.subscribe(text => {
        "use strict";

        const container = document.querySelector('#app');
        container.textContent = text;
    });
}

function consoleEffect (text$){
    "use strict";

    text$.subscribe(text => console.log(text));
}

const sink = main();

consoleEffect(sink)
DOMEffects(sink);

