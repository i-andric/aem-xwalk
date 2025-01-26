import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    let cardLink = null;

    const firstLink = row.querySelector('a');
    if (firstLink) {
      cardLink = document.createElement('a');
      cardLink.href = firstLink.href;
    }

    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'carousel-card-image';
      } else {
        div.className = 'carousel-card-body';
      }
      if (div.querySelector('a')) {
        div.remove();
      }
    });

    if (cardLink) {
      cardLink.append(li);
      ul.append(cardLink);
    } else {
      ul.append(li);
    }
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);
}
