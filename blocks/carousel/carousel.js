import { fetchPlaceholders, createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function updateActiveSlide(slide) {
  const block = slide.closest('.carousel');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll('.carousel-slide');
  slides.forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });

  const indicators = block.querySelectorAll('.carousel-slide-indicator');
  indicators.forEach((indicator, idx) => {
    if (idx !== slideIndex) {
      indicator.querySelector('button').removeAttribute('disabled');
    } else {
      indicator.querySelector('button').setAttribute('disabled', 'true');
    }
  });
}

function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.carousel-slide');
  let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realSlideIndex = 0;
  const activeSlide = slides[realSlideIndex];

  activeSlide.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));
  block.querySelector('.carousel-slides').scrollTo({
    top: 0,
    left: activeSlide.offsetLeft,
    behavior: 'smooth',
  });
}

function bindEvents(block) {
  const slideIndicators = block.querySelector('.carousel-slide-indicators');
  if (!slideIndicators) return;

  slideIndicators.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const slideIndicator = e.currentTarget.parentElement;
      showSlide(block, parseInt(slideIndicator.dataset.targetSlide, 10));
    });
  });

  block.querySelector('.slide-prev').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
  });
  block.querySelector('.slide-next').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
  });

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.5 });
  block.querySelectorAll('.carousel-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
}

function createSlide(row, slideIndex, carouselId) {
  // Skip if row contains carousel configuration
  if (row.querySelector('[data-aue-prop="style"], [data-aue-prop="autoplay"], [data-aue-prop="autoplayInterval"]')) {
    return null;
  }

  const slide = document.createElement('li');
  slide.className = 'carousel-slide';
  slide.dataset.slideIndex = slideIndex;
  slide.id = `${carouselId}-slide-${slideIndex}`;

  [...row.children].forEach((div) => {
    const divClone = div.cloneNode(true);
    if (divClone.children.length === 1 && divClone.querySelector('picture')) {
      divClone.className = 'carousel-slide-image';
    } else {
      divClone.className = 'carousel-slide-content';

      // Add buttons if they exist
      const primaryButtonText = div.querySelector('[data-aue-prop="primary_button_text"]');
      const primaryButtonLink = div.querySelector('[data-aue-prop="primary_button_link"]');
      const secondaryButtonText = div.querySelector('[data-aue-prop="secondary_button_text"]');
      const secondaryButtonLink = div.querySelector('[data-aue-prop="secondary_button_link"]');

      if ((primaryButtonText && primaryButtonLink)
        || (secondaryButtonText && secondaryButtonLink)) {
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'carousel-buttons';

        if (primaryButtonText && primaryButtonLink) {
          const primaryButton = document.createElement('a');
          primaryButton.href = primaryButtonLink.textContent.trim();
          primaryButton.textContent = primaryButtonText.textContent.trim();
          primaryButton.className = 'button primary';
          buttonsContainer.appendChild(primaryButton);
          // Remove the original elements
          primaryButtonText.parentElement.remove();
          primaryButtonLink.parentElement.remove();
        }

        if (secondaryButtonText && secondaryButtonLink) {
          const secondaryButton = document.createElement('a');
          secondaryButton.href = secondaryButtonLink.textContent.trim();
          secondaryButton.textContent = secondaryButtonText.textContent.trim();
          secondaryButton.className = 'button secondary';
          buttonsContainer.appendChild(secondaryButton);
          // Remove the original elements
          secondaryButtonText.parentElement.remove();
          secondaryButtonLink.parentElement.remove();
        }

        divClone.appendChild(buttonsContainer);
      }

      // Hide any remaining button-related elements
      divClone.querySelectorAll('[data-aue-prop*="button"]').forEach((el) => {
        el.closest('.carousel-slide-content').style.display = 'none';
      });
    }
    slide.append(divClone);
  });

  return slide;
}

let carouselId = 0;
export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-${carouselId}`);
  const rows = block.querySelectorAll(':scope > div');
  // Count slides with images
  const slidesWithImages = [...rows].filter((row) => row.querySelector('picture'));
  const isSingleSlide = slidesWithImages.length < 2;

  const placeholders = await fetchPlaceholders();

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', placeholders.carousel || 'Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-slides');
  block.prepend(slidesWrapper);

  let slideIndicators;
  let slideIndex = 0;
  if (!isSingleSlide) {
    const slideIndicatorsNav = document.createElement('nav');
    slideIndicatorsNav.setAttribute('aria-label', placeholders.carouselSlideControls || 'Carousel Slide Controls');
    slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('carousel-slide-indicators');
    slideIndicatorsNav.append(slideIndicators);
    block.append(slideIndicatorsNav);

    const slideNavButtons = document.createElement('div');
    slideNavButtons.classList.add('carousel-navigation-buttons');
    slideNavButtons.innerHTML = `
      <button type="button" class="slide-prev" aria-label="${placeholders.previousSlide || 'Previous Slide'}"></button>
      <button type="button" class="slide-next" aria-label="${placeholders.nextSlide || 'Next Slide'}"></button>
    `;

    container.append(slideNavButtons);
  }

  // Process each row
  rows.forEach((row) => {
    const element = createSlide(row, slideIndex, carouselId);
    if (element && element.classList.contains('carousel-slide')) {
      // Only add to slides wrapper if it's a valid slide
      slidesWrapper.append(element);
      if (slideIndicators) {
        const indicator = document.createElement('li');
        indicator.classList.add('carousel-slide-indicator');
        indicator.dataset.targetSlide = slideIndex;
        indicator.innerHTML = `<button type="button" aria-label="${placeholders.showSlide || 'Show Slide'} ${slideIndex + 1} ${placeholders.of || 'of'} ${slidesWithImages.length}"></button>`;
        slideIndicators.append(indicator);
      }
      slideIndex += 1;
    }
  });

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Clean up original rows
  rows.forEach((row) => row.remove());

  container.append(slidesWrapper);
  block.prepend(container);

  if (!isSingleSlide) {
    bindEvents(block);
  }
}
