export default function decorate(block) {
  const tabSections = [];
  let currentTabGroup = [];

  block.querySelectorAll('[data-tabstitle]').forEach((element) => {
    const prevElement = element.previousElementSibling;
    if (prevElement && !prevElement.hasAttribute('data-tabstitle')) {
      if (currentTabGroup.length > 0) {
        tabSections.push([...currentTabGroup]);
        currentTabGroup = [];
      }
    }
    currentTabGroup.push(element);
  });

  if (currentTabGroup.length > 0) {
    tabSections.push(currentTabGroup);
  }

  tabSections.forEach((sections, groupIndex) => {
    const tabBlock = document.createElement('div');
    tabBlock.classList.add('tabs');
    tabBlock.setAttribute('role', 'tablist');

    // Create tab navigation
    const tabNav = document.createElement('div');
    tabNav.classList.add('tabs-nav');

    const contentsWrapper = document.createElement('div');
    contentsWrapper.classList.add('contents-wrapper');

    sections.forEach((section, index) => {
      // Create tab button
      const tabButton = document.createElement('button');
      tabButton.classList.add('tab-button');
      tabButton.setAttribute('role', 'tab');
      tabButton.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      tabButton.setAttribute('aria-controls', `tab-content-${groupIndex}-${index}`);
      tabButton.id = `tab-${groupIndex}-${index}`;
      tabButton.textContent = section.dataset.tabstitle;
      tabNav.appendChild(tabButton);

      // Create content panel
      const content = document.createElement('div');
      content.classList.add('contents');
      content.setAttribute('role', 'tabpanel');
      content.setAttribute('aria-labelledby', `tab-${groupIndex}-${index}`);
      content.id = `tab-content-${groupIndex}-${index}`;
      content.dataset.tabstitle = section.dataset.tabstitle;
      content.innerHTML = section.innerHTML;
      content.hidden = index !== 0;
      contentsWrapper.append(content);
      section.remove();

      // Add click handler
      tabButton.addEventListener('click', () => {
        // Update tab buttons
        tabNav.querySelectorAll('[role="tab"]').forEach((tab) => {
          tab.setAttribute('aria-selected', 'false');
          tab.classList.remove('active');
        });
        tabButton.setAttribute('aria-selected', 'true');
        tabButton.classList.add('active');

        // Show selected content, hide others
        contentsWrapper.querySelectorAll('[role="tabpanel"]').forEach((panel) => {
          panel.hidden = panel.id !== `tab-content-${groupIndex}-${index}`;
        });
      });

      // Add keyboard navigation
      tabButton.addEventListener('keydown', (e) => {
        const tabs = [...tabNav.querySelectorAll('[role="tab"]')];
        const tabIndex = tabs.indexOf(e.target);

        let newIndex;
        switch (e.key) {
          case 'ArrowLeft':
            newIndex = tabIndex - 1;
            if (newIndex < 0) newIndex = tabs.length - 1;
            break;
          case 'ArrowRight':
            newIndex = tabIndex + 1;
            if (newIndex >= tabs.length) newIndex = 0;
            break;
          default:
            return;
        }

        tabs[newIndex].click();
        tabs[newIndex].focus();
      });
    });

    // Set first tab as active
    tabNav.querySelector('[role="tab"]').classList.add('active');

    tabBlock.append(tabNav);
    tabBlock.append(contentsWrapper);
    // block.innerHTML = '';
    block.prepend(tabBlock);
  });
}
