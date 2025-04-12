import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import { setId } from '../../scripts/helpers.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
//   const itemsWrapper = document.createElement('div');
//   itemsWrapper.classList.add('career-two-col-teaser-items');
  const children = [...block.children];
    console.log(children);
  const firstChild = children[0];
  console.log('firstChild', firstChild);
  if (firstChild) {
    setId(firstChild, block);
  }

  const remainingChildren = children.slice(1);
  const content = remainingChildren.slice(0, 3);
  console.log('content', content);
  const button = remainingChildren.slice(3, 9);
  console.log('button', button);
  const cardImage = remainingChildren.slice(9, 11);
  console.log('cardImage', cardImage);
  const backgroundImage = remainingChildren.slice(11, 12);
  console.log('backgroundImage', backgroundImage);
}
