/**
 * Module for handling component locking and user-specific filtering
 */

/**
 * Fetches current user and their group memberships
 * @returns {Promise<Object>} User data including group memberships
 */
async function getCurrentUser() {
  try {
    const response = await fetch('/libs/granite/security/currentuser.json?props=memberOf');
    if (!response.ok) throw new Error('Failed to fetch user data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

/**
 * Removes authoring instrumentation from specified components
 * @param {HTMLElement} element - The component element to lock
 */
function lockComponent(element) {
  if (!element) return;

  // Remove all data-aue-* attributes
  const aueAttributes = Array.from(element.attributes)
    .filter((attr) => attr.name.startsWith('data-aue-'));

  aueAttributes.forEach((attr) => {
    element.removeAttribute(attr.name);
  });

  // Also remove from child elements
  element.querySelectorAll('[data-aue-resource]').forEach((child) => {
    lockComponent(child);
  });
}

/**
 * Updates component filters based on user group membership
 * @param {Object} userData - Current user data including group memberships
 */
async function updateComponentFilters(userData) {
  console.log('Updating component filters for user:', userData);
  if (!userData?.memberOf) return;

  const userGroups = userData.memberOf;
  let filterMetaTag = document.querySelector('meta[name="component-filters"]');

  // Create meta tag if it doesn't exist
  if (!filterMetaTag) {
    filterMetaTag = document.createElement('meta');
    filterMetaTag.setAttribute('name', 'component-filters');
    document.head.appendChild(filterMetaTag);
  }

  // Determine appropriate filter based on user groups
  // This can be customized based on your group-to-filter mapping
  let filterPath = 'component-filters.json'; // default path

  // Example: Apply specific filters based on group membership
  if (userGroups.includes('/content-authors')) {
    filterPath = 'content-authors-filters.json';
  } else if (userGroups.includes('/template-editors')) {
    filterPath = 'template-editors-filters.json';
  }

  filterMetaTag.setAttribute('content', filterPath);
}

export { getCurrentUser, lockComponent, updateComponentFilters };
