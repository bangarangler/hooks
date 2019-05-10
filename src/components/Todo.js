import React, { useState, useEffect, useReducer, useRef, useMemo } from "react";
import axios from "axios";

import List from "./List.js";

const Todo = props => {
  const [inputIsValid, setInputIsValid] = useState(false);
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

  const inputValidationHandler = event => {
    if (event.target.value.trim() === "") {
      setInputIsValid(false);
    } else {
      setInputIsValid(true);
    }
  };

  const [todoList, dispatch] = useReducer(todoListReducer, []);

  //useEffect(() => {
  //document.addEventListener("mousemove", mouseMoveHandler);
  //return () => {
  //document.removeEventListener("mousemove", mouseMoveHandler);
  //};
  //}, []);

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
      <input
        type="text"
        placeholer="Todo"
        ref={todoInputRef}
        onChange={inputValidationHandler}
        style={{ backgroundColor: inputIsValid ? "transparent" : "red" }}
      />
      <button type="button" onClick={todoAddHandler}>
        Add
      </button>
      {useMemo(
        () => (
          <List items={todoList} onClick={todoRemoveHandler} />
        ),
        [todoList]
      )}
    </>
  );
};

export default Todo;
