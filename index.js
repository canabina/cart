class EventEmmiter {

    constructor (...args) {
        this._subscribers = {};
    }

    emit (...params) {
        let [eventName, ...data] = params,
            subscribers = this._subscribers[eventName];
        if (!Array.isArray(subscribers)) return ;
        subscribers.map(func => ((typeof func == 'function') ? func(...data) : false));
    }

    subscribe (...params) {
        let [eventName, callback] = params;
        if (!this._subscribers[eventName])
            this._subscribers[eventName] = [];
        this._subscribers[eventName].push(callback);
        return this.unsubscribe.bind(this, eventName, (this._subscribers[eventName].length - 1));
    }

    unsubscribe(eventName, index) {
        if (!Array.isArray(this._subscribers[eventName])) return ;
        this._subscribers[eventName].splice(index, 1);
    }
}


class Cart {

    constructor (...args) {
        this.count = 0;
        [this.validations, this.evnets] = args;
        if (!this.evnets && EventEmmiter) this.evnets = new EventEmmiter;
        this._items = {};
    }

    static getEventsNames () {
        return {
            ON_ADD_ITEM: 'ON_ADD_ITEM',
            ON_GET_ITEM: 'ON_GET_ITEM',
            ON_REMOVE_ITEM: 'ON_REMOVE_ITEM'
        }
    }

    add (...items) {
        let added = items.map(item => this._items[this.count++] = item);
        this.evnets.emit(Cart.getEventsNames().ON_ADD_ITEM, added);
    }

    get (id = false) {
        let items = id !== false ? this._items[id] : this._items;
        this.evnets.emit(Cart.getEventsNames().ON_GET_ITEM, items);
        return items;
    }

    remove (id = false) {
        let removedItems = this.get(id);

        if (id === false) this._items = {};
        if (id) delete this._items[id];

        this.evnets.emit(Cart.getEventsNames().ON_REMOVE_ITEM, removedItems);
        return removedItems;
    }

}

const cartEventEmmiter = new EventEmmiter();

const basket = new Cart({
    maxItems: 6,
    maxTotalPrice: 300,
    minItems: 2,
}, cartEventEmmiter);



let unsubscriber = cartEventEmmiter.subscribe(Cart.getEventsNames().ON_ADD_ITEM, console.log);

basket.add({name: 'Пылесос', items: 2, price: 10});
basket.add({name: 'Пылесос', items: 2, price: 11});
basket.add({name: 'Пылесос', items: 2, price: 12});

basket.remove(2);

// console.log(basket.get());





