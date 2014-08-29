
var AbstractBinderClass = new Class({
	bind: function (elm, eventName, handlerName) {
		if (!this.constructor.handlers) {
			this.constructor.handlers = {};
		}

		if (!this.constructor.handlers[handlerName]) {
			this.constructor.handlers[handlerName] = function (event) {
				event.data[handlerName].apply(event.data, arguments);
			}
		}

		elm.on(eventName, this, this.constructor.handlers[handlerName]);
	},

	unbind: function (elm, eventName, handlerName) {
		if (this.constructor.handlers && this.constructor.handlers[handlerName]) {
			elm.off(eventName, this.constructor.handlers[handlerName]);
		}
	}
});