import { useEffect, useMemo, useState } from "react";
import "./App.css";
import TaskCard, { Task } from "./components/TaskCard";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { Droppable } from "./components/Droppable";

const columns = [
  {
    id: "todo",
    title: "Todo",
  },
  {
    id: "doing",
    title: "Work in progress",
  },
  {
    id: "done",
    title: "Done",
  },
];

const demo_tasks = [
  {
    id: "1",
    columnId: "todo",
    name: "task1",
  },
  {
    id: "2",
    columnId: "todo",
    name: "task2",
  },
  {
    id: "3",
    columnId: "doing",
    name: "task3",
  },
  {
    id: "4",
    columnId: "done",
    name: "task4",
  },
];

function App() {
  const [tasks, setTasks] = useState(demo_tasks);
  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  };

  //only for vertical
  // const onDragEnd = (event: DragEndEvent) => {
  //   const { active, over } = event;
  //   if (!over) return;

  //   const activeTaskId = active.id;
  //   const overTaskId = over.id;

  //   if (activeTaskId === overTaskId) return;

  //   setTasks((prevTasks) => {
  //     const activeTaskIndex = prevTasks.findIndex(
  //       (task) => task.id === activeTaskId
  //     );
  //     const overTaskIndex = prevTasks.findIndex(
  //       (task) => task.id === overTaskId
  //     );

  //     tasks[activeTaskIndex].columnId = tasks[overTaskIndex].columnId;

  //     return arrayMove(prevTasks, activeTaskIndex, overTaskIndex);
  //   });
  // };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTaskId = active.id;
    const overTaskId = over.id;

    if (activeTaskId === overTaskId) return;

    setTasks((prevTasks) => {
      const activeTaskIndex = prevTasks.findIndex(
        (task) => task.id === activeTaskId
      );
      const overTaskIndex = prevTasks.findIndex(
        (task) => task.id === overTaskId
      );

      // If `over.data.current` contains a columnId, we are hovering over a column
      const overColumnId = over.data.current?.columnId;
      if (
        overColumnId &&
        prevTasks[activeTaskIndex].columnId !== overColumnId
      ) {
        prevTasks[activeTaskIndex].columnId = overColumnId;
      }

      if (overTaskIndex !== -1) {
        return arrayMove(prevTasks, activeTaskIndex, overTaskIndex);
      }

      return [...prevTasks];
    });
  };

  return (
    <DndContext
      onDragStart={onDragStart}
      //onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <div className="grid grid-cols-3 m-10 gap-x-4">
        {columns.map((col) => (
          <Droppable id={col.id} key={col.id} columnId={col.id}>
            <div className="p-10 border ">
              <div className="mb-10 ">{col.title}</div>
              <div className="flex flex-col gap-5">
                <SortableContext items={taskIds}>
                  {tasks
                    .filter((task) => task.columnId === col.id)
                    .map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                </SortableContext>
              </div>
            </div>
          </Droppable>
        ))}
      </div>
    </DndContext>
  );
}

export default App;
