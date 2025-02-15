import { getMetadata } from '../../scripts/aem.js';

function createSocialShareButton(platform, icon) {
  const button = document.createElement('button');
  button.className = `social-share-button ${platform}`;
  button.innerHTML = `<span class="icon">${icon}</span>`;
  button.setAttribute('aria-label', `Share on ${platform}`);
  return button;
}

function share(platform, url, title, description) {
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  if (platform === 'native' && navigator.share) {
    navigator.share({
      title,
      text: description,
      url,
    });
  } else {
    const shareUrl = shareUrls[platform];
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  }
}

export default function decorate(block) {
  const url = window.location.href;
  const title = getMetadata('og:title') || document.title;
  const description = getMetadata('og:description') || '';

  const socialIcons = {
    facebook: '<svg viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/></svg>',
    twitter: '<svg viewBox="0 0 24 24"><path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24"><path d="M6.5 21.5h-5v-13h5v13zM4 6.5C2.5 6.5 1.5 5.3 1.5 4s1-2.4 2.5-2.4c1.6 0 2.5 1 2.6 2.5 0 1.4-1 2.4-2.6 2.4zm11.5 6c-1 0-2 1-2 2v7h-5v-13h5V10s1.6-1.5 4-1.5c3 0 5 2.2 5 6.3v6.7h-5v-7c0-1-1-2-2-2z"/></svg>',
  };

  const socialUrls = {
    facebook: block.querySelector('[data-model-field="facebook"]')?.textContent?.trim(),
    twitter: block.querySelector('[data-model-field="twitter"]')?.textContent?.trim(),
    linkedin: block.querySelector('[data-model-field="linkedin"]')?.textContent?.trim(),
  };

  const container = document.createElement('div');
  container.className = 'social-share';

  Object.entries(socialIcons).forEach(([platform, icon]) => {
    const button = createSocialShareButton(platform, icon);
    if (socialUrls[platform]) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(socialUrls[platform], '_blank', 'noopener,noreferrer');
      });
    } else {
      button.addEventListener('click', () => share(platform, url, title, description));
    }
    container.appendChild(button);
  });

  if (navigator.share) {
    const nativeShareButton = createSocialShareButton('native', '<svg viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>');
    nativeShareButton.addEventListener('click', () => share('native', url, title, description));
    container.appendChild(nativeShareButton);
  }

  block.textContent = '';
  block.appendChild(container);
}
