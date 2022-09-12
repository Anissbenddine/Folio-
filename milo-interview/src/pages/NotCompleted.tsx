import Navigation from '../components/Navigation';
import { ToDoProps } from '../Interfaces/ToDoProps';

const NotCompleted = () => {
    const nonCompleted = JSON.parse(sessionStorage.getItem("storedTasks") || "[]").filter((obj: ToDoProps) => {
        return obj.completed === false;
    })
    return (
        <div className='rounded'>

            <Navigation />
            <div className='w-full my-5 bg-white rounded-lg p-5 shadow-lg'>
                <h1 className=" text-lg text-center  font-bold ">No Completed :</h1>
                <ul>
                    <table id="todo_table" className="table " >
                        <tbody className="rounded-full ">
                            {nonCompleted?.map((toDo: ToDoProps) => (
                                <tr className="odd:bg-blue-100 even:bg-blue-50 h-full w-full  ">
                                    <td className="  w-full p-2 text-orange-800  rounded-xl " >
                                        <div className="h-5 grid grid-cols-3 gap-4 content-center  rounded-full">
                                            <li key={toDo.id} >
                                                <h2>{toDo.name}</h2>
                                            </li>
                                            <button className=" text-white border bg-red-500 rounded" > No Completed</button>
                                        </div>

                                    </td>
                                </tr>
                            ))
                            }
                        </tbody>
                    </table>

                </ul>
            </div>

        </div>
    );
};

export default NotCompleted;