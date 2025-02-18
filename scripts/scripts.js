import {
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  getMetadata,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
  addGTM,
} from './aem.js';

/**
 * Moves all the attributes from a given elmenet to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveAttributes(from, to, attributes) {
  if (!attributes) {
    // eslint-disable-next-line no-param-reassign
    attributes = [...from.attributes].map(({ nodeName }) => nodeName);
  }
  attributes.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value) {
      to.setAttribute(attr, value);
      from.removeAttribute(attr);
    }
  });
}

/**
 * Move instrumentation attributes from a given element to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveInstrumentation(from, to) {
  moveAttributes(
    from,
    to,
    [...from.attributes]
      .map(({ nodeName }) => nodeName)
      .filter((attr) => attr.startsWith('data-aue-') || attr.startsWith('data-richtext-')),
  );
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildTabs(main) {
  const tabSections = [];
  let currentTabGroup = [];

  main.querySelectorAll('[data-tabstitle]').forEach((element) => {
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
        const index = tabs.indexOf(e.target);

        let newIndex;
        switch (e.key) {
          case 'ArrowLeft':
            newIndex = index - 1;
            if (newIndex < 0) newIndex = tabs.length - 1;
            break;
          case 'ArrowRight':
            newIndex = index + 1;
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
    main.prepend(tabBlock);
  });
}

function buildAutoBlocks(main) {
  try {
    buildTabs(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  decorateSections(main);
  buildAutoBlocks(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  const lang = getMetadata('lang') || 'en';
  document.documentElement.lang = lang;
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  setTimeout(() => addGTM(), 0);

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
  import('./sidekick.js').then(({ initSidekick }) => initSidekick());
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
