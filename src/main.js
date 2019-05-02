'use strict';

import App from './App.class';

// When the page is loaded, the initialization function is called.
window.onload = _ => {
    let app = new App();
    app.render();
};