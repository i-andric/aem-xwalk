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
  if (!userData?.memberOf) return;

  const userGroups = userData.memberOf;
  document.addEventListener('DOMContentLoaded', () => {
    const filterScript = document.querySelector('script[type="application/vnd.adobe.aue.filter+json"]');
    if (!filterScript) {
      console.error('Filter script not found');
      return;
    }
    // Determine the appropriate filter based on user groups
    let filterPath = '/content/aem-xwalk.resource/component-filters.json'; // Default path
    console.log('USER GROUPS', userGroups);
    if (userGroups.some((group) => group.authorizableId === 'contributor')) {
      filterPath = '/content/aem-xwalk.resource/component-limited-filters.json';
    }
    // Create a new script element with the updated source
    const newScript = document.createElement('script');
    newScript.type = 'application/vnd.adobe.aue.filter+json';
    newScript.src = filterPath;
    // Replace the old script with the new one
    filterScript.parentNode.replaceChild(newScript, filterScript);
  });
}

export { getCurrentUser, updateComponentFilters };
