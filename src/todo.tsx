import app, { Component } from 'apprun';

const ENTER = 13

const state = {
  filter: 0,
  todos: []
}

const keyup = (state, e) => {
  const input = e.target;
  if (e.keyCode === ENTER && input.value) {
    state = add(state, input.value);
    input.value = '';
    return state;
  }
};

const add = (state, title) => ({
  ...state,
  todos: [...state.todos, { title, done: false }]
});

const toggle = (state, idx) => ({
  ...state,
  todos: [
    ...state.todos.slice(0, idx),
    { ...state.todos[idx], done: !state.todos[idx].done },
    ...state.todos.slice(idx + 1)
  ]
});

const clear = (state) => ({ ...state, todos: [] });

const search = (state, filter) => ({ ...state, filter });

const Todo = ({todo, idx}) => <li $onclick={[toggle, idx]}
  style = {{
    color: todo.done ? 'green': 'red',
    textDecoration: todo.done ? "line-through" : "none",
    cursor: 'pointer'
  }}>
  {todo.title}
</li>;

const view = (state) => {
  const styles = (filter) => ({
    'font-weight': state.filter === filter ? 'bold' : 'normal',
    cursor: 'pointer'
  })
  return <div>
    <h1>Todo</h1>
    <div>
      <span>Show:</span>
      <span> <a style={styles(0)} $onclick={[search, 0]}>All</a></span> |
      <span> <a style={styles(1)} $onclick={[search, 1]}>Todo</a></span> |
      <span> <a style={styles(2)} $onclick={[search, 2]}>Done</a></span>
    </div>
    <ul>
      {
        state.todos
          .filter(todo => state.filter === 0 ||
            (state.filter === 1 && !todo.done) ||
            (state.filter === 2 && todo.done) )
          .map((todo, idx) => <Todo todo={todo} idx={idx} />)
      }
    </ul>
    <div>
      <input placeholder='add todo' $onkeyup={keyup} />
      <button $onclick={add}>Add</button>
      <button $onclick={clear}>Clear</button>
    </div>
  </div>
}

export default new Component(state, view);
