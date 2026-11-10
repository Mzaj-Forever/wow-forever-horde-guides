/* Homepage UI. All race/class selections and published guides come from guides.json. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const create = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text != null) el.textContent = text;
    return el;
  };

  async function main() {
    const response = await fetch('./guides.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Guide catalog request failed (${response.status})`);
    const catalog = await response.json();
    if (catalog.schemaVersion !== 1 || !Array.isArray(catalog.guides) || !Array.isArray(catalog.races) || !Array.isArray(catalog.classes)) {
      throw new Error('Guide data has an unsupported format');
    }

    let race = 'Undead';
    let characterClass = 'Warlock';
    if (!catalog.races.includes(race)) race = catalog.races[0];
    if (!catalog.classes.includes(characterClass)) characterClass = catalog.classes[0];
    $('guide-count').textContent = String(catalog.guides.length).padStart(2, '0');

    const guideLink = guide => `guide.html?id=${encodeURIComponent(guide.id)}`;
    const cards = $('guide-cards');
    cards.replaceChildren();
    for (const guide of catalog.guides) {
      if (guide.status === 'hidden') continue;
      const card = create('article', 'guide-card');
      card.append(create('div', 'kicker', `${guide.race.toUpperCase()} / ${guide.class.toUpperCase()} · ${guide.statusLabel || guide.status}`));
      card.append(create('h3', null, guide.title));
      card.append(create('p', null, guide.shortDescription));
      const link = create('a', 'cta', 'View guide preview →');
      link.href = guideLink(guide);
      card.append(link);
      cards.append(card);
    }
    if (!cards.children.length) cards.append(create('p', 'muted', 'No public previews yet.'));

    function drawChoices(targetId, options, selected, onSelect) {
      const root = $(targetId);
      root.replaceChildren();
      for (const value of options) {
        const button = create('button', null, value);
        button.type = 'button';
        button.setAttribute('aria-pressed', String(value === selected));
        button.addEventListener('click', () => { onSelect(value); draw(); });
        root.append(button);
      }
    }
    function draw() {
      drawChoices('races', catalog.races, race, next => { race = next; });
      drawChoices('classes', catalog.classes, characterClass, next => { characterClass = next; });
      const result = $('result');
      result.replaceChildren();
      const match = catalog.guides.find(g => g.race === race && g.class === characterClass && g.status !== 'hidden');
      if (match) {
        result.append(create('strong', null, `${match.title} · ${match.statusLabel || match.status}`));
        result.append(create('p', null, match.shortDescription));
        const link = create('a', 'cta', 'Open guide preview →');
        link.href = guideLink(match);
        result.append(link);
      } else {
        result.append(create('strong', null, `${race} ${characterClass} · No published guide`));
        result.append(create('p', null, 'This route is not available yet. Race/class eligibility will be verified before it is released.'));
      }
    }
    draw();
  }

  main().catch(err => {
    console.error(err);
    const result = $('result');
    result.textContent = 'Unable to load guides.json. Confirm that all update files were uploaded together, then refresh the page.';
    $('guide-cards').textContent = 'The guide catalog could not be loaded.';
  });
})();
