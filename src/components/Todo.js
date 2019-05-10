import React, { useEffect, useReducer, useRef } from "react";
import axios from "axios";

const Todo = props => {
  //const [todoName, setTodoName] = useState("");
  //const [submittedTodo, setSubmittedTodo] = useState(null);
  //const [todoList, setTodoList] = useState([]);
  const todoInputRef = useRef();

  const todoListReducer = (state, action) => {
    switch (action.type) {
      case "ADD":
        return state.concat(action.payload);
      case "SET":
        return action.payload;
      case "REMOVE":
        return state.filter(todo => todo.id !== action.payload);
      default:
        return state;
    }
  };

  useEffect(() => {
    axios
      .get("https://hooks-jp.firebaseio.com/todos.json")
      .then(res => {
        console.log(res);
        const todoData = res.data;
        const todos = [];
        for (const key in todoData) {
          todos.push({ id: key, name: todoData[key].name });
        }
        dispatch({ type: "SET", payload: todos });
      })
      .catch(err => {
        console.log(err);
      });
    return () => {
      console.log("Cleanup");
    };
  }, [todoInputRef]);

  const mouseMoveHandler = event => {
    console.log(event.clientX, event.clientY);
  };

  const [todoList, dispatch] = useReducer(todoListReducer, []);

  useEffect(() => {
    document.addEventListener("mousemove", mouseMoveHandler);
    return () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, []);

  //useEffect(() => {
  //if (submittedTodo) {
  //dispatch({ type: "ADD", payload: submittedTodo });
  //}
  //}, [submittedTodo]);

  //const inputChangeHandler = e => {
  //setTodoName(e.target.value);
  //};

  const todoAddHandler = () => {
    //setTodoList(todoList.concat(todoName));
    const todoName = todoInputRef.current.value;
    axios
      .post("https://hooks-jp.firebaseio.com/todos.json", { name: todoName })
      .then(res => {
        setTimeout(() => {
          const todoItem = { id: res.data.name, name: todoName };
          dispatch({ type: "ADD", payload: todoItem });
        }, 3000);
      });
  };

  const todoRemoveHandler = todoId => {
    axios
      .delete(`https://hooks-jp.firebaseio.com/todos/${todoId}.json`)
      .then(res => {
        dispatch({ type: "REMOVE", payload: todoId });
      })
      .catch(err => console.log(err));
  };
  return (
    <>
      <input type="text" placeholer="Todo" ref={todoInputRef} />
      <button type="button" onClick={todoAddHandler}>
        Add
      </button>
      <ul>
        {todoList.map(todo => (
          <li key={todo.id} onClick={todoRemoveHandler.bind(this, todo.id)}>
            {todo.name}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Todo;
