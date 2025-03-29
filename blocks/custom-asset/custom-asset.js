export default function decorate(block) {
  const referenceLink = block.querySelector('a');
  let referencePath = referenceLink ? referenceLink.getAttribute('href') : '';
  const crop = block.querySelectorAll('p')[1].textContent;
  const altImage = referenceLink ? referenceLink.getAttribute('title') : '';
  const image = document.createElement('img');
  const titleImage = altImage ? altImage.replace(/\s+/g, '-') : 'image';
  if (crop) {
    referencePath = `${referencePath}/as/${titleImage}.jpg?smartcrop=${crop}`;
  }
  image.src = referencePath;
  block.appendChild(image);

  image.alt = altImage;
  image.className = 'dynamic-image';

  block.textContent = '';
  block.appendChild(image);
}
