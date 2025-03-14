import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const parentDiv = document.createElement('div');
  parentDiv.className = 'nav-items-inner';

  const firstGroup = document.createElement('div');
  firstGroup.className = 'nav-items-link';
  const secondGroup = document.createElement('div');
  secondGroup.className = 'nav-items-link-children';
  secondGroup.setAttribute('hidden', '');

  [...block.children].forEach((row, index) => {
    const div = document.createElement('div');
    moveInstrumentation(row, div);

    let navLink = null;
    const firstLink = row.querySelector('a');
    if (firstLink) {
      navLink = document.createElement('a');
      navLink.href = firstLink.href;
    }

    while (row.firstElementChild) div.append(row.firstElementChild);

    [...div.children].forEach((item) => {
      if (item.children.length === 1 && item.querySelector('picture')) {
        item.className = 'nav-item-image';
        const img = item.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          item.querySelector('picture').replaceWith(optimizedPic);
        }
      } else {
        item.className = 'nav-items-content';
      }
      if (item.querySelector('a')) {
        item.querySelector('a').remove();
      }
    });

    if (navLink) {
      navLink.append(div);
      if (index < 2) {
        firstGroup.append(navLink);
      } else {
        secondGroup.append(navLink);
      }
    } else if (index < 2) {
      firstGroup.append(div);
    } else {
      secondGroup.append(div);
    }
  });

  parentDiv.append(firstGroup, secondGroup);
  block.textContent = '';
  block.append(parentDiv);
}
