import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  [...block.children].forEach((row, index) => {
    if (index === 0) {
      row.classList.add('teaser-image');
      const picture = row.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, true, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          img.closest('picture').replaceWith(optimizedPic);
        }
      }
    } else if (index === 1) {
      row.classList.add('teaser-content');
      const elements = row.children[0];
      const pretitle = elements.children[0];
      const title = elements.children[1];
      const description = elements.children[2];
      if (pretitle) pretitle.classList.add('pretitle');
      if (title) title.classList.add('title');
      if (description) description.classList.add('description');
    }
  });
}
