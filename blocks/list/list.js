import { createOptimizedPicture } from '../../scripts/aem.js';

function decoratePostCard(post) {
  const card = document.createElement('div');
  card.className = 'post-card';

  // Create image container
  if (post.image) {
    const imageContainer = document.createElement('div');
    imageContainer.className = 'post-card-image';
    const picture = createOptimizedPicture(post.image);
    imageContainer.appendChild(picture);
    card.appendChild(imageContainer);
  }

  // Create content container
  const content = document.createElement('div');
  content.className = 'post-card-content';

  // Add title
  if (post.title) {
    const title = document.createElement('h3');
    title.className = 'post-card-title';
    const titleLink = document.createElement('a');
    titleLink.href = post.href || '#';
    titleLink.textContent = post.title;
    title.appendChild(titleLink);
    content.appendChild(title);
  }

  // Add description
  if (post.description) {
    const description = document.createElement('p');
    description.className = 'post-card-description';
    description.textContent = post.description;
    content.appendChild(description);
  }

  // Add Read More button
  const readMoreButton = document.createElement('a');
  readMoreButton.href = post.href || '#';
  readMoreButton.className = 'button primary';
  readMoreButton.textContent = post.readMoreText || 'Read more';
  content.appendChild(readMoreButton);

  card.appendChild(content);
  return card;
}

async function fetchPosts(source) {
  try {
    const response = await fetch(source);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    return [];
  }
}

export default async function decorate(block) {
  const source = block.querySelector('a')?.getAttribute('href');
  if (!source) {
    return;
  }

  let limit = 4; // default limit
  const limitRow = [...block.children].find((row) => row.firstElementChild?.textContent?.trim().toLowerCase() === 'limit');
  if (limitRow) {
    const limitValue = limitRow.children[1]?.textContent?.trim();
    if (limitValue && !Number.isNaN(Number(limitValue))) {
      limit = parseInt(limitValue, 10);
    }
  }

  const keywordsRow = [...block.children].find((row) => row.firstElementChild?.textContent?.trim().toLowerCase() === 'keywords');
  const keywords = keywordsRow ? keywordsRow.children[1]?.textContent?.trim().split(',').map((k) => k.trim()) : [];

  // Add list container
  const listContainer = document.createElement('div');
  listContainer.className = 'post-list';
  block.textContent = '';
  block.appendChild(listContainer);

  // Fetch and process posts
  const posts = await fetchPosts(source);
  const filteredPosts = posts
    .filter((post) => !keywords.length
    || keywords.some((keyword) => post.keywords?.includes(keyword))).slice(0, limit);

  // Render posts
  filteredPosts.forEach((post) => {
    const card = decoratePostCard({
      href: post.path || post.href,
      title: post.title,
      description: post.description,
      image: post.image,
    });
    listContainer.appendChild(card);
  });
}
