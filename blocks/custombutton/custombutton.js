import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Get the first div which contains the button configuration
  console.log('block', block);

  const wrapper = document.createElement('div');

  [...block.children].forEach((row) => {
    const innerDiv = document.createElement('div');
    moveInstrumentation(row, innerDiv);

    let button = null;

    const link = row.querySelector('a');
    if (link) {
      button = document.createElement('a');
      button.href = link.href;
    }

    while (row.firstElementChild) innerDiv.append(row.firstElementChild);

    if (button) {
      button.append(innerDiv);
      wrapper.append(button);
    } else {
      wrapper.append(innerDiv);
    }
  });

  wrapper.querySelectorAll('p').forEach((par) => {
    par.innerHTML = par.innerText;
  });

  // Clear the block and append the styled button
  block.textContent = '';
}
