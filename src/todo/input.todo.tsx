import { useState } from "react";
interface IProps {
  arrTodo: string[];
  setArrTodo: (value: string[]) => void;
}
const InputTodo = (props: IProps) => {
  const { arrTodo, setArrTodo } = props;
  const [todo, setTodo] = useState("");
  const handleSave = () => {
    if (!todo) {
      alert("empty input");
      return;
    }
    setArrTodo([...arrTodo, todo]);
    setTodo("");
  };
  return (
    <div style={{ border: "1px solid red" }}>
      <div>Add new todo:</div>
      <input
        type="text"
        onChange={(e) => setTodo(e.target.value)}
        value={todo}
      />
      <button onClick={() => handleSave()}>save</button>
    </div>
  );
};

export default InputTodo;
