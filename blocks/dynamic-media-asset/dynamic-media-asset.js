import { moveInstrumentation } from '../../scripts/scripts.js';

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function addStyles() {
  const style = document.createElement('style');
  style.textContent = `
    #s7interactiveimage_div.s7interactiveimage {
      width: 100%;
      height: auto;
    }
  `;
  document.head.appendChild(style);
}

export default async function decorate(block) {
  moveInstrumentation(block, block);

  // Create container for the interactive image
  const container = document.createElement('div');
  container.id = 's7interactiveimage_div';
  container.className = 'shoppable_banner';
  block.appendChild(container);

  try {
    // Load the Scene7 viewer script
    await loadScript('https://s7g10.scene7.com/s7viewers/html5/js/InteractiveImage.js');

    // Add required styles
    addStyles();

    // Initialize the viewer
    // Note: In a real implementation, these parameters should come from the block's configuration
    const viewer = new window.s7viewers.InteractiveImage({
      containerId: 's7interactiveimage_div',
      params: {
        serverurl: 'https://s7g10.scene7.com/is/image/',
        contenturl: 'https://s7g10.scene7.com/is/content/',
        config: 'DynamicMediaNA/Shoppable_Banner',
        asset: 'comwrapemeaptrsd/3',
      },
    });

    // Initialize the viewer
    viewer.init();

    // Optional: Add event handler for quickview
    /* viewer.setHandlers({
      quickViewActivate: (inData) => {
        const sku = inData.sku;
        // Implement quickview functionality here
      }
    }); */
  } catch (error) {
    block.innerHTML = '<div class="error">Error loading interactive image viewer</div>';
  }
}
