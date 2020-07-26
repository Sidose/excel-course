export class Store {
  constructor(rootReducer, initialState) {
    this.rootReducer = rootReducer;
    this.initialState = initialState || {}
    this.state = rootReducer({...this.initialState}, {type: '__INIT__'})
    this.listeners = []
  }

  subscribe(fn) {
    this.listeners.push(fn)
    return {
      unsubscribe() {
        if (this.listeners) {
          this.listeners = this.listeners.filter(listener => listener !== fn)
        }
      }
    }
  }

  dispatch(action) {
    this.state = this.rootReducer(this.state, action)
    this.listeners.forEach(listener => listener(this.state))
  }

  getState() {
    return JSON.parse(JSON.stringify(this.state))
  }
}