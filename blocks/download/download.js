export default function decorate(block) {
  const rows = block.children || [];
  const downloadData = {
    title: rows[0]?.textContent,
    description: rows[1]?.innerHTML,
    buttonLabel: rows[2]?.textContent,
    downloadLink: rows[3]?.querySelector('a')?.href,
  };

  // Set block class
  block.className = 'download-wrapper';

  // Clear existing content
  block.innerHTML = '';

  // Create title
  if (downloadData.title) {
    const title = document.createElement('h2');
    title.className = 'download-title';
    title.textContent = downloadData.title;
    block.appendChild(title);
  }

  // Create description
  if (downloadData.description) {
    const description = document.createElement('div');
    description.className = 'download-description';
    description.innerHTML = downloadData.description;
    block.appendChild(description);
  }

  // Create download button
  if (downloadData.downloadLink && downloadData.buttonLabel) {
    const button = document.createElement('a');
    button.className = 'download-button';
    button.href = downloadData.downloadLink;
    button.setAttribute('download', '');
    button.setAttribute('role', 'button');
    button.setAttribute('aria-label', `Download ${downloadData.buttonLabel}`);
    const buttonText = document.createElement('span');
    buttonText.textContent = downloadData.buttonLabel;
    button.appendChild(buttonText);

    // Add download icon
    const icon = document.createElement('span');
    icon.className = 'download-icon';
    icon.setAttribute('aria-hidden', 'true');
    button.appendChild(icon);

    block.appendChild(button);
  }
}
