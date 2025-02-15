/* eslint-disable no-console */

// Rich Text Editor Extensions
export default function extendRichTextEditor(container = document) {
  // Custom toolbar configuration
  const toolbarConfig = {
    buttons: [
      {
        name: 'bold',
        icon: 'B',
        command: 'bold',
      },
      {
        name: 'italic',
        icon: 'I',
        command: 'italic',
      },
      {
        name: 'underline',
        icon: 'U',
        command: 'underline',
      },
      {
        name: 'strikethrough',
        icon: 'S',
        command: 'strikethrough',
      },
      {
        name: 'link',
        icon: '🔗',
        command: 'createLink',
      },
    ],
  };

  // Create toolbar element
  function createToolbar() {
    const toolbar = document.createElement('div');
    toolbar.className = 'rte-toolbar';

    toolbarConfig.buttons.forEach((button) => {
      const btnElement = document.createElement('button');
      btnElement.className = 'rte-toolbar-button';
      btnElement.textContent = button.icon;
      btnElement.title = button.name;

      btnElement.addEventListener('click', () => {
        if (button.command === 'createLink') {
          // eslint-disable-next-line no-alert
          const url = prompt('Enter URL:');
          if (url) {
            document.execCommand(button.command, false, url);
          }
        } else {
          document.execCommand(button.command, false, null);
        }
      });

      toolbar.appendChild(btnElement);
    });

    return toolbar;
  }

  // Find all rich text elements and add toolbar
  const richTextElements = container.querySelectorAll('[data-aue-type="richtext"]');
  richTextElements.forEach((element) => {
    // Make element editable
    element.contentEditable = true;

    // Add toolbar
    const toolbar = createToolbar(element);
    element.parentNode.insertBefore(toolbar, element);

    // Add basic styling
    element.style.border = '1px solid #ccc';
    element.style.padding = '10px';
    element.style.margin = '5px 0';
  });

  // Add toolbar styles
  const style = document.createElement('style');
  style.textContent = `
    .rte-toolbar {
      display: flex;
      gap: 5px;
      padding: 5px;
      background: #f5f5f5;
      border: 1px solid #ccc;
      border-bottom: none;
    }
    
    .rte-toolbar-button {
      padding: 5px 10px;
      border: 1px solid #ccc;
      background: white;
      cursor: pointer;
    }
    
    .rte-toolbar-button:hover {
      background: #e5e5e5;
    }
  `;
  document.head.appendChild(style);
}

// Initialize extensions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  extendRichTextEditor();
});
