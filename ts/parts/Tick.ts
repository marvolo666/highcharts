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
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface TickParametersObject {
            category?: string;
            options?: Dictionary<any>;
            tickmarkOffset?: number;
        }
        interface TickPositionObject extends PositionObject {
            opacity?: number;
        }
        class Tick {
            public constructor(
                axis: Axis,
                pos: number,
                type?: string,
                noLabel?: boolean,
                parameters?: TickParametersObject
            );
            public axis: Axis;
            public formatCtx: AxisLabelsFormatterContextObject;
            public gridLine?: SVGElement;
            public isActive?: boolean;
            public isFirst?: boolean;
            public isLast?: boolean;
            public isNew: boolean;
            public isNewLabel: boolean;
            public label?: SVGElement;
            public mark?: SVGElement;
            public options: (Dictionary<any>|undefined);
            public parameters: TickParametersObject;
            public pos: number;
            public rotation?: number;
            public shortenLabel?: Function;
            public tickmarkOffset?: number;
            public type: string;
            public addLabel(): void;
            public destroy(): void;
            public getLabelPosition(
                x: number,
                y: number,
                label: SVGElement,
                horiz: boolean,
                labelOptions: PositionObject,
                tickmarkOffset: number,
                index: number,
                step: number
            ): PositionObject;
            public getLabelSize(): number;
            public getMarkPath(
                x: number,
                y: number,
                tickLength: number,
                tickWidth: number,
                horiz: boolean,
                renderer: Renderer
            ): SVGPathArray;
            public getPosition(
                horiz: boolean,
                tickPos: number,
                tickmarkOffset: number,
                old?: boolean
            ): PositionObject;
            public handleOverflow(xy: PositionObject): void;
            public render(index: number, old?: boolean, opacity?: number): void;
            public renderGridLine(
                old: boolean,
                opacity: number,
                reverseCrisp: number
            ): void;
            public renderLabel(
                xy: PositionObject,
                old: boolean,
                opacity: number,
                index: number
            ): void;
            public renderMark(
                xy: PositionObject,
                opacity: number,
                reverseCrisp: number
            ): void;
        }
    }
}

/**
 * Optional parameters for the tick.
 * @private
 * @interface Highcharts.TickParametersObject
 *//**
 * Set category for the tick.
 * @name Highcharts.TickParametersObject#category
 * @type {string|undefined}
 *//**
 * @name Highcharts.TickParametersObject#options
 * @type {Highcharts.Dictionary<any>|undefined}
 *//**
 * Set tickmarkOffset for the tick.
 * @name Highcharts.TickParametersObject#tickmarkOffset
 * @type {number|undefined}
 */


import './Utilities.js';

var correctFloat = H.correctFloat,
    defined = H.defined,
    destroyObjectProperties = H.destroyObjectProperties,
    fireEvent = H.fireEvent,
    isNumber = H.isNumber,
    merge = H.merge,
    pick = H.pick,
    deg2rad = H.deg2rad;

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * The Tick class.
 *
 * @private
 * @class
 * @name Highcharts.Tick
 *
 * @param {Highcharts.Axis} axis
 *
 * @param {number} pos
 *        The position of the tick on the axis.
 *
 * @param {string} [type]
 *        The type of tick.
 *
 * @param {boolean} [noLabel=false]
 *        Wether to disable the label or not. Defaults to false.
 *
 * @param {Highcharts.TickParametersObject} [parameters]
 *        Optional parameters for the tick.
 */
H.Tick = function (
    this: Highcharts.Tick,
    axis: Highcharts.Axis,
    pos: number,
    type?: string,
    noLabel?: boolean,
    parameters?: Highcharts.TickParametersObject
): any {
    this.axis = axis;
    this.pos = pos;
    this.type = type || '';
    this.isNew = true;
    this.isNewLabel = true;
    this.parameters = parameters || {};
    // Usually undefined, numeric for grid axes
    this.tickmarkOffset = this.parameters.tickmarkOffset;

    this.options = this.parameters.options;
    if (!type && !noLabel) {
        this.addLabel();
    }
} as any;

/** @lends Highcharts.Tick.prototype */
H.Tick.prototype = {

    /**
     * Write the tick label.
     *
     * @private
     * @function Highcharts.Tick#addLabel
     * @return {void}
     */
    addLabel: function (this: Highcharts.Tick): void {
        var tick = this,
            axis = tick.axis,
            options = axis.options,
            chart = axis.chart,
            categories = axis.categories,
            names = axis.names,
            pos = tick.pos,
            labelOptions = pick(
                tick.options && tick.options.labels,
                options.labels
            ),
            str,
            tickPositions = axis.tickPositions,
            isFirst = pos === tickPositions[0],
            isLast = pos === tickPositions[tickPositions.length - 1],
            value = this.parameters.category || (
                categories ?
                    pick((categories as any)[pos], names[pos], pos) :
                    pos
            ),
            label = tick.label,
            tickPositionInfo = tickPositions.info,
            dateTimeLabelFormat,
            dateTimeLabelFormats,
            i,
            list: Highcharts.Dictionary<any>;

        // Set the datetime label format. If a higher rank is set for this
        // position, use that. If not, use the general format.
        if (axis.isDatetimeAxis && tickPositionInfo) {
            dateTimeLabelFormats = chart.time.resolveDTLFormat(
                (options.dateTimeLabelFormats as any)[
                    (
                        !options.grid &&
                        tickPositionInfo.higherRanks[pos]
                    ) ||
                    tickPositionInfo.unitName
                ]
            );
            dateTimeLabelFormat = dateTimeLabelFormats.main;
        }

        // set properties for access in render method
        tick.isFirst = isFirst;
        tick.isLast = isLast;

        // Get the string
        tick.formatCtx = {
            axis: axis,
            chart: chart,
            isFirst: isFirst,
            isLast: isLast,
            dateTimeLabelFormat: dateTimeLabelFormat as any,
            tickPositionInfo: tickPositionInfo,
            value: axis.isLog ? correctFloat(axis.lin2log(value)) : value,
            pos: pos
        };
        str = (axis.labelFormatter as any).call(tick.formatCtx, this.formatCtx);

        // Set up conditional formatting based on the format list if existing.
        list = dateTimeLabelFormats && dateTimeLabelFormats.list as any;
        if (list) {
            tick.shortenLabel = function (): void {
                for (i = 0; i < list.length; i++) {
                    (label as any).attr({
                        text: axis.labelFormatter.call(H.extend(
                            tick.formatCtx,
                            { dateTimeLabelFormat: list[i] }
                        ))
                    });
                    if (
                        (label as any).getBBox().width <
                        axis.getSlotWidth(tick) - 2 *
                            pick(labelOptions.padding, 5)
                    ) {
                        return;
                    }
                }
                (label as any).attr({
                    text: ''
                });
            };
        }

        // first call
        if (!defined(label)) {

            tick.label = label =
                defined(str) && labelOptions.enabled ?
                    chart.renderer
                        .text(
                            str,
                            0,
                            0,
                            labelOptions.useHTML
                        )
                        .add(axis.labelGroup) :
                    null as any;

            // Un-rotated length
            if (label) {
                // Without position absolute, IE export sometimes is wrong
                if (!chart.styledMode) {
                    label.css(merge(labelOptions.style));
                }

                label.textPxLength = label.getBBox().width;
            }


            // Base value to detect change for new calls to getBBox
            tick.rotation = 0;

        // update
        } else if (label && label.textStr !== str) {
            // When resetting text, also reset the width if dynamically set
            // (#8809)
            if (
                label.textWidth &&
                !(labelOptions.style && labelOptions.style.width) &&
                !label.styles.width
            ) {
                label.css({ width: null as any });
            }

            label.attr({ text: str });

            label.textPxLength = label.getBBox().width;
        }
    },

    /**
     * Get the offset height or width of the label
     *
     * @private
     * @function Highcharts.Tick#getLabelSize
     * @return {number}
     */
    getLabelSize: function (this: Highcharts.Tick): number {
        return this.label ?
            this.label.getBBox()[this.axis.horiz ? 'height' : 'width'] :
            0;
    },

    /**
     * Handle the label overflow by adjusting the labels to the left and right
     * edge, or hide them if they collide into the neighbour label.
     *
     * @private
     * @function Highcharts.Tick#handleOverflow
     * @param {Highcharts.PositionObject} xy
     * @return {void}
     */
    handleOverflow: function (
        this: Highcharts.Tick,
        xy: Highcharts.PositionObject
    ): void {
        var tick = this,
            axis = this.axis,
            labelOptions = axis.options.labels,
            pxPos = xy.x,
            chartWidth = axis.chart.chartWidth,
            spacing = axis.chart.spacing,
            leftBound = pick(
                axis.labelLeft,
                Math.min(axis.pos as any, spacing[3])
            ),
            rightBound = pick(
                axis.labelRight,
                Math.max(
                    !axis.isRadial ? (axis.pos as any) + axis.len : 0,
                    (chartWidth as any) - spacing[1]
                )
            ),
            label = this.label,
            rotation = this.rotation,
            factor = ({
                left: 0,
                center: 0.5,
                right: 1
            } as Highcharts.Dictionary<number>)[
                axis.labelAlign || (label as any).attr('align')
            ],
            labelWidth = (label as any).getBBox().width,
            slotWidth = axis.getSlotWidth(tick),
            modifiedSlotWidth = slotWidth,
            xCorrection = factor,
            goRight = 1,
            leftPos,
            rightPos,
            textWidth,
            css = {} as Highcharts.CSSObject;

        // Check if the label overshoots the chart spacing box. If it does, move
        // it. If it now overshoots the slotWidth, add ellipsis.
        if (!rotation &&
            pick((labelOptions as any).overflow, 'justify') === 'justify'
        ) {
            leftPos = pxPos - factor * labelWidth;
            rightPos = pxPos + (1 - factor) * labelWidth;

            if (leftPos < leftBound) {
                modifiedSlotWidth =
                    xy.x + modifiedSlotWidth * (1 - factor) - leftBound;
            } else if (rightPos > rightBound) {
                modifiedSlotWidth =
                    rightBound - xy.x + modifiedSlotWidth * factor;
                goRight = -1;
            }

            modifiedSlotWidth = Math.min(slotWidth, modifiedSlotWidth); // #4177
            if (modifiedSlotWidth < slotWidth && axis.labelAlign === 'center') {
                xy.x += (
                    goRight *
                    (
                        slotWidth -
                        modifiedSlotWidth -
                        xCorrection * (
                            slotWidth - Math.min(labelWidth, modifiedSlotWidth)
                        )
                    )
                );
            }
            // If the label width exceeds the available space, set a text width
            // to be picked up below. Also, if a width has been set before, we
            // need to set a new one because the reported labelWidth will be
            // limited by the box (#3938).
            if (
                labelWidth > modifiedSlotWidth ||
                (axis.autoRotation && ((label as any).styles || {}).width)
            ) {
                textWidth = modifiedSlotWidth;
            }

        // Add ellipsis to prevent rotated labels to be clipped against the edge
        // of the chart
        } else if (
            (rotation as any) < 0 &&
            pxPos - factor * labelWidth < leftBound
        ) {
            textWidth = Math.round(
                pxPos / Math.cos((rotation as any) * deg2rad) - leftBound
            );
        } else if (
            (rotation as any) > 0 &&
            pxPos + factor * labelWidth > rightBound
        ) {
            textWidth = Math.round(
                ((chartWidth as any) - pxPos) /
                Math.cos((rotation as any) * deg2rad)
            );
        }

        if (textWidth) {
            if (tick.shortenLabel) {
                tick.shortenLabel();
            } else {
                css.width = Math.floor(textWidth);
                if (!((labelOptions as any).style || {}).textOverflow) {
                    css.textOverflow = 'ellipsis';
                }
                (label as any).css(css);

            }
        }
    },

    /**
     * Get the x and y position for ticks and labels
     *
     * @private
     * @function Highcharts.Tick#getPosition
     * @param {boolean} horiz
     * @param {number} tickPos
     * @param {number} tickmarkOffset
     * @param {boolean} [old]
     * @return {Highcharts.PositionObject}
     * @fires Highcharts.Tick#event:afterGetPosition
     */
    getPosition: function (
        this: Highcharts.Tick,
        horiz: boolean,
        tickPos: number,
        tickmarkOffset: number,
        old?: boolean
    ): Highcharts.PositionObject {
        var axis = this.axis,
            chart = axis.chart,
            cHeight = (old && chart.oldChartHeight) || chart.chartHeight,
            pos;

        pos = {
            x: horiz ?
                H.correctFloat(
                    (axis.translate(
                        tickPos + tickmarkOffset, null, null, old
                    ) as any) +
                    axis.transB
                ) :
                (
                    axis.left +
                    axis.offset +
                    (
                        axis.opposite ?
                            (
                                (
                                    (old && chart.oldChartWidth as any) ||
                                    (chart.chartWidth as any)
                                ) -
                                axis.right -
                                axis.left
                            ) :
                            0
                    )
                ),

            y: horiz ?
                (
                    (cHeight as any) -
                    axis.bottom +
                    axis.offset -
                    (axis.opposite ? axis.height : 0)
                ) :
                H.correctFloat(
                    (cHeight as any) -
                    (axis.translate(
                        tickPos + tickmarkOffset, null, null, old
                    ) as any) -
                    axis.transB
                )
        };

        // Chrome workaround for #10516
        pos.y = Math.max(Math.min(pos.y, 1e5), -1e5);

        fireEvent(this, 'afterGetPosition', { pos: pos });

        return pos;

    },

    /**
     * Get the x, y position of the tick label
     *
     * @private
     * @return {Highcharts.PositionObject}
     */
    getLabelPosition: function (
        this: Highcharts.Tick,
        x: number,
        y: number,
        label: Highcharts.SVGElement,
        horiz: boolean,
        labelOptions: Highcharts.PositionObject,
        tickmarkOffset: number,
        index: number,
        step: number
    ): Highcharts.PositionObject {

        var axis = this.axis,
            transA = axis.transA,
            reversed = axis.reversed,
            staggerLines = axis.staggerLines,
            rotCorr = axis.tickRotCorr || { x: 0, y: 0 },
            yOffset = labelOptions.y,

            // Adjust for label alignment if we use reserveSpace: true (#5286)
            labelOffsetCorrection = (
                !horiz && !axis.reserveSpaceDefault ?
                    -(axis.labelOffset as any) * (
                        axis.labelAlign === 'center' ? 0.5 : 1
                    ) :
                    0
            ),
            line: number,
            pos = {} as Highcharts.PositionObject;

        if (!defined(yOffset)) {
            if (axis.side === 0) {
                yOffset = label.rotation ? -8 : -label.getBBox().height;
            } else if (axis.side === 2) {
                yOffset = rotCorr.y + 8;
            } else {
                // #3140, #3140
                yOffset = Math.cos((label.rotation as any) * deg2rad) *
                    (rotCorr.y - label.getBBox(false, 0).height / 2);
            }
        }

        x = x +
            labelOptions.x +
            labelOffsetCorrection +
            rotCorr.x -
            (
                tickmarkOffset && horiz ?
                    tickmarkOffset * transA * (reversed ? -1 : 1) :
                    0
            );
        y = y + yOffset - (tickmarkOffset && !horiz ?
            tickmarkOffset * transA * (reversed ? 1 : -1) : 0);

        // Correct for staggered labels
        if (staggerLines) {
            line = (index / (step || 1) % staggerLines);
            if (axis.opposite) {
                line = staggerLines - line - 1;
            }
            y += line * ((axis.labelOffset as any) / staggerLines);
        }

        pos.x = x;
        pos.y = Math.round(y);

        fireEvent(
            this,
            'afterGetLabelPosition',
            { pos: pos, tickmarkOffset: tickmarkOffset, index: index }
        );

        return pos;
    },

    /**
     * Extendible method to return the path of the marker
     *
     * @private
     *
     */
    getMarkPath: function (
        this: Highcharts.Tick,
        x: number,
        y: number,
        tickLength: number,
        tickWidth: number,
        horiz: boolean,
        renderer: Highcharts.Renderer
    ): Highcharts.SVGPathArray {
        return renderer.crispLine([
            'M',
            x,
            y,
            'L',
            x + (horiz ? 0 : -tickLength),
            y + (horiz ? tickLength : 0)
        ], tickWidth);
    },

    /**
     * Renders the gridLine.
     *
     * @private
     * @param {boolean} old  Whether or not the tick is old
     * @param {number} opacity  The opacity of the grid line
     * @param {number} reverseCrisp  Modifier for avoiding overlapping 1 or -1
     * @return {void}
     */
    renderGridLine: function (
        this: Highcharts.Tick,
        old: boolean,
        opacity: number,
        reverseCrisp: number
    ): void {
        var tick = this,
            axis = tick.axis,
            options = axis.options,
            gridLine = tick.gridLine,
            gridLinePath,
            attribs = {} as Highcharts.SVGAttributes,
            pos = tick.pos,
            type = tick.type,
            tickmarkOffset = pick(tick.tickmarkOffset, axis.tickmarkOffset),
            renderer = axis.chart.renderer,
            gridPrefix = type ? type + 'Grid' : 'grid',
            gridLineWidth = (options as any)[gridPrefix + 'LineWidth'],
            gridLineColor = (options as any)[gridPrefix + 'LineColor'],
            dashStyle = (options as any)[gridPrefix + 'LineDashStyle'];

        if (!gridLine) {
            if (!axis.chart.styledMode) {
                attribs.stroke = gridLineColor;
                attribs['stroke-width'] = gridLineWidth;
                if (dashStyle) {
                    attribs.dashstyle = dashStyle;
                }
            }
            if (!type) {
                attribs.zIndex = 1;
            }
            if (old) {
                opacity = 0;
            }
            tick.gridLine = gridLine = renderer.path()
                .attr(attribs)
                .addClass(
                    'highcharts-' + (type ? type + '-' : '') + 'grid-line'
                )
                .add(axis.gridGroup);

        }

        if (gridLine) {
            gridLinePath = axis.getPlotLinePath(
                {
                    value: pos + tickmarkOffset,
                    lineWidth: gridLine.strokeWidth() * reverseCrisp,
                    force: 'pass',
                    old: old
                }
            );

            // If the parameter 'old' is set, the current call will be followed
            // by another call, therefore do not do any animations this time
            if (gridLinePath) {
                gridLine[old || tick.isNew ? 'attr' : 'animate']({
                    d: gridLinePath,
                    opacity: opacity
                });
            }
        }
    },

    /**
     * Renders the tick mark.
     *
     * @private
     * @param {Highcharts.PositionObject} xy  The position vector of the mark
     * @param {number} opacity  The opacity of the mark
     * @param {number} reverseCrisp  Modifier for avoiding overlapping 1 or -1
     * @return {void}
     */
    renderMark: function (
        this: Highcharts.Tick,
        xy: Highcharts.PositionObject,
        opacity: number,
        reverseCrisp: number
    ): void {
        var tick = this,
            axis = tick.axis,
            options = axis.options,
            renderer = axis.chart.renderer,
            type = tick.type,
            tickPrefix = type ? type + 'Tick' : 'tick',
            tickSize = axis.tickSize(tickPrefix),
            mark = tick.mark,
            isNewMark = !mark,
            x = xy.x,
            y = xy.y,
            tickWidth = pick(
                (options as any)[tickPrefix + 'Width'],
                !type && axis.isXAxis ? 1 : 0
            ), // X axis defaults to 1
            tickColor = (options as any)[tickPrefix + 'Color'];

        if (tickSize) {

            // negate the length
            if (axis.opposite) {
                tickSize[0] = -tickSize[0];
            }

            // First time, create it
            if (isNewMark) {
                tick.mark = mark = renderer.path()
                    .addClass('highcharts-' + (type ? type + '-' : '') + 'tick')
                    .add(axis.axisGroup);

                if (!axis.chart.styledMode) {
                    mark.attr({
                        stroke: tickColor,
                        'stroke-width': tickWidth
                    });
                }
            }
            (mark as any)[isNewMark ? 'attr' : 'animate']({
                d: tick.getMarkPath(
                    x,
                    y,
                    tickSize[0],
                    (mark as any).strokeWidth() * reverseCrisp,
                    axis.horiz as any,
                    renderer
                ),
                opacity: opacity
            });

        }
    },

    /**
     * Renders the tick label.
     * Note: The label should already be created in init(), so it should only
     * have to be moved into place.
     *
     * @private
     * @param {Highcharts.PositionObject} xy  The position vector of the label
     * @param {boolean} old  Whether or not the tick is old
     * @param {number} opacity  The opacity of the label
     * @param {number} index  The index of the tick
     * @return {void}
     */
    renderLabel: function (
        this: Highcharts.Tick,
        xy: Highcharts.TickPositionObject,
        old: boolean,
        opacity: number,
        index: number
    ): void {
        var tick = this,
            axis = tick.axis,
            horiz = axis.horiz,
            options = axis.options,
            label = tick.label,
            labelOptions = options.labels,
            step = (labelOptions as any).step,
            tickmarkOffset = pick(tick.tickmarkOffset, axis.tickmarkOffset),
            show = true,
            x = xy.x,
            y = xy.y;

        if (label && isNumber(x)) {
            label.xy = xy = tick.getLabelPosition(
                x,
                y,
                label,
                horiz as any,
                labelOptions as any,
                tickmarkOffset,
                index,
                step
            );

            // Apply show first and show last. If the tick is both first and
            // last, it is a single centered tick, in which case we show the
            // label anyway (#2100).
            if (
                (
                    tick.isFirst &&
                    !tick.isLast &&
                    !pick(options.showFirstLabel, 1 as any)
                ) ||
                (
                    tick.isLast &&
                    !tick.isFirst &&
                    !pick(options.showLastLabel, 1 as any)
                )
            ) {
                show = false;

            // Handle label overflow and show or hide accordingly
            } else if (
                horiz &&
                !(labelOptions as any).step &&
                !(labelOptions as any).rotation &&
                !old &&
                opacity !== 0
            ) {
                tick.handleOverflow(xy);
            }

            // apply step
            if (step && index % step) {
                // show those indices dividable by step
                show = false;
            }

            // Set the new position, and show or hide
            if (show && isNumber(xy.y)) {
                xy.opacity = opacity;
                label[tick.isNewLabel ? 'attr' : 'animate'](xy);
                tick.isNewLabel = false;
            } else {
                label.attr('y', -9999 as any); // #1338
                tick.isNewLabel = true;
            }
        }
    },

    /**
     * Put everything in place
     *
     * @private
     * @param {number} index
     * @param {boolean} [old]
     *        Use old coordinates to prepare an animation into new position
     * @param {number} [opacity]
     * @return {voids}
     */
    render: function (
        this: Highcharts.Tick,
        index: number,
        old?: boolean,
        opacity?: number
    ): void {
        var tick = this,
            axis = tick.axis,
            horiz = axis.horiz,
            pos = tick.pos,
            tickmarkOffset = pick(tick.tickmarkOffset, axis.tickmarkOffset),
            xy = tick.getPosition(horiz as any, pos, tickmarkOffset, old),
            x = xy.x,
            y = xy.y,
            reverseCrisp = ((horiz && x === (axis.pos as any) + axis.len) ||
                (!horiz && y === axis.pos)) ? -1 : 1; // #1480, #1687

        opacity = pick(opacity, 1);
        this.isActive = true;

        // Create the grid line
        this.renderGridLine(old as any, opacity as any, reverseCrisp);

        // create the tick mark
        this.renderMark(xy, opacity as any, reverseCrisp);

        // the label is created on init - now move it into place
        this.renderLabel(xy, old as any, opacity as any, index as any);

        tick.isNew = false;

        H.fireEvent(this, 'afterRender');
    },

    /**
     * Destructor for the tick prototype
     *
     * @private
     * @function Highcharts.Tick#destroy
     * @return {void}
     */
    destroy: function (this: Highcharts.Tick): void {
        destroyObjectProperties(this, this.axis);
    }
} as any;
