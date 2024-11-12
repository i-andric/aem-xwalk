import {
  getCurrentCountryLanguage,
} from '../helpers.js';

export default async function decorate(block) {
  const [currentCountry, currentLanguage] = getCurrentCountryLanguage();
  const response = await fetch('/query-index.json');
  const articles = await response.json();

  const container = document.createElement('div');
  container.classList.add('article-container');
  const blogArticles = articles.data.filter((article) => article.path.includes(`/${currentCountry}-${currentLanguage}/blog/`));
  blogArticles.forEach((article) => {
    const articleLink = document.createElement('a');
    articleLink.href = article.path;
    const articleElement = document.createElement('article');
    articleElement.classList.add('article');
    articleLink.appendChild(articleElement);

    const title = document.createElement('h2');
    title.textContent = article.title;
    articleElement.appendChild(title);

    if (article.image) {
      const image = document.createElement('img');
      image.src = article.image;
      image.alt = article.title;
      articleElement.appendChild(image);
    }

    const description = document.createElement('p');
    description.textContent = article.description;
    articleElement.appendChild(description);

    container.appendChild(articleLink);
    block.replaceChildren(container);
  });
}
