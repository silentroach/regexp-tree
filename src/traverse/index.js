/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';
const astTraverse = require('ast-traverse');

module.exports = {
  /**
   * Traverses an AST.
   *
   * @param Object ast - an AST node
   * @param Array<Object>|Object handlers - an object (or an array of objects)
   *        containing handler function per node. In case of an array of
   *        handlers, they are applied in order. A handler may return a
   *        transformed node (or a different type).
   *
   * Multiple handlers are used as an optimization of applying all of them
   * in one AST traversal pass. Alternatively, one can choose to run several
   * traversal passes using one handler in each of them. This is usually done
   * in edge cases when one handler can inject a new node at the beginning of
   * an AST, and the new node won't be handled in current pass.
   */
  traverse(ast, handlers) {
    if (!Array.isArray(handlers)) {
      handlers = [handlers];
    }

    astTraverse(ast, {

      /**
       * Handler on node enter.
       */
      pre(node, parent, prop, index) {
        for (const handler of handlers) {
          const handlerName = `on${node.type}`;
          if (typeof handler[handlerName] === 'function') {
            handler[handlerName](node, parent, prop, index);
          }
        }
      },

      /**
       * Skip locations by default.
       */
      skipProperty(prop) {
        return prop === 'loc';
      },
    });
  },
};