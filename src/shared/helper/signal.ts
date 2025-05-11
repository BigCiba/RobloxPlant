export class Signal<T> {
	_value: T;
	_subscribers: ((value: T) => void)[] = [];
	constructor(initialValue: T) {
		this._value = initialValue;
	}
	Get() {
		return this._value;
	}
	Set(newValue: T) {
		if (this._value !== newValue) {
			this._value = newValue;
			this.Notify();
		}
	}
	Connect(subscriber: (v: T) => void) {
		this._subscribers.push(subscriber);
		return {
			Disconnect: () => {
				const index = this._subscribers.indexOf(subscriber);
				if (index !== -1) {
					this._subscribers.remove(index);
				}
			},
		};
	}
	Notify() {
		for (const subscriber of this._subscribers) {
			task.spawn(subscriber, this._value);
		}
	}
}
