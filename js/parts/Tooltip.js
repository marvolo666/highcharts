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
 * Callback function to format the text of the tooltip from scratch.
 *
 * In case of single or shared tooltips, a string should be be returned. In case
 * of splitted tooltips, it should return an array where the first item is the
 * header, and subsequent items are mapped to the points. Return `false` to
 * disable tooltip for a specific point on series.
 *
 * @callback Highcharts.TooltipFormatterCallbackFunction
 *
 * @param {Highcharts.TooltipFormatterContextObject} this
 *        Context to format

 * @param {Highcharts.Tooltip} tooltip
 *        The tooltip instance
 *
 * @return {false|string|Array<string>}
 *         Formatted text or false
 */
/**
 * @interface Highcharts.TooltipFormatterContextObject
 */ /**
* @name Highcharts.TooltipFormatterContextObject#color
* @type {Highcharts.ColorString}
*/ /**
* @name Highcharts.TooltipFormatterContextObject#colorIndex
* @type {number|undefined}
*/ /**
* @name Highcharts.TooltipFormatterContextObject#key
* @type {number}
*/ /**
* @name Highcharts.TooltipFormatterContextObject#percentage
* @type {number|undefined}
*/ /**
* @name Highcharts.TooltipFormatterContextObject#point
* @type {Highcharts.Point}
*/ /**
* @name Highcharts.TooltipFormatterContextObject#points
* @type {Array<Highcharts.TooltipFormatterContextObject>|undefined}
*/ /**
* @name Highcharts.TooltipFormatterContextObject#series
* @type {Highcharts.Series}
*/ /**
* @name Highcharts.TooltipFormatterContextObject#total
* @type {number|undefined}
*/ /**
* @name Highcharts.TooltipFormatterContextObject#x
* @type {number}
*/ /**
* @name Highcharts.TooltipFormatterContextObject#y
* @type {number}
*/
/**
 * A callback function to place the tooltip in a specific position.
 *
 * @callback Highcharts.TooltipPositionerCallbackFunction
 *
 * @param {number} labelWidth
 *        Width of the tooltip.
 *
 * @param {number} labelHeight
 *        Height of the tooltip.
 *
 * @param {Highcharts.TooltipPositionerPointObject} point
 *        Point information for positioning a tooltip.
 *
 * @return {Highcharts.PositionObject}
 *         New position for the tooltip.
 */
/**
 * Point information for positioning a tooltip.
 *
 * @interface Highcharts.TooltipPositionerPointObject
 */ /**
* If `tooltip.split` option is enabled and positioner is called for each of the
* boxes separately, this property indicates the call on the xAxis header, which
* is not a point itself.
* @name Highcharts.TooltipPositionerPointObject#isHeader
* @type {boolean}
*/ /**
* @name Highcharts.TooltipPositionerPointObject#negative
* @type {boolean}
*/ /**
* The reference point relative to the plot area. Add chart.plotLeft to get the
* full coordinates.
* @name Highcharts.TooltipPositionerPointObject#plotX
* @type {number}
*/ /**
* The reference point relative to the plot area. Add chart.plotTop to get the
* full coordinates.
* @name Highcharts.TooltipPositionerPointObject#plotY
* @type {number}
*/
/**
 * @typedef {"callout"|"circle"|"square"} Highcharts.TooltipShapeValue
 */
import './Utilities.js';
var doc = H.doc, defined = H.defined, extend = H.extend, format = H.format, isNumber = H.isNumber, merge = H.merge, pick = H.pick, splat = H.splat, syncTimeout = H.syncTimeout, timeUnits = H.timeUnits;
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * Tooltip of a chart.
 *
 * @class
 * @name Highcharts.Tooltip
 *
 * @param {Highcharts.Chart} chart
 *        The chart instance.
 *
 * @param {Highcharts.TooltipOptions} options
 *        Tooltip options.
 */
H.Tooltip = function () {
    this.init.apply(this, arguments);
};
H.Tooltip.prototype = {
    /**
     * @private
     * @function Highcharts.Tooltip#init
     *
     * @param {Highcharts.Chart} chart
     *        The chart instance.
     *
     * @param {Highcharts.TooltipOptions} options
     *        Tooltip options.
     *
     * @return {void}
     */
    init: function (chart, options) {
        /**
         * Chart of the tooltip.
         *
         * @readonly
         * @name Highcharts.Tooltip#chart
         * @type {Highcharts.Chart}
         */
        this.chart = chart;
        /**
         * Used tooltip options.
         *
         * @readonly
         * @name Highcharts.Tooltip#options
         * @type {Highcharts.TooltipOptions}
         */
        this.options = options;
        /**
         * List of crosshairs.
         *
         * @private
         * @readonly
         * @name Highcharts.Tooltip#crosshairs
         * @type {Array<*>}
         */
        this.crosshairs = [];
        /**
         * Current values of x and y when animating.
         *
         * @private
         * @readonly
         * @name Highcharts.Tooltip#now
         * @type {Highcharts.PositionObject}
         */
        this.now = { x: 0, y: 0 };
        /**
         * Tooltips are initially hidden.
         *
         * @private
         * @readonly
         * @name Highcharts.Tooltip#isHidden
         * @type {boolean}
         */
        this.isHidden = true;
        /**
         * True, if the tooltip is splitted into one label per series, with the
         * header close to the axis.
         *
         * @readonly
         * @name Highcharts.Tooltip#split
         * @type {boolean|undefined}
         */
        this.split = options.split && !chart.inverted;
        /**
         * When the tooltip is shared, the entire plot area will capture mouse
         * movement or touch events.
         *
         * @readonly
         * @name Highcharts.Tooltip#shared
         * @type {boolean|undefined}
         */
        this.shared = options.shared || this.split;
        /**
         * Whether to allow the tooltip to render outside the chart's SVG
         * element box. By default (false), the tooltip is rendered within the
         * chart's SVG element, which results in the tooltip being aligned
         * inside the chart area.
         *
         * @readonly
         * @name Highcharts.Tooltip#outside
         * @type {boolean}
         *
         * @todo
         * Split tooltip does not support outside in the first iteration. Should
         * not be too complicated to implement.
         */
        this.outside = (pick(options.outside, Boolean(chart.scrollablePixelsX || chart.scrollablePixelsY)) &&
            !this.split);
    },
    /**
     * Destroy the single tooltips in a split tooltip.
     * If the tooltip is active then it is not destroyed, unless forced to.
     *
     * @private
     * @function Highcharts.Tooltip#cleanSplit
     *
     * @param {boolean} [force]
     *        Force destroy all tooltips.
     *
     * @return {void}
     */
    cleanSplit: function (force) {
        this.chart.series.forEach(function (series) {
            var tt = series && series.tt;
            if (tt) {
                if (!tt.isActive || force) {
                    series.tt = tt.destroy();
                }
                else {
                    tt.isActive = false;
                }
            }
        });
    },
    /**
     * In styled mode, apply the default filter for the tooltip drop-shadow. It
     * needs to have an id specific to the chart, otherwise there will be issues
     * when one tooltip adopts the filter of a different chart, specifically one
     * where the container is hidden.
     *
     * @private
     * @function Highcharts.Tooltip#applyFilter
     * @return {void}
     */
    applyFilter: function () {
        var chart = this.chart;
        chart.renderer.definition({
            tagName: 'filter',
            id: 'drop-shadow-' + chart.index,
            opacity: 0.5,
            children: [{
                    tagName: 'feGaussianBlur',
                    'in': 'SourceAlpha',
                    stdDeviation: 1
                }, {
                    tagName: 'feOffset',
                    dx: 1,
                    dy: 1
                }, {
                    tagName: 'feComponentTransfer',
                    children: [{
                            tagName: 'feFuncA',
                            type: 'linear',
                            slope: 0.3
                        }]
                }, {
                    tagName: 'feMerge',
                    children: [{
                            tagName: 'feMergeNode'
                        }, {
                            tagName: 'feMergeNode',
                            'in': 'SourceGraphic'
                        }]
                }]
        });
        chart.renderer.definition({
            tagName: 'style',
            textContent: '.highcharts-tooltip-' + chart.index + '{' +
                'filter:url(#drop-shadow-' + chart.index + ')' +
                '}'
        });
    },
    /**
     * Creates the Tooltip label element if it does not exist, then returns it.
     *
     * @function Highcharts.Tooltip#getLabel
     * @return {Highcharts.SVGElement}
     */
    getLabel: function () {
        var tooltip = this, renderer = this.chart.renderer, styledMode = this.chart.styledMode, options = this.options, className = 'tooltip' +
            (defined(options.className) ? ' ' + options.className : ''), container, set;
        if (!this.label) {
            if (this.outside) {
                /**
                 * Reference to the tooltip's container, when
                 * [Highcharts.Tooltip#outside] is set to true, otherwise
                 * it's undefined.
                 *
                 * @name Highcharts.Tooltip#container
                 * @type {Highcharts.HTMLDOMElement|undefined}
                 */
                this.container = container = H.doc.createElement('div');
                container.className = 'highcharts-tooltip-container';
                H.css(container, {
                    position: 'absolute',
                    top: '1px',
                    pointerEvents: options.style && options.style.pointerEvents,
                    zIndex: 3
                });
                H.doc.body.appendChild(container);
                /**
                 * Reference to the tooltip's renderer, when
                 * [Highcharts.Tooltip#outside] is set to true, otherwise
                 * it's undefined.
                 *
                 * @name Highcharts.Tooltip#renderer
                 * @type {Highcharts.SVGRenderer|undefined}
                 */
                this.renderer = renderer = new H.Renderer(container, 0, 0);
            }
            // Create the label
            if (this.split) {
                this.label = renderer.g(className);
            }
            else {
                this.label = renderer
                    .label('', 0, 0, options.shape || 'callout', null, null, options.useHTML, null, className)
                    .attr({
                    padding: options.padding,
                    r: options.borderRadius
                });
                if (!styledMode) {
                    this.label
                        .attr({
                        'fill': options.backgroundColor,
                        'stroke-width': options.borderWidth
                    })
                        // #2301, #2657
                        .css(options.style)
                        .shadow(options.shadow);
                }
            }
            if (styledMode) {
                // Apply the drop-shadow filter
                this.applyFilter();
                this.label.addClass('highcharts-tooltip-' + this.chart.index);
            }
            if (this.outside) {
                set = {
                    x: this.label.xSetter,
                    y: this.label.ySetter
                };
                this.label.xSetter = function (value, key) {
                    set[key].call(this.label, tooltip.distance);
                    container.style.left = value + 'px';
                };
                this.label.ySetter = function (value, key) {
                    set[key].call(this.label, tooltip.distance);
                    container.style.top = value + 'px';
                };
            }
            this.label
                .attr({
                zIndex: 8
            })
                .add();
        }
        return this.label;
    },
    /**
     * Updates the tooltip with the provided tooltip options.
     *
     * @function Highcharts.Tooltip#update
     *
     * @param {Highcharts.TooltipOptions} options
     *        The tooltip options to update.
     *
     * @return {void}
     */
    update: function (options) {
        this.destroy();
        // Update user options (#6218)
        merge(true, this.chart.options.tooltip.userOptions, options);
        this.init(this.chart, merge(true, this.options, options));
    },
    /**
     * Removes and destroys the tooltip and its elements.
     *
     * @function Highcharts.Tooltip#destroy
     * @return {void}
     */
    destroy: function () {
        // Destroy and clear local variables
        if (this.label) {
            this.label = this.label.destroy();
        }
        if (this.split && this.tt) {
            this.cleanSplit(this.chart, true);
            this.tt = this.tt.destroy();
        }
        if (this.renderer) {
            this.renderer = this.renderer.destroy();
            H.discardElement(this.container);
        }
        H.clearTimeout(this.hideTimer);
        H.clearTimeout(this.tooltipTimeout);
    },
    /**
     * Moves the tooltip with a soft animation to a new position.
     *
     * @private
     * @function Highcharts.Tooltip#move
     *
     * @param {number} x
     *
     * @param {number} y
     *
     * @param {number} anchorX
     *
     * @param {number} anchorY
     *
     * @return {void}
     */
    move: function (x, y, anchorX, anchorY) {
        var tooltip = this, now = tooltip.now, animate = tooltip.options.animation !== false &&
            !tooltip.isHidden &&
            // When we get close to the target position, abort animation and
            // land on the right place (#3056)
            (Math.abs(x - now.x) > 1 || Math.abs(y - now.y) > 1), skipAnchor = tooltip.followPointer || tooltip.len > 1;
        // Get intermediate values for animation
        extend(now, {
            x: animate ? (2 * now.x + x) / 3 : x,
            y: animate ? (now.y + y) / 2 : y,
            anchorX: skipAnchor ?
                undefined :
                animate ? (2 * now.anchorX + anchorX) / 3 : anchorX,
            anchorY: skipAnchor ?
                undefined :
                animate ? (now.anchorY + anchorY) / 2 : anchorY
        });
        // Move to the intermediate value
        tooltip.getLabel().attr(now);
        // Run on next tick of the mouse tracker
        if (animate) {
            // Never allow two timeouts
            H.clearTimeout(this.tooltipTimeout);
            // Set the fixed interval ticking for the smooth tooltip
            this.tooltipTimeout = setTimeout(function () {
                // The interval function may still be running during destroy,
                // so check that the chart is really there before calling.
                if (tooltip) {
                    tooltip.move(x, y, anchorX, anchorY);
                }
            }, 32);
        }
    },
    /**
     * Hides the tooltip with a fade out animation.
     *
     * @function Highcharts.Tooltip#hide
     *
     * @param {number} [delay]
     *        The fade out in milliseconds. If no value is provided the value
     *        of the tooltip.hideDelay option is used. A value of 0 disables
     *        the fade out animation.
     *
     * @return {void}
     */
    hide: function (delay) {
        var tooltip = this;
        // disallow duplicate timers (#1728, #1766)
        H.clearTimeout(this.hideTimer);
        delay = pick(delay, this.options.hideDelay, 500);
        if (!this.isHidden) {
            this.hideTimer = syncTimeout(function () {
                tooltip.getLabel()[delay ? 'fadeOut' : 'hide']();
                tooltip.isHidden = true;
            }, delay);
        }
    },
    /**
     * Extendable method to get the anchor position of the tooltip
     * from a point or set of points
     *
     * @private
     * @function Highcharts.Tooltip#getAnchor
     *
     * @param {Array<Highcharts.Point>} points
     *
     * @param {Highcharts.PointerEventObject} [mouseEvent]
     *
     * @return {Array<number,number,(number|undefined)>}
     */
    getAnchor: function (points, mouseEvent) {
        var ret, chart = this.chart, pointer = chart.pointer, inverted = chart.inverted, plotTop = chart.plotTop, plotLeft = chart.plotLeft, plotX = 0, plotY = 0, yAxis, xAxis;
        points = splat(points);
        // When tooltip follows mouse, relate the position to the mouse
        if (this.followPointer && mouseEvent) {
            if (mouseEvent.chartX === undefined) {
                mouseEvent = pointer.normalize(mouseEvent);
            }
            ret = [
                mouseEvent.chartX - chart.plotLeft,
                mouseEvent.chartY - plotTop
            ];
            // Pie uses a special tooltipPos
        }
        else if (points[0].tooltipPos) {
            ret = points[0].tooltipPos;
            // When shared, use the average position
        }
        else {
            points.forEach(function (point) {
                yAxis = point.series.yAxis;
                xAxis = point.series.xAxis;
                plotX += point.plotX +
                    (!inverted && xAxis ? xAxis.left - plotLeft : 0);
                plotY += (point.plotLow ?
                    (point.plotLow + point.plotHigh) / 2 :
                    point.plotY) + (!inverted && yAxis ? yAxis.top - plotTop : 0); // #1151
            });
            plotX /= points.length;
            plotY /= points.length;
            ret = [
                inverted ? chart.plotWidth - plotY : plotX,
                this.shared && !inverted && points.length > 1 && mouseEvent ?
                    // place shared tooltip next to the mouse (#424)
                    mouseEvent.chartY - plotTop :
                    inverted ? chart.plotHeight - plotX : plotY
            ];
        }
        return ret.map(Math.round);
    },
    /**
     * Place the tooltip in a chart without spilling over
     * and not covering the point it self.
     *
     * @private
     * @function Highcharts.Tooltip#getPosition
     *
     * @param {number} boxWidth
     *
     * @param {number} boxHeight
     *
     * @param {Highcharts.Point} point
     *
     * @return {Highcharts.Dictionary<number>}
     */
    getPosition: function (boxWidth, boxHeight, point) {
        var chart = this.chart, distance = this.distance, ret = {}, 
        // Don't use h if chart isn't inverted (#7242) ???
        h = (chart.inverted && point.h) || 0, // #4117 ???
        swapped, outside = this.outside, outerWidth = outside ?
            // substract distance to prevent scrollbars
            doc.documentElement.clientWidth - 2 * distance :
            chart.chartWidth, outerHeight = outside ?
            Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight, doc.body.offsetHeight, doc.documentElement.offsetHeight, doc.documentElement.clientHeight) :
            chart.chartHeight, chartPosition = chart.pointer.chartPosition, first = [
            'y',
            outerHeight,
            boxHeight,
            (outside ? chartPosition.top - distance : 0) +
                point.plotY + chart.plotTop,
            outside ? 0 : chart.plotTop,
            outside ? outerHeight : chart.plotTop + chart.plotHeight
        ], second = [
            'x',
            outerWidth,
            boxWidth,
            (outside ? chartPosition.left - distance : 0) +
                point.plotX + chart.plotLeft,
            outside ? 0 : chart.plotLeft,
            outside ? outerWidth : chart.plotLeft + chart.plotWidth
        ], 
        // The far side is right or bottom
        preferFarSide = !this.followPointer && pick(point.ttBelow, !chart.inverted === !!point.negative), // #4984
        /*
         * Handle the preferred dimension. When the preferred dimension is
         * tooltip on top or bottom of the point, it will look for space
         * there.
         *
         * @private
         */
        firstDimension = function (dim, outerSize, innerSize, point, min, max) {
            var roomLeft = innerSize < point - distance, roomRight = point + distance + innerSize < outerSize, alignedLeft = point - distance - innerSize, alignedRight = point + distance;
            if (preferFarSide && roomRight) {
                ret[dim] = alignedRight;
            }
            else if (!preferFarSide && roomLeft) {
                ret[dim] = alignedLeft;
            }
            else if (roomLeft) {
                ret[dim] = Math.min(max - innerSize, alignedLeft - h < 0 ? alignedLeft : alignedLeft - h);
            }
            else if (roomRight) {
                ret[dim] = Math.max(min, alignedRight + h + innerSize > outerSize ?
                    alignedRight :
                    alignedRight + h);
            }
            else {
                return false;
            }
        }, 
        /*
         * Handle the secondary dimension. If the preferred dimension is
         * tooltip on top or bottom of the point, the second dimension is to
         * align the tooltip above the point, trying to align center but
         * allowing left or right align within the chart box.
         *
         * @private
         */
        secondDimension = function (dim, outerSize, innerSize, point) {
            var retVal;
            // Too close to the edge, return false and swap dimensions
            if (point < distance || point > outerSize - distance) {
                retVal = false;
                // Align left/top
            }
            else if (point < innerSize / 2) {
                ret[dim] = 1;
                // Align right/bottom
            }
            else if (point > outerSize - innerSize / 2) {
                ret[dim] = outerSize - innerSize - 2;
                // Align center
            }
            else {
                ret[dim] = point - innerSize / 2;
            }
            return retVal;
        }, 
        /*
         * Swap the dimensions
         */
        swap = function (count) {
            var temp = first;
            first = second;
            second = temp;
            swapped = count;
        }, run = function () {
            if (firstDimension.apply(0, first) !== false) {
                if (secondDimension.apply(0, second) === false &&
                    !swapped) {
                    swap(true);
                    run();
                }
            }
            else if (!swapped) {
                swap(true);
                run();
            }
            else {
                ret.x = ret.y = 0;
            }
        };
        // Under these conditions, prefer the tooltip on the side of the point
        if (chart.inverted || this.len > 1) {
            swap();
        }
        run();
        return ret;
    },
    /**
     * In case no user defined formatter is given, this will be used. Note that
     * the context here is an object holding point, series, x, y etc.
     *
     * @function Highcharts.Tooltip#defaultFormatter
     *
     * @param {Highcharts.Tooltip} tooltip
     *
     * @return {Array<string>}
     */
    defaultFormatter: function (tooltip) {
        var items = this.points || splat(this), s;
        // Build the header
        s = [tooltip.tooltipFooterHeaderFormatter(items[0])];
        // build the values
        s = s.concat(tooltip.bodyFormatter(items));
        // footer
        s.push(tooltip.tooltipFooterHeaderFormatter(items[0], true));
        return s;
    },
    /**
     * Refresh the tooltip's text and position.
     *
     * @function Highcharts.Tooltip#refresh
     *
     * @param {Highcharts.Point|Array<Highcharts.Point>} pointOrPoints
     *        Either a point or an array of points.
     *
     * @param {Highcharts.PointerEventObject} [mouseEvent]
     *        Mouse event, that is responsible for the refresh and should be
     *        used for the tooltip update.
     *
     * @return {void}
     */
    refresh: function (pointOrPoints, mouseEvent) {
        var tooltip = this, chart = this.chart, label, options = tooltip.options, x, y, point = pointOrPoints, anchor, textConfig = {}, text, pointConfig = [], formatter = options.formatter || tooltip.defaultFormatter, shared = tooltip.shared, currentSeries, styledMode = chart.styledMode, activeSeries = [];
        if (!options.enabled) {
            return;
        }
        H.clearTimeout(this.hideTimer);
        // get the reference point coordinates (pie charts use tooltipPos)
        tooltip.followPointer = splat(point)[0].series.tooltipOptions
            .followPointer;
        anchor = tooltip.getAnchor(point, mouseEvent);
        x = anchor[0];
        y = anchor[1];
        // shared tooltip, array is sent over
        if (shared &&
            !(point.series &&
                point.series.noSharedTooltip)) {
            // Set inactive state for all points
            activeSeries = chart.pointer.getActiveSeries(point);
            chart.series.forEach(function (inactiveSeries) {
                if (inactiveSeries.options.inactiveOtherPoints ||
                    activeSeries.indexOf(inactiveSeries) === -1) {
                    inactiveSeries.setState('inactive', true);
                }
            });
            // Now set hover state for the choosen ones:
            point.forEach(function (item) {
                item.setState('hover');
                pointConfig.push(item.getLabelConfig());
            });
            textConfig = {
                x: point[0].category,
                y: point[0].y
            };
            textConfig.points = pointConfig;
            point = point[0];
            // single point tooltip
        }
        else {
            textConfig = point.getLabelConfig();
        }
        this.len = pointConfig.length; // #6128
        text = formatter.call(textConfig, tooltip);
        // register the current series
        currentSeries = point.series;
        this.distance = pick(currentSeries.tooltipOptions.distance, 16);
        // update the inner HTML
        if (text === false) {
            this.hide();
        }
        else {
            label = tooltip.getLabel();
            // show it
            if (tooltip.isHidden) {
                label.attr({
                    opacity: 1
                }).show();
            }
            // update text
            if (tooltip.split) {
                this.renderSplit(text, splat(pointOrPoints));
            }
            else {
                // Prevent the tooltip from flowing over the chart box (#6659)
                if (!options.style.width || styledMode) {
                    label.css({
                        width: this.chart.spacingBox.width
                    });
                }
                label.attr({
                    text: text && text.join ?
                        text.join('') :
                        text
                });
                // Set the stroke color of the box to reflect the point
                label.removeClass(/highcharts-color-[\d]+/g)
                    .addClass('highcharts-color-' +
                    pick(point.colorIndex, currentSeries.colorIndex));
                if (!styledMode) {
                    label.attr({
                        stroke: (options.borderColor ||
                            point.color ||
                            currentSeries.color ||
                            '${palette.neutralColor60}')
                    });
                }
                tooltip.updatePosition({
                    plotX: x,
                    plotY: y,
                    negative: point.negative,
                    ttBelow: point.ttBelow,
                    h: anchor[2] || 0
                });
            }
            this.isHidden = false;
        }
        H.fireEvent(this, 'refresh');
    },
    /**
     * Render the split tooltip. Loops over each point's text and adds
     * a label next to the point, then uses the distribute function to
     * find best non-overlapping positions.
     *
     * @private
     * @function Highcharts.Tooltip#renderSplit
     *
     * @param {string|Array<(boolean|string)>} labels
     *
     * @param {Array<Highcharts.Point>} points
     */
    renderSplit: function (labels, points) {
        var tooltip = this, boxes = [], chart = this.chart, ren = chart.renderer, rightAligned = true, options = this.options, headerHeight = 0, headerTop, tooltipLabel = this.getLabel(), distributionBoxTop = chart.plotTop;
        // Graceful degradation for legacy formatters
        if (H.isString(labels)) {
            labels = [false, labels];
        }
        // Create the individual labels for header and points, ignore footer
        labels.slice(0, points.length + 1).forEach(function (str, i) {
            if (str !== false && str !== '') {
                var point = points[i - 1] ||
                    {
                        // Item 0 is the header. Instead of this, we could also
                        // use the crosshair label
                        isHeader: true,
                        plotX: points[0].plotX,
                        plotY: chart.plotHeight
                    }, owner = point.series || tooltip, tt = owner.tt, series = point.series || {}, colorClass = 'highcharts-color-' + pick(point.colorIndex, series.colorIndex, 'none'), target, x, bBox, boxWidth, attribs;
                // Store the tooltip referance on the series
                if (!tt) {
                    attribs = {
                        padding: options.padding,
                        r: options.borderRadius
                    };
                    if (!chart.styledMode) {
                        attribs.fill = options.backgroundColor;
                        attribs['stroke-width'] = options.borderWidth;
                    }
                    owner.tt = tt = ren
                        .label(null, null, null, (point.isHeader ?
                        options.headerShape :
                        options.shape) || 'callout', null, null, options.useHTML)
                        .addClass('highcharts-tooltip-box ' + colorClass)
                        .attr(attribs)
                        .add(tooltipLabel);
                }
                tt.isActive = true;
                tt.attr({
                    text: str
                });
                if (!chart.styledMode) {
                    tt.css(options.style)
                        .shadow(options.shadow)
                        .attr({
                        stroke: (options.borderColor ||
                            point.color ||
                            series.color ||
                            '${palette.neutralColor80}')
                    });
                }
                // Get X position now, so we can move all to the other side in
                // case of overflow
                bBox = tt.getBBox();
                boxWidth = bBox.width + tt.strokeWidth();
                if (point.isHeader) {
                    headerHeight = bBox.height;
                    if (chart.xAxis[0].opposite) {
                        headerTop = true;
                        distributionBoxTop -= headerHeight;
                    }
                    x = Math.max(0, // No left overflow
                    Math.min(point.plotX +
                        chart.plotLeft -
                        boxWidth / 2, 
                    // No right overflow (#5794)
                    chart.chartWidth +
                        (
                        // Scrollable plot area
                        chart.scrollablePixelsX ?
                            chart.scrollablePixelsX -
                                chart.marginRight :
                            0) -
                        boxWidth));
                }
                else {
                    x = point.plotX + chart.plotLeft -
                        pick(options.distance, 16) - boxWidth;
                }
                // If overflow left, we don't use this x in the next loop
                if (x < 0) {
                    rightAligned = false;
                }
                // Prepare for distribution
                target = (point.series && point.series.yAxis &&
                    point.series.yAxis.pos) + (point.plotY || 0);
                target -= distributionBoxTop;
                if (point.isHeader) {
                    target = headerTop ?
                        -headerHeight :
                        chart.plotHeight + headerHeight;
                }
                boxes.push({
                    target: target,
                    rank: point.isHeader ? 1 : 0,
                    size: owner.tt.getBBox().height + 1,
                    point: point,
                    x: x,
                    tt: tt
                });
            }
        });
        // Clean previous run (for missing points)
        this.cleanSplit();
        if (options.positioner) {
            boxes.forEach(function (box) {
                var boxPosition = options.positioner.call(tooltip, box.tt.getBBox().width, box.size, box.point);
                box.x = boxPosition.x;
                box.align = 0; // 0-align to the top, 1-align to the bottom
                box.target = boxPosition.y;
                box.rank = pick(boxPosition.rank, box.rank);
            });
        }
        // Distribute and put in place
        H.distribute(boxes, chart.plotHeight + headerHeight);
        boxes.forEach(function (box) {
            var point = box.point, series = point.series;
            // Put the label in place
            box.tt.attr({
                visibility: box.pos === undefined ? 'hidden' : 'inherit',
                x: (rightAligned || point.isHeader || options.positioner ?
                    box.x :
                    point.plotX + chart.plotLeft + tooltip.distance),
                y: box.pos + distributionBoxTop,
                anchorX: point.isHeader ?
                    point.plotX + chart.plotLeft :
                    point.plotX + series.xAxis.pos,
                anchorY: point.isHeader ?
                    chart.plotTop + chart.plotHeight / 2 :
                    point.plotY + series.yAxis.pos
            });
        });
    },
    /**
     * Find the new position and perform the move
     *
     * @private
     * @function Highcharts.Tooltip#updatePosition
     *
     * @param {Highcharts.Point} point
     */
    updatePosition: function (point) {
        var chart = this.chart, label = this.getLabel(), pos = (this.options.positioner || this.getPosition).call(this, label.width, label.height, point), anchorX = point.plotX + chart.plotLeft, anchorY = point.plotY + chart.plotTop, pad;
        // Set the renderer size dynamically to prevent document size to change
        if (this.outside) {
            pad = (this.options.borderWidth || 0) + 2 * this.distance;
            this.renderer.setSize(label.width + pad, label.height + pad, false);
            anchorX += chart.pointer.chartPosition.left - pos.x;
            anchorY += chart.pointer.chartPosition.top - pos.y;
        }
        // do the move
        this.move(Math.round(pos.x), Math.round(pos.y || 0), // can be undefined (#3977)
        anchorX, anchorY);
    },
    /**
     * Get the optimal date format for a point, based on a range.
     *
     * @private
     * @function Highcharts.Tooltip#getDateFormat
     *
     * @param {number} range
     *        The time range
     *
     * @param {number} date
     *        The date of the point in question
     *
     * @param {number} startOfWeek
     *        An integer representing the first day of the week, where 0 is
     *        Sunday.
     *
     * @param {Highcharts.Dictionary<string>} dateTimeLabelFormats
     *        A map of time units to formats.
     *
     * @return {string}
     *         The optimal date format for a point.
     */
    getDateFormat: function (range, date, startOfWeek, dateTimeLabelFormats) {
        var time = this.chart.time, dateStr = time.dateFormat('%m-%d %H:%M:%S.%L', date), format, n, blank = '01-01 00:00:00.000', strpos = {
            millisecond: 15,
            second: 12,
            minute: 9,
            hour: 6,
            day: 3
        }, lastN = 'millisecond'; // for sub-millisecond data, #4223
        for (n in timeUnits) { // eslint-disable-line guard-for-in
            // If the range is exactly one week and we're looking at a
            // Sunday/Monday, go for the week format
            if (range === timeUnits.week &&
                +time.dateFormat('%w', date) === startOfWeek &&
                dateStr.substr(6) === blank.substr(6)) {
                n = 'week';
                break;
            }
            // The first format that is too great for the range
            if (timeUnits[n] > range) {
                n = lastN;
                break;
            }
            // If the point is placed every day at 23:59, we need to show
            // the minutes as well. #2637.
            if (strpos[n] &&
                dateStr.substr(strpos[n]) !== blank.substr(strpos[n])) {
                break;
            }
            // Weeks are outside the hierarchy, only apply them on
            // Mondays/Sundays like in the first condition
            if (n !== 'week') {
                lastN = n;
            }
        }
        if (n) {
            format = time.resolveDTLFormat(dateTimeLabelFormats[n]).main;
        }
        return format;
    },
    /**
     * Get the best X date format based on the closest point range on the axis.
     *
     * @private
     * @function Highcharts.Tooltip#getXDateFormat
     *
     * @param {Highcharts.Point} point
     *
     * @param {Highcharts.TooltipOptions} options
     *
     * @param {Highcharts.Axis} xAxis
     *
     * @return {string}
     */
    getXDateFormat: function (point, options, xAxis) {
        var xDateFormat, dateTimeLabelFormats = options.dateTimeLabelFormats, closestPointRange = xAxis && xAxis.closestPointRange;
        if (closestPointRange) {
            xDateFormat = this.getDateFormat(closestPointRange, point.x, xAxis.options.startOfWeek, dateTimeLabelFormats);
        }
        else {
            xDateFormat = dateTimeLabelFormats.day;
        }
        return xDateFormat || dateTimeLabelFormats.year; // #2546, 2581
    },
    /**
     * Format the footer/header of the tooltip
     * #3397: abstraction to enable formatting of footer and header
     *
     * @private
     * @function Highcharts.Tooltip#tooltipFooterHeaderFormatter
     * @param {Highcharts.PointLabelObject} labelConfig
     * @param {boolean} [isFooter]
     * @return {string}
     */
    tooltipFooterHeaderFormatter: function (labelConfig, isFooter) {
        var footOrHead = isFooter ? 'footer' : 'header', series = labelConfig.series, tooltipOptions = series.tooltipOptions, xDateFormat = tooltipOptions.xDateFormat, xAxis = series.xAxis, isDateTime = (xAxis &&
            xAxis.options.type === 'datetime' &&
            isNumber(labelConfig.key)), formatString = tooltipOptions[footOrHead + 'Format'], evt = {
            isFooter: isFooter,
            labelConfig: labelConfig
        };
        H.fireEvent(this, 'headerFormatter', evt, function (e) {
            // Guess the best date format based on the closest point distance
            // (#568, #3418)
            if (isDateTime && !xDateFormat) {
                xDateFormat = this.getXDateFormat(labelConfig, tooltipOptions, xAxis);
            }
            // Insert the footer date format if any
            if (isDateTime && xDateFormat) {
                ((labelConfig.point && labelConfig.point.tooltipDateKeys) ||
                    ['key']).forEach(function (key) {
                    formatString = formatString.replace('{point.' + key + '}', '{point.' + key + ':' + xDateFormat + '}');
                });
            }
            // Replace default header style with class name
            if (series.chart.styledMode) {
                formatString = this.styledModeFormat(formatString);
            }
            e.text = format(formatString, {
                point: labelConfig,
                series: series
            }, this.chart.time);
        });
        return evt.text;
    },
    /**
     * Build the body (lines) of the tooltip by iterating over the items and
     * returning one entry for each item, abstracting this functionality allows
     * to easily overwrite and extend it.
     *
     * @private
     * @function Highcharts.Tooltip#bodyFormatter
     * @param {Array<(Highcharts.Point|Highcharts.Series)>} items
     * @return {Array<string>}
     */
    bodyFormatter: function (items) {
        return items.map(function (item) {
            var tooltipOptions = item.series.tooltipOptions;
            return (tooltipOptions[(item.point.formatPrefix || 'point') + 'Formatter'] ||
                item.point.tooltipFormatter).call(item.point, tooltipOptions[(item.point.formatPrefix || 'point') + 'Format'] || '');
        });
    },
    styledModeFormat: function (formatString) {
        return formatString
            .replace('style="font-size: 10px"', 'class="highcharts-header"')
            .replace(/style="color:{(point|series)\.color}"/g, 'class="highcharts-color-{$1.colorIndex}"');
    }
};
