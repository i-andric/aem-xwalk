/**
 * Add block margins
 * @param {HTMLElement} parentDiv parentDiv where the id is located
 * @param {HTMLElement} targetDiv target div on which will be set the id
 */
export const setId = (parentDiv, targetDiv) => {
  const id = parentDiv.textContent.trim();
  if (id) {
    targetDiv.setAttribute('id', id);
  }
  parentDiv.remove();
};

/**
 * Adjust button details
 * @param {HTMLElement} buttonContainer container with button details
 */
export const adjustButton = (buttonContainer) => {
  if (!buttonContainer) return;

  const divs = [...buttonContainer.children];
  if (divs.length < 6) return;

  const [labelDiv, hrefDiv, ariaLabelDiv, typeDiv, styleDiv, targetDiv] = divs;
  const label = labelDiv.querySelector('p')?.textContent.trim() || '';
  const href = hrefDiv.querySelector('p')?.textContent.trim() || '';
  const ariaLabel = ariaLabelDiv.querySelector('p')?.textContent.trim() || '';
  const type = typeDiv.querySelector('p')?.textContent.trim() || '';
  const style = styleDiv.querySelector('p')?.textContent.trim() || '';
  const target = targetDiv.querySelector('p')?.textContent.trim() || '';
  if (label !== '') {
    const button = document.createElement('a');
    button.href = href;
    button.textContent = label;
    button.setAttribute('aria-label', ariaLabel);
    button.setAttribute('target', target);
    button.classList.add('button');
    if (style) {
      button.classList.add(`button--${style}`);
    }

    if (type === 'icon') {
      button.classList.add('button--download');
    } else if (type === 'phone') {
      button.href = `tel:${href}`;
    } else if (type === 'email') {
      button.href = `mailto:${href}`;
    }

    // Add the button
    buttonContainer.appendChild(button);
    const childDivs = buttonContainer.querySelectorAll('div');
    childDivs.forEach((div) => div.remove());
  }
};

/**
 * Adjust button details
 * @param {block} block passing block to find the background class and set it on the parent
 */
export const setBackgroundClassOnParent = (block) => {
  const backgroundClass = Array.from(block.classList).find((className) => className.startsWith('bg-'));
  if (backgroundClass) {
    block.parentElement.classList.add(backgroundClass);
    block.classList.remove(backgroundClass);
  }
};
