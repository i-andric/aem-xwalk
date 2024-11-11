/** @param {HTMLElement} block */
export default async function decorate(block) {
  const [bg, fg] = block.children;
  bg.className = 'hero-image';
  fg.className = 'hero-text';

}
