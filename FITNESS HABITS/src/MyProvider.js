import React, {Component} from "react"

export const MContext = React.createContext();  //exporting context object
class MyProvider extends Component {
    state = {message: ""}
    render() {
        return (
            <MContext.Provider value={
                {   state: this.state, setMessage: (value) => this.setState({ message: value })}}>
                {
                    //this indicates that all the child tags with MyProvider as Parent can access the global store.
                    this.props.children
                }
            </MContext.Provider>)
    }
} export default MyProvider;
