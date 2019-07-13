export const query = selector => document.querySelector(selector);

export const queryAll = selector =>
  Array.from(document.querySelectorAll(selector));

export const map = callback => iterable => {
  const result = [];

  for (const element of iterable) {
    result.push(callback(element));
  }

  return result;
};

export const append = (...children) => target => {
  children.forEach(child => target.appendChild(child));

  return target;
};

export const prepend = (...children) => target => {
  children.reverse().forEach(child => target.prepend(child));

  return target;
};

export const insertBefore = (relative, ...inserting) => target => {
  inserting.forEach(child => target.insertBefore(child, relative));

  return target;
};

export const insertAfter = (relative, ...inserting) => target => {
  inserting
    .reverse()
    .forEach(child => target.insertBefore(child, relative.nextSibling));

  return target;
};

export const replace = (oldChild, newChild) => target => {
  target.replaceChild(newChild, oldChild);

  return target;
};

export const remove = child => target => {
  target.removeChild(child);

  return target;
};

export const contains = contained => target => target.contains(contained);

export const setAttribute = (name, value) => target => {
  target.setAttribute(name, value);

  return target;
};

export const getAttribute = name => target => target.getAttribute(name);

export const addClass = className => target => {
  target.classList.add(className);

  return target;
};

export const removeClass = className => target => {
  target.classList.remove(className);

  return target;
};

export const toggleClass = (className, toggle) => target => {
  target.classList.toggle(className, toggle);

  return target;
};

export const on = (event, handler, options) => target => {
  target.addEventListener(event, handler, options);

  return target;
};

export const off = (event, handler, options) => target => {
  target.removeEventListener(event, handler, options);

  return target;
};
