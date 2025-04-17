import {
  adjustButton,
  setId,
  setMarginBottom,
  setMarginTop,
  setBackgroundClassOnParent,
} from '../../scripts/helpers.js';
import { applyButtonPlaceholderRendering } from '../../scripts/utils/button.js';
import { getAemAuthorEnv } from '../../scripts/configs.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  const isEditor = getAemAuthorEnv();
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('landing-page-logo-overview-logo-items');
  const children = [...block.children];

  const firstChild = children[0];
  if (firstChild) {
    setId(firstChild, block);
  }

  const marginTop = children[1];
  const marginBottom = children[2];

  if (marginTop.textContent.trim() !== '') {
    setMarginTop(marginTop, marginTop);
  }

  if (marginBottom.textContent.trim() !== '') {
    setMarginBottom(marginBottom, marginBottom);
  }

  const remainingChildren = children.slice(3);
  const headline = remainingChildren[0];
  const button = remainingChildren.slice(1, 7);

  const headlineDiv = document.createElement('div');
  headlineDiv.classList.add('landing-page-logo-overview-headline');
  headlineDiv.appendChild(headline);

  const buttonWrapper = document.createElement('div');
  buttonWrapper.classList.add('landing-page-logo-overview-button');

  button.forEach((buttonChild) => {
    if (buttonChild.textContent.trim() !== '') {
      buttonWrapper.appendChild(buttonChild);
    }
  });
  if (buttonWrapper.innerHTML !== '') {
    adjustButton(buttonWrapper);
  }

  const logoItems = remainingChildren.slice(7);

  logoItems.forEach((logoItem) => {
    const link = document.createElement('a');
    link.classList.add('landing-page-logo__image--link');
    const picture = logoItem.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        img.setAttribute('loading', 'lazy');
        link.appendChild(img);
      }
    }

    const linkDescription = logoItem.children[1].querySelector('p').innerHTML;
    const linkUrl = logoItem.children[2];
    const linkHref = linkUrl.querySelector('a').getAttribute('href');
    const linkTitle = logoItem.children[3].querySelector('p').innerHTML;
    const label = document.createElement('label');
    label.classList.add('landing-page-logo-item__image--label');
    label.textContent = linkDescription;

    link.setAttribute('href', linkHref);
    link.setAttribute('title', linkTitle);
    link.appendChild(label);

    logoItem.innerHTML = '';
    logoItem.appendChild(link);
    logoItem.classList.add('landing-page-logo-item');
    logoWrapper.appendChild(logoItem);
  });

  block.innerHTML = '';
  block.appendChild(logoWrapper);
  setBackgroundClassOnParent(block);

  if (!isEditor) {
    applyButtonPlaceholderRendering(block);
  }
}
