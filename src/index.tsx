import * as React from "react";
import { render } from "react-dom";
import { observable, computed } from "mobx";
import { observer, inject, Provider } from "mobx-react";
import DevTools from 'mobx-react-devtools';

class Todo {
    constructor({ title }) {
        this.title = title;
    }

    static i = 0;

    @observable title: string
    @observable id: number = Todo.i++;
    @observable done: boolean = false

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class TodoStore {
    @observable todos: Todo[] = [];

    @computed get countOfTodos() {
        return this.todos.length;
    }

    @computed get countOfDoneItems() {
        return this.todos.filter((t) => t.done).length;
    }

    addTodo(todoItem: Todo) {
        this.todos.push(todoItem)
    }

}

@inject("windowSize")
@inject("todoStore") @observer
class TodoApp extends React.Component<{ todoStore?: TodoStore, windowSize?: WindowSize }, { currentTodo: string }> {

    render() {
        return <div>
            <DevTools />
            <h1>{this.props.todoStore.countOfDoneItems} / {this.props.todoStore.countOfTodos} in { this.props.windowSize.h } x { this.props.windowSize.w }</h1>

            <p>{JSON.stringify(this.props.todoStore)}</p>

            <form onSubmit={(ev) => {
                this.props.todoStore.addTodo(new Todo({ title: this.state.currentTodo }));
                ev.preventDefault();
            }}>
                Input todo:
                <input type="text" onChange={(e) => this.setState({ currentTodo: (e.target as HTMLInputElement).value })} />
                <button onClick={ async () => {
                    await sleep(3000);
                    this.props.todoStore.addTodo(new Todo({ title: this.state.currentTodo }));
                }} >Super add button!</button>
            </form>

            <ul>
                {
                    this.props.todoStore.todos.map((todo) => <li key={todo.id} >
                        <label>
                            <input checked={todo.done} type="checkbox" onChange={() => todo.done = !todo.done} />
                            <span style={todo.done ? { textDecoration: "line-through" } : {}}>{todo.title}</span>
                        </label>
                    </li>)
                }
            </ul>
        </div>
    }

}

const todoStore = new TodoStore()

class WindowSize {
    @observable w: number = 0;
    @observable h: number = 0;

    constructor() {
        this.attachSize();
    }

    attachSize() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
    }
}

let windowSize = new WindowSize();

window.addEventListener("resize", () => windowSize.attachSize() );

render(<Provider todoStore={todoStore} windowSize={windowSize} ><TodoApp /></Provider>, document.getElementById("app"));

class X {
    constructor () {
        console.log("born", this);
    }
}

let a: X = {};
new X();
