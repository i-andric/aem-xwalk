/**
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  // Add the copyright-text class to the block
  block.classList.add('copyright-text');

  // Get all text content within the block
  const textElements = block.querySelectorAll('p, div, span');

  textElements.forEach((element) => {
    element.classList.add('copyright-text-content');
  });
} 