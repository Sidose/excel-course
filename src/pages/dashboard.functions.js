import {storage} from '@core/utils';

function toHTML(key) {
  const id = key.split(':')[1]
  const model = storage(key)
  return `
    <li class="db__record">
      <a href="#excel/${id}">${model.title}</a>
      <strong>
        ${new Date(model.openedDate).toLocaleDateString()}
        ${new Date(model.openedDate).toLocaleTimeString()}
      </strong>
    </li>
  `
}

function getAllKeys() {
  const keys = []
  for (let i = 0; i < localStorage.length; ++i) {
    const key = localStorage.key(i)
    if (!key.includes('excel')) {
      continue
    }
    keys.push(key)
  }

  return keys
}

export function createRecordsTable() {
  const keys = getAllKeys()
  if (!keys.length) {
    return `<p>Nothing is created yet</p>`
  } else {
    return `
    <div class="db__list-header">
      <span>Name</span>
      <span>Open date</span>
    </div>
    <ul class="db_list">
      ${ keys.map(toHTML).join('') } 
    </ul>
    `
  }
}