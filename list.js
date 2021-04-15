'use strict';
let collapse = true; // toggles the expand or collapse logic

/** Checks if Elemetn has a class
   * @param {Element} element DOM Element
   * @param {string} className Class name to check
  */
function hasClass(element, className) {
  return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
}

/**
   * Toggles the visibility of child nodes
   * @param {MouseEvent} e Click Event
   */
function toggleRow(e) {

  let parent = e.target.parentElement;
  if (parent.title.includes('this branch')) {
    parent = e.target.parentElement.parentElement;
  }
  const UL = Array.from(parent.children).filter(x => x.nodeName === 'UL');
  const children = Array.from(UL[0].children).filter(x => x.nodeName === 'LI');
  children.forEach(element => {
    if (hasClass(element, 'visible')) {
      element.classList.remove('visible');
      element.classList.add('invisible');
    } else {
      element.classList.remove('invisible');
      element.classList.add('visible');
    }
  });
  if (parent.querySelector('span').title === 'Expand this branch') {
    parent.querySelector('i').innerText = 'remove';
    parent.querySelector('span').title = 'Collapse this branch';
  } else {
    parent.querySelector('i').innerText = 'add';
    parent.querySelector('span').title = 'Expand this branch';
  }
}

/** Creates new list object in the DOM
 * @param {HTMLElement} container The Element to append list to
 * @param {any[]} args Array of elements to make list
 */
function CreateList(container, args) {

  container.innerHTML = null;
  createSublist(container, args);
  addListeners();

  /**
     * Creates a list based off of object
     * @param {HTMLElement} container The Element to append list to
     * @param {any[]} args Array of elements to make list
    */
  function createSublist(container, args) {

    const ul = document.createElement('ul');

    for (let j = 0; j < args.length; j++) {

      const row = args[j];
      const li = document.createElement('li');
      li.classList.add('visible');
      const span = document.createElement('span');
      const text = document.createTextNode(row.text);

      span.appendChild(text);

      // if link is present, wraps span in a:href
      if (row.link) {
        const a = document.createElement('a');
        a.href = row.link;
        a.setAttribute('target', '_blank');
        a.appendChild(span);
        li.appendChild(a);
      } else {
        li.appendChild(span);
      }

      // if material icon is present, adds it span
      if (row.icon) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(row.icon));
        div.classList.add('material-icons');
        span.prepend(div);
      }

      const nodes = row.nodes;
      if (nodes && nodes.length) {
        createSublist(li, nodes);
      }

      ul.appendChild(li);
    }

    container.appendChild(ul);

  }

  /**
     * adds listener to all lists that have child nodes
     */
  function addListeners() {
    const ul = Array.from(document.querySelectorAll('.tree ul > li > ul'));
    if (ul) {
      ul.forEach(element => {
        element.parentElement.classList.add('parent_li');
        element.parentElement.querySelector('span').title = 'Collapse this branch';
        const i = document.createElement('i');
        i.classList.add('material-icons');
        i.innerText = 'remove';
        i.classList.add('mr-2');
        element.parentElement.querySelector('span').prepend(i);
        element.parentElement.querySelector('span').addEventListener('click', toggleRow);
      });
    }
  }

};

const data = [
  {
    'text': 'Example.com',
    'link': 'http://example.com',
    'icon': 'settings'
  },
  {
    'text': 'Github',
    'icon': 'code',
    'nodes': [
      {
        'text': 'VSCode',
        'link': 'https://github.com/microsoft/vscode'
      },
      {
        'text': 'Hashicorp',
        'nodes': [
          {
            'text': 'Vagrant',
            'link': 'https://github.com/hashicorp/vagrant'
          },
          {
            'text': 'Terraform',
            'link': 'https://github.com/hashicorp/terraform'
          }
        ]
      },
      {
        'text': 'Linux',
        'link': 'https://github.com/torvalds/linux'
      }
    ]
  },
  {
    'text': 'Environments',
    'nodes': [
      {
        'text': 'Test',
        'link': 'http://test.example.com'
      },
      {
        'text': 'QA',
        'link': 'http://qa.example.com'
      },
      {
        'text': 'Production',
        'icon': 'info',
        'nodes': [
          {
            'text': 'Pre-Production',
            'link': 'http://staging.example.com'
          },
          {
            'text': 'Production',
            'link': 'http://example.com'
          }
        ]
      }
    ]
  },
  {
    'text': 'Notes',
    'icon': 'notes',
    'nodes': [
      {
        'text': 'Note 1',
        'link': 'http://example.com/note1'
      },
      {
        'text': 'Note 2',
        'link': 'http://example.com/note2'
      }
    ]
  }
];

window.addEventListener('load', function () {
  const list = document.getElementById('list');
  if (list) {
    CreateList(list, data);
  }

  const str = JSON.stringify(data, null, 2);
  document.getElementById('data').value = str;
})

document.getElementById('button').addEventListener('click', () => {
  const emptyList = document.getElementById('list');

  let newData = document.getElementById('data').value;
  try {
    newData = JSON.parse(newData);
    CreateList(emptyList, newData);
  } catch (error) {
    console.log(error);
    emptyList.innerHTML = error;
  }

});

document.getElementById("expand").addEventListener("click", function () {

  // updates display property for each element
  const li = Array.from(document.querySelectorAll(".tree ul > li ul > li"));
  li.forEach(element => {
    if (collapse) {
      element.classList.add("invisible")
      element.classList.remove("visible");
    } else {
      element.classList.remove("invisible");
      element.classList.add("visible")
    }
  });

  // updates plus and minus signs
  const material = Array.from(document.querySelectorAll(".tree li > span > i"));
  material.forEach(element => {
    if (hasClass(element, "material-icons")) {
      element.innerText = collapse ? 'add' : 'remove';
      element.parentElement.title = collapse ? 'Expand this branch' : 'Collapse this branch';
    }
  });
  document.getElementById("expand").innerText = collapse ? "Expand List" : "Collapse List";
  collapse = !collapse;
})