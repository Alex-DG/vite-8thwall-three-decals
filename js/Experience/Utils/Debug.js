import { colorToObjectRgbString } from '@tweakpane/core'
import { Pane } from 'tweakpane'

class DebugPane_ {
  constructor() {
    this.pane = new Pane()
  }

  addButton(params, callback) {
    this.pane.addButton(params).on('click', () => {
      callback()
    })
  }

  addSlider(obj, name, params, callback = null) {
    if (callback) {
      this.pane.addInput(obj, name, params).on('change', ({ value }) => {
        callback(value)
      })
    } else {
      this.pane.addInput(obj, name, params)
    }
  }

  addColorPicker(obj, name, params, callback) {
    this.pane.addInput(obj, name, params).on('change', ({ value }) => {
      callback(value)
    })
  }
}

const DebugPane = new DebugPane_()
export default DebugPane
