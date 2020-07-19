import {ExcelComponent} from '@core/ExcelComponent';
import {createTable} from '@/components/table/table.template';
import {parse} from '@core/parse';
import {resizeHandler} from './table.resize'
// eslint-disable-next-line max-len
import {isCell, matrix, nextSelector, shouldResize} from './table.functions';
// import {storage} from '@core/utils';
import {TableSelection} from '@/components/table/TableSelection';
import * as actions from '@/redux/actions'
import {$} from '@core/dom';
import {defaultStyles} from '@/constants';

export class Table extends ExcelComponent {
  static className = 'excel__table';

  constructor($root, options) {
    super($root, {
      name: 'Table',
      listeners: ['input', 'keydown', 'mousedown', 'mousemove', 'mouseup'],
      ...options
    })
  }

  toHTML() {
    return createTable(20, this.store.getState());
  }

  init() {
    super.init()

    this.selectCell(this.$root.find('[data-id="0:0"]'))

    this.$on('formula:input', (value) => {
      // eslint-disable-next-line max-len
      this.selection.current
          .attr('data-value', value)
          .text(parse(value))

      this.updateTextInStore(value)
    })

    this.$on('formula:done', () => {
      this.selection.current.focus()
    })

    this.$on('toolbar:applyStyle', value => {
      this.selection.applyStyle(value)
      this.$dispatch(actions.applyStyle({
        value,
        ids: this.selection.selectedIds
      }))
    })
  }

  selectCell($cell) {
    this.selection.select($cell)
    this.$emit('table:select', $cell)
    const styles = $cell.getStyles(Object.keys(defaultStyles))
    this.$dispatch(actions.changeStyles(styles))
  }

  onInput(event) {
    this.updateTextInStore($(event.target).text())
  }

  onKeydown(event) {
    const keys = [
      'Enter',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'ArrowDown',
      'ArrowUp'
    ]

    const {key} = event
    if (keys.includes(key) && !event.shiftKey) {
      event.preventDefault()
      const id = this.selection.current.id(true)
      const $next = this.$root.find(nextSelector(key, id));
      this.selectCell($next)
    }
  }

  async resizeTable(event) {
    try {
      const data = await resizeHandler(this.$root, event)
      this.$dispatch(actions.tableResize(data))
    } catch (e) {
      console.warn('Resize error', e.message)
    }
  }

  onMousedown(event) {
    if (shouldResize(event)) {
      this.resizeTable(event)
    } else if (isCell(event)) {
      const $target = $(event.target)
      if (event.shiftKey) {
        const $cells = matrix($target, this.selection.current)
            .map(id => this.$root.find(`[data-id="${id}"]`))
        this.selection.selectGroup($cells)
      } else {
        this.selectCell($target)
      }
    }
  }

  onMousemove(event) {
  }

  onMouseup(event) {
  }

  prepare() {
    this.selection = new TableSelection()
  }

  updateTextInStore(value) {
    this.$dispatch(actions.changeText({
      id: this.selection.current.id(),
      value
    }))
  }
}