'use strict';

/**************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 **************************************************************************************************/


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {

    this.width = width;
    this.height = height;
}

Rectangle.prototype.getArea = function() { return this.width * this.height };


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
    return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
    if (!json && !proto) return null;

    const obj = JSON.parse(json);

    Object.setPrototypeOf(obj, proto)

    return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()  => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()  => 'a[href$=".png"]:focus'
 *
 *  builder.combine(    
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()        =>    'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

function MySuperBaseElementSelector() {
    this.line = '';
    this.prev = -1;
}

MySuperBaseElementSelector.prototype.setSelector = function(selector, prev, canDuplicate) {
    this.checkOnErrors(prev, canDuplicate);

    this.prev = prev;
    this.line += selector;
    return this;
}

MySuperBaseElementSelector.prototype.checkOnErrors = function(number, canDuplicate) {
    if (this.prev > number) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    if (this.prev === number && !canDuplicate) {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
}

MySuperBaseElementSelector.prototype.element = function(selector) {
    return this.setSelector(selector, 1);
}

MySuperBaseElementSelector.prototype.id = function(selector) {
    return this.setSelector(`#${selector}`, 2);
}

MySuperBaseElementSelector.prototype.class = function(selector) {
    return this.setSelector(`.${selector}`, 3, true);
}

MySuperBaseElementSelector.prototype.attr = function(selector) {
    return this.setSelector(`[${selector}]`, 4, true)
}

MySuperBaseElementSelector.prototype.pseudoClass = function(selector) {
    return this.setSelector(`:${selector}`, 5, true)
}

MySuperBaseElementSelector.prototype.pseudoElement = function(selector) {
    return this.setSelector(`::${selector}`, 6)
}

MySuperBaseElementSelector.prototype.combine = function(selector1, combinator, selector2) {
    return this.setSelector(`${selector1.line} ${combinator} ${selector2.line}`);
}

MySuperBaseElementSelector.prototype.stringify = function() {
    return this.line;
}



const cssSelectorBuilder = {

    element: function(value) {
        return new MySuperBaseElementSelector().element(value);
    },

    id: function(value) {
        return new MySuperBaseElementSelector().id(value);
    },

    class: function(value) {
        return new MySuperBaseElementSelector().class(value);
    },

    attr: function(value) {
        return new MySuperBaseElementSelector().attr(value);
    },

    pseudoClass: function(value) {
        return new MySuperBaseElementSelector().pseudoClass(value);
    },

    pseudoElement: function(value) {
        return new MySuperBaseElementSelector().pseudoElement(value);
    },

    combine: function(selector1, combinator, selector2) {
        return new MySuperBaseElementSelector().combine(selector1, combinator, selector2);

    },
};


module.exports = {
    Rectangle: Rectangle,
    getJSON: getJSON,
    fromJSON: fromJSON,
    cssSelectorBuilder: cssSelectorBuilder
};
