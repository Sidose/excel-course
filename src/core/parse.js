export function parse(value = '') {
  value = value.toString()
  if (value[value.length-1] === '+') {
    value = value.slice(0, -1)
  }

  if (value.startsWith('=')) {
    try {
      return eval(value.slice(1))
    } catch (e) {
      return value
    }
  }
  return value
}