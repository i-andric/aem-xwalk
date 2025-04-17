import { getAemAuthorEnv } from '../configs.js';

/**
* Parse tags containing JSON-like content between {{ }}
* @param {string} inputString - String containing tags with JSON content
* @returns {Array} Array of parsed JSON objects
*/
export function parseJsonTags(inputString) {
  const tags = [];
  const regex = /{{([^}]+)}}/g;
  let match;
  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(inputString)) !== null) {
    const content = match[1].trim();
    const jsonString = `{${content}}`;
    try {
      const jsonObj = JSON.parse(jsonString);
      tags.push(jsonObj);
    } catch (e) {
      console.error('Error parsing tag:', match[0], e);
    }
  }
  return tags;
}

/**
* Transform DOM element content by replacing JSON tags with buttons processed on import/manual add
*
* @param {HTMLElement} block - The DOM element to process
*/
export function applyButtonPlaceholderRendering(block) {
  const isAemAuthor = getAemAuthorEnv();
  // Don't render in AEM's UE. If rendered, the richtext will re-parse the button
  // on editor reopen and the syntax will be lost.
  if (isAemAuthor) return;

  function processTextNode(textNode) {
    const text = textNode.textContent;
    const regex = /{{([^}]+)}}/g;
    const matches = Array.from(text.matchAll(regex));

    if (matches.length > 0) {
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;

      // eslint-disable-next-line no-restricted-syntax
      for (const match of matches) {
        if (match.index > lastIndex) {
          fragment.appendChild(document.createTextNode(
            text.slice(lastIndex, match.index),
          ));
        }
        const content = match[1].trim();
        const jsonString = `{${content}}`;
        try {
          const props = JSON.parse(jsonString);
          const button = document.createElement('a');
          button.className = 'button';
          button.classList.add('button-placeholder-generated');
          if (props.link) button.href = props.link;
          if (props.target) button.setAttribute('target', props.target);
          if (props.linkStyle) {
            if (props.linkStyle.includes(' ')) {
              props.linkStyle.split(' ').forEach((style) => {
                button.classList.add(`button--${style}`);
              });
            } else {
              button.classList.add(`button--${props.linkStyle}`);
            }
          }
          if (props.linkTitle) button.title = props.linkTitle;
          if (props.linkType) {
            let { href } = button;
            switch (props.linkType) {
              case 'email':
                href = `mailto:${props.link}`;
                break;
              case 'phone':
                href = `tel:${props.link}`;
                break;
              case 'external':
                href = props.link.startsWith('http') ? props.link : `https://${props.link}`;
                break;
              case 'internal':
                break;
              case 'icon':
                button.classList.add('button--download');
                break;
              default:
                break;
            }
            button.href = href;
          }
          // Checking if the class is already there is not necessary, since classList
          // is a *set* ( DOMTokenList )
          if (button.href.endsWith('pdf')) {
            button.classList.add('button--download');
          }
          if (props['aria-label']) button.setAttribute('aria-label', props['aria-label']);
          if (props.linkLabel) button.textContent = props.linkLabel;
          else button.textContent = 'Button';
          fragment.appendChild(button);
        } catch (e) {
          console.error('Error parsing JSON:', match[0], e);
          fragment.appendChild(document.createTextNode(match[0]));
        }
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(
          text.slice(lastIndex),
        ));
      }
      textNode.parentNode.replaceChild(fragment, textNode);
    }
  }

  // Recursively process all text nodes in the element
  function traverseNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      processTextNode(node);
    } else {
      // Process child nodes
      Array.from(node.childNodes).forEach((child) => traverseNodes(child));
    }
  }

  // Start processing from the given block
  traverseNodes(block);
}
