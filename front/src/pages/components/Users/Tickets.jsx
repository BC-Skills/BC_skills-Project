import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { DragDropContext } from "react-beautiful-dnd";
import PropTypes from "prop-types"; // Import PropTypes
import { HTML5Backend } from "react-dnd-html5-backend";

const statuses = ["todo", "inprogress", "completed"];

const initialTasks = [
  { id: 'task1', content: 'Task 1', status: 'todo' },
  { id: 'task2', content: 'Task 2', status: 'inprogress' },
  { id: 'task3', content: 'Task 3', status: 'completed' },
];

const Tickets = () => {
  const storedLinks = localStorage.getItem("links");
  const navigate = useNavigate();

  useEffect(() => {
    const parsedLinkss = JSON.parse(storedLinks) || [];
    const hasProjectsLink = parsedLinkss.some((link) => link.name === "tickets");
    if (!hasProjectsLink) {
      navigate("/users");
    }
  }, [storedLinks]);

  const [tasks, setTasks] = useState(initialTasks);

  const moveTask = (dragIndex, hoverIndex, status) => {
    const draggedTask = tasks.find((task) => task.status === status && task.id === dragIndex);
    const updatedTasks = tasks.filter((task) => task.id !== dragIndex);
    updatedTasks.splice(hoverIndex, 0, { ...draggedTask, status });
    setTasks(updatedTasks);
  };


  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    if (source.droppableId === destination.droppableId) {
      // Reorder tasks within the same section
      const reorderedTasks = Array.from(tasks);
      const [removed] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, removed);
      setTasks(reorderedTasks);
    } else {
      // Move tasks between sections
      const sourceTasks = Array.from(tasks);
      const destTasks = Array.from(tasks);

      const [removed] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, removed);

      // Update status of the task
      const updatedTasks =
        source.droppableId === "completed"
          ? destTasks.map((task) => ({ ...task, status: "completed" }))
          : destTasks.map((task) => ({ ...task, status: "inprogress" }));

      setTasks(updatedTasks);
    }
  };

  const Task = ({ task, index, status }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "task",
      item: { id: task.id, index, status },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    const [, drop] = useDrop({
      accept: "task",
      hover: (item) => {
        if (item.status !== status) {
          // eslint-disable-next-line no-undef
          moveTask(item.id, index, status);
          item.status = status;
        }
      },
    });

    return (
      <div
        ref={(node) => drag(drop(node))}
        className={`bg-white rounded-md p-2 mb-2 ${isDragging ? "opacity-50" : ""}`}
      >
        <p>{task.content}</p>
        <span className="text-sm">{task.status}</span>
      </div>
    );
  };

  // Prop Types validation for Task component
  Task.propTypes = {
    task: PropTypes.shape({
      id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      status: PropTypes.oneOf(["todo", "inprogress", "completed"]).isRequired,
    }).isRequired,
    index: PropTypes.number.isRequired,
    status: PropTypes.oneOf(["todo", "inprogress", "completed"]).isRequired,
  };

  return (
    <DndProvider backend={HTML5Backend}> {/* Wrap the entire app with DndProvider */}

    <div className="flex justify-center items-center h-screen">
      <DragDropContext onDragEnd={handleDragEnd}>
        {statuses.map((status) => (
          <div
            key={status}
            className="bg-gray-100 rounded-lg p-4 m-4 w-96 h-96 overflow-y-auto"
          >
            <h2 className="text-lg font-semibold mb-4">{status.toUpperCase()}</h2>
            {tasks.map((task, index) => {
              if (task.status === status) {
                return <Task key={task.id} task={task} index={index} status={status} />;
              } else {
                return null;
              }
            })}
          </div>
        ))}
      </DragDropContext>
    </div>
    </DndProvider>
  );
};

export default Tickets;