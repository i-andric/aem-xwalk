import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  // Create container elements
  const imageContainer = document.createElement('div');
  imageContainer.className = 'teaser-image';
  const contentContainer = document.createElement('div');
  contentContainer.className = 'teaser-content';

  // Process each row
  [...block.children].forEach((row) => {
    const [key, value] = [...row.children].map((cell) => cell.textContent.trim());
    // Handle image
    if (key === 'Image') {
      const picture = value.querySelector('picture');
      if (picture) {
        const optimizedPicture = createOptimizedPicture(
          picture.querySelector('img').src,
          picture.querySelector('img').alt,
          false,
          [{ width: '750' }],
        );
        moveInstrumentation(picture, optimizedPicture);
        imageContainer.appendChild(optimizedPicture);
      }
    }
    // Handle pretitle
    if (key === 'Pretitle') {
      const pretitle = document.createElement('p');
      pretitle.className = 'pretitle';
      pretitle.textContent = value;
      contentContainer.appendChild(pretitle);
    }

    // Handle title
    if (key === 'Title') {
      const titleType = row.getAttribute('data-title-type') || 'h2';
      const title = document.createElement(titleType);
      title.textContent = value;
      contentContainer.appendChild(title);
    }

    // Handle description
    if (key === 'Description') {
      const description = document.createElement('div');
      description.className = 'description';
      description.innerHTML = value;
      contentContainer.appendChild(description);
    }

    // Handle CTA
    if (key === 'CTA') {
      const cta = document.createElement('a');
      cta.className = 'button primary';
      cta.href = value.href || '#';
      cta.textContent = value.textContent || 'Learn More';
      contentContainer.appendChild(cta);
    }
  });

  // Clear and append new structure
  block.textContent = '';
  block.appendChild(imageContainer);
  block.appendChild(contentContainer);
}
