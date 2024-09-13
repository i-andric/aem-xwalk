// import { createOptimizedPicture } from "../../scripts/aem.js";
// import { moveInstrumentation } from "../../scripts/scripts.js";

export default async function decorate(block) {
  try {
    const response = await fetch('/query-index.json');
    const articles = await response.json();

    const container = document.createElement('div');
    container.classList.add('articles-container');

    const blogArticles = articles.data.filter((article) => article.path.includes('/blog/'));
    blogArticles.forEach((article) => {
      const articleElement = document.createElement('article');
      articleElement.classList.add('article');

      const title = document.createElement('h2');
      const titleLink = document.createElement('a');
      titleLink.href = article.path;
      titleLink.textContent = article.title;
      title.appendChild(titleLink);
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

      container.appendChild(articleElement);
      block.replaceChildren(container);
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
  }
}
