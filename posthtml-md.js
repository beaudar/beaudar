/*!
 * posthtml-md v1.1.0
 * CC0 1.0 Universal License (https://github.com/jonathantneal/posthtml-md/blob/master/LICENSE.md)
 */
// const marked = require('marked');
// const posthtml = require('posthtml');
import { marked } from 'marked';
import posthtml from 'posthtml';
const parser = posthtml();

const walk = (nodeList, isMarkdown, isInlineContainer, options) => {
  nodeList.forEach(function (node, index) {
    if (typeof node === 'string') {
      if (isMarkdown) {
        // preserve spacing
        let startSpace = '';
        let trailSpace = '';

        // conditionally trim inner space
        if (isInlineContainer) {
          node = node.replace(/(\S)\s+(\S)/g, '$1 $2');
        }

        // trim node and save trailing spaces
        node = node.replace(/^(\n*)|(\s*)$/g, function ($0, $1, $2) {
          startSpace = $1 || startSpace;
          trailSpace = $2 || trailSpace;

          return '';
        });

        // get the minimum number of indents in the string
        const indents = node.match(/^[ \t]+(?=\S)/gm);

        const indentsLength = indents ? Math.min.apply(Math, indents.map(function (indent) {
          return indent.length;
        })) : 0;

        // remove the minimum number of indents in the string
        node = node.replace(new RegExp('^[ \\t]{' + indentsLength + '}', 'gm'), '');

        // convert to markdown
        node = marked.parse(node, options).trim();

        // conditionally strip paragraph
        if (isInlineContainer) {
          node = node.replace(/^<p>([\W\w]*)<\/p>$/, '$1');
        }

        // restore the minimum number of indents in the string
        node = startSpace + node.replace(/^/gm, Array(indentsLength + 1).join('\t')) + trailSpace;

        nodeList[index] = node;
      }
    } else {
      // detect markdown element
      if (/^(markdown|md)$/i.test(node.tag)) {
        isMarkdown = true;
      }

      // detect markdown attribute
      if (node.attrs && 'md' in node.attrs) {
        delete node.attrs.md;

        isMarkdown = true;
      }

      // detect strict blocking
      if (node.tag && /^(abbr|acronym|b|bdo|big|button|cite|dfn|em|h1|h2|h3|h4|h5|h6|i|input|kbd|p|q|samp|select|small|span|strong|sub|sup|textarea|time|const)$/i.test(node.tag)) {
        isInlineContainer = true;
      }

      // conditionally parse content
      if (node.content) {
        walk(node.content, isMarkdown, isInlineContainer, options);
      }

      // replace markdown element with contents
      if (/^(markdown|md)$/i.test(node.tag)) {
        nodeList.splice.apply(nodeList, [index, 1].concat(node.content));
      }

      // reset markdown and strict blocking detection
      isMarkdown = false;
      isInlineContainer = false;
    }
  });
}

module.exports = function (options = null) {
  return function Markdown(tree) {
    walk(tree, null, null, options);
  };
};

module.exports.process = function (contents, options) {
  return parser.use(module.exports(options)).process(contents);
};
