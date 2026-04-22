import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SortableListProps<T> {
  items: T[];
  onReorder: (next: T[]) => void;
  getId: (item: T, index: number) => string;
  renderItem: (item: T, index: number, dragHandle: ReactNode) => ReactNode;
}

export function SortableList<T>({ items, onReorder, getId, renderItem }: SortableListProps<T>) {
  const ctxId = useId();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const ids = items.map((item, i) => getId(item, i));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from === -1 || to === -1) return;
    onReorder(arrayMove(items, from, to));
  };

  return (
    <DndContext
      id={ctxId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((item, i) => (
            <SortableRow key={ids[i]} id={ids[i]}>
              {(dragHandle) => renderItem(item, i, dragHandle)}
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({
  id,
  children,
}: {
  id: string;
  children: (dragHandle: ReactNode) => ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const dragHandle = (
    <button
      type="button"
      className={cn(
        'flex h-8 w-6 shrink-0 items-center justify-center rounded text-muted-foreground',
        'hover:bg-accent hover:text-foreground',
        'cursor-grab active:cursor-grabbing',
      )}
      aria-label="Drag to reorder"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-4 w-4" />
    </button>
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(isDragging && 'opacity-90 shadow-lg ring-2 ring-primary/40')}
    >
      {children(dragHandle)}
    </div>
  );
}
