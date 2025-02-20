QUnit.test('Point colors within color zones(#4430)', function (assert) {
    var chart = $('#container').highcharts({
        chart: {
            type: 'area'
        },
        series: [{
            color: '#00FFFF',
            negativeColor: '#FF0000',
            data: [-1, -1, 1]
        }]
    }).highcharts();


    assert.strictEqual(
        chart.series[0].points[0].color,
        '#FF0000',
        'Negative color'
    );
    assert.strictEqual(
        chart.series[0].points[2].color,
        '#00FFFF',
        'Positive color'
    );

});

// Highcharts 4.1.1, Issue #3898
// negativeColor not rendered correctly when threshold is out of range
QUnit.test('Spline zones out of range', function (assert) {

    var chart = Highcharts.chart('container', {
            title: {
                text: 'Zones were not applied correctly if they were out of range'
            },
            yAxis: {
                tickPositioner: function () {
                    return [-6, -4, -2];
                }
            },
            series: [{
                type: 'spline',
                data: [-4, -3, -2, -3, -2, -4],
                color: '#00f', // setup default zones
                negativeColor: '#f00', // setup default zones
                threshold: 0
            }]
        }),
        series = chart.series[0];

    assert.strictEqual(
        series.data[0].graphic.element.getAttribute('fill'),
        '#f00',
        'Point color should be red.'
    );

    assert.strictEqual(
        series.data[2].graphic.element.getAttribute('fill'),
        '#f00',
        'Point color should be red.'
    );

    assert.strictEqual(
        series.data[5].graphic.element.getAttribute('fill'),
        '#f00',
        'Point color should be red.'
    );

});

QUnit.test('Negative color with crushed chart (#9200)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            height: 75
        },

        legend: {
            enabled: false
        },

        series: [{
            type: 'area',
            data: [],
            negativeColor: '#FF0000'
        }]

    });

    assert.strictEqual(
        chart.container.innerHTML.indexOf('NaN'),
        -1,
        'There should be no NaNs in the SVG'
    );
});

QUnit.test('Zones and column presentational props (#6234)', assert => {
    const chart = Highcharts.chart('container', {
        series: [{
            type: 'column',
            data: [1, 3, 2, 4],
            zoneAxis: 'x',
            color: 'blue',
            zones: [{
                value: 2
            }, {
                color: 'red',
                dashStyle: 'dash',
                borderColor: 'blue',
                borderWidth: 10
            }]

        }]
    });
    const points = chart.series[0].points;

    assert.strictEqual(
        points[0].graphic.element.getAttribute('fill'),
        'blue',
        'No zones fill'
    );

    assert.strictEqual(
        points[0].graphic.element.getAttribute('stroke'),
        '#ffffff',
        'No zones stroke'
    );

    assert.strictEqual(
        points[0].graphic.element.getAttribute('stroke-width'),
        '1',
        'No zones stroke width'
    );

    assert.strictEqual(
        points[0].graphic.element.getAttribute('stroke-dasharray'),
        null,
        'No zones dash array'
    );

    assert.strictEqual(
        points[2].graphic.element.getAttribute('fill'),
        'red',
        'Zones fill'
    );

    assert.strictEqual(
        points[2].graphic.element.getAttribute('stroke'),
        'blue',
        'Zones stroke'
    );

    assert.strictEqual(
        points[2].graphic.element.getAttribute('stroke-width'),
        '10',
        'Zones stroke width'
    );

    assert.strictEqual(
        points[2].graphic.element.getAttribute('stroke-dasharray').replace(/[ px]/g, ''),
        '40,30',
        'Zones dash array'
    );
});

QUnit.test('Adding and removing zones', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            data: [5, 10, 15],
            zones: [{
                value: 10,
                color: '#bada55'
            }]
        }]
    });

    chart.series[0].update({
        zones: []
    });

    assert.strictEqual(
        chart.series[0].graph.attr('visibility'),
        'inherit',
        'Series line is visible after removing zones (#10569).'
    );

    chart.series[0].setVisible(false);

    assert.strictEqual(
        chart.series[0].graph.attr('visibility'),
        'inherit',
        'Series line\'s visibility inherited from the parent group (#10569).'
    );

    chart.series[0].setVisible(true);

    chart.series[0].update({
        zones: [{
            value: 10,
            color: '#bada55'
        }]
    });

    assert.strictEqual(
        chart.series[0].graph.attr('visibility'),
        'hidden',
        'Series line is hidden after adding zones back (#10569).'
    );
});

QUnit.test('#9198 setData and zones', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            height: 500,
            width: 800
        },
        yAxis: {
            min: -3,
            max: 3
        },
        series: [{
            type: 'area',
            negativeColor: 'green',
            data: []
        }]
    });

    chart.series[0].setData([4, 3, 4, -3, -3, 10]);

    assert.strictEqual(
        chart.series[0]['zone-graph-1'].attr('clip-path') !== 0,
        true,
        'Negative color is applied on the line and area.'
    );
});