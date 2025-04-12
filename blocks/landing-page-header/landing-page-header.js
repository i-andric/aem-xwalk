import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  const wrapper = document.createElement('div');

  [...block.children].forEach((row) => {
    const innerDiv = document.createElement('div');
    moveInstrumentation(row, innerDiv);

    let cardLink = null;

    const firstLink = row.querySelector('a');
    if (firstLink) {
      cardLink = document.createElement('a');
      cardLink.href = firstLink.href;
    }

    while (row.firstElementChild) innerDiv.append(row.firstElementChild);

    [...innerDiv.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'hero-image';
      } else {
        div.className = 'hero-text';
      }
    });

    if (cardLink) {
      cardLink.append(innerDiv);
      wrapper.append(cardLink);
    } else {
      wrapper.append(innerDiv);
    }
  });

  wrapper.querySelectorAll('p').forEach((par) => {
    par.innerHTML = par.innerText;
  });

  wrapper.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(wrapper);
}
