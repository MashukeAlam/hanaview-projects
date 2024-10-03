


# HanaView

HanaView is a lightweight, minimalistic JavaScript library for building user interfaces with a virtual DOM. It provides a simple way to create components and manage state without the overhead of larger frameworks.

## Installation

Include the `hv.js` file in your HTML project.

```html
<script type="module">
  import { mount, val, ref } from './hv.js';
</script>
```

## Usage

### Mounting a Component

To use HanaView, define a component function that returns a virtual DOM (vDOM) node. Use the `mount` function to render the component into a specified DOM element.

```javascript
const root = document.getElementById("root");
mount(YourComponent, root);
```

### Creating Components

A component can return an object representing the virtual DOM. This object can contain:

- `tag`: The HTML tag (e.g., `div`, `p`, `button`)
- `text`: The text content for the element
- `attributes`: An object containing attributes (e.g., class, id)
- `events`: An object for event listeners (e.g., click, input)
- `children`: An array of child virtual DOM nodes
- `ref`: A reference to the DOM element

### Managing State

Use the `val` function to create state variables within your component.

```javascript
const [count, setCount] = val(0);
```

- `val(initialValue)`: Initializes a state variable with the given initial value. Returns an array containing the current state value and a setter function to update it.

### Creating References

Use the `ref` function to create mutable references for DOM elements.

```javascript
const inputRef = ref(null);
```

- `ref(initialValue)`: Creates a reference object that can be used to get or set a DOM element.

### Example: Todo List

Here’s a simple example of a Todo List application using HanaView.

```javascript
function TodoList() {
  const [todos, setTodos] = val([]);
  const inputRef = ref(null);

  const addTodo = () => {
    const inputValue = inputRef.current.value;
    if (inputValue.trim() === "") return;
    setTodos([...todos, { text: inputValue, completed: false }]);
    inputRef.current.value = ""; // Clear input after adding
  };

  const toggleTodo = (index) => {
    const newTodos = todos.map((todo, i) =>
      i === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
  };

  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  return {
    tag: "div",
    children: [
      { tag: "h1", text: "Todo List" },
      {
        tag: "input",
        attributes: { type: "text", placeholder: "Add a new task..." },
        ref: inputRef,
      },
      {
        tag: "button",
        text: "Add",
        events: { click: addTodo },
      },
      {
        tag: "ul",
        children: todos.map((todo, index) => ({
          tag: "li",
          children: [
            {
              tag: "span",
              text: todo.completed ? `✅ ${todo.text}` : todo.text,
              events: { click: () => toggleTodo(index) },
            },
            {
              tag: "button",
              text: "Delete",
              events: { click: () => deleteTodo(index) },
            },
          ],
        })),
      },
    ],
  };
}

// Mount the TodoList component
const root = document.getElementById("root");
mount(TodoList, root);
```

## Thanks!

HanaView provides a straightforward way to build UI components with minimal fuss. It emphasizes simplicity and ease of use, making it a great choice for lightweight applications. Enjoy building with HanaView!
