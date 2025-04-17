/**
 * Retrieves the content of a spreadsheet based on the provided identifier.
 *
 * This function fetches the paths.json file containing mappings, finds the mapping
 * corresponding to the given identifier, and then fetches the data from the
 * path specified in the mapping.
 *
 * @param {string} identifier - The identifier used to find the corresponding mapping.
 * @returns {Promise<Object>} - A promise that resolves to the content of the spreadsheet.
 * @throws {Error} - if fetching fails, mappings empty or missing, mapping identified not found.
 */
async function retrieveSpreadsheetContent(identifier) {
  try {
    const spreadsheetRequest = await fetch(`${identifier}.json`);
    if (!spreadsheetRequest.ok) {
      throw new Error(`Failed to fetch data from path: ${identifier}.json`);
    }

    const pathData = await spreadsheetRequest.json();
    return pathData;
  } catch (error) {
    throw new Error('Error retrieving spreadsheet content:', error);
  }
}

/**
 * Maps values from a spreadsheet into the DOM based on the specified component type and name.
 *
 * @param {string} componentType - The type of the component (e.g., 'richtext').
 * @param {string} componentName - The name of the component to map values into.
 * @param {Object} valuesToBeMapped - The values that need to be mapped into the component.
 * @param {string} pathSpreadsheet - The file path to the spreadsheet containing the values.
 * @returns {Promise<void>} A promise that resolves when the values have been mapped.
 */
async function mapValuesIntoDOM(componentType, componentName, valuesToBeMapped, pathSpreadsheet) {
  const spreadsheet = await retrieveSpreadsheetContent(pathSpreadsheet);

  const valuesFromSpreadsheet = spreadsheet.data;

  switch (componentType) {
    case 'richtext':
      mapRichtextValues(componentName, valuesFromSpreadsheet, valuesToBeMapped);
      break;

    default:
      break;
  }
}

/**
 * Filters values from a spreadsheet based on a list of keys to be mapped.
 *
 * @param {Array<Object>} valuesFromSpreadsheet - List of <Key,Value> from the spreadsheet.
 * @param {Array<string>} valuesToBeMapped - List of keys to be mapped inserted in Univ.Editor.
 * @returns {Array<Object>} The filtered array that match the keys to be mapped.
 */
function filterValuesFromSpreadsheet(valuesFromSpreadsheet, valuesToBeMapped) {
  return valuesFromSpreadsheet.filter((item) => valuesToBeMapped.includes(item.Key));
}

/**
 * Maps richtext values from a spreadsheet into the DOM.
 *
 * @param {string} componentName - The name of the component where the values will be mapped.
 * @param {Array<Object>} valuesFromSpreadsheet - List of <Key,Value> from the spreadsheet.
 * @param {Array<string>} valuesToBeMapped - List of keys to be mapped inserted in Univ.Editor.
 */

function mapRichtextValues(componentName, valuesFromSpreadsheet, valuesToBeMapped) {
  const cardDescritpion = document.querySelector(`.${componentName} p`).parentElement;
  const cardDescritpionValue = cardDescritpion.innerHTML;
  const filteredValuesFromSpreadsheet = filterValuesFromSpreadsheet(
    valuesFromSpreadsheet,
    valuesToBeMapped,
  );
  cardDescritpion.innerHTML = replaceKeysWithValues(
    cardDescritpionValue,
    filteredValuesFromSpreadsheet,
  );
}

/**
 * Replaces placeholders in the input string with corresponding values of spreadsheet dictionary.
 *
 * @param {string} inputString - The string containing placeholders in the format ${key}.
 * @param {Array<{Key: string, Value: string}>} spreadsheetDict - List of key-value pairs.
 * @returns {string} - The input string with placeholders replaced by their corresponding values.
 */
function replaceKeysWithValues(inputString, spreadsheetDict) {
  return inputString.replace(/\${(.*?)}/g, (match, key) => {
    const foundItem = spreadsheetDict.find((item) => item.Key === key);
    return foundItem ? foundItem.Value : match;
  });
}

export { retrieveSpreadsheetContent, mapValuesIntoDOM };
