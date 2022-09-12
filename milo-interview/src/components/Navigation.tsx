import { NavLink } from "react-router-dom"

function Navigation() {
    return (
        <div className="flex content-center justify-center h-full items-center my-5">
            <ul>
                <NavLink className="mx-2" to="/">Home</NavLink>
                <NavLink className="mx-2" to="/completed">Completed</NavLink>
                <NavLink className="mx-2" to="/not-completed">Not Completed</NavLink>
            </ul>
        </div>
    );
}

export default Navigation;