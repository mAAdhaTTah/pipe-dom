import { fireEvent } from '@testing-library/dom';
import {
  query,
  queryAll,
  map,
  append,
  prepend,
  insertBefore,
  insertAfter,
  replace,
  remove,
  contains,
  setAttribute,
  getAttribute,
  addClass,
  removeClass,
  toggleClass,
  on,
  off
} from '../src';

const createDiv = (...classNames) => {
  const div = document.createElement('div');
  div.className = 'my-div';
  document.body.appendChild(div);

  classNames.forEach(className => div.classList.add(className));

  return div;
};

describe('pipe-dom', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('query', () => {
    it('should return a single DOM node', () => {
      const div = createDiv();

      expect(query('.my-div')).toEqual(div);
    });
  });

  describe('queryAll', () => {
    it('should get all DOM nodes', () => {
      createDiv();
      createDiv();
      createDiv();

      expect(queryAll('.my-div')).toHaveLength(3);
    });

    describe('map', () => {
      it('should apply function to every element', () => {
        createDiv();
        createDiv();
        createDiv();

        const results = queryAll('.my-div') |> map(addClass('new-class'));

        expect(results).toHaveLength(3);

        results.forEach(result => {
          expect(result).toHaveClass('new-class');
        });
      });
    });
  });

  describe('append', () => {
    it('should append a new element', () => {
      const parent = createDiv() |> append(createDiv());

      expect(parent.childNodes).toHaveLength(1);
    });

    it('should append multiple elements', () => {
      const first = createDiv('first');
      const second = createDiv('second');
      const third = createDiv('third');
      const parent = createDiv() |> append(first, second, third);

      expect(parent.childNodes).toHaveLength(3);
      expect(parent.childNodes[0]).toEqual(first);
      expect(parent.childNodes[1]).toEqual(second);
      expect(parent.childNodes[2]).toEqual(third);
    });

    it('should chain to append multiple elements', () => {
      const first = createDiv('first');
      const second = createDiv('second');
      const third = createDiv('third');
      const parent =
        createDiv() |> append(first) |> append(second) |> append(third);

      expect(parent.childNodes).toHaveLength(3);
      expect(parent.childNodes[0]).toEqual(first);
      expect(parent.childNodes[1]).toEqual(second);
      expect(parent.childNodes[2]).toEqual(third);
    });
  });

  describe('prepend', () => {
    it('should prepend a new element', () => {
      const first = createDiv('first');
      const second = createDiv('second');
      const parent = createDiv() |> prepend(second) |> prepend(first);

      expect(parent.childNodes).toHaveLength(2);
      expect(parent.childNodes[0]).toEqual(first);
      expect(parent.childNodes[1]).toEqual(second);
    });

    it('should prepend multiple elements', () => {
      const first = createDiv('first');
      const second = createDiv('second');
      const third = createDiv('third');
      const parent = createDiv() |> prepend(third) |> prepend(first, second);

      expect(parent.childNodes).toHaveLength(3);
      expect(parent.childNodes[0]).toEqual(first);
      expect(parent.childNodes[1]).toEqual(second);
      expect(parent.childNodes[2]).toEqual(third);
    });

    it('should chain to prepend multiple elements', () => {
      const first = createDiv('first');
      const second = createDiv('second');
      const third = createDiv('third');
      const parent =
        createDiv() |> prepend(third) |> prepend(second) |> prepend(first);

      expect(parent.childNodes).toHaveLength(3);
      expect(parent.childNodes[0]).toEqual(first);
      expect(parent.childNodes[1]).toEqual(second);
      expect(parent.childNodes[2]).toEqual(third);
    });
  });

  describe('insertBefore', () => {
    it('should add a new element before an existing one', () => {
      const relative = createDiv('relative');
      const irrelevant = createDiv('irrelevant');
      const inserted = createDiv('inserted');
      const parent =
        createDiv()
        |> append(irrelevant)
        |> append(relative)
        |> insertBefore(relative, inserted);

      expect(parent.childNodes).toHaveLength(3);
      expect(parent.childNodes[0]).toEqual(irrelevant);
      expect(parent.childNodes[1]).toEqual(inserted);
      expect(parent.childNodes[2]).toEqual(relative);
    });

    it('should add multiple elements before an existing one', () => {
      const relative = createDiv('relative');
      const irrelevant = createDiv('irrelevant');
      const insertedFirst = createDiv('inserted-first');
      const insertedSecond = createDiv('inserted-second');
      const parent =
        createDiv()
        |> append(irrelevant)
        |> append(relative)
        |> insertBefore(relative, insertedFirst, insertedSecond);

      expect(parent.childNodes).toHaveLength(4);
      expect(parent.childNodes[0]).toEqual(irrelevant);
      expect(parent.childNodes[1]).toEqual(insertedFirst);
      expect(parent.childNodes[2]).toEqual(insertedSecond);
      expect(parent.childNodes[3]).toEqual(relative);
    });

    it('should chain to add multiple elements', () => {
      const relative = createDiv('relative');
      const irrelevant = createDiv('irrelevant');
      const insertedFirst = createDiv('inserted-first');
      const insertedSecond = createDiv('inserted-second');
      const parent =
        createDiv()
        |> append(irrelevant)
        |> append(relative)
        |> insertBefore(relative, insertedFirst)
        |> insertBefore(relative, insertedSecond);

      expect(parent.childNodes).toHaveLength(4);
      expect(parent.childNodes[0]).toEqual(irrelevant);
      expect(parent.childNodes[1]).toEqual(insertedFirst);
      expect(parent.childNodes[2]).toEqual(insertedSecond);
      expect(parent.childNodes[3]).toEqual(relative);
    });
  });

  describe('insertAfter', () => {
    it('should add a new element after an existing one', () => {
      const relative = createDiv('relative');
      const irrelevant = createDiv('irrelevant');
      const inserted = createDiv('inserted');
      const parent =
        createDiv()
        |> append(relative)
        |> append(irrelevant)
        |> insertAfter(relative, inserted);

      expect(parent.childNodes).toHaveLength(3);
      expect(parent.childNodes[0]).toEqual(relative);
      expect(parent.childNodes[1]).toEqual(inserted);
      expect(parent.childNodes[2]).toEqual(irrelevant);
    });

    it('should add multiple elements before an existing one', () => {
      const relative = createDiv('relative');
      const irrelevant = createDiv('irrelevant');
      const insertedFirst = createDiv('inserted-first');
      const insertedSecond = createDiv('inserted-second');
      const parent =
        createDiv()
        |> append(relative)
        |> append(irrelevant)
        |> insertAfter(relative, insertedFirst, insertedSecond);

      expect(parent.childNodes).toHaveLength(4);
      expect(parent.childNodes[0]).toEqual(relative);
      expect(parent.childNodes[1]).toEqual(insertedFirst);
      expect(parent.childNodes[2]).toEqual(insertedSecond);
      expect(parent.childNodes[3]).toEqual(irrelevant);
    });

    it('should chain to add multiple elements', () => {
      const relative = createDiv('relative');
      const irrelevant = createDiv('irrelevant');
      const insertedFirst = createDiv('inserted-first');
      const insertedSecond = createDiv('inserted-second');
      const parent =
        createDiv()
        |> append(relative)
        |> append(irrelevant)
        |> insertAfter(relative, insertedFirst)
        |> insertAfter(relative, insertedSecond);

      expect(parent.childNodes).toHaveLength(4);
      expect(parent.childNodes[0]).toEqual(relative);
      expect(parent.childNodes[1]).toEqual(insertedSecond);
      expect(parent.childNodes[2]).toEqual(insertedFirst);
      expect(parent.childNodes[3]).toEqual(irrelevant);
    });
  });

  describe('replace', () => {
    it('should replace a child with a new one', () => {
      const oldChild = createDiv('old');
      const newChild = createDiv('new');
      const parent =
        createDiv() |> append(oldChild) |> replace(oldChild, newChild);

      expect(parent.childNodes).toHaveLength(1);
      expect(parent.childNodes[0]).toEqual(newChild);
    });

    it('should chain to replace a child', () => {
      const firstOldChild = createDiv('first-old');
      const firstNewChild = createDiv('first-new');
      const secondOldChild = createDiv('second-old');
      const secondNewChild = createDiv('second-new');
      const parent =
        createDiv()
        |> append(firstOldChild)
        |> append(secondOldChild)
        |> replace(firstOldChild, firstNewChild)
        |> replace(secondOldChild, secondNewChild);

      expect(parent.childNodes).toHaveLength(2);
      expect(parent.childNodes[0]).toEqual(firstNewChild);
      expect(parent.childNodes[1]).toEqual(secondNewChild);
    });
  });

  describe('remove', () => {
    it('should remove a child element', () => {
      const child = createDiv('child');
      const parent = createDiv() |> append(child) |> remove(child);

      expect(parent.childNodes).toHaveLength(0);
    });

    it('should chain to remove children', () => {
      const firstChild = createDiv('first-child');
      const secondChild = createDiv('second-child');
      const parent =
        createDiv()
        |> append(firstChild)
        |> append(secondChild)
        |> remove(firstChild)
        |> remove(secondChild);

      expect(parent.childNodes).toHaveLength(0);
    });
  });

  describe('contains', () => {
    it('should return true if element is contained', () => {
      const contained = createDiv('contained');
      const result = createDiv() |> append(contained) |> contains(contained);

      expect(result).toBe(true);
    });

    it('should return false if element is not contained', () => {
      const contained = createDiv('contained');
      const result = createDiv() |> contains(contained);

      expect(result).toBe(false);
    });
  });

  describe('setAttribute', () => {
    it('should add a new attribute to an element', () => {
      const parent = createDiv() |> setAttribute('data-test', 'new value');

      expect(parent).toHaveAttribute('data-test', 'new value');
    });

    it('should chain to add new attributes', () => {
      const parent =
        createDiv()
        |> setAttribute('data-first', 'new value')
        |> setAttribute('data-second', 'other value');

      expect(parent).toHaveAttribute('data-first', 'new value');
      expect(parent).toHaveAttribute('data-second', 'other value');
    });
  });

  describe('getAttribute', () => {
    it('should return the value of the attribute', () => {
      const value =
        createDiv()
        |> setAttribute('data-test', 'new value')
        |> getAttribute('data-test');

      expect(value).toBe('new value');
    });
  });

  describe('addClass', () => {
    it('should add a class to an element', () => {
      const parent = createDiv() |> addClass('new-class');

      expect(parent).toHaveClass('new-class');
    });

    it('should chain to add classes', () => {
      const parent =
        createDiv() |> addClass('first-class') |> addClass('second-class');

      expect(parent).toHaveClass('first-class');
      expect(parent).toHaveClass('second-class');
    });

    it('should do nothing is class already exists', () => {
      const parent =
        createDiv() |> addClass('new-class') |> addClass('new-class');

      expect(parent).toHaveClass('new-class');
    });
  });

  describe('removeClass', () => {
    it('should remove a class from an element', () => {
      const parent = createDiv('new-class') |> removeClass('new-class');

      expect(parent).not.toHaveClass('new-class');
    });

    it('should chain to remove classes', () => {
      const parent =
        createDiv('first-class', 'second-class')
        |> removeClass('first-class')
        |> removeClass('second-class');

      expect(parent).not.toHaveClass('first-class');
      expect(parent).not.toHaveClass('second-class');
    });

    it('should do nothing if class is not present', () => {
      const parent = createDiv() |> removeClass('new-class');

      expect(parent).toHaveClass('my-div');
    });
  });

  describe('toggleClass', () => {
    it('should add a class if toggle is true', () => {
      const parent = createDiv() |> toggleClass('new-class', true);

      expect(parent).toHaveClass('new-class');
    });

    it('should remove a class if toggle is false', () => {
      const parent = createDiv('new-class') |> toggleClass('new-class', false);

      expect(parent).not.toHaveClass('new-class');
    });

    it('should do nothing if class exists and toggle is true', () => {
      const parent = createDiv('new-class') |> toggleClass('new-class', true);

      expect(parent).toHaveClass('new-class');
    });

    it('should do nothing if class does not exist if toggle is false', () => {
      const parent = createDiv() |> toggleClass('new-class', false);

      expect(parent).not.toHaveClass('new-class');
    });

    it('should remove class if class exists and no toggle provided', () => {
      const parent = createDiv('new-class') |> toggleClass('new-class');

      expect(parent).not.toHaveClass('new-class');
    });

    it('should add class if class does not exist and no toggle provided', () => {
      const parent = createDiv() |> toggleClass('new-class');

      expect(parent).toHaveClass('new-class');
    });
  });

  describe('on', () => {
    it('should add an event listener', () => {
      const handler = jest.fn();
      const parent = createDiv() |> on('click', handler);

      fireEvent.click(parent);

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should add multiple handlers with chain', () => {
      const firstHandler = jest.fn();
      const secondHandler = jest.fn();
      const parent =
        createDiv() |> on('click', firstHandler) |> on('click', secondHandler);

      fireEvent.click(parent);

      expect(firstHandler).toHaveBeenCalledTimes(1);
      expect(secondHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('off', () => {
    it('should remove an event listener', () => {
      const handler = jest.fn();
      const parent =
        createDiv() |> on('click', handler) |> off('click', handler);

      fireEvent.click(parent);

      expect(handler).toHaveBeenCalledTimes(0);
    });

    it('should remove multiple handlers with chain', () => {
      const firstHandler = jest.fn();
      const secondHandler = jest.fn();
      const parent =
        createDiv()
        |> on('click', firstHandler)
        |> on('click', secondHandler)
        |> off('click', firstHandler)
        |> off('click', secondHandler);

      fireEvent.click(parent);

      expect(firstHandler).toHaveBeenCalledTimes(0);
      expect(secondHandler).toHaveBeenCalledTimes(0);
    });
  });
});
