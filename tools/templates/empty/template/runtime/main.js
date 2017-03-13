/**
 * birdge for rt2 & WebGL
 * @author: shawn xie
 **/

console.log("native version" + egret_native.getVersion());

// window has console.log() & setTimeout() method
var window = this;
var self = this;

function setTimeout(callback, time)
{
    egret_native.addTimer(callback, time, false);
}

function setInterval(callback, time)
{
    egret_native.addTimer(callback, time, true);
}

function clearTimeout(id)
{
    egret_native.removeTimer(id);
}

function clearInterval(id)
{
    egret_native.removeTimer(id);
}

// fake HTMLElement
(function(window) {
    window.HTMLElement = function(tagName) {
        this.tagName = tagName.toUpperCase();
        this.children = [];
        this.style = {};
        // for egret
        this["data-entry-class"] = "Main";
        this.clientWidth = window.innerWidth;
        this.clientHeight = window.innerHeight;
    }

    HTMLElement.prototype.appendChild = function(element) {
        this.children.push(element);
    }

    HTMLElement.prototype.insertBefore = function(newElement, existingElement) {
        // Just append; we don't care about order here
        this.children.push(newElement);
    }

    HTMLElement.prototype.removeChild = function(node) {
        for (var i = this.children.length; i--;) {
            if (this.children[i] === node) {
                this.children.splice(i, 1);
            }
        }
    }

    HTMLElement.prototype.getBoundingClientRect = function() {
        return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    HTMLElement.prototype.setAttribute = function(attr, value) {
        this[attr] = value;
    }

    HTMLElement.prototype.getAttribute = function(attr) {
        return this[attr];
    }

    HTMLElement.prototype.addEventListener = function(event, method){
        if (event === 'load') {
            this.onload = method;
        }
    };

    HTMLElement.prototype.removeEventListener = function(event, method){
        if (event === 'load') {
            this.onload = undefined;
        }
    };

    window.HTMLInputElement = window.HTMLDivElement = window.HTMLImageElement = window.HTMLVideoElement = window.HTMLElement;
})(this);



(function(window) {
    window.Event = function (type) {
        this.type = type;
        this.cancelBubble = false;
        this.cancelable = false;
        this.target = null;
        // this.timestamp = ej.performanceNow();
        this.timestamp = null;
        
        this.initEvent = function (type, bubbles, cancelable) {
            this.type = type;
            this.cancelBubble = bubbles;
            this.cancelable = cancelable;
            // this.timestamp = ej.performanceNow();
            this.timestamp = null;
        };

        this.preventDefault = function () {};
        this.stopPropagation = function () {};
    };

    window.Event.prototype.initCustomEvent = function (type, canBubble, cancelable, detail) {
        this.type = type;
        console.log("initCustomEvent type=" + type);
    }
})(this);

// extends window
(function(window) {
    // extends innerHeight & innerWidth
    window.innerHeight = egret_native.getDeviceHeight();
    window.innerWidth = egret_native.getDeviceWidth();

    // extends pageXOffset & pageYOffset
    window.pageXOffset = 0;
    window.pageYOffset = 0;

    // extends clientLeft & clientTop
    window.clientLeft = 0;
    window.clientTop = 0;

    // extends screen
    window.screen = {
        availWidth: window.innerWidth,
        availHeight: window.innerHeight
    };

    // extends devicePixelRatio
    window.devicePixelRatio = 1;

    // extends DOMParser
    window.DOMParser = function() {};

    // extends URL
    window.URL = {
        createObjectURL: function(blob) {
            return blob;
        },
        revokeObjectURL: function(blob) {}
    };

    window.location = {
        hostname : "redmine",
        pathname : "",
        reload : function() {
        }
    }

    // extends navigator
    window.navigator = {
        language: "zh-CN",
        //TODO
        userAgent: "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Mobile Safari/537.36"
    };

    // extends canvas
    window.WebGLRenderingContext = {};
    window.canvas = new egret_native.Canvas(window.innerWidth, window.innerHeight);
    window.canvas.style = {};
    egret_native.setVisibleRect(0, 0, window.innerWidth, window.innerHeight);
    egret_native.setDesignSize(window.innerWidth, window.innerHeight);

    // extends Image
    window.Image = egret_native.RawImage;

    // extends document
    window.document = {
        readyState: "complete",
        documentElement: window,
        visibilityState: "visible",
        hidden: false,
        style: {},

        head: new HTMLElement("head"),
        body: new HTMLElement("body"),

        createElement: function(tagName) {
            if (tagName == "canvas") {
                return window.canvas;
            } else if (tagName == "img") {
                return new window.Image();
            } else {
                return new HTMLElement(tagName);
            }
        },

        getElementById: function(id) {
            if (id === "canvas") {
                return window.canvas;
            }
            return this.body;
        },

        getElementsByTagName: function() {
            return [this.body];
        },

        getElementsByClassName: function() {
            return [this.body];
        },

        // for egret
        querySelectorAll: function() {
            return [this.body];
        },

        createEvent: function (type) { 
            var evt = new window.Event(type);
            if(type === "CustomEvent")
            {
                evt.initCustomEvent();
            }
            return evt;
        },

        eventMap: {},

        addEventListener: function(type, callback, useCapture) {
            if (type == 'DOMContentLoaded') {
                setTimeout(callback, 1);
                return;
            }

            if (!this.eventMap[type]) {
                this.eventMap[type] = [];
            }

            this.eventMap[type].push(callback);
        },

        removeEventListener: function(type, callback) {
            var listeners = this.eventMap[type];
            if (!listeners) {
                return;
            }

            for (var i = listeners.length; i--;) {
                if (listeners[i] === callback) {
                    listeners.splice(i, 1);
                }
            }
        },

        dispatchEvent: function(event) {
            if(event.type == 'keyup' && window.onkeypress !== null) {
                window.onkeypress(event);
            }
            var listeners = this.eventMap[event.type];
            if (!listeners) {
                return;
            }

            for (var i = 0; i < listeners.length; i++) {
                listeners[i](event);
            }
        }
    };

    window.canvas.parentElement = window.document.body;
    window.canvas.addEventListener = window.addEventListener = function(type, callback) {
        window.document.addEventListener(type, callback);
    };

    window.canvas.removeEventListener = window.removeEventListener = function(type, callback) {
        window.document.removeEventListener(type, callback);
    };

    window.dispatchEvent = function(event) {
        window.document.dispatchEvent(event);
    }

    window.canvas.getBoundingClientRect = function() {
        return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight
        };
    };
})(this);

// extends TouchEvent
(function(window) {
    var touchEvent = {
        type: 'touchstart',
        target: window.canvas,
        currentTarget: window.canvas,
        touches: null,
        targetTouches: null,
        changedTouches: null,
        timestamp: 0,
        preventDefault: function() {},
        stopPropagation: function() {},

        pageX: 0,
        pageY: 0
    };

    var mouseEvent = {
        type: 'mousedown',

        identifier: 0,
        button: null,
        buttons: null,

        clientX: 0,
        clientY: 0,
        screenX: 0,
        screenY: 0,

        pageX: 0,
        pageY: 0
    }

    var keyEvent = {
        type: 'keydown',
        key: null,
        keyCode: null
    }

    var dispatchTouchEvent = function(type, num, ids, xs_array, ys_array) {
        var all = [];

        for (var i = 0; i < num; i++) {
            var id = ids[i];
            var x = xs_array[i];
            var y = ys_array[i];

            // TODO this object can be cache
            all.push({
                identifier: id,
                screenX: x,
                screenY: y,
                clientX: x,
                clientY: y,
                pageX: x,
                pageY: y,
                radiusX: 2,
                radiusY: 2,
                rotationAngle: 0,
                force: 1,
                target: window.canvas
            });

            if (i === 0) {
                touchEvent.pageX = x;
                touchEvent.pageY = y;
            }
        }

        touchEvent.touches = all;
        touchEvent.targetTouches = all;
        touchEvent.changedTouches = all; // TODO only changed points
        touchEvent.type = type;

        document.dispatchEvent(touchEvent);
    };


    var dispatchMouseEvent = function(type, num, ids, xs_array, ys_array) {
        for (var i = 0; i < num; i++) {
            var id = ids[i];
            var x = xs_array[i];
            var y = ys_array[i];

            mouseEvent.type = type;
            mouseEvent.clientX = x;
            mouseEvent.clientY = y;
            mouseEvent.screenX = x;
            mouseEvent.screenY = y;

            document.dispatchEvent(mouseEvent);
        }
    }

	// intptr_t ids[4] = { key, scancode, action, mods };
    var dispatchKeyEvent = function(type, num, ids, xs_array, ys_array) {
        keyEvent.type = type;
        keyEvent.key = ids[0];
        keyEvent.keyCode = ids[1];
    }

    // native touch function returns: num, ids, xs_array, ys_array
    egret_native.touchDown = dispatchTouchEvent.bind(window, "touchstart");
    egret_native.touchMove = dispatchTouchEvent.bind(window, "touchmove");
    egret_native.touchUp = dispatchTouchEvent.bind(window, "touchend");
    egret_native.touchCancel = dispatchTouchEvent.bind(window, "touchcancel");

    egret_native.mouseDown = dispatchMouseEvent.bind(window, "mousedown");
    egret_native.mouseMove = dispatchMouseEvent.bind(window, "mousemove");
    egret_native.mouseUp = dispatchMouseEvent.bind(window, "mouseup");
    egret_native.mouseWheel = dispatchMouseEvent.bind(window, "mousewheel");

    egret_native.keyDown = dispatchMouseEvent.bind(window, "keydown");
    egret_native.keyUp = dispatchMouseEvent.bind(window, "keyup");

})(this);

// extends Blob 
(function() {
    var Blob = function Blob(array, options) {
        this.type = options ? options.type : "image/png";
        this.data = (array[0] instanceof ArrayBuffer) ? array[0] : new ArrayBuffer(array[0]); 
    }
    window.Blob = Blob;
})(window);

// extends XMLHttpRequest
(function() {
    function isNetUrl(url) {
        return url.indexOf("http://") != -1 || url.indexOf("HTTP://") != -1;
    }

    var progressEvent = {
        lengthComputable: false,
        loaded: 0,
        total: null
    }

    var errorEvent = {
        colno: 0,
        error: 0,
        filename: null,
        lineno: 0,
        message: null 
    }     

    var XMLHttpRequest = function() {
        this.responseHeader = "";
        this.response = null;
        this.responseText = "";
        this.status = 0;
        this.readyState = 0;

        this.responseType = "";
        this.withCredentials = undefined;
        this._url = "";
        this._method = "";
        this.headerObj = undefined;

        this.onreadystatechange = function() {};
        this.updateProgress = function() {};
        this.onprogress = function(e) {};
        this.onload = function(e) {};
        this.onerror = function(e) {};
    };

    XMLHttpRequest.prototype.setRequestHeader = function(key, value) {
        if (!this.headerObj) {
            this.headerObj = {};
        }
        this.headerObj[key] = value;
    }

    XMLHttpRequest.prototype.open = function(method, url, _async) {
        this._url = url;

        this._method = method;

        this.status = 0;
        this.readyState = 1;
        this.onreadystatechange({
            target: this
        });
    }

    XMLHttpRequest.prototype.send = function(data) {
        var self = this;


        var progressEvent = {};
        progressEvent.total = 1;
        progressEvent.loaded = 0;
        self.onprogress(progressEvent);

        if (this.responseType === "blob") {
            self.status = 0;
            self.readyState = 2;
            self.onreadystatechange({
                target: self
            });
            self.onreadystatechange({
                target: self
            });


            self.status = 200;
            self.readyState = 3;
            self.onreadystatechange({
                target: self
            });
            self.onprogress({
                target: self
            });

            self.response = self._url;
            self.responseText = self._url;

            self.states = 200;
            self.readyState = 4;
            self.onreadystatechange({
                target: self
            });
            self.onload({
                target: self
            });

            return;
        }

        if (isNetUrl(this._url)) {
            var urlData = {};
            urlData.type = this._method;
            if (this._method === "POST" && data) {
                if (data instanceof ArrayBuffer) {
                    urlData.data = data;
                } else {
                    urlData.data = data.toString();
                }
            }
            if (this.resposeType === "arraybuffer") {
                urlData.binary = true;
            } else {
                urlData.binary = false;
            }
            if (this.headerObj) {
                urlData.header = JSON.stringify(this.headerObj);
            }
            var promise = egret.PromiseObject.create();
            promise.onSuccessFunc = function (response) {
                self.response = response;
                self.responseText = response;

                self.states = 200;
                self.readyState = 4;
                self.onreadystatechange({
                    target: self
                });
                self.onload({
                    target: self
                });

                var progressEvent = {};
                progressEvent.total = 1;
                progressEvent.loaded = 1;
                self.onprogress(progressEvent);
            }
            promise.onErrorFunc = function (errCode) {
                self.states = errCode;
                self.readyState = 4;
                self.onreadystatechange({
                    target: self
                });
                errorEvent.colno = 0;
                errorEvent.error = errCode;
                errorEvent.filename = self._url;
                errorEvent.lineno = 0;
                errorEvent.message = null;

                self.onerror(errorEvent);
            }
            promise.onResponseHeaderFunc = function (headers) {
                self.responseHeader = "";
                var obj = JSON.parse(headers);
                for (var key in obj) {
                    self.responseHeader += key + ": " + obj[key] + "\r\n";
                }

                self.status = 0;
                self.readyState = 2;
                self.onreadystatechange({
                    target: self
                });
            }
            egret_native.requestHttp(this._url, urlData.type, urlData.header ? urlData.header : "", urlData.data ? urlData.data : "", urlData.binary, promise);
        } else {
            var checkLocalUrl = function(url) {
                return url.split('?')[0];
            }
            var localurl = checkLocalUrl(this._url);
            var promise = {
                onSuccess: function(response) {
                    // self.status = 0;
                    // self.readyState = 2;
                    // self.onreadystatechange({target: self});
                    //
                    // self.status = 200;
                    // self.readyState = 3;
                    // self.onreadystatechange({target: self});
                    // self.onprogress({target: self});

                    self.response = response;
                    self.responseText = response;

                    self.states = 200;
                    self.readyState = 4;
                    self.onreadystatechange({
                        target: self
                    });
                    self.onload({
                        target: self
                    });

                    var progressEvent = {};
                    progressEvent.total = 1;
                    progressEvent.loaded = 1;
                    self.onprogress(progressEvent);
                },
                onError: function(errCode) {
                    // self.status = 0;
                    // self.readyState = 2;
                    // self.onreadystatechange({target: self});
                    //
                    // self.status = 200;
                    // self.readyState = 3;
                    // self.onreadystatechange({target: self});

                    self.states = errCode;
                    self.readyState = 4;
                    self.onreadystatechange({
                        target: self
                    });
                }
            };
            if (this.responseType === "arraybuffer") {
                egret_native.readFileAsync(localurl, promise, "ArrayBuffer");
            } else {
                egret_native.readFileAsync(localurl, promise);
            }
        }
    }

    XMLHttpRequest.prototype.abort = function() {
        this.responseHeader = "";
        this.response = null;
        this.responseText = "";
        this.status = 0;
        this.readyState = 0;

        this.responseType = null;
        this.withCredentials = undefined;
        this._url = "";
        this._method = "";
        this.headerObj = undefined;
    }

    XMLHttpRequest.prototype.getResponseHeader = function(key, value) {
        return "";
    }

    XMLHttpRequest.prototype.getAllResponseHeaders = function() {
        return this.responseHeader;
    }

    XMLHttpRequest.prototype.addEventListener = function(type, callback, useCapture) {
        switch (type) {
            case "readystatechange":
                this.onreadystatechange = callback;
                break;
            case "error":
                this.onerror = callback;
                break;
            case "progress":
                // this.onreadystatechange = callback;
                this.onprogress = callback;
                break;
            default:

        }
    }

    XMLHttpRequest.prototype.removeEventListener = function(type, callback, useCapture) {
        switch (type) {
            case "readystatechange":
                this.onreadystatechange = function() {};
                break;
            case "error":
                this.onerror = function() {};
                break;
            case "progress":
                this.onprogress = function() {};
                break;
            default:

        }
    }

    window.XMLHttpRequest = XMLHttpRequest;

})(window);


(function(window) {
    var messageEvent = {
        data: null,
        origin: "local",
        ports: -1,
        source: window
    };

    var WebSocket = function(url) {
        this._socket = new egret_native.WebSocket(url);
        this.binaryType = "arraybuffer";
        this._bindEvent();
    };

    WebSocket.prototype._bindEvent = function() {
        var that = this;
        var socket = this._socket;
        socket.onopen = function () {
            if (that.onopen) {
                that.onopen.call(that.thisObject);
            }
        };
        socket.onclose = function () {
            if (that.onclose) {
                that.onclose.call(that.thisObject);
            }
        };
        socket.onerror = function (errorCode) {
            if (that.onerror) {
                that.onerror.call(that.thisObject, errorCode);
            }
        };
        socket.onmessage = function (message) {
            if (that.onmessage) {
                messageEvent.data = message;
                that.onmessage.call(that.thisObject, messageEvent);
            }
        };
    };

    WebSocket.prototype.send = function (message) {
        this._socket.send(message);
    };

    WebSocket.prototype.close = function() {
        this._socket.close();
    };

    window.WebSocket = WebSocket;
})(window);

// extends requestAnimationFrame
(function(window) {
    var loops = [];
    window.requestAnimationFrame = function(callback) {
        loops.push(callback);
    }

    var count = 0,
        _loops = [];
    egret_native.setOnUpdate(function(dt) {
        count += dt;

        var temp = loops;
        loops = _loops;

        while (temp.length > 0) {
            temp.shift()(count);
        }

        _loops = temp;
    }, {});
})(this);

/***** other extends *****/
var setOnUpdate = egret_native.setOnUpdate;




require("launcher/native_loader.js");
egret_native.egtMain();
