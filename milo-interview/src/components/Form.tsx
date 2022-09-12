import { useEffect } from "react";

function Form(props: any) {

    const handleText = (e: any) => {
        props.setInputText(e.target.value)
    }

    const submitText = (e: any) => {
        e.preventDefault();
        props.setTodos([...props.todos, {
            name: props.inputText, completed: false, id: Math.random() * 3
        }]);
        props.setInputText("")
        if (props.todos.length > 0) {
            sessionStorage.setItem("storedTasks", JSON.stringify(props.todos));
        }


    }

    return (
        <div className="">
            <form className="flex justify-center">
                <input placeholder="Enter tasks" value={props.inputText} onChange={handleText} type="text" className="
                p-4 bg-blue-50  rounded-l-full placeholder:italic " />
                <button onClick={submitText} className=" p-4 bg-blue-100  rounded-r-full" type="submit"> + </button>

            </form>
        </div>
    );
}

export default Form;
