function toggleAccordion(blockUUID, activeAccordion) {
  const allAccordions = document.querySelectorAll(`#accordion-${blockUUID} .accordion-item`);
  allAccordions.forEach((accordion) => {
    if (accordion === activeAccordion) {
      const checkbox = activeAccordion.querySelector("input[type='checkbox']");
      const label = activeAccordion.querySelector('label');
      if (checkbox.checked) {
        label.setAttribute('aria-expanded', false);
      } else {
        label.setAttribute('aria-expanded', true);
      }
    } else {
      const checkbox = accordion.querySelector("input[type='checkbox']");
      const label = accordion.querySelector('label');
      if (checkbox.checked) {
        checkbox.click();
        label.setAttribute('aria-expanded', false);
      }
    }
  });
}

function createAccordionBlock(question, answer, image, uuid, parentElement, index, customUUID) {
  parentElement.innerHTML = '';
  parentElement.classList.add('accordion-item', 'relative', 'padding-y-2');
  parentElement.id = `accordion-item-${index}`;

  const summaryInput = document.createElement('input');
  summaryInput.type = 'checkbox';
  summaryInput.className = 'hidden-input';
  summaryInput.name = 'accordions';
  summaryInput.value = uuid;
  summaryInput.id = `accordion-${uuid}-${index}`;
  summaryInput.setAttribute('aria-labelledby', question);

  const summaryContent = document.createElement('label');
  summaryContent.setAttribute('for', `accordion-${uuid}-${index}`);
  summaryContent.setAttribute('title', question);
  summaryContent.setAttribute('aria-controls', `accordion-${uuid}-${index}`);
  summaryContent.className = 'accordion-header';

  const title = document.createElement('h3');
  title.className = 'accordion-title';
  title.textContent = question;

  const plusIcon = document.createElement('span');
  plusIcon.className = 'icon icon-plus';

  const minusIcon = document.createElement('span');
  minusIcon.className = 'icon icon-minus';

  summaryContent.append(title, plusIcon, minusIcon);

  const panel = document.createElement('div');
  panel.className = 'accordion-panel';

  const answerContainer = document.createElement('div');
  answerContainer.className = 'accordion-answer';

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
  const customUUID = Math.random().toString(36).substring(2, 15); // Generate UUID

  const questions = [...block.children].map((element) => {
    const questionElement = element.querySelector(':scope > div > h3');
    const imageElements = element.querySelector(':scope > div > picture');
    const answerElements = imageElements ? Array.from(element.querySelector(':scope > div:nth-child(2)').children).slice(1)
      : Array.from(element.querySelector(':scope > div').children).slice(1);
    return {
      question: questionElement?.textContent,
      image: imageElements?.parentElement,
      answer: answerElements.map((elem) => elem.outerHTML),
      uuid: Math.random().toString(36).substring(2, 15),
      parentElement: element,
    };
  });

  const filteredQuestions = questions.filter((item) => item.question !== undefined);
  const accordionItems = filteredQuestions.map((question, index) => createAccordionBlock(
    question.question,
    question.answer,
    question.image,
    question.uuid,
    question.parentElement,
    index,
    customUUID,
  ));

  const accordionContainer = document.createElement('div');
  accordionContainer.id = `accordion-${customUUID}`;
  accordionContainer.className = 'accordion-container';
  accordionItems.forEach((item) => accordionContainer.appendChild(item));

  block.appendChild(accordionContainer);
}
