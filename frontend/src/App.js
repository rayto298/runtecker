import React, { useEffect, useState } from 'react';
import './App.css';

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'; 
import { CSS } from '@dnd-kit/utilities';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';

const SortableItem = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: id });

  const style = {
    padding: 10,
    border: '1px solid #ccc',
    marginBottom: 5,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

const Home = () => <div className="bg-success">This is /</div>;
const About = () => <div className="bg-warning">This is /about</div>;

function App() {
  const [tasks, setTasks] = useState([]);

  const [items, setItems] = useState(['dnd-test-1', 'dnd-test-2', 'dnd-test-3']);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      setItems((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      console.log(process.env.REACT_APP_API_URL);
      const res = await fetch(process.env.REACT_APP_API_URL);
      const data = await res.json();
      setTasks(data);
    };
    fetchTasks();
  }, []);

  return (
    <div className="text-center m-auto p-10">
      <h1 className='text-2xl'>Hello, Runtecker!</h1>

      <button
          className="cursor-pointer rounded-md bg-red-600 px-4 py-4 text-center text-sm font-semibold text-white transition duration-200 ease-in-out hover:bg-red-700 mt-3 mb-3">
          Tailwind test
      </button>

      <button className="btn btn-primary">daisyUI test</button>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((id) => (
            <SortableItem key={id} id={id}>
              {id}
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>

      <Router>
        <div>
          <nav>
            <h2>↓ react-router-dom test ↓</h2>
            <div className="btn btn-success"><Link to="/">to /</Link></div>
            <div className="btn btn-warning"><Link to="/about">to /about</Link></div>
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>

      <section>

        <p>↓ test data from database ↓</p>
        {
          tasks.map((task, index) => (
            <div key={index}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
            </div>
          ))
        }
      </section>

    </div>
  );
}

export default App;
