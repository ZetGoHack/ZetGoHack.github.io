import type { PricingPackage } from '../lib/content-schema';
import Icon from './Icon';
import ListEditor from './ListEditor';
import { move, useSortable } from './sortable';
import type { TabProps } from './types';

export default function PricingTab({ content, update }: TabProps) {
  const listRef = useSortable<HTMLDivElement>(
    (from, to) => update((draft) => (draft.pricing.packages = move(draft.pricing.packages, from, to))),
    '.drag-handle',
  );

  const patch = (index: number, fn: (p: PricingPackage) => void) =>
    update((draft) => {
      const pkg = draft.pricing.packages[index];
      if (pkg) fn(pkg);
    });

  return (
    <div class="stack">
      <section class="panel">
        <label class="field">
          <span>Текст над пакетами</span>
          <textarea
            rows={2}
            value={content.pricing.intro}
            onInput={(e) => update((draft) => (draft.pricing.intro = e.currentTarget.value))}
          />
        </label>
      </section>

      <div class="pricing-editor" ref={listRef}>
        {content.pricing.packages.map((pkg, i) => (
          <section class={`panel pricing-panel${pkg.highlighted ? ' is-highlighted' : ''}`} key={`${i}-${content.pricing.packages.length}`}>
            <div class="panel-head">
              <span class="drag-handle" title="Перетащите, чтобы изменить порядок">
                <Icon name="grip" />
              </span>
              <button
                type="button"
                class="icon-btn"
                aria-label="Удалить пакет"
                onClick={() => {
                  if (confirm(`Удалить пакет «${pkg.name || 'без названия'}»?`)) {
                    update((draft) => draft.pricing.packages.splice(i, 1));
                  }
                }}
              >
                <Icon name="trash" />
              </button>
            </div>
            <label class="field">
              <span>Название</span>
              <input value={pkg.name} onInput={(e) => patch(i, (p) => (p.name = e.currentTarget.value))} />
            </label>
            <label class="field">
              <span>Цена</span>
              <input value={pkg.price} placeholder="€350" onInput={(e) => patch(i, (p) => (p.price = e.currentTarget.value))} />
            </label>
            <div class="field">
              <span>Что входит</span>
              <ListEditor items={pkg.features} addLabel="Добавить пункт" onChange={(features) => patch(i, (p) => (p.features = features))} />
            </div>
            <label class="check">
              <input type="checkbox" checked={pkg.highlighted} onChange={(e) => patch(i, (p) => (p.highlighted = e.currentTarget.checked))} />
              Выделить как рекомендуемый
            </label>
          </section>
        ))}
      </div>

      {content.pricing.packages.length < 8 && (
        <button
          type="button"
          class="btn"
          onClick={() =>
            update((draft) => draft.pricing.packages.push({ name: 'Новый пакет', price: '', features: [], highlighted: false }))
          }
        >
          <Icon name="plus" /> Добавить пакет
        </button>
      )}
    </div>
  );
}
