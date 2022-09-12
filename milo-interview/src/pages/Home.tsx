import { useEffect, useState } from "react";
import Done from "../components/Done";
import Form from "../components/Form";
import ListToDo from "../components/ListToDo";
import Navigation from "../components/Navigation";
import { ToDoProps } from "../Interfaces/ToDoProps";
import '../../src/index.css';

function Home() {
    const [inputText, setInputText] = useState<string | null>(null)
    const [todos, setTodos] = useState<ToDoProps[] | null>([])
    const [storedTasks, setStoredTasks] = useState(JSON.parse(sessionStorage.getItem("storedTasks") || "[]"))
    const myData = todos?.sort((a, b) => {
        return b.completed === a.completed ? 0 : b.completed ? -1 : 1;
    });

    useEffect(() => {
        if (todos?.length != 0) {
            setStoredTasks(todos);
        }

    })
    return (
        <div className="w-full">
            <Navigation />
            <Form inputText={inputText} setInputText={setInputText} todos={storedTasks} setTodos={setTodos} storedTasks={storedTasks} setStoredTasks={setStoredTasks} />
            <ListToDo props={storedTasks} setTodos={setTodos} />
            <Done props={storedTasks} />
        </div>
    );
}

export default Home;