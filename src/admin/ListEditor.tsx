import Icon from './Icon';
import { move, useSortable } from './sortable';

interface Props {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel: string;
}

export default function ListEditor({ items, onChange, placeholder, addLabel }: Props) {
  const ref = useSortable<HTMLUListElement>((from, to) => onChange(move(items, from, to)), '.drag-handle');

  return (
    <div class="list-editor">
      <ul ref={ref}>
        {items.map((item, i) => (
          <li key={`${i}-${items.length}`}>
            <span class="drag-handle">
              <Icon name="grip" />
            </span>
            <input
              value={item}
              placeholder={placeholder}
              onInput={(e) => onChange(items.map((x, j) => (j === i ? e.currentTarget.value : x)))}
            />
            <button type="button" class="icon-btn" aria-label="Удалить" onClick={() => onChange(items.filter((_, j) => j !== i))}>
              <Icon name="trash" />
            </button>
          </li>
        ))}
      </ul>
      <button type="button" class="btn btn-small" onClick={() => onChange([...items, ''])}>
        <Icon name="plus" /> {addLabel}
      </button>
    </div>
  );
}
