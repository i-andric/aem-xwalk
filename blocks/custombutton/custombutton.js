export default function decorate(block) {
  // Get the first div which contains the button configuration
  console.log('block', block);
  const buttonContainer = block.firstElementChild;
  if (!buttonContainer) return;

  // Create button/link element
  const link = buttonContainer.querySelector('a');
  const button = link || document.createElement('a');

  // Get text content if not using existing link
  if (!link) {
    const textDiv = buttonContainer.querySelector('div');
    if (textDiv) {
      button.textContent = textDiv.textContent.trim();
      button.href = '#'; // Default href if none provided
    }
  }

  // Apply button classes from configuration
  const classes = block.classList;
  if (classes.contains('primary')) {
    button.classList.add('button-primary');
  } else if (classes.contains('secondary')) {
    button.classList.add('button-secondary');
  } else if (classes.contains('tertiary')) {
    button.classList.add('button-tertiary');
  } else {
    button.classList.add('button-default');
  }

  // Add base button class
  button.classList.add('button');

  // Handle title attribute
  const title = buttonContainer.querySelector('div:nth-child(2)');
  if (title) {
    button.title = title.textContent.trim();
  }

  // Clear the block and append the styled button
  block.textContent = '';
  block.append(button);
}
