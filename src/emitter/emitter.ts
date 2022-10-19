interface cbFunc {
  (data: any): any;
}

type Events = { eventName: 'User:Create', payload: { name: string } } | { eventName: 'User:Update', payload: { id: number } };

export class Emitter {
  private static events: {};

  constructor() {
  }

  public static subscribe(eventName: string, fn: cbFunc) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  }

  public static publish(event: Events) {
    if(this.events[event.eventName]) {
      this.events[event.eventName].forEach((func: cbFunc) => {
        func(event.payload);
      });
    }
  }

  public static unsubscribe(eventName: string, func: cbFunc) {
    if (this.events[eventName]) {
      for (let i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === func) {
          this.events[eventName].splice(i, 1);
          break;
        }
      }
    }
  }
}


Emitter.publish({ eventName: 'User:Create', payload: { name: '123 '}})