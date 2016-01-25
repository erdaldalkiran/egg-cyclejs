import Rx from 'rx';
import Cycle from '@cycle/core';

function main(source) {
    "use strict";

    const observable = source.DOM.selectEvents('span', 'mouseover')
        .startWith(null)
        .flatMapLatest(() => Rx.Observable.timer(0, 1000));

    return {
        DOM: observable
            .map(index => {
                return {
                    tagName: 'H1',
                    children: [{
                        tagName: 'SPAN',
                        children: [
                            `Seconds elapsed ${index}`
                        ]
                    }]
                };
            }),
        console: observable.map(index => index * 2)
    };
}

function DOMDriver(obj$) {
    obj$.subscribe(obj => {
        "use strict";

        function createElement(obj) {
            const element = document.createElement(obj.tagName);
            obj.children
                .filter(child => typeof  child === 'object')
                .map(createElement)
                .forEach(child => element.appendChild(child));
            obj.children
                .filter(child => typeof child === 'string')
                .forEach(child => element.innerHTML += child);
            return element;
        }

        const container = document.querySelector('#app');
        container.innerHTML = '';
        var element = createElement(obj);
        container.appendChild(element);
    });

    const DOMSource = {
        selectEvents: function(tagName, eventType){
            "use strict";

            return Rx.Observable.fromEvent(document, eventType)
                    .filter(event => event.target.tagName === tagName.toUpperCase());
        }
    };
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


Cycle.run(main, drivers);
