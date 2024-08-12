import { useState } from "react";
import InputTodo from "./todo/input.todo";

const App = () => {
  const [arrTodo, setArrTodo] = useState(["test 1", "test 2"]);

  return (
    <>
      <InputTodo arrTodo={arrTodo} setArrTodo={setArrTodo} />
      <ul>
        {arrTodo &&
          arrTodo.length > 0 &&
          arrTodo.map((item, idx) => {
            return <li key={idx + 1}>{item}</li>;
          })}
      </ul>
    </>
  );
};

export default App;
