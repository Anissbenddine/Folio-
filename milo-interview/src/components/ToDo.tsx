import { ToDoProps } from "../Interfaces/ToDoProps";

const ToDo = (props: any) => {

    const taskComplete = () => {
        props.setTodos(props.todos?.map((item: ToDoProps) => {
            if (item.id === props.tache.id) {
                return {
                    ...item, completed: !item.completed
                };
            }
            return item;
        }));
    }
    return (
        <div>
            {
                <div className="h-5 grid grid-cols-2 gap-4 content-center  w-500">
                    <h2 className={`${props.tache.completed ? "text-green-600  w-full" : ''}`}>{props.tache.name}</h2>
                    <button onClick={taskComplete} className={`${props.tache.completed ? "text-white  w-full bg-green-600" : ''} border-blue-400 border rounded-full`}     > Complete</button>
                </div>
            }
        </div>
    );
};

export default ToDo;