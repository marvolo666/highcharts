/* eslint-env node, es6 */
/* eslint-disable */
const fs = require('fs');
const yaml = require('js-yaml');

// Internal reference
const hasJSONSources = {};

/**
 * Get browserstack credentials from the environment variables.
 * e.g for Mac/Linux run the below with correct credentials or
 * add to a env.file which you add by running `source env.file`
 * in your terminal:
 *  export BROWSERSTACK_USER="username"
 *  export BROWSERSTACK_KEY="key"
 * @return {Object} The properties
 */
function getProperties() {
    let properties = {};

    try {
        // add BROWSERSTACK_USER and BROWSERSTACK_KEY as envfile containing the
        properties['browserstack.username'] = process.env.BROWSERSTACK_USER;
        properties['browserstack.accesskey'] = process.env.BROWSERSTACK_KEY;

        if (!process.env.BROWSERSTACK_USER) {
            // fallback to good old property file
            let lines = fs.readFileSync(
                './git-ignore-me.properties', 'utf8'
            );
            lines.split('\n').forEach(function (line) {
                line = line.split('=');
                if (line[0]) {
                    properties[line[0]] = line[1];
                }
            });
        }

        if (!properties['browserstack.username']) {
            throw new Error();
        }
    } catch (e) {
        throw new Error(
            'BrowserStack credentials not given. Add BROWSERSTACK_USER and ' +
            'BROWSERSTACK_KEY environment variables or create a git-ignore-me.properties file.'
        );
    }
    return properties;
}

/**
 * Get the contents of demo.html and strip out JavaScript tags.
 * @param  {String} path The sample path
 * @return {String}      The stripped HTML
 */
function getHTML(path) {
    let html = fs.readFileSync(`samples/${path}/demo.html`, 'utf8');

    html = html.replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        ''
    );

    return html + '\n';
}

/**
 * Look for $.getJSON calls in the demos and add hook to local sample data.
 * @param  {String} js
 *         The contents of demo.js
 * @return {String}
 *         JavaScript extended with the sample data.
 */
function resolveJSON(js) {
    const match = js.match(/\$\.getJSON\('([^']+)/);
    if (match) {
        let src = match[1];
        if (!hasJSONSources[src]) {
            let innerMatch = src.match(/filename=([^&']+)/);
            if (innerMatch) {
                let data = fs.readFileSync(
                    'samples/data/' + innerMatch[1],
                    'utf8'
                );

                if (data) {
                    hasJSONSources[src] = true;

                    if (/json$/.test(innerMatch[1])) {
                        return `
                        window.JSONSources['${src}'] = ${data};
                        ${js}
                        `;
                    }
                    if (/csv$/.test(innerMatch[1])) {
                        return `
                        window.JSONSources['${src}'] = \`${data}\`;
                        ${js}
                        `;
                    }
                }
            }
        }
    }
    return js;
}

/**
 * Decide whether to skip the test based on flags in demo.details.
 * @param  {String} path The sample path
 * @return {Boolean}     False if we should skip the test
 */
function handleDetails(path) {
    // Skip it?
    if (fs.existsSync(`samples/${path}/demo.details`)) {
        let details = fs.readFileSync(
            `samples/${path}/demo.details`,
            'utf8'
        );
        details = details && yaml.load(details);
        if (details && details.skipTest) {
            // console.log(`- skipTest: ${path}`.gray);
            return false;
        }
        if (details && details.requiresManualTesting) {
            // console.log(`- requiresManualTesting: ${path}`.gray);
            return false;
        }
        return true;
    }
    return true;
}

const browserStackBrowsers = {
    'Mac.Chrome': {
        base: 'BrowserStack',
        browser: 'chrome',
        browser_version: '72.0',
        os: 'OS X',
        os_version: 'Mojave'
    },
    'Mac.Firefox': {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: '65.0',
        os: 'OS X',
        os_version: 'Mojave'
    },
    'Mac.Safari': {
        base: 'BrowserStack',
        browser: 'safari',
        browser_version: '12.0',
        os: 'OS X',
        os_version: 'Mojave'
    },
    'Win.Chrome': {
        base: 'BrowserStack',
        browser: 'chrome',
        browser_version: '72.0',
        os: 'Windows',
        os_version: '10'
    },
    'Win.Edge': {
        base: 'BrowserStack',
        browser: 'edge',
        browser_version: 'insider preview',
        os: 'Windows',
        os_version: '10',
    },
    'Win.Firefox': {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: '65.0',
        os: 'Windows',
        os_version: '10'
    },
    'Win.IE': {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '11.0',
        os: 'Windows',
        os_version: '10'
    }
};

module.exports = function (config) {

    const argv = require('yargs').argv;
    const Babel = require("@babel/core");

    if (argv.ts) {
        const ChildProcess = require('child_process');
        // Compile test tools and samples
        try {
            console.log('Compiling declarations...');
            ChildProcess.execSync(
                'npx gulp jsdoc-dts'
            );
            console.log('Compiling test tools...');
            ChildProcess.execSync(
                'cd "' + process.cwd() + '" && npx tsc -p test'
            );
            console.log('Compiling samples...');
            ChildProcess.execSync(
                'cd "' + process.cwd() + '" && npx tsc -p samples'
            );
        } catch (catchedError) {
            console.error(catchedError);
            return;
        }
    }

    let frameworks = ['qunit'];

    if (argv.oldie) {
        frameworks = []; // Custom framework in test file
    }

    // Browsers
    let browsers = argv.browsers ?
        argv.browsers.split(',') :
        ['ChromeHeadless'];
    if (argv.oldie) {
        browsers = ['Win.IE8'];
    } else if (argv.browsers === 'all') {
        browsers = Object.keys(browserStackBrowsers);
    }

    const browserCount = argv.browsercount || 2;

    if (!argv.browsers && browserCount && !isNaN(browserCount)  && browserCount > 1) {
        // Sharding / splitting tests across multiple browser instances
        frameworks = [...frameworks, 'sharding'];
        // create a duplicate of the added browsers ${numberOfInstances} times.
        browsers = argv.splitbrowsers ? argv.splitbrowsers.split(',').reduce((browserInstances, current) => {
            for (let i = 0; i < browserCount; i++) {
                browserInstances.push(current);
            }
            return browserInstances;
        }, [])
        : new Array(browserCount).fill('ChromeHeadless');
    } else {
        if (argv.splitbrowsers) {
            browsers = argv.splitbrowsers.split(',');
        }
    }

    const needsTranspiling = browsers.some(browser => browser === 'Win.IE');

    // The tests to run by default
    const defaultTests = argv.oldie ?
        ['unit-tests/oldie/*'] :
        ['unit-tests/*/*'];

    const tests = (argv.tests ? argv.tests.split(',') : defaultTests)
        .filter(path => !!path)
        .map(path => `samples/${path}/demo.js`);

    // Get the files
    let files = require('./karma-files.json');
    if (argv.oldie) {
        files = files.filter(f =>
            f.indexOf('vendor/jquery') !== 0 &&
            f.indexOf('vendor/moment') !== 0 &&
            f.indexOf('vendor/proj4') !== 0 &&
            f.indexOf('node_modules/lolex') !== 0 &&

            // Complains on chart.renderer.addPattern
            f.indexOf('code/modules/pattern-fill.src.js') !== 0 &&
            // Uses classList extensively
            f.indexOf('code/modules/stock-tools.src.js') !== 0
        );
        files.splice(0, 0, 'code/modules/oldie-polyfills.src.js');
        files.splice(2, 0, 'code/modules/oldie.src.js');
    }

    let options = {
        basePath: '../', // Root relative to this file
        frameworks: frameworks,
        files: files.concat([
            {
                pattern: 'test/*.png', // testimage.png
                watched: false,
                included: false,
                served: true
            },
            {
                pattern: '**/*.svg', // reference images
                watched: false,
                included: false,
                served: true
            },
            // Test templates
            'test/test-template.js',
            {
                pattern: 'test/templates/**/*.js',
                type: 'js',
                watched: false,
                included: true,
                served: true,
                nocache: false
            },

            // Set up
            'test/call-analyzer.js',
            'test/test-controller.js',
            'test/test-utilities.js',
            'test/karma-setup.js'
        ], tests),

        // These ones fail
        exclude: argv.oldie ? [] : [
            // The configuration currently loads classic mode only. Styled mode
            // needs to be a separate instance.
            'samples/unit-tests/series-pie/styled-mode/demo.js',
            // Themes alter the whole default options structure. Set up a
            // separate test suite? Or perhaps somehow decouple the options so
            // they are not mutated for later tests?
            'samples/unit-tests/themes/*/demo.js',

            // Trying to get Edge to pass:
            //'samples/unit-tests/interaction/*/demo.js',
            //'samples/unit-tests/stock-tools/*/demo.js',
            //'samples/unit-tests/drag-panes/pointer-interactions/demo.js',
            //'samples/unit-tests/chart/zoomtype/demo.js',
            //'samples/unit-tests/drilldown/drillup/demo.js',
            //'samples/unit-tests/rangeselector/selected/demo.js',
            //'samples/unit-tests/point/point/demo.js',
            //'samples/unit-tests/pointer/members/demo.js',

            // --- VISUAL TESTS ---

            // Error #13, renders to other divs than #container. Sets global
            // options.
            'samples/highcharts/demo/bullet-graph/demo.js',
            // Network loading?
            'samples/highcharts/demo/combo-meteogram/demo.js',

            // CSV data, parser fails - why??
            'samples/highcharts/demo/line-ajax/demo.js',

            // Clock
            'samples/highcharts/demo/dynamic-update/demo.js',
            'samples/highcharts/demo/gauge-clock/demo.js',
            'samples/highcharts/demo/gauge-vu-meter/demo.js',

            // Too heavy
            'samples/highcharts/demo/parallel-coordinates/demo.js',
            'samples/highcharts/demo/sparkline/demo.js',

            // Maps
            'samples/maps/demo/map-pies/demo.js', // advanced data
            'samples/maps/demo/us-counties/demo.js', // advanced data
            'samples/maps/demo/data-class-ranges/demo.js', // Google Spreadsheets
            'samples/maps/demo/data-class-two-ranges/demo.js', // Google Spr

            // Unknown error
            'samples/highcharts/boost/scatter-smaller/demo.js',

            // CommonJS
            'samples/highcharts/common-js/browserify/demo.js',
            'samples/highcharts/common-js/webpack/demo.js',

            // Various
            'samples/highcharts/data/google-spreadsheet/demo.js', // advanced demo
            'samples/highcharts/css/exporting/demo.js', // advanced demo
            'samples/highcharts/css/map-dataclasses/demo.js', // Google Spreadsheets
            'samples/highcharts/css/pattern/demo.js', // styled mode, setOptions

            // Failing on Edge only
            'samples/unit-tests/pointer/members/demo.js',

            // Skip the special oldie tests (which don't run QUnit)
            'samples/unit-tests/oldie/*/demo.js'
        ],
        reporters: ['imagecapture', 'progress'],
        port: 9876,  // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: browsers,
        autoWatch: false,
        singleRun: true, // Karma captures browsers, runs the tests and exits
        concurrency: Infinity,
        plugins: [
            'karma-*',
            require('./karma-imagecapture-reporter.js')
        ],
        sharding: {
          specMatcher: /(spec|test|demo)s?\.js/i
        },

        formatError: function (s) {
            let ret = s.replace(
                /(\@samples\/([a-z0-9\-]+\/[a-z0-9\-]+\/[a-z0-9\-]+)\/demo\.js:[0-9]+:[0-9]+\n)/,
                function (a, b, c) {
                    return `http://utils.highcharts.local/samples/#test/${c}`.cyan + '\n' +
                    '\t' + a.replace(/^@/, '@ ') + '\n<<<splitter>>>';
                }
            );

            ret = s.replace(
                /(samples\/([a-z0-9\-]+\/[a-z0-9\-]+\/[a-z0-9\-]+)\/demo\.js:[0-9]+:[0-9]+)/,
                function (a, b, c) {
                    return `http://utils.highcharts.local/samples/#test/${c}`.cyan;
                }
            );

            // Skip the call stack, it's internal QUnit stuff
            ret = ret.split('<<<splitter>>>')[0];

            return ret;
        },

        preprocessors: {
            '**/unit-tests/*/*/demo.js': ['generic'],
            // Preprocess the visual tests
            '**/highcharts/*/*/demo.js': ['generic'],
            '**/maps/*/*/demo.js': ['generic'],
            '**/stock/*/*/demo.js': ['generic']
        },

        /*
         The preprocessor intervenes with the visual tests and transform them
         to unit tests by comparing a bitmap of the genearated SVG to the
         reference image and asserting the difference.
         */
        genericPreprocessor: {
            rules: [{
                process: function (js, file, done) {
                    const path = file.path.replace(
                        /^.*?samples\/(highcharts|stock|maps|unit-tests)\/([a-z0-9\-]+\/[a-z0-9\-]+)\/demo.js$/g,
                        '$1/$2'
                    );

                    // es6 transpiling
                    // browserDetect(req.headers['user-agent']); not working
                    if (needsTranspiling) {
                        try {
                            js = Babel
                                .transformSync(js, {
                                    ast: false,
                                    code: true,
                                    presets: [[
                                        '@babel/preset-env',
                                        {
                                            targets: {
                                                ie: '8'
                                            }
                                        }
                                    ]]
                                })
                                .code;
                        } catch (error) {
                            console.error('Babel transform error:', error);
                        }
                    }

                    // unit tests
                    if (path.indexOf('unit-tests') !== -1) {
                        if (argv.debug) {
                            if (js.indexOf('Highcharts.setOptions') !== -1) {
                                console.log(
                                    `Warning: ${path} contains Highcharts.setOptions`.yellow
                                );
                            }
                            if (
                                js.indexOf('Highcharts.wrap') !== -1 ||
                                js.indexOf('H.wrap') !== -1
                            ) {
                                console.log(
                                    `Warning: ${path} contains Highcharts.wrap`.yellow
                                );
                            }
                        }
                        done(js);
                        return;
                    }

                    // Skipped from demo.details
                    if (handleDetails(path) === false) {
                        file.path = file.originalPath + '.preprocessed';
                        done(`QUnit.skip('${path}');`);
                        return;
                    }

                    const html = getHTML(path);

                    js = resolveJSON(js);

                    // Don't do intervals (typically for gauge samples, add
                    // point etc)
                    js = js.replace('setInterval', 'Highcharts.noop');

                    // Reset global options
                    let reset = (
                            js.indexOf('Highcharts.setOptions') === -1 &&
                            js.indexOf('Highcharts.getOptions') === -1
                        ) ?
                        '' :
                        `
                        Highcharts.setOptions(
                            JSON.parse(Highcharts.defaultOptionsRaw)
                        );
                        `;

                    // Reset modified callbacks
                    if (js.indexOf('Chart.prototype.callbacks') !== -1) {
                        reset += `
                        Highcharts.Chart.prototype.callbacks =
                            Highcharts.callbacksRaw.slice(0);
                        `;
                    }

                    let assertion;

                    // Set reference image
                    if (argv.reference) {
                        assertion = `
                            let svg = getSVG(chart);

                            if (svg) {
                                __karma__.info({
                                    filename: './samples/${path}/reference.svg',
                                    data: svg
                                });
                                assert.ok(
                                    true,
                                    'Reference created for ${path}'
                                );
                            } else {
                                assert.ok(
                                    false,
                                    '${path}: ' + err
                                );                
                            }
                            done();
                        `;

                    // Reference file doens't exist
                    } else if (!fs.existsSync(
                        `./samples/${path}/reference.svg`
                    )) {
                        console.log(
                        'Reference file doesn\'t exist: '.yellow +
                        ` ./samples/${path}/reference.svg`

                        );
                        file.path = file.originalPath + '.preprocessed';
                        done(`QUnit.skip('${path}');`);
                        return;

                    // Reference file exists, run the comparison
                    } else {

                        try {
                            assertion = `
                                compareToReference(chart, '${path}')
                                    .then(actual => {
                                        assert.strictEqual(
                                            actual,
                                            0,
                                            'Different pixels\\n' +
                                            '- http://utils.highcharts.local/samples/#test/${path}\\n' +
                                            '- samples/${path}/diff.gif'
                                        );
                                        done();
                                    })
                                    .catch(err => {
                                        console.error(err);
                                        done();
                                    });
                            `;
                        } catch (e) {
                            assertion = `
                                assert.ok(false, 'Reference image loaded')
                                done();
                            `;
                        }
                    }


                    js = `

                    QUnit.test('${path}', function (assert) {

                        // console.log('Starting ${path}');

                        // Apply demo.html
                        document.getElementById('demo-html').innerHTML =
                            \`${html}\`;

                        var done = assert.async();
                        ${js}

                        var chart = Highcharts.charts[
                            Highcharts.charts.length - 1
                        ];

                        ${assertion}

                        ${reset}
                    });
                    `;

                    file.path = file.originalPath + '.preprocessed';

                    done(js);
                }
            }]
        }
    };


    if (browsers.some(browser => /^(Mac|Win)\./.test(browser)) || argv.oldie) {
        let properties = getProperties();
        const randomString = Math.random().toString(36).substring(7);

        options.browserStack = {
            username: properties['browserstack.username'],
            accessKey: properties['browserstack.accesskey'],
            project: 'highcharts',
            build: `highcharts-build-${process.env.CIRCLE_BUILD_NUM || randomString} `,
            name: `circle-ci-karma-highcharts-${randomString}`,
            localIdentifier: randomString, // to avoid instances interfering with each other.
            video: false,
            retryLimit: 1,
        };
        options.customLaunchers = argv.oldie ?
            {
                'Win.IE8': {
                    base: 'BrowserStack',
                    browser: 'ie',
                    browser_version: '8.0',
                    os: 'Windows',
                    os_version: 'XP'
                }
            } :
            browserStackBrowsers;
        options.logLevel = config.LOG_INFO;

        // to avoid DISCONNECTED messages when connecting to BrowserStack
        options.concurrency = 1;
        options.browserDisconnectTimeout = 30000; // default 2000
        options.browserDisconnectTolerance = 1; // default 0
        options.browserNoActivityTimeout = 4 * 60 * 1000; // default 10000
        options.browserSocketTimeout = 20000;

        options.plugins = [
            'karma-browserstack-launcher',
            'karma-sharding',
            'karma-generic-preprocessor'
        ];
        if (!argv.oldie) {
            options.plugins.push('karma-qunit');
        }

        options.reporters = ['progress'];

        if (browsers.some(browser => /(Edge)/.test(browser))) {
            // fallback to polling for Edge browsers as websockets disconnects a lot.
            options.transports = ['polling'];
        }

        console.log(
            'BrowserStack initialized. Please wait while tests are uploaded and VMs prepared. ' +
            `Any other test runs must complete before this test run will start. Current Browserstack concurrency rate is ${options.concurrency}..`
        );

    }

    config.set(options);
};
