/* Generic guide viewer. Quest/route details live exclusively in guides.json. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const create = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text != null) el.textContent = text;
    return el;
  };
  function getLocal(key) { try { return JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch { return {}; } }
  function setLocal(key, data) { try { localStorage.setItem(key, JSON.stringify(data)); } catch {} }
  function getSelectedGuide(catalog) {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) return catalog.guides.find(g => g.id === id && g.status !== 'hidden');
    // Backward compatibility for links from the first public website.
    const race = params.get('race'), characterClass = params.get('class');
    return catalog.guides.find(g => g.race.toLowerCase() === race && g.class.toLowerCase() === characterClass && g.status !== 'hidden');
  }
  function migrateOldPreview(guide, data, storageKey) {
    if (guide.id !== 'undead-warlock' || Object.keys(data).length) return data;
    const old = getLocal('wow-horde-undead-warlock-preview');
    const imported = {};
    guide.chapters.forEach((chapter, i) => chapter.steps.forEach((step, j) => {
      if (step.checkable && old[`${i}-${j}`] === true) imported[step.id] = true;
    }));
    if (Object.keys(imported).length) setLocal(storageKey, imported);
    return imported;
  }
  function stepMeta(step) {
    const bits = [step.type.replaceAll('_', ' ')];
    if (step.conditions?.minLevel != null) bits.push(`Level ${step.conditions.minLevel}+`);
    if (step.optional) bits.push('Optional');
    if (step.xpEstimate != null) bits.push(`Estimated XP: ${step.xpEstimate}`);
    return bits.join(' · ');
  }
  function renderGuide(guide) {
    document.title = `${guide.title} · WoW Forever Horde`;
    const head = $('guide-head');
    head.replaceChildren();
    head.append(create('div', 'kicker', `${guide.race.toUpperCase()} / ${guide.class.toUpperCase()} · ${guide.statusLabel || guide.status}`));
    head.append(create('h1', null, guide.title));
    head.append(create('p', null, guide.description));
    head.append(create('div', 'notice', 'This route is an early research preview—not a verified, optimized full leveling guide. Confirm that each quest is offered to your character before following it. XP estimates and exact zone transitions are not yet certified.'));
    head.append(create('p', 'guide-version', `Guide version: ${guide.version} · Research link: ${guide.research.sourceSnapshot || 'Pending revalidation'} · In-game testing: ${guide.research.inGameStatus}`));
    const progressText = create('p', null, 'Loading progress…');
    progressText.id = 'progress';
    head.append(progressText);

    const storageKey = `wow-horde-progress:v1:${guide.id}`;
    let done = migrateOldPreview(guide, getLocal(storageKey), storageKey);
    const actionable = guide.chapters.flatMap(c => c.steps).filter(s => s.checkable);
    function updateProgress() { $('progress').textContent = `${actionable.filter(s => done[s.id]).length} / ${actionable.length} actionable steps checked on this device`; }
    const root = $('guide');
    root.replaceChildren();
    for (const chapter of guide.chapters) {
      const section = create('section', 'chapter');
      section.id = `chapter-${chapter.id}`;
      section.append(create('h2', null, chapter.title));
      if (chapter.description) section.append(create('p', 'muted', chapter.description));
      for (const step of chapter.steps) {
        const card = create(step.checkable ? 'label' : 'div', `task${done[step.id] && step.checkable ? ' done' : ''}${step.checkable ? '' : ' planning-note'}`);
        if (step.checkable) {
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.checked = Boolean(done[step.id]);
          checkbox.setAttribute('aria-label', `Mark ${step.title} complete`);
          checkbox.addEventListener('change', () => {
            if (checkbox.checked) done[step.id] = true; else delete done[step.id];
            card.classList.toggle('done', checkbox.checked);
            setLocal(storageKey, done);
            updateProgress();
          });
          card.append(checkbox);
        } else {
          card.append(create('span', 'note-mark', 'ℹ'));
        }
        const body = create('div', 'step-body');
        body.append(create('small', null, stepMeta(step)));
        body.append(create('b', null, step.title));
        body.append(create('p', null, step.description));
        if (step.zoneTransition) body.append(create('p', 'step-extra', `Transition: ${step.zoneTransition.from} → ${step.zoneTransition.to}`));
        if (step.dungeon) body.append(create('p', 'step-extra', `Dungeon plan: ${step.dungeon.name} (${step.dungeon.mode})`));
        card.append(body);
        section.append(card);
      }
      root.append(section);
    }
    updateProgress();
  }
  async function main() {
    const response = await fetch('./guides.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Could not fetch guide data (${response.status})`);
    const catalog = await response.json();
    if (catalog.schemaVersion !== 1 || !Array.isArray(catalog.guides)) throw new Error('Unsupported guide data format');
    const guide = getSelectedGuide(catalog);
    if (!guide) { $('guide-head').textContent = 'This guide was not found. Return to the guide library and choose an available preview.'; return; }
    renderGuide(guide);
  }
  main().catch(err => {
    console.error(err);
    $('guide-head').textContent = 'Unable to load guides.json. Check that all update files were uploaded together, then refresh the page.';
  });
})();
