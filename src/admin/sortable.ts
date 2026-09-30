import Sortable from 'sortablejs';
import { useEffect, useRef } from 'preact/hooks';

export function move<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function useSortable<T extends HTMLElement>(onMove: (from: number, to: number) => void, handle?: string) {
  const ref = useRef<T>(null);
  const callback = useRef(onMove);
  callback.current = onMove;

  useEffect(() => {
    if (!ref.current) return;
    const sortable = Sortable.create(ref.current, {
      animation: 150,
      handle,
      delay: 180,
      delayOnTouchOnly: true,
      ghostClass: 'is-drag-ghost',
      onEnd(evt) {
        const { oldIndex, newIndex, item, from } = evt;
        if (oldIndex == null || newIndex == null) return;
        from.removeChild(item);
        from.insertBefore(item, from.children[oldIndex] ?? null);
        if (oldIndex !== newIndex) callback.current(oldIndex, newIndex);
      },
    });
    return () => sortable.destroy();
  }, [handle]);

  return ref;
}
