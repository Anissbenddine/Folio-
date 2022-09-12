import { ToDoProps } from "../Interfaces/ToDoProps";

const Done = (props: any) => {


    const filtered = props.props.filter((obj: ToDoProps) => {
        return obj.completed === true;
    })

    return (
        <div className="accordion" id="accordionExample">
            <div className="accordion-item bg-white border border-gray-200">
                <h2 className="accordion-header mb-0" id="headingOne">
                    <button className="
        accordion-button
        relative
        flex
        items-center
        w-full
        py-4
        px-5
        text-base text-gray-800 text-left
        bg-white
        border-0
        rounded-none
        transition
        focus:outline-none
      " type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true"
                        aria-controls="collapseOne">
                        Completed Tasks                    </button>
                </h2>
                <div id="collapseOne" className="accordion-collapse collapse close" aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample">
                    <div className="accordion-body py-4 px-5">
                        <ul>
                            <table id="todo_table" className="table">
                                <tbody className="w-full my-5 bg-white rounded-lg p-5 shadow-lg ">
                                    {filtered?.map((toDo: ToDoProps) => (
                                        <tr className="odd:bg-blue-100 even:bg-blue-50 h-full w-full  ">
                                            <td className="  w-full p-2 text-green-800  " >
                                                <div className="h-5 grid grid-cols-3 gap-4 content-center ">
                                                    <li key={toDo.id} >
                                                        <h2>{toDo.name}</h2>
                                                    </li>
                                                    <button className=" text-white border bg-green-500 rounded w-full" > Completed</button>
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
            </div>

        </div>
    );
};

export default Done;