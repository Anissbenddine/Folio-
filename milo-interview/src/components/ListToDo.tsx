import { ToDoProps } from "../Interfaces/ToDoProps";
import ToDo from "./ToDo";



const ListToDo = (props: any) => {

    return (
        <div className="w-full my-5 bg-white rounded-lg p-5 shadow-lg ">
            <h1 className=" text-lg text-center  font-bold ">To do :</h1>
            <table id="todo_table" className="table w-full my-5 bg-white rounded-lg p-5 shadow-lg ">
                <tbody className="w-full my-5 bg-white rounded-lg p-5 shadow-lg " >
                    {
                        props.props?.map((toDo: ToDoProps) => (
                            <tr className="odd:bg-blue-100 even:bg-blue-50 h-full w-full  ">
                                <td className="  w-full p-2 text-orange-800  " ><ToDo tache={toDo} setTodos={props.setTodos} todos={props.props} /></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};

export default ListToDo;

