import "./styles.css";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  //make sure you assign the initial value of a state using a function,
  //else the state is getting initiallised each time the component re-renders

  //to keep track of all todos
  const [todos, setTodos] = useState(() => {
    let localTodos = localStorage.getItem("todos");

    if (localTodos) {
      return JSON.parse(localTodos);
    } else return [];
  });
  //to keep track of current input value
  const [todo, setTodo] = useState(() => {
    return "";
  });
  //to handle between edit and add forms
  const [enableEdit, setEditForm] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(() => {
    return {};
  });

  //on Each todos(state) update
  useEffect(() => {
    //each time a new todo is added, update the local storage
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleSubmit = (e) => {
    //to avoid a refresh
    e.preventDefault();

    //if entered todo is not empty
    if (todo !== "") {
      setTodos([
        ...todos,
        {
          id: todos.length + 1,
          text: todo.trim()
        }
      ]);
      //to clear the input text
      setTodo("");
    }
  };

  const handleAddInputChange = (e) => {
    setTodo(e.target.value);
  };

  const handleTodoDelete = (id) => {
    const modifiedTodos = [...todos].filter((e) => {
      return e.id !== id;
    });

    setTodos(modifiedTodos);
  };

  const handleEdit = (e) => {
    e.preventDefault();

    updateTodos(currentTodo.id, currentTodo);
  };

  const handleEditClick = (selectedTodo) => {
    setEditForm(true);
    setCurrentTodo({ ...selectedTodo });
  };

  const updateTodos = (id, updatedTodo) => {
    const modifiedTodos = todos.map((e) => {
      return e.id === id ? updatedTodo : e;
    });

    setEditForm(false);
    setTodos(modifiedTodos);
  };

  const handleEditInputChange = (e) => {
    //id is already set when edit button was clicked
    //just updating the text from the input value
    setCurrentTodo({ ...currentTodo, text: e.target.value });
  };

  return (
    <div className="App">
      <h1>Todo App</h1>
      <div className="mainArea">
        {enableEdit ? (
          <form onSubmit={handleEdit}>
            <div className="mb-3 row">
              <label className="col-sm-12 form-label">Edit todo: </label>
              <div className="col-sm-10">
                <input
                  className="form-control"
                  onChange={handleEditInputChange}
                  placeholder="Edit todo"
                  value={currentTodo.text}
                  type="text"
                />
              </div>
              <div className="col-sm-2">
                {/*type="submit will act like a form submit, so handleEdit() will get called on click"*/}
                <button className="btn btn-success" type="submit">
                  Update{" "}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditForm(false)}
                >
                  Cancel{" "}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3 row">
              <label className="col-sm-12 form-label">New Todo </label>
              <div className="col-sm-11">
                <input
                  className="form-control"
                  onChange={handleAddInputChange}
                  placeholder="Enter your new todo"
                  value={todo}
                  type="text"
                />
              </div>
              <div className="col-sm-1">
                <button type="submit" className="btn btn-success">
                  Add{" "}
                </button>
              </div>
            </div>
          </form>
        )}
        <br />
        <ul className="list-group allTodos">
          {todos.map((e) => (
            <li className="lineItem row" key={e.id}>
              <div className="col-sm-10">
                <span>{e.text}</span>
              </div>
              <div className="col-sm-2">
                <button
                  className="btn btn-warning"
                  onClick={() => handleEditClick(e)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleTodoDelete(e.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
