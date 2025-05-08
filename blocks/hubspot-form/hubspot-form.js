import {
  setId, setMarginBottom, setMarginTop, setBackgroundClassOnParent,
} from '../../scripts/helpers.js';
import { applyButtonPlaceholderRendering } from '../../scripts/utils/button.js';
import { getAemAuthorEnv } from '../../scripts/configs.js';

let hubspotScriptPromise;
function ensureHubspotScriptLoaded() {
  if (!hubspotScriptPromise) {
    hubspotScriptPromise = new Promise((resolve, reject) => {
      if (window.hbspt && window.hbspt.forms && window.hbspt.forms.create) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://js.hsforms.net/forms/embed/v2.js';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        const waitForHubspot = () => {
          if (window.hbspt && window.hbspt.forms && window.hbspt.forms.create) {
            resolve();
          } else {
            setTimeout(waitForHubspot, 50);
          }
        };
        waitForHubspot();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  return hubspotScriptPromise;
}

/** @param {HTMLElement} block */
export default async function decorate(block) {
  const isEditor = getAemAuthorEnv();
  const id = block.children[0];
  const title = block.children[1];
  const region = block.children[2].textContent.trim();
  const portalId = block.children[3].textContent.trim();
  const formId = block.children[4].textContent.trim();
  const description = block.children[5];
  const marginBottom = block.children[6];
  const marginTop = block.children[7];

  if (id) {
    setId(id, block);
  }

  if (!region || !portalId || !formId) {
    console.error('Hubspot form is missing required data');
    return;
  }

  block.classList.add('hubspot-form-container');

  const formContainer = document.createElement('div');
  formContainer.className = 'hubspot-form-inner';
  const formContainerId = `hubspot-form-${Math.random().toString(36).substr(2, 9)}`;
  formContainer.id = formContainerId;
  block.appendChild(formContainer);

  if (marginBottom) setMarginBottom(marginBottom, marginBottom);
  if (marginTop) setMarginTop(marginTop, marginTop);
  setBackgroundClassOnParent(block);

  block.innerHTML = '';

  block.appendChild(formContainer);

  const descriptionContainer = document.createElement('div');
  descriptionContainer.className = 'hubspot-form-description';
  descriptionContainer.appendChild(description);
  if (description) block.appendChild(descriptionContainer);

  if (title) {
    const titleElem = document.createElement('div');
    titleElem.className = 'hubspot-form-title';
    titleElem.appendChild(title);
    block.prepend(titleElem);
  }

  setTimeout(async () => {
    try {
      await ensureHubspotScriptLoaded();
      window.hbspt.forms.create({
        region,
        portalId,
        formId,
        target: `#${formContainerId}`,
      });
    } catch (error) {
      console.error('Failed to load HubSpot form:', error);
    }
  }, 10);

  if (!isEditor) {
    applyButtonPlaceholderRendering(block);
  }
}
