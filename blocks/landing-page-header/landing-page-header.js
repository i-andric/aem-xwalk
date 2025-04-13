import { createOptimizedPicture } from '../../scripts/aem.js';
import { adjustButton, setId } from '../../scripts/helpers.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  const children = [...block.children];
  const firstChild = children[0];
  if (firstChild) {
    setId(firstChild, block);
  }

  const remainingChildren = children.slice(1);
  const content = remainingChildren.slice(0, 4);
  const button = remainingChildren.slice(4, 10);
  const cardImage = remainingChildren.slice(10, 11);
  const backgroundImage = remainingChildren.slice(11, 12);

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('landing-page-header-content-wrapper');
  block.appendChild(contentWrapper);

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('landing-page-header-content');
  block.appendChild(contentDiv);

  contentWrapper.appendChild(contentDiv);
  content.forEach((contentChild) => {
    contentDiv.appendChild(contentChild);
  });

  const bulletClass = contentWrapper.children[0].children[3].innerText.trim();
  contentWrapper.children[0].children[2].classList.add(bulletClass);
  contentWrapper.children[0].children[3].remove();

  const buttonWrapper = document.createElement('div');
  buttonWrapper.classList.add('landing-page-header-button');
  block.appendChild(buttonWrapper);

  button.forEach((buttonChild) => {
    buttonWrapper.appendChild(buttonChild);
  });
  adjustButton(buttonWrapper);
  contentDiv.appendChild(buttonWrapper);

  const cardImageWrapper = document.createElement('div');
  cardImageWrapper.classList.add('landing-page-header-card-image-wrapper');
  block.appendChild(cardImageWrapper);

  const cardImageInnerWrapper = document.createElement('div');
  cardImageInnerWrapper.classList.add('landing-page-header-card-image');
  cardImageWrapper.appendChild(cardImageInnerWrapper);

  cardImage.forEach((cardImageChild) => {
    cardImageInnerWrapper.appendChild(cardImageChild);
  });

  const backgroundImageWrapper = document.createElement('div');
  backgroundImageWrapper.classList.add('landing-page-header-background-image');
  block.appendChild(backgroundImageWrapper);

  backgroundImage.forEach((backgroundImageChild) => {
    backgroundImageWrapper.appendChild(backgroundImageChild);
  });
}
