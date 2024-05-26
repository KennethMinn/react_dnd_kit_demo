import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export type Task = { id: string; columnId: string; name: string };

const TaskCard = ({ task }: { task: Task }) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging, //to set drag overlay
  } = useSortable({ id: task.id, data: { type: "Task", task } });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className=" border rounded-lg p-5"
    >
      {task.name}
    </div>
  );
};

export default TaskCard;
