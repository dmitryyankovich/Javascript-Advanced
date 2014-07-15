function Task3() {

    this.partial = function(fn) {
        var argsImplicit = Array.prototype.slice.call(arguments, 1);

        return function () {
            var argsExplicit = Array.prototype.slice.call(arguments);
            return fn.apply(null, argsImplicit.concat(argsExplicit));
        };
    };
    
    this.curry = function (fn, countRequiredArgs) {
        var args = [];
        return function curryN(arg) {
            args.push(arg);
            if (args.length != countRequiredArgs) {
                return curryN;
            } else {
                var result = fn.apply(null, args);
                args = [];
                return result;
            }
        };
    };
        
        
    this.linearFold = function (array, callback, initialValue) {
        var previousValue = 0;

        if (initialValue) {
            previousValue = initialValue;
        }
        for (var i = 0, length = array.length; i < length; i++) {
            previousValue = callback(previousValue, array[i], i, array);
        }
        return previousValue;
    };

    this.linearUnfold = function (callback, initialStateValue) {
        var currentState = 0;

        if (initialStateValue){
            currentState = initialStateValue;
        }
        var result = [];
        var returnedValue;
        while (returnedValue = callback(currentState)) {
            result.push(returnedValue.value);
            currentState = returnedValue.state;
        }
        return result;
    };

    this.map = function (array, callback) {
        var newArray = [];

        for (var i = 0, length = array.length; i < length; i++) {
            newArray[i] = callback(array[i]);
        }
        return newArray;
    };

    this.filter = function filter(array, callback) {
        var newArray = [];

        for (var i = 0, length = array.length; i < length; i++) {
            if (callback(array[i])) {
                newArray.push(array[i]);
            }
        }
        return newArray;
    };

    this.averageOfEvenOnes = function (array) {
        var arrayOfOnes = this.filter(array, function(item) {
            return item % 2 != 0;
        });

        var sum = this.linearFold(arrayOfOnes, function(previousValue, currentValue, index, array) {
            return previousValue + currentValue;
        });
        return sum / arrayOfOnes.length;
    };

    this.sumOfRandomNumbers = function (minValue, maxValue) {
        var randomArray = this.linearUnfold(function(initialState) {
            if (initialState >= 10) {
                return false;
            }
            var randomValue = Math.random() * (maxValue - minValue) + minValue;
            return { value: randomValue, state: initialState + 1 };
        });
        return this.linearFold(randomArray, function(previousValue, currentValue, index, array) {
            return previousValue + currentValue;
        });
    };

    this.first = function (array, callback) {
        for (var i = 0; i < array.length; i++) {
            if (callback(array[i])) {
                return array[i];
            }
        }
        return null;
    };

    this.lazy = function (fn){
        var args = Array.prototype.slice.call(arguments, 1);

        var lazied = function () {
            return fn.apply(this, args);
        };

        return lazied;
    };

    this.memoize = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments),
                hash = "",
                i = args.length;
            var currentArg = null;
            while (i--) {
                currentArg = args[i];
                hash += (currentArg === Object(currentArg)) ? JSON.stringify(currentArg) : currentArg;
                fn.memoize || (fn.memoize = {});
            }
            return (hash in fn.memoize) ? fn.memoize[hash] : fn.memoize[hash] = fn.apply(this, args);
        };
    }
}
