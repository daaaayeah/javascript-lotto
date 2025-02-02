import { reducer } from './reducer';

class Store {
  constructor(initialState) {
    this.subscribers = [];
    this.state = initialState;
  }

  getState() {
    return this.state;
  }

  subscribe(component) {
    this.subscribers.push(component);
  }

  dispatch(action) {
    this.state = reducer(this.getState(), action);
    this.subscribers.forEach((subscriber) => {
      subscriber.notify();
    });
  }
}

export default Store;
