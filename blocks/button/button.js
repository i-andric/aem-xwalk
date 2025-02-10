export default function decorate(block) {
  console.log('From button', block);
  const link = block.querySelector('a');
  if (!link) return;

  // Set default button class if none specified
  if (!link.classList.contains('primary')
    && !link.classList.contains('secondary')
    && !link.classList.contains('tertiary')) {
    link.classList.add('button');
  }

  // Add button-container class to parent
  const parent = link.closest('div');
  if (parent) {
    parent.classList.add('button-container');
  }
}
