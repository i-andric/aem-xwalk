import { decorateIcons, getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import decorateSearch from '../search/search.js';

/**
 * Creates the navigation structure with proper semantic HTML and accessibility
 * @param {Element} fragment The loaded fragment containing nav items
 * @returns {HTMLElement} The structured navigation element
 */
function createNavStructure(fragment) {
  const nav = document.createElement('nav');
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'Main Navigation');
  nav.setAttribute('aria-expanded', 'false');

  // Add hamburger menu
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Toggle navigation">
    <span class="nav-hamburger-icon"></span>
  </button>`;
  hamburger.querySelector('button').addEventListener('click', () => {
    const isExpanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', !isExpanded);
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  });
  nav.appendChild(hamburger);

  // Add logo container
  const logoContainer = document.createElement('div');
  logoContainer.className = 'nav-logo';
  const firstImage = fragment.querySelector('img');
  if (firstImage) {
    const logo = firstImage.cloneNode(true);
    logo.setAttribute('alt', 'Site Logo');
    const logoLink = document.createElement('a');
    logoLink.href = '/';
    logoLink.appendChild(logo);
    logoContainer.appendChild(logoLink);
  }
  nav.appendChild(logoContainer);

  // Process each top-level navigation item
  const topLevelItems = fragment.querySelectorAll('.default-content-wrapper');
  topLevelItems.forEach((item, index) => {
    const navItem = document.createElement('div');
    navItem.className = 'nav-item';

    const anchor = item.querySelector('a');
    let trigger;

    if (anchor) {
      // Create a link that looks like a button
      trigger = document.createElement('a');
      trigger.href = anchor.href;
      trigger.className = 'nav-trigger';
      trigger.textContent = anchor.textContent.trim() || item.textContent.trim();
    } else {
      // Create a button as before
      trigger = document.createElement('button');
      trigger.className = 'nav-trigger';
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-controls', `nav-content-${index}`);
      trigger.textContent = item.textContent.trim();
    }

    // Find all nav-items-wrapper elements that follow this item until the next top-level item
    const navItems = [];
    let nextElement = item.nextElementSibling;
    while (nextElement && !nextElement.classList.contains('default-content-wrapper')) {
      if (nextElement.classList.contains('nav-items-wrapper')) {
        navItems.push(nextElement);
      }
      nextElement = nextElement.nextElementSibling;
    }

    if (navItems.length > 0) {
      const dropdown = document.createElement('div');
      dropdown.className = 'nav-dropdown';
      dropdown.id = `nav-content-${index}`;
      dropdown.setAttribute('hidden', '');
      // Create container for primary nav items
      const primaryNavContainer = document.createElement('div');
      primaryNavContainer.className = 'nav-items-primary';
      // Create container for children items
      const childrenContainer = document.createElement('div');
      childrenContainer.className = 'nav-items-children';
      // Process each nav item and organize them
      navItems.forEach((navigationItem) => {
        const content = document.createElement('div');
        content.innerHTML = navigationItem.innerHTML;
        // Extract and organize subitem links and their children
        const subitemLinks = content.querySelectorAll('.nav-items-link');
        subitemLinks.forEach((subitemLink) => {
          const children = subitemLink.nextElementSibling;
          if (children && children.classList.contains('nav-items-link-children')) {
            // Move the subitem link to primary container
            primaryNavContainer.appendChild(subitemLink.cloneNode(true));
            // Move the children to children container
            childrenContainer.appendChild(children.cloneNode(true));
          } else {
            // If no children, just add to primary container
            primaryNavContainer.appendChild(subitemLink.cloneNode(true));
          }
        });
      });
      // Add close button
      const closeButton = document.createElement('button');
      closeButton.className = 'nav-dropdown-close';
      closeButton.setAttribute('aria-label', 'Close menu');
      closeButton.innerHTML = '<span class="icon">×</span>';
      closeButton.addEventListener('click', () => {
        trigger.setAttribute('aria-expanded', 'false');
        dropdown.setAttribute('hidden', '');
      });
      // Append containers to dropdown
      dropdown.appendChild(primaryNavContainer);
      dropdown.appendChild(childrenContainer);
      dropdown.appendChild(closeButton);

      // Handle nested subitem links
      const subitemLinks = dropdown.querySelectorAll('.nav-items-link');
      subitemLinks.forEach((subitemLink) => {
        subitemLink.addEventListener('click', (e) => {
          e.preventDefault();
          // Find the corresponding child element in the children container
          const navItemsChildrenContainer = dropdown.querySelector('.nav-items-children');
          const subitemIndex = Array.from(primaryNavContainer.children).indexOf(subitemLink);
          const targetChild = navItemsChildrenContainer.children[subitemIndex];
          if (targetChild) {
            // Hide all children first
            childrenContainer.querySelectorAll('.nav-items-link-children').forEach((child) => {
              child.setAttribute('hidden', '');
            });
            // Show the target child
            targetChild.removeAttribute('hidden');
          }
        });
        const children = subitemLink.nextElementSibling;
        if (children && children.classList.contains('nav-items-link-children')) {
          children.setAttribute('hidden', '');
          subitemLink.setAttribute('aria-expanded', 'false');
          subitemLink.setAttribute('aria-controls', children.id || `subitem-${Math.random().toString(36).substr(2, 9)}`);
          subitemLink.addEventListener('click', (e) => {
            e.preventDefault();
            const isExpanded = subitemLink.getAttribute('aria-expanded') === 'true';
            // Close other open subitem-link-children
            dropdown.querySelectorAll('.nav-items-link').forEach((otherLink) => {
              if (otherLink !== subitemLink) {
                otherLink.setAttribute('aria-expanded', 'false');
                const otherChildren = otherLink.nextElementSibling;
                if (otherChildren) otherChildren.setAttribute('hidden', '');
              }
            });
            // Toggle current subitem
            subitemLink.setAttribute('aria-expanded', !isExpanded);
            if (isExpanded) {
              children.setAttribute('hidden', '');
            } else {
              children.removeAttribute('hidden');
            }
          });
        }
      });

      // Check if dropdown content is empty
      const hasOnlyEmptyDivs = Array.from(dropdown.querySelectorAll('div')).every((div) => !div.textContent.trim());
      if (hasOnlyEmptyDivs) {
        navItem.classList.add('nav-item-empty');
      }

      if (!anchor) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
          // Close all other dropdowns
          nav.querySelectorAll('.nav-trigger').forEach((t) => {
            if (t !== trigger && t.tagName === 'BUTTON') {
              t.setAttribute('aria-expanded', 'false');
              const panel = document.getElementById(t.getAttribute('aria-controls'));
              if (panel) panel.setAttribute('hidden', '');
            }
          });
          // Toggle current dropdown
          trigger.setAttribute('aria-expanded', !isExpanded);
          if (isExpanded) {
            dropdown.setAttribute('hidden', '');
          } else {
            dropdown.removeAttribute('hidden');
            // Focus the first interactive element in the dropdown
            const firstFocusable = dropdown.querySelector('a, button');
            if (firstFocusable) firstFocusable.focus();
          }
        });
      }

      navItem.appendChild(trigger);
      navItem.appendChild(dropdown);
      nav.appendChild(navItem);
    }
  });

  // Create nav-items container and move all nav-items into it
  const navItemsContainer = document.createElement('div');
  navItemsContainer.className = 'nav-items';
  const navItems = nav.querySelectorAll('.nav-item');
  navItems.forEach((item) => {
    navItemsContainer.appendChild(item);
  });
  nav.appendChild(navItemsContainer);

  // Add search block
  const searchContainer = document.createElement('div');
  searchContainer.className = 'nav-search';
  const searchBlock = document.createElement('div');
  searchBlock.className = 'search';
  searchContainer.appendChild(searchBlock);
  nav.appendChild(searchContainer);

  // Initialize search block
  decorateSearch(searchBlock);

  return nav;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (fragment) {
    const nav = createNavStructure(fragment);
    block.textContent = '';
    block.appendChild(nav);
  }
  decorateIcons(block);
}
