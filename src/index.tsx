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

@inject("todoStore") @observer
class TodoApp extends React.Component<{ todoStore?: TodoStore }, { currentTodo: string }> {

    render() {
        return <div>
            <DevTools />
            <h1>{this.props.todoStore.countOfDoneItems} / {this.props.todoStore.countOfTodos}</h1>

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

render(<Provider todoStore={todoStore} ><TodoApp /></Provider>, document.getElementById("app"));
