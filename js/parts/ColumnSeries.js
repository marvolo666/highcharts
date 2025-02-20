/* *
 *
 *  (c) 2010-2019 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from './Globals.js';
/**
 * Adjusted width and x offset of the columns for grouping.
 *
 * @private
 * @interface Highcharts.ColumnMetricsObject
 */ /**
* Width of the columns.
* @name Highcharts.ColumnMetricsObject#width
* @type {number}
*/ /**
* Offset of the columns.
* @name Highcharts.ColumnMetricsObject#offset
* @type {number}
*/
import './Utilities.js';
import './Color.js';
import './Legend.js';
import './Series.js';
import './Options.js';
var animObject = H.animObject, color = H.color, extend = H.extend, defined = H.defined, isNumber = H.isNumber, LegendSymbolMixin = H.LegendSymbolMixin, merge = H.merge, noop = H.noop, pick = H.pick, Series = H.Series, seriesType = H.seriesType, svg = H.svg;
/**
 * The column series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.column
 *
 * @augments Highcharts.Series
 */
seriesType('column', 'line', 
/**
 * Column series display one column per value along an X axis.
 *
 * @sample {highcharts} highcharts/demo/column-basic/
 *         Column chart
 * @sample {highstock} stock/demo/column/
 *         Column chart
 *
 * @extends      plotOptions.line
 * @excluding    connectNulls, dashStyle, gapSize, gapUnit, linecap,
 *               lineWidth, marker, connectEnds, step, useOhlcData
 * @product      highcharts highstock
 * @optionparent plotOptions.column
 */
{
    /**
     * The corner radius of the border surrounding each column or bar.
     *
     * @sample {highcharts} highcharts/plotoptions/column-borderradius/
     *         Rounded columns
     *
     * @product highcharts highstock gantt
     */
    borderRadius: 0,
    /**
     * When using automatic point colors pulled from the global
     * [colors](colors) or series-specific
     * [plotOptions.column.colors](series.colors) collections, this option
     * determines whether the chart should receive one color per series or
     * one color per point.
     *
     * In styled mode, the `colors` or `series.colors` arrays are not
     * supported, and instead this option gives the points individual color
     * class names on the form `highcharts-color-{n}`.
     *
     * @see [series colors](#plotOptions.column.colors)
     *
     * @sample {highcharts} highcharts/plotoptions/column-colorbypoint-false/
     *         False by default
     * @sample {highcharts} highcharts/plotoptions/column-colorbypoint-true/
     *         True
     *
     * @type      {boolean}
     * @default   false
     * @since     2.0
     * @product   highcharts highstock gantt
     * @apioption plotOptions.column.colorByPoint
     */
    /**
     * A series specific or series type specific color set to apply instead
     * of the global [colors](#colors) when [colorByPoint](
     * #plotOptions.column.colorByPoint) is true.
     *
     * @type      {Array<Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject>}
     * @since     3.0
     * @product   highcharts highstock gantt
     * @apioption plotOptions.column.colors
     */
    /**
     * When true, each column edge is rounded to its nearest pixel in order
     * to render sharp on screen. In some cases, when there are a lot of
     * densely packed columns, this leads to visible difference in column
     * widths or distance between columns. In these cases, setting `crisp`
     * to `false` may look better, even though each column is rendered
     * blurry.
     *
     * @sample {highcharts} highcharts/plotoptions/column-crisp-false/
     *         Crisp is false
     *
     * @since   5.0.10
     * @product highcharts highstock gantt
     */
    crisp: true,
    /**
     * Padding between each value groups, in x axis units.
     *
     * @sample {highcharts} highcharts/plotoptions/column-grouppadding-default/
     *         0.2 by default
     * @sample {highcharts} highcharts/plotoptions/column-grouppadding-none/
     *         No group padding - all columns are evenly spaced
     *
     * @product highcharts highstock gantt
     */
    groupPadding: 0.2,
    /**
     * Whether to group non-stacked columns or to let them render
     * independent of each other. Non-grouped columns will be laid out
     * individually and overlap each other.
     *
     * @sample {highcharts} highcharts/plotoptions/column-grouping-false/
     *         Grouping disabled
     * @sample {highstock} highcharts/plotoptions/column-grouping-false/
     *         Grouping disabled
     *
     * @type      {boolean}
     * @default   true
     * @since     2.3.0
     * @product   highcharts highstock gantt
     * @apioption plotOptions.column.grouping
     */
    /**
     * @ignore-option
     */
    marker: null,
    /**
     * The maximum allowed pixel width for a column, translated to the
     * height of a bar in a bar chart. This prevents the columns from
     * becoming too wide when there is a small number of points in the
     * chart.
     *
     * @see [pointWidth](#plotOptions.column.pointWidth)
     *
     * @sample {highcharts} highcharts/plotoptions/column-maxpointwidth-20/
     *         Limited to 50
     * @sample {highstock} highcharts/plotoptions/column-maxpointwidth-20/
     *         Limited to 50
     *
     * @type      {number}
     * @since     4.1.8
     * @product   highcharts highstock gantt
     * @apioption plotOptions.column.maxPointWidth
     */
    /**
     * Padding between each column or bar, in x axis units.
     *
     * @sample {highcharts} highcharts/plotoptions/column-pointpadding-default/
     *         0.1 by default
     * @sample {highcharts} highcharts/plotoptions/column-pointpadding-025/
     *          0.25
     * @sample {highcharts} highcharts/plotoptions/column-pointpadding-none/
     *         0 for tightly packed columns
     *
     * @product highcharts highstock gantt
     */
    pointPadding: 0.1,
    /**
     * A pixel value specifying a fixed width for each column or bar. When
     * `null`, the width is calculated from the `pointPadding` and
     * `groupPadding`.
     *
     * @see [maxPointWidth](#plotOptions.column.maxPointWidth)
     *
     * @sample {highcharts} highcharts/plotoptions/column-pointwidth-20/
     *         20px wide columns regardless of chart width or the amount of
     *         data points
     *
     * @type      {number}
     * @since     1.2.5
     * @product   highcharts highstock gantt
     * @apioption plotOptions.column.pointWidth
     */
    /**
     * A pixel value specifying a fixed width for the column or bar.
     * Overrides pointWidth on the series.
     *
     * @see [series.pointWidth](#plotOptions.column.pointWidth)
     *
     * @type      {number}
     * @default   undefined
     * @since     7.0.0
     * @product   highcharts highstock gantt
     * @apioption series.column.data.pointWidth
     */
    /**
     * The minimal height for a column or width for a bar. By default,
     * 0 values are not shown. To visualize a 0 (or close to zero) point,
     * set the minimal point length to a pixel value like 3\. In stacked
     * column charts, minPointLength might not be respected for tightly
     * packed values.
     *
     * @sample {highcharts} highcharts/plotoptions/column-minpointlength/
     *         Zero base value
     * @sample {highcharts} highcharts/plotoptions/column-minpointlength-pos-and-neg/
     *         Positive and negative close to zero values
     *
     * @product highcharts highstock gantt
     */
    minPointLength: 0,
    /**
     * When the series contains less points than the crop threshold, all
     * points are drawn, event if the points fall outside the visible plot
     * area at the current zoom. The advantage of drawing all points
     * (including markers and columns), is that animation is performed on
     * updates. On the other hand, when the series contains more points than
     * the crop threshold, the series data is cropped to only contain points
     * that fall within the plot area. The advantage of cropping away
     * invisible points is to increase performance on large series.
     *
     * @product highcharts highstock gantt
     */
    cropThreshold: 50,
    /**
     * The X axis range that each point is valid for. This determines the
     * width of the column. On a categorized axis, the range will be 1
     * by default (one category unit). On linear and datetime axes, the
     * range will be computed as the distance between the two closest data
     * points.
     *
     * The default `null` means it is computed automatically, but this
     * option can be used to override the automatic value.
     *
     * @sample {highcharts} highcharts/plotoptions/column-pointrange/
     *         Set the point range to one day on a data set with one week
     *         between the points
     *
     * @type    {number|null}
     * @since   2.3
     * @product highcharts highstock gantt
     */
    pointRange: null,
    states: {
        /**
         * Options for the hovered point. These settings override the normal
         * state options when a point is moused over or touched.
         *
         * @extends   plotOptions.series.states.hover
         * @excluding halo, lineWidth, lineWidthPlus, marker
         * @product   highcharts highstock gantt
         */
        hover: {
            /** @ignore-option */
            halo: false,
            /**
             * A specific border color for the hovered point. Defaults to
             * inherit the normal state border color.
             *
             * @type      {Highcharts.ColorString}
             * @product   highcharts gantt
             * @apioption plotOptions.column.states.hover.borderColor
             */
            /**
             * A specific color for the hovered point.
             *
             * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             * @product   highcharts gantt
             * @apioption plotOptions.column.states.hover.color
             */
            /**
             * How much to brighten the point on interaction. Requires the
             * main color to be defined in hex or rgb(a) format.
             *
             * In styled mode, the hover brightening is by default replaced
             * with a fill-opacity set in the `.highcharts-point:hover`
             * rule.
             *
             * @sample {highcharts} highcharts/plotoptions/column-states-hover-brightness/
             *         Brighten by 0.5
             *
             * @product highcharts highstock gantt
             */
            brightness: 0.1
        },
        /**
         * Options for the selected point. These settings override the
         * normal state options when a point is selected.
         *
         * @extends   plotOptions.series.states.select
         * @excluding halo, lineWidth, lineWidthPlus, marker
         * @product   highcharts highstock gantt
         */
        select: {
            /**
             * A specific color for the selected point.
             *
             * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             * @default #cccccc
             * @product highcharts highstock gantt
             */
            color: '${palette.neutralColor20}',
            /**
             * A specific border color for the selected point.
             *
             * @type    {Highcharts.ColorString}
             * @default #000000
             * @product highcharts highstock gantt
             */
            borderColor: '${palette.neutralColor100}'
        }
    },
    dataLabels: {
        /**
         * @internal
         */
        align: null,
        /**
         * @internal
         */
        verticalAlign: null,
        /** @internal */
        y: null
    },
    /**
     * When this is true, the series will not cause the Y axis to cross
     * the zero plane (or [threshold](#plotOptions.series.threshold) option)
     * unless the data actually crosses the plane.
     *
     * For example, if `softThreshold` is `false`, a series of 0, 1, 2,
     * 3 will make the Y axis show negative values according to the
     * `minPadding` option. If `softThreshold` is `true`, the Y axis starts
     * at 0.
     *
     * @since   4.1.9
     * @product highcharts highstock
     */
    softThreshold: false,
    // false doesn't work well: https://jsfiddle.net/highcharts/hz8fopan/14/
    /** @ignore-option */
    startFromThreshold: true,
    stickyTracking: false,
    tooltip: {
        distance: 6
    },
    /**
     * The Y axis value to serve as the base for the columns, for
     * distinguishing between values above and below a threshold. If `null`,
     * the columns extend from the padding Y axis minimum.
     *
     * @since   2.0
     * @product highcharts
     */
    threshold: 0,
    /**
     * The width of the border surrounding each column or bar. Defaults to
     * `1` when there is room for a border, but to `0` when the columns are
     * so dense that a border would cover the next column.
     *
     * In styled mode, the stroke width can be set with the
     * `.highcharts-point` rule.
     *
     * @sample {highcharts} highcharts/plotoptions/column-borderwidth/
     *         2px black border
     *
     * @type      {number}
     * @default   undefined
     * @product   highcharts highstock gantt
     * @apioption plotOptions.column.borderWidth
     */
    /**
     * The color of the border surrounding each column or bar.
     *
     * In styled mode, the border stroke can be set with the
     * `.highcharts-point` rule.
     *
     * @sample {highcharts} highcharts/plotoptions/column-bordercolor/
     *         Dark gray border
     *
     * @type      {Highcharts.ColorString}
     * @default   #ffffff
     * @product   highcharts highstock gantt
     */
    borderColor: '${palette.backgroundColor}'
}, 
/**
 * @lends seriesTypes.column.prototype
 */
{
    cropShoulder: 0,
    // When tooltip is not shared, this series (and derivatives) requires
    // direct touch/hover. KD-tree does not apply.
    directTouch: true,
    trackerGroups: ['group', 'dataLabelsGroup'],
    // use separate negative stacks, unlike area stacks where a negative
    // point is substracted from previous (#1910)
    negStacks: true,
    /* eslint-disable valid-jsdoc */
    /**
     * Initialize the series. Extends the basic Series.init method by
     * marking other series of the same type as dirty.
     *
     * @private
     * @function Highcharts.seriesTypes.column#init
     */
    init: function () {
        Series.prototype.init.apply(this, arguments);
        var series = this, chart = series.chart;
        // if the series is added dynamically, force redraw of other
        // series affected by a new column
        if (chart.hasRendered) {
            chart.series.forEach(function (otherSeries) {
                if (otherSeries.type === series.type) {
                    otherSeries.isDirty = true;
                }
            });
        }
    },
    /**
     * Return the width and x offset of the columns adjusted for grouping,
     * groupPadding, pointPadding, pointWidth etc.
     *
     * @private
     * @function Highcharts.seriesTypes.column#getColumnMetrics
     *
     * @return {Highcharts.ColumnMetricsObject}
     */
    getColumnMetrics: function () {
        var series = this, options = series.options, xAxis = series.xAxis, yAxis = series.yAxis, reversedStacks = xAxis.options.reversedStacks, 
        // Keep backward compatibility: reversed xAxis had reversed
        // stacks
        reverseStacks = (xAxis.reversed && !reversedStacks) ||
            (!xAxis.reversed && reversedStacks), stackKey, stackGroups = {}, columnCount = 0;
        // Get the total number of column type series. This is called on
        // every series. Consider moving this logic to a chart.orderStacks()
        // function and call it on init, addSeries and removeSeries
        if (options.grouping === false) {
            columnCount = 1;
        }
        else {
            series.chart.series.forEach(function (otherSeries) {
                var otherYAxis = otherSeries.yAxis, otherOptions = otherSeries.options, columnIndex;
                if (otherSeries.type === series.type &&
                    (otherSeries.visible ||
                        !series.chart.options.chart
                            .ignoreHiddenSeries) &&
                    yAxis.len === otherYAxis.len &&
                    yAxis.pos === otherYAxis.pos) { // #642, #2086
                    if (otherOptions.stacking) {
                        stackKey = otherSeries.stackKey;
                        if (stackGroups[stackKey] === undefined) {
                            stackGroups[stackKey] = columnCount++;
                        }
                        columnIndex = stackGroups[stackKey];
                    }
                    else if (otherOptions.grouping !== false) { // #1162
                        columnIndex = columnCount++;
                    }
                    otherSeries.columnIndex = columnIndex;
                }
            });
        }
        var categoryWidth = Math.min(Math.abs(xAxis.transA) * (xAxis.ordinalSlope ||
            options.pointRange ||
            xAxis.closestPointRange ||
            xAxis.tickInterval ||
            1), // #2610
        xAxis.len // #1535
        ), groupPadding = categoryWidth * options.groupPadding, groupWidth = categoryWidth - 2 * groupPadding, pointOffsetWidth = groupWidth / (columnCount || 1), pointWidth = Math.min(options.maxPointWidth || xAxis.len, pick(options.pointWidth, pointOffsetWidth * (1 - 2 * options.pointPadding))), pointPadding = (pointOffsetWidth - pointWidth) / 2, 
        // #1251, #3737
        colIndex = (series.columnIndex || 0) + (reverseStacks ? 1 : 0), pointXOffset = pointPadding +
            (groupPadding +
                colIndex * pointOffsetWidth -
                (categoryWidth / 2)) * (reverseStacks ? -1 : 1);
        // Save it for reading in linked series (Error bars particularly)
        series.columnMetrics = {
            width: pointWidth,
            offset: pointXOffset
        };
        return series.columnMetrics;
    },
    /**
     * Make the columns crisp. The edges are rounded to the nearest full
     * pixel.
     *
     * @private
     * @function Highcharts.seriesTypes.column#crispCol
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @return {Highcharts.BBoxObject}
     */
    crispCol: function (x, y, w, h) {
        var chart = this.chart, borderWidth = this.borderWidth, xCrisp = -(borderWidth % 2 ? 0.5 : 0), yCrisp = borderWidth % 2 ? 0.5 : 1, right, bottom, fromTop;
        if (chart.inverted && chart.renderer.isVML) {
            yCrisp += 1;
        }
        // Horizontal. We need to first compute the exact right edge, then
        // round it and compute the width from there.
        if (this.options.crisp) {
            right = Math.round(x + w) + xCrisp;
            x = Math.round(x) + xCrisp;
            w = right - x;
        }
        // Vertical
        bottom = Math.round(y + h) + yCrisp;
        fromTop = Math.abs(y) <= 0.5 && bottom > 0.5; // #4504, #4656
        y = Math.round(y) + yCrisp;
        h = bottom - y;
        // Top edges are exceptions
        if (fromTop && h) { // #5146
            y -= 1;
            h += 1;
        }
        return {
            x: x,
            y: y,
            width: w,
            height: h
        };
    },
    /**
     * Translate each point to the plot area coordinate system and find
     * shape positions
     *
     * @private
     * @function Highcharts.seriesTypes.column#translate
     */
    translate: function () {
        var series = this, chart = series.chart, options = series.options, dense = series.dense =
            series.closestPointRange * series.xAxis.transA < 2, borderWidth = series.borderWidth = pick(options.borderWidth, dense ? 0 : 1 // #3635
        ), yAxis = series.yAxis, threshold = options.threshold, translatedThreshold = series.translatedThreshold =
            yAxis.getThreshold(threshold), minPointLength = pick(options.minPointLength, 5), metrics = series.getColumnMetrics(), seriesPointWidth = metrics.width, 
        // postprocessed for border width
        seriesBarW = series.barW =
            Math.max(seriesPointWidth, 1 + 2 * borderWidth), seriesXOffset = series.pointXOffset = metrics.offset, dataMin = series.dataMin, dataMax = series.dataMax;
        if (chart.inverted) {
            translatedThreshold -= 0.5; // #3355
        }
        // When the pointPadding is 0, we want the columns to be packed
        // tightly, so we allow individual columns to have individual sizes.
        // When pointPadding is greater, we strive for equal-width columns
        // (#2694).
        if (options.pointPadding) {
            seriesBarW = Math.ceil(seriesBarW);
        }
        Series.prototype.translate.apply(series);
        // Record the new values
        series.points.forEach(function (point) {
            var yBottom = pick(point.yBottom, translatedThreshold), safeDistance = 999 + Math.abs(yBottom), pointWidth = seriesPointWidth, 
            // Don't draw too far outside plot area (#1303, #2241,
            // #4264)
            plotY = Math.min(Math.max(-safeDistance, point.plotY), yAxis.len + safeDistance), barX = point.plotX + seriesXOffset, barW = seriesBarW, barY = Math.min(plotY, yBottom), up, barH = Math.max(plotY, yBottom) - barY;
            // Handle options.minPointLength
            if (minPointLength && Math.abs(barH) < minPointLength) {
                barH = minPointLength;
                up = (!yAxis.reversed && !point.negative) ||
                    (yAxis.reversed && point.negative);
                // Reverse zeros if there's no positive value in the series
                // in visible range (#7046)
                if (point.y === threshold &&
                    series.dataMax <= threshold &&
                    // and if there's room for it (#7311)
                    yAxis.min < threshold &&
                    // if all points are the same value (i.e zero) not draw
                    // as negative points (#10646)
                    dataMin !== dataMax) {
                    up = !up;
                }
                // If stacked...
                barY = (Math.abs(barY - translatedThreshold) > minPointLength ?
                    // ...keep position
                    yBottom - minPointLength :
                    // #1485, #4051
                    translatedThreshold -
                        (up ? minPointLength : 0));
            }
            // Handle point.options.pointWidth
            // @todo Handle grouping/stacking too. Calculate offset properly
            if (defined(point.options.pointWidth)) {
                pointWidth = barW =
                    Math.ceil(point.options.pointWidth);
                barX -= Math.round((pointWidth - seriesPointWidth) / 2);
            }
            // Cache for access in polar
            point.barX = barX;
            point.pointWidth = pointWidth;
            // Fix the tooltip on center of grouped columns (#1216, #424,
            // #3648)
            point.tooltipPos = chart.inverted ?
                [
                    yAxis.len + yAxis.pos - chart.plotLeft - plotY,
                    series.xAxis.len - barX - barW / 2, barH
                ] :
                [barX + barW / 2, plotY + yAxis.pos -
                        chart.plotTop, barH];
            // Register shape type and arguments to be used in drawPoints
            // Allow shapeType defined on pointClass level
            point.shapeType =
                series.pointClass.prototype.shapeType || 'rect';
            point.shapeArgs = series.crispCol.apply(series, point.isNull ?
                // #3169, drilldown from null must have a position to work
                // from #6585, dataLabel should be placed on xAxis, not
                // floating in the middle of the chart
                [barX, translatedThreshold, barW, 0] :
                [barX, barY, barW, barH]);
        });
    },
    getSymbol: noop,
    /**
     * Use a solid rectangle like the area series types
     *
     * @private
     * @function Highcharts.seriesTypes.column#drawLegendSymbol
     *
     * @param {Highcharts.Legend} legend
     *        The legend object
     *
     * @param {Highcharts.Series|Highcharts.Point} item
     *        The series (this) or point
     */
    drawLegendSymbol: LegendSymbolMixin.drawRectangle,
    /**
     * Columns have no graph
     *
     * @private
     * @function Highcharts.seriesTypes.column#drawGraph
     */
    drawGraph: function () {
        this.group[this.dense ? 'addClass' : 'removeClass']('highcharts-dense-data');
    },
    /**
     * Get presentational attributes
     *
     * @private
     * @function Highcharts.seriesTypes.column#pointAttribs
     *
     * @param {Highcharts.Point} point
     *
     * @param {string} state
     *
     * @return {Highcharts.SVGAttributes}
     */
    pointAttribs: function (point, state) {
        var options = this.options, stateOptions, ret, p2o = this.pointAttrToOptions || {}, strokeOption = p2o.stroke || 'borderColor', strokeWidthOption = p2o['stroke-width'] || 'borderWidth', fill = (point && point.color) || this.color, 
        // set to fill when borderColor null:
        stroke = ((point && point[strokeOption]) ||
            options[strokeOption] ||
            this.color ||
            fill), strokeWidth = (point && point[strokeWidthOption]) ||
            options[strokeWidthOption] ||
            this[strokeWidthOption] || 0, dashstyle = (point && point.dashStyle) || options.dashStyle, opacity = pick(options.opacity, 1), zone, brightness;
        // Handle zone colors
        if (point && this.zones.length) {
            zone = point.getZone();
            // When zones are present, don't use point.color (#4267).
            // Changed order (#6527), added support for colorAxis (#10670)
            fill = (point.options.color ||
                (zone && (zone.color || point.nonZonedColor)) ||
                this.color);
            if (zone) {
                stroke = zone.borderColor || stroke;
                dashstyle = zone.dashStyle || dashstyle;
                strokeWidth = zone.borderWidth || strokeWidth;
            }
        }
        // Select or hover states
        if (state) {
            stateOptions = merge(options.states[state], 
            // #6401
            point.options.states && point.options.states[state] || {});
            brightness = stateOptions.brightness;
            fill =
                stateOptions.color || (brightness !== undefined &&
                    color(fill)
                        .brighten(stateOptions.brightness)
                        .get()) || fill;
            stroke = stateOptions[strokeOption] || stroke;
            strokeWidth =
                stateOptions[strokeWidthOption] || strokeWidth;
            dashstyle = stateOptions.dashStyle || dashstyle;
            opacity = pick(stateOptions.opacity, opacity);
        }
        ret = {
            fill: fill,
            stroke: stroke,
            'stroke-width': strokeWidth,
            opacity: opacity
        };
        if (dashstyle) {
            ret.dashstyle = dashstyle;
        }
        return ret;
    },
    /**
     * Draw the columns. For bars, the series.group is rotated, so the same
     * coordinates apply for columns and bars. This method is inherited by
     * scatter series.
     *
     * @private
     * @function Highcharts.seriesTypes.column#drawPoints
     */
    drawPoints: function () {
        var series = this, chart = this.chart, options = series.options, renderer = chart.renderer, animationLimit = options.animationLimit || 250, shapeArgs;
        // draw the columns
        series.points.forEach(function (point) {
            var plotY = point.plotY, graphic = point.graphic, verb = graphic && chart.pointCount < animationLimit ?
                'animate' : 'attr';
            if (isNumber(plotY) && point.y !== null) {
                shapeArgs = point.shapeArgs;
                // When updating a series between 2d and 3d or cartesian and
                // polar, the shape type changes.
                if (graphic &&
                    graphic.element.nodeName !== point.shapeType) {
                    graphic = graphic.destroy();
                }
                if (graphic) { // update
                    graphic[verb](merge(shapeArgs));
                }
                else {
                    point.graphic = graphic =
                        renderer[point.shapeType](shapeArgs)
                            .add(point.group || series.group);
                }
                // Border radius is not stylable (#6900)
                if (options.borderRadius) {
                    graphic[verb]({
                        r: options.borderRadius
                    });
                }
                // Presentational
                if (!chart.styledMode) {
                    graphic[verb](series.pointAttribs(point, point.selected && 'select'))
                        .shadow(point.allowShadow !== false && options.shadow, null, options.stacking && !options.borderRadius);
                }
                graphic.addClass(point.getClassName(), true);
            }
            else if (graphic) {
                point.graphic = graphic.destroy(); // #1269
            }
        });
    },
    /**
     * Animate the column heights one by one from zero.
     *
     * @private
     * @function Highcharts.seriesTypes.column#animate
     *
     * @param {boolean} init
     *        Whether to initialize the animation or run it
     */
    animate: function (init) {
        var series = this, yAxis = this.yAxis, options = series.options, inverted = this.chart.inverted, attr = {}, translateProp = inverted ? 'translateX' : 'translateY', translateStart, translatedThreshold;
        if (svg) { // VML is too slow anyway
            if (init) {
                attr.scaleY = 0.001;
                translatedThreshold = Math.min(yAxis.pos + yAxis.len, Math.max(yAxis.pos, yAxis.toPixels(options.threshold)));
                if (inverted) {
                    attr.translateX = translatedThreshold - yAxis.len;
                }
                else {
                    attr.translateY = translatedThreshold;
                }
                // apply finnal clipping (used in Highstock) (#7083)
                // animation is done by scaleY, so cliping is for panes
                if (series.clipBox) {
                    series.setClip();
                }
                series.group.attr(attr);
            }
            else { // run the animation
                translateStart = series.group.attr(translateProp);
                series.group.animate({ scaleY: 1 }, extend(animObject(series.options.animation), {
                    // Do the scale synchronously to ensure smooth
                    // updating (#5030, #7228)
                    step: function (val, fx) {
                        attr[translateProp] =
                            translateStart +
                                fx.pos * (yAxis.pos - translateStart);
                        series.group.attr(attr);
                    }
                }));
                // delete this function to allow it only once
                series.animate = null;
            }
        }
    },
    /**
     * Remove this series from the chart
     *
     * @private
     * @function Highcharts.seriesTypes.column#remove
     */
    remove: function () {
        var series = this, chart = series.chart;
        // column and bar series affects other series of the same type
        // as they are either stacked or grouped
        if (chart.hasRendered) {
            chart.series.forEach(function (otherSeries) {
                if (otherSeries.type === series.type) {
                    otherSeries.isDirty = true;
                }
            });
        }
        Series.prototype.remove.apply(series, arguments);
    }
});
/* eslint-enable valid-jsdoc */
/**
 * A `column` series. If the [type](#series.column.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.column
 * @excluding connectNulls, dataParser, dataURL, gapSize, gapUnit, linecap,
 *            lineWidth, marker, connectEnds, step
 * @product   highcharts highstock
 * @apioption series.column
 */
/**
 * An array of data points for the series. For the `column` series type,
 * points can be given in the following ways:
 *
 * 1. An array of numerical values. In this case, the numerical values will be
 *    interpreted as `y` options. The `x` values will be automatically
 *    calculated, either starting at 0 and incremented by 1, or from
 *    `pointStart` and `pointInterval` given in the series options. If the axis
 *    has categories, these will be used. Example:
 *    ```js
 *    data: [0, 5, 3, 5]
 *    ```
 *
 * 2. An array of arrays with 2 values. In this case, the values correspond to
 *    `x,y`. If the first value is a string, it is applied as the name of the
 *    point, and the `x` value is inferred.
 *    ```js
 *    data: [
 *        [0, 6],
 *        [1, 2],
 *        [2, 6]
 *    ]
 *    ```
 *
 * 3. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.column.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        y: 9,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        y: 6,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * @sample {highcharts} highcharts/chart/reflow-true/
 *         Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/
 *         Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *         Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/
 *         Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type      {Array<number|Array<(number|string),(number|null)>|null|*>}
 * @extends   series.line.data
 * @excluding marker
 * @product   highcharts highstock
 * @apioption series.column.data
 */
/**
 * The color of the border surrounding the column or bar.
 *
 * In styled mode, the border stroke can be set with the `.highcharts-point`
 * rule.
 *
 * @sample {highcharts} highcharts/plotoptions/column-bordercolor/
 *         Dark gray border
 *
 * @type      {Highcharts.ColorString}
 * @product   highcharts highstock
 * @apioption series.column.data.borderColor
 */
/**
 * The width of the border surrounding the column or bar.
 *
 * In styled mode, the stroke width can be set with the `.highcharts-point`
 * rule.
 *
 * @sample {highcharts} highcharts/plotoptions/column-borderwidth/
 *         2px black border
 *
 * @type      {number}
 * @product   highcharts highstock
 * @apioption series.column.data.borderWidth
 */
/**
 * @excluding halo, lineWidth, lineWidthPlus, marker
 * @product   highcharts highstock
 * @apioption series.column.states.hover
 */
/**
 * @excluding halo, lineWidth, lineWidthPlus, marker
 * @product   highcharts highstock
 * @apioption series.column.states.select
 */
''; // includes above doclets in transpilat
