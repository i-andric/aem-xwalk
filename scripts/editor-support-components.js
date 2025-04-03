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
 * Updates component filters based on user group membership
 * @param {Object} userData - Current user data including group memberships
 */
async function updateComponentFilters(userData) {
  console.log('Updating component filters for user:', userData);
  if (!userData?.memberOf) return;

  const userGroups = userData.memberOf;
  const filterScript = document.querySelector('script[type="application/vnd.adobe.aue.filter+json"]');

  // Determine appropriate filter based on user groups
  let filterPath = ''; // default path
  console.log('User groups:', userGroups);

  // Check if any group in the array has the name 'contributor'
  if (userGroups.some((group) => group.authorizableId === 'contributor')) {
    filterPath = '/content/aem-xwalk.resource/component-limited-filters.json';
  } else {
    filterPath = '/content/aem-xwalk.resource/component-filters.json';
  }

  filterScript.setAttribute('src', filterPath);
}

export { getCurrentUser, updateComponentFilters };
