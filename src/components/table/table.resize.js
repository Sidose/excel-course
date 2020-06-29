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
