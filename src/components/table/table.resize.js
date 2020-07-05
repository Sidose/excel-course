import {$} from '@core/dom'

export function resizeHandler($root, event) {
  // eslint-disable-next-line no-undef
  const $resizer = $(event.target)
  const $parent = $resizer.closest('[data-type="resizable"]')
  const coords = $parent.getCoords()
  const type = $resizer.data.resize
  const sideProp = type === 'col' ? 'bottom' : 'right'
  let value

  $resizer.css({
    opacity: 1,
    [sideProp]: '-5000px'
  });

  document.onmousemove = e => {
    if (type === 'col') {
      const delta = e.pageX - coords.right
      value = coords.width + delta
      $resizer.css({right: -delta + 'px'})
    } else {
      const delta = e.pageY - coords.bottom
      value = coords.height + delta
      $resizer.css({bottom: -delta + 'px'})
    }
  }

  document.onmouseup = e => {
    document.onmousemove = null
    document.onmouseup = null

    if (type === 'col') {
      $parent.css({'width': value + 'px'})
      const delta = e.pageX - coords.right
      const value = coords.width + delta
      $root.findAll(`[data-col="${$parent.data.col}"]`)
          .forEach(el => $(el).css({'width': value + 'px'}))
    } else {
      $parent.css({height: value + 'px'})
    }

    $resizer.css({
      bottom: 0,
      right: 0,
      opacity: 0
    });
  }
}

export function selectMultiple($root, event, selectionObject) {
  const cellFirstId = event.target.dataset.id;

  document.onmouseup = e => {
    document.onmousemove = null
    document.onmouseup = null
    const cellLastId = e.target.dataset.id;

    const [firstX, firstY] = cellFirstId.split(':');
    const [lastX, lastY] = cellLastId.split(':');

    if (!lastX || !lastY) {
      return
    }

    const xMin = +firstX < +lastX ? firstX : lastX;
    const xMax = xMin === firstX ? lastX : firstX;
    const yMin = +firstY < +lastY ? firstY : lastY;
    const yMax = yMin === firstY ? lastY : firstY;
    const groupCell = [];

    console.log(xMin, xMax, yMin, yMax)
    for (let x = parseInt(xMin); x <= parseInt(xMax); ++x) {
      for (let y = parseInt(yMin); y <= parseInt(yMax); ++y) {
        console.log('x:y', x, y)
        const $el = $root.find(`[data-id="${x}:${y}"]`)
        groupCell.push($el)
      }
    }
    selectionObject.selectGroup(groupCell)
    console.log(selectionObject.group)
  }
}
