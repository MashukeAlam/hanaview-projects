let rootElement = null;
let currentComponent = null;
let currentVDOM = null;
let stateIndex = 0;
let states = [];
let isRenderingScheduled = false;

// create the html
function createElement(vNode) {
  if (typeof vNode === 'string') {
    return document.createTextNode(vNode);
  }

  const { tag, text, attributes, events, children, ref } = vNode;
  const element = document.createElement(tag);

  if (text) {
    element.textContent = text;
  }

  if (attributes) {
    Object.keys(attributes).forEach(attr => {
      element.setAttribute(attr, attributes[attr]);
    });
  }

  if (events) {
    Object.keys(events).forEach(event => {
      element.addEventListener(event, events[event]);
    });
  }

  if (ref) {
    ref.current = element; 
  }

  // recursively add other childrens
  if (children) {
    children.forEach(child => {
      element.appendChild(createElement(child));
    });
  }

  return element;
}

// amount of my credit in writing this is same as the number of moons venus has
function updateElement(parentElement, oldVNode, newVNode, index = 0) {
  const oldElement = parentElement.childNodes[index];

  if (!newVNode && oldElement) {
    oldElement.remove();
    return;
  }

  if (!oldVNode) {
    parentElement.appendChild(createElement(newVNode));
    return;
  }

  if (typeof newVNode === 'string' || typeof oldVNode === 'string') {
    if (newVNode !== oldVNode) {
      const newElement = createElement(newVNode);
      oldElement.replaceWith(newElement);
    }
    return;
  }

  if (newVNode.tag !== oldVNode.tag) {
    const newElement = createElement(newVNode);
    oldElement.replaceWith(newElement);
    return;
  }

  if (newVNode.text && newVNode.text !== oldVNode.text) {
    oldElement.textContent = newVNode.text;
  }

  if (newVNode.attributes) {
    Object.keys(newVNode.attributes).forEach(attr => {
      if (oldElement.getAttribute(attr) !== newVNode.attributes[attr]) {
        oldElement.setAttribute(attr, newVNode.attributes[attr]);
      }
    });
  }

  if (newVNode.events) {
    Object.keys(newVNode.events).forEach(event => {
      const oldListener = oldElement[`on${event}`];
      if (oldListener !== newVNode.events[event]) {
        if (oldListener) {
          oldElement.removeEventListener(event, oldListener);
        }
        oldElement.addEventListener(event, newVNode.events[event]);
        oldElement[`on${event}`] = newVNode.events[event]; 
      }
    });
  }

  const oldChildren = oldVNode.children || [];
  const newChildren = newVNode.children || [];
  const length = Math.max(oldChildren.length, newChildren.length);

  for (let i = 0; i < length; i++) {
    updateElement(oldElement, oldChildren[i], newChildren[i], i);
  }
}

// shove the generated html into real dom
function render(vNode, container) {
  if (!currentVDOM) {
    container.innerHTML = ''; // reset container
    container.appendChild(createElement(vNode));
  } else {
    updateElement(container, currentComponent, vNode); // update the root element only
  }
}

// rerender when the state changes

function reRender() {
  if (!isRenderingScheduled) {
    isRenderingScheduled = true;
    requestAnimationFrame(() => {
      stateIndex = 0;
      const newVDOM = currentComponent(); 
      render(newVDOM, rootElement); 
      currentVDOM = newVDOM; 
      isRenderingScheduled = false;
    });
  }
}


// the only thing i need from react xd
function val(initialValue) {
  const localIndex = stateIndex;
  states[localIndex] = states[localIndex] !== undefined ? states[localIndex] : initialValue;
  
  const set = (newValue) => {    
    states[localIndex] = newValue;
    reRender(); 
  };
  
  stateIndex++;
  return [states[localIndex], set];
}

// the only (second) thing i need from react xd
function ref(initialValue) {
  return { current: initialValue };
}


// mount sounds wrong, can we call it something else?
function mount(component, container) {
  rootElement = container;
  currentComponent = component;
  reRender();
}

// if this export list gets bigger, i'll go back to react. pinky promise!
export { mount, val, ref };
