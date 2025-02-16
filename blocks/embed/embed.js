import { createTag } from '../helpers.js';

function getYouTubeVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function getVimeoVideoId(url) {
  const regExp = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_-]+)?/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

function getVideoCdnParams(url) {
  const regExp = /video-cdn\.net\/watch\?video-id=([^&]+)&player-id=([^&]+)&channel-id=([^&]+)/;
  const match = url.match(regExp);
  return match ? {
    videoId: match[1],
    playerId: match[2],
    channelId: match[3],
  } : null;
}

function createYouTubeEmbed(videoId) {
  const wrapper = createTag('div', { class: 'embed-video-wrapper' });
  const iframe = createTag('iframe', {
    src: `https://www.youtube.com/embed/${videoId}`,
    title: 'YouTube video player',
    frameborder: '0',
    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
    allowfullscreen: true,
  });
  wrapper.appendChild(iframe);
  return wrapper;
}

function createVimeoEmbed(videoId) {
  const wrapper = createTag('div', { class: 'embed-video-wrapper' });
  const iframe = createTag('iframe', {
    src: `https://player.vimeo.com/video/${videoId}`,
    title: 'Vimeo video player',
    frameborder: '0',
    allow: 'autoplay; fullscreen; picture-in-picture',
    allowfullscreen: true,
  });
  wrapper.appendChild(iframe);
  return wrapper;
}

function createVideoCdnEmbed(params) {
  const wrapper = createTag('div', { class: 'embed-video-wrapper' });
  const iframe = createTag('iframe', {
    src: `https://player.video-cdn.net/embed/${params.videoId}?player_id=${params.playerId}&channel_id=${params.channelId}`,
    title: 'Video CDN player',
    frameborder: '0',
    allow: 'autoplay; fullscreen; picture-in-picture',
    allowfullscreen: true,
  });
  wrapper.appendChild(iframe);
  return wrapper;
}

function createGenericEmbed(embedCode) {
  const wrapper = createTag('div', { class: 'embed-generic-wrapper' });
  wrapper.innerHTML = embedCode;
  return wrapper;
}

export default function decorate(block) {
  const urlElement = block.querySelector('a').getAttribute('href');
  const embedElement = block.querySelector(':scope [name="text2"]');

  if (!urlElement && !embedElement) return;

  const url = urlElement;
  const embedCode = embedElement?.value;

  let embedContent;

  if (url) {
    const youtubeId = getYouTubeVideoId(url);
    const vimeoId = getVimeoVideoId(url);
    const videoCdnParams = getVideoCdnParams(url);

    if (youtubeId) {
      embedContent = createYouTubeEmbed(youtubeId);
    } else if (vimeoId) {
      embedContent = createVimeoEmbed(vimeoId);
    } else if (videoCdnParams) {
      embedContent = createVideoCdnEmbed(videoCdnParams);
    }
  } else if (embedCode) {
    embedContent = createGenericEmbed(embedCode);
  }

  if (embedContent) {
    block.textContent = '';
    block.appendChild(embedContent);
  }
}
