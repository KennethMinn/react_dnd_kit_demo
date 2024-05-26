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
    console.log(event);
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

      tasks[activeTaskIndex].columnId = tasks[overTaskIndex].columnId;

      return arrayMove(prevTasks, activeTaskIndex, overTaskIndex);
    });
  };

  return (
    <DndContext
      onDragStart={onDragStart}
      //onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <div className=" grid grid-cols-3 gap-x-4 m-10">
        {columns.map((col) => (
          <div key={col.id} className=" border p-10">
            <div className=" mb-10">{col.title}</div>
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
        ))}
      </div>
    </DndContext>
  );
}

export default App;
