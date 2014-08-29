var Class;

Class = function Class (baseclass, prototype) {
	var constructor = function () {
		this.__construct.apply(this, arguments);
	};

	if (!prototype) {
		prototype = baseclass;
		baseclass = null;
	}

	if (baseclass) {
		constructor.superclass = baseclass;

		var emptyFunction =  function () {};
		emptyFunction.prototype = baseclass.prototype;

		constructor.prototype = new emptyFunction();
		constructor.prototype.constructor = constructor;
		constructor.prototype['super'] = function () {
			arguments = Array.prototype.slice.call(arguments); // cast
			var method = arguments.shift();

			return constructor.superclass.prototype[method].apply(this, arguments);
		};
	}

	for (k in prototype) {
		if (prototype.hasOwnProperty(k)) {
			constructor.prototype[k] = prototype[k];
		}
	}

	// Just for the lulz (as it is a non-standard property)
	constructor.__proto__ = Class.prototype;
	constructor.addStatics = Class.methods.addStatics;
	constructor.getStatic = Class.methods.getStatic;
	constructor.callStatic = Class.methods.callStatic;

	return constructor;
};

Class.methods = {
	addStatics: function (add) {
		for (k in add) {
			if (k !== 'prototype') {
				this[k] = add[k];
			}
		}

		return this;
	},
	getStatic: function (name) {
		var cur = this;

		while (cur && cur[name] === undefined) {
			cur = cur.superclass;
		}

		if (cur && cur[name]) {
			return cur[name];
		}
	},
	callStatic: function () {
		arguments = Array.prototype.slice.call(arguments); // cast
		var method = this.getStatic(arguments.shift());

		if (method) {
			return method.apply(this, arguments);
		} else {
			// error ?
		}
	}
};

// Backcompat
Class.create = Class;