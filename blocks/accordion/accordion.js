function toggleAccordion(blockUUID, activeAccordion) {
  const allAccordions = document.querySelectorAll(`#accordion-${blockUUID} .accordion-item`);
  allAccordions.forEach((accordion) => {
    if (accordion === activeAccordion) {
      const checkbox = activeAccordion.querySelector("input[type='checkbox']");
      const label = activeAccordion.querySelector('label');
      if (checkbox.checked) {
        label.setAttribute('aria-expanded', false);
        accordion.classList.remove('expanded');
      } else {
        label.setAttribute('aria-expanded', true);
        accordion.classList.add('expanded');
      }
    } else {
      const checkbox = accordion.querySelector("input[type='checkbox']");
      const label = accordion.querySelector('label');
      if (checkbox.checked) {
        checkbox.click();
        label.setAttribute('aria-expanded', false);
        accordion.classList.remove('expanded');
      }
    }
  });
}

function createAccordionBlock(question, answer, image, uuid, parentElement, index, customUUID) {
  parentElement.innerHTML = '';
  parentElement.classList.add('accordion-item');
  parentElement.id = `accordion-item-${index}`;
  parentElement.setAttribute('role', 'listitem');

  const summaryInput = document.createElement('input');
  summaryInput.type = 'checkbox';
  summaryInput.className = 'hidden-input';
  summaryInput.name = 'accordions';
  summaryInput.value = uuid;
  summaryInput.id = `accordion-${uuid}-${index}`;
  summaryInput.setAttribute('aria-hidden', 'true');

  const summaryContent = document.createElement('label');
  summaryContent.setAttribute('for', `accordion-${uuid}-${index}`);
  summaryContent.setAttribute('title', question);
  summaryContent.setAttribute('aria-controls', `panel-${uuid}-${index}`);
  summaryContent.setAttribute('aria-expanded', 'false');
  summaryContent.setAttribute('role', 'button');
  summaryContent.className = 'accordion-header';

  const title = document.createElement('h3');
  title.className = 'accordion-title';
  title.textContent = question;

  const plusIcon = document.createElement('span');
  plusIcon.className = 'icon icon-plus';
  plusIcon.setAttribute('aria-hidden', 'true');

  const minusIcon = document.createElement('span');
  minusIcon.className = 'icon icon-minus';
  minusIcon.setAttribute('aria-hidden', 'true');

  summaryContent.append(title, plusIcon, minusIcon);

  const panel = document.createElement('div');
  panel.className = 'accordion-panel';
  panel.id = `panel-${uuid}-${index}`;
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-labelledby', `accordion-${uuid}-${index}`);

  const answerContainer = document.createElement('div');
  answerContainer.className = 'accordion-answer';

  if (image) {
    answerContainer.appendChild(image.cloneNode(true));
  }

  answer.forEach((element) => {
    answerContainer.innerHTML += element;
  });

  panel.appendChild(answerContainer);

  summaryContent.addEventListener('click', () => {
    toggleAccordion(customUUID, parentElement);
  });

  parentElement.append(summaryInput, summaryContent, panel);
  return parentElement;
}

export default async function decorate(block) {
  const customUUID = Math.random().toString(36).substring(2, 15);
  block.setAttribute('role', 'list');
  block.id = `accordion-${customUUID}`;

  const questions = [...block.children].map((element) => {
    const questionElement = element.querySelector(':scope > div:first-child p');
    const imageElements = element.querySelector(':scope > div:nth-child(3) picture');
    const answerElements = element.querySelector(':scope > div:nth-child(2) p');
    return {
      question: questionElement?.textContent,
      image: imageElements?.parentElement,
      answer: [answerElements?.outerHTML],
      uuid: Math.random().toString(36).substring(2, 15),
      parentElement: element,
    };
  });

  const filteredQuestions = questions.filter((item) => item.question !== undefined);
  filteredQuestions.forEach((question, index) => {
    createAccordionBlock(
      question.question,
      question.answer,
      question.image,
      question.uuid,
      question.parentElement,
      index,
      customUUID,
    );
  });
}
