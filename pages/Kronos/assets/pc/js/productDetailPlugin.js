/*! Aliplayer - v2.8.2 - 2019-05-09 16.34.41 */
!function n(a, s, l) {
  function u(t, e) {
    if (!s[t]) {
      if (!a[t]) {
        var i = "function" == typeof require && require;
        if (!e && i)
          return i(t, !0);
        if (c)
          return c(t, !0);
        var r = new Error("Cannot find module '" + t + "'");
        throw r.code = "MODULE_NOT_FOUND",
        r
      }
      var o = s[t] = {
        exports: {}
      };
      a[t][0].call(o.exports, function (e) {
        return u(a[t][1][e] || e)
      }, o, o.exports, n, a, s, l)
    }
    return s[t].exports
  }
  for (var c = "function" == typeof require && require, e = 0; e < l.length; e++)
    u(l[e]);
  return u
}({
  1: [function (e, t, i) {
    !function () {
      "use strict";
      function l(o, e) {
        var t;
        if (e = e || {},
          this.trackingClick = !1,
          this.trackingClickStart = 0,
          this.targetElement = null,
          this.touchStartX = 0,
          this.touchStartY = 0,
          this.lastTouchIdentifier = 0,
          this.touchBoundary = e.touchBoundary || 10,
          this.layer = o,
          this.tapDelay = e.tapDelay || 200,
          this.tapTimeout = e.tapTimeout || 700,
          !l.notNeeded(o)) {
          for (var i = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], r = this, n = 0, a = i.length; n < a; n++)
            r[i[n]] = s(r[i[n]], r);
          u && (o.addEventListener("mouseover", this.onMouse, !0),
            o.addEventListener("mousedown", this.onMouse, !0),
            o.addEventListener("mouseup", this.onMouse, !0)),
            o.addEventListener("click", this.onClick, !0),
            o.addEventListener("touchstart", this.onTouchStart, !1),
            o.addEventListener("touchmove", this.onTouchMove, !1),
            o.addEventListener("touchend", this.onTouchEnd, !1),
            o.addEventListener("touchcancel", this.onTouchCancel, !1),
            Event.prototype.stopImmediatePropagation || (o.removeEventListener = function (e, t, i) {
              var r = Node.prototype.removeEventListener;
              "click" === e ? r.call(o, e, t.hijacked || t, i) : r.call(o, e, t, i)
            }
              ,
              o.addEventListener = function (e, t, i) {
                var r = Node.prototype.addEventListener;
                "click" === e ? r.call(o, e, t.hijacked || (t.hijacked = function (e) {
                  e.propagationStopped || t(e)
                }
                ), i) : r.call(o, e, t, i)
              }
            ),
            "function" == typeof o.onclick && (t = o.onclick,
              o.addEventListener("click", function (e) {
                t(e)
              }, !1),
              o.onclick = null)
        }
        function s(e, t) {
          return function () {
            return e.apply(t, arguments)
          }
        }
      }
      var e = 0 <= navigator.userAgent.indexOf("Windows Phone")
        , u = 0 < navigator.userAgent.indexOf("Android") && !e
        , s = /iP(ad|hone|od)/.test(navigator.userAgent) && !e
        , c = s && /OS 4_\d(_\d)?/.test(navigator.userAgent)
        , d = s && /OS [6-7]_\d/.test(navigator.userAgent)
        , o = 0 < navigator.userAgent.indexOf("BB10");
      l.prototype.needsClick = function (e) {
        switch (e.nodeName.toLowerCase()) {
          case "button":
          case "select":
          case "textarea":
            if (e.disabled)
              return !0;
            break;
          case "input":
            if (s && "file" === e.type || e.disabled)
              return !0;
            break;
          case "label":
          case "iframe":
          case "video":
            return !0
        }
        return /\bneedsclick\b/.test(e.className)
      }
        ,
        l.prototype.needsFocus = function (e) {
          switch (e.nodeName.toLowerCase()) {
            case "textarea":
              return !0;
            case "select":
              return !u;
            case "input":
              switch (e.type) {
                case "button":
                case "checkbox":
                case "file":
                case "image":
                case "radio":
                case "submit":
                  return !1
              }
              return !e.disabled && !e.readOnly;
            default:
              return /\bneedsfocus\b/.test(e.className)
          }
        }
        ,
        l.prototype.sendClick = function (e, t) {
          var i, r;
          document.activeElement && document.activeElement !== e && document.activeElement.blur(),
            r = t.changedTouches[0],
            (i = document.createEvent("MouseEvents")).initMouseEvent(this.determineEventType(e), !0, !0, window, 1, r.screenX, r.screenY, r.clientX, r.clientY, !1, !1, !1, !1, 0, null),
            i.forwardedTouchEvent = !0,
            e.dispatchEvent(i)
        }
        ,
        l.prototype.determineEventType = function (e) {
          return u && "select" === e.tagName.toLowerCase() ? "mousedown" : "click"
        }
        ,
        l.prototype.focus = function (e) {
          var t;
          s && e.setSelectionRange && 0 !== e.type.indexOf("date") && "time" !== e.type && "month" !== e.type ? (t = e.value.length,
            e.setSelectionRange(t, t)) : e.focus()
        }
        ,
        l.prototype.updateScrollParent = function (e) {
          var t, i;
          if (!(t = e.fastClickScrollParent) || !t.contains(e)) {
            i = e;
            do {
              if (i.scrollHeight > i.offsetHeight) {
                t = i,
                  e.fastClickScrollParent = i;
                break
              }
              i = i.parentElement
            } while (i)
          }
          t && (t.fastClickLastScrollTop = t.scrollTop)
        }
        ,
        l.prototype.getTargetElementFromEventTarget = function (e) {
          return e.nodeType === Node.TEXT_NODE ? e.parentNode : e
        }
        ,
        l.prototype.onTouchStart = function (e) {
          var t, i, r;
          if (1 < e.targetTouches.length)
            return !0;
          if (t = this.getTargetElementFromEventTarget(e.target),
            i = e.targetTouches[0],
            s) {
            if ((r = window.getSelection()).rangeCount && !r.isCollapsed)
              return !0;
            if (!c) {
              if (i.identifier && i.identifier === this.lastTouchIdentifier)
                return e.preventDefault(),
                  !1;
              this.lastTouchIdentifier = i.identifier,
                this.updateScrollParent(t)
            }
          }
          return this.trackingClick = !0,
            this.trackingClickStart = e.timeStamp,
            this.targetElement = t,
            this.touchStartX = i.pageX,
            this.touchStartY = i.pageY,
            e.timeStamp - this.lastClickTime < this.tapDelay && e.preventDefault(),
            !0
        }
        ,
        l.prototype.touchHasMoved = function (e) {
          var t = e.changedTouches[0]
            , i = this.touchBoundary;
          return Math.abs(t.pageX - this.touchStartX) > i || Math.abs(t.pageY - this.touchStartY) > i
        }
        ,
        l.prototype.onTouchMove = function (e) {
          return this.trackingClick && (this.targetElement !== this.getTargetElementFromEventTarget(e.target) || this.touchHasMoved(e)) && (this.trackingClick = !1,
            this.targetElement = null),
            !0
        }
        ,
        l.prototype.findControl = function (e) {
          return void 0 !== e.control ? e.control : e.htmlFor ? document.getElementById(e.htmlFor) : e.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")
        }
        ,
        l.prototype.onTouchEnd = function (e) {
          var t, i, r, o, n, a = this.targetElement;
          if (!this.trackingClick)
            return !0;
          if (e.timeStamp - this.lastClickTime < this.tapDelay)
            return this.cancelNextClick = !0;
          if (e.timeStamp - this.trackingClickStart > this.tapTimeout)
            return !0;
          if (this.cancelNextClick = !1,
            this.lastClickTime = e.timeStamp,
            i = this.trackingClickStart,
            this.trackingClick = !1,
            this.trackingClickStart = 0,
            d && (n = e.changedTouches[0],
              (a = document.elementFromPoint(n.pageX - window.pageXOffset, n.pageY - window.pageYOffset) || a).fastClickScrollParent = this.targetElement.fastClickScrollParent),
            "label" === (r = a.tagName.toLowerCase())) {
            if (t = this.findControl(a)) {
              if (this.focus(a),
                u)
                return !1;
              a = t
            }
          } else if (this.needsFocus(a))
            return 100 < e.timeStamp - i || s && window.top !== window && "input" === r ? this.targetElement = null : (this.focus(a),
              this.sendClick(a, e),
              s && "select" === r || (this.targetElement = null,
                e.preventDefault())),
              !1;
          return !(!s || c || !(o = a.fastClickScrollParent) || o.fastClickLastScrollTop === o.scrollTop) || (this.needsClick(a) || (e.preventDefault(),
            this.sendClick(a, e)),
            !1)
        }
        ,
        l.prototype.onTouchCancel = function () {
          this.trackingClick = !1,
            this.targetElement = null
        }
        ,
        l.prototype.onMouse = function (e) {
          return !this.targetElement || (!!e.forwardedTouchEvent || (!e.cancelable || (!(!this.needsClick(this.targetElement) || this.cancelNextClick) || (e.stopImmediatePropagation ? e.stopImmediatePropagation() : e.propagationStopped = !0,
            e.stopPropagation(),
            e.preventDefault(),
            !1))))
        }
        ,
        l.prototype.onClick = function (e) {
          var t;
          return this.trackingClick ? (this.targetElement = null,
            !(this.trackingClick = !1)) : "submit" === e.target.type && 0 === e.detail || ((t = this.onMouse(e)) || (this.targetElement = null),
              t)
        }
        ,
        l.prototype.destroy = function () {
          var e = this.layer;
          u && (e.removeEventListener("mouseover", this.onMouse, !0),
            e.removeEventListener("mousedown", this.onMouse, !0),
            e.removeEventListener("mouseup", this.onMouse, !0)),
            e.removeEventListener("click", this.onClick, !0),
            e.removeEventListener("touchstart", this.onTouchStart, !1),
            e.removeEventListener("touchmove", this.onTouchMove, !1),
            e.removeEventListener("touchend", this.onTouchEnd, !1),
            e.removeEventListener("touchcancel", this.onTouchCancel, !1)
        }
        ,
        l.notNeeded = function (e) {
          var t, i, r;
          if (void 0 === window.ontouchstart)
            return !0;
          if (i = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) {
            if (!u)
              return !0;
            if (t = document.querySelector("meta[name=viewport]")) {
              if (-1 !== t.content.indexOf("user-scalable=no"))
                return !0;
              if (31 < i && document.documentElement.scrollWidth <= window.outerWidth)
                return !0
            }
          }
          if (o && 10 <= (r = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/))[1] && 3 <= r[2] && (t = document.querySelector("meta[name=viewport]"))) {
            if (-1 !== t.content.indexOf("user-scalable=no"))
              return !0;
            if (document.documentElement.scrollWidth <= window.outerWidth)
              return !0
          }
          return "none" === e.style.msTouchAction || "manipulation" === e.style.touchAction || (!!(27 <= +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1] && (t = document.querySelector("meta[name=viewport]")) && (-1 !== t.content.indexOf("user-scalable=no") || document.documentElement.scrollWidth <= window.outerWidth)) || ("none" === e.style.touchAction || "manipulation" === e.style.touchAction))
        }
        ,
        l.attach = function (e, t) {
          return new l(e, t)
        }
        ,
        "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function () {
          return l
        }) : void 0 !== t && t.exports ? (t.exports = l.attach,
          t.exports.FastClick = l) : window.FastClick = l
    }()
  }
    , {}],
  2: [function (e, t, i) {
    var r = e("../ui/component")
      , o = (e("../lib/util"),
        e("../lib/dom"))
      , n = e("../lib/event")
      , a = (e("../lib/ua"),
        e("../lang/index"))
      , s = e("../player/base/event/eventtype")
      , l = r.extend({
        init: function (e, t) {
          r.call(this, e, t),
            this.className = t.className ? t.className : "prism-auto-stream-selector",
            this.addClass(this.className)
        },
        createEl: function () {
          var e = r.prototype.createEl.call(this, "div");
          return e.innerHTML = "<div><p class='tip-text'></p></div><div class='operators'><a class='prism-button prism-button-ok' type='button'>" + a.get("OK_Text") + "</a><a class='prism-button prism-button-cancel'  target='_blank'>" + a.get("Cancel_Text") + "</a></div>",
            e
        },
        bindEvent: function () {
          var r = this;
          r._player.on(s.Private.AutoStreamShow, function (e) {
            var t = document.querySelector("#" + r.getId() + " .tip-text");
            if (r._player._getLowerQualityLevel) {
              var i = r._player._getLowerQualityLevel();
              i && (r._switchUrl = i,
                t.innerText = a.get("Auto_Stream_Tip_Text").replace("$$", i.item.desc),
                o.css(r.el(), "display", "block"))
            }
          }),
            r._player.on(s.Private.AutoStreamHide, function (e) {
              document.querySelector("#" + r.getId() + " .tip-text");
              o.css(r.el(), "display", "none")
            });
          var e = document.querySelector("#" + r.getId() + " .prism-button-ok");
          n.on(e, "click", function () {
            r._player._changeStream && r._switchUrl && r._player._changeStream(r._switchUrl.index, a.get("Quality_Change_Text")),
              o.css(r.el(), "display", "none")
          });
          var t = document.querySelector("#" + r.getId() + " .prism-button-cancel");
          n.on(t, "click", function () {
            o.css(r.el(), "display", "none")
          })
        }
      });
    t.exports = l
  }
    , {
    "../lang/index": 11,
    "../lib/dom": 18,
    "../lib/event": 19,
    "../lib/ua": 31,
    "../lib/util": 33,
    "../player/base/event/eventtype": 43,
    "../ui/component": 94
  }],
  3: [function (e, t, i) {
    var r = e("../ui/component")
      , s = e("../lib/dom")
      , o = e("../lib/event")
      , n = e("../lib/ua")
      , a = e("../lib/function")
      , l = (e("../lang/index"),
        e("../lib/util"))
      , u = e("../config")
      , c = e("../lib/playerutil")
      , d = e("../player/base/event/eventtype")
      , p = r.extend({
        init: function (e, t) {
          r.call(this, e, t),
            this.className = t.className ? t.className : "prism-liveshift-progress",
            this.addClass(this.className),
            this._liveshiftService = e._liveshiftService
        },
        createEl: function () {
          var e = r.prototype.createEl.call(this);
          return e.innerHTML = '<div class="prism-enable-liveshift"><div class="prism-progress-loaded"></div><div class="prism-progress-played"></div><div class="prism-progress-cursor"><img></img></div><p class="prism-progress-time"></p><div class="prism-liveshift-seperator">00:00:00</div></div><div class="prism-disable-liveshift"></div>',
            e
        },
        bindEvent: function () {
          var i = this;
          this.loadedNode = document.querySelector("#" + this.id() + " .prism-progress-loaded"),
            this.playedNode = document.querySelector("#" + this.id() + " .prism-progress-played"),
            this.cursorNode = document.querySelector("#" + this.id() + " .prism-progress-cursor"),
            this.timeNode = document.querySelector("#" + this.id() + " .prism-progress-time"),
            this.controlNode = document.querySelector("#" + this._player._options.id + " .prism-controlbar"),
            this.seperatorNode = document.querySelector("#" + this.id() + " .prism-liveshift-seperator"),
            this.progressNode = document.querySelector("#" + this.id() + " .prism-enable-liveshift");
          var e = document.querySelector("#" + this.id() + " .prism-progress-cursor img")
            , t = "//" + u.domain + "/de/prismplayer/" + u.h5Version + "/skins/default/img/dragcursor.png";
          u.domain ? -1 < u.domain.indexOf("localhost") && (t = "//" + u.domain + "/build/skins/default/img/dragcursor.png") : t = "de/prismplayer/" + u.h5Version + "/skins/default/img/dragcursor.png",
            e.src = t,
            o.on(this.cursorNode, "mousedown", function (e) {
              i._onMouseDown(e)
            }),
            o.on(this.cursorNode, "touchstart", function (e) {
              i._onMouseDown(e)
            }),
            o.on(this.progressNode, "mousemove", function (e) {
              i._progressMove(e)
            }),
            o.on(this.progressNode, "touchmove", function (e) {
              i._progressMove(e)
            }),
            o.on(this._el, "click", function (e) {
              i._onMouseClick(e)
            }),
            this._player.on(d.Private.HideProgress, function (e) {
              i._hideProgress(e)
            }),
            this._player.on(d.Private.CancelHideProgress, function (e) {
              i._cancelHideProgress(e)
            }),
            this._player.on(d.Private.ShowBar, function () {
              i._updateLayout()
            }),
            o.on(this.progressNode, d.Private.MouseOver, function (e) {
              i._onMouseOver(e)
            }),
            o.on(this.progressNode, d.Private.MouseOut, function (e) {
              i._onMouseOut(e)
            }),
            this.bindTimeupdate = a.bind(this, this._onTimeupdate),
            this._player.on(d.Player.TimeUpdate, this.bindTimeupdate),
            c.isLiveShift(this._player._options) && this._player.on(d.Player.Play, function () {
              i._liveshiftService.start(6e4, function (e) {
                var t = {
                  mediaId: i._player._options.vid ? i._player._options.vid : "",
                  error_code: e.Code,
                  error_msg: e.Message
                };
                i._player.logError(t),
                  i._player.trigger(d.Player.Error, t)
              })
            }),
            this._player.on(d.Private.LiveShiftQueryCompleted, function () {
              i._updateSeperator(),
                i._updateLayout()
            }),
            this._player.on(d.Player.Pause, function () {
              i._liveshiftService.stop()
            }),
            n.IS_IPAD ? this.interval = setInterval(function () {
              i._onProgress()
            }, 500) : this._player.on(d.Video.Progress, function () {
              i._onProgress()
            })
        },
        _updateSeperator: function () {
          this._liveshiftService.currentTimeDisplay && (this.seperatorNode.innerText = this._liveshiftService.currentTimeDisplay)
        },
        _updateLayout: function () {
          var e = this.seperatorNode.offsetWidth
            , t = this.el().offsetWidth
            , i = t - e;
          0 != e && 0 != i && (s.css(this.progressNode, "width", 100 * (i - 10) / t + "%"),
            s.css(this.seperatorNode, "right", -1 * (e + 10) + "px"))
        },
        _progressMove: function (e) {
          var t = this._getSeconds(e)
            , i = this._liveshiftService.availableLiveShiftTime;
          this.timeNode.innerText = "-" + l.formatTime(i - t);
          var r = i ? t / i : 0
            , o = 1 - this.timeNode.clientWidth / this.el().clientWidth;
          o < r && (r = o),
            this.timeNode && s.css(this.timeNode, "left", 100 * r + "%")
        },
        _hideProgress: function (e) {
          o.off(this.cursorNode, "mousedown"),
            o.off(this.cursorNode, "touchstart")
        },
        _cancelHideProgress: function (e) {
          var t = this;
          o.on(this.cursorNode, "mousedown", function (e) {
            t._onMouseDown(e)
          }),
            o.on(this.cursorNode, "touchstart", function (e) {
              t._onMouseDown(e)
            })
        },
        _canSeekable: function (e) {
          var t = !0;
          return "function" == typeof this._player.canSeekable && (t = this._player.canSeekable(e)),
            t
        },
        _onMouseOver: function (e) {
          this._updateCursorPosition(this._getCurrentTime()),
            s.css(this.timeNode, "display", "block")
        },
        _onMouseOut: function (e) {
          s.css(this.timeNode, "display", "none")
        },
        _getSeconds: function (e) {
          for (var t = this.el().offsetLeft, i = this.el(); i = i.offsetParent;) {
            var r = s.getTranslateX(i);
            t += i.offsetLeft + r
          }
          var o = (e.touches ? e.touches[0].pageX : e.pageX) - t
            , n = this.progressNode.offsetWidth
            , a = this._liveshiftService.availableLiveShiftTime;
          return sec = a ? o / n * a : 0,
            sec < 0 && (sec = 0),
            sec > a && (sec = a),
            sec
        },
        _onMouseClick: function (e) {
          var t = this
            , i = this._getSeconds(e)
            , r = this._liveshiftService.availableLiveShiftTime - i;
          this._player.trigger(d.Private.SeekStart, {
            fromTime: this._getCurrentTime()
          });
          var o = this._liveshiftService.getSourceUrl(r)
            , n = t._player._options.source
            , a = c.isHls(t._player._options.source);
          a && o == n ? t._player.seek(i) : t._player._loadByUrlInner(o, i, !0),
            t._player.trigger(d.Private.Play_Btn_Hide),
            t._liveshiftService.seekTime = i,
            t._player.trigger(d.Private.EndStart, {
              toTime: i
            }),
            t._updateCursorPosition(i),
            a && setTimeout(function () {
              t._player.play()
            })
        },
        _onMouseDown: function (e) {
          var t = this;
          e.preventDefault(),
            this._player.trigger(d.Private.SeekStart, {
              fromTime: this._getCurrentTime()
            }),
            o.on(this.controlNode, "mousemove", function (e) {
              t._onMouseMove(e)
            }),
            o.on(this.controlNode, "touchmove", function (e) {
              t._onMouseMove(e)
            }),
            o.on(this._player.tag, "mouseup", function (e) {
              t._onMouseUp(e)
            }),
            o.on(this._player.tag, "touchend", function (e) {
              t._onMouseUp(e)
            }),
            o.on(this.controlNode, "mouseup", function (e) {
              t._onMouseUp(e)
            }),
            o.on(this.controlNode, "touchend", function (e) {
              t._onMouseUp(e)
            })
        },
        _onMouseUp: function (e) {
          e.preventDefault(),
            o.off(this.controlNode, "mousemove"),
            o.off(this.controlNode, "touchmove"),
            o.off(this._player.tag, "mouseup"),
            o.off(this._player.tag, "touchend"),
            o.off(this.controlNode, "mouseup"),
            o.off(this.controlNode, "touchend");
          var t = this._liveshiftService.availableLiveShiftTime
            , i = this.playedNode.offsetWidth / this.el().offsetWidth * t;
          this._player.seek(i),
            this._player.trigger(d.Private.Play_Btn_Hide),
            this._liveshiftService.seekTime = i,
            this._player.trigger(d.Private.EndStart, {
              toTime: i
            })
        },
        _onMouseMove: function (e) {
          e.preventDefault();
          var t = this._getSeconds(e);
          this._updateProgressBar(this.playedNode, t),
            this._updateCursorPosition(t)
        },
        _onTimeupdate: function (e) {
          this._updateProgressBar(this.playedNode, this._getCurrentTime()),
            this._updateCursorPosition(this._getCurrentTime()),
            this._player.trigger(d.Private.UpdateProgressBar, {
              time: this._getCurrentTime()
            })
        },
        _getCurrentTime: function () {
          var e = this._liveshiftService.seekTime;
          return -1 == e && (e = 0),
            this._player.getCurrentTime() + e
        },
        _onProgress: function (e) {
          this._player.getDuration() && 1 <= this._player.getBuffered().length && this._updateProgressBar(this.loadedNode, this._player.getBuffered().end(this._player.getBuffered().length - 1))
        },
        _updateProgressBar: function (e, t) {
          if (1 != this._player._switchSourcing) {
            var i = 0;
            if (-1 == this._liveshiftService.seekTime)
              i = 1;
            else {
              var r = this._liveshiftService.availableLiveShiftTime;
              1 < (i = r ? t / r : 0) && (i = 1,
                this._liveshiftService.seekTime = -1)
            }
            this.liveShiftStartDisplay;
            e && s.css(e, "width", 100 * i + "%")
          }
        },
        _updateCursorPosition: function (e) {
          if (this._player.el() && 1 != this._player._switchSourcing && (0 != e || 0 != this._player.tag.readyState)) {
            var t = 0
              , i = 1
              , r = this._player.el().clientWidth;
            if (-1 == this._liveshiftService.seekTime)
              t = 1;
            else {
              var o = this._liveshiftService.availableLiveShiftTime;
              1 < (t = o ? e / o : 0) && (this._liveshiftService.seekTime = -1)
            }
            if (0 != r) {
              var n = 18 / r;
              i = 1 - n,
                t -= n
            }
            this.cursorNode && (i < t ? (s.css(this.cursorNode, "right", "0px"),
              s.css(this.cursorNode, "left", "auto")) : (s.css(this.cursorNode, "right", "auto"),
                s.css(this.cursorNode, "left", 100 * t + "%")))
          }
        }
      });
    t.exports = p
  }
    , {
    "../config": 5,
    "../lang/index": 11,
    "../lib/dom": 18,
    "../lib/event": 19,
    "../lib/function": 20,
    "../lib/playerutil": 29,
    "../lib/ua": 31,
    "../lib/util": 33,
    "../player/base/event/eventtype": 43,
    "../ui/component": 94
  }],
  4: [function (e, t, i) {
    var r = e("../ui/component")
      , n = e("../lib/util")
      , a = e("../player/base/event/eventtype")
      , o = r.extend({
        init: function (e, t) {
          r.call(this, e, t),
            this.className = t.className ? t.className : "prism-live-time-display",
            this.addClass(this.className),
            this._liveshiftService = e._liveshiftService
        },
        createEl: function () {
          var e = r.prototype.createEl.call(this, "div");
          return e.innerHTML = '<span class="current-time">00:00</span> <span class="time-bound">/</span> <span class="end-time">00:00</span><span class="live-text">Live: </span><span class="live-time"></span>',
            e
        },
        bindEvent: function () {
          var o = this;
          this._player.on(a.Video.TimeUpdate, function () {
            var e = o._liveshiftService
              , t = document.querySelector("#" + o.id() + " .current-time");
            if (e.liveShiftStartDisplay && e.availableLiveShiftTime > e.seekTime && -1 != e.seekTime) {
              var i = o._liveshiftService.getBaseTime()
                , r = n.formatTime(i + o._player.getCurrentTime());
              t.innerText = r
            } else
              e.currentTimeDisplay && (t.innerText = e.currentTimeDisplay)
          }),
            this._player.on(a.Private.LiveShiftQueryCompleted, function () {
              o.updateTime()
            })
        },
        updateTime: function () {
          document.querySelector("#" + this.id() + " .end-time").innerText = this._liveshiftService.liveTimeRange.endDisplay,
            document.querySelector("#" + this.id() + " .live-time").innerText = this._liveshiftService.currentTimeDisplay
        }
      });
    t.exports = o
  }
    , {
    "../lib/util": 33,
    "../player/base/event/eventtype": 43,
    "../ui/component": 94
  }],
  5: [function (e, t, i) {
    t.exports = {
      domain: "g.alicdn.com",
      flashVersion: "2.8.2",
      h5Version: "2.8.2",
      cityBrain: !0,
      logDuration: 10,
      logCount: 100,
      logReportTo: "https://videocloud.cn-hangzhou.log.aliyuncs.com/logstores/newplayer/track"
    }
  }
    , {}],
  6: [function (e, t, i) {
    e("./lang/index").load();
    var r = e("./player/adaptivePlayer")
      , o = e("./lib/componentutil")
      , n = e("./config")
      , a = function (e, t) {
        return r.create(e, t)
      };
    a.getVersion = function () {
      return n.h5Version
    }
      ,
      o.register(a);
    var s = window.Aliplayer = a;
    a.players = {},
      "function" == typeof define && define.amd ? define([], function () {
        return s
      }) : "object" == typeof i && "object" == typeof t && (t.exports = s),
      "undefined" != typeof Uint8Array && (Uint8Array.prototype.slice || Object.defineProperty(Uint8Array.prototype, "slice", {
        value: Array.prototype.slice
      }))
  }
    , {
    "./config": 5,
    "./lang/index": 11,
    "./lib/componentutil": 14,
    "./player/adaptivePlayer": 40
  }],
  7: [function (e, t, i) {
    var r = e("../lib/oo")
      , o = e("../lang/index")
      , n = r.extend({
        init: function (e, t) {
          this._player = e,
            this._options = e.options()
        }
      });
    n.prototype.handle = function (e) {
      if (this._options.autoPlayDelay) {
        var t = this._options.autoPlayDelayDisplayText;
        t || (t = o.get("AutoPlayDelayDisplayText").replace("$$", this._options.autoPlayDelay)),
          this._player.trigger("info_show", t),
          this._player.trigger("h5_loading_hide"),
          this._player.trigger("play_btn_hide");
        var i = this;
        this._timeHandler = setTimeout(function () {
          i._player.trigger("info_hide"),
            i._options.autoPlayDelay = 0,
            e && e()
        }, 1e3 * this._options.autoPlayDelay),
          this._player.on("play", function () {
            a(i)
          }),
          this._player.on("pause", function () {
            a(i)
          })
      }
    }
      ,
      n.prototype.dispose = function () {
        a(this),
          this._player = null
      }
      ;
    var a = function (e) {
      e._timeHandler && (clearTimeout(e._timeHandler),
        e._timeHandler = null)
    };
    t.exports = n
  }
    , {
    "../lang/index": 11,
    "../lib/oo": 27
  }],
  8: [function (e, t, i) {
    t.exports = t.exports = {
      OD: "OD",
      FD: "360p",
      LD: "540p",
      SD: "720p",
      HD: "1080p",
      "2K": "2K",
      "4K": "4K",
      FHD: "FHD",
      XLD: "XLD",
      SQ: "SQ",
      HQ: "HQ",
      Speed: "Speed",
      Speed_05X_Text: "0.5X",
      Speed_1X_Text: "Normal",
      Speed_125X_Text: "1.25X",
      Speed_15X_Text: "1.5X",
      Speed_2X_Text: "2X",
      Refresh_Text: "Refresh",
      Cancel: "Cancel",
      Mute: "Mute",
      Snapshot: "Snapshot",
      Detection_Text: "Diagnosis",
      Play_DateTime: "Time",
      Quality_Change_Fail_Switch_Text: "Cannot play, switch to ",
      Quality_Change_Text: "Switch to ",
      Quality_The_Url: "The url",
      AutoPlayDelayDisplayText: "Play in $$ seconds",
      Error_Load_Abort_Text: "Data abort erro",
      Error_Network_Text: "Loading failed due to network error",
      Error_Decode_Text: "Decode error",
      Error_Server_Network_NotSupport_Text: "Network error or \xa0the format of video is unsupported",
      Error_Offline_Text: "The network is unreachable, please click Refresh",
      Error_Play_Text: "Error occured while playing",
      Error_Retry_Text: " Please close or refresh",
      Error_AuthKey_Text: "Authentication expired or the domain is not in white list",
      Error_H5_Not_Support_Text: "The format of video is not supported by\xa0h5 player\uff0cplease use flash player",
      Error_Not_Support_M3U8_Text: "The format of m3u8 is not supported by this explorer",
      Error_Not_Support_MP4_Text: "The format of mp4\xa0is not supported by this explorer",
      Error_Not_Support_encrypt_Text: "Play the encrypted video,please set encryptType to 1",
      Error_Vod_URL_Is_Empty_Text: "The url is empty",
      Error_Vod_Fetch_Urls_Text: "Error occured when fetch urls\uff0cplease close or refresh",
      Fetch_Playauth_Error: "Error occured when fetch playauth close or refresh",
      Error_Playauth_Decode_Text: "PlayAuth parse failed",
      Error_Vid_Not_Same_Text: "Cannot renew url due to vid changed",
      Error_Playauth_Expired_Text: "Playauth expired, please close or refresh",
      Error_MTS_Fetch_Urls_Text: "Error occurred while requesting mst server",
      Error_Load_M3U8_Failed_Text: "The\xa0m3u8 file loaded failed",
      Error_Load_M3U8_Timeout_Text: "Timeout error occored\xa0when the\xa0m3u8 file loaded",
      Error_M3U8_Decode_Text: "The m3u8 file decoded failed",
      Error_TX_Decode_Text: "Video decoded failed",
      Error_Waiting_Timeout_Text: "Buffering timeout,\xa0please close or refresh",
      Error_Invalidate_Source: "Video shoud be mp4\u3001mp3\u3001m3u8\u3001mpd or flv",
      Error_Empty_Source: "Video URL shouldn't be empty",
      Error_Vid_Empty_Source: "vid's video URL hasn't been fetched",
      Error_Fetch_NotStream: "The vid has no stream to play",
      Error_Not_Found: "Url is not found",
      Live_End: "Live has finished",
      Play_Before_Fullscreen: "Please play before fullscreen",
      Can_Not_Seekable: "Can not seek to this position",
      Cancel_Text: "Cancel",
      OK_Text: "OK",
      Auto_Stream_Tip_Text: "Internet is slow, does switch to $$",
      Request_Block_Text: "This request is blocked, the video Url should be over https",
      Open_Html_By_File: "Html page should be on the server",
      Maybe_Cors_Error: "please make sure enable cors,<a href='https://help.aliyun.com/document_detail/62950.html?spm=a2c4g.11186623.2.21.Y3n2oi' target='_blank'>refer to document</a>",
      Speed_Switch_To: "Speed switch to ",
      Curent_Volume: "Current volume:",
      Volume_Mute: "set to mute",
      Volume_UnMute: "set to unmute",
      ShiftLiveTime_Error: "Live start time should not be greater than over time",
      Error_Not_Support_Format_On_Mobile: "flv\u3001rmtp can't be supported on mobile\uff0cplease use m3u8",
      SessionId_Ticket_Invalid: "please assign value for sessionId and ticket properties",
      Http_Error: " An HTTP network request failed with an error, but not from the server.",
      Http_Timeout: "A network request timed out",
      DRM_License_Expired: "DRM license is expired, please refresh",
      Not_Support_DRM: "Browser doesn't support DRM",
      CC_Switch_To: "Subtitle switch to ",
      AudioTrack_Switch_To: "Audio tracks switch to ",
      Subtitle: "Subtitle/CC",
      AudioTrack: "Audio Track",
      Quality: "Quality",
      Auto: "Auto",
      Quality_Switch_To: "Quality switch to ",
      Fullscreen: "Full Screen",
      Setting: "Settings",
      Volume: "Volume",
      Play: "Play",
      Pause: "Pause",
      CloseSubtitle: "Close CC",
      OpenSubtitle: "Open CC",
      ExistFullScreen: "Exit Full Screen",
      Muted: "Muted",
      Retry: "Retry",
      SwitchToLive: "Return to live",
      iOSNotSupportVodEncription: "iOS desn't suport Vod's encription video",
      UseChromeForVodEncription: "This browser desn't suport Vod's encription video, please use latest Chrome"
    }
  }
    , {}],
  9: [function (e, t, i) {
    t.exports = t.exports = {
      OD: "OD",
      LD: "360p",
      FD: "540p",
      SD: "720p",
      HD: "1080p",
      "2K": "2K",
      "4K": "4K",
      FHD: "FHD",
      XLD: "XLD",
      SQ: "SQ",
      HQ: "HQ",
      Forbidden_Text: "Internal information is strictly forbidden to outsider",
      Refresh: "Refresh",
      Diagnosis: "Diagnosis",
      Live_Finished: "Live has finished, thanks for watching",
      Play: "Play",
      Pause: "Pause",
      Snapshot: "Snapshot",
      Replay: "Replay",
      Live: "Live",
      Encrypt: "Encrypt",
      Sound: "Sound",
      Fullscreen: "Full Screen",
      Exist_Fullscreen: "Exit Full-screen",
      Resolution: "Resolution",
      Next: "Next Video",
      Brightness: "Brightness",
      Default: "Default",
      Contrast: "Contrast",
      Titles_Credits: "Titles\xa0and\xa0Credits",
      Skip_Titles: "Skip Titles",
      Skip_Credits: "Skip Credits",
      Not_Support_Out_Site: "The video is not supported for outside website, please watch it by TaoTV",
      Watch_Now: "Watch now",
      Network_Error: "Network is unreachable, please try to refresh",
      Video_Error: "Playing a video error,\xa0please try to refresh",
      Decode_Error: "Data decoding\xa0error",
      Live_Not_Start: "Live has not started, to be expected",
      Live_Loading: "Live information is loading,\xa0please try to refresh",
      Fetch_Playauth_Error: "Error occured when fetch playauth close or refresh",
      Live_End: "Live has finished",
      Live_Abrot: "Signal aborted,\xa0please try to refresh",
      Corss_Domain_Error: "Please ensure your domain has obtained IPC license and combined CNAME, \r\n or to set\xa0\xa0cross-domain accessing available",
      Url_Timeout_Error: "The video url is timeout,\xa0please try to refresh",
      Connetction_Error: "Sorry\uff0cthe video cannot play because of connection error, please try to watch other videos",
      Fetch_MTS_Error: "Fetching video list failed, please ensure",
      Token_Expired_Error: "Requesting open api failed, please ensure token expired or not",
      Video_Lists_Empty_Error: "The video list is empty, please check the format of video",
      Encrypted_Failed_Error: "Fetching encrypted file failed, please check the permission of player",
      Fetch_Failed_Permission_Error: "Fetching video list failed, please check the permission of player",
      Invalidate_Param_Error: "No video url, please check the parameters",
      AutoPlayDelayDisplayText: "Play in $$ seconds",
      Fetch_MTS_NOT_NotStream_Error: "The vid has no stream to play",
      Cancel_Text: "Cancel",
      OK_Text: "OK",
      Auto_Stream_Tip_Text: "Internet is slow, does switch to $$",
      Open_Html_By_File: "Html page should be on the server",
      Cant_Use_Flash_On_Mobile: "Mobile doesn't support flash player\uff0cplease use h5 player",
      Flash_Not_Ready: "Flash Player plugin hasn't been installed <a href='https://www.flash.cn/' target='_blank'>install plugin</a>, or check if disable Flash plugin"
    }
  }
    , {}],
  10: [function (e, t, i) {
    t.exports = t.exports = {
      OD: "\u539f\u753b",
      FD: "\u6d41\u7545",
      LD: "\u6807\u6e05",
      SD: "\u9ad8\u6e05",
      HD: "\u8d85\u6e05",
      "2K": "2K",
      "4K": "4K",
      FHD: "\u5168\u9ad8\u6e05",
      XLD: "\u6781\u901f",
      SQ: "\u666e\u901a\u97f3\u8d28",
      HQ: "\u9ad8\u97f3\u8d28",
      Forbidden_Text: "\u5185\u90e8\u4fe1\u606f\uff0c\u4e25\u7981\u5916\u4f20",
      Refresh: "\u5237\u65b0",
      Diagnosis: "\u8bca\u65ad",
      Live_Finished: "\u76f4\u64ad\u5df2\u7ed3\u675f,\u8c22\u8c22\u89c2\u770b",
      Play: "\u64ad\u653e",
      Pause: "\u6682\u505c",
      Snapshot: "\u622a\u56fe",
      Replay: "\u91cd\u64ad",
      Live: "\u76f4\u64ad",
      Encrypt: "\u52a0\u5bc6",
      Sound: "\u58f0\u97f3",
      Fullscreen: "\u5168\u5c4f",
      Exist_Fullscreen: "\u9000\u51fa\u5168\u5c4f",
      Resolution: "\u6e05\u6670\u5ea6",
      Next: "\u4e0b\u4e00\u96c6",
      Brightness: "\u4eae\u5ea6",
      Default: "\u9ed8\u8ba4",
      Contrast: "\u5bf9\u6bd4\u5ea6",
      Titles_Credits: "\u7247\u5934\u7247\u5c3e",
      Skip_Titles: "\u8df3\u8fc7\u7247\u5934",
      Skip_Credits: "\u8df3\u8fc7\u7247\u5c3e",
      Not_Support_Out_Site: "\u8be5\u89c6\u9891\u6682\u4e0d\u652f\u6301\u7ad9\u5916\u64ad\u653e\uff0c\u8bf7\u5230\u6dd8TV\u89c2\u770b",
      Watch_Now: "\u7acb\u5373\u89c2\u770b",
      Network_Error: "\u7f51\u7edc\u65e0\u6cd5\u8fde\u63a5\uff0c\u8bf7\u5c1d\u8bd5\u68c0\u67e5\u7f51\u7edc\u540e\u5237\u65b0\u8bd5\u8bd5",
      Video_Error: "\u89c6\u9891\u64ad\u653e\u5f02\u5e38\uff0c\u8bf7\u5237\u65b0\u8bd5\u8bd5",
      Decode_Error: "\u64ad\u653e\u6570\u636e\u89e3\u7801\u9519\u8bef",
      Live_Not_Start: "\u4eb2\uff0c\u76f4\u64ad\u8fd8\u672a\u5f00\u59cb\u54e6\uff0c\u656c\u8bf7\u671f\u5f85",
      Live_Loading: "\u76f4\u64ad\u4fe1\u606f\u52a0\u8f7d\u4e2d\uff0c\u8bf7\u5237\u65b0\u8bd5\u8bd5",
      Live_End: "\u4eb2\uff0c\u76f4\u64ad\u5df2\u7ed3\u675f",
      Live_Abrot: "\u5f53\u524d\u76f4\u64ad\u4fe1\u53f7\u4e2d\u65ad\uff0c\u8bf7\u5237\u65b0\u540e\u91cd\u8bd5",
      Corss_Domain_Error: "\u8bf7\u786e\u8ba4\u60a8\u7684\u57df\u540d\u5df2\u5b8c\u6210\u5907\u6848\u548cCNAME\u7ed1\u5b9a\uff0c\r\n\u5e76\u5904\u4e8e\u542f\u7528\u72b6\u6001\uff0c\u6216\u8d44\u6e90\u5141\u8bb8\u8de8\u8d8a\u8bbf\u95ee",
      Url_Timeout_Error: "\u60a8\u6240\u89c2\u770b\u7684\u89c6\u9891\u5730\u5740\u8fde\u63a5\u8d85\u65f6\uff0c\u8bf7\u5237\u65b0\u540e\u91cd\u8bd5",
      Connetction_Error: "\u62b1\u6b49,\u8be5\u89c6\u9891\u7531\u4e8e\u8fde\u63a5\u9519\u8bef\u6682\u65f6\u4e0d\u80fd\u64ad\u653e,\u8bf7\u89c2\u770b\u5176\u5b83\u89c6\u9891",
      Fetch_MTS_Error: "\u83b7\u53d6\u89c6\u9891\u5217\u8868\u5931\u8d25\uff0c\u8bf7\u786e\u8ba4",
      Token_Expired_Error: "\u8bf7\u6c42\u63a5\u53e3\u5931\u8d25\uff0c\u8bf7\u786e\u8ba4Token\u662f\u5426\u8fc7\u671f",
      Video_Lists_Empty_Error: "\u83b7\u53d6\u89c6\u9891\u5217\u8868\u4e3a\u7a7a\uff0c\u8bf7\u786e\u8ba4\u64ad\u653e\u6570\u636e\u4e0e\u683c\u5f0f",
      Encrypted_Failed_Error: "\u83b7\u53d6\u89c6\u9891\u52a0\u5bc6\u79d8\u94a5\u9519\u8bef\uff0c\u8bf7\u786e\u8ba4\u64ad\u653e\u6743\u9650",
      Fetch_Failed_Permission_Error: "\u83b7\u53d6\u89c6\u9891\u5217\u8868\u5931\u8d25\uff0c\u8bf7\u786e\u8ba4\u64ad\u653e\u6743\u9650",
      Invalidate_Param_Error: "\u65e0\u8f93\u5165\u89c6\u9891\uff0c\u8bf7\u786e\u8ba4\u8f93\u5165\u53c2\u6570",
      AutoPlayDelayDisplayText: "$$\u79d2\u4ee5\u540e\u5f00\u59cb\u64ad\u653e",
      Fetch_MTS_NOT_NotStream_Error: "\u6b64vid\u6ca1\u6709\u53ef\u64ad\u653e\u89c6\u9891",
      Cancel_Text: "\u53d6\u6d88",
      OK_Text: "\u786e\u8ba4",
      Auto_Stream_Tip_Text: "\u7f51\u7edc\u4e0d\u7ed9\u529b\uff0c\u662f\u5426\u5207\u6362\u5230$$",
      Fetch_Playauth_Error: "\u83b7\u53d6\u64ad\u653e\u51ed\u8bc1\u51fa\u9519\u5566\uff0c\u8bf7\u5c1d\u8bd5\u9000\u51fa\u91cd\u8bd5\u6216\u5237\u65b0",
      Open_Html_By_File: "\u4e0d\u80fd\u76f4\u63a5\u5728\u6d4f\u89c8\u5668\u6253\u5f00html\u6587\u4ef6\uff0c\u8bf7\u90e8\u7f72\u5230\u670d\u52a1\u7aef",
      Cant_Use_Flash_On_Mobile: "\u79fb\u52a8\u7aef\u4e0d\u652f\u6301Flash\u64ad\u653e\u5668\uff0c\u8bf7\u4f7f\u7528h5\u64ad\u653e\u5668",
      Flash_Not_Ready: "Flash Player\u63d2\u4ef6\u672a\u5b89\u88c5<a href='https://www.flash.cn/' target='_blank'>\u5b89\u88c5\u63d2\u4ef6</a>\uff0c\u5982\u679c\u5df2\u7ecf\u5b89\u88c5\u8bf7\u68c0\u67e5\u662f\u5426\u88ab\u7981\u7528"
    }
  }
    , {}],
  11: [function (n, e, t) {
    var i = n("../config")
      , a = n("../lib/storage")
      , o = (n("../lib/io"),
        "aliplayer_lang")
      , s = function () {
        if (void 0 === window[o] || !window[o]) {
          var e = (navigator.language || navigator.browserLanguage).toLowerCase();
          e = e && -1 < e.indexOf("zh") ? "zh-cn" : "en-us",
            window[o] = e
        }
        return window[o]
      }
      , l = function (e, t) {
        var i = d(e)
          , r = ""
          , o = c();
        r = "flash" == e ? "en-us" == o ? n("./flash/en-us") : "zh-cn" == o ? n("./flash/zh-cn") : t[o] : "en-us" == o ? n("./en-us") : "zh-cn" == o ? n("./zh-cn") : t[o],
          a.set(i, JSON.stringify(r)),
          u(e, r)
      }
      , u = function (e, t) {
        var i = d(e);
        window[i] = t
      }
      , c = function () {
        return s()
      }
      , d = function (e) {
        var t = c();
        return e || (e = "h5"),
          "aliplayer_lang_data_" + e + "_" + i.h5Version.replace(/\./g, "_") + "_" + t
      };
    e.exports.setCurrentLanguage = function (e, t, i) {
      var r = window[o];
      if (void 0 !== e && e || (e = s()),
        "en-us" != e && "zh-cn" != e && (!i || i && !i[e]))
        throw new Error("There is not language resource for " + e + ", please specify the language resource by languageTexts property");
      window[o] = e,
        l(t, i),
        e != r && n("../lib/constants").updateByLanguage()
    }
      ,
      e.exports.getCurrentLanguage = s,
      e.exports.getLanguageData = function (e, t) {
        var i = d(e);
        return window[i]
      }
      ,
      e.exports.load = l,
      e.exports.get = function (e, t) {
        t || (t = "h5");
        var i = d(t)
          , r = window[i];
        if (r)
          return r[e]
      }
  }
    , {
    "../config": 5,
    "../lib/constants": 15,
    "../lib/io": 24,
    "../lib/storage": 30,
    "./en-us": 8,
    "./flash/en-us": 9,
    "./flash/zh-cn": 10,
    "./zh-cn": 12
  }],
  12: [function (e, t, i) {
    t.exports = t.exports = {
      OD: "\u539f\u753b",
      FD: "\u6d41\u7545",
      LD: "\u6807\u6e05",
      SD: "\u9ad8\u6e05",
      HD: "\u8d85\u6e05",
      "2K": "2K",
      "4K": "4K",
      FHD: "\u5168\u9ad8\u6e05",
      XLD: "\u6781\u901f",
      SQ: "\u666e\u901a\u97f3\u8d28",
      HQ: "\u9ad8\u97f3\u8d28",
      Speed: "\u500d\u901f",
      Speed_05X_Text: "0.5X",
      Speed_1X_Text: "\u6b63\u5e38",
      Speed_125X_Text: "1.25X",
      Speed_15X_Text: "1.5X",
      Speed_2X_Text: "2X",
      Quality_Change_Fail_Switch_Text: "\u4e0d\u80fd\u64ad\u653e\uff0c\u5207\u6362\u4e3a",
      Quality_Change_Text: "\u6b63\u5728\u4e3a\u60a8\u5207\u6362\u5230 ",
      Quality_The_Url: "\u6b64\u5730\u5740",
      Refresh_Text: "\u5237\u65b0",
      Detection_Text: "\u8bca\u65ad",
      Cancel: "\u53d6\u6d88",
      Mute: "\u9759\u97f3",
      Snapshot: "\u622a\u56fe",
      Play_DateTime: "\u64ad\u653e\u65f6\u95f4",
      AutoPlayDelayDisplayText: "$$\u79d2\u4ee5\u540e\u5f00\u59cb\u64ad\u653e",
      Error_Load_Abort_Text: "\u83b7\u53d6\u6570\u636e\u8fc7\u7a0b\u88ab\u4e2d\u6b62",
      Error_Network_Text: "\u7f51\u7edc\u9519\u8bef\u52a0\u8f7d\u6570\u636e\u5931\u8d25",
      Error_Decode_Text: "\u89e3\u7801\u9519\u8bef",
      Error_Server_Network_NotSupport_Text: "\u670d\u52a1\u5668\u3001\u7f51\u7edc\u9519\u8bef\u6216\u683c\u5f0f\u4e0d\u652f\u6301",
      Error_Offline_Text: "\u7f51\u7edc\u4e0d\u53ef\u7528\uff0c\u8bf7\u786e\u5b9a",
      Error_Play_Text: "\u64ad\u653e\u51fa\u9519\u5566",
      Error_Retry_Text: "\u8bf7\u5c1d\u8bd5\u9000\u51fa\u91cd\u8bd5\u6216\u5237\u65b0",
      Error_AuthKey_Text: "\u53ef\u80fd\u9274\u6743\u8fc7\u671f\u3001\u57df\u540d\u4e0d\u5728\u767d\u540d\u5355\u6216\u8bf7\u6c42\u88ab\u62e6\u622a",
      Error_H5_Not_Support_Text: "h5\u4e0d\u652f\u6301\u6b64\u683c\u5f0f\uff0c\u8bf7\u4f7f\u7528flash\u64ad\u653e\u5668",
      Error_Not_Support_M3U8_Text: "\u6d4f\u89c8\u5668\u4e0d\u652f\u6301m3u8\u89c6\u9891\u64ad\u653e",
      Error_Not_Support_MP4_Text: "\u6d4f\u89c8\u5668\u4e0d\u652f\u6301mp4\u89c6\u9891\u64ad\u653e",
      Error_Not_Support_encrypt_Text: "\u64ad\u653e\u52a0\u5bc6\u89c6\u9891\uff0c\u8bf7\u8bbe\u7f6e\u5c5e\u6027encryptType to 1",
      Error_Vod_URL_Is_Empty_Text: "\u83b7\u53d6\u64ad\u653e\u5730\u5740\u4e3a\u7a7a",
      Error_Vod_Fetch_Urls_Text: "\u83b7\u53d6\u5730\u5740\u51fa\u9519\u5566\uff0c\u8bf7\u5c1d\u8bd5\u9000\u51fa\u91cd\u8bd5\u6216\u5237\u65b0",
      Fetch_Playauth_Error: "\u83b7\u53d6\u64ad\u653e\u51ed\u8bc1\u51fa\u9519\u5566\uff0c\u8bf7\u5c1d\u8bd5\u9000\u51fa\u91cd\u8bd5\u6216\u5237\u65b0",
      Error_Playauth_Decode_Text: "playauth\u89e3\u6790\u9519\u8bef",
      Error_Vid_Not_Same_Text: "\u4e0d\u80fd\u66f4\u65b0\u5730\u5740\uff0cvid\u548c\u64ad\u653e\u4e2d\u7684\u4e0d\u4e00\u81f4",
      Error_Playauth_Expired_Text: "\u51ed\u8bc1\u5df2\u8fc7\u671f\uff0c\u8bf7\u5c1d\u8bd5\u9000\u51fa\u91cd\u8bd5\u6216\u5237\u65b0",
      Error_MTS_Fetch_Urls_Text: "MTS\u83b7\u53d6\u53d6\u6570\u5931\u8d25",
      Error_Load_M3U8_Failed_Text: "\u83b7\u53d6m3u8\u6587\u4ef6\u5931\u8d25",
      Error_Load_M3U8_Timeout_Text: "\u83b7\u53d6m3u8\u6587\u4ef6\u8d85\u65f6",
      Error_M3U8_Decode_Text: "\u83b7\u53d6m3u8\u6587\u4ef6\u89e3\u6790\u5931\u8d25",
      Error_TX_Decode_Text: "\u89e3\u6790\u6570\u636e\u51fa\u9519",
      Error_Waiting_Timeout_Text: "\u7f13\u51b2\u6570\u636e\u8d85\u65f6\uff0c\u8bf7\u5c1d\u8bd5\u9000\u51fa\u91cd\u8bd5\u6216\u5237\u65b0",
      Error_Invalidate_Source: "\u64ad\u653e\u5730\u5740\u683c\u5f0f\u9700\u8981\u4e3amp4\u3001mp3\u3001m3u8\u3001mpd\u6216flv",
      Error_Empty_Source: "\u64ad\u653e\u5730\u5740\u4e0d\u80fd\u4e3a\u7a7a",
      Error_Vid_Empty_Source: "vid\u5bf9\u5e94\u7684\u89c6\u9891\u5730\u5740\u8fd8\u672a\u83b7\u53d6\u5230",
      Error_Fetch_NotStream: "\u6b64vid\u6ca1\u6709\u53ef\u64ad\u653e\u89c6\u9891",
      Error_Not_Found: "\u64ad\u653e\u5730\u5740\u4e0d\u5b58\u5728",
      Live_End: "\u4eb2\uff0c\u76f4\u64ad\u5df2\u7ed3\u675f",
      Play_Before_Fullscreen: "\u64ad\u653e\u540e\u518d\u5168\u5c4f",
      Can_Not_Seekable: "\u4e0d\u80fdseek\u5230\u8fd9\u91cc",
      Cancel_Text: "\u53d6\u6d88",
      OK_Text: "\u786e\u8ba4",
      Auto_Stream_Tip_Text: "\u7f51\u7edc\u4e0d\u7ed9\u529b\uff0c\u662f\u5426\u5207\u6362\u5230$$",
      Request_Block_Text: "\u6d4f\u89c8\u5668\u5b89\u5168\u7b56\u7565\u89c6\u9891\u5730\u5740\u4e0d\u80fd\u4e3ahttp\u534f\u8bae\uff0c\u4e0e\u7f51\u7ad9https\u534f\u8bae\u4e0d\u4e00\u81f4",
      Open_Html_By_File: "\u4e0d\u80fd\u76f4\u63a5\u5728\u6d4f\u89c8\u5668\u6253\u5f00html\u6587\u4ef6\uff0c\u8bf7\u90e8\u7f72\u5230\u670d\u52a1\u7aef",
      Maybe_Cors_Error: "\u8bf7\u786e\u8ba4\u662f\u5426\u5f00\u542f\u4e86\u5141\u8bb8\u8de8\u57df\u8bbf\u95ee<a href='https://help.aliyun.com/document_detail/62950.html' target='_blank'>\u53c2\u8003\u6587\u6863</a>",
      Speed_Switch_To: "\u500d\u901f\u5207\u6362\u5230 ",
      Curent_Volume: "\u5f53\u524d\u97f3\u91cf\uff1a",
      Volume_Mute: "\u8bbe\u7f6e\u4e3a\u9759\u97f3",
      Volume_UnMute: "\u8bbe\u7f6e\u4e3a\u975e\u9759\u97f3",
      ShiftLiveTime_Error: "\u76f4\u64ad\u5f00\u59cb\u65f6\u95f4\u4e0d\u80fd\u5927\u4e8e\u76f4\u64ad\u7ed3\u675f\u65f6\u95f4",
      Error_Not_Support_Format_On_Mobile: "\u79fb\u52a8\u7aef\u4e0d\u652f\u6301flv\u3001rmtp\u89c6\u9891\uff0c\u8bf7\u4f7f\u7528m3u8",
      SessionId_Ticket_Invalid: "DRM\u89c6\u9891\u64ad\u653e\uff0csessionId\u548cticket\u5c5e\u6027\u4e0d\u80fd\u4e3a\u7a7a",
      Http_Error: "Http\u7f51\u7edc\u8bf7\u6c42\u5931\u8d25",
      Http_Timeout: "http\u8bf7\u6c42\u8d85\u65f6",
      DRM_License_Expired: "DRM license\u8d85\u65f6\uff0c\u8bf7\u5237\u65b0",
      Not_Support_DRM: "\u6d4f\u89c8\u5668\u4e0d\u652f\u6301DRM\u89c6\u9891\u7684\u64ad\u653e",
      CC_Switch_To: "\u5b57\u5e55\u5207\u6362\u5230 ",
      AudioTrack_Switch_To: "\u97f3\u8f68\u5207\u6362\u5230 ",
      Subtitle: "\u5b57\u5e55",
      AudioTrack: "\u97f3\u8f68",
      Quality: "\u6e05\u6670\u5ea6",
      Auto: "\u81ea\u52a8",
      Quality_Switch_To: "\u6e05\u6670\u5ea6\u5207\u6362\u5230 ",
      Fullscreen: "\u5168\u5c4f",
      Setting: "\u8bbe\u7f6e",
      Volume: "\u97f3\u91cf",
      Play: "\u64ad\u653e",
      Pause: "\u6682\u505c",
      CloseSubtitle: "\u5173\u95ed\u5b57\u5e55",
      OpenSubtitle: "\u6253\u5f00\u5b57\u5e55",
      ExistFullScreen: "\u9000\u51fa\u5168\u5c4f",
      Muted: "\u9759\u97f3",
      Retry: "\u91cd\u8bd5",
      SwitchToLive: "\u8fd4\u56de\u76f4\u64ad",
      iOSNotSupportVodEncription: "iOS\u4e0d\u652f\u6301\u70b9\u64ad\u52a0\u5bc6\u64ad\u653e",
      UseChromeForVodEncription: "\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u70b9\u64ad\u52a0\u5bc6\u64ad\u653e\uff0c\u8bf7\u4f7f\u7528\u6700\u65b0Chrome\u6d4f\u89c8\u5668"
    }
  }
    , {}],
  13: [function (e, t, i) {
    var n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    if (window.Uint8Array)
      for (var d = new Uint8Array(256), r = 0; r < n.length; r++)
        d[n.charCodeAt(r)] = r;
    var u = function (e) {
      for (var t = "", i = 0; i < e.length; i += 16e3) {
        var r = e.subarray(i, i + 16e3);
        t += String.fromCharCode.apply(null, r)
      }
      return t
    };
    unpackPlayReady = function (e) {
      var t = function (e, t, i) {
        if (!e)
          return "";
        var r;
        if (i || e.byteLength % 2 == 0 || console.log("Data has an incorrect length, must be even."),
          e instanceof ArrayBuffer)
          r = e;
        else {
          var o = new Uint8Array(e.byteLength);
          o.set(new Uint8Array(e)),
            r = o.buffer
        }
        for (var n = Math.floor(e.byteLength / 2), a = new Uint16Array(n), s = new DataView(r), l = 0; l < n; l++)
          a[l] = s.getUint16(2 * l, t);
        return u(a)
      }(e, !0, !0);
      if (-1 != t.indexOf("PlayReadyKeyMessage")) {
        for (var i = (new DOMParser).parseFromString(t, "application/xml"), r = i.getElementsByTagName("HttpHeader"), o = {}, n = 0; n < r.length; ++n) {
          var a = r[n].querySelector("name")
            , s = r[n].querySelector("value");
          o[a.textContent] = s.textContent
        }
        return {
          header: o,
          changange: i.querySelector("Challenge").textContent
        }
      }
      console.log("PlayReady request is already unwrapped.")
    }
      ,
      t.exports = {
        decode: function (e) {
          var t, i, r, o, n, a = .75 * e.length, s = e.length, l = 0;
          "=" === e[e.length - 1] && (a--,
            "=" === e[e.length - 2] && a--);
          var u = new ArrayBuffer(a)
            , c = new Uint8Array(u);
          for (t = 0; t < s; t += 4)
            i = d[e.charCodeAt(t)],
              r = d[e.charCodeAt(t + 1)],
              o = d[e.charCodeAt(t + 2)],
              n = d[e.charCodeAt(t + 3)],
              c[l++] = i << 2 | r >> 4,
              c[l++] = (15 & r) << 4 | o >> 2,
              c[l++] = (3 & o) << 6 | 63 & n;
          return u
        },
        encode: function (e) {
          var t, i = new Uint8Array(e), r = i.length, o = "";
          for (t = 0; t < r; t += 3)
            o += n[i[t] >> 2],
              o += n[(3 & i[t]) << 4 | i[t + 1] >> 4],
              o += n[(15 & i[t + 1]) << 2 | i[t + 2] >> 6],
              o += n[63 & i[t + 2]];
          return r % 3 == 2 ? o = o.substring(0, o.length - 1) + "=" : r % 3 == 1 && (o = o.substring(0, o.length - 2) + "=="),
            o
        },
        unpackPlayReady: unpackPlayReady
      }
  }
    , {}],
  14: [function (e, t, i) {
    var r = e("./oo")
      , o = e("../player/base/event/eventtype");
    t.exports.stopPropagation = function (e) {
      window.event ? window.event.cancelBubble = !0 : e.stopPropagation()
    }
      ,
      t.exports.register = function (e) {
        e.util = {
          stopPropagation: t.exports.stopPropagation
        },
          e.Component = r.extend,
          e.EventType = o.Player
      }
  }
    , {
    "../player/base/event/eventtype": 43,
    "./oo": 27
  }],
  15: [function (e, t, i) {
    var r = e("../lang/index");
    t.exports.LOAD_START = "loadstart",
      t.exports.LOADED_METADATA = "loadedmetadata",
      t.exports.LOADED_DATA = "loadeddata",
      t.exports.PROGRESS = "progress",
      t.exports.CAN_PLAY = "canplay",
      t.exports.CAN_PLYA_THROUGH = "canplaythrough",
      t.exports.PLAY = "play",
      t.exports.PAUSE = "pause",
      t.exports.ENDED = "ended",
      t.exports.PLAYING = "playing",
      t.exports.WAITING = "waiting",
      t.exports.ERROR = "error",
      t.exports.SUSPEND = "suspend",
      t.exports.STALLED = "stalled",
      t.exports.AuthKeyExpiredEvent = "authkeyexpired",
      t.exports.DRMKeySystem = {
        4: "com.microsoft.playready",
        5: "com.widevine.alpha"
      },
      t.exports.EncryptionType = {
        Private: 1,
        Standard: 2,
        ChinaDRM: 3,
        PlayReady: 4,
        Widevine: 5
      },
      t.exports.VodEncryptionType = {
        AliyunVoDEncryption: 1,
        HLSEncryption: 2
      },
      t.exports.DRMType = {
        Widevine: "Widevine",
        PlayReady: "PlayReady"
      },
      t.exports.ErrorCode = {
        InvalidParameter: 4001,
        AuthKeyExpired: 4002,
        InvalidSourceURL: 4003,
        NotFoundSourceURL: 4004,
        StartLoadData: 4005,
        LoadedMetadata: 4006,
        PlayingError: 4007,
        LoadingTimeout: 4008,
        RequestDataError: 4009,
        EncrptyVideoNotSupport: 4010,
        FormatNotSupport: 4011,
        PlayauthDecode: 4012,
        PlayDataDecode: 4013,
        NetworkUnavaiable: 4014,
        UserAbort: 4015,
        NetworkError: 4016,
        URLsIsEmpty: 4017,
        CrossDomain: 4027,
        OtherError: 4400,
        ServerAPIError: 4500,
        FlashNotInstalled: 4600
      },
      t.exports.AuthKeyExpired = 7200,
      t.exports.AuthKeyRefreshExpired = 7e3,
      t.exports.AuthInfoExpired = 100,
      t.exports.VideoErrorCode = {
        1: 4015,
        2: 4016,
        3: 4013,
        4: 4400
      },
      t.exports.IconType = {
        FontClass: "fontclass",
        Symbol: "symbol",
        Sprite: "Sprite"
      },
      t.exports.SelectedStreamLevel = "selectedStreamLevel",
      t.exports.SelectedCC = "selectedCC",
      t.exports.WidthMapToLevel = {
        0: "OD",
        640: "FD",
        960: "LD",
        1280: "SD",
        1920: "HD",
        2580: "2K",
        3840: "4K"
      };
    var o = function () {
      t.exports.VideoErrorCodeText = {
        1: r.get("Error_Load_Abort_Text"),
        2: r.get("Error_Network_Text"),
        3: r.get("Error_Decode_Text"),
        4: r.get("Error_Server_Network_NotSupport_Text")
      },
        t.exports.VideoLevels = {
          0: r.get("OD"),
          640: r.get("FD"),
          960: r.get("LD"),
          1280: r.get("SD"),
          1920: r.get("HD"),
          2580: r.get("2K"),
          3840: r.get("4K")
        },
        t.exports.QualityLevels = {
          OD: r.get("OD"),
          LD: r.get("LD"),
          FD: r.get("FD"),
          SD: r.get("SD"),
          HD: r.get("HD"),
          "2K": r.get("2K"),
          "4K": r.get("4K"),
          XLD: r.get("XLD"),
          FHD: r.get("FHD"),
          SQ: r.get("SQ"),
          HQ: r.get("HQ")
        },
        t.exports.SpeedLevels = [{
          key: .5,
          text: r.get("Speed_05X_Text")
        }, {
          key: 1,
          text: r.get("Speed_1X_Text")
        }, {
          key: 1.25,
          text: r.get("Speed_125X_Text")
        }, {
          key: 1.5,
          text: r.get("Speed_15X_Text")
        }, {
          key: 2,
          text: r.get("Speed_2X_Text")
        }]
    };
    o(),
      t.exports.updateByLanguage = o
  }
    , {
    "../lang/index": 11
  }],
  16: [function (e, t, i) {
    t.exports.get = function (e) {
      for (var t = e + "", i = document.cookie.split(";"), r = 0; r < i.length; r++) {
        var o = i[r].trim();
        if (0 == o.indexOf(t))
          return unescape(o.substring(t.length + 1, o.length))
      }
      return ""
    }
      ,
      t.exports.set = function (e, t, i) {
        var r = new Date;
        r.setTime(r.getTime() + 24 * i * 60 * 60 * 1e3);
        var o = "expires=" + r.toGMTString();
        document.cookie = e + "=" + escape(t) + "; " + o
      }
  }
    , {}],
  17: [function (e, i, t) {
    var r = e("./object");
    i.exports.cache = {},
      i.exports.guid = function (e, t) {
        var i, r, o = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""), n = [];
        if (t = t || o.length,
          e)
          for (i = 0; i < e; i++)
            n[i] = o[0 | Math.random() * t];
        else
          for (n[8] = n[13] = n[18] = n[23] = "-",
            n[14] = "4",
            i = 0; i < 36; i++)
            n[i] || (r = 0 | 16 * Math.random(),
              n[i] = o[19 == i ? 3 & r | 8 : r]);
        return n.join("")
      }
      ,
      i.exports.expando = "vdata" + (new Date).getTime(),
      i.exports.getData = function (e) {
        var t = e[i.exports.expando];
        return t || (t = e[i.exports.expando] = i.exports.guid(),
          i.exports.cache[t] = {}),
          i.exports.cache[t]
      }
      ,
      i.exports.hasData = function (e) {
        var t = "";
        return e && (t = e[i.exports.expando]),
          !(!t || r.isEmpty(i.exports.cache[t]))
      }
      ,
      i.exports.removeData = function (t) {
        var e = "";
        if (t && (e = t[i.exports.expando]),
          e) {
          delete i.exports.cache[e];
          try {
            delete t[i.exports.expando]
          } catch (e) {
            t.removeAttribute ? t.removeAttribute(i.exports.expando) : t[i.exports.expando] = null
          }
        }
      }
  }
    , {
    "./object": 26
  }],
  18: [function (e, c, t) {
    var r = e("./object");
    c.exports.el = function (e) {
      return document.getElementById(e)
    }
      ,
      c.exports.createEl = function (e, t) {
        var i;
        return e = e || "div",
          t = t || {},
          i = document.createElement(e),
          r.each(t, function (e, t) {
            -1 !== e.indexOf("aria-") || "role" == e ? i.setAttribute(e, t) : i[e] = t
          }),
          i
      }
      ,
      c.exports.addClass = function (e, t) {
        -1 == (" " + e.className + " ").indexOf(" " + t + " ") && (e.className = "" === e.className ? t : e.className + " " + t)
      }
      ,
      c.exports.removeClass = function (e, t) {
        var i, r;
        if (-1 != e.className.indexOf(t)) {
          for (r = (i = e.className.split(" ")).length - 1; 0 <= r; r--)
            i[r] === t && i.splice(r, 1);
          e.className = i.join(" ")
        }
      }
      ,
      c.exports.hasClass = function (e, t) {
        return -1 != e.className.indexOf(t)
      }
      ,
      c.exports.getClasses = function (e) {
        return e.className ? e.className.split(" ") : []
      }
      ,
      c.exports.getElementAttributes = function (e) {
        var t, i, r, o, n;
        if (t = {},
          i = ",autoplay,controls,loop,muted,default,",
          e && e.attributes && 0 < e.attributes.length)
          for (var a = (r = e.attributes).length - 1; 0 <= a; a--)
            o = r[a].name,
              n = r[a].value,
              "boolean" != typeof e[o] && -1 === i.indexOf("," + o + ",") || (n = null !== n),
              t[o] = n;
        return t
      }
      ,
      c.exports.insertFirst = function (e, t) {
        t.firstChild ? t.insertBefore(e, t.firstChild) : t.appendChild(e)
      }
      ,
      c.exports.blockTextSelection = function () {
        document.body.focus(),
          document.onselectstart = function () {
            return !1
          }
      }
      ,
      c.exports.unblockTextSelection = function () {
        document.onselectstart = function () {
          return !0
        }
      }
      ,
      c.exports.css = function (i, e, t) {
        return !(!i || !i.style) && (e && t ? (i.style[e] = t,
          !0) : t || "string" != typeof e ? !t && "object" == typeof e && (r.each(e, function (e, t) {
            i.style[e] = t
          }),
            !0) : i.style[e])
      }
      ,
      c.exports.getTransformName = function (e) {
        var t, i, r = ["transform", "WebkitTransform", "MozTransform", "msTransform", "OTransform"], o = r[0];
        for (t = 0,
          i = r.length; t < i; t++)
          if (void 0 !== e.style[r[t]]) {
            o = r[t];
            break
          }
        return o
      }
      ,
      c.exports.getTransformEventName = function (e, t) {
        var i, r, o = ["", "Webkit", "Moz", "ms", "O"], n = t.toLowerCase(), a = ["transform", "WebkitTransform", "MozTransform", "msTransform", "OTransform"];
        for (i = 0,
          r = a.length; i < r; i++)
          if (void 0 !== e.style[a[i]]) {
            0 != i && (n = o[i] + t);
            break
          }
        return n
      }
      ,
      c.exports.addCssByStyle = function (e) {
        var t = document
          , i = t.createElement("style");
        if (i.setAttribute("type", "text/css"),
          i.styleSheet)
          i.styleSheet.cssText = e;
        else {
          var r = t.createTextNode(e);
          i.appendChild(r)
        }
        var o = t.getElementsByTagName("head");
        o.length ? o[0].appendChild(i) : t.documentElement.appendChild(i)
      }
      ,
      c.exports.getTranslateX = function (e) {
        var t = 0;
        if (e)
          try {
            var i = window.getComputedStyle(e)
              , r = c.exports.getTransformName(e);
            t = new WebKitCSSMatrix(i[r]).m41
          } catch (e) {
            console.log(e)
          }
        return t
      }
      ,
      c.exports.getPointerPosition = function (e, t) {
        var i = {}
          , r = c.exports.findPosition(e)
          , o = e.offsetWidth
          , n = e.offsetHeight
          , a = r.top
          , s = r.left
          , l = t.pageY
          , u = t.pageX;
        return t.changedTouches && (u = t.changedTouches[0].pageX,
          l = t.changedTouches[0].pageY),
          i.y = Math.max(0, Math.min(1, (a - l + n) / n)),
          i.x = Math.max(0, Math.min(1, (u - s) / o)),
          i
      }
      ,
      c.exports.findPosition = function (e) {
        var t;
        if (e.getBoundingClientRect && e.parentNode && (t = e.getBoundingClientRect()),
          !t)
          return {
            left: 0,
            top: 0
          };
        var i = document.documentElement
          , r = document.body
          , o = i.clientLeft || r.clientLeft || 0
          , n = window.pageXOffset || r.scrollLeft
          , a = t.left + n - o
          , s = i.clientTop || r.clientTop || 0
          , l = window.pageYOffset || r.scrollTop
          , u = t.top + l - s;
        return {
          left: Math.round(a),
          top: Math.round(u)
        }
      }
  }
    , {
    "./object": 26
  }],
  19: [function (e, l, t) {
    var u = e("./object")
      , c = e("./data")
      , i = e("./ua")
      , r = e("fastclick");
    function d(t, i, e, r) {
      u.each(e, function (e) {
        t(i, e, r)
      })
    }
    l.exports.on = function (n, e, t) {
      if (n) {
        if (u.isArray(e))
          return d(l.exports.on, n, e, t);
        i.IS_MOBILE && "click" == e && r(n);
        var a = c.getData(n);
        a.handlers || (a.handlers = {}),
          a.handlers[e] || (a.handlers[e] = []),
          t.guid || (t.guid = c.guid()),
          a.handlers[e].push(t),
          a.dispatcher || (a.disabled = !1,
            a.dispatcher = function (e) {
              if (!a.disabled) {
                e = l.exports.fixEvent(e);
                var t = a.handlers[e.type];
                if (t)
                  for (var i = t.slice(0), r = 0, o = i.length; r < o && !e.isImmediatePropagationStopped(); r++)
                    i[r].call(n, e)
              }
            }
          ),
          1 == a.handlers[e].length && (n.addEventListener ? n.addEventListener(e, a.dispatcher, !1) : n.attachEvent && n.attachEvent("on" + e, a.dispatcher))
      }
    }
      ,
      l.exports.off = function (t, e, i) {
        if (t && c.hasData(t)) {
          var r = c.getData(t);
          if (r.handlers) {
            if (u.isArray(e))
              return d(l.exports.off, t, e, i);
            var o = function (e) {
              r.handlers[e] = [],
                l.exports.cleanUpEvents(t, e)
            };
            if (e) {
              var n = r.handlers[e];
              if (n)
                if (i) {
                  if (i.guid)
                    for (var a = 0; a < n.length; a++)
                      n[a].guid === i.guid && n.splice(a--, 1);
                  l.exports.cleanUpEvents(t, e)
                } else
                  o(e)
            } else
              for (var s in r.handlers)
                o(s)
          }
        }
      }
      ,
      l.exports.cleanUpEvents = function (e, t) {
        var i = c.getData(e);
        0 === i.handlers[t].length && (delete i.handlers[t],
          e.removeEventListener ? e.removeEventListener(t, i.dispatcher, !1) : e.detachEvent && e.detachEvent("on" + t, i.dispatcher)),
          u.isEmpty(i.handlers) && (delete i.handlers,
            delete i.dispatcher,
            delete i.disabled),
          u.isEmpty(i) && c.removeData(e)
      }
      ,
      l.exports.fixEvent = function (e) {
        function t() {
          return !0
        }
        function i() {
          return !1
        }
        if (!e || !e.isPropagationStopped) {
          var r = e || window.event;
          for (var o in e = {},
            r)
            "layerX" !== o && "layerY" !== o && "keyboardEvent.keyLocation" !== o && ("returnValue" == o && r.preventDefault || (e[o] = r[o]));
          if (e.target || (e.target = e.srcElement || document),
            e.relatedTarget = e.fromElement === e.target ? e.toElement : e.fromElement,
            e.preventDefault = function () {
              r.preventDefault && r.preventDefault(),
                e.returnValue = !1,
                e.isDefaultPrevented = t,
                e.defaultPrevented = !0
            }
            ,
            e.isDefaultPrevented = i,
            e.defaultPrevented = !1,
            e.stopPropagation = function () {
              r.stopPropagation && r.stopPropagation(),
                e.cancelBubble = !0,
                e.isPropagationStopped = t
            }
            ,
            e.isPropagationStopped = i,
            e.stopImmediatePropagation = function () {
              r.stopImmediatePropagation && r.stopImmediatePropagation(),
                e.isImmediatePropagationStopped = t,
                e.stopPropagation()
            }
            ,
            e.isImmediatePropagationStopped = i,
            null != e.clientX) {
            var n = document.documentElement
              , a = document.body;
            e.pageX = e.clientX + (n && n.scrollLeft || a && a.scrollLeft || 0) - (n && n.clientLeft || a && a.clientLeft || 0),
              e.pageY = e.clientY + (n && n.scrollTop || a && a.scrollTop || 0) - (n && n.clientTop || a && a.clientTop || 0)
          }
          e.which = e.charCode || e.keyCode,
            null != e.button && (e.button = 1 & e.button ? 0 : 4 & e.button ? 1 : 2 & e.button ? 2 : 0)
        }
        return e
      }
      ,
      l.exports.trigger = function (e, t) {
        if (e) {
          var i = c.hasData(e) ? c.getData(e) : {}
            , r = e.parentNode || e.ownerDocument;
          if ("string" == typeof t) {
            var o = null;
            (e.paramData || 0 == e.paramData) && (o = e.paramData,
              e.paramData = null,
              e.removeAttribute(o)),
              t = {
                type: t,
                target: e,
                paramData: o
              }
          }
          if (t = l.exports.fixEvent(t),
            i.dispatcher && i.dispatcher.call(e, t),
            r && !t.isPropagationStopped() && !1 !== t.bubbles)
            l.exports.trigger(r, t);
          else if (!r && !t.defaultPrevented) {
            var n = c.getData(t.target);
            t.target[t.type] && (n.disabled = !0,
              "function" == typeof t.target[t.type] && t.target[t.type](),
              n.disabled = !1)
          }
          return !t.defaultPrevented
        }
      }
      ,
      l.exports.one = function (e, t, i) {
        if (e) {
          if (u.isArray(t))
            return d(l.exports.one, e, t, i);
          var r = function () {
            l.exports.off(e, t, r),
              i.apply(this, arguments)
          };
          r.guid = i.guid = i.guid || c.guid(),
            l.exports.on(e, t, r)
        }
      }
  }
    , {
    "./data": 17,
    "./object": 26,
    "./ua": 31,
    fastclick: 1
  }],
  20: [function (e, t, i) {
    var o = e("./data");
    t.exports.bind = function (e, t, i) {
      t.guid || (t.guid = o.guid());
      var r = function () {
        return t.apply(e, arguments)
      };
      return r.guid = i ? i + "_" + t.guid : t.guid,
        r
    }
  }
    , {
    "./data": 17
  }],
  21: [function (e, t, i) {
    var r = /^((?:[a-zA-Z0-9+\-.]+:)?)(\/\/[^\/\;?#]*)?(.*?)??(;.*?)?(\?.*?)?(#.*?)?$/
      , c = /^([^\/;?#]*)(.*)$/
      , o = /(?:\/|^)\.(?=\/)/g
      , n = /(?:\/|^)\.\.\/(?!\.\.\/).*?(?=\/)/g
      , d = {
        buildAbsoluteURL: function (e, t, i) {
          if (i = i || {},
            e = e.trim(),
            !(t = t.trim())) {
            if (!i.alwaysNormalize)
              return e;
            var r = d.parseURL(e);
            if (!r)
              throw new Error("Error trying to parse base URL.");
            return r.path = d.normalizePath(r.path),
              d.buildURLFromParts(r)
          }
          var o = d.parseURL(t);
          if (!o)
            throw new Error("Error trying to parse relative URL.");
          if (o.scheme)
            return i.alwaysNormalize ? (o.path = d.normalizePath(o.path),
              d.buildURLFromParts(o)) : t;
          var n = d.parseURL(e);
          if (!n)
            throw new Error("Error trying to parse base URL.");
          if (!n.netLoc && n.path && "/" !== n.path[0]) {
            var a = c.exec(n.path);
            n.netLoc = a[1],
              n.path = a[2]
          }
          n.netLoc && !n.path && (n.path = "/");
          var s = {
            scheme: n.scheme,
            netLoc: o.netLoc,
            path: null,
            params: o.params,
            query: o.query,
            fragment: o.fragment
          };
          if (!o.netLoc && (s.netLoc = n.netLoc,
            "/" !== o.path[0]))
            if (o.path) {
              var l = n.path
                , u = l.substring(0, l.lastIndexOf("/") + 1) + o.path;
              s.path = d.normalizePath(u)
            } else
              s.path = n.path,
                o.params || (s.params = n.params,
                  o.query || (s.query = n.query));
          return null === s.path && (s.path = i.alwaysNormalize ? d.normalizePath(o.path) : o.path),
            d.buildURLFromParts(s)
        },
        parseURL: function (e) {
          var t = r.exec(e);
          return t ? {
            scheme: t[1] || "",
            netLoc: t[2] || "",
            path: t[3] || "",
            params: t[4] || "",
            query: t[5] || "",
            fragment: t[6] || ""
          } : null
        },
        normalizePath: function (e) {
          for (e = e.split("").reverse().join("").replace(o, ""); e.length !== (e = e.replace(n, "")).length;)
            ;
          return e.split("").reverse().join("")
        },
        buildURLFromParts: function (e) {
          return e.scheme + e.netLoc + e.path + e.params + e.query + e.fragment
        }
      };
    t.exports = d
  }
    , {}],
  22: [function (e, t, i) {
    var r = /^(\d+)x(\d+)$/
      , o = /\s*(.+?)\s*=((?:\".*?\")|.*?)(?:,|$)/g
      , n = function (e) {
        for (var t in "string" == typeof e && (e = this.parseAttrList(e)),
          e)
          e.hasOwnProperty(t) && (this[t] = e[t])
      };
    n.prototype = {
      decimalInteger: function (e) {
        var t = parseInt(this[e], 10);
        return t > Number.MAX_SAFE_INTEGER ? 1 / 0 : t
      },
      hexadecimalInteger: function (e) {
        if (this[e]) {
          var t = (this[e] || "0x").slice(2);
          t = (1 & t.length ? "0" : "") + t;
          for (var i = new Uint8Array(t.length / 2), r = 0; r < t.length / 2; r++)
            i[r] = parseInt(t.slice(2 * r, 2 * r + 2), 16);
          return i
        }
        return null
      },
      hexadecimalIntegerAsNumber: function (e) {
        var t = parseInt(this[e], 16);
        return t > Number.MAX_SAFE_INTEGER ? 1 / 0 : t
      },
      decimalFloatingPoint: function (e) {
        return parseFloat(this[e])
      },
      enumeratedString: function (e) {
        return this[e]
      },
      decimalResolution: function (e) {
        var t = r.exec(this[e]);
        if (null !== t)
          return {
            width: parseInt(t[1], 10),
            height: parseInt(t[2], 10)
          }
      },
      parseAttrList: function (e) {
        var t, i = {};
        for (o.lastIndex = 0; null !== (t = o.exec(e));) {
          var r = t[2];
          0 === r.indexOf('"') && r.lastIndexOf('"') === r.length - 1 && (r = r.slice(1, -1)),
            i[t[1]] = r
        }
        return i
      }
    },
      t.exports = n
  }
    , {}],
  23: [function (e, t, i) {
    var P = e("./attrlist")
      , r = e("../io")
      , o = e("./URLToolkit")
      , c = /#EXT-X-STREAM-INF:([^\n\r]*)[\r\n]+([^\r\n]+)/g
      , u = /#EXT-X-MEDIA:(.*)/g
      , w = new RegExp([/#EXTINF:(\d*(?:\.\d+)?)(?:,(.*)\s+)?/.source, /|(?!#)(\S+)/.source, /|#EXT-X-BYTERANGE:*(.+)/.source, /|#EXT-X-PROGRAM-DATE-TIME:(.+)/.source, /|#.*/.source].join(""), "g")
      , C = /(?:(?:#(EXTM3U))|(?:#EXT-X-(PLAYLIST-TYPE):(.+))|(?:#EXT-X-(MEDIA-SEQUENCE): *(\d+))|(?:#EXT-X-(TARGETDURATION): *(\d+))|(?:#EXT-X-(KEY):(.+))|(?:#EXT-X-(START):(.+))|(?:#EXT-X-(ENDLIST))|(?:#EXT-X-(DISCONTINUITY-SEQ)UENCE:(\d+))|(?:#EXT-X-(DIS)CONTINUITY))|(?:#EXT-X-(VERSION):(\d+))|(?:#EXT-X-(MAP):(.+))|(?:(#)(.*):(.*))|(?:(#)(.*))(?:.*)\r?\n?/
      , k = function () {
        this.method = null,
          this.key = null,
          this.iv = null,
          this._uri = null
      }
      , I = function () {
        this._url = null,
          this._byteRange = null,
          this._decryptdata = null,
          this.tagList = []
      };
    I.prototype.getUrl = function () {
      return !this._url && this.relurl && (this._url = o.buildAbsoluteURL(this.baseurl, this.relurl, {
        alwaysNormalize: !0
      })),
        this._url
    }
      ,
      I.prototype.Seturl = function (e) {
        this._url = e
      }
      ,
      I.prototype.getProgramDateTime = function () {
        return !this._programDateTime && this.rawProgramDateTime && (this._programDateTime = new Date(Date.parse(this.rawProgramDateTime))),
          this._programDateTime
      }
      ,
      I.prototype.GetbyteRange = function () {
        if (!this._byteRange) {
          var e = this._byteRange = [];
          if (this.rawByteRange) {
            var t = this.rawByteRange.split("@", 2);
            if (1 === t.length) {
              var i = this.lastByteRangeEndOffset;
              e[0] = i || 0
            } else
              e[0] = parseInt(t[1]);
            e[1] = parseInt(t[0]) + e[0]
          }
        }
        return this._byteRange
      }
      ,
      I.prototype.getByteRangeStartOffset = function () {
        return this.byteRange[0]
      }
      ,
      I.prototype.getByteRangeEndOffset = function () {
        return this.byteRange[1]
      }
      ;
    I.prototype.getDecryptdata = function () {
      return this._decryptdata || (this._decryptdata = this.fragmentDecryptdataFromLevelkey(this.levelkey, this.sn)),
        this._decryptdata
    }
      ;
    var n = function () {
      this.loaders = {}
    };
    n.prototype = {
      parseMasterPlaylist: function (e, t) {
        var i, r = [];
        for (c.lastIndex = 0; null != (i = c.exec(e));) {
          var o = {}
            , n = o.attrs = new P(i[1]);
          o.url = this.resolve(i[2], t);
          var a = n.decimalResolution("RESOLUTION");
          a && (o.width = a.width,
            o.height = a.height),
            o.bitrate = n.decimalInteger("AVERAGE-BANDWIDTH") || n.decimalInteger("BANDWIDTH"),
            o.name = n.NAME;
          var s = n.CODECS;
          if (s) {
            s = s.split(/[ ,]+/);
            for (var l = 0; l < s.length; l++) {
              var u = s[l];
              -1 !== u.indexOf("avc1") ? o.videoCodec = this.avc1toavcoti(u) : -1 !== u.indexOf("hvc1") ? o.videoCodec = u : o.audioCodec = u
            }
          }
          r.push(o)
        }
        return r
      },
      parseMasterPlaylistMedia: function (e, t, i, r) {
        var o, n = [], a = 0;
        for (u.lastIndex = 0; null != (o = u.exec(e));) {
          var s = {}
            , l = new P(o[1]);
          l.TYPE === i && (s.groupId = l["GROUP-ID"],
            s.name = l.NAME,
            s.type = i,
            s["default"] = "YES" === l.DEFAULT,
            s.autoselect = "YES" === l.AUTOSELECT,
            s.forced = "YES" === l.FORCED,
            l.URI && (s.url = this.resolve(l.URI, t)),
            s.lang = l.LANGUAGE,
            s.name || (s.name = s.lang),
            r && (s.audioCodec = r),
            s.id = a++,
            n.push(s))
        }
        return n
      },
      avc1toavcoti: function (e) {
        var t, i = e.split(".");
        return 2 < i.length ? (t = i.shift() + ".",
          t += parseInt(i.shift()).toString(16),
          t += ("000" + parseInt(i.shift()).toString(16)).substr(-4)) : t = e,
          t
      },
      parseLevelPlaylist: function (e, t, i, r) {
        var o, n, a = 0, s = 0, l = {
          type: null,
          version: null,
          url: t,
          fragments: [],
          live: !0,
          startSN: 0
        }, u = new k, c = 0, d = null, p = new I;
        for (w.lastIndex = 0; null !== (o = w.exec(e));) {
          var h = o[1];
          if (h) {
            p.duration = parseFloat(h);
            var f = (" " + o[2]).slice(1);
            p.title = f || null,
              p.tagList.push(f ? ["INF", h, f] : ["INF", h])
          } else if (o[3]) {
            if (!isNaN(p.duration)) {
              var _ = a++;
              p.type = r,
                p.start = s,
                p.levelkey = u,
                p.sn = _,
                p.level = i,
                p.cc = c,
                p.baseurl = t,
                p.relurl = (" " + o[3]).slice(1),
                l.fragments.push(p),
                s += (d = p).duration,
                p = new I
            }
          } else if (o[4]) {
            if (p.rawByteRange = (" " + o[4]).slice(1),
              d) {
              var g = d.byteRangeEndOffset;
              g && (p.lastByteRangeEndOffset = g)
            }
          } else if (o[5])
            p.rawProgramDateTime = (" " + o[5]).slice(1),
              p.tagList.push(["PROGRAM-DATE-TIME", p.rawProgramDateTime]),
              void 0 === l.programDateTime && (l.programDateTime = new Date(new Date(Date.parse(o[5])) - 1e3 * s));
          else {
            for (o = o[0].match(C),
              n = 1; n < o.length && void 0 === o[n]; n++)
              ;
            var y = (" " + o[n + 1]).slice(1)
              , v = (" " + o[n + 2]).slice(1);
            switch (o[n]) {
              case "#":
                p.tagList.push(v ? [y, v] : [y]);
                break;
              case "PLAYLIST-TYPE":
                l.type = y.toUpperCase();
                break;
              case "MEDIA-SEQUENCE":
                a = l.startSN = parseInt(y);
                break;
              case "TARGETDURATION":
                l.targetduration = parseFloat(y);
                break;
              case "VERSION":
                l.version = parseInt(y);
                break;
              case "EXTM3U":
                break;
              case "ENDLIST":
                l.live = !1;
                break;
              case "DIS":
                c++,
                  p.tagList.push(["DIS"]);
                break;
              case "DISCONTINUITY-SEQ":
                c = parseInt(y);
                break;
              case "KEY":
                var m = new P(y)
                  , S = m.enumeratedString("METHOD")
                  , T = m.URI
                  , b = m.hexadecimalInteger("IV");
                S && (u = new k,
                  T && 0 <= ["AES-128", "SAMPLE-AES"].indexOf(S) && (u.method = S,
                    u.baseuri = t,
                    u.reluri = T,
                    u.key = null,
                    u.iv = b));
                break;
              case "START":
                var x = new P(y).decimalFloatingPoint("TIME-OFFSET");
                isNaN(x) || (l.startTimeOffset = x);
                break;
              case "MAP":
                var E = new P(y);
                p.relurl = E.URI,
                  p.rawByteRange = E.BYTERANGE,
                  p.baseurl = t,
                  p.level = i,
                  p.type = r,
                  p.sn = "initSegment",
                  l.initSegment = p,
                  p = new I;
                break;
              default:
                console.log("line parsed but not handled: result")
            }
          }
        }
        return (p = d) && !p.relurl && (l.fragments.pop(),
          s -= p.duration),
          l.totalduration = s,
          l.averagetargetduration = s / l.fragments.length,
          l.endSN = a - 1,
          l
      },
      load: function (n, a) {
        var s = this;
        r.get(n, function (e) {
          var t = s.parseMasterPlaylist(e, n);
          if (t.length) {
            var i = s.parseMasterPlaylistMedia(e, n, "AUDIO", t[0].audioCodec)
              , r = s.parseMasterPlaylistMedia(e, n, "SUBTITLES");
            if (i.length) {
              var o = !1;
              i.forEach(function (e) {
                e.url || (o = !0)
              }),
                !1 === o && t[0].audioCodec && !t[0].attrs.AUDIO && (console.log("audio codec signaled in quality level, but no embedded audio track signaled, create one"),
                  i.unshift({
                    type: "main",
                    name: "main"
                  }))
            }
          }
          a({
            levels: t,
            audioTracks: i,
            subtitles: r,
            url: n
          })
        }, function (e) {
          console.log(e)
        })
      },
      resolve: function (e, t) {
        return o.buildAbsoluteURL(t, e, {
          alwaysNormalize: !0
        })
      },
      parseMasterPlaylist: function (e, t) {
        var i, r = [];
        for (c.lastIndex = 0; null != (i = c.exec(e));) {
          var o = {}
            , n = o.attrs = new P(i[1]);
          o.url = this.resolve(i[2], t);
          var a = n.decimalResolution("RESOLUTION");
          a && (o.width = a.width,
            o.height = a.height),
            o.bitrate = n.decimalInteger("AVERAGE-BANDWIDTH") || n.decimalInteger("BANDWIDTH"),
            o.name = n.NAME;
          var s = n.CODECS;
          if (s) {
            s = s.split(/[ ,]+/);
            for (var l = 0; l < s.length; l++) {
              var u = s[l];
              -1 !== u.indexOf("avc1") ? o.videoCodec = this.avc1toavcoti(u) : -1 !== u.indexOf("hvc1") ? o.videoCodec = u : o.audioCodec = u
            }
          }
          r.push(o)
        }
        return r
      },
      parseMasterPlaylistMedia: function (e, t, i, r) {
        var o, n = [], a = 0;
        for (u.lastIndex = 0; null != (o = u.exec(e));) {
          var s = {}
            , l = new P(o[1]);
          l.TYPE === i && (s.groupId = l["GROUP-ID"],
            s.name = l.NAME,
            s.type = i,
            s["default"] = "YES" === l.DEFAULT,
            s.autoselect = "YES" === l.AUTOSELECT,
            s.forced = "YES" === l.FORCED,
            l.URI && (s.url = this.resolve(l.URI, t)),
            s.lang = l.LANGUAGE,
            s.name || (s.name = s.lang),
            r && (s.audioCodec = r),
            s.id = a++,
            n.push(s))
        }
        return n
      },
      avc1toavcoti: function (e) {
        var t, i = e.split(".");
        return 2 < i.length ? (t = i.shift() + ".",
          t += parseInt(i.shift()).toString(16),
          t += ("000" + parseInt(i.shift()).toString(16)).substr(-4)) : t = e,
          t
      },
      parseLevelPlaylist: function (e, t, i, r) {
        var o, n, a = 0, s = 0, l = {
          type: null,
          version: null,
          url: t,
          fragments: [],
          live: !0,
          startSN: 0
        }, u = new k, c = 0, d = null, p = new I;
        for (w.lastIndex = 0; null !== (o = w.exec(e));) {
          var h = o[1];
          if (h) {
            p.duration = parseFloat(h);
            var f = (" " + o[2]).slice(1);
            p.title = f || null,
              p.tagList.push(f ? ["INF", h, f] : ["INF", h])
          } else if (o[3]) {
            if (!isNaN(p.duration)) {
              var _ = a++;
              p.type = r,
                p.start = s,
                p.levelkey = u,
                p.sn = _,
                p.level = i,
                p.cc = c,
                p.baseurl = t,
                p.relurl = (" " + o[3]).slice(1),
                l.fragments.push(p),
                s += (d = p).duration,
                p = new I
            }
          } else if (o[4]) {
            if (p.rawByteRange = (" " + o[4]).slice(1),
              d) {
              var g = d.byteRangeEndOffset;
              g && (p.lastByteRangeEndOffset = g)
            }
          } else if (o[5])
            p.rawProgramDateTime = (" " + o[5]).slice(1),
              p.tagList.push(["PROGRAM-DATE-TIME", p.rawProgramDateTime]),
              void 0 === l.programDateTime && (l.programDateTime = new Date(new Date(Date.parse(o[5])) - 1e3 * s));
          else {
            for (o = o[0].match(C),
              n = 1; n < o.length && void 0 === o[n]; n++)
              ;
            var y = (" " + o[n + 1]).slice(1)
              , v = (" " + o[n + 2]).slice(1);
            switch (o[n]) {
              case "#":
                p.tagList.push(v ? [y, v] : [y]);
                break;
              case "PLAYLIST-TYPE":
                l.type = y.toUpperCase();
                break;
              case "MEDIA-SEQUENCE":
                a = l.startSN = parseInt(y);
                break;
              case "TARGETDURATION":
                l.targetduration = parseFloat(y);
                break;
              case "VERSION":
                l.version = parseInt(y);
                break;
              case "EXTM3U":
                break;
              case "ENDLIST":
                l.live = !1;
                break;
              case "DIS":
                c++,
                  p.tagList.push(["DIS"]);
                break;
              case "DISCONTINUITY-SEQ":
                c = parseInt(y);
                break;
              case "KEY":
                var m = new P(y)
                  , S = m.enumeratedString("METHOD")
                  , T = m.URI
                  , b = m.hexadecimalInteger("IV");
                S && (u = new k,
                  T && 0 <= ["AES-128", "SAMPLE-AES"].indexOf(S) && (u.method = S,
                    u.baseuri = t,
                    u.reluri = T,
                    u.key = null,
                    u.iv = b));
                break;
              case "START":
                var x = new P(y).decimalFloatingPoint("TIME-OFFSET");
                isNaN(x) || (l.startTimeOffset = x);
                break;
              case "MAP":
                var E = new P(y);
                p.relurl = E.URI,
                  p.rawByteRange = E.BYTERANGE,
                  p.baseurl = t,
                  p.level = i,
                  p.type = r,
                  p.sn = "initSegment",
                  l.initSegment = p,
                  p = new I;
                break;
              default:
                console.log("line parsed but not handled: " + o)
            }
          }
        }
        return (p = d) && !p.relurl && (l.fragments.pop(),
          s -= p.duration),
          l.totalduration = s,
          l.averagetargetduration = s / l.fragments.length,
          l.endSN = a - 1,
          l
      }
    },
      t.exports = n
  }
    , {
    "../io": 24,
    "./URLToolkit": 21,
    "./attrlist": 22
  }],
  24: [function (e, s, t) {
    var h = e("./url");
    s.exports.get = function (e, t, i, r, o) {
      s.exports.ajax("GET", e, {}, t, i, r, o)
    }
      ,
      s.exports.post = function (e, t, i, r, o, n) {
        var a = {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Accept: "application/json"
        };
        s.exports.ajax("POST", e, t, i, r, o, n, a)
      }
      ,
      s.exports.postWithHeader = function (e, t, i, r, o) {
        s.exports.ajax("POST", e, t, r, o, !0, !1, i)
      }
      ,
      s.exports.ajax = function (e, t, i, r, o, n, a, s) {
        var l, u, c, d;
        o = o || function () { }
          ,
          "undefined" == typeof XMLHttpRequest && (window.XMLHttpRequest = function () {
            try {
              return new window.ActiveXObject("Msxml2.XMLHTTP.6.0")
            } catch (e) { }
            try {
              return new window.ActiveXObject("Msxml2.XMLHTTP.3.0")
            } catch (e) { }
            try {
              return new window.ActiveXObject("Msxml2.XMLHTTP")
            } catch (e) { }
            throw new Error("This browser does not support XMLHttpRequest.")
          }
          ),
          u = new XMLHttpRequest,
          c = h.parseUrl(t),
          d = window.location,
          !(c.protocol + c.host !== d.protocol + d.host) || !window.XDomainRequest || "withCredentials" in u ? (l = "file:" == c.protocol || "file:" == d.protocol,
            u.onreadystatechange = function () {
              4 === u.readyState && (200 === u.status || l && 0 === u.status ? r(u.responseText) : o(u.responseText))
            }
          ) : ((u = new window.XDomainRequest).onload = function () {
            r(u.responseText)
          }
            ,
            u.onerror = o,
            u.onprogress = function () { }
            ,
            u.ontimeout = o);
        try {
          if (void 0 === n && (n = !0),
            u.open(e, t, n),
            a && (u.withCredentials = !0),
            s)
            for (var p in s)
              s.hasOwnProperty(p) && u.setRequestHeader(p, s[p])
        } catch (e) {
          return void o(e)
        }
        try {
          u.send(i)
        } catch (e) {
          o(e)
        }
      }
      ,
      s.exports.jsonp = function (e, t, i) {
        var r = "jsonp_callback_" + Math.round(1e5 * Math.random())
          , o = document.createElement("script");
        e && (o.src = e + (0 <= e.indexOf("?") ? "&" : "?") + "callback=" + r + "&cb=" + r,
          o.onerror = function () {
            delete window[r],
              document.body.removeChild(o),
              i()
          }
          ,
          o.onload = function () {
            setTimeout(function () {
              window[r] && (delete window[r],
                document.body.removeChild(o))
            }, 0)
          }
          ,
          window[r] = function (e) {
            delete window[r],
              document.body.removeChild(o),
              t(e)
          }
          ,
          document.body.appendChild(o))
      }
      ,
      s.exports.loadJS = function (e, t) {
        var i = document.getElementsByTagName("HEAD").item(0)
          , r = document.createElement("script");
        r.type = "text/javascript",
          r.src = e,
          r.onload = function () {
            t && t()
          }
          ,
          i.appendChild(r)
      }
  }
    , {
    "./url": 32
  }],
  25: [function (e, t, i) {
    var s = e("./dom");
    t.exports.render = function (e, t) {
      var i = t.align ? t.align : "tl"
        , r = t.x ? t.x : 0
        , o = t.y ? t.y : 0
        , n = r.indexOf && 0 < r.indexOf("%") ? "" : "px"
        , a = o.indexOf && 0 < o.indexOf("%") ? "" : "px";
      "tl" === i ? s.css(e, {
        "float": "left",
        "margin-left": r + n,
        "margin-top": o + a
      }) : "tr" === i ? s.css(e, {
        "float": "right",
        "margin-right": r + n,
        "margin-top": o + a
      }) : "tlabs" === i ? s.css(e, {
        position: "absolute",
        left: r + n,
        top: o + a
      }) : "trabs" === i ? s.css(e, {
        position: "absolute",
        right: r + n,
        top: o + a
      }) : "blabs" === i ? s.css(e, {
        position: "absolute",
        left: r + n,
        bottom: o + a
      }) : "brabs" === i ? s.css(e, {
        position: "absolute",
        right: r + n,
        bottom: o + a
      }) : "cc" === i && s.addClass(e, "center")
    }
  }
    , {
    "./dom": 18
  }],
  26: [function (e, a, t) {
    var s = Object.prototype.hasOwnProperty;
    a.exports.create = Object.create || function (e) {
      function t() { }
      return t.prototype = e,
        new t
    }
      ,
      a.exports.isArray = function (e) {
        return "[object Array]" === Object.prototype.toString.call(arg)
      }
      ,
      a.exports.isEmpty = function (e) {
        for (var t in e)
          if (null !== e[t])
            return !1;
        return !0
      }
      ,
      a.exports.each = function (e, t, i) {
        if (a.exports.isArray(e))
          for (var r = 0, o = e.length; r < o && !1 !== t.call(i || this, e[r], r); ++r)
            ;
        else
          for (var n in e)
            if (s.call(e, n) && !1 === t.call(i || this, n, e[n]))
              break;
        return e
      }
      ,
      a.exports.merge = function (e, t) {
        if (!t)
          return e;
        for (var i in t)
          s.call(t, i) && (e[i] = t[i]);
        return e
      }
      ,
      a.exports.deepMerge = function (e, t) {
        var i, r, o;
        for (i in e = a.exports.copy(e),
          t)
          s.call(t, i) && (r = e[i],
            o = t[i],
            a.exports.isPlain(r) && a.exports.isPlain(o) ? e[i] = a.exports.deepMerge(r, o) : e[i] = t[i]);
        return e
      }
      ,
      a.exports.copy = function (e) {
        return a.exports.merge({}, e)
      }
      ,
      a.exports.isPlain = function (e) {
        return !!e && "object" == typeof e && "[object Object]" === e.toString() && e.constructor === Object
      }
      ,
      a.exports.isArray = Array.isArray || function (e) {
        return "[object Array]" === Object.prototype.toString.call(e)
      }
      ,
      a.exports.unescape = function (e) {
        return e.replace(/&([^;]+);/g, function (e, t) {
          return {
            amp: "&",
            lt: "<",
            gt: ">",
            quot: '"',
            "#x27": "'",
            "#x60": "`"
          }[t.toLowerCase()] || e
        })
      }
  }
    , {}],
  27: [function (e, t, i) {
    var o = e("./object")
      , n = function () { };
    (n = function () { }
    ).extend = function (e) {
      var t, i;
      for (var r in t = (e = e || {}).init || e.init || this.prototype.init || this.prototype.init || function () { }
        ,
        (((i = function () {
          t.apply(this, arguments)
        }
        ).prototype = o.create(this.prototype)).constructor = i).extend = n.extend,
        i.create = n.create,
        e)
        e.hasOwnProperty(r) && (i.prototype[r] = e[r]);
      return i
    }
      ,
      n.create = function () {
        var e = o.create(this.prototype);
        return this.apply(e, arguments),
          e
      }
      ,
      t.exports = n
  }
    , {
    "./object": 26
  }],
  28: [function (e, f, t) {
    var _ = e("./object")
      , i = e("../config")
      , r = e("./dom")
      , o = e("./cookie")
      , n = e("./constants")
      , a = e("../lang/index")
      , s = e("./ua")
      , g = e("../player/base/plugin/defaultemptycomponent")
      , y = {
        preload: !0,
        autoplay: !0,
        useNativeControls: !1,
        width: "100%",
        height: "300px",
        cover: "",
        from: "",
        trackLog: !0,
        logBatched: !0,
        isLive: !1,
        playsinline: !0,
        showBarTime: 5e3,
        rePlay: !1,
        liveRetry: 5,
        liveRetryInterval: 1,
        liveRetryStep: 0,
        vodRetry: 3,
        format: "",
        definition: "",
        defaultDefinition: "",
        loadDataTimeout: 20,
        waitingTimeout: 60,
        delayLoadingShow: 1,
        controlBarForOver: !1,
        controlBarVisibility: "hover",
        enableSystemMenu: !1,
        qualitySort: "asc",
        x5_video_position: "normal",
        x5_type: "",
        x5_fullscreen: !1,
        x5_orientation: "landscape|portrait",
        x5LandscapeAsFullScreen: !0,
        autoPlayDelay: 0,
        autoPlayDelayDisplayText: "",
        useHlsPluginForSafari: !1,
        enableMSEForAndroid: !0,
        encryptType: 0,
        language: "zh-cn",
        languageTexts: {},
        mediaType: "video",
        outputType: "",
        playConfig: {},
        reAuthInfo: {},
        components: [],
        liveTimeShiftUrl: "",
        liveShiftSource: "",
        liveShiftTime: "",
        videoHeight: "100%",
        videoWidth: "100%",
        enableWorker: !0,
        authTimeout: "",
        enableMockFullscreen: !1,
        region: "cn-shanghai",
        debug: !1,
        progressMarkers: [],
        snapshotWatermark: {
          left: "500",
          top: "100",
          text: "",
          font: "16px \u5b8b\u4f53",
          fillColor: "#FFFFFF",
          strokeColor: "#FFFFFF"
        },
        liveStartTime: "",
        liveOverTime: "",
        enableStashBufferForFlv: !0,
        stashInitialSizeForFlv: 32,
        flvOption: {},
        hlsOption: {
          stopLoadAsPaused: !1
        },
        hlsLoadingTimeOut: 2e4,
        useHlsPlugOnMobile: !0,
        nudgeMaxRetry: 5,
        tracks: [],
        recreatePlayer: function () { },
        diagnosisButtonVisible: !0,
        _native: !0,
        ai: {
          label: !1,
          meta: {
            url: "http://172.19.61.105:8085/meta/query",
            getMeta: ""
          },
          boxes: "",
          host: "",
          app: "",
          streamName: "",
          startDateTime: 0,
          waitMetaDataTime: 2,
          displayAttrs: {
            header: "\u59d3\u540d",
            "\u8bc1\u4ef6\u53f7\u7801": "text",
            "\u6027\u522b": "text",
            "\u5e74\u9f84": "text",
            "\u53d1\u578b": "text",
            "\u4eba\u8138\u5927\u56fe": function (e) { },
            "\u4eba\u8138\u5c0f\u56fe": function (e) { }
          },
          getClass: function (e, t) {
            return ""
          }
        },
        thumbnailUrl: "",
        skinRes: "//" + i.domain + "/de/prismplayer-flash/" + i.flashVersion + "/atlas/defaultSkin"
      };
    f.exports.defaultH5Layout = [{
      name: "bigPlayButton",
      align: "blabs",
      x: 30,
      y: 80
    }, {
      name: "H5Loading",
      align: "cc"
    }, {
      name: "errorDisplay",
      align: "tlabs",
      x: 0,
      y: 0
    }, {
      name: "infoDisplay"
    }, {
      name: "tooltip",
      align: "blabs",
      x: 0,
      y: 50
    }, {
      name: "thumbnail"
    }, {
      name: "controlBar",
      align: "blabs",
      x: 0,
      y: 0,
      children: [{
        name: "progress",
        align: "blabs",
        x: 0,
        y: 44
      }, {
        name: "playButton",
        align: "tl",
        x: 15,
        y: 12
      }, {
        name: "timeDisplay",
        align: "tl",
        x: 10,
        y: 5
      }, {
        name: "fullScreenButton",
        align: "tr",
        x: 10,
        y: 12
      }, {
        name: "subtitle",
        align: "tr",
        x: 15,
        y: 12
      }, {
        name: "setting",
        align: "tr",
        x: 15,
        y: 12
      }, {
        name: "volume",
        align: "tr",
        x: 5,
        y: 10
      }]
    }],
      f.exports.defaultAudioLayout = [{
        name: "controlBar",
        align: "blabs",
        x: 0,
        y: 0,
        children: [{
          name: "progress",
          align: "blabs",
          x: 0,
          y: 44
        }, {
          name: "playButton",
          align: "tl",
          x: 15,
          y: 12
        }, {
          name: "timeDisplay",
          align: "tl",
          x: 10,
          y: 5
        }, {
          name: "volume",
          align: "tr",
          x: 5,
          y: 10
        }]
      }],
      f.exports.defaultFlashLayout = [{
        name: "bigPlayButton",
        align: "blabs",
        x: 30,
        y: 80
      }, {
        name: "controlBar",
        align: "blabs",
        x: 0,
        y: 0,
        children: [{
          name: "progress",
          align: "tlabs",
          x: 0,
          y: 0
        }, {
          name: "playButton",
          align: "tl",
          x: 15,
          y: 26
        }, {
          name: "nextButton",
          align: "tl",
          x: 10,
          y: 26
        }, {
          name: "timeDisplay",
          align: "tl",
          x: 10,
          y: 24
        }, {
          name: "fullScreenButton",
          align: "tr",
          x: 10,
          y: 25
        }, {
          name: "streamButton",
          align: "tr",
          x: 10,
          y: 23
        }, {
          name: "volume",
          align: "tr",
          x: 10,
          y: 25
        }]
      }, {
        name: "fullControlBar",
        align: "tlabs",
        x: 0,
        y: 0,
        children: [{
          name: "fullTitle",
          align: "tl",
          x: 25,
          y: 6
        }, {
          name: "fullNormalScreenButton",
          align: "tr",
          x: 24,
          y: 13
        }, {
          name: "fullTimeDisplay",
          align: "tr",
          x: 10,
          y: 12
        }, {
          name: "fullZoom",
          align: "cc"
        }]
      }],
      f.exports.canPlayType = function (e) {
        var t = document.createElement("video");
        return t.canPlayType ? t.canPlayType(e) : ""
      }
      ,
      f.exports.canPlayHls = function () {
        return "" != f.exports.canPlayType("application/x-mpegURL")
      }
      ,
      f.exports.isUsedHlsPluginOnMobile = function (e) {
        return !(!s.IS_MOBILE || !s.IS_CHROME && !s.IS_FIREFOX)
      }
      ,
      f.exports.isSafariUsedHlsPlugin = function (e) {
        return !!(s.os.pc && s.browser.safari && e)
      }
      ,
      f.exports.hasUIComponent = function (e, t) {
        if (void 0 === e || !e || 0 == e.length)
          return !1;
        for (var i = 0, r = e.length; i < r; i++) {
          var o = e[i].name;
          if (o == t)
            return !0;
          if ("controlBar" == o)
            return f.exports.hasUIComponent(e[i].children, t)
        }
        return !1
      }
      ,
      f.exports.validateSource = function (e) {
        return !0
      }
      ,
      f.exports.supportH5Video = function () {
        return void 0 !== document.createElement("video").canPlayType
      }
      ,
      f.exports.createWrapper = function (e) {
        var t, i = e.id;
        if (!(t = "string" == typeof i ? (0 === i.indexOf("#") && (i = i.slice(1)),
          r.el(i)) : i) || !t.nodeName)
          throw new TypeError("\u6ca1\u6709\u4e3a\u64ad\u653e\u5668\u6307\u5b9a\u5bb9\u5668");
        return f.exports.adjustContainerLayout(t, e),
          t
      }
      ,
      f.exports.adjustContainerLayout = function (e, t) {
        t.width && !e.style.width && (e.style.width = t.width),
          t.height && !e.style.height && (e.style.height = t.height)
      }
      ,
      f.exports.isSupportHls = function () {
        var e = window.MediaSource = window.MediaSource || window.WebKitMediaSource
          , t = window.SourceBuffer = window.SourceBuffer || window.WebKitSourceBuffer
          , i = e && "function" == typeof e.isTypeSupported && e.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"')
          , r = !t || t.prototype && "function" == typeof t.prototype.appendBuffer && "function" == typeof t.prototype.remove;
        return i && r
      }
      ,
      f.exports.isSupportFlv = function () {
        return f.exports.isSupportHls()
      }
      ,
      f.exports.isSupportMSE = function () {
        return !!window.Promise && !!window.Uint8Array && !!Array.prototype.forEach && f.exports.isSupportedMediaSource()
      }
      ,
      f.exports.isSupportedMediaSource = function () {
        return !!window.MediaSource && !!MediaSource.isTypeSupported
      }
      ,
      f.exports.isSupportedDrm = function () {
        return !!(window.MediaKeys && window.navigator && window.navigator.requestMediaKeySystemAccess && window.MediaKeySystemAccess && window.MediaKeySystemAccess.prototype.getConfiguration) && f.exports.isSupportMSE()
      }
      ,
      f.exports.isAudio = function (e) {
        return e && 0 < e.toLowerCase().indexOf(".mp3")
      }
      ,
      f.exports.isLiveShift = function (e) {
        return e.isLive && e.liveStartTime && e.liveOverTime
      }
      ,
      f.exports.isHls = function (e) {
        return e && 0 < e.toLowerCase().indexOf(".m3u8")
      }
      ,
      f.exports.isDash = function (e) {
        return e && 0 < e.toLowerCase().indexOf(".mpd")
      }
      ,
      f.exports.isFlv = function (e) {
        return e && 0 < e.toLowerCase().indexOf(".flv")
      }
      ,
      f.exports.isRTMP = function (e) {
        return e && -1 < e.toLowerCase().indexOf("rtmp:")
      }
      ,
      f.exports.checkSecuritSupport = function () {
        return f.exports.isSupportHls() ? "" : s.IS_IOS ? a.get("iOSNotSupportVodEncription") : a.get("UseChromeForVodEncription")
      }
      ,
      f.exports.findSelectedStreamLevel = function (e, t) {
        var i = t;
        if (!i && !(i = o.get(n.SelectedStreamLevel)))
          return o.set(n.SelectedStreamLevel, e[0].definition, 365),
            0;
        for (var r = 0; r < e.length; r++)
          if (e[r].definition == i)
            return r;
        return 0
      }
      ,
      f.exports.handleOption = function (e, t) {
        var i = _.merge(_.copy(y), e)
          , r = [{
            name: "fullScreenButton",
            align: "tr",
            x: 20,
            y: 12
          }, {
            name: "subtitle",
            align: "tr",
            x: 15,
            y: 12
          }, {
            name: "setting",
            align: "tr",
            x: 15,
            y: 12
          }, {
            name: "volume",
            align: "tr",
            x: 5,
            y: 10
          }]
          , o = !1;
        if (e.useFlashPrism || f.exports.isRTMP(e.source))
          o = !0,
            r = [{
              name: "liveIco",
              align: "tlabs",
              x: 15,
              y: 25
            }, {
              name: "fullScreenButton",
              align: "tr",
              x: 10,
              y: 25
            }, {
              name: "volume",
              align: "tr",
              x: 10,
              y: 25
            }];
        else {
          var n = f.exports.isLiveShift(i);
          n ? (r.push({
            name: "liveShiftProgress",
            align: "tlabs",
            x: 0,
            y: 0
          }),
            r.push({
              name: "playButton",
              align: "tl",
              x: 15,
              y: 12
            }),
            r.push({
              name: "liveDisplay",
              align: "tl",
              x: 15,
              y: 6
            })) : r.push({
              name: "liveDisplay",
              align: "tlabs",
              x: 15,
              y: 6
            })
        }
        if (e.isLive)
          if (void 0 === e.skinLayout)
            i.skinLayout = [{
              name: "errorDisplay",
              align: "tlabs",
              x: 0,
              y: 0
            }, {
              name: "infoDisplay"
            }, {
              name: "bigPlayButton",
              align: "blabs",
              x: 30,
              y: 80
            }, {
              name: "tooltip",
              align: "blabs",
              x: 0,
              y: 56
            }, {
              name: "H5Loading",
              align: "cc"
            }, {
              name: "controlBar",
              align: "blabs",
              x: 0,
              y: 0,
              children: r
            }];
          else if (0 != e.skinLayout) {
            for (var a = e.skinLayout.length, s = [], l = -1, u = 0; u < a; u++)
              if ("controlBar" == i.skinLayout[u].name) {
                l = u;
                for (var c = i.skinLayout[u].children.length, d = 0; d < c; d++) {
                  var p = i.skinLayout[u].children[d].name;
                  if ("liveDisplay" == p || "liveIco" == p || "fullScreenButton" == p || "volume" == p || "snapshot" == p || "setting" == p || "subtitle" == p || n && ("progress" == p || "playButton" == p || "timeDisplay" == p)) {
                    var h = i.skinLayout[u].children[d];
                    "progress" == p ? h.name = "liveShiftProgress" : "timeDisplay" == p ? h.name = "liveShiftTimeDisplay" : o && "liveDisplay" == p && (h.name = "liveIco"),
                      s.push(h)
                  }
                }
                break
              }
            -1 != l && (i.skinLayout[l].children = s)
          }
        return (void 0 === e.components || !e.components || _.isArray(e.components) && 0 == e.components.length) && "false" != e.components && (i.components = [g]),
          i
      }
  }
    , {
    "../config": 5,
    "../lang/index": 11,
    "../player/base/plugin/defaultemptycomponent": 63,
    "./constants": 15,
    "./cookie": 16,
    "./dom": 18,
    "./object": 26,
    "./ua": 31
  }],
  29: [function (e, t, i) {
    arguments[4][28][0].apply(i, arguments)
  }
    , {
    "../config": 5,
    "../lang/index": 11,
    "../player/base/plugin/defaultemptycomponent": 63,
    "./constants": 15,
    "./cookie": 16,
    "./dom": 18,
    "./object": 26,
    "./ua": 31,
    dup: 28
  }],
  30: [function (e, t, i) {
    t.exports.set = function (t, i) {
      try {
        window.localStorage && localStorage.setItem(t, i)
      } catch (e) {
        window[t + "_localStorage"] = i
      }
    }
      ,
      t.exports.get = function (t) {
        try {
          if (window.localStorage)
            return localStorage.getItem(t)
        } catch (e) {
          return window[t + "_localStorage"]
        }
        return ""
      }
  }
    , {}],
  31: [function (e, C, t) {
    if (C.exports.USER_AGENT = navigator.userAgent,
      C.exports.IS_IPHONE = /iPhone/i.test(C.exports.USER_AGENT),
      C.exports.IS_IPAD = /iPad/i.test(C.exports.USER_AGENT),
      C.exports.IS_IPOD = /iPod/i.test(C.exports.USER_AGENT),
      C.exports.IS_MAC = /mac/i.test(C.exports.USER_AGENT),
      C.exports.IS_EDGE = /Edge/i.test(C.exports.USER_AGENT),
      C.exports.IS_IE11 = /Trident\/7.0/i.test(C.exports.USER_AGENT),
      C.exports.IS_X5 = /qqbrowser/i.test(C.exports.USER_AGENT.toLowerCase()),
      C.exports.IS_CHROME = /Chrome/i.test(C.exports.USER_AGENT) && !C.exports.IS_EDGE && !C.exports.IS_X5,
      C.exports.IS_SAFARI = /Safari/i.test(C.exports.USER_AGENT) && !C.exports.IS_CHROME,
      C.exports.IS_FIREFOX = /Firefox/i.test(C.exports.USER_AGENT),
      document.all)
      try {
        var i = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
        C.exports.HAS_FLASH = !!i
      } catch (e) {
        C.exports.HAS_FLASH = !1
      }
    else if (navigator.plugins && 0 < navigator.plugins.length) {
      i = navigator.plugins["Shockwave Flash"];
      C.exports.HAS_FLASH = !!i
    } else
      C.exports.HAS_FLASH = !1;
    var r, o, n, a;
    C.exports.IS_MAC_SAFARI = C.exports.IS_MAC && C.exports.IS_SAFARI && !C.exports.IS_CHROME && !C.exports.HAS_FLASH,
      C.exports.IS_IOS = C.exports.IS_IPHONE || C.exports.IS_IPAD || C.exports.IS_IPOD,
      C.exports.IOS_VERSION = function () {
        var e = C.exports.USER_AGENT.match(/OS (\d+)_/i);
        if (e && e[1])
          return e[1]
      }(),
      C.exports.IS_ANDROID = /Android/i.test(C.exports.USER_AGENT),
      C.exports.ANDROID_VERSION = (n = C.exports.USER_AGENT.match(/Android (\d+)(?:\.(\d+))?(?:\.(\d+))*/i)) ? (r = n[1] && parseFloat(n[1]),
        o = n[2] && parseFloat(n[2]),
        r && o ? parseFloat(n[1] + "." + n[2]) : r || null) : null,
      C.exports.IS_OLD_ANDROID = C.exports.IS_ANDROID && /webkit/i.test(C.exports.USER_AGENT) && C.exports.ANDROID_VERSION < 2.3,
      C.exports.TOUCH_ENABLED = !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch),
      C.exports.IS_MOBILE = C.exports.IS_IOS || C.exports.IS_ANDROID,
      C.exports.IS_H5 = C.exports.IS_MOBILE || !C.exports.HAS_FLASH,
      C.exports.IS_PC = !C.exports.IS_MOBILE,
      C.exports.is_X5 = /micromessenger/i.test(C.exports.USER_AGENT) || /qqbrowser/i.test(C.exports.USER_AGENT),
      C.exports.getHost = function (e) {
        var t = "";
        if (void 0 === e || null == e || "" == e)
          return "";
        var i = e.indexOf("//")
          , r = e;
        -1 < i && (r = e.substring(i + 2));
        t = r;
        var o = r.split("/");
        return o && 0 < o.length && (t = o[0]),
          (o = t.split(":")) && 0 < o.length && (t = o[0]),
          t
      }
      ,
      C.exports.dingTalk = function () {
        var e = C.exports.USER_AGENT.toLowerCase();
        return /dingtalk/i.test(e)
      }
      ,
      C.exports.wechat = function () {
        var e = C.exports.USER_AGENT.toLowerCase();
        return /micromessenger/i.test(e)
      }
      ,
      C.exports.inIFrame = function () {
        return self != top
      }
      ,
      C.exports.getReferer = function () {
        var t = document.referrer;
        if (C.exports.inIFrame())
          try {
            t = top.document.referrer
          } catch (e) {
            t = document.referrer
          }
        return t
      }
      ,
      C.exports.getHref = function () {
        location.href;
        if (C.exports.inIFrame())
          try {
            top.location.href
          } catch (e) {
            location.href
          }
        return location.href
      }
      ,
      a = C.exports,
      function (e, t) {
        var i = this.os = {}
          , r = this.browser = {}
          , o = e.match(/Web[kK]it[\/]{0,1}([\d.]+)/)
          , n = e.match(/(Android);?[\s\/]+([\d.]+)?/)
          , a = !!e.match(/\(Macintosh\; Intel /)
          , s = e.match(/(iPad).*OS\s([\d_]+)/)
          , l = e.match(/(iPod)(.*OS\s([\d_]+))?/)
          , u = !s && e.match(/(iPhone\sOS)\s([\d_]+)/)
          , c = e.match(/(webOS|hpwOS)[\s\/]([\d.]+)/)
          , d = /Win\d{2}|Windows/.test(t)
          , p = e.match(/Windows Phone ([\d.]+)/)
          , h = c && e.match(/TouchPad/)
          , f = e.match(/Kindle\/([\d.]+)/)
          , _ = e.match(/Silk\/([\d._]+)/)
          , g = e.match(/(BlackBerry).*Version\/([\d.]+)/)
          , y = e.match(/(BB10).*Version\/([\d.]+)/)
          , v = e.match(/(RIM\sTablet\sOS)\s([\d.]+)/)
          , m = e.match(/PlayBook/)
          , S = e.match(/Chrome\/([\d.]+)/) || e.match(/CriOS\/([\d.]+)/)
          , T = e.match(/Firefox\/([\d.]+)/)
          , b = e.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/)
          , x = e.match(/MSIE\s([\d.]+)/) || e.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/)
          , E = !S && e.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/)
          , P = E || e.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/);
        if ((r.webkit = !!o) && (r.version = o[1]),
          n && (i.android = !0,
            i.version = n[2]),
          u && !l && (i.ios = i.iphone = !0,
            i.version = u[2].replace(/_/g, ".")),
          s && (i.ios = i.ipad = !0,
            i.version = s[2].replace(/_/g, ".")),
          l && (i.ios = i.ipod = !0,
            i.version = l[3] ? l[3].replace(/_/g, ".") : null),
          p && (i.wp = !0,
            i.version = p[1]),
          c && (i.webos = !0,
            i.version = c[2]),
          h && (i.touchpad = !0),
          g && (i.blackberry = !0,
            i.version = g[2]),
          y && (i.bb10 = !0,
            i.version = y[2]),
          v && (i.rimtabletos = !0,
            i.version = v[2]),
          m && (r.playbook = !0),
          f && (i.kindle = !0,
            i.version = f[1]),
          _ && (r.silk = !0,
            r.version = _[1]),
          !_ && i.android && e.match(/Kindle Fire/) && (r.silk = !0),
          S && (r.chrome = !0,
            r.version = S[1]),
          T && (r.firefox = !0,
            r.version = T[1]),
          b && (i.firefoxos = !0,
            i.version = b[1]),
          x && (r.ie = !0,
            r.version = x[1]),
          P && (a || i.ios || d || n) && (r.safari = !0,
            i.ios || (r.version = P[1])),
          E && (r.webview = !0),
          a) {
          var w = e.match(/[\d]*_[\d]*_[\d]*/);
          w && 0 < w.length && w[0] && (i.version = w[0].replace(/_/g, "."))
        }
        i.tablet = !!(s || m || n && !e.match(/Mobile/) || T && e.match(/Tablet/) || x && !e.match(/Phone/) && e.match(/Touch/)),
          i.phone = !(i.tablet || i.ipod || !(n || u || c || g || y || S && e.match(/Android/) || S && e.match(/CriOS\/([\d.]+)/) || T && e.match(/Mobile/) || x && e.match(/Touch/))),
          i.pc = !i.tablet && !i.phone,
          a ? i.name = "macOS" : d ? (i.name = "windows",
            i.version = function () {
              var e = navigator.userAgent
                , t = "";
              return (-1 < e.indexOf("Windows NT 5.0") || -1 < e.indexOf("Windows 2000")) && (t = "2000"),
                (-1 < e.indexOf("Windows NT 5.1") || -1 < e.indexOf("Windows XP")) && (t = "XP"),
                (-1 < e.indexOf("Windows NT 5.2") || -1 < e.indexOf("Windows 2003")) && (t = "2003"),
                (-1 < e.indexOf("Windows NT 6.0") || -1 < e.indexOf("Windows Vista")) && (t = "Vista"),
                (-1 < e.indexOf("Windows NT 6.1") || -1 < e.indexOf("Windows 7")) && (t = "7"),
                (-1 < e.indexOf("Windows NT 6.2") || -1 < e.indexOf("Windows 8")) && (t = "8"),
                (-1 < e.indexOf("Windows NT 6.3") || -1 < e.indexOf("Windows 8.1")) && (t = "8.1"),
                (-1 < e.indexOf("Windows NT 10") || -1 < e.indexOf("Windows 10")) && (t = "10"),
                t
            }()) : i.name = function () {
              var e = navigator.userAgent
                , t = "other"
                , i = C.exports.os;
              if (i.ios)
                return "iOS";
              if (i.android)
                return "android";
              if (-1 < e.indexOf("Baiduspider"))
                return "Baiduspider";
              if (-1 < e.indexOf("PlayStation"))
                return "PS4";
              var r = "Win32" == navigator.platform || "Windows" == navigator.platform || -1 < e.indexOf("Windows")
                , o = "Mac68K" == navigator.platform || "MacPPC" == navigator.platform || "Macintosh" == navigator.platform || "MacIntel" == navigator.platform;
              return o && (t = "macOS"),
                "X11" != navigator.platform || r || o || (t = "Unix"),
                -1 < String(navigator.platform).indexOf("Linux") && (t = "Linux"),
                r ? "windows" : t
            }(),
          r.name = function () {
            var e = navigator.userAgent.toLowerCase()
              , t = C.exports.browser;
            return t.firefox ? "Firefox" : t.ie ? /edge/.test(e) ? "Edge" : "IE" : /micromessenger/.test(e) ? "\u5fae\u4fe1\u5185\u7f6e\u6d4f\u89c8\u5668" : /qqbrowser/.test(e) ? "QQ\u6d4f\u89c8\u5668" : t.webview ? "webview" : t.chrome ? "Chrome" : t.safari ? "Safari" : /baiduspider/.test(e) ? "Baiduspider" : /ucweb/.test(e) || /UCBrowser/.test(e) ? "UC" : /opera/.test(e) ? "Opera" : /ucweb/.test(e) ? "UC" : /360se/.test(e) ? "360\u6d4f\u89c8\u5668" : /bidubrowser/.test(e) ? "\u767e\u5ea6\u6d4f\u89c8\u5668" : /metasr/.test(e) ? "\u641c\u72d7\u6d4f\u89c8\u5668" : /lbbrowser/.test(e) ? "\u730e\u8c79\u6d4f\u89c8\u5668" : /playstation/.test(e) ? "PS4\u6d4f\u89c8\u5668" : void 0
          }()
      }
        .call(a, navigator.userAgent, navigator.platform)
  }
    , {}],
  32: [function (e, t, i) {
    var s = e("./dom");
    t.exports.getAbsoluteURL = function (e) {
      return e.match(/^https?:\/\//) || (e = s.createEl("div", {
        innerHTML: '<a href="' + e + '">x</a>'
      }).firstChild.href),
        e
    }
      ,
      t.exports.parseUrl = function (e) {
        var t, i, r, o, n;
        o = ["protocol", "hostname", "port", "pathname", "search", "hash", "host"],
          (r = "" === (i = s.createEl("a", {
            href: e
          })).host && "file:" !== i.protocol) && ((t = s.createEl("div")).innerHTML = '<a href="' + e + '"></a>',
            i = t.firstChild,
            t.setAttribute("style", "display:none; position:absolute;"),
            document.body.appendChild(t)),
          n = {};
        for (var a = 0; a < o.length; a++)
          n[o[a]] = i[o[a]];
        return n.segments = i.pathname.replace(/^\//, "").split("/"),
          r && document.body.removeChild(t),
          n
      }
  }
    , {
    "./dom": 18
  }],
  33: [function (e, r, t) {
    var i = e("./dom")
      , o = e("./ua")
      , n = e("./playerutil");
    r.exports.formatTime = function (e) {
      var t, i, r, o = Math.floor(e);
      return t = Math.floor(o / 3600),
        o %= 3600,
        i = Math.floor(o / 60),
        r = o % 60,
        !(t === 1 / 0 || isNaN(t) || i === 1 / 0 || isNaN(i) || r === 1 / 0 || isNaN(r)) && ("00" === (t = 10 <= t ? t : "0" + t) ? "" : t + ":") + (i = 10 <= i ? i : "0" + i) + ":" + (r = 10 <= r ? r : "0" + r)
    }
      ,
      r.exports.extractTime = function (e) {
        if (e) {
          var t = parseInt(e.getHours())
            , i = parseInt(e.getMinutes())
            , r = parseInt(e.getSeconds());
          return ("00" === (t = 10 <= t ? t : "0" + t) ? "" : t + ":") + (i = 10 <= i ? i : "0" + i) + ":" + (r = 10 <= r ? r : "0" + r)
        }
        return ""
      }
      ,
      r.exports.convertToTimestamp = function (e, t) {
        var i = "";
        return e && (t ? i = e.gettime() : (i = Date.parse(e),
          i /= 1e3)),
          i
      }
      ,
      r.exports.convertToDate = function (e, t) {
        var i = "";
        if (e) {
          t || 1e3,
            (i = new Date).setTime(1e3 * e)
        }
        return i
      }
      ,
      r.exports.parseTime = function (e) {
        if (!e)
          return "00:00:00";
        var t = e.split(":")
          , i = 0
          , r = 0
          , o = 0;
        return 3 === t.length ? (i = t[0],
          r = t[1],
          o = t[2]) : 2 === t.length ? (r = t[0],
            o = t[1]) : 1 === t.length && (o = t[0]),
          3600 * (i = parseInt(i, 10)) + 60 * (r = parseInt(r, 10)) + (o = Math.ceil(parseFloat(o)))
      }
      ,
      r.exports.formatDate = function (e, t) {
        var i = {
          "M+": e.getMonth() + 1,
          "d+": e.getDate(),
          "H+": e.getHours(),
          "m+": e.getMinutes(),
          "s+": e.getSeconds(),
          "q+": Math.floor((e.getMonth() + 3) / 3),
          S: e.getMilliseconds()
        };
        for (var r in /(y+)/.test(t) && (t = t.replace(RegExp.$1, (e.getFullYear() + "").substr(4 - RegExp.$1.length))),
          i)
          new RegExp("(" + r + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[r] : ("00" + i[r]).substr(("" + i[r]).length)));
        return t
      }
      ,
      r.exports.sleep = function (e) {
        for (var t = Date.now(); Date.now() - t <= e;)
          ;
      }
      ,
      r.exports.htmlEncodeAll = function (e) {
        return null == e ? "" : e.replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/\&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")
      }
      ,
      r.exports.toBinary = function (e) {
        if (!window.atob)
          return "";
        for (var t = atob(e), i = t.length, r = new Uint8Array(i), o = 0; o < i; o++)
          r[o] = t.charCodeAt(o);
        return r
      }
      ,
      r.exports.readyBinary = function (e) {
        for (var t = new Uint8Array(e), i = t.length, r = "", o = 0; o < i; o++)
          r += t[o];
        return r
      }
      ,
      r.exports.delayHide = function (e, t) {
        e && (void 0 === t && (t = 1e3),
          e.delayHanlder && clearTimeout(e.delayHanlder),
          e.delayHanlder = setTimeout(function () {
            i.css(e, "display", "none")
          }, t))
      }
      ,
      r.exports.openInFile = function () {
        return -1 != window.location.protocol.toLowerCase().indexOf("file")
      }
      ,
      r.exports.contentProtocolMixed = function (e) {
        return !!(o.os.pc && (n.isHls(e) && !o.browser.safari || n.isFlv(e)) && "https:" == window.location.protocol.toLowerCase() && e && -1 < e.toLowerCase().indexOf("http://"))
      }
      ,
      r.exports.queryString = function (e) {
        var t, i, r, o, n;
        return 2 !== (i = (e = decodeURIComponent(e)).split("?")).length ? {} : (n = i[1],
          (t = n.split("&")) ? (r = {},
            o = 0,
            $(t).each(function () {
              var e;
              2 === (e = t[o].split("=")).length && (r[e[0]] = e[1].replace(/\+/g, " ")),
                o++
            }),
            r) : {})
      }
      ,
      r.exports.log = function (e) {
        var t = window.location.href
          , i = r.exports.queryString(t);
        i && 1 == i.debug && console.log(e)
      }
  }
    , {
    "./dom": 18,
    "./playerutil": 29,
    "./ua": 31
  }],
  34: [function (e, t, i) {
    var s = e("./vttparse")
      , l = function (e) {
        for (var t = 5381, i = e.length; i;)
          t = 33 * t ^ e.charCodeAt(--i);
        return (t >>> 0).toString()
      }
      , r = {
        parse: function (e, t, i) {
          var r, o = e.trim().replace(/\r\n|\n\r|\n|\r/g, "\n").split("\n"), n = [], a = new s;
          a.oncue = function (e) {
            e.id = l(e.startTime) + l(e.endTime) + l(e.text),
              e.text = decodeURIComponent(escape(e.text)),
              e.isBig = !1;
            var t = e.text.split("#xywh=");
            if (2 == t.length) {
              var i = t[1].split(",");
              e.x = i[0],
                e.y = i[1],
                e.w = i[2],
                e.h = i[3],
                e.isBig = !0
            }
            0 < e.endTime && n.push(e)
          }
            ,
            a.onparsingerror = function (e) {
              r = e
            }
            ,
            a.onflush = function () {
              if (r && i)
                return i(r),
                  void console.log(r);
              t(n)
            }
            ,
            o.forEach(function (e) {
              a.parse(e + "\n")
            }),
            a.flush()
        }
      };
    t.exports = r
  }
    , {
    "./vttparse": 36
  }],
  35: [function (e, t, i) {
    t.exports = function () {
      if ("undefined" != typeof window && window.VTTCue)
        return window.VTTCue;
      var S = {
        "": !0,
        lr: !0,
        rl: !0
      }
        , t = {
          start: !0,
          middle: !0,
          end: !0,
          left: !0,
          right: !0
        };
      function T(e) {
        return "string" == typeof e && (!!t[e.toLowerCase()] && e.toLowerCase())
      }
      function b(e) {
        for (var t = 1; t < arguments.length; t++) {
          var i = arguments[t];
          for (var r in i)
            e[r] = i[r]
        }
        return e
      }
      function e(e, t, i) {
        var r = this
          , o = function () {
            if ("undefined" != typeof navigator)
              return /MSIE\s8\.0/.test(navigator.userAgent)
          }()
          , n = {};
        o ? r = document.createElement("custom") : n.enumerable = !0,
          r.hasBeenReset = !1;
        var a = ""
          , s = !1
          , l = e
          , u = t
          , c = i
          , d = null
          , p = ""
          , h = !0
          , f = "auto"
          , _ = "start"
          , g = 50
          , y = "middle"
          , v = 50
          , m = "middle";
        if (Object.defineProperty(r, "id", b({}, n, {
          get: function () {
            return a
          },
          set: function (e) {
            a = "" + e
          }
        })),
          Object.defineProperty(r, "pauseOnExit", b({}, n, {
            get: function () {
              return s
            },
            set: function (e) {
              s = !!e
            }
          })),
          Object.defineProperty(r, "startTime", b({}, n, {
            get: function () {
              return l
            },
            set: function (e) {
              if ("number" != typeof e)
                throw new TypeError("Start time must be set to a number.");
              l = e,
                this.hasBeenReset = !0
            }
          })),
          Object.defineProperty(r, "endTime", b({}, n, {
            get: function () {
              return u
            },
            set: function (e) {
              if ("number" != typeof e)
                throw new TypeError("End time must be set to a number.");
              u = e,
                this.hasBeenReset = !0
            }
          })),
          Object.defineProperty(r, "text", b({}, n, {
            get: function () {
              return c
            },
            set: function (e) {
              c = "" + e,
                this.hasBeenReset = !0
            }
          })),
          Object.defineProperty(r, "region", b({}, n, {
            get: function () {
              return d
            },
            set: function (e) {
              d = e,
                this.hasBeenReset = !0
            }
          })),
          Object.defineProperty(r, "vertical", b({}, n, {
            get: function () {
              return p
            },
            set: function (e) {
              var t = function (e) {
                return "string" == typeof e && !!S[e.toLowerCase()] && e.toLowerCase()
              }(e);
              if (!1 === t)
                throw new SyntaxError("An invalid or illegal string was specified.");
              p = t,
                this.hasBeenReset = !0
            }
          })),
          Object.defineProperty(r, "snapToLines", b({}, n, {
            get: function () {
              return h
            },
            set: function (e) {
              h = !!e,
                this.hasBeenReset = !0
            }
          })),
          Object.defineProperty(r, "line", b({}, n, {
            get: function () {
              return f
            },
            set: function (e) {
              if ("number" != typeof e && "auto" !== e)
                throw new SyntaxError("An invalid number or illegal string was specified.");
              f = e,
                this.hasBeenReset = !0
            }
          })),
          Object.defineProperty(r, "lineAlign", b({}, n, {
            get: function () {
              return _
            },
            set: function (e) {
              var t = T(e);
              if (!t)
                throw new SyntaxError("An invalid or illegal string was specified.");
              _ = t,
                this.hasBeenReset = !0
            }
          })),
          Object.defineProperty(r, "position", b({}, n, {
            get: function () {
              return g
            },
            set: function (e) {
              if (e < 0 || 100 < e)
                throw new Error("Position must be between 0 and 100.");
              g = e,
                this.hasBeenReset = !0
            }
          })),
          Object.defineProperty(r, "positionAlign", b({}, n, {
            get: function () {
              return y
            },
            set: function (e) {
              var t = T(e);
              if (!t)
                throw new SyntaxError("An invalid or illegal string was specified.");
              y = t,
                this.hasBeenReset = !0
            }
          })),
          Object.defineProperty(r, "size", b({}, n, {
            get: function () {
              return v
            },
            set: function (e) {
              if (e < 0 || 100 < e)
                throw new Error("Size must be between 0 and 100.");
              v = e,
                this.hasBeenReset = !0
            }
          })),
          Object.defineProperty(r, "align", b({}, n, {
            get: function () {
              return m
            },
            set: function (e) {
              var t = T(e);
              if (!t)
                throw new SyntaxError("An invalid or illegal string was specified.");
              m = t,
                this.hasBeenReset = !0
            }
          })),
          r.displayState = void 0,
          o)
          return r
      }
      return e.prototype.getCueAsHTML = function () {
        return window.WebVTT.convertCueToDOMTree(window, this.text)
      }
        ,
        e
    }()
  }
    , {}],
  36: [function (e, t, i) {
    var s = e("./vttcue")
      , r = function () {
        return {
          decode: function (e) {
            if (!e)
              return "";
            if ("string" != typeof e)
              throw new Error("Error - expected string data.");
            return decodeURIComponent(encodeURIComponent(e))
          }
        }
      };
    function o() {
      this.window = window,
        this.state = "INITIAL",
        this.buffer = "",
        this.decoder = new r,
        this.regionList = []
    }
    function l() {
      this.values = Object.create(null)
    }
    function u(e, t, i, r) {
      var o = r ? e.split(r) : [e];
      for (var n in o)
        if ("string" == typeof o[n]) {
          var a = o[n].split(i);
          if (2 === a.length)
            t(a[0], a[1])
        }
    }
    l.prototype = {
      set: function (e, t) {
        this.get(e) || "" === t || (this.values[e] = t)
      },
      get: function (e, t, i) {
        return i ? this.has(e) ? this.values[e] : t[i] : this.has(e) ? this.values[e] : t
      },
      has: function (e) {
        return e in this.values
      },
      alt: function (e, t, i) {
        for (var r = 0; r < i.length; ++r)
          if (t === i[r]) {
            this.set(e, t);
            break
          }
      },
      integer: function (e, t) {
        /^-?\d+$/.test(t) && this.set(e, parseInt(t, 10))
      },
      percent: function (e, t) {
        return !!(t.match(/^([\d]{1,3})(\.[\d]*)?%$/) && 0 <= (t = parseFloat(t)) && t <= 100) && (this.set(e, t),
          !0)
      }
    };
    var c = new s(0, 0, 0)
      , d = "middle" === c.align ? "middle" : "center";
    function p(t, e, a) {
      var i = t;
      function r() {
        var e = function (e) {
          function t(e, t, i, r) {
            return 3600 * (0 | e) + 60 * (0 | t) + (0 | i) + (0 | r) / 1e3
          }
          var i = e.match(/^(\d+):(\d{2})(:\d{2})?(\.\d{3})?/);
          if (!i)
            return null;
          var r = i[4];
          return r && (r = r.replace(".", "")),
            i[3] ? t(i[1], i[2], i[3].replace(":", ""), r) : 59 < i[1] ? t(i[1], i[2], 0, r) : t(0, i[1], i[2], r)
        }(t);
        if (null === e)
          throw new Error("Malformed timestamp: " + i);
        return t = t.replace(/^[^\sa-zA-Z-]+/, ""),
          e
      }
      function o() {
        t = t.replace(/^\s+/, "")
      }
      if (o(),
        e.startTime = r(),
        o(),
        "--\x3e" !== t.substr(0, 3))
        throw new Error("Malformed time stamp (time stamps must be separated by '--\x3e'): " + i);
      t = t.substr(3),
        o(),
        e.endTime = r(),
        o(),
        function (e, t) {
          var n = new l;
          u(e, function (e, t) {
            switch (e) {
              case "region":
                for (var i = a.length - 1; 0 <= i; i--)
                  if (a[i].id === t) {
                    n.set(e, a[i].region);
                    break
                  }
                break;
              case "vertical":
                n.alt(e, t, ["rl", "lr"]);
                break;
              case "line":
                var r = t.split(",")
                  , o = r[0];
                n.integer(e, o),
                  n.percent(e, o) && n.set("snapToLines", !1),
                  n.alt(e, o, ["auto"]),
                  2 === r.length && n.alt("lineAlign", r[1], ["start", d, "end"]);
                break;
              case "position":
                r = t.split(","),
                  n.percent(e, r[0]),
                  2 === r.length && n.alt("positionAlign", r[1], ["start", d, "end", "line-left", "line-right", "auto"]);
                break;
              case "size":
                n.percent(e, t);
                break;
              case "align":
                n.alt(e, t, ["start", d, "end", "left", "right"])
            }
          }, /:/, /\s/),
            t.region = n.get("region", null),
            t.vertical = n.get("vertical", "");
          var i = n.get("line", "auto");
          "auto" === i && -1 === c.line && (i = -1),
            t.line = i,
            t.lineAlign = n.get("lineAlign", "start"),
            t.snapToLines = n.get("snapToLines", !0),
            t.size = n.get("size", 100),
            t.align = n.get("align", d);
          var r = n.get("position", "auto");
          "auto" === r && 50 === c.position && (r = "start" === t.align || "left" === t.align ? 0 : "end" === t.align || "right" === t.align ? 100 : 50),
            t.position = r
        }(t, e)
    }
    o.prototype = {
      parse: function (e) {
        var r = this;
        function t() {
          var e = r.buffer
            , t = 0;
          for (e = function (e) {
            return e.replace(/<br(?: \/)?>/gi, "\n")
          }(e); t < e.length && "\r" !== e[t] && "\n" !== e[t];)
            ++t;
          var i = e.substr(0, t);
          return "\r" === e[t] && ++t,
            "\n" === e[t] && ++t,
            r.buffer = e.substr(t),
            i
        }
        e && (r.buffer += r.decoder.decode(e, {
          stream: !0
        }));
        try {
          var i;
          if ("INITIAL" === r.state) {
            if (!/\r\n|\n/.test(r.buffer))
              return this;
            var o = (i = t()).match(/^WEBVTT([ \t].*)?$/);
            if (!o || !o[0])
              throw new Error("Malformed WebVTT signature.");
            r.state = "HEADER"
          }
          for (var n = !1; r.buffer;) {
            if (!/\r\n|\n/.test(r.buffer))
              return this;
            switch (n ? n = !1 : i = t(),
            r.state) {
              case "HEADER":
                /:/.test(i) ? u(i, function (e, t) {
                  switch (e) {
                    case "Region":
                      console.log("parse region", t)
                  }
                }, /:/) : i || (r.state = "ID");
                continue;
              case "NOTE":
                i || (r.state = "ID");
                continue;
              case "ID":
                if (/^NOTE($|[ \t])/.test(i)) {
                  r.state = "NOTE";
                  break
                }
                if (!i)
                  continue;
                if (r.cue = new s(0, 0, ""),
                  r.state = "CUE",
                  -1 === i.indexOf("--\x3e")) {
                  r.cue.id = i;
                  continue
                }
              case "CUE":
                try {
                  p(i, r.cue, r.regionList)
                } catch (e) {
                  r.cue = null,
                    r.state = "BADCUE";
                  continue
                }
                r.state = "CUETEXT";
                continue;
              case "CUETEXT":
                var a = -1 !== i.indexOf("--\x3e");
                if (!i || a && (n = !0)) {
                  r.oncue && r.oncue(r.cue),
                    r.cue = null,
                    r.state = "ID";
                  continue
                }
                r.cue.text && (r.cue.text += "\n"),
                  r.cue.text += i;
                continue;
              case "BADCUE":
                i || (r.state = "ID");
                continue
            }
          }
        } catch (e) {
          "CUETEXT" === r.state && r.cue && r.oncue && r.oncue(r.cue),
            r.cue = null,
            r.state = "INITIAL" === r.state ? "BADWEBVTT" : "BADCUE"
        }
        return this
      },
      flush: function () {
        var e = this;
        try {
          if (e.buffer += e.decoder.decode(),
            (e.cue || "HEADER" === e.state) && (e.buffer += "\n\n",
              e.parse()),
            "INITIAL" === e.state)
            throw new Error("Malformed WebVTT signature.")
        } catch (e) {
          throw e
        }
        return e.onflush && e.onflush(),
          this
      }
    },
      t.exports = o
  }
    , {
    "./vttcue": 35
  }],
  37: [function (e, t, i) {
    var o = e("../lib/io");
    e("../lib/storage");
    function r(e) {
      this._uploadDuration = e.logDuration || 5,
        this._uploadCount = e.logCount || 10,
        this._logReportTo = e.logReportTo,
        this._logs = [],
        this._retry = 0,
        this._disposed = !1,
        this._supportLocalStorage = !0;
      var t = this;
      window && (window.onbeforeunload = function (e) {
        if (0 < t._logs.length)
          if (t._supportLocalStorage)
            localStorage.setItem("__aliplayer_log_data", JSON.stringify(t._logs));
          else {
            t._report();
            !function (e) {
              for (var t = (new Date).getTime(), i = t; i < t + e;)
                i = (new Date).getTime()
            }(500)
          }
      }
      );
      try {
        if (localStorage) {
          var i = localStorage.getItem("__aliplayer_log_data");
          localStorage.removeItem("__aliplayer_log_data"),
            i && (this._logs = JSON.parse(i))
        } else
          this._supportLocalStorage = !1
      } catch (e) {
        this._supportLocalStorage = !1
      }
      this._start()
    }
    r.prototype.add = function (e) {
      var t = this._logs.length;
      if (e.__time__ = Math.round(new Date / 1e3),
        0 < t && "4001" == e.e) {
        var i = this._logs[t - 1];
        if ("4001" == i.e && i.__time__ - e.__time__ < 5)
          return
      }
      this._logs.push(e),
        (this._logs.length > this._uploadCount || "4001" == e.e || "2002" == e.e) && this._report()
    }
      ,
      r.prototype.dispose = function () {
        this._report(),
          this._disposed = !0
      }
      ,
      r.prototype._start = function () {
        this._disposed = !1;
        this._retry = 0,
          this._report()
      }
      ,
      r.prototype._report = function (t) {
        if (this._tickHandler && (clearTimeout(this._tickHandler),
          this._tickHandler = null),
          t || (t = this._logs.splice(0, this._uploadCount)),
          0 < t.length) {
          var e = JSON.stringify({
            __logs__: t,
            __source__: ""
          })
            , i = this
            , r = {
              "Content-Type": "application/json;charset=UTF-8",
              "x-log-apiversion": "0.6.0",
              "x-log-bodyrawsize": e.length
            };
          o.postWithHeader(this._logReportTo, e, r, function (e) {
            i._tick()
          }, function (e) {
            0 == i._retry ? (i._retry = 1,
              i._report(t)) : i._tick()
          })
        } else
          this._tick()
      }
      ,
      r.prototype._tick = function () {
        if (!this._disposed) {
          this._retry = 0;
          var e = this;
          this._logs.length > this._uploadCount ? e._report() : this._tickHandler = setTimeout(function () {
            e._report()
          }, 1e3 * this._uploadDuration)
        }
      }
      ,
      t.exports = r
  }
    , {
    "../lib/io": 24,
    "../lib/storage": 30
  }],
  38: [function (e, t, i) {
    var r = e("../lib/oo")
      , u = e("../lib/object")
      , v = e("../lib/data")
      , c = e("../lib/io")
      , m = e("../lib/ua")
      , S = e("../config")
      , o = e("../player/base/event/eventtype")
      , T = e("./util")
      , b = e("./log")
      , n = 0
      , d = {
        STARTFETCHDATA: 1003,
        COMPLETEFETCHDATA: 1004,
        PREPARE: 1101,
        PREPAREEND: 1102,
        STARTPLAY: 2e3,
        PLAY: 2001,
        STOP: 2002,
        PAUSE: 2003,
        SEEK: 2004,
        FULLSREEM: 2005,
        QUITFULLSCREEM: 2006,
        RESOLUTION: 2007,
        RESOLUTION_DONE: 2008,
        RECOVER: 2010,
        SEEK_END: 2011,
        FETCHEDIP: 2020,
        CDNDETECT: 2021,
        DETECT: 2022,
        UNDERLOAD: 3002,
        LOADED: 3001,
        HEARTBEAT: 9001,
        ERROR: 4001,
        ERRORRETRY: 4002,
        SNAPSHOT: 2027,
        ROTATE: 2028,
        IMAGE: 2029,
        THUMBNAILSTART: 2031,
        THUMBNAILCOMPLETE: 2032,
        CCSTART: 2033,
        CCCOMPLETE: 2034,
        AUDIOTRACKSTART: 2033,
        AUDIOTRACKCOMPLETE: 2034
      }
      , a = r.extend({
        init: function (e, t, i) {
          void 0 === i && (i = !0),
            this.trackLog = i,
            this.player = e,
            this.requestId = "",
            this.sessionId = v.guid(),
            this.playId = 0,
            this.firstPlay = !0,
            this.osName = m.os.name,
            this.osVersion = m.os.version || "",
            this.exName = m.browser.name,
            this.exVersion = m.browser.version || "",
            this._logService = "",
            t.logBatched && (this._logService = new b(S));
          var r = this.player.getOptions()
            , o = t.from ? t.from : ""
            , n = (r.isLive,
              r.isLive ? "live" : "vod")
            , a = "pc";
          m.IS_IPAD ? a = "pad" : m.os.phone && (a = "phone");
          var s = this.encodeURL(m.getReferer())
            , l = m.getHref()
            , u = this.encodeURL(l)
            , c = "";
          l && (c = m.getHost(l));
          var d = S.h5Version
            , p = T.getUuid()
            , h = r.source ? this.encodeURL(r.source) : ""
            , f = m.getHost(r.source)
            , _ = r.userId ? r.userId + "" : "0"
            , g = this.sessionId
            , y = (new Date).getTime();
          this._userNetInfo = {
            cdnIp: "",
            localIp: ""
          };
          this.opt = {
            APIVersion: "0.6.0",
            t: y,
            ll: "info",
            lv: "1.0",
            pd: "player",
            md: "saas_player",
            ui: "saas_player",
            sm: "play",
            os: this.osName,
            ov: this.osVersion,
            et: this.exName,
            ev: this.exVersion,
            uat: m.USER_AGENT,
            hn: "0.0.0.0",
            bi: o,
            ri: g,
            e: "0",
            args: "0",
            vt: n,
            tt: a,
            dm: "h5",
            av: d,
            uuid: p,
            vu: h,
            vd: f,
            ua: _,
            dn: "custom",
            cdn_ip: "0.0.0.0",
            app_n: c,
            r: s,
            pu: u
          },
            this.bindEvent()
        },
        updateVideoInfo: function (e) {
          var t = e.from ? e.from : "";
          this.opt.bi = t + "",
            this.updateSourceInfo()
        },
        updateSourceInfo: function () {
          var e = this.player.getOptions();
          if (e) {
            var t = e.source ? this.encodeURL(e.source) : ""
              , i = m.getHost(e.source);
            this.opt.vu = t,
              this.opt.vd = i
          }
        },
        replay: function () {
          this.reset(),
            this.player.trigger(o.Video.LoadStart),
            this.player.trigger(o.Video.LoadedMetadata),
            this.player.trigger(o.Video.LoadedData)
        },
        bindEvent: function () {
          var t = this;
          this.player.on(o.Player.Init, function () {
            t._onPlayerInit()
          }),
            this.player.on(o.Video.LoadStart, function () {
              t._onPlayerloadstart()
            }),
            this.player.on(o.Video.LoadedMetadata, function () {
              t._onPlayerLoadMetadata()
            }),
            this.player.on(o.Video.LoadedData, function () {
              t._onPlayerLoaddata()
            }),
            this.player.on(o.Video.Play, function () {
              t._onPlayerPlay()
            }),
            this.player.on(o.Video.Playing, function () {
              t._onPlayerReady()
            }),
            this.player.on(o.Video.Ended, function () {
              t._onPlayerFinish()
            }),
            this.player.on(o.Video.Pause, function () {
              t._onPlayerPause()
            }),
            this.player.on(o.Private.SeekStart, function (e) {
              t._onPlayerSeekStart(e)
            }),
            this.player.on(o.Private.EndStart, function (e) {
              t._seekEndData = e.paramData
            }),
            this.player.on(o.Player.Waiting, function () {
              t._waitingDelayLoadingShowHandle && (clearTimeout(t._waitingDelayLoadingShowHandle),
                t._waitingDelayLoadingShowHandle = null),
                t._waitingDelayLoadingShowHandle = setTimeout(function () {
                  t._onPlayerLoaded()
                }, 1e3 * t.player._options.delayLoadingShow)
            }),
            this.player.on(o.Video.CanPlayThrough, function () { }),
            this.player.on(o.Video.CanPlay, function () {
              t._waitingDelayLoadingShowHandle && (clearTimeout(t._waitingDelayLoadingShowHandle),
                t._waitingDelayLoadingShowHandle = null),
                t._onPlayerUnderload(),
                t._onPlayerCanplay()
            }),
            this.player.on(o.Video.TimeUpdate, function () {
              t._waitingDelayLoadingShowHandle && (clearTimeout(t._waitingDelayLoadingShowHandle),
                t._waitingDelayLoadingShowHandle = null),
                t._seekEndData && t.seeking && t._onPlayerSeekEnd()
            }),
            this.player.on(o.Player.Error, function () {
              t._onPlayerError()
            }),
            this.player.on(o.Player.RequestFullScreen, function () {
              t._onFullscreenChange(1)
            }),
            this.player.on(o.Player.CancelFullScreen, function () {
              t._onFullscreenChange(0)
            }),
            this.player.on(o.Private.PREPARE, function (e) {
              t._prepareTime = (new Date).getTime(),
                t._log("PREPARE", {
                  dn: e.paramData
                })
            }),
            this.player.on(o.Player.Snapshoted, function () {
              t._log("SNAPSHOT")
            }),
            setInterval(function () {
              if (t.player.getCurrentTime()) {
                var e = Math.floor(1e3 * t.player.getCurrentTime());
                t.player.paused() || 30 <= ++n && (t._log("HEARTBEAT", {
                  vt: e,
                  interval: 1e3 * n
                }),
                  n = 0)
              }
            }, 1e3)
        },
        removeEvent: function () {
          this.player.off("init"),
            this.player.off("ready"),
            this.player.off("ended"),
            this.player.off("play"),
            this.player.off("pause"),
            this.player.off("seekStart"),
            this.player.off("seekEnd"),
            this.player.off("canplaythrough"),
            this.player.off("playing"),
            this.player.off("timeupdate"),
            this.player.off("error"),
            this.player.off("fullscreenchange"),
            this.player.off(o.Private.PREPARE),
            this._logService && this._logService.dispose()
        },
        reset: function () {
          this.startTimePlay = 0,
            this.buffer_flag = 0,
            this.firstPlay = !1,
            this.playId = 0,
            this.loadstarted = 0,
            this._LoadedData = 0,
            this._canPlay = 0
        },
        encodeURL: function (e) {
          if (!e)
            return "";
          var t = this.player.getOptions();
          return t && !t.logBatched ? encodeURIComponent(e) : e
        },
        _onFullscreenChange: function (e) {
          e ? this._log("FULLSREEM", {}) : this._log("QUITFULLSCREEM", {})
        },
        _onPlayerloadstart: function () {
          this.loadstartTime = (new Date).getTime(),
            this.playId = v.guid(),
            !this.loadstarted && this.player._isPreload() && (this.loadstarted = 1,
              this._log("STARTPLAY", {
                vt: (new Date).getTime()
              }))
        },
        _onPlayerLoadMetadata: function () {
          this.loadMetaDataCost = (new Date).getTime() - this.loadstartTime
        },
        _onPlayerLoaddata: function () {
          if (!this._LoadedData && !this.buffer_flag) {
            var e = 0
              , t = 0;
            this.player.tag && (e = this.player.tag.videoWidth,
              t = this.player.tag.videoHeight),
              this._log("PREPAREEND", {
                tc: (new Date).getTime() - this._prepareTime,
                cc: (new Date).getTime() - this.loadstartTime,
                md: this.loadMetaDataCost,
                mi: JSON.stringify({
                  type: "video",
                  definition: e + "*" + t
                })
              })
          }
          this._LoadedData = 1
        },
        _onPlayerCanplay: function () {
          this._canPlay = 1,
            this._reportPlay()
        },
        _onPlayerInit: function () {
          this.buffer_flag = 0,
            this.pause_flag = 0,
            this.startTimePlay = 0,
            this.loadstarted = 0,
            this._LoadedData = 0,
            this._canPlay = 0
        },
        _onPlayerReady: function () {
          this.startTimePlay || (this.startTimePlay = (new Date).getTime())
        },
        _onPlayerFinish: function () {
          this._log("STOP", {
            vt: Math.floor(1e3 * this.player.getCurrentTime())
          }),
            this.reset()
        },
        _reportPlay: function () {
          return !(this.buffer_flag || !this._LoadedData || !this.playstartTime) && (this.first_play_time = (new Date).getTime(),
            this._log("PLAY", {
              dsm: "fix",
              tc: this.first_play_time - this.loadstartTime,
              fc: this.first_play_time - this.playstartTime
            }),
            this.buffer_flag = 1,
            !0)
        },
        _onPlayerPlay: function () {
          this.playstartTime = (new Date).getTime(),
            0 == this.playId && (this.playId = v.guid()),
            this.firstPlay || 0 != this.pause_flag || this.seeking || (this.sessionId = v.guid()),
            this.player._isPreload() || (this._log("STARTPLAY", {
              vt: (new Date).getTime()
            }),
              this.loadstartTime = (new Date).getTime()),
            this._canPlay && this._reportPlay() || this.buffer_flag && this.pause_flag && (this.pause_flag = 0,
              this.pauseEndTime = (new Date).getTime(),
              this._log("RECOVER", {
                vt: Math.floor(1e3 * this.player.getCurrentTime()),
                cost: this.pauseEndTime - this.pauseTime
              }))
        },
        _onPlayerPause: function () {
          this.buffer_flag && this.startTimePlay && (this.seeking || (this.pause_flag = 1,
            this.pauseTime = (new Date).getTime(),
            this._log("PAUSE", {
              vt: Math.floor(1e3 * this.player.getCurrentTime())
            })))
        },
        _onPlayerSeekStart: function (e) {
          this.seekStartTime = e.paramData.fromTime,
            this.seeking = !0,
            this.startTimePlay = 0,
            this.seekStartStamp = (new Date).getTime()
        },
        _onPlayerSeekEnd: function () {
          this.seekEndStamp = (new Date).getTime(),
            this._log("SEEK", {
              drag_from_timestamp: Math.floor(1e3 * this.seekStartTime),
              drag_to_timestamp: Math.floor(1e3 * this._seekEndData.toTime)
            }),
            this._log("SEEK_END", {
              vt: Math.floor(1e3 * this.player.getCurrentTime()),
              cost: this.seekEndStamp - this.seekStartStamp
            }),
            this.seeking = !1,
            this._seekEndData = null
        },
        _onPlayerLoaded: function () {
          this.buffer_flag && this.startTimePlay && (this.stucking || this.seeking || (this.stuckStartTime = (new Date).getTime(),
            this.stuckStartTime - this.startTimePlay <= 1e3 || (this.stucking = !0,
              this._log("UNDERLOAD", {
                vt: Math.floor(1e3 * this.player.getCurrentTime())
              }),
              this.stuckStartTime = (new Date).getTime())))
        },
        _onPlayerUnderload: function () {
          if ((this.buffer_flag || !this.player._options || !this.player._options.autoplay) && this.stucking && !this.seeking) {
            var e = Math.floor(1e3 * this.player.getCurrentTime())
              , t = this.stuckStartTime || (new Date).getTime()
              , i = Math.floor((new Date).getTime() - t);
            0 < i && this._log("LOADED", {
              vt: e,
              cost: i
            }),
              this.stucking = !1
          }
        },
        _onPlayerHeartBeat: function () {
          if (!this.seeking) {
            var e = Math.floor(1e3 * this.player.getCurrentTime())
              , t = this;
            this.timer || (this.timer = setTimeout(function () {
              !t.seeking && t._log("HEARTBEAT", {
                progress: e
              }),
                clearTimeout(t.timer),
                t.timer = null
            }, 6e4)),
              console.log("timeupdate")
          }
        },
        _onPlayerError: function () {
          this.playId = 0,
            this._LoadedData = 1,
            this.buffer_flag || this._reportPlay()
        },
        _log: function (e, t) {
          if (this.trackLog) {
            this.updateSourceInfo();
            var i = u.copy(this.opt);
            this.requestId = v.guid();
            var r = S.logReportTo;
            i.e = d[e] + "",
              i.ri = this.sessionId,
              i.t = (new Date).getTime() + "",
              i.cdn_ip = this._userNetInfo.cdnIp,
              i.hn = this._userNetInfo.localIp;
            var o = this.player.getCurrentQuality();
            "" != o && (i.definition = o.definition);
            var n = [];
            u.each(t, function (e, t) {
              n.push(e + "=" + t)
            });
            var a = ""
              , s = this.player.getOptions();
            s && s.vid && (a = s.vid),
              n.push("vid=" + a);
            try {
              Aliplayer && Aliplayer.__logCallback__ && (i.args = n,
                Aliplayer.__logCallback__(i))
            } catch (e) {
              console.log(e)
            }
            if ("" == (n = n.join("&")) && (n = "0"),
              i.args = this.encodeURL(n),
              this._logService)
              this._logService.add(i);
            else {
              var l = [];
              u.each(i, function (e, t) {
                l.push(e + "=" + t)
              }),
                l = l.join("&"),
                c.jsonp(r + "?" + l, function () { }, function () { })
            }
            return this.sessionId
          }
        }
      });
    t.exports = a
  }
    , {
    "../config": 5,
    "../lib/data": 17,
    "../lib/io": 24,
    "../lib/object": 26,
    "../lib/oo": 27,
    "../lib/ua": 31,
    "../player/base/event/eventtype": 43,
    "./log": 37,
    "./util": 39
  }],
  39: [function (e, t, i) {
    var r = e("../lib/cookie")
      , o = e("../lib/data")
      , n = e("../lib/ua");
    t.exports.getUuid = function () {
      var e = r.get("p_h5_u");
      return e || (e = o.guid(),
        r.set("p_h5_u", e, 730)),
        e
    }
      ,
      t.exports.getTerminalType = function () {
        var e = "pc";
        return n.IS_IPAD ? e = "pad" : n.IS_ANDROID ? e = "android" : n.IS_IOS && (e = "iphone"),
          e
      }
      ,
      t.exports.returnUTCDate = function (e) {
        var t = e.getUTCFullYear()
          , i = e.getUTCMonth()
          , r = e.getUTCDate()
          , o = e.getUTCHours()
          , n = e.getUTCMinutes()
          , a = e.getUTCSeconds()
          , s = e.getUTCMilliseconds();
        return Date.UTC(t, i, r, o, n, a, s)
      }
      ,
      t.exports.getRfc822 = function (e) {
        return e.toUTCString().replace("UTC", "GMT")
      }
  }
    , {
    "../lib/cookie": 16,
    "../lib/data": 17,
    "../lib/ua": 31
  }],
  40: [function (e, t, i) {
    var s = e("./base/player")
      , l = e("./flash/flashplayer")
      , u = e("./saas/mtsplayer")
      , c = e("./saas/vodplayer")
      , d = e("./taotv/taotvplayer")
      , p = e("./audio/audioplayer")
      , h = e("./hls/hlsplayer")
      , f = e("./flv/flvplayer")
      , _ = e("./drm/drmplayer")
      , g = e("../lib/ua")
      , y = e("../lib/playerutil")
      , v = (e("../lib/dom"),
        e("../lib/io"),
        e("../lang/index"));
    t.exports.create = function (e, t) {
      "function" != typeof t && (t = function () { }
      ),
        e.readyCallback = t,
        v.setCurrentLanguage(e.language, "h5", e.languageTexts);
      var i = y.handleOption(e)
        , r = i.source
        , o = y.isAudio(r);
      o && (i.mediaType = "audio");
      var n, a = y.createWrapper(i);
      return a.player ? a.player : (o ? n = new p(a, i) : !i.useFlashPrism && y.isFlv(r) && y.isSupportFlv() ? n = new f(a, i) : g.IS_MOBILE || !i.useFlashPrism && !y.isRTMP(r) ? i.vid && !i.source ? n = i.authInfo ? new u(a, i) : i.playauth || i.accessKeyId && i.accessKeySecret ? new c(a, i) : new d(a, i) : y.isDash(r) && y.isSupportMSE() ? n = new _(a, i) : y.isHls(r) ? y.canPlayHls() ? n = y.isSupportHls() && (y.isUsedHlsPluginOnMobile() || y.isSafariUsedHlsPlugin(i.useHlsPluginForSafari)) ? new h(a, i) : new s(a, i) : y.isSupportHls() ? n = new h(a, i) : g.os.pc ? i.userH5Prism || i.useH5Prism || (n = new l(a, i)) : n = new s(a, i) : n = (g.os.pc,
        new s(a, i)) : n = new l(a, i),
        n)
    }
  }
    , {
    "../lang/index": 11,
    "../lib/dom": 18,
    "../lib/io": 24,
    "../lib/playerutil": 29,
    "../lib/ua": 31,
    "./audio/audioplayer": 41,
    "./base/player": 62,
    "./drm/drmplayer": 69,
    "./flash/flashplayer": 70,
    "./flv/flvplayer": 72,
    "./hls/hlsplayer": 74,
    "./saas/mtsplayer": 78,
    "./saas/vodplayer": 84,
    "./taotv/taotvplayer": 93
  }],
  41: [function (e, t, i) {
    var r = e("../base/player")
      , o = e("../../ui/component")
      , n = e("../../lib/dom")
      , a = e("../../lib/object")
      , s = e("../../lib/playerutil")
      , l = r.extend({
        init: function (e, t) {
          this._isAudio = !0,
            void 0 === t.skinLayout && (t.skinLayout = s.defaultAudioLayout),
            r.call(this, e, t)
        }
      });
    l.prototype.createEl = function () {
      "AUDIO" !== this.tag.tagName && (this._el = this.tag,
        this.tag = o.prototype.createEl.call(this, "audio"));
      var t = this._el
        , e = this.tag;
      e.player = this;
      var i = n.getElementAttributes(e);
      return a.each(i, function (e) {
        t.setAttribute(e, i[e])
      }),
        this.setVideoAttrs(),
        e.parentNode && e.parentNode.insertBefore(t, e),
        n.insertFirst(e, t),
        t
    }
      ,
      t.exports = l
  }
    , {
    "../../lib/dom": 18,
    "../../lib/object": 26,
    "../../lib/playerutil": 29,
    "../../ui/component": 94,
    "../base/player": 62
  }],
  42: [function (e, t, i) {
    var a = e("../../../lib/event")
      , s = e("./eventtype")
      , r = e("../eventHandler/video/index")
      , o = e("../eventHandler/player/index");
    t.exports.offAll = function (e) {
      var t = e.tag
        , i = e._el;
      for (var r in s.Video)
        a.off(t, s.Video[r]);
      for (var o in s.Player)
        a.off(i, s.Player[o]);
      for (var n in s.Private)
        a.off(i, s.Private[n])
    }
      ,
      t.exports.onAll = function (e) {
        r.bind(e),
          o.bind(e)
      }
  }
    , {
    "../../../lib/event": 19,
    "../eventHandler/player/index": 47,
    "../eventHandler/video/index": 56,
    "./eventtype": 43
  }],
  43: [function (e, t, i) {
    t.exports = {
      Video: {
        TimeUpdate: "timeupdate",
        Play: "play",
        Playing: "playing",
        Pause: "pause",
        CanPlay: "canplay",
        Waiting: "waiting",
        Ended: "ended",
        Error: "error",
        Suspend: "suspend",
        Stalled: "stalled",
        LoadStart: "loadstart",
        DurationChange: "durationchange",
        LoadedData: "loadeddata",
        LoadedMetadata: "loadedmetadata",
        Progress: "progress",
        CanPlayThrough: "canplaythrough",
        ContextMenu: "contextmenu",
        Seeking: "seeking",
        Seeked: "seeked",
        ManualEnded: "manualended"
      },
      Player: {
        TimeUpdate: "timeupdate",
        DurationChange: "durationchange",
        Init: "init",
        Ready: "ready",
        Play: "play",
        Pause: "pause",
        CanPlay: "canplay",
        Waiting: "waiting",
        Ended: "ended",
        Error: "error",
        RequestFullScreen: "requestFullScreen",
        CancelFullScreen: "cancelFullScreen",
        Snapshoted: "snapshoted",
        Snapshoting: "snapshoting",
        OnM3u8Retry: "onM3u8Retry",
        LiveStreamStop: "liveStreamStop",
        AutoPlayPrevented: "autoPlayPrevented",
        AutoPlay: "autoplay",
        StartSeek: "startSeek",
        CompleteSeek: "completeSeek",
        TextTrackReady: "textTrackReady",
        AudioTrackReady: "audioTrackReady",
        AudioTrackUpdated: "audioTrackUpdated",
        LevelsLoaded: "levelsLoaded",
        AudioTrackSwitch: "audioTrackSwitch",
        AudioTrackSwitched: "audioTrackSwitched",
        LevelSwitch: "levelSwitch",
        LevelSwitched: "levelSwitched",
        MarkerDotOver: "markerDotOver",
        MarkerDotOut: "markerDotOut"
      },
      Private: {
        Play_Btn_Show: "play_btn_show",
        UiH5Ready: "uiH5Ready",
        Error_Hide: "error_hide",
        Error_Show: "error_show",
        Info_Show: "info_show",
        Info_Hide: "info_hide",
        H5_Loading_Show: "h5_loading_show",
        H5_Loading_Hide: "h5_loading_hide",
        HideProgress: "hideProgress",
        CancelHideProgress: "cancelHideProgress",
        Click: "click",
        MouseOver: "mouseover",
        MouseOut: "mouseout",
        MouseEnter: "mouseenter",
        MouseLeave: "mouseleave",
        TouchStart: "touchstart",
        TouchMove: "touchmove",
        TouchEnd: "touchend",
        HideBar: "hideBar",
        ShowBar: "showBar",
        ReadyState: "readyState",
        SourceLoaded: "sourceloaded",
        QualityChange: "qualitychange",
        Play_Btn_Hide: "play_btn_hide",
        Cover_Hide: "cover_hide",
        Cover_Show: "cover_show",
        SeekStart: "seekStart",
        EndStart: "endStart",
        UpdateProgressBar: "updateProgressBar",
        LifeCycleChanged: "lifeCycleChanged",
        Dispose: "dispose",
        Created: "created",
        Snapshot_Hide: "snapshot_hide",
        AutoStreamShow: "auto_stream_show",
        AutoStreamHide: "auto_stream_hide",
        VolumnChanged: "volumnchanged",
        LiveShiftQueryCompleted: "liveShiftQueryCompleted",
        StreamSelectorHide: "streamSelectorHide",
        SpeedSelectorHide: "speedSelectorHide",
        SettingShow: "settingShow",
        SettingHide: "settingHide",
        SelectorShow: "selectorShow",
        SelectorHide: "selectorHide",
        SettingListShow: "settingListShow",
        SettingListHide: "settingListHide",
        ThumbnailHide: "thumbnailHide",
        ThumbnailShow: "thumbnailShow",
        ThumbnailLoaded: "thumbnailLoaded",
        TooltipShow: "tooltipShow",
        TooltipHide: "tooltipHide",
        SelectorUpdateList: "selectorUpdateList",
        SelectorValueChange: "selectorValueChange",
        VolumeVisibilityChange: "volumeVisibilityChange",
        ChangeURL: "changeURL",
        UpdateToSettingList: "updateToSettingList",
        CCChanged: "CCChanged",
        CCStateChanged: "CCStateChanged",
        PlayClick: "click",
        ProgressMarkerLoaded: "progressMarkerLoaded",
        MarkerTextShow: "markerTextShow",
        MarkerTextHide: "markerTextHide",
        PREPARE: "prepare",
        ProgressMarkerChanged: "progressMarkerChanged"
      }
    }
  }
    , {}],
  44: [function (e, t, i) {
    e("../../event/eventtype");
    var r = e("../../../../lib/dom")
      , o = e("../../../../lib/ua");
    t.exports.handle = function () {
      o.IS_IOS || r.removeClass(this.el(), "prism-fullscreen")
    }
  }
    , {
    "../../../../lib/dom": 18,
    "../../../../lib/ua": 31,
    "../../event/eventtype": 43
  }],
  45: [function (e, t, i) {
    var r = e("../../event/eventtype");
    t.exports.handle = function (e) {
      var t = this;
      this._enteredProgressMarker && t.one(r.Player.CanPlay, function () {
        t.pause()
      }),
        t._seeking = !1,
        t.trigger(r.Player.CompleteSeek, e.paramData.toTime)
    }
  }
    , {
    "../../event/eventtype": 43
  }],
  46: [function (e, t, i) {
    var r = e("../../event/eventtype")
      , o = (e("../../../../lib/constants"),
        e("../../../../lang/index"),
        e("../../../../monitor/util"));
    t.exports.handle = function (e) {
      var t = this
        , i = e.paramData;
      t.trigger(r.Private.H5_Loading_Hide),
        t.trigger(r.Private.Cover_Hide),
        t.trigger(r.Private.Play_Btn_Hide),
        t.trigger(r.Private.SettingListHide),
        t.trigger(r.Private.SelectorHide),
        t.trigger(r.Private.VolumeVisibilityChange, ""),
        i = i || {},
        t._monitor && (i.uuid = o.getUuid(),
          i.requestId = t._serverRequestId,
          i.cdnIp = t._monitor._userNetInfo.cdnIp,
          i.localIp = t._monitor._userNetInfo.localIp),
        t._isError = !0,
        t.trigger(r.Private.Error_Show, i),
        t.trigger(r.Private.LifeCycleChanged, {
          type: r.Player.Error,
          data: i
        })
    }
  }
    , {
    "../../../../lang/index": 11,
    "../../../../lib/constants": 15,
    "../../../../monitor/util": 39,
    "../../event/eventtype": 43
  }],
  47: [function (e, t, i) {
    var r = e("../../event/eventtype")
      , o = e("../../../../lib/event")
      , n = e("./lifecyclecommon")
      , a = {
        endStart: e("./endstart"),
        seekStart: e("./seekstart"),
        requestFullScreen: e("./requestfullscreen"),
        cancelFullScreen: e("./cancelfullscreen"),
        error: e("./error")
      }
      , s = [r.Private.EndStart, r.Private.SeekStart, r.Player.RequestFullScreen, r.Player.CancelFullScreen, r.Player.Error, r.Player.Ready, r.Private.Dispose, r.Private.Created]
      , l = function (t, i, r) {
        var e = t.el();
        o.on(e, i, function (e) {
          (r && r.handle ? r.handle : n.handle).call(t, e, i)
        })
      };
    t.exports.bind = function (e) {
      e.el();
      for (var t = 0; t < s.length; t++) {
        var i = s[t];
        "undefined" != a[i] && l(e, i, a[i])
      }
    }
  }
    , {
    "../../../../lib/event": 19,
    "../../event/eventtype": 43,
    "./cancelfullscreen": 44,
    "./endstart": 45,
    "./error": 46,
    "./lifecyclecommon": 48,
    "./requestfullscreen": 49,
    "./seekstart": 50
  }],
  48: [function (e, t, i) {
    var r = e("../../event/eventtype");
    t.exports.handle = function (e, t) {
      this.trigger(r.Private.LifeCycleChanged, {
        type: t,
        data: e
      })
    }
  }
    , {
    "../../event/eventtype": 43
  }],
  49: [function (e, t, i) {
    e("../../event/eventtype");
    var r = e("../../../../lib/dom")
      , o = e("../../../../lib/ua");
    t.exports.handle = function () {
      o.IS_IOS || r.addClass(this.el(), "prism-fullscreen")
    }
  }
    , {
    "../../../../lib/dom": 18,
    "../../../../lib/ua": 31,
    "../../event/eventtype": 43
  }],
  50: [function (e, t, i) {
    var r = e("../../event/eventtype");
    t.exports.handle = function (e) {
      this._seeking = !0,
        this.trigger(r.Player.StartSeek, e.paramData.fromTime)
    }
  }
    , {
    "../../event/eventtype": 43
  }],
  51: [function (e, t, i) {
    var r = e("../../event/eventtype");
    t.exports.handle = function (e) {
      var t = this;
      t._retrySwitchUrlCount = 0,
        t._liveRetryCount = 0,
        t._clearLiveErrorHandle();
      var i = (new Date).getTime() - t.readyTime;
      t._options.autoplay || t._options._autoplay || !t.paused() || (t.trigger(r.Private.H5_Loading_Hide),
        t.trigger(r.Private.Play_Btn_Show)),
        t.trigger(r.Player.CanPlay, {
          loadtime: i
        })
    }
  }
    , {
    "../../event/eventtype": 43
  }],
  52: [function (e, t, i) {
    var r = e("../../event/eventtype")
      , o = e("../../../../lib/dom")
      , n = e("../../../../lib/ua");
    t.exports.handle = function (e) {
      var t = this.tag;
      "none" === t.style.display && n.IS_IOS && setTimeout(function () {
        o.css(t, "display", "block")
      }, 100),
        this.trigger(r.Video.CanPlayThrough)
    }
  }
    , {
    "../../../../lib/dom": 18,
    "../../../../lib/ua": 31,
    "../../event/eventtype": 43
  }],
  53: [function (e, t, i) {
    t.exports.handle = function (e, t) {
      var i = "";
      e && e.paramData && (i = e.paramData),
        this.trigger(t, i)
    }
  }
    , {}],
  54: [function (e, t, i) {
    var r = e("../../event/eventtype");
    e("../../../../lang/index");
    t.exports.handle = function (e) {
      var t = this;
      t.waiting = !1,
        t._ended = !0,
        t._monitor && t._monitor._onPlayerInit(),
        t._options.rePlay ? (t.seek(0),
          t.tag.play()) : t._options.isLive && t.trigger(r.Private.H5_Loading_Hide),
        t.trigger(r.Private.Play_Btn_Show),
        t.trigger(r.Player.Ended)
    }
  }
    , {
    "../../../../lang/index": 11,
    "../../event/eventtype": 43
  }],
  55: [function (e, t, i) {
    var c = e("../../event/eventtype")
      , d = (e("../../../../lib/ua"),
        e("../../../../lib/playerutil"),
        e("../../../../lib/constants"))
      , p = e("../../../../lang/index");
    t.exports.handle = function (e) {
      var t = this;
      if (t.waiting = !1,
        t._clearTimeout(),
        t.checkOnline()) {
        var i, r = "", o = e.target || e.srcElement, n = o.error.message;
        r = "";
        if (o.error.code && (i = o.error.code,
          r = d.VideoErrorCode[o.error.code],
          n = i + " || " + n),
          t._options.isLive)
          t._options.liveRetry > t._liveRetryCount ? t._reloadAndPlayForM3u8() : (t._liveRetryCount = 0,
            t.trigger(c.Player.LiveStreamStop),
            t._liveErrorHandle = setTimeout(function () {
              var e = {
                mediaId: "ISLIVE",
                error_code: r,
                error_msg: p.get("Error_Play_Text") + "\uff0c" + p.get("Error_Retry_Text")
              };
              t.logError(e),
                t.trigger("error", e)
            }));
        else if (t._reloadForVod())
          ;
        else {
          var a = p.get("Error_Play_Text")
            , s = !1;
          if (i < 4) {
            if (3 == i && t._firstDecodeError) {
              var l = t.getCurrentTime() + 1;
              return t._loadByUrlInner(t._options.source, l, !0),
                void (t._firstDecodeError = !1)
            }
            a = d.VideoErrorCodeText[i]
          } else
            t._eventState == d.SUSPEND ? (a = p.get("Error_Load_Abort_Text"),
              r = d.ErrorCode.RequestDataError) : t._eventState == d.LOAD_START ? (a = p.get("Error_Network_Text"),
                0 < t._options.source.indexOf("auth_key") && (a = a + "\uff0c" + p.get("Error_AuthKey_Text")),
                r = d.ErrorCode.StartLoadData) : t._eventState == d.LOADED_METADATA && (a = p.get("Error_Play_Text"),
                  r = d.ErrorCode.PlayingError);
          a = a + "\uff0c" + p.get("Error_Retry_Text"),
            1 < t._urls.length && t._retrySwitchUrlCount < 3 && -1 == t._options.source.indexOf(".mpd") && (t.switchUrl(),
              s = !0);
          var u = {
            mediaId: t._options.vid ? t._options.vid : "",
            error_code: r,
            error_msg: n
          };
          s || (t.logError(u),
            u.display_msg = a,
            t.trigger(c.Player.Error, u))
        }
      }
    }
  }
    , {
    "../../../../lang/index": 11,
    "../../../../lib/constants": 15,
    "../../../../lib/playerutil": 29,
    "../../../../lib/ua": 31,
    "../../event/eventtype": 43
  }],
  56: [function (e, t, i) {
    var o = e("../../../../lib/event")
      , n = e("../../event/eventtype")
      , r = {
        canplay: e("./canplay"),
        canplaythrough: e("./canplaythrough"),
        common: e("./common"),
        ended: e("./ended"),
        error: e("./error"),
        pause: e("./pause"),
        play: e("./play"),
        playing: e("./playing"),
        waiting: e("./waiting"),
        timeupdate: e("./timeupdate"),
        manualended: e("./ended")
      }
      , a = function (t, i, r) {
        var e = t.tag;
        o.on(e, i, function (e) {
          r.handle.call(t, e, i),
            i != n.Video.Error && (i == n.Video.ManualEnded && (i = n.Video.Ended),
              t.trigger(n.Private.LifeCycleChanged, {
                type: i,
                data: e
              }))
        })
      };
    t.exports.bind = function (e) {
      e.tag;
      for (var t in n.Video) {
        var i = n.Video[t];
        a(e, i, void 0 !== r[i] ? r[i] : r.common)
      }
    }
  }
    , {
    "../../../../lib/event": 19,
    "../../event/eventtype": 43,
    "./canplay": 51,
    "./canplaythrough": 52,
    "./common": 53,
    "./ended": 54,
    "./error": 55,
    "./pause": 57,
    "./play": 58,
    "./playing": 59,
    "./timeupdate": 60,
    "./waiting": 61
  }],
  57: [function (e, t, i) {
    var r = e("../../event/eventtype");
    t.exports.handle = function (e) {
      var t = this;
      t._clearTimeout(),
        t.trigger(r.Private.AutoStreamHide),
        t.trigger(r.Player.Pause),
        t._isManualPause && (t.trigger(r.Private.Play_Btn_Show),
          t.trigger(r.Private.H5_Loading_Hide)),
        t.waiting = !1
    }
  }
    , {
    "../../event/eventtype": 43
  }],
  58: [function (e, t, i) {
    var r = e("../../event/eventtype");
    t.exports.handle = function (e) {
      var t = this;
      t.trigger(r.Private.Error_Hide),
        t.trigger(r.Private.Cover_Hide),
        t.trigger(r.Private.AutoStreamHide),
        t.waiting = !1,
        t.trigger(r.Player.Play)
    }
  }
    , {
    "../../event/eventtype": 43
  }],
  59: [function (e, t, i) {
    var o = e("../../event/eventtype");
    t.exports.handle = function (e) {
      var t = this;
      t.trigger(o.Private.H5_Loading_Hide),
        t.trigger(o.Private.Cover_Hide),
        t.trigger(o.Private.Info_Hide),
        t.waiting = !1,
        t._ended = !1,
        t._liveRetryCount = 0,
        t._vodRetryCount = 0,
        t._firstDecodeError = !0;
      var i = t.getCurrentTime();
      if (t._waitingReloadTime != i && (t._waitingTimeoutCount = 0),
        t._checkTimeoutHandle && (clearTimeout(t._checkTimeoutHandle),
          t._checkTimeoutHandle = null),
        t._waitingLoadedHandle && (clearTimeout(t._waitingLoadedHandle),
          t._waitingLoadedHandle = null),
        t._waitingDelayLoadingShowHandle && (clearTimeout(t._waitingDelayLoadingShowHandle),
          t._waitingDelayLoadingShowHandle = null),
        t._waitingTimeoutHandle && (clearTimeout(t._waitingTimeoutHandle),
          t._waitingTimeoutHandle = null,
          t._ccService && t._options.isLive)) {
        var r = t._ccService.getCurrentSubtitle();
        t._setDefaultCC = !0,
          r && t._ccService["switch"](r)
      }
      t.trigger(o.Private.AutoStreamHide),
        t.trigger(o.Player.Playing),
        t.trigger(o.Private.Play_Btn_Hide),
        t.trigger(o.Private.Error_Hide)
    }
  }
    , {
    "../../event/eventtype": 43
  }],
  60: [function (e, t, i) {
    var n = e("../../event/eventtype")
      , a = e("../../../../lib/ua")
      , s = e("../../../../lib/event")
      , l = e("../../plugin/status");
    t.exports.handle = function (e) {
      var i = this;
      i.trigger(n.Player.TimeUpdate, e.timeStamp);
      var t = i.getCurrentTime();
      if (i.waiting && !i._TimeUpdateStamp && (i._TimeUpdateStamp = t),
        0 != i.waiting && i._TimeUpdateStamp == t || (i.trigger(n.Private.H5_Loading_Hide),
          i.trigger(n.Private.AutoStreamHide),
          i._checkTimeoutHandle && clearTimeout(i._checkTimeoutHandle),
          i._waitingTimeoutHandle && clearTimeout(i._waitingTimeoutHandle),
          i._waitingLoadedHandle && clearTimeout(i._waitingLoadedHandle),
          i.waiting = !1),
        i._TimeUpdateStamp = t,
        !i._options.isLive) {
        var r = i.getDuration()
          , o = !1;
        r < t && !i.paused() ? o = !0 : r - t < .2 && 0 <= a.browser.version.indexOf("49.") && !i.paused() ? o = !0 : i.exceedPreviewTime(t) && (o = !0),
          o && !i._ended && (i.pause(),
            s.trigger(i.tag, n.Video.ManualEnded))
      }
      i._playingSlientPause && (clearTimeout(i._playingSlientPause),
        i._playingSlientPause = null),
        i._playingSlientPause = setTimeout(function () {
          if (i._status == l.playing) {
            var e = i.getCurrentTime()
              , t = i._options.isLive ? 0 : e;
            i._loadByUrlInner(i._options.source, t, !0)
          }
        }, 2e3)
    }
  }
    , {
    "../../../../lib/event": 19,
    "../../../../lib/ua": 31,
    "../../event/eventtype": 43,
    "../../plugin/status": 66
  }],
  61: [function (e, t, i) {
    var n = e("../../event/eventtype")
      , a = e("../../../../lib/constants")
      , s = e("../../../../lib/event")
      , l = e("../../../../lang/index");
    t.exports.handle = function (e) {
      var i = this;
      if (!i._options.isLive) {
        var t = this.getCurrentTime()
          , r = this.getDuration();
        if (r - t < .5 || r < t)
          return i.pause(),
            i._ended = !0,
            void s.trigger(this.tag, n.Video.ManualEnded)
      }
      i.waiting = !0;
      var o = function () {
        i._checkTimeoutHandle && (clearTimeout(i._checkTimeoutHandle),
          i._checkTimeoutHandle = null),
          i._waitingTimeoutHandle && (clearTimeout(i._waitingTimeoutHandle),
            i._waitingTimeoutHandle = null),
          i._waitingLoadedHandle && (clearTimeout(i._waitingLoadedHandle),
            i._waitingLoadedHandle = null),
          i._waitingDelayLoadingShowHandle && (clearTimeout(i._waitingDelayLoadingShowHandle),
            i._waitingDelayLoadingShowHandle = null)
      };
      o(),
        i._waitingDelayLoadingShowHandle = setTimeout(function () {
          i.trigger(n.Private.H5_Loading_Show)
        }, 1e3 * i._options.delayLoadingShow),
        i._TimeUpdateStamp = null,
        i._checkTimeoutHandle = setTimeout(function () {
          i.trigger(n.Private.AutoStreamShow)
        }, 1e3 * i._options.loadDataTimeout),
        i.trigger(n.Player.Waiting),
        i._waitingTimeoutHandle = setTimeout(function () {
          if (i.tag && i._options) {
            i.pause();
            var e = {
              mediaId: i._options.vid ? i._options.vid : "",
              error_code: a.ErrorCode.LoadingTimeout,
              error_msg: l.get("Error_Waiting_Timeout_Text")
            };
            i.logError(e),
              i.trigger("error", e)
          }
        }, 1e3 * i._options.waitingTimeout),
        i._waitingLoadedHandle = setTimeout(function () {
          var e = i.getCurrentTime();
          if (0 == i._waitingTimeoutCount && e != i._waitingReloadTime) {
            i._waitingTimeoutCount = 1,
              i._waitingReloadTime = e;
            var t = i._options.isLive ? 0 : e;
            i._loadByUrlInner(i._options.source, t, !0)
          }
        }, i._options.waitingTimeout / 2 * 1e3),
        i.on("error", function () {
          o()
        })
    }
  }
    , {
    "../../../../lang/index": 11,
    "../../../../lib/constants": 15,
    "../../../../lib/event": 19,
    "../../event/eventtype": 43
  }],
  62: [function (e, t, i) {
    var n = e("../../ui/component")
      , a = e("../../lib/object")
      , o = e("../../lib/dom")
      , s = e("../../lib/event")
      , l = (e("../../lib/io"),
        e("../../ui/exports"))
      , u = e("../../monitor/monitor")
      , r = e("../../lib/ua")
      , c = e("../../lib/constants")
      , d = e("../../lib/util")
      , p = (e("../../config"),
        e("../../lib/playerutil"))
      , h = e("./x5play")
      , f = e("../../lib/cookie")
      , _ = e("../../lang/index")
      , g = e("../../feature/autoPlayDelay")
      , y = e("./event/eventmanager")
      , v = e("../../ui/component/cover")
      , m = e("../../ui/component/play-animation")
      , S = e("../../commonui/autostreamselector")
      , T = e("./event/eventtype")
      , b = e("./plugin/lifecyclemanager")
      , x = e("../service/export")
      , E = e("../../ui/component/progressmarker")
      , P = n.extend({
        init: function (e, t) {
          if (this.tag = e,
            this.loaded = !1,
            this.played = !1,
            this.waiting = !1,
            this._urls = [],
            this._currentPlayIndex = 0,
            this._retrySwitchUrlCount = 0,
            this._isError = !1,
            this._isHls = !1,
            this._liveRetryCount = 0,
            this._vodRetryCount = 0,
            this._seeking = !1,
            this._serverRequestId = 0,
            this._waitingTimeoutCount = 0,
            this._waitingReloadTime = 0,
            this._created = !1,
            this._firstDecodeError = !0,
            this._enteredProgressMarker = !1,
            this._liveShiftSeekStartTime = 0,
            this._duration = 0,
            this.__disposed = !1,
            void 0 === t.skinLayout && (t.skinLayout = p.defaultH5Layout),
            n.call(this, this, t),
            this.addClass("prism-player"),
            t.plugins && a.each(t.plugins, function (e, t) {
              this[e](t)
            }, this),
            this._createService(),
            this.UI = {},
            t.useNativeControls ? this.tag.setAttribute("controls", "controls") : this.UI = l,
            this.initChildren(),
            y.onAll(this),
            this._lifeCycleManager = new b(this),
            this._options.trackLog && (this._monitor = new u(this, {
              video_id: 0,
              album_id: 0,
              from: this._options.from,
              source: this._options.source,
              logBatched: this._options.logBatched
            }, this._options.trackLog)),
            this._overrideNativePlay(),
            !this._liveshiftService || this._liveshiftService.validate()) {
            if (this._options.extraInfo) {
              var i = this._options.extraInfo;
              i.liveRetry && (this._options.liveRetry = i.liveRetry)
            }
            if (this.on(T.Private.ReadyState, function () {
              this.trigger(T.Player.Ready)
            }),
              this._thumbnailService && this._options.thumbnailUrl && this._thumbnailService.get(this._options.thumbnailUrl),
              0 < this._options.progressMarkers.length && this.trigger(T.Private.ProgressMarkerLoaded, this._options.progressMarkers),
              this._options.source && this._options._native && this._executeReadyCallback(),
              this._options.autoplay || this._options.preload ? this.trigger(T.Private.H5_Loading_Show) : this.trigger(T.Private.Play_Btn_Show),
              this._extraMultiSources(),
              this._options.source)
              if (this.trigger(T.Private.PREPARE, "custom"),
                this._options.autoPlayDelay) {
                this._autoPlayDelay = new g(this);
                var r = this;
                this._autoPlayDelay.handle(function () {
                  r.initPlay()
                })
              } else
                this.initPlay()
          } else {
            var o = {
              mediaId: this._options.vid ? this._options.vid : "",
              error_code: c.ErrorCode.InvalidParameter,
              error_msg: _.get("ShiftLiveTime_Error")
            };
            this.trigger(T.Player.Error, o)
          }
        }
      });
    P.prototype.initPlay = function (e) {
      this._initPlayBehavior(e, this._options.source)
    }
      ,
      P.prototype.initChildren = function () {
        var e = this.options()
          , t = e.skinLayout;
        if (!1 !== t && !a.isArray(t))
          throw new Error("PrismPlayer Error: skinLayout should be false or type of array!");
        !1 !== t && 0 !== t.length && (this.options({
          children: t
        }),
          n.prototype.initChildren.call(this)),
          this.UI.cover = v,
          this.addChild("cover", e),
          this.UI.playanimation = m,
          this.addChild("playanimation", e),
          this.UI.autoStreamSelector = S,
          this.addChild("autoStreamSelector", e),
          this.UI.progressMarker = E,
          this.addChild("progressMarker", e),
          this.trigger(T.Private.UiH5Ready)
      }
      ,
      P.prototype.createEl = function () {
        var e = !1;
        "VIDEO" !== this.tag.tagName ? (this._el = this.tag,
          this.tag = n.prototype.createEl.call(this, "video"),
          this._options.playsinline && (this.tag.setAttribute("webkit-playsinline", ""),
            this.tag.setAttribute("playsinline", ""),
            this.tag.setAttribute("x-webkit-airplay", ""),
            this.tag.setAttribute("x5-playsinline", ""))) : (e = !0,
              this._el = this.tag.parentNode);
        var t = this._el
          , i = this.tag;
        this._options.enableSystemMenu || (i.addEventListener ? i.addEventListener("contextmenu", function (e) {
          e.preventDefault()
        }, !1) : i.attachEvent("oncontextmenu", function () {
          window.event.returnValue = !1
        })),
          i.player = this;
        var r = o.getElementAttributes(i);
        return a.each(r, function (e) {
          t.setAttribute(e, r[e])
        }),
          this.setVideoAttrs(),
          e || (i.parentNode && i.parentNode.insertBefore(t, i),
            o.insertFirst(i, t)),
          t
      }
      ,
      P.prototype.setVideoAttrs = function () {
        var e = this._options.preload
          , t = this._options.autoplay;
        if (this.tag.style.width = this._options.videoWidth || "100%",
          this.tag.style.height = this._options.videoHeight || "100%",
          e && this.tag.setAttribute("preload", "preload"),
          t && !this._isEnabledAILabel() && this.tag.setAttribute("autoplay", "autoplay"),
          r.IS_IOS && this.tag.setAttribute("poster", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAAAMZJREFUeAHt0DEBAAAAwqD1T20LL4hAYcCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMDAc2CcpAABaODCqQAAAABJRU5ErkJggg=="),
          this._options.extraInfo)
          for (var i in this._options.extraInfo)
            this.tag.setAttribute(i, this._options.extraInfo[i]);
        h.adaptX5Play(this)
      }
      ,
      P.prototype.checkOnline = function () {
        if (!this._options || this._options.debug)
          return !0;
        if (0 != navigator.onLine)
          return !0;
        var e = {
          mediaId: this._options.vid ? this._options.vid : "",
          error_code: c.ErrorCode.NetworkUnavaiable,
          error_msg: _.get("Error_Offline_Text")
        };
        return e.display_msg = _.get("Error_Offline_Text"),
          this.trigger(T.Player.Error, e),
          !1
      }
      ,
      P.prototype.id = function () {
        return this.el().id
      }
      ,
      P.prototype.renderUI = function () { }
      ,
      P.prototype.switchUrl = function () {
        if (0 != this._urls.length) {
          this._currentPlayIndex = this._currentPlayIndex + 1,
            this._urls.length <= this._currentPlayIndex && (this._currentPlayIndex = 0,
              this._retrySwitchUrlCount++);
          var e = this._urls[this._currentPlayIndex];
          f.set(c.SelectedStreamLevel, e.definition, 365),
            this.trigger(T.Private.QualityChange, _.get("Quality_Change_Fail_Switch_Text"));
          var t = this.getCurrentTime();
          this._vodRetryCount = 0,
            this._originalSource = "",
            this._loadByUrlInner(e.Url, t, !0)
        }
      }
      ,
      P.prototype.setControls = function () {
        var e = this.options();
        if (e.useNativeControls)
          this.tag.setAttribute("controls", "controls");
        else if ("object" == typeof e.controls) {
          var t = this._initControlBar(e.controls);
          this.addChild(t)
        }
      }
      ,
      P.prototype._initControlBar = function (e) {
        return new ControlBar(this, e)
      }
      ,
      P.prototype.getMetaData = function () {
        var t = this
          , i = this.tag;
        t._readyStateTimer && clearInterval(t._readyStateTimer),
          t._readyStateTimer = window.setInterval(function (e) {
            t.tag ? i && 0 < i.readyState && (t._duration = i.duration < 1 ? 0 : i.duration,
              t.trigger(T.Private.ReadyState),
              clearInterval(t._readyStateTimer)) : clearInterval(t._readyStateTimer)
          }, 100)
      }
      ,
      P.prototype.getReadyTime = function () {
        return this.readyTime
      }
      ,
      P.prototype.readyState = function () {
        return this.tag.readyState
      }
      ,
      P.prototype.getError = function () {
        return this.tag.error
      }
      ,
      P.prototype.getRecentOccuredEvent = function () {
        return this._eventState
      }
      ,
      P.prototype.getSourceUrl = function () {
        return this._options ? this._options.source : ""
      }
      ,
      P.prototype.getMonitorInfo = function () {
        return this._monitor ? this._monitor.opt : {}
      }
      ,
      P.prototype.getCurrentQuality = function () {
        if (0 < this._urls.length) {
          var e = this._urls[this._currentPlayIndex];
          return {
            width: e.width,
            url: e.Url,
            definition: e.definition
          }
        }
        return ""
      }
      ,
      P.prototype.setSpeed = function (e) {
        this.tag && (this._originalPlaybackRate = e,
          this.tag.playbackRate = e)
      }
      ,
      P.prototype.play = function (e) {
        return this.tag && (this.tag.ended || this._ended ? this.replay() : ((this._options.preload || this.loaded) && this.tag.src || this._initLoad(this._options.source),
          this.trigger(T.Private.Cover_Hide),
          this.tag.play())),
          this._isManualPlay = e || !1,
          this
      }
      ,
      P.prototype.replay = function () {
        return this._monitor && this._monitor.replay(),
          this.seek(0),
          this.tag.play(),
          this
      }
      ,
      P.prototype.pause = function (e) {
        return this.tag && this.tag.pause(),
          this._isManualPause = e || !1,
          this
      }
      ,
      P.prototype.stop = function () {
        return this.tag.setAttribute("src", null),
          this
      }
      ,
      P.prototype.paused = function () {
        if (this.tag)
          return !1 !== this.tag.paused
      }
      ,
      P.prototype.getDuration = function () {
        var e = 0;
        return this.tag && (e = this.isPreview() ? this._vodDuration || this.tag.duration : this._duration && this._duration != 1 / 0 ? this._duration : this.tag.duration),
          e
      }
      ,
      P.prototype.getDisplayDuration = function () {
        var e = 0;
        return this.tag && (e = this._vodDuration || this.getDuration()),
          e
      }
      ,
      P.prototype.getCurrentTime = function () {
        return this.tag ? this.tag.currentTime : 0
      }
      ,
      P.prototype.seek = function (e) {
        e === this.tag.duration && e--;
        var t = this._originalPlaybackRate || this.tag.playbackRate;
        try {
          var i = this;
          this.tag.currentTime = e,
            setTimeout(function () {
              i.tag && (i.tag.playbackRate = t)
            })
        } catch (e) {
          console.log(e)
        }
        return this
      }
      ,
      P.prototype.firstNewUrlloadByUrl = function (e, t) {
        this._clearTimeout(),
          this._options.vid = 0,
          this._options.source = e,
          this._monitor && this._monitor.updateVideoInfo({
            video_id: 0,
            album_id: 0,
            source: e,
            from: this._options.from
          }),
          this.trigger(T.Private.ChangeURL),
          this.initPlay(),
          this._options.autoplay && this.trigger(T.Private.Cover_Hide),
          this._options.autoplay ? this.trigger(T.Player.Play) : this.trigger(T.Player.Pause),
          t || (t = 0),
          !t && 0 != t || isNaN(t) || this.seek(t)
      }
      ,
      P.prototype._loadByUrlInner = function (e, t, i) {
        this.loadByUrl(e, t, i, !0)
      }
      ,
      P.prototype.loadByUrl = function (e, t, i, r) {
        this._monitor && !r && this._monitor.reset(),
          this._isError = !1,
          this._duration = 0,
          this._clearTimeout(),
          this.trigger(T.Private.Error_Hide),
          this._options.vid = 0,
          this._options.source = e,
          this._monitor && this._monitor.updateVideoInfo({
            video_id: 0,
            album_id: 0,
            source: e,
            from: this._options.from
          }),
          r || (this.trigger(T.Private.ChangeURL),
            this._vodRetryCount = 0),
          this._options._autoplay = i,
          this.initPlay(i),
          (this._options.autoplay || i) && this.trigger(T.Private.Cover_Hide),
          this._options.autoplay || i ? this.trigger(T.Player.Play) : this.trigger(T.Player.Pause);
        var o = this;
        this._options.isLive || s.one(this.tag, T.Video.CanPlay, function (e) {
          !t && 0 != t || isNaN(t) || o.seek(t)
        })
      }
      ,
      P.prototype.dispose = function () {
        this.__disposed = !0,
          this.trigger(T.Private.Dispose),
          this.tag.pause(),
          y.offAll(this),
          this._monitor && (this._monitor.removeEvent(),
            this._monitor = null),
          this._autoPlayDelay && this._autoPlayDelay.dispose(),
          this._checkTimeoutHandle && (clearTimeout(this._checkTimeoutHandle),
            this._checkTimeoutHandle = null),
          this._waitingTimeoutHandle && (clearTimeout(this._waitingTimeoutHandle),
            this._waitingTimeoutHandle = null),
          this._playingSlientPause && (clearTimeout(this._playingSlientPause),
            this._playingSlientPause = null),
          this._waitingLoadedHandle && (clearTimeout(this._waitingLoadedHandle),
            this._waitingLoadedHandle = null),
          this._readyStateTimer && (clearInterval(this._readyStateTimer),
            this._readyStateTimer = null),
          this._vodRetryCountHandle && (clearTimeout(this._vodRetryCountHandle),
            this._vodRetryCountHandle = null),
          this._waitingDelayLoadingShowHandle && (clearTimeout(this._waitingDelayLoadingShowHandle),
            this._waitingDelayLoadingShowHandle = null),
          this._disposeService(),
          this._clearLiveErrorHandle(),
          this._el.innerHTML = "",
          this.destroy(),
          this.tag = null,
          this._options.recreatePlayer = null,
          this._options = null
      }
      ,
      P.prototype.mute = function () {
        this._muteInner(),
          this._originalVolumn = this.tag.volume;
        var e = _.get("Volume_Mute");
        return this._player.trigger(T.Private.Info_Show, {
          text: e,
          duration: 1e3,
          align: "lb"
        }),
          this._setInnerVolume(0),
          this
      }
      ,
      P.prototype._muteInner = function () {
        this.tag.muted = !0,
          this.trigger(T.Private.VolumnChanged, -1)
      }
      ,
      P.prototype.unMute = function () {
        this._unMuteInner();
        var e = _.get("Volume_UnMute");
        return this._player.trigger(T.Private.Info_Show, {
          text: e,
          duration: 1e3,
          align: "lb"
        }),
          this._setInnerVolume(this._originalVolumn || .5),
          this
      }
      ,
      P.prototype._unMuteInner = function () {
        this.tag.muted = !1,
          this.trigger(T.Private.VolumnChanged, -2)
      }
      ,
      P.prototype.muted = function () {
        return this.tag.muted
      }
      ,
      P.prototype.getVolume = function () {
        return this.tag.volume
      }
      ,
      P.prototype.getOptions = function () {
        return this._options
      }
      ,
      P.prototype.setVolume = function (e, t) {
        0 != e ? this._unMuteInner() : 0 == e && this._muteInner(),
          this._setInnerVolume(e);
        var i = _.get("Curent_Volume") + "<span>" + (100 * e).toFixed() + "%</span>";
        this._player.trigger(T.Private.Info_Show, {
          text: i,
          duration: 1e3,
          align: "lb"
        })
      }
      ,
      P.prototype._setInnerVolume = function (e) {
        this.tag.volume = e,
          this.trigger(T.Private.VolumnChanged, e)
      }
      ,
      P.prototype.hideProgress = function () {
        this.trigger(T.Private.HideProgress)
      }
      ,
      P.prototype.cancelHideProgress = function () {
        this.trigger(T.Private.CancelHideProgress)
      }
      ,
      P.prototype.setPlayerSize = function (e, t) {
        this._el.style.width = e,
          this._el.style.height = t
      }
      ,
      P.prototype.getBuffered = function () {
        return this.tag.buffered
      }
      ,
      P.prototype.setRotate = function (e) {
        this.tag && (this._rotate = e,
          this._setTransform(),
          this.log("ROTATE", {
            rotation: e
          }))
      }
      ,
      P.prototype.getRotate = function (e) {
        return void 0 === this._rotate ? 0 : this._rotate
      }
      ,
      P.prototype.setImage = function (e) {
        this.tag && (this._image = e,
          this._setTransform(),
          this.log("IMAGE", {
            mirror: "horizon" == e ? 2 : 1,
            text: e
          }))
      }
      ,
      P.prototype.getImage = function () {
        return this._image
      }
      ,
      P.prototype.cancelImage = function () {
        this.tag && (this._image = "",
          this._setTransform(),
          this.log("IMAGE", {
            mirror: 0
          }))
      }
      ,
      P.prototype.setCover = function (e) {
        var t = document.querySelector("#" + this.id() + " .prism-cover");
        t && e && (t.style.backgroundImage = "url(" + e + ")",
          this._options.cover = e,
          this.trigger(T.Private.Cover_Show))
      }
      ,
      P.prototype._setTransform = function () {
        this._transformProp || (this._transformProp = o.getTransformName(this.tag));
        var e = " translate(-50%, -50%)";
        this._rotate && (e += " rotate(" + this._rotate + "deg)"),
          this._image && ("vertical" == this._image ? e += " scaleY(-1)" : "horizon" == this._image && (e += " scaleX(-1)")),
          this.tag.style[this._transformProp] = e
      }
      ,
      P.prototype._startPlay = function () {
        this.tag.paused && this.tag.play()
      }
      ,
      P.prototype._initPlayBehavior = function (e, t) {
        if (this._checkSupportVideoType())
          return !1;
        if (p.validateSource(t))
          return void 0 === e && (e = !1),
            this._created || (this._created = !0,
              this.trigger(T.Private.Created)),
            this.loaded || this.trigger(T.Player.Init),
            this._options.autoplay || this._options._autoplay || this._options.preload || e ? (this._options._preload = !0,
              this._initLoad(t),
              (this._options.autoplay || this._options._autoplay) && this._startPlay()) : this.trigger(T.Private.Play_Btn_Show),
            !0;
        var i = {
          mediaId: this._options.vid ? this._options.vid : "",
          error_code: c.ErrorCode.InvalidSourceURL,
          error_msg: "InvalidSourceURL"
        };
        return i.display_msg = _.get("Error_Invalidate_Source"),
          this.trigger(T.Player.Error, i),
          !1
      }
      ,
      P.prototype._isPreload = function () {
        return this._options.autoplay || this._options.preload || this._options._preload
      }
      ,
      P.prototype._initLoad = function (e) {
        this.getMetaData(),
          e && (this._isPreload() && !r.IS_MOBILE ? this.trigger(T.Private.H5_Loading_Show) : (this.trigger(T.Private.H5_Loading_Hide),
            this.trigger(T.Private.Play_Btn_Show)),
            this.tag.setAttribute("src", e),
            this.loaded = !0)
      }
      ,
      P.prototype._clearLiveErrorHandle = function () {
        this._liveErrorHandle && (clearTimeout(this._liveErrorHandle),
          this._liveErrorHandle = null)
      }
      ,
      P.prototype._reloadAndPlayForM3u8 = function () {
        0 == this._liveRetryCount && this.trigger(T.Player.OnM3u8Retry);
        var e = this._options
          , t = e.liveRetryInterval + e.liveRetryStep * this._liveRetryCount;
        d.sleep(1e3 * t),
          this._liveRetryCount++,
          this.tag.load(this._options.source),
          this.tag.play()
      }
      ,
      P.prototype._checkSupportVideoType = function () {
        if (!this.tag.canPlayType || !this._options.source || !r.IS_MOBILE)
          return "";
        var e = this._options.source
          , t = "";
        if (0 < e.indexOf("m3u8") ? "" != this.tag.canPlayType("application/x-mpegURL") || p.isSupportHls() || (t = _.get("Error_Not_Support_M3U8_Text")) : 0 < e.indexOf("mp4") ? "" == this.tag.canPlayType("video/mp4") && (t = _.get("Error_Not_Support_MP4_Text")) : (p.isRTMP(e) || p.isFlv(e)) && r.IS_MOBILE && (t = _.get("Error_Not_Support_Format_On_Mobile")),
          t) {
          var i = {
            mediaId: this._options.vid ? this._options.vid : "",
            error_code: c.ErrorCode.FormatNotSupport,
            error_msg: t
          };
          this.logError(i),
            i.display_msg = t,
            this.trigger(T.Player.Error, i)
        }
        return t
      }
      ,
      P.prototype.getComponent = function (e) {
        return this._lifeCycleManager.getComponent(e)
      }
      ,
      P.prototype.logError = function (e, t) {
        e || (e = {}),
          e.vt = this.getCurrentTime(),
          this._serverRequestId = this.log(t ? "ERRORRETRY" : "ERROR", e)
      }
      ,
      P.prototype.log = function (e, t) {
        var i = 0
          , r = 0;
        if (this._monitor)
          return this._options && (i = this._options.vid || "0",
            r = this._options.from || "0"),
            this._monitor.updateVideoInfo({
              video_id: i,
              album_id: 0,
              source: this._options.source,
              from: r
            }),
            this._monitor._log(e, t)
      }
      ,
      P.prototype.setSanpshotProperties = function (e, t, i) {
        if (this._snapshotMatric || (this._snapshotMatric = {}),
          this._snapshotMatric.width = e,
          this._snapshotMatric.height = t,
          1 < i)
          throw new Error("rate doesn't allow more than 1");
        this._snapshotMatric.rate = i
      }
      ,
      P.prototype.getStatus = function () {
        return this._status ? this._status : "init"
      }
      ,
      P.prototype.enterProgressMarker = function () {
        this._enteredProgressMarker = !0
      }
      ,
      P.prototype.isInProgressMarker = function () {
        return this._enteredProgressMarker
      }
      ,
      P.prototype.exitProgressMarker = function () {
        this._enteredProgressMarker = !1
      }
      ,
      P.prototype.setProgressMarkers = function (e) {
        e || (e = []),
          this.trigger(T.Private.ProgressMarkerChanged, e)
      }
      ,
      P.prototype.getProgressMarkers = function () {
        return this._progressMarkerService ? this._progressMarkerService.progressMarkers : []
      }
      ,
      P.prototype.setPreviewTime = function (e) {
        this._options.playConfig || (this._options.playConfig = {}),
          this._options.playConfig.PreviewTime = e
      }
      ,
      P.prototype.getPreviewTime = function () {
        var e = 0;
        return this._options.playConfig && (e = this._options.playConfig.PreviewTime),
          e
      }
      ,
      P.prototype.exceedPreviewTime = function (e) {
        return this.isPreview() && e >= this._options.playConfig.PreviewTime
      }
      ,
      P.prototype.isPreview = function () {
        var e = this._options.playConfig.PreviewTime
          , t = this._vodDuration || this.tag.duration;
        return 0 < e && e < t
      }
      ,
      P.prototype._getSanpshotMatric = function () {
        return this._snapshotMatric || (this._snapshotMatric = {}),
          this._snapshotMatric
      }
      ,
      P.prototype._overrideNativePlay = function () {
        var r = this.tag.play
          , o = this;
        this.tag.play = function () {
          if (console.log("do play"),
            !o._options.source) {
            var e = {
              mediaId: o._options.vid ? o._options.vid : "",
              error_code: c.ErrorCode.InvalidSourceURL,
              error_msg: "InvalidSourceURL"
            };
            return o._options.vid ? e.display_msg = _.get("Error_Vid_Empty_Source") : e.display_msg = _.get("Error_Empty_Source"),
              void o.trigger(T.Player.Error, e)
          }
          o.readyTime = (new Date).getTime();
          var t = r.apply(o.tag);
          void 0 !== t && t.then(function () {
            o.trigger(T.Player.AutoPlay, !0),
              console.log("do play successfully")
          })["catch"](function (e) {
            console.log("do play failed"),
              !o.tag || !o.tag.paused || o._isError || o._options._autoplay || o._switchedLevel || (o.trigger(T.Private.Play_Btn_Show),
                o.trigger(T.Private.H5_Loading_Hide),
                o.trigger(T.Player.AutoPlayPrevented),
                o.trigger(T.Player.AutoPlay, !1),
                o._options.cover && o.trigger(T.Private.Cover_Show))
          });
          var i = o._originalPlaybackRate || o.tag.playbackRate;
          setTimeout(function () {
            o.tag && (o.tag.playbackRate = i)
          })
        }
      }
      ,
      P.prototype._extraMultiSources = function () {
        var e = this._options.source;
        if (e && -1 < e.indexOf("{") && -1 < e.indexOf("}")) {
          var t = "";
          try {
            t = JSON.parse(e)
          } catch (e) {
            console.error(e),
              console.error("\u5730\u5740json\u4e32\u683c\u5f0f\u4e0d\u5bf9")
          }
          var i = [];
          for (var r in t) {
            var o = c.QualityLevels[r];
            i.push({
              definition: r,
              Url: t[r],
              desc: o || r
            })
          }
          if (0 < i.length) {
            this._currentPlayIndex = p.findSelectedStreamLevel(i);
            var n = i[this._currentPlayIndex];
            this._urls = i,
              this._options.source = n.Url,
              this.trigger(T.Private.SourceLoaded, n)
          }
        }
      }
      ,
      P.prototype._isEnabledAILabel = function () {
        return this._options.ai && this._options.ai.label
      }
      ,
      P.prototype._createService = function () {
        if (x)
          for (var e = x.length, t = 0; t < e; t++) {
            var i = x[t]
              , r = i.condition;
            void 0 === r ? r = !0 : "function" == typeof r && (r = r.call(this)),
              r && (this[i.name] = new i.service(this))
          }
      }
      ,
      P.prototype._disposeService = function () {
        if (x)
          for (var e = x.length, t = 0; t < e; t++) {
            var i = this[x[t].name];
            void 0 !== i && i.dispose && i.dispose()
          }
      }
      ,
      P.prototype._executeReadyCallback = function () {
        try {
          this._options.autoplay || this._options.preload || (this.trigger(T.Private.H5_Loading_Hide),
            this.trigger(T.Private.Play_Btn_Show)),
            this._options.readyCallback(this)
        } catch (e) {
          console.log(e)
        }
      }
      ,
      P.prototype._clearTimeout = function () {
        this._checkTimeoutHandle && (clearTimeout(this._checkTimeoutHandle),
          this._checkTimeoutHandle = null),
          this._waitingTimeoutHandle && (clearTimeout(this._waitingTimeoutHandle),
            this._waitingTimeoutHandle = null),
          this._clearLiveErrorHandle()
      }
      ,
      P.prototype._reloadForVod = function () {
        if (this._originalSource || (this._originalSource = this._options.source),
          this._vodRetryCount < this._options.vodRetry && navigator.onLine) {
          var e = this.getCurrentTime()
            , t = this._originalSource;
          t.indexOf("auth_key=") < 0 && (t = t && 0 < t.indexOf("?") ? t + "&_t=" + (new Date).valueOf() : t + "?_t=" + (new Date).valueOf()),
            this._vodRetryCountHandle && clearTimeout(this._vodRetryCountHandle);
          var i = this;
          return console.log("_reloadForVod"),
            this._vodRetryCountHandle = setTimeout(function () {
              console.log("reload vod because failed"),
                i._loadByUrlInner(t, e, !0)
            }, 100 * this._vodRetryCount),
            this._vodRetryCount = this._vodRetryCount + 1,
            !0
        }
        return !1
      }
      ,
      t.exports = P
  }
    , {
    "../../commonui/autostreamselector": 2,
    "../../config": 5,
    "../../feature/autoPlayDelay": 7,
    "../../lang/index": 11,
    "../../lib/constants": 15,
    "../../lib/cookie": 16,
    "../../lib/dom": 18,
    "../../lib/event": 19,
    "../../lib/io": 24,
    "../../lib/object": 26,
    "../../lib/playerutil": 29,
    "../../lib/ua": 31,
    "../../lib/util": 33,
    "../../monitor/monitor": 38,
    "../../ui/component": 94,
    "../../ui/component/cover": 98,
    "../../ui/component/play-animation": 104,
    "../../ui/component/progressmarker": 107,
    "../../ui/exports": 124,
    "../service/export": 87,
    "./event/eventmanager": 42,
    "./event/eventtype": 43,
    "./plugin/lifecyclemanager": 65,
    "./x5play": 67
  }],
  63: [function (e, t, i) {
    var r = e("../../../lib/oo").extend({});
    t.exports = r
  }
    , {
    "../../../lib/oo": 27
  }],
  64: [function (e, t, i) {
    t.exports = {
      createEl: "createEl",
      created: "created",
      ready: "ready",
      loading: "loading",
      play: "play",
      pause: "pause",
      playing: "playing",
      waiting: "waiting",
      timeUpdate: "timeupdate",
      error: "error",
      ended: "ended",
      dispose: "dispose",
      markerDotOver: "markerDotOver",
      markerDotOut: "markerDotOut"
    }
  }
    , {}],
  65: [function (e, t, i) {
    var s = e("../../../lib/object")
      , u = e("../event/eventtype")
      , c = e("./lifecycle")
      , r = e("./status")
      , o = function (t) {
        (this._player = t)._status = "init",
          this.components = [];
        var e = t.getOptions().components;
        if (e && s.isArray(e) && 0 < e.length)
          for (var i = 0; i < e.length; i++) {
            var r = e[i];
            if (!r)
              return void console.log("The " + i + " custome component is " + r);
            if (constr = void 0 === r.type ? r : r.type,
              args = void 0 === r.args ? [] : r.args,
              name = void 0 === r.name ? "" : r.name,
              !constr)
              return void console.log(name + " compenent is " + constr);
            args && 0 < args.length ? args = [].concat.call([constr], args) : args = [];
            var o = new (Function.prototype.bind.apply(constr, args))
              , n = o[c.createEl];
            n && "function" == typeof n && n.call(o, t.el(), t),
              this.components.push({
                name: name,
                obj: o
              })
          }
        var a = this;
        t.on(u.Private.LifeCycleChanged, function (e) {
          0 != a.components.length && l.call(a, t, e)
        })
      };
    o.prototype.getComponent = function (e) {
      var t = null
        , i = this.components.length;
      if (e)
        for (var r = 0; r < i; r++)
          if (this.components[r].name == e) {
            t = this.components[r].obj;
            break
          }
      return t
    }
      ;
    var l = function (e, t) {
      if (t) {
        var i = t.paramData
          , r = i.type
          , o = i.data;
        (function (e) {
          return e == u.Video.LoadStart || e == u.Video.LoadedData || e == u.Video.LoadedMetadata
        }
        )(r) && (r = c.loading),
          d(e, r);
        for (var n = this.components.length, a = 0; a < n; a++) {
          var s = this.components[a].obj
            , l = s[r];
          l && "function" == typeof l && l.call(s, e, o)
        }
        r == u.Private.Dispose && (this.components = [])
      }
    }
      , d = function (e, t) {
        void 0 !== r[t] && (t != r.pause || e._status != r.error && e._status != r.ended) && (e._status = t)
      };
    t.exports = o
  }
    , {
    "../../../lib/object": 26,
    "../event/eventtype": 43,
    "./lifecycle": 64,
    "./status": 66
  }],
  66: [function (e, t, i) {
    t.exports = {
      init: "init",
      ready: "ready",
      loading: "loading",
      play: "play",
      pause: "pause",
      playing: "playing",
      waiting: "waiting",
      error: "error",
      ended: "ended"
    }
  }
    , {}],
  67: [function (e, t, i) {
    var r = e("../../lib/ua")
      , o = e("../../lib/dom")
      , n = function (e, t) {
        var i = e.el().style.height
          , r = e.el().style.width;
        e.originalLayout = {
          container: {
            height: i,
            width: r
          },
          video: {
            width: e.tag.style.width,
            height: e.tag.style.height
          }
        };
        var o = document.body.clientHeight * (window.devicePixelRatio || 1) + "px"
          , n = document.body.clientWidth + "px";
        t ? (height = o,
          width = n) : (height = i.indexOf("%") ? i : i + "px",
            width = r.indexOf("%") ? r : r + "px"),
          e.tag.style.width = n,
          e.tag.style.height = o,
          e.el().style.height = t ? o : height
      };
    t.exports.isAndroidX5 = function () {
      return r.os.android && r.is_X5 || r.dingTalk()
    }
      ,
      t.exports.adaptX5Play = function (e) {
        r.os.android && r.is_X5 && ("h5" == e._options.x5_type && (e.tag.setAttribute("x5-video-player-type", e._options.x5_type),
          window.onresize = function () {
            n(e, e._options.x5_fullscreen || "center" == e._options.x5_video_position),
              function (e) {
                if ("landscape" == e._x5VideoOrientation) {
                  e._originalTagWidth = e.tag.style.width,
                    e._originalTagHeight = e.tag.style.height;
                  var t = document.querySelector("#" + e.id() + " .prism-controlbar");
                  t && parseFloat(t.offsetHeight),
                    e.tag.style.height = "100%",
                    e.tag.style.width = window.screen.width + "px"
                }
              }(e)
          }
          ,
          e.tag.addEventListener("x5videoenterfullscreen", function () {
            n(e, e._options.x5_fullscreen || "center" == e._options.x5_video_position),
              e.trigger("x5requestFullScreen")
          }),
          e.tag.addEventListener("x5videoexitfullscreen", function () {
            !function (e, t) {
              if (e.originalLayout) {
                var i = e.originalLayout;
                e.el().style.height = i.container.height,
                  e.el().style.width = i.container.width,
                  e.tag.style.width = i.video.width,
                  e.tag.style.height = i.video.height
              }
            }(e),
              e.trigger("x5cancelFullScreen"),
              e.fullscreenService.getIsFullScreen() && e.fullscreenService.cancelFullScreen()
          }),
          e.on("requestFullScreen", function () {
            "top" == e._options.x5_video_position && o.removeClass(e.tag, "x5-top-left"),
              r.os.android && r.is_X5 && e._options.x5LandscapeAsFullScreen && (e.tag.setAttribute("x5-video-orientation", "landscape"),
                e._x5VideoOrientation = "landscape")
          }),
          e.on("cancelFullScreen", function () {
            "top" == e._options.x5_video_position && o.addClass(e.tag, "x5-top-left"),
              r.os.android && r.is_X5 && e._options.x5LandscapeAsFullScreen && (e.tag.setAttribute("x5-video-orientation", "portrait"),
                n(e, e._options.x5_fullscreen || "center" == e._options.x5_video_position),
                e._x5VideoOrientation = "portrait")
          })),
          void 0 !== e._options.x5_fullscreen && e._options.x5_fullscreen && (e.tag.setAttribute("x5-video-player-fullscreen", e._options.x5_fullscreen),
            o.addClass(e.tag, "x5-full-screen")),
          "top" == e._options.x5_video_position && o.addClass(e.tag, "x5-top-left"),
          void 0 !== e._options.x5_orientation && e.tag.setAttribute("x5-video-orientation", e._options.x5_orientation))
      }
  }
    , {
    "../../lib/dom": 18,
    "../../lib/ua": 31
  }],
  68: [function (e, t, i) {
    var c = e("../../lib/io")
      , d = e("../../config")
      , p = e("../../lib/constants")
      , h = e("../../lib/util")
      , f = e("../../lib/playerutil")
      , _ = (e("../../lib/dom"),
        e("../../lang/index"))
      , g = e("../base/event/eventtype")
      , y = e("../saas/drm");
    t.exports.inject = function (e, t, i, r, a, o, n) {
      var s = r.source;
      if (o || function (e, t) {
        return !(e._drm || !f.isDash(t))
      }(e, s)) {
        t.prototype._checkDrmReady = function () {
          if (null == e._drm)
            throw new Error("please invoke this method after ready event")
        }
          ,
          e._isDrm = !0,
          e._drm = null,
          e._isLoadedDrm = !1,
          t.prototype.play = function (e) {
            this._checkDrmReady(),
              this._isManualPlay = e || !1;
            if (this.trigger(g.Private.Cover_Hide),
              this.tag.ended)
              this.replay();
            else {
              this.getCurrentTime();
              this.tag.paused && this.tag.play()
            }
            return this
          }
          ,
          t.prototype.replay = function () {
            if (this.tag.paused) {
              this._monitor && this._monitor.replay();
              var e = this;
              this._drm.load(this._options.source).then(function () {
                e._options._autoplay = !0,
                  e._initPlayBehavior(!0),
                  console.log("The video has now been loaded!")
              })["catch"](u)
            }
            return this
          }
          ,
          t.prototype.pause = function (e) {
            return this._checkDrmReady(),
              this._isManualPause = e || !1,
              this.tag.pause(),
              this
          }
          ,
          t.prototype.stop = function () {
            return this._checkDrmReady(),
              this.tag.setAttribute("src", null),
              this
          }
          ,
          t.prototype.initPlay = function (e) {
            if (h.contentProtocolMixed(s)) {
              var t = {
                mediaId: this._options.vid ? this._options.vid : "",
                error_code: p.ErrorCode.InvalidSourceURL,
                error_msg: "InvalidSourceURL"
              };
              return t.display_msg = _.get("Request_Block_Text"),
                void this.trigger(g.Player.Error, t)
            }
            function i(i, t) {
              var r = !i._drm
                , o = function () {
                  l(i, i._drm);
                  var e = {
                    drm: {
                      requestLicenseKey: y.requestLicenseKey(i),
                      servers: {}
                    }
                  };
                  p.DRMKeySystem[4] && (e.drm.servers[p.DRMKeySystem[5]] = "https://foo.bar/drm/widevine",
                    e.drm.servers[p.DRMKeySystem[4]] = "https://foo.bar/drm/playready"),
                    i._drm.configure(e),
                    a && a(i._drm),
                    r && i._executeReadyCallback(),
                    i._drm.load(i._options.source).then(function () {
                      i._initPlayBehavior(t),
                        console.log("The video has now been loaded!")
                    })["catch"](function (e) {
                      u(i, e)
                    })
                }
                , n = function (e) {
                  if (!e || i.__support && i.__support.drm[e])
                    o();
                  else {
                    var t = {
                      mediaId: i._options.vid ? i._options.vid : "",
                      error_code: p.ErrorCode.EncrptyVideoNotSupport,
                      error_msg: _.get("Not_Support_DRM")
                    };
                    i.trigger(g.Player.Error, t)
                  }
                };
              i.destroy(function (t) {
                try {
                  t._drm = new shaka.Player(t.tag);
                  var e = t._getItemBySource();
                  if (e) {
                    var i = p.DRMKeySystem[e.encryptionType];
                    t.__support ? n(i) : shaka.Player.probeSupport().then(function (e) {
                      t.__support = e,
                        n(i)
                    })
                  } else
                    o()
                } catch (e) {
                  console.log(e)
                }
              })
            }
            (that = this)._isLoadedDrm && "undefined" != typeof shaka ? i(this, e) : (this.trigger(g.Private.H5_Loading_Show),
              function (e) {
                var t = "aliplayer-drm-min.js"
                  , i = "https://" + d.domain + "/de/prismplayer/" + d.h5Version + "/drm/" + t;
                d.domain ? -1 < d.domain.indexOf("g-assets.daily") ? i = "http://" + d.domain + "/de/prismplayer/" + d.h5Version + "/drm/" + t : -1 < d.domain.indexOf("localhost") && (i = "http://" + d.domain + "/build/drm/" + t) : i = "de/prismplayer/" + d.h5Version + "/drm/" + t;
                var r = this;
                c.loadJS(i, function () {
                  shaka.polyfill.installAll(),
                    e.apply(r)
                })
              }
                .call(that, function () {
                  this._isLoadedDrm = !0,
                    i(this, e)
                }))
          }
          ,
          t.prototype.destroy = function (e) {
            if (this._drm) {
              var t = this;
              this._drm.destroy().then(function () {
                t._drm = null,
                  e(t)
              })
            } else
              e(this)
          }
          ,
          t.prototype.dispose = function () {
            i.dispose.call(this),
              this.destroy()
          }
          ,
          t.prototype._getDRMEncryptItem = function () {
            var e = this._urls;
            if (e && 0 < e.length) {
              for (var t = e.length, i = 0; i < t; i++) {
                var r = e[i];
                if (r.Url == this._options.source && 1 * r.encryption)
                  return r
              }
              return ""
            }
            return ""
          }
          ,
          t.prototype._getItemBySource = function () {
            var e = this._urls;
            if (e && 0 < e.length) {
              for (var t = e.length, i = 0; i < t; i++) {
                var r = e[i];
                if (r.Url == this._options.source)
                  return r
              }
              return ""
            }
            return ""
          }
          ;
        var l = function (t, e) {
          e.addEventListener("error", function (e) {
            !function (e, t) {
              u(e, t.detail)
            }(t, e)
          })
        }
      }
      function u(t, i) {
        var r = "Error code:" + i.code + "message:" + i.message;
        console.log(r);
        var o = p.ErrorCode.OtherError;
        r = _.get("Error_Play_Text");
        i.code == shaka.util.Error.Code.EXPIRED ? (o = p.ErrorCode.AuthKeyExpired,
          r = _.get("DRM_License_Expired")) : i.code == shaka.util.Error.Code.HTTP_ERROR ? (o = p.ErrorCode.NetworkError,
            r = _.get("Http_Error")) : i.code == shaka.util.Error.Code.HTTP_ERROR ? (o = p.ErrorCode.LoadingTimeout,
              r = _.get("Http_Timeout")) : i.category == shaka.util.Error.NETWORK && (o = p.ErrorCode.NetworkError,
                r = _.get("Error_Network_Text"));
        !function () {
          if (setTimeout(function () {
            t.trigger(g.Private.Play_Btn_Hide)
          }),
            t.checkOnline()) {
            var e = {
              mediaId: t._options.vid ? t._options.vid : "",
              error_code: o,
              error_msg: i.message
            };
            t.logError(e),
              e.display_msg = i.code + "|" + r,
              t.trigger(g.Player.Error, e)
          }
        }()
      }
    }
  }
    , {
    "../../config": 5,
    "../../lang/index": 11,
    "../../lib/constants": 15,
    "../../lib/dom": 18,
    "../../lib/io": 24,
    "../../lib/playerutil": 29,
    "../../lib/util": 33,
    "../base/event/eventtype": 43,
    "../saas/drm": 76
  }],
  69: [function (e, t, i) {
    var r = e("../base/player")
      , o = e("./drminjector")
      , n = r.extend({
        init: function (e, t) {
          o.inject(this, n, r.prototype, t, function (e) { }),
            t._native = !1,
            r.call(this, e, t)
        }
      });
    t.exports = n
  }
    , {
    "../base/player": 62,
    "./drminjector": 68
  }],
  70: [function (e, t, i) {
    var o = e("../../ui/component")
      , n = e("../../lib/data")
      , s = e("../../lib/ua")
      , a = e("../../lib/constants")
      , l = e("../../lib/dom")
      , u = e("../../lib/object")
      , c = e("../../config")
      , d = e("../../lang/index")
      , p = e("../../lib/playerutil")
      , h = e("../../lib/util")
      , r = e("../../ui/component/info-display")
      , f = e("../../ui/component/error-display")
      , _ = e("../../feature/autoPlayDelay")
      , g = e("../../commonui/autostreamselector")
      , y = e("../base/event/eventtype")
      , v = e("../saas/ststoken")
      , m = o.extend({
        init: function (e, t) {
          if (void 0 === t.skinLayout && (t.skinLayout = p.defaultFlashLayout),
            o.call(this, this, t),
            this._id = "prism-player-" + n.guid(),
            this.tag = e,
            this._el = this.tag,
            this._childrenUI = [f],
            this.initChildren(),
            this.id = this._id,
            window[this.id] = this,
            d.setCurrentLanguage(this._options.language, "flash", this._options.languageTexts),
            h.openInFile()) {
            var i = {
              mediaId: this._options.vid ? this._options.vid : "",
              error_code: a.ErrorCode.FormatNotSupport,
              error_msg: d.get("Open_Html_By_File", "flash")
            };
            this.trigger(y.Private.Error_Show, i)
          } else if (s.IS_MOBILE)
            this.trigger(y.Private.Error_Show, {
              mediaId: this._options.vid ? this._options.vid : "",
              error_code: a.ErrorCode.FormatNotSupport,
              error_msg: d.get("Cant_Use_Flash_On_Mobile", "flash")
            });
          else {
            if (this._options.vid && this._options.accessKeyId && this._options.securityToken && this._options.accessKeySecret) {
              var r = this;
              v.getPlayAuth(this._options, function (e) {
                r._options.playauth = e,
                  r._createPlayer()
              }, function (e) {
                var t = {
                  mediaId: r._options.vid,
                  error_code: e.Code,
                  error_msg: e.Message
                };
                e.sri && (t.sri = e.sri),
                  t.display_msg = e.display_msg,
                  r.trigger(y.Private.Error_Show, t)
              }, "flash")
            } else
              this._createPlayer();
            this._status = "init"
          }
        },
        _createPlayer: function () {
          if (this._options.autoPlayDelay) {
            var e = new _(this)
              , t = this;
            e.handle(function () {
              t._options.autoplay = !0,
                t._initPlayer(),
                t._childrenUI = [r, g],
                t.initChildren()
            })
          } else
            this._initPlayer(),
              this._childrenUI = [r, g],
              this.initChildren();
          if (!s.HAS_FLASH) {
            var i = d.get("Flash_Not_Ready", "flash");
            this.trigger(y.Private.Info_Show, {
              text: i,
              align: "tc",
              isBlack: !1
            })
          }
        },
        _initPlayer: function () {
          var e = "//" + c.domain + "/de/prismplayer-flash/" + c.flashVersion + "/PrismPlayer.swf";
          this._options.playerSwfPath ? e = this._options.playerSwfPath : c.domain ? -1 < c.domain.indexOf("localhost") && (e = "//" + c.domain + "/build/flash//PrismPlayer.swf") : e = "de/prismplayer-flash/" + c.flashVersion + "/PrismPlayer.swf";
          var t = this._comboFlashVars()
            , i = this._options.wmode ? this._options.wmode : "opaque";
          this.tag.innerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=5,0,0,0" width="100%" height="100%" id="' + this.id + '"><param name=movie value="' + e + '"><param name=quality value=High><param name="FlashVars" value="' + t + '"><param name="WMode" value="' + i + '"><param name="AllowScriptAccess" value="always"><param name="AllowFullScreen" value="true"><param name="AllowFullScreenInteractive" value="true"><embed name="' + this.id + '" src="' + e + '" quality=high pluginspage="//www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash" type="application/x-shockwave-flash" width="100%" height="100%" AllowScriptAccess="always" AllowFullScreen="true" AllowFullScreenInteractive="true" WMode="' + i + '" FlashVars="' + t + '"></embed></object>'
        },
        _getPlayer: function (e) {
          return -1 != navigator.appName.indexOf("Microsoft") ? document.getElementById(e) : document[e]
        },
        _getLowerQualityLevel: function () {
          var e = this._getVideoUrls();
          if (!e)
            return "";
          var t = e.Urls
            , i = e.index;
          return t && 0 == t.length || -1 == i ? "" : 0 < i ? {
            item: t[i - 1],
            index: i - 1
          } : ""
        },
        _comboFlashVars: function () {
          var e = encodeURIComponent(s.getReferer())
            , t = s.getHref()
            , i = encodeURIComponent(t)
            , r = "";
          t && (r = s.getHost(t));
          var o = this._options
            , n = {
              autoPlay: o.autoplay ? 1 : 0,
              isInner: 0,
              actRequest: 1,
              vid: o.vid,
              diagnosisButtonVisible: o.diagnosisButtonVisible ? 1 : 0,
              domain: o.domain ? o.domain : "//tv.taobao.com",
              statisticService: o.statisticService ? o.statisticService : c.logReportTo,
              videoInfoService: o.videoInfoService ? o.videoInfoService : "/player/json/getBaseVideoInfo.do",
              disablePing: o.trackLog ? 0 : 1,
              namespace: this.id,
              barMode: 0 != o.barMode ? 1 : 0,
              isLive: o.isLive ? 1 : 0,
              waterMark: o.waterMark,
              environment: o.environment,
              vurl: o.source ? encodeURIComponent(o.source) : "",
              plugins: o.plugins ? o.plugins : "",
              snapShotShow: o.snapshot ? 1 : 0,
              accessId: o.accId ? o.accId : "",
              accessKey: o.accSecret ? o.accSecret : "",
              apiKey: o.apiKey ? o.apiKey : "",
              flashApiKey: o.flashApiKey ? o.flashApiKey : "",
              disableSeek: o.disableSeek ? 1 : 0,
              disableFullScreen: o.disableFullScreen ? 1 : 0,
              stsToken: o.stsToken ? o.stsToken : "",
              domainRegion: o.domainRegion ? o.domainRegion : "",
              authInfo: o.authInfo ? encodeURIComponent(o.authInfo) : "",
              playDomain: o.playDomain ? o.playDomain : "",
              stretcherZoomType: o.stretcherZoomType ? o.stretcherZoomType : "",
              playauth: o.playauth ? o.playauth.replace(/\+/g, "%2B") : "",
              prismType: o.prismType ? o.prismType : 0,
              formats: o.formats ? o.formats : "",
              notShowTips: o.notShowTips ? 1 : 0,
              showBarTime: o.showBarTime ? o.showBarTime : 0,
              showBuffer: 0 == o.showBuffer ? 0 : 1,
              rePlay: o.rePlay ? 1 : 0,
              encryp: o.encryp ? o.encryp : "",
              secret: o.secret ? o.secret : "",
              mediaType: "video",
              logInfo: {
                ud: s.getHost(o.source),
                os: s.os.name,
                ov: s.os.version || "",
                et: s.browser.name,
                ev: s.browser.version || "",
                uat: s.USER_AGENT,
                r: e,
                pu: i,
                app_n: r
              }
            }
            , a = [];
          return void 0 !== o.rtmpBufferTime && (n.rtmpBufferTime = o.rtmpBufferTime),
            o.cover && (n.cover = o.cover),
            o.extraInfo && (n.extraInfo = encodeURIComponent(JSON.stringify(o.extraInfo))),
            n.logInfo && (n.logInfo = encodeURIComponent(JSON.stringify(n.logInfo))),
            n.languageData = encodeURIComponent(JSON.stringify(d.getLanguageData("flash"))),
            n.language = d.getCurrentLanguage(),
            u.each(n, function (e, t) {
              a.push(e + "=" + t)
            }),
            a.join("&")
        },
        initChildren: function () {
          for (var e = this._childrenUI.length, t = 0; t < e; t++) {
            var i = new this._childrenUI[t](this, this._options)
              , r = i.el();
            r.id = i.id(),
              this.contentEl().appendChild(r),
              i.bindEvent()
          }
          var o = document.querySelector("#" + this._options.id + " .prism-info-display");
          l.css(o, "display", "none")
        },
        flashReady: function () {
          this.flashPlayer = this._getPlayer(this.id),
            this._isReady = !0;
          var e, t = this._options.skinRes, i = this._options.skinLayout;
          if (!1 !== i && !u.isArray(i))
            throw new Error("PrismPlayer Error: skinLayout should be false or type of array!");
          if ("string" != typeof t)
            throw new Error("PrismPlayer Error: skinRes should be string!");
          e = 0 != i && 0 !== i.length && {
            skinRes: t,
            skinLayout: i
          },
            this.flashPlayer.setPlayerSkin(e),
            this.trigger("ready");
          var r = this;
          window.addEventListener("beforeunload", function () {
            try {
              r.flashPlayer.setPlayerCloseStatus()
            } catch (e) { }
          })
        },
        jsReady: function () {
          return !0
        },
        snapshoted: function (e) {
          var t = h.toBinary(e)
            , i = "data:image/jpeg;base64," + e;
          this.trigger("snapshoted", {
            time: this.getCurrentTime(),
            base64: i,
            binary: t
          })
        },
        uiReady: function () {
          this._status = "ready",
            this.trigger("uiReady")
        },
        loadedmetadata: function () {
          "ended" != this._status && (this._status = "loading",
            this.trigger("loadedmetadata"))
        },
        onPlay: function () {
          this._status = "play",
            this.trigger("play"),
            this._clearTimeoutHandle(),
            this.trigger(y.Private.AutoStreamHide)
        },
        onEnded: function () {
          this._clearTimeoutHandle(),
            this._status = "ended",
            this.trigger("ended")
        },
        onPause: function () {
          this._status = "pause",
            this._clearTimeoutHandle(),
            this.trigger(y.Private.AutoStreamHide),
            this.trigger("pause")
        },
        onBulletScreenReady: function () {
          this.trigger("bSReady")
        },
        onBulletScreenMsgSend: function (e) {
          this.trigger("bSSendMsg", e)
        },
        onVideoRender: function (e) {
          this._clearTimeoutHandle(),
            this.trigger("videoRender"),
            this.trigger("canplay", {
              loadtime: e
            })
        },
        onVideoError: function (e) {
          this._clearTimeoutHandle(),
            this._status = "error",
            this.trigger("error", {
              errortype: e
            })
        },
        onM3u8Retry: function () {
          this.trigger("m3u8Retry")
        },
        hideBar: function () {
          this.trigger("hideBar")
        },
        showBar: function () {
          this.trigger("showBar")
        },
        liveStreamStop: function () {
          this.trigger("liveStreamStop")
        },
        stsTokenExpired: function () {
          this._status = "error",
            this.trigger("stsTokenExpired")
        },
        onVideoBuffer: function () {
          if ("pause" != this._status) {
            this._status = "waiting",
              this.trigger("waiting"),
              this._clearTimeoutHandle();
            var e = this;
            this._checkTimeoutHandle = setTimeout(function () {
              e.trigger(y.Private.AutoStreamShow)
            }, 1e3 * this._options.loadDataTimeout),
              this._checkVideoStatus()
          }
        },
        startSeek: function (e) {
          this.trigger("startSeek", e)
        },
        completeSeek: function (e) {
          this.trigger("completeSeek", e)
        },
        _invoke: function () {
          var e = arguments[0]
            , t = arguments;
          if (Array.prototype.shift.call(t),
            !this.flashPlayer)
            throw new Error("PrismPlayer Error: flash player is not ready\uff0cplease use api after ready event occured!");
          if ("function" != typeof this.flashPlayer[e])
            throw new Error("PrismPlayer Error: function " + e + " is not found!");
          return this.flashPlayer[e].apply(this.flashPlayer, t)
        },
        play: function () {
          this._invoke("playVideo")
        },
        replay: function () {
          this._invoke("replayVideo")
        },
        pause: function () {
          this._invoke("pauseVideo")
        },
        stop: function () {
          this._invoke("stopVideo")
        },
        seek: function (e) {
          this._invoke("seekVideo", e)
        },
        getCurrentTime: function () {
          return this._invoke("getCurrentTime")
        },
        getDuration: function () {
          return this._invoke("getDuration")
        },
        getStatus: function () {
          return this._status
        },
        _getVideoUrls: function () {
          var e = this._invoke("getVideoUrls")
            , t = [];
          if (e && e.Urls)
            for (var i = 0; i < e.Urls.length; i++) {
              var r = e.Urls[i].value
                , o = r.desc.indexOf("_")
                , n = d.get(r.definition, "flash");
              r.desc = 0 < o ? n + "_" + r.height : n,
                t.push(r)
            }
          return {
            Urls: t,
            index: e.index
          }
        },
        _getVideoStatus: function () {
          return this._invoke("getVideoStatus")
        },
        _checkVideoStatus: function () {
          if (this.flashPlayer && !this._checkVideoStatusHandler) {
            var t = this
              , i = function () {
                t._checkVideoStatusHandler = setTimeout(function () {
                  var e = t._getVideoStatus();
                  "playing" == e.videoStatus && "bufferFull" == e.bufferStatus ? (t._status = "playing",
                    t._clearTimeoutHandle()) : "videoPlayOver" == e.videoStatus && (t._status = "ended",
                      t._clearTimeoutHandle()),
                    i()
                }, 500)
              };
            i()
          }
        },
        _clearTimeoutHandle: function () {
          this._checkTimeoutHandle && (clearTimeout(this._checkTimeoutHandle),
            this._checkTimeoutHandle = null)
        },
        _changeStream: function (e) {
          return this._invoke("changeStream", e)
        },
        mute: function () {
          this.setVolume(0)
        },
        unMute: function () {
          this.setVolume(.5)
        },
        getVolume: function () {
          return this._invoke("getVolume")
        },
        setVolume: function (e) {
          this._invoke("setVolume", e)
        },
        loadByVid: function (e) {
          this._invoke("loadByVid", e, !1)
        },
        loadByUrl: function (e, t) {
          this._invoke("loadByUrl", e, t)
        },
        dispose: function () {
          this._clearTimeoutHandle(),
            this._checkVideoStatusHandler && (clearTimeout(this._checkVideoStatusHandler),
              this._checkVideoStatusHandler = null),
            this._invoke("pauseVideo");
          var e = this;
          setTimeout(function () {
            e.off("completeSeek"),
              e.off("startSeek"),
              e.off("stsTokenExpired"),
              e.off("liveStreamStop"),
              e.off("showBar"),
              e.off("hideBar"),
              e.off("m3u8Retry"),
              e.off("error"),
              e.off("canplay"),
              e.off("pause"),
              e.off("ended"),
              e.off("play"),
              e.off("loadedmetadata"),
              e.off("snapshoted"),
              e.off("uiReady"),
              e.off("ready"),
              e.flashPlayer = null,
              e._el && (e._el.innerHTML = "")
          })
        },
        showBSMsg: function (e) {
          this._invoke("showBSMsg", e)
        },
        setToastEnabled: function (e) {
          this._invoke("setToastEnabled", e)
        },
        setLoadingInvisible: function () {
          this._invoke("setLoadingInvisible")
        },
        setPlayerSize: function (e, t) {
          this._el.style.width = e,
            this._el.style.height = t
        }
      });
    t.exports = m
  }
    , {
    "../../commonui/autostreamselector": 2,
    "../../config": 5,
    "../../feature/autoPlayDelay": 7,
    "../../lang/index": 11,
    "../../lib/constants": 15,
    "../../lib/data": 17,
    "../../lib/dom": 18,
    "../../lib/object": 26,
    "../../lib/playerutil": 29,
    "../../lib/ua": 31,
    "../../lib/util": 33,
    "../../ui/component": 94,
    "../../ui/component/error-display": 99,
    "../../ui/component/info-display": 102,
    "../base/event/eventtype": 43,
    "../saas/ststoken": 81
  }],
  71: [function (e, t, i) {
    var a = e("../../lib/io")
      , d = e("../../config")
      , p = e("../../lib/constants")
      , h = e("../../lib/util")
      , u = e("../../lib/playerutil")
      , c = (e("../../lib/dom"),
        e("../../lib/ua"))
      , f = e("../../lang/index")
      , _ = e("../base/event/eventtype");
    e("../base/player");
    t.exports.inject = function (e, t, i, r, s, o) {
      var n = r.source;
      if (o || function (e, t) {
        return !(e._flv || !u.isFlv(t))
      }(e, n)) {
        e._Type = t,
          e._superType = i,
          e._superPt = i.prototype,
          e._disposed = !1,
          t.prototype._checkFlvReady = function () {
            if (null == e._flv)
              throw new Error("please invoke this method after ready event")
          }
          ,
          e._isFlv = !0,
          e._flv = null,
          e._isLoadedFlv = !1,
          e._originalUrl = "",
          t.prototype.play = function (e) {
            this._checkFlvReady(),
              this._isManualPlay = e || !1;
            if (this.trigger(_.Private.Cover_Hide),
              this._options.isLive && e)
              this._loadByUrlInner(this._options.source, 0, liveForceLoad);
            else if (this.tag.ended || this._ended)
              this.replay();
            else {
              if (0 == this._seeking) {
                var t = 0;
                this.tag.ended || this._ended || 0 == (t = this.getCurrentTime()) && (t = -1),
                  -1 != t && this.seek(t)
              }
              this.tag.paused && (this._hasLoaded || (this.getMetaData(),
                this._flv.load()),
                this._flv.play())
            }
            return this
          }
          ,
          t.prototype.seek = function (e) {
            this._checkFlvReady(),
              e === this.tag.duration && e--;
            try {
              this._flv.currentTime = e
            } catch (e) {
              console.log(e)
            }
            return this
          }
          ,
          t.prototype.pause = function (e) {
            return this._checkFlvReady(),
              this._isManualPause = e || !1,
              this._flv.pause(),
              this
          }
          ,
          t.prototype.getProgramDateTime = function () {
            if (this._checkFlvReady(),
              !this._metadata)
              return "";
            var e = this._flv.getFirstSample()
              , t = e && e.pts ? e.pts : 0;
            return console.log("\u63a8\u6d41\u65f6\u95f4\uff1a" + this._metadata.NtpTime),
              console.log("\u9996\u5e27PTS\uff1a" + t),
              this._metadata.NtpTime + t
          }
          ,
          t.prototype.initPlay = function (e) {
            if (c.browser.safari && this.trigger(_.Private.Snapshot_Hide),
              h.contentProtocolMixed(n)) {
              var t = {
                mediaId: this._options.vid ? this._options.vid : "",
                error_code: p.ErrorCode.InvalidSourceURL,
                error_msg: "InvalidSourceURL"
              };
              return t.display_msg = f.get("Request_Block_Text"),
                void this.trigger(_.Player.Error, t)
            }
            function i(t, e) {
              var i = !t._flv;
              t._destroyFlv();
              var r = t._options.isLive
                , o = {
                  isLive: r,
                  enableWorker: t._options.enableWorker,
                  stashInitialSize: 2048
                }
                , n = {
                  type: "flv",
                  isLive: r,
                  url: t._options.source
                };
              for (var a in r ? (o.enableStashBuffer = t._options.enableStashBufferForFlv,
                stashInitialSize = t._options.stashInitialSizeForFlv,
                o.autoCleanupSourceBuffer = !1) : o.lazyLoadMaxDuration = 600,
                t._options.flvOption)
                "cors" == a || "hasAudio" == a || "withCredentials" == a || "hasVideo" == a || "type" == a ? n[a] = t._options.flvOption[a] : o[a] = t._options.flvOption[a];
              t._originalUrl = t._options.source,
                flvjs.LoggingControl.enableAll = t._options.debug,
                t._flv = flvjs.createPlayer(n, o),
                l(t, t._flv),
                t._flv.on(flvjs.Events.MEDIA_INFO, function (e) {
                  t._metadata = e.metadata
                }),
                t._flv.attachMediaElement(t.tag),
                t._initPlayBehavior(e) && ((t._options.preload || t._options.autoplay) && (t._hasLoaded = !0,
                  t._flv.load()),
                  t._options.autoplay && !t.tag.paused && t._flv.play(),
                  s && s(t._flv),
                  i && t._executeReadyCallback())
            }
            (that = this)._isLoadedFlv && "undefined" != typeof Hls ? setTimeout(function () {
              i(that, e)
            }, 1e3) : (this.trigger(_.Private.H5_Loading_Show),
              function (e, t) {
                var i = "aliplayer-flv-min.js"
                  , r = "https://" + d.domain + "/de/prismplayer/" + d.h5Version + "/flv/" + i;
                d.domain ? -1 < d.domain.indexOf("g-assets.daily") ? r = "http://" + d.domain + "/de/prismplayer/" + d.h5Version + "/flv/" + i : -1 < d.domain.indexOf("localhost") && (r = "http://" + d.domain + "/build/flv/" + i) : r = "de/prismplayer/" + d.h5Version + "/flv/" + i;
                var o = this;
                a.loadJS(r, function () {
                  e.apply(o)
                })
              }
                .call(that, function () {
                  this._isLoadedFlv = !0,
                    i(that, e)
                }, this._options.debug))
          }
          ,
          t.prototype._destroyFlv = function () {
            try {
              this._flv && (this._flv.pause(),
                this._flv.destroy())
            } catch (e) {
              console.log(e)
            }
            this.loaded = !1,
              this._hasLoaded = !1,
              this._flv = null
          }
          ,
          t.prototype.dispose = function () {
            this._disposed || (this._disposed = !0,
              this._superPt && this._superPt.dispose.call(this),
              this._destroyFlv(),
              this._superPt && (t.prototype.play = this._superPt.play,
                t.prototype.pause = this._superPt.pause,
                t.prototype.initPlay = this._superPt.initPlay,
                t.prototype.seek = this._superPt.seek,
                t.prototype.canSeekable = this._superPt.canSeekable))
          }
          ,
          t.prototype.canSeekable = function (e) {
            var t = this._flv.mediaInfo;
            return !(!this._flv._isTimepointBuffered(e) && t && !t.hasKeyframesIndex)
          }
          ;
        var l = function (u, e) {
          var c = !1;
          e.on(flvjs.Events.ERROR, function (e, t, i) {
            var r = p.ErrorCode.OtherError
              , o = f.get("Error_Play_Text");
            if (t == flvjs.ErrorDetails.NETWORK_EXCEPTION) {
              var n = u.getOptions().source;
              !n || 0 != n.toLowerCase().indexOf("http://") && 0 != n.toLowerCase().indexOf("https://") ? (r = p.ErrorCode.InvalidSourceURL,
                o = f.get("Error_Invalidate_Source_Widthout_Protocal"),
                c = !0) : o = navigator.onLine ? (r = p.ErrorCode.RequestDataError,
                  f.get("Maybe_Cors_Error")) : (r = p.ErrorCode.NetworkError,
                    f.get("Error_Network_Text"))
            } else
              t == flvjs.ErrorDetails.NETWORK_STATUS_CODE_INVALID ? "404" == i.code ? (r = p.ErrorCode.NotFoundSourceURL,
                o = f.get("Error_Not_Found")) : "403" == i.code ? (r = p.ErrorCode.AuthKeyExpired,
                  o = f.get("Error_AuthKey_Text"),
                  c = !0) : (r = p.ErrorCode.NetworkError,
                    o = f.get("Error_Network_Text")) : t == flvjs.ErrorDetails.NETWORK_TIMEOUT ? (r = p.ErrorCode.LoadingTimeout,
                      o = f.get("Error_Waiting_Timeout_Text")) : t != flvjs.ErrorDetails.MEDIA_FORMAT_UNSUPPORTED && t != flvjs.ErrorDetails.MEDIA_CODEC_UNSUPPORTED || (r = p.ErrorCode.FormatNotSupport,
                        o = f.get("Error_H5_Not_Support_Text"),
                        c = !0);
            var a = function () {
              if (setTimeout(function () {
                u.trigger(_.Private.Play_Btn_Hide)
              }),
                u.checkOnline()) {
                var e = {
                  mediaId: u._options && u._options.vid ? u._options.vid : "",
                  error_code: r,
                  error_msg: i.msg
                };
                u.logError(e),
                  e.display_msg = o,
                  d.cityBrain && (u.flv = null),
                  u.trigger(_.Player.Error, e)
              }
            };
            if (u._options && u._options.isLive && !c) {
              var s = u._options;
              if (s.liveRetry > u._liveRetryCount) {
                0 == u._liveRetryCount && u.trigger(_.Player.OnM3u8Retry);
                var l = s.liveRetryInterval + s.liveRetryStep * u._liveRetryCount;
                u._liveRetryCount++,
                  h.sleep(1e3 * l),
                  u._loadByUrlInner(s.source)
              } else
                u._liveErrorHandle && clearTimeout(u._liveErrorHandle),
                  u.trigger(_.Player.LiveStreamStop),
                  u._liveErrorHandle = setTimeout(a, 500)
            } else {
              if (u._reloadForVod())
                return;
              a()
            }
          })
        }
      }
    }
  }
    , {
    "../../config": 5,
    "../../lang/index": 11,
    "../../lib/constants": 15,
    "../../lib/dom": 18,
    "../../lib/io": 24,
    "../../lib/playerutil": 29,
    "../../lib/ua": 31,
    "../../lib/util": 33,
    "../base/event/eventtype": 43,
    "../base/player": 62
  }],
  72: [function (e, t, i) {
    var r = e("../base/player")
      , o = e("./flvinjector")
      , n = r.extend({
        init: function (e, t) {
          o.inject(this, n, r, t, function (e) { }),
            t._native = !1,
            r.call(this, e, t)
        }
      });
    t.exports = n
  }
    , {
    "../base/player": 62,
    "./flvinjector": 71
  }],
  73: [function (e, t, i) {
    var c = e("../../lib/io")
      , d = e("../../config")
      , p = e("../../lib/constants")
      , h = e("../../lib/util")
      , f = e("../../lib/playerutil")
      , _ = (e("../../lib/dom"),
        e("../../lib/ua"))
      , g = e("../../lang/index")
      , y = e("../base/event/eventtype");
    e("../base/player");
    t.exports.inject = function (e, t, i, r, n, o) {
      var a = r.source
        , s = r.useHlsPluginForSafari
        , l = r.useHlsPlugOnMobile;
      if (n || o || function (e, t, i, r) {
        return !(e._hls || !f.isHls(t) || !(!f.canPlayHls() || f.isSafariUsedHlsPlugin(i) || r && f.isUsedHlsPluginOnMobile()))
      }(e, a, s, l)) {
        e._Type = t,
          e._superType = i,
          e._superPt = i.prototype,
          e._disposed = !1,
          t.prototype._checkHlsReady = function () {
            if (null == e._hls)
              throw new Error("please invoke this method after ready event")
          }
          ,
          e._isHls = !0,
          e._hls = null,
          e._isLoadedHls = !1,
          e._stopLoadAsPaused = !0,
          t.prototype.play = function (e) {
            this._checkHlsReady(),
              this._isManualPlay = e || !1;
            if (this.trigger(y.Private.Cover_Hide),
              this._options.autoplay || this._options.preload || this._loadSourced || (this._loadSourced = !0,
                this._options._autoplay = !0,
                this._hls.loadSource(this._options.source)),
              this.tag.ended || this._ended)
              this.replay();
            else if (this.tag.paused && (this.tag.play(),
              this._stopLoadAsPaused)) {
              var t = this.getCurrentTime();
              this._hls.startLoad(t)
            }
            return this
          }
          ,
          t.prototype.replay = function () {
            return this._monitor && this._monitor.replay(),
              this._hls.startLoad(0),
              this.tag.play(),
              this
          }
          ,
          t.prototype.pause = function (e) {
            return this.tag && (this._checkHlsReady(),
              this.tag.pause(),
              this._stopLoadAsPaused && this._hls.stopLoad()),
              this._isManualPause = e || !1,
              this
          }
          ,
          t.prototype.stop = function () {
            return this._checkHlsReady(),
              this.tag.setAttribute("src", null),
              this._hls.stopLoad(),
              this
          }
          ,
          t.prototype.seek = function (e) {
            this._checkHlsReady();
            try {
              this._superPt.seek.call(this, e),
                this.tag.paused && this._stopLoadAsPaused && this._hls.startLoad(e)
            } catch (e) {
              console.log(e)
            }
            return this
          }
          ,
          t.prototype.getProgramDateTime = function () {
            if (this._checkHlsReady(),
              -1 == this._hls.currentLevel)
              return "";
            var e = this._hls.currentLevel
              , t = this._hls.levels[e].details;
            if (t) {
              var i = t.programDateTime;
              if (console.log("ProgramDateTime=" + i),
                i)
                return new Date(i).valueOf()
            }
            return 0
          }
          ,
          t.prototype._reloadAndPlayForM3u8 = function () {
            0 == this._liveRetryCount && this.trigger(y.Player.OnM3u8Retry),
              this._liveRetryCount++
          }
          ,
          t.prototype._switchLevel = function (e) {
            this.trigger(y.Player.LevelSwitch);
            for (var t = this._hls.levels, i = 0; i < t.length; i++)
              if (t[i].url == e) {
                this._hls.currentLevel = i;
                break
              }
            this._switchedLevel = !0;
            var r = this;
            setTimeout(function () {
              r.trigger(y.Player.LevelSwitched),
                this._switchedLevel = !1
            }, 1e3)
          }
          ,
          t.prototype.initPlay = function (e) {
            if (h.contentProtocolMixed(a)) {
              var t = {
                mediaId: this._options.vid ? this._options.vid : "",
                error_code: p.ErrorCode.InvalidSourceURL,
                error_msg: "InvalidSourceURL"
              };
              return t.display_msg = g.get("Request_Block_Text"),
                void this.trigger(y.Player.Error, t)
            }
            function i(a, e) {
              var t = !a._hls;
              a._destroyHls();
              var i = {
                xhrSetup: function (e, t) {
                  e.withCredentials = a._options.withCredentials || !1
                }
              }
                , r = a._options.loadingTimeOut || a._options.hlsLoadingTimeOut;
              for (var o in r && (i.manifestLoadingTimeOut = r,
                i.levelLoadingTimeOut = r,
                i.fragLoadingTimeOut = r),
                a._options.nudgeMaxRetry && (i.nudgeMaxRetry = a._options.nudgeMaxRetry),
                a._options.maxMaxBufferLength && (i.maxMaxBufferLength = a._options.maxMaxBufferLength),
                a._options.maxBufferSize && (i.maxBufferSize = a._options.maxBufferSize),
                a._options.maxBufferLength && (i.maxBufferLength = a._options.maxBufferLength),
                n && (i._sce_dlgtqredxx = n),
                i.enableWorker = a._options.enableWorker,
                i.debug = a._options.debug,
                a._stopLoadAsPaused = a._options.hlsOption.stopLoadAsPaused,
                a._options.hlsOption)
                i[o] = a._options.hlsOption[o];
              _.IS_IE11 && n && (i.enableWorker = !1),
                a._hls = new Hls(i),
                u(a, a._hls),
                a._loadSourced = !1,
                a._hls.attachMedia(a.tag),
                a._hls.on(Hls.Events.MEDIA_ATTACHED, function () {
                  (a._options.autoplay || a._options.preload || e) && (a._loadSourced = !0,
                    a._hls.loadSource(a._options.source)),
                    a._hls.on(Hls.Events.MANIFEST_PARSED, function () {
                      a._initPlayBehavior(e || a._loadSourced)
                    }),
                    a._hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, function (e, t) {
                      a.trigger(y.Player.AudioTrackUpdated, t)
                    }),
                    a._hls.on(Hls.Events.MANIFEST_LOADED, function (e, t) {
                      a.trigger(y.Player.LevelsLoaded, t)
                    }),
                    a._hls.on(Hls.Events.LEVEL_SWITCHED, function (e, t) {
                      if (a._qualityService) {
                        for (var i = a._hls.levels[t.level].url, r = a._qualityService.levels, o = "", n = 0; n < r.length; n++)
                          if (r[n].Url == i) {
                            o = r[n].desc;
                            break
                          }
                        o && a.trigger(y.Private.QualityChange, {
                          levelSwitch: !0,
                          url: i,
                          desc: o
                        })
                      }
                    }),
                    a._hls.on(Hls.Events.AUDIO_TRACK_SWITCH, function (e, t) {
                      a.trigger(y.Player.AudioTrackSwitch, t),
                        setTimeout(function () {
                          a.trigger(y.Player.AudioTrackSwitched, t)
                        }, 1e3)
                    }),
                    t && a._executeReadyCallback()
                })
            }
            this._isLoadedHls && "undefined" != typeof Hls ? i(this, e) : (this.trigger(y.Private.H5_Loading_Show),
              function (e, t, i) {
                var r = "aliplayer-hls-min.js"
                  , o = "https://" + d.domain + "/de/prismplayer/" + d.h5Version + "/hls/" + r;
                d.domain ? -1 < d.domain.indexOf("g-assets.daily") ? o = "http://" + d.domain + "/de/prismplayer/" + d.h5Version + "/hls/" + r : -1 < d.domain.indexOf("localhost") && (o = "http://" + d.domain + "/build/hls/" + r) : o = "de/prismplayer/" + d.h5Version + "/hls/" + r;
                var n = this;
                c.loadJS(o, function () {
                  e.apply(n)
                })
              }
                .call(this, function () {
                  this._isLoadedHls = !0,
                    i(this, e)
                }, this._options.debug))
          }
          ,
          t.prototype._destroyHls = function () {
            this._hls && this._hls.destroy(),
              this._hls = null
          }
          ,
          t.prototype.dispose = function () {
            this._disposed || (this._disposed = !0,
              this._superPt && this._superPt.dispose.call(this),
              this._destroyHls(),
              this._superPt && (t.prototype.play = this._superPt.play,
                t.prototype.pause = this._superPt.pause,
                t.prototype.initPlay = this._superPt.initPlay,
                t.prototype.replay = this._superPt.replay,
                t.prototype.stop = this._superPt.stop,
                t.prototype.seek = this._superPt.seek))
          }
          ;
        var u = function (l, e) {
          e.on(Hls.Events.ERROR, function (e, t) {
            if (l._options && t.details != Hls.ErrorDetails.FRAG_LOOP_LOADING_ERROR && 1 != l._seeking && (0 != t.fatal || t.type == Hls.ErrorTypes.NETWORK_ERROR)) {
              l._clearTimeout();
              var i = p.ErrorCode.LoadedMetadata
                , r = g.get("Error_Play_Text")
                , o = !1;
              if (t.details == Hls.ErrorDetails.MANIFEST_LOAD_ERROR) {
                o = !0;
                t.networkDetails;
                r = t.response ? "404" == t.response.code ? (i = p.ErrorCode.NotFoundSourceURL,
                  g.get("Error_Not_Found")) : "403" == t.response.code ? (i = p.ErrorCode.AuthKeyExpired,
                    g.get("Error_AuthKey_Text")) : "0" == t.response.code && navigator.onLine ? (i = p.ErrorCode.RequestDataError,
                      r + "\uff0c" + g.get("Maybe_Cors_Error")) : g.get("Error_Load_M3U8_Failed_Text") : g.get("Error_Load_M3U8_Failed_Text")
              } else
                t.details == Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT ? (o = !0,
                  r = g.get("Error_Load_M3U8_Timeout_Text")) : t.details == Hls.ErrorDetails.MANIFEST_PARSING_ERROR || t.details == Hls.ErrorDetails.MANIFEST_INCOMPATIBLE_CODECS_ERROR ? (o = !0,
                    r = g.get("Error_M3U8_Decode_Text")) : t.type == Hls.ErrorTypes.NETWORK_ERROR ? (i = p.ErrorCode.NetworkError,
                      r = g.get("Error_Network_Text")) : t.type != Hls.ErrorTypes.MUX_ERROR && t.type != Hls.ErrorTypes.MEDIA_ERROR || (i = p.ErrorCode.PlayDataDecode,
                        r = g.get("Error_TX_Decode_Text"));
              r = r + "(" + t.details + ")";
              var n = function () {
                if (l.pause(),
                  setTimeout(function () {
                    l.trigger(y.Private.Play_Btn_Hide)
                  }),
                  l.checkOnline()) {
                  var e = {
                    mediaId: l._options && l._options.vid ? l._options.vid : "",
                    error_code: i,
                    error_msg: t.details
                  };
                  l.logError(e),
                    e.display_msg = r,
                    l.trigger(y.Player.Error, e)
                }
              };
              if (l._options && l._options.isLive) {
                var a = l._options;
                if (a.liveRetry > l._liveRetryCount) {
                  0 == l._liveRetryCount && l.trigger(y.Player.OnM3u8Retry);
                  var s = a.liveRetryInterval + a.liveRetryStep * l._liveRetryCount;
                  l._liveRetryCount++,
                    h.sleep(1e3 * s),
                    o && l._loadByUrlInner(l._options.source, 0, !0)
                } else
                  l._liveErrorHandle && clearTimeout(l._liveErrorHandle),
                    l.trigger(y.Player.LiveStreamStop),
                    l._liveErrorHandle = setTimeout(n, 500)
              } else {
                if (l._reloadForVod())
                  return;
                n()
              }
            }
          })
        }
      }
    }
  }
    , {
    "../../config": 5,
    "../../lang/index": 11,
    "../../lib/constants": 15,
    "../../lib/dom": 18,
    "../../lib/io": 24,
    "../../lib/playerutil": 29,
    "../../lib/ua": 31,
    "../../lib/util": 33,
    "../base/event/eventtype": 43,
    "../base/player": 62
  }],
  74: [function (e, t, i) {
    var r = e("../base/player")
      , o = e("./hlsinjector")
      , n = r.extend({
        init: function (e, t) {
          t._native = !1,
            o.inject(this, n, r, t),
            r.call(this, e, t)
        }
      });
    t.exports = n
  }
    , {
    "../base/player": 62,
    "./hlsinjector": 73
  }],
  75: [function (e, t, i) {
    var r = e("../../lib/constants")
      , o = e("../../lib/oo").extend({
        init: function (e) {
          this.player = e,
            this.tickhandle = null
        }
      });
    o.prototype.tick = function (e, t) {
      var i = this;
      this.tickhandle = setTimeout(function () {
        i.player && i.player.trigger(r.AuthKeyExpiredEvent),
          t && t()
      }, 1e3 * e)
    }
      ,
      o.prototype.clearTick = function (e) {
        this.tickhandle && clearTimeout(this.tickhandle)
      }
      ,
      t.exports = o
  }
    , {
    "../../lib/constants": 15,
    "../../lib/oo": 27
  }],
  76: [function (e, t, i) {
    var l = e("../../lib/io")
      , u = (e("../../lib/ua"),
        e("../../lib/bufferbase64"))
      , c = e("../../lib/constants")
      , d = e("./signature")
      , p = e("./util")
      , h = e("../../lang/index")
      , f = function (e, r, o) {
        var t = d.randomUUID()
          , i = "https://mts." + e.domainRegion + ".aliyuncs.com/?"
          , n = {
            AccessKeyId: e.accessId,
            Action: "GetLicense",
            MediaId: e.vid,
            LicenseUrl: i,
            data: e.data,
            SecurityToken: e.stsToken,
            Format: "JSON",
            Type: e.encryptionType,
            Version: "2014-06-18",
            SignatureMethod: "HMAC-SHA1",
            SignatureVersion: "1.0",
            SignatureNonce: t
          };
        e.header && (n.Header = e.header);
        var a = i + ("Signature=" + d.AliyunEncodeURI(d.makeChangeSiga(n, e.accessSecret, "POST")))
          , s = d.makeUTF8sort(n, "=", "&");
        l.post(a, s, function (e) {
          if (e) {
            var t = JSON.parse(e);
            if (r) {
              var i = t.License;
              r(i)
            }
          } else
            o && o(p.createError("MPS\u83b7\u53d6License\u5931\u8d25"))
        }, function (e) {
          if (o) {
            var t = {
              Code: "",
              Message: h.get("Error_MTS_Fetch_Urls_Text")
            };
            try {
              t = JSON.parse(e)
            } catch (e) { }
            o({
              Code: c.ErrorCode.ServerAPIError,
              Message: t.Code + "|" + t.Message,
              sri: t.requestId || ""
            })
          }
        })
      };
    t.exports.requestLicenseKey = function (e) {
      var l = e;
      return l._options.vid && (l.__vid = l._options.vid),
        function (e, i) {
          var t = l._options
            , r = l._getDRMEncryptItem();
          if (r) {
            var o = {
              vid: l.__vid,
              accessId: t.accId,
              accessSecret: t.accSecret,
              stsToken: t.stsToken,
              domainRegion: t.domainRegion,
              authInfo: t.authInfo,
              encryptionType: r.encryptionType
            };
            if (r.encryptionType == c.EncryptionType.Widevine)
              o.data = u.encode(e.message);
            else if (r.encryptionType == c.EncryptionType.PlayReady) {
              var n = u.unpackPlayReady(e.message);
              o.data = n.changange,
                n.header && (o.header = JSON.stringify(n.header))
            }
            console.log(o.data);
            var a = l.__licenseKeys
              , s = l.__vid + r.Url;
            a && a[s],
              f(o, function (e) {
                l.__licenseKeys || (l.__licenseKeys = {}),
                  10 < o.data.length && (l.__licenseKeys[s] = e);
                var t = u.decode(e);
                i(t)
              }, function (e) {
                var t = {
                  mediaId: l.__vid,
                  error_code: e.Code,
                  error_msg: e.Message
                };
                l.logError(t),
                  l.trigger("error", t)
              })
          }
        }
    }
  }
    , {
    "../../lang/index": 11,
    "../../lib/bufferbase64": 13,
    "../../lib/constants": 15,
    "../../lib/io": 24,
    "../../lib/ua": 31,
    "./signature": 80,
    "./util": 82
  }],
  77: [function (e, t, i) {
    var n = e("../../lib/io")
      , u = e("../../lib/constants")
      , c = e("./signature")
      , d = e("./util")
      , p = e("../../lang/index")
      , h = e("../../lib/ua");
    var f = function (e, o) {
      var t = "";
      e.sort(function (e, t) {
        var i = parseInt(e.bitrate)
          , r = parseInt(t.bitrate);
        if ("desc" == o) {
          if (r < i)
            return -1;
          if (i < r)
            return 1
        } else {
          if (i < r)
            return -1;
          if (r < i)
            return 1
        }
      });
      for (var i = e.length, r = 0; r < i; r++) {
        var n = e[r]
          , a = u.QualityLevels[n.definition]
          , s = "";
        s = void 0 === a ? n.bitrate : t == a ? a + n.bitrate : a,
          n.desc = s,
          t = a
      }
    }
      , _ = function (e, o) {
        var t = "";
        e.sort(function (e, t) {
          var i = parseInt(e.width)
            , r = parseInt(t.width);
          if ("desc" == o) {
            if (r < i)
              return -1;
            if (i < r)
              return 1
          } else {
            if (i < r)
              return -1;
            if (r < i)
              return 1
          }
        });
        for (var i = e.length, r = 0; r < i; r++) {
          var n = e[r]
            , a = u.QualityLevels[n.definition]
            , s = "";
          s = void 0 === a ? "" : t == a ? a + n.height : a,
            n.desc = s,
            t = a
        }
      };
    t.exports.getDataByAuthInfo = function (e, a, s, l) {
      c.returnUTCDate(),
        c.randomUUID();
      var t = c.randomUUID()
        , i = {
          AccessKeyId: e.accessId,
          Action: "PlayInfo",
          MediaId: e.vid,
          Formats: e.format,
          AuthInfo: e.authInfo,
          AuthTimeout: e.authTimeout || u.AuthKeyExpired,
          IncludeSnapshotList: e.includeSnapshotList,
          Rand: e.rand,
          SecurityToken: e.stsToken,
          Format: "JSON",
          Version: "2014-06-18",
          SignatureMethod: "HMAC-SHA1",
          SignatureVersion: "1.0",
          Terminal: h.IS_CHROME ? "Chrome" : h.IS_EDGE ? "Edge" : h.IS_IE11 ? "IE" : h.IS_SAFARI ? "Safari" : h.IS_FIREFOX ? "Firefox" : "",
          SignatureNonce: t
        }
        , r = c.makeUTF8sort(i, "=", "&") + "&Signature=" + c.AliyunEncodeURI(c.makeChangeSiga(i, e.accessSecret))
        , o = "https://mts." + e.domainRegion + ".aliyuncs.com/?" + r;
      n.get(o, function (e) {
        if (e) {
          var t = JSON.parse(e)
            , i = t.PlayInfoList.PlayInfo
            , r = t.SnapshotList ? t.SnapshotList.Snapshot : []
            , o = "";
          r && 0 < r.length && (o = r[0].Url);
          var n = function (e, t) {
            for (var i = [], r = [], o = [], n = [], a = e.length - 1; 0 <= a; a--) {
              var s = e[a];
              "mp4" == s.format ? r.push(s) : "mp3" == s.format ? o.push(s) : "m3u8" == s.format ? i.push(s) : n.push(s)
            }
            return 0 < o.length ? (f(o, t),
              o) : 0 < r.length ? (_(r, t),
                r) : 0 < i.length ? (_(i, t),
                  i) : (_(n, t),
                    n)
          }(i, a);
          s && s({
            requestId: t.RequestId,
            urls: n,
            thumbnailUrl: o
          })
        } else
          l && l(d.createError("MPS\u83b7\u53d6\u53d6\u6570\u5931\u8d25"))
      }, function (e) {
        if (l) {
          var t = {
            Code: "",
            Message: p.get("Error_MTS_Fetch_Urls_Text")
          };
          try {
            t = JSON.parse(e)
          } catch (e) { }
          l({
            Code: u.ErrorCode.ServerAPIError,
            Message: t.Code + "|" + t.Message,
            sri: t.requestId || ""
          })
        }
      })
    }
  }
    , {
    "../../lang/index": 11,
    "../../lib/constants": 15,
    "../../lib/io": 24,
    "../../lib/ua": 31,
    "./signature": 80,
    "./util": 82
  }],
  78: [function (e, t, i) {
    var r = e("./saasplayer")
      , o = (e("../../lib/constants"),
        e("./mts"))
      , n = r.extend({
        init: function (e, t) {
          r.call(this, e, t),
            this.service = o,
            this.loadByMts()
        }
      });
    n.prototype.loadByMts = function (e) {
      var t = {
        vid: this._options.vid,
        accessId: this._options.accId,
        accessSecret: this._options.accSecret,
        stsToken: this._options.stsToken,
        domainRegion: this._options.domainRegion,
        authInfo: this._options.authInfo,
        format: this._options.format,
        includeSnapshotList: this._options.includeSnapshotList || !1,
        defaultDefinition: this._options.defaultDefinition,
        authTimeout: this._options.authTimeout
      };
      this.loadData(t, e)
    }
      ,
      n.prototype.replayByVidAndAuthInfo = function (e, t, i, r, o, n) {
        this.trigger("error_hide"),
          this._options.source = "",
          this._isError = !1,
          this._duration = 0,
          this._options.cover = "",
          this._vodRetryCount = 0,
          this._clearTimeout(),
          this.reloadNewVideoInfo(e, t, i, r, o, n)
      }
      ,
      n.prototype.reloadNewVideoInfo = function (e, t, i, r, o, n) {
        if (this.trigger("error_hide"),
          this._options.source = "",
          e && (this._options.vid = e,
            this._options.accId = t,
            this._options.accessSecret = i,
            this._options.stsToken = r,
            this._options.domainRegion = n,
            this._options.authInfo = o),
          !(this._options.vid && this._options.accId && this._options.accessSecret && this._options.stsToken && this._options.domainRegion && this._options.authInfo))
          throw new Error("\u9700\u8981\u63d0\u4f9bvid\u3001accId\u3001accessSecret\u3001stsToken\u3001domainRegion\u548cauthInfo\u53c2\u6570");
        this.log("STARTFETCHDATA", JSON.stringify({
          it: "mps",
          pa: {
            vid: e
          }
        })),
          this.loadByMts(!0)
      }
      ,
      t.exports = n
  }
    , {
    "../../lib/constants": 15,
    "./mts": 77,
    "./saasplayer": 79
  }],
  79: [function (e, t, i) {
    var c = e("../base/player")
      , r = e("../audio/audioplayer")
      , n = (e("../../lib/event"),
        e("../../lib/io"))
      , d = e("../../lib/constants")
      , o = e("./signature")
      , a = e("./authkeyexpiredhandle")
      , p = e("../hls/hlsinjector")
      , h = e("../flv/flvinjector")
      , f = e("../drm/drminjector")
      , _ = (e("../../lib/cookie"),
        e("../../lang/index"))
      , s = e("../../config")
      , g = e("../../lib/playerutil")
      , y = e("../base/event/eventtype")
      , v = c.extend({
        init: function (e, t) {
          this._authKeyExpiredHandle = new a(this),
            c.prototype._videoCreateEl || (c.prototype._videoCreateEl = c.prototype.createEl),
            "mp3" == t.format ? (t.height = "auto",
              t.mediaType = "audio",
              c.prototype.createEl = r.prototype.createEl,
              r.call(this, e, t)) : (c.prototype.createEl = c.prototype._videoCreateEl,
                t._native = !1,
                c.call(this, e, t))
        }
      });
    v.prototype.loadData = function (e, t) {
      if ("undefined" != typeof _sce_r_skjhfnck || "" != e.format && "m3u8" != e.format && 1 != this._options.encryptType)
        this._loadData(e, t);
      else {
        var i = "aliplayer-vod-min.js"
          , r = "https://" + s.domain + "/de/prismplayer/" + s.h5Version + "/hls/" + i;
        s.domain ? -1 < s.domain.indexOf("g-assets.daily") ? r = "http://" + s.domain + "/de/prismplayer/" + s.h5Version + "/hls/" + i : -1 < s.domain.indexOf("localhost") && (r = "http://" + s.domain + "/build/hls/" + i) : r = "de/prismplayer/" + s.h5Version + "/hls/" + i;
        var o = this;
        n.loadJS(r, function () {
          o._loadData(e, t)
        })
      }
    }
      ,
      v.prototype._loadData = function (n, a) {
        var s = (new Date).getTime()
          , l = this;
        if (this._urls = [],
          this._currentPlayIndex = 0,
          this._retrySwitchUrlCount = 0,
          this._authKeyExpiredHandle.clearTick(),
          "" != n.format && "m3u8" != n.format || 1 != this._options.encryptType)
          n.rand = o.randomUUID();
        else {
          var u = _sce_r_skjhfnck();
          n.rand = _sce_lgtcaygl(u)
        }
        this.trigger(y.Private.H5_Loading_Show),
          this.service.getDataByAuthInfo(n, this._options.qualitySort, function (e) {
            if (l.log("COMPLETEFETCHDATA", {
              cost: (new Date).getTime() - s
            }),
              e.urls && 0 == e.urls.length)
              l._mtsError_message(l, {
                Code: d.ErrorCode.URLsIsEmpty,
                Message: _.get("Error_Vod_URL_Is_Empty_Text") + (n.format ? "(format:" + n.format + ")" : "")
              }, "");
            else {
              l.log("COMPLETEFETCHDATA", {
                cost: (new Date).getTime() - s,
                mi: JSON.stringify(e.urls)
              }),
                l._urls = e.urls,
                l._currentPlayIndex = g.findSelectedStreamLevel(l._urls, n.defaultDefinition);
              var t = e.urls[l._currentPlayIndex]
                , i = t.Url;
              if (l._vodDuration = t.duration || 0,
                l._options.source = i,
                l.encType = "",
                l.trigger(y.Private.PREPARE, t.definition),
                l.UI.cover && e.coverUrl && !l._options.cover && l.setCover(e.coverUrl),
                g.isHls(i)) {
                var r = "";
                if (t.encryptionType == d.EncryptionType.Private) {
                  l.encType = t.encryptionType;
                  var o = g.checkSecuritSupport();
                  if (o)
                    return void l._mtsError_message(l, {
                      Code: d.ErrorCode.EncrptyVideoNotSupport,
                      Message: o,
                      display_msg: o
                    }, "");
                  r = _sce_dlgtqred(u, t.rand, t.plaintext)
                }
                p.inject(l, v, c, l._options, r)
              } else
                g.isFlv(i) ? h.inject(l, v, c, l._options) : g.isDash(i) ? f.inject(l, v, c, l._options) : l._player._executeReadyCallback();
              l._authKeyExpiredHandle.tick(d.AuthKeyRefreshExpired),
                l.trigger(y.Private.SourceLoaded, t),
                l.initPlay(a),
                l.trigger(y.Private.ChangeURL),
                e.thumbnailUrl && l._thumbnailService.get(e.thumbnailUrl)
            }
          }, function (e) {
            l._mtsError_message(l, e, "")
          })
      }
      ,
      v.prototype._changeStream = function (e, t) {
        this._urls.length > e && (this.loadByUrl(this._urls[e].Url, this.getCurrentTime()),
          this._currentPlayIndex = e,
          this.trigger(y.Private.QualityChange, t || _.get("Quality_Change_Fail_Switch_Text")))
      }
      ,
      v.prototype._getLowerQualityLevel = function () {
        if (0 == this._urls.length || -1 == this._currentPlayIndex)
          return "";
        if ("asc" == this.options().qualitySort) {
          if (0 < this._currentPlayIndex)
            return {
              item: this._urls[this._currentPlayIndex - 1],
              index: this._currentPlayIndex - 1
            }
        } else if (this._currentPlayIndex < this._urls.length - 1)
          return {
            item: this._urls[this._currentPlayIndex + 1],
            index: this._currentPlayIndex + 1
          };
        return ""
      }
      ,
      v.prototype._mtsError_message = function (e, t, i) {
        var r = e;
        r.trigger(y.Private.H5_Loading_Hide);
        var o = t.Code ? t.Code : "OTHER_ERR_CODE"
          , n = t.Message ? t.Message : "OTHER_ERR_MSG"
          , a = (d.ErrorCode.ServerAPIError,
            t.display_msg || "");
        -1 < n.indexOf("InvalidParameter.Rand") || -1 < n.indexOf('"Rand" is not valid.') ? (d.ErrorCode.EncrptyVideoNotSupport,
          a = _.get("Error_Not_Support_encrypt_Text")) : -1 < n.indexOf("SecurityToken.Expired") ? (d.ErrorCode.AuthKeyExpired,
            a = _.get("Error_Playauth_Expired_Text")) : -1 < n.indexOf("InvalidVideo.NoneStream") && (d.ErrorCode.URLsIsEmpty,
              a = _.get("Error_Fetch_NotStream") + "(" + r._options.format + "|" + r._options.definition + ")");
        var s = r._options.vid ? r._options.vid : "0"
          , l = (r._options.from && r._options.from,
          {
            mediaId: s,
            error_code: o,
            error_msg: n
          });
        t.sri && (l.sri = t.sri),
          r.logError(l),
          l.display_msg = (a || _.get("Error_Vod_Fetch_Urls_Text")) + "</br>" + n,
          r.trigger("error", l),
          console.log("PrismPlayer Error: " + i + "! error_msg :" + n + ";")
      }
      ,
      t.exports = v
  }
    , {
    "../../config": 5,
    "../../lang/index": 11,
    "../../lib/constants": 15,
    "../../lib/cookie": 16,
    "../../lib/event": 19,
    "../../lib/io": 24,
    "../../lib/playerutil": 29,
    "../audio/audioplayer": 41,
    "../base/event/eventtype": 43,
    "../base/player": 62,
    "../drm/drminjector": 68,
    "../flv/flvinjector": 71,
    "../hls/hlsinjector": 73,
    "./authkeyexpiredhandle": 75,
    "./signature": 80
  }],
  80: [function (e, c, t) {
    var r = e("crypto-js/hmac-sha1")
      , o = e("crypto-js/enc-base64")
      , i = e("crypto-js/enc-utf8");
    c.exports.randomUUID = function () {
      for (var e = [], t = "0123456789abcdef", i = 0; i < 36; i++)
        e[i] = t.substr(Math.floor(16 * Math.random()), 1);
      return e[14] = "4",
        e[19] = t.substr(3 & e[19] | 8, 1),
        e[8] = e[13] = e[18] = e[23] = "-",
        e.join("")
    }
      ,
      c.exports.returnUTCDate = function () {
        var e = new Date
          , t = e.getUTCFullYear()
          , i = e.getUTCMonth()
          , r = e.getUTCDate()
          , o = e.getUTCHours()
          , n = e.getUTCMinutes()
          , a = e.getUTCSeconds()
          , s = e.getUTCMilliseconds();
        return Date.UTC(t, i, r, o, n, a, s)
      }
      ,
      c.exports.AliyunEncodeURI = function (e) {
        var t = encodeURIComponent(e);
        return t = (t = (t = t.replace("+", "%2B")).replace("*", "%2A")).replace("%7E", "~")
      }
      ,
      c.exports.makesort = function (e, t, i) {
        if (!e)
          throw new Error("PrismPlayer Error: vid should not be null!");
        var r = [];
        for (var o in e)
          r.push(o);
        var n = r.sort()
          , a = ""
          , s = n.length;
        for (o = 0; o < s; o++)
          "" == a ? a = n[o] + t + e[n[o]] : a += i + n[o] + t + e[n[o]];
        return a
      }
      ,
      c.exports.makeUTF8sort = function (e, t, i) {
        if (!e)
          throw new Error("PrismPlayer Error: vid should not be null!");
        var r = [];
        for (var o in e)
          r.push(o);
        var n = r.sort()
          , a = ""
          , s = n.length;
        for (o = 0; o < s; o++) {
          var l = c.exports.AliyunEncodeURI(n[o])
            , u = c.exports.AliyunEncodeURI(e[n[o]]);
          "" == a ? a = l + t + u : a += i + l + t + u
        }
        return a
      }
      ,
      c.exports.makeChangeSiga = function (e, t, i) {
        if (!e)
          throw new Error("PrismPlayer Error: vid should not be null!");
        return i || (i = "GET"),
          o.stringify(r(i + "&" + c.exports.AliyunEncodeURI("/") + "&" + c.exports.AliyunEncodeURI(c.exports.makeUTF8sort(e, "=", "&")), t + "&"))
      }
      ,
      c.exports.ISODateString = function (e) {
        function t(e) {
          return e < 10 ? "0" + e : e
        }
        return e.getUTCFullYear() + "-" + t(e.getUTCMonth() + 1) + "-" + t(e.getUTCDate()) + "T" + t(e.getUTCHours()) + ":" + t(e.getUTCMinutes()) + ":" + t(e.getUTCSeconds()) + "Z"
      }
      ,
      c.exports.encPlayAuth = function (e) {
        if (!(e = i.stringify(o.parse(e))))
          throw new Error("playuth\u53c2\u6570\u89e3\u6790\u4e3a\u7a7a");
        return JSON.parse(e)
      }
      ,
      c.exports.encRsa = function () { }
  }
    , {
    "crypto-js/enc-base64": 126,
    "crypto-js/enc-utf8": 127,
    "crypto-js/hmac-sha1": 128
  }],
  81: [function (e, t, i) {
    var l = e("../../lib/io")
      , u = e("../../lib/constants")
      , c = e("./signature")
      , d = e("./util")
      , p = e("../../lang/index");
    t.exports.getPlayAuth = function (e, i, r, o) {
      c.randomUUID();
      var t = c.randomUUID()
        , n = {
          AccessKeyId: e.accessKeyId,
          Action: "GetVideoPlayAuth",
          VideoId: e.vid,
          AuthTimeout: u.AuthInfoExpired,
          SecurityToken: e.securityToken,
          Format: "JSON",
          Version: "2017-03-21",
          SignatureMethod: "HMAC-SHA1",
          SignatureVersion: "1.0",
          SignatureNonce: t
        }
        , a = c.makeUTF8sort(n, "=", "&") + "&Signature=" + c.AliyunEncodeURI(c.makeChangeSiga(n, e.accessKeySecret))
        , s = "https://vod." + e.region + ".aliyuncs.com/?" + a;
      l.get(s, function (e) {
        if (e) {
          var t = JSON.parse(e);
          i && i(t.PlayAuth)
        } else
          r && r(d.createError("\u83b7\u53d6\u89c6\u9891\u64ad\u653e\u51ed\u8bc1\u5931\u8d25"))
      }, function (e) {
        if (r) {
          var t = {
            Code: "",
            Message: p.get("Fetch_Playauth_Error")
          };
          try {
            (t = JSON.parse(e)).Code
          } catch (e) { }
          r({
            Code: u.ErrorCode.ServerAPIError,
            Message: t.Code + "|" + t.Message,
            sri: t.requestId,
            display_msg: p.get("Fetch_Playauth_Error", o)
          })
        }
      })
    }
  }
    , {
    "../../lang/index": 11,
    "../../lib/constants": 15,
    "../../lib/io": 24,
    "./signature": 80,
    "./util": 82
  }],
  82: [function (e, t, i) {
    t.exports.createError = function (e, t) {
      return {
        requestId: "",
        code: t || "",
        message: e
      }
    }
  }
    , {}],
  83: [function (e, t, i) {
    var l = e("../../lib/io")
      , p = e("../../lib/constants")
      , u = e("./signature")
      , c = e("./util")
      , d = e("../../config")
      , h = e("../../lang/index");
    t.exports.getDataByAuthInfo = function (e, n, a, s) {
      u.randomUUID();
      var t = u.randomUUID()
        , i = {
          AccessKeyId: e.accessId,
          Action: "GetPlayInfo",
          VideoId: e.vid,
          Formats: e.format,
          AuthTimeout: e.authTimeout || p.AuthKeyExpired,
          Rand: e.rand,
          SecurityToken: e.stsToken,
          StreamType: e.mediaType,
          Format: "JSON",
          Version: "2017-03-21",
          SignatureMethod: "HMAC-SHA1",
          SignatureVersion: "1.0",
          SignatureNonce: t,
          PlayerVersion: d.h5Version,
          Definition: e.definition,
          Channel: "HTML5"
        };
      e.authInfo && (i.AuthInfo = e.authInfo),
        e.outputType && (i.OutputType = e.outputType),
        e.playConfig && (i.PlayConfig = JSON.stringify(e.playConfig)),
        e.reAuthInfo && (i.ReAuthInfo = JSON.stringify(e.reAuthInfo));
      var r = u.makeUTF8sort(i, "=", "&") + "&Signature=" + u.AliyunEncodeURI(u.makeChangeSiga(i, e.accessSecret))
        , o = "https://vod." + e.domainRegion + ".aliyuncs.com/?" + r;
      l.get(o, function (e) {
        if (e) {
          var t = JSON.parse(e)
            , i = ""
            , r = t.VideoBase.ThumbnailList;
          r && r.Thumbnail && 0 < r.Thumbnail.length && (i = r.Thumbnail[0].URL);
          var o = function (e, t) {
            for (var i = [], r = [], o = [], n = [], a = e.length - 1; 0 <= a; a--) {
              var s = e[a]
                , l = (c = void 0,
                  (c = {}).width = (u = s).Width,
                  c.height = u.Height,
                  c.definition = u.Definition,
                  c.Url = u.PlayURL,
                  c.format = u.Format,
                  c.desc = p.QualityLevels[c.definition],
                  c.encryptionType = p.VodEncryptionType[u.EncryptType],
                  c.plaintext = u.Plaintext,
                  c.rand = u.Rand,
                  c.encrypt = u.Encrypt,
                  c.duration = u.Duration,
                  c);
              "mp4" == l.format ? r.push(l) : "mp3" == l.format ? o.push(l) : "m3u8" == l.format ? i.push(l) : n.push(l)
            }
            var u, c, d = [];
            return d = 0 < o.length ? o : 0 < r.length ? r : 0 < i.length ? i : n,
              "asc" == t && d.reverse(),
              d
          }(t.PlayInfoList.PlayInfo, n);
          a && a({
            requestId: t.RequestId,
            urls: o,
            thumbnailUrl: i,
            coverUrl: t.VideoBase.CoverURL
          })
        } else
          s && s(c.createError("\u70b9\u64ad\u670d\u52a1\u83b7\u53d6\u53d6\u6570\u5931\u8d25"))
      }, function (e) {
        if (s) {
          var t = {
            Code: "",
            Message: h.get("Error_Vod_Fetch_Urls_Text")
          };
          try {
            t = JSON.parse(e)
          } catch (e) { }
          s({
            Code: p.ErrorCode.ServerAPIError,
            Message: t.Code + "|" + t.Message,
            sri: t.requestId || ""
          })
        }
      })
    }
  }
    , {
    "../../config": 5,
    "../../lang/index": 11,
    "../../lib/constants": 15,
    "../../lib/io": 24,
    "./signature": 80,
    "./util": 82
  }],
  84: [function (e, t, i) {
    var r = e("./saasplayer")
      , l = e("../../lib/constants")
      , o = e("./vod")
      , u = e("./signature")
      , n = (e("./authkeyexpiredhandle"),
        e("./ststoken"),
        r.extend({
          init: function (e, t) {
            r.call(this, e, t),
              this.service = o,
              this.loadByVod()
          }
        }));
    n.prototype.loadByVod = function (e) {
      var t = ""
        , i = ""
        , r = ""
        , o = ""
        , n = "";
      if (this._options.accessKeyId && this._options.accessKeySecret)
        t = this._options.accessKeyId,
          i = this._options.accessKeySecret,
          r = this._options.securityToken,
          o = this._options.region,
          this.log("STARTFETCHDATA", JSON.stringify({
            it: "sts",
            pa: {
              vid: this._options.vid
            }
          }));
      else {
        try {
          var a = u.encPlayAuth(this._options.playauth);
          t = a.AccessKeyId,
            i = a.AccessKeySecret,
            r = a.SecurityToken,
            o = a.Region,
            n = a.AuthInfo
        } catch (e) {
          var s = {
            Code: l.ErrorCode.PlayauthDecode,
            Message: "playauth decoded failed.",
            displayMessage: "playauth\u89e3\u6790\u9519\u8bef"
          };
          return void this._mtsError_message(this, s, this._options.playauth)
        }
        this._options.from = a.CustomerId ? a.CustomerId : "",
          this.log("STARTFETCHDATA", JSON.stringify({
            it: "playAuth",
            pa: {
              vid: this._options.vid
            }
          }))
      }
      this._loadByVodBySTS(t, i, r, o, n, e)
    }
      ,
      n.prototype.replayByVidAndPlayAuth = function (e, t) {
        this.trigger("error_hide"),
          this._options.source = "",
          this._options.vid = e,
          this._options.playauth = t,
          this._isError = !1,
          this._duration = 0,
          this._options.cover = "",
          this._vodRetryCount = 0,
          this._clearTimeout(),
          this.loadByVod(!0)
      }
      ,
      n.prototype.updateSourcesByVidAndPlayAuth = function (e, t) {
        if (e == this._options.vid) {
          this._options.vid = e,
            this._options.playauth = t;
          try {
            var i = u.encPlayAuth(this._options.playauth)
          } catch (e) {
            return void console.log("playauth\u89e3\u6790\u9519\u8bef")
          }
          var r = {
            vid: e,
            accessId: i.AccessKeyId,
            accessSecret: i.AccessKeySecret,
            stsToken: i.SecurityToken,
            domainRegion: i.Region,
            authInfo: i.AuthInfo,
            playDomain: i.PlayDomain,
            format: this._options.format,
            mediaType: this._options.mediaType
          };
          this._authKeyExpiredHandle.clearTick();
          var o = this;
          this.service.loadData(r, this._options.qualitySort, function (e) {
            o._serverRequestId = e.requestId,
              0 != e.urls.length && (o._urls = e.urls),
              o._authKeyExpiredHandle.tick(l.AuthKeyRefreshExpired)
          }, function (e) {
            console.log(e)
          })
        } else
          console.log("\u4e0d\u80fd\u66f4\u65b0\u5730\u5740\uff0cvid\u548c\u64ad\u653e\u4e2d\u7684\u4e0d\u4e00\u81f4")
      }
      ,
      n.prototype.reloaduserPlayInfoAndVidRequestMts = function (e, t) {
        this.replayByVidAndPlayAuth(e, t, accessSecret)
      }
      ,
      n.prototype._loadByVodBySTS = function (e, t, i, r, o, n) {
        var a = {
          vid: this._options.vid,
          accessId: e,
          accessSecret: t,
          stsToken: i,
          authInfo: o,
          domainRegion: r,
          format: this._options.format,
          mediaType: this._options.mediaType,
          definition: this._options.definition,
          defaultDefinition: this._options.defaultDefinition,
          authTimeout: this._options.authTimeout,
          outputType: this._options.outputType,
          playConfig: this._options.playConfig,
          reAuthInfo: this._options.reAuthInfo
        };
        this.loadData(a, n)
      }
      ,
      t.exports = n
  }
    , {
    "../../lib/constants": 15,
    "./authkeyexpiredhandle": 75,
    "./saasplayer": 79,
    "./signature": 80,
    "./ststoken": 81,
    "./vod": 83
  }],
  85: [function (e, t, i) {
    var o = e("../base/event/eventtype")
      , r = function (i) {
        this._player = i,
          this._video = i.tag;
        var r = this;
        this._isCreated = !1,
          this._canPlayTriggered = !1,
          this._defaultTrack = "",
          i.on(o.Private.ChangeURL, function () {
            r._isCreated = !1,
              r._canPlayTriggered = !1,
              r._defaultTrack = ""
          }),
          i.on(o.Player.CanPlay, function () {
            if (!r._player._drm && !r._canPlayTriggered) {
              var e = r._getTracks();
              e && (r._isCreated = !0,
                i.trigger(o.Player.AudioTrackReady, e),
                r._notifyDefaultValue(e)),
                r._canPlayTriggered = !0
            }
          }),
          i.on(o.Player.AudioTrackUpdated, function (e) {
            if (!r._isCreated) {
              var t = r._getTracks(e.paramData.audioTracks);
              t && (r._isCreated = !0,
                i.trigger(o.Player.AudioTrackReady, t),
                r._notifyDefaultValue(t))
            }
          })
      };
    r.prototype._notifyDefaultValue = function (e) {
      !this._defaultTrack && 0 < e.length && (this._defaultTrack = e[0]),
        this._defaultTrack && this._player.trigger(o.Private.SelectorUpdateList, {
          type: "audio",
          text: this._defaultTrack.text
        })
    }
      ,
      r.prototype.support = function () {
        return !!this._video.audioTracks
      }
      ,
      r.prototype._getTracks = function (e) {
        if (!this.support() && !e)
          return null;
        this._video && this._video.audioTracks && (!e || e && 0 == e.length) && (e = this._video.audioTracks);
        for (var t = [], i = e ? e.length : 0, r = 0; r < i; r++) {
          var o = e[r]
            , n = {
              value: o.id,
              text: o.label || o.name || o.language
            };
          (o["default"] || o.enabled) && (this._defaultTrack = n),
            t.push(n)
        }
        return t
      }
      ,
      r.prototype["switch"] = function (e) {
        if (this._player._hls)
          this._player._hls.audioTrack = 1 * e;
        else
          for (var t = this._video.audioTracks ? this._video.audioTracks.length : 0, i = 0; i < t; i++) {
            var r = this._video.audioTracks[i];
            r.id == e ? r.enabled = !0 : r.enabled = !1
          }
      }
      ,
      r.prototype.dispose = function () {
        this._player = null
      }
      ,
      t.exports = r
  }
    , {
    "../base/event/eventtype": 43
  }],
  86: [function (e, t, i) {
    var r = e("../base/event/eventtype")
      , o = e("../../lib/dom")
      , n = e("../../lib/ua")
      , l = e("../../lib/cookie")
      , u = e("../../lib/constants")
      , a = function (e) {
        this._video = e.tag,
          this._player = e,
          this._isCreated = !1,
          this._backupCC = "",
          this.tracks = [],
          this._defaultTrack = "",
          this._currentValue = "";
        var t = this;
        e.on(r.Private.ChangeURL, function () {
          t._disabledTracks(),
            t._isCreated = !1,
            t._defaultTrack = ""
        }),
          e.on(r.Player.CanPlay, function () {
            t._player._drm || (t._isCreated || (t.tracks = t._getTracks(),
              e.trigger(r.Player.TextTrackReady, t.tracks)),
              t._isCreated && !t._player._setDefaultCC || !t._defaultTrack || (e.trigger(r.Private.SelectorUpdateList, {
                type: "cc",
                text: t._defaultTrack.text
              }),
                t["switch"](t._defaultTrack.value),
                t._player._setDefaultCC = !1,
                t._isCreated = !0))
          }),
          this._adaptiveCueStype(),
          e.on(r.Player.RequestFullScreen, function () {
            t._adaptiveCueStype()
          }),
          e.on(r.Player.CancelFullScreen, function () {
            t._adaptiveCueStype()
          })
      };
    a.prototype._adaptiveCueStype = function () {
      var e = -10;
      if (n.IS_SAFARI) {
        e = -65;
        var t = this._player.fullscreenService;
        t && t.getIsFullScreen() && (e = -95)
      } else
        n.IS_MOBILE && (e = -30);
      o.addCssByStyle("video::-webkit-media-text-track-container{transform: translateY(" + e + "px) !important;}")
    }
      ,
      a.prototype.close = function () {
        for (var e = this._video && this._video.textTracks ? this._video.textTracks.length : 0, t = 0; t < e; t++) {
          var i = this._video.textTracks[t];
          "expired" != i.mode && ("showing" == i.mode && (this._backupCC = i),
            i.mode = "disabled")
        }
      }
      ,
      a.prototype.open = function () {
        if (this.tracks && !(this.tracks.length < 2)) {
          var e = this._backupCC ? this._backupCC.language : ""
            , t = this._backupCC ? this._backupCC.label : "";
          return e || (e = this.tracks[1].value,
            t = this.tracks[1].text),
            this["switch"](e),
            t
        }
      }
      ,
      a.prototype.getCurrentSubtitle = function () {
        return this._currentValue
      }
      ,
      a.prototype._getTracks = function () {
        if (this._player._drm)
          return [];
        var e = this._video && this._video.textTracks ? this._video.textTracks.length : 0;
        this._defaultTrack = {
          value: "off",
          text: "Off"
        };
        for (var t = [this._defaultTrack], i = l.get(u.SelectedCC), r = "", o = !1, n = 0; n < e; n++) {
          var a = this._video.textTracks[n];
          if ("expired" != a.mode && "subtitles" == a.kind) {
            var s = {
              value: a.language,
              text: a.label
            };
            a["default"] && (this._defaultTrack = s,
              o = !0),
              s.value == i && (r = s),
              t.push(s)
          }
        }
        return !o && r && (this._defaultTrack = r),
          t
      }
      ,
      a.prototype._disabledTracks = function () {
        for (var e = this._video && this._video.textTracks ? this._video.textTracks.length : 0, t = 0; t < e; t++) {
          this._video.textTracks[t].mode = "expired"
        }
      }
      ,
      a.prototype["switch"] = function (e) {
        if (this.close(),
          "off" != e) {
          for (var t = this._video && this._video.textTracks ? this._video.textTracks.length : 0, i = 0; i < t; i++) {
            var r = this._video.textTracks[i];
            r.language === e && "expired" != r.mode && (this._video.textTracks[i].mode = "showing")
          }
          this._currentValue = e
        } else
          this.close()
      }
      ,
      a.prototype.dispose = function () {
        this._player = null
      }
      ,
      t.exports = a
  }
    , {
    "../../lib/constants": 15,
    "../../lib/cookie": 16,
    "../../lib/dom": 18,
    "../../lib/ua": 31,
    "../base/event/eventtype": 43
  }],
  87: [function (e, t, i) {
    var r = e("../../lib/playerutil");
    t.exports = [{
      service: e("./ccservice"),
      name: "_ccService",
      condition: !0
    }, {
      service: e("./audiotrackservice"),
      name: "_audioTrackService"
    }, {
      service: e("./qualityservice"),
      name: "_qualityService"
    }, {
      service: e("./fullscreenservice"),
      name: "fullscreenService",
      condition: function () {
        return !0
      }
    }, {
      service: e("./liveshiftservice"),
      name: "_liveshiftService",
      condition: function () {
        var e = this.options();
        return r.isLiveShift(e)
      }
    }, {
      service: e("./thumbnailservice"),
      name: "_thumbnailService",
      condition: function () {
        return !0
      }
    }, {
      service: e("./progressmarkerservice"),
      name: "_progressMarkerService",
      condition: function () {
        return !0
      }
    }]
  }
    , {
    "../../lib/playerutil": 29,
    "./audiotrackservice": 85,
    "./ccservice": 86,
    "./fullscreenservice": 88,
    "./liveshiftservice": 89,
    "./progressmarkerservice": 90,
    "./qualityservice": 91,
    "./thumbnailservice": 92
  }],
  88: [function (e, t, i) {
    var o = e("../../lib/ua")
      , n = e("../../lib/dom")
      , a = e("../../lib/event")
      , s = e("../base/event/eventtype")
      , r = e("../base/x5play")
      , l = e("../../lang/index")
      , u = function () {
        var e;
        n.createEl("div");
        var t = [["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror", "fullScreen"], ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror", "webkitfullScreen"], ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror", "webkitIsFullScreen"], ["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror", "mozFullScreen"], ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError", "MSFullScreen"]]
          , i = !(e = {});
        if (o.IS_IOS && (e.requestFn = "webkitEnterFullscreen",
          e.cancelFn = "webkitExitFullscreen",
          e.fullscreenElement = "webkitFullscreenElement",
          e.eventName = "webkitfullscreenchange",
          e.isFullScreen = "webkitDisplayingFullscreen",
          document[e.requestFn] && (i = !0)),
          !i) {
          for (var r = 0; r < 5; r++)
            if (t[r][1] in document) {
              e.requestFn = t[r][0],
                e.cancelFn = t[r][1],
                e.fullscreenElement = t[r][2],
                e.eventName = t[r][4],
                e.isFullScreen = t[r][6];
              break
            }
          "requestFullscreen" in document ? e.requestFn = "requestFullscreen" : "webkitRequestFullscreen" in document ? e.requestFn = "webkitRequestFullscreen" : "webkitRequestFullScreen" in document ? e.requestFn = "webkitRequestFullScreen" : "webkitEnterFullscreen" in document ? e.requestFn = "webkitEnterFullscreen" : "mozRequestFullScreen" in document ? e.requestFn = "mozRequestFullScreen" : "msRequestFullscreen" in document && (e.requestFn = "msRequestFullscreen"),
            "fullscreenchange" in document ? e.eventName = "fullscreenchange" : "webkitfullscreenchange" in document ? e.eventName = "webkitfullscreenchange" : "webkitfullscreenchange" in document ? e.eventName = "webkitfullscreenchange" : "webkitfullscreenchange" in document ? e.eventName = "webkitfullscreenchange" : "mozfullscreenchange" in document ? e.eventName = "mozfullscreenchange" : "MSFullscreenChange" in document && (e.eventName = "MSFullscreenChange"),
            "fullScreen" in document ? e.isFullScreen = "fullScreen" : "webkitfullScreen" in document ? e.isFullScreen = "webkitfullScreen" : "webkitIsFullScreen" in document ? e.isFullScreen = "webkitIsFullScreen" : "webkitDisplayingFullscreen" in document ? e.isFullScreen = "webkitDisplayingFullscreen" : "mozFullScreen" in document ? e.isFullScreen = "mozFullScreen" : "mozfullScreen" in document ? e.isFullScreen = "mozfullScreen" : "MSFullScreen" in document && (e.isFullScreen = "MSFullScreen"),
            "fullscreenElement" in document ? e.fullscreenElement = "fullscreenElement" : "webkitFullscreenElement" in document ? e.fullscreenElement = "webkitFullscreenElement" : "webkitFullScreenElement" in document ? e.fullscreenElement = "webkitFullScreenElement" : "mozFullScreenElement" in document ? e.fullscreenElement = "mozFullScreenElement" : "msFullscreenElement" in document ? e.fullscreenElement = "msFullscreenElement" : "MSFullscreenElement" in document && (e.fullscreenElement = "MSFullscreenElement")
        }
        return e.requestFn ? e : null
      }()
      , c = function (e) {
        this.isFullWindow = !1,
          this.isFullScreen = !1,
          this.isFullScreenChanged = !1,
          this._requestFullScreenTimer = null,
          this._cancelFullScreenTimer = null,
          this._player = e;
        var r = this
          , o = u;
        this._fullscreenChanged = function (e) {
          if (null != r._player) {
            var t = document[o.isFullScreen];
            if (void 0 !== t)
              r.isFullScreen = t;
            else {
              var i = document[o.fullscreenElement];
              r.isFullScreen = null != i
            }
            (r.isFullScreenChanged = !0) === r.isFullScreen ? r._player.trigger(s.Player.RequestFullScreen) : r._player.trigger(s.Player.CancelFullScreen)
          }
        }
          ,
          o && a.on(document, o.eventName, this._fullscreenChanged)
      };
    c.prototype.requestFullScreen = function () {
      if (!r.isAndroidX5() || !this._player.paused()) {
        var e = u
          , t = this._player.el()
          , i = this;
        if (o.IS_IOS)
          return (t = this._player.tag)[e.requestFn](),
            i._player.trigger(s.Player.RequestFullScreen),
            this;
        this.isFullScreen = !0,
          this.isFullScreenChanged = !1,
          this._requestFullScreenTimer = null,
          this._cancelFullScreenTimer || clearTimeout(this._cancelFullScreenTimer);
        i = this;
        return e && !this._player._options.enableMockFullscreen ? (t[e.requestFn](),
          this._requestFullScreenTimer = setTimeout(function () {
            i.isFullScreenChanged || (d.apply(i),
              i._player.trigger(s.Player.RequestFullScreen)),
              i._requestFullScreenTimer = null
          }, 1e3)) : (d.apply(i),
            this._player.trigger(s.Player.RequestFullScreen)),
          this._player
      }
      this._player.trigger(s.Private.Info_Show, l.get("Play_Before_Fullscreen"))
    }
      ,
      c.prototype.cancelFullScreen = function () {
        var e = u;
        this.isFullScreen = !1,
          this.isFullScreenChanged = !1,
          this._cancelFullScreenTimer = null,
          this._requestFullScreenTimer || clearTimeout(this._requestFullScreenTimer);
        var t = this;
        return e && !this._player._options.enableMockFullscreen ? (document[e.cancelFn](),
          t._cancelFullScreenTimer = setTimeout(function () {
            t.isFullScreenChanged || (p.apply(t),
              t._player.trigger(s.Player.CancelFullScreen)),
              t._cancelFullScreenTimer = null
          }, 500)) : (p.apply(t),
            this._player.trigger(s.Player.CancelFullScreen)),
          this._player.tag.paused || this._player.trigger(s.Player.Play),
          this._player
      }
      ,
      c.prototype.getIsFullScreen = function () {
        return this.isFullScreen
      }
      ,
      c.prototype.dispose = function () {
        this._player = null;
        var e = u;
        a.off(document, e.eventName, this._fullscreenChanged)
      }
      ;
    var d = function () {
      this.isFullWindow = !0,
        this.docOrigOverflow = document.documentElement.style.overflow,
        document.documentElement.style.overflow = "hidden",
        n.addClass(document.getElementsByTagName("body")[0], "prism-full-window")
    }
      , p = function () {
        this.isFullWindow = !1,
          document.documentElement.style.overflow = this.docOrigOverflow,
          n.removeClass(document.getElementsByTagName("body")[0], "prism-full-window")
      };
    t.exports = c
  }
    , {
    "../../lang/index": 11,
    "../../lib/dom": 18,
    "../../lib/event": 19,
    "../../lib/ua": 31,
    "../base/event/eventtype": 43,
    "../base/x5play": 67
  }],
  89: [function (e, t, i) {
    var o = e("../../lib/io")
      , n = e("../../lib/util")
      , a = e("../../lib/playerUtil")
      , s = e("../../lang/index")
      , l = (e("../flv/flvinjector"),
        e("../hls/hlsinjector"))
      , u = e("../../lib/constants")
      , c = e("../base/event/eventtype")
      , d = (e("../../lib/url"),
        function (e, t) {
          if (e && e) {
            var i = new Date(e)
              , r = new Date(t)
              , o = r.valueOf() / 1e3 - i.valueOf() / 1e3;
            return {
              start: i,
              end: r,
              endDisplay: n.extractTime(r),
              totalTime: o
            }
          }
        }
      )
      , p = function (e, t) {
        t && (e.currentTimestamp = t,
          e.currentTime = n.convertToDate(t),
          e.currentTimeDisplay = n.extractTime(e.currentTime),
          e.liveShiftStart = e.liveTimeRange.start,
          e.liveShiftEnd = e.liveTimeRange.end,
          e.liveShiftStartDisplay = n.extractTime(e.liveShiftStart),
          e.liveShiftEndDisplay = n.extractTime(e.liveShiftEnd),
          e.availableLiveShiftTime = t - e.liveShiftStart.valueOf() / 1e3,
          e.timestampStart = n.convertToTimestamp(e.liveShiftStart),
          e.timestampEnd,
          n.convertToTimestamp(e.liveShiftEnd))
      }
      , r = function (t) {
        this._player = t,
          this._isLiveShift = !1;
        var r = this
          , e = function () {
            var e = t._options.source;
            this._originalPlayUrl = e,
              this._liveShiftUrl = t._options.liveTimeShiftUrl,
              this.liveTimeRange = d(t._options.liveStartTime, t._options.liveOverTime),
              this.availableLiveShiftTime = 0,
              this.seekTime = -1
          };
        e.call(this),
          t.liveShiftSerivce = {
            setLiveTimeRange: function (e, t) {
              r.setLiveTimeRange(e, t)
            },
            queryLiveShift: function (e, t, i) {
              r.queryLiveShift(e, t, i)
            }
          },
          t.on(c.Private.ChangeURL, function () {
            e.call(r)
          })
      };
    r.prototype.validate = function () {
      return !(this.liveTimeRange.start >= this.liveTimeRange.end)
    }
      ,
      r.prototype.switchToLive = function () {
        var e = that._player._options.recreatePlayer;
        e && this._isLiveShift && (this._player.dispose(),
          setTimeout(function () {
            e()
          }, 1e3),
          this._isLiveShift = !1)
      }
      ,
      r.prototype.getBaseTime = function () {
        this.liveShiftStartDisplay;
        return -1 == this.seekTime ? n.parseTime(this.currentTimeDisplay) : n.parseTime(this.liveShiftStartDisplay) + this.seekTime
      }
      ,
      r.prototype.getSourceUrl = function (e, t) {
        var i = this._originalPlayUrl;
        return this.availableLiveShiftTime <= e ? i : (this._isLiveShift = !0,
          (e = parseInt(e)) <= 5 && (e = 5),
          (i = this._switchLiveShiftPlayer(t)) && (i = i.replace("lhs_offset_unix_s_0", "z")),
          i = -1 == i.indexOf("?") ? i + "?lhs_offset_unix_s_0=" + e : i + "&lhs_offset_unix_s_0=" + e)
      }
      ,
      r.prototype._switchLiveShiftPlayer = function (e) {
        var t = this._originalPlayUrl
          , i = this._player._options.liveShiftSource
          , r = this._player._options.source;
        if (a.isHls(r))
          t = r;
        else if (a.isFlv(t) && i && a.isHls(i)) {
          this._player._flv && this._player._destroyFlv();
          var o = this._player._superType
            , n = this._player._Type;
          return this._player._options._autoplay = !0,
            l.inject(this._player, n, o, this._player._options, "", !0),
            i
        }
        return t
      }
      ,
      r.prototype.getTimeline = function (i, r) {
        if (this._player.trigger(c.Private.LiveShiftQueryCompleted),
          !this._liveShiftUrl)
          return p(this, (new Date).valueOf() / 1e3),
            void (i && i());
        var o = this;
        this.queryLiveShift(this._liveShiftUrl, function (e) {
          if (e) {
            var t = e;
            0 == t.retCode ? (p(o, t.content.current),
              i && i()) : r({
                Code: u.ErrorCode.ServerAPIError,
                Message: t.retCode + "|" + t.description + "|" + t.content
              })
          } else
            console.log("\u83b7\u53d6\u76f4\u64ad\u65f6\u79fb\u6570\u636e\u5931\u8d25")
        }, function (e) {
          if (r && e) {
            var t = {};
            if (e) {
              if (-1 < e.indexOf("403 Forbidden"))
                t.Code = u.ErrorCode.AuthKeyExpired,
                  t.Message = "Query liveshift failed:" + s.get("Error_AuthKey_Text");
              else {
                var i;
                t = e;
                try {
                  i = JSON.parse(e)
                } catch (e) { }
                i && (t.Code = u.ErrorCode.ServerAPIError,
                  t.Message = i.retCode + "|" + i.description + "|" + i.content)
              }
              r(t)
            }
          }
        })
      }
      ,
      r.prototype.start = function (e, t) {
        var i = this
          , r = function () {
            i._loopHandler = setTimeout(function () {
              i.getTimeline(function () { }, t),
                r()
            }, e)
          };
        i.getTimeline(function (e) {
          i._localLiveTimeHandler || i.tickLocalLiveTime()
        }, t),
          r()
      }
      ,
      r.prototype.tickLocalLiveTime = function () {
        var e = this
          , t = function () {
            e._localLiveTimeHandler = setTimeout(function () {
              e.currentTimestamp++,
                p(e, e.currentTimestamp),
                e._player.trigger(c.Private.LiveShiftQueryCompleted),
                t()
            }, 1e3)
          };
        t()
      }
      ,
      r.prototype.setLiveTimeRange = function (e, t) {
        e || (e = this._player._options.liveStartTime),
          t || (t = this._player._options.liveOverTime),
          this.liveTimeRange = d(e, t),
          p(this, this.currentTimestamp),
          this._player.trigger(c.Private.LiveShiftQueryCompleted)
      }
      ,
      r.prototype.queryLiveShift = function (e, i, r) {
        o.get(e, function (e) {
          if (e) {
            var t = JSON.parse(e);
            0 == t.retCode ? i && i(t) : r && r(t)
          } else
            r && r(e)
        }, function (e) {
          r && r(e)
        })
      }
      ,
      r.prototype.stop = function (e) {
        this._loopHandler && (clearTimeout(this._loopHandler),
          this._loopHandler = null)
      }
      ,
      r.prototype.dispose = function () {
        this.stop(),
          this._localLiveTimeHandler && (clearTimeout(this._localLiveTimeHandler),
            this._localLiveTimeHandler = null),
          this._player = null
      }
      ,
      t.exports = r
  }
    , {
    "../../lang/index": 11,
    "../../lib/constants": 15,
    "../../lib/io": 24,
    "../../lib/playerUtil": 28,
    "../../lib/url": 32,
    "../../lib/util": 33,
    "../base/event/eventtype": 43,
    "../flv/flvinjector": 71,
    "../hls/hlsinjector": 73
  }],
  90: [function (e, t, i) {
    var c = e("../base/event/eventtype")
      , d = (e("../../lang/index"),
        e("../../lib/hls/hlsparse"),
        e("../../lib/object"),
        e("../../lib/dom"))
      , p = e("../../lib/event")
      , r = (e("../../lib/playerutil"),
        function (l) {
          this.progressMarkers = [],
            this._player = l;
          var u = this;
          l.on(c.Private.ProgressMarkerLoaded, function (e) {
            var t = e.paramData;
            t && 0 < t.length && (u.progressMarkers = t)
          });
          var i = function () {
            var e = document.querySelector("#" + l.id() + " .prism-progress-marker");
            if (e) {
              e.innerHTML = "";
              var n = u._player.getDuration();
              if (0 < n) {
                for (var t = 0; t < u.progressMarkers.length; t++) {
                  var i = u.progressMarkers[t];
                  if (void 0 !== i.offset && "" !== i.offset) {
                    var r = document.createElement("div");
                    d.addClass(r, "prism-marker-dot");
                    var o = u.progressMarkers[t].offset / n;
                    r.style.left = 100 * o + "%",
                      e.appendChild(r);
                    var a = function (e, t) {
                      return function () {
                        u._player.trigger(c.Private.MarkerTextShow, {
                          left: e,
                          progressMarker: t
                        })
                      }
                    }(o, u.progressMarkers[t]);
                    p.on(r, "mouseover", a),
                      p.on(r, "mouseout", function (e) {
                        u._player.trigger(c.Private.MarkerTextHide)
                      }),
                      p.on(r, "touchstart", a),
                      p.on(r, "mousemove", function (e) {
                        e.preventDefault()
                      }),
                      p.on(r, "touchmove", function (e) {
                        e.preventDefault()
                      })
                  }
                }
                var s = document.querySelector("#" + u._player.id() + " .prism-progress-cursor");
                u._player.on(s, "click", function (e) {
                  for (var t = u._player.getCurrentTime(), i = 0; i < u.progressMarkers.length; i++) {
                    var r = u.progressMarkers[i];
                    if (r && (t - 1 < r.offset && r.offset < t + 1)) {
                      var o = r.offset / n * 100 + "%";
                      u._player.trigger(c.Private.MarkerTextShow, {
                        left: o,
                        progressMarker: r
                      })
                    }
                  }
                })
              }
            }
          };
          l.on(c.Private.ProgressMarkerChanged, function (e) {
            var t = e.paramData;
            t && 0 < t.length && (u.progressMarkers = t,
              i())
          }),
            l.on(c.Video.LoadedMetadata, i)
        }
      );
    r.prototype.dispose = function () {
      this._player = null,
        this.progressMarkers = []
    }
      ,
      t.exports = r
  }
    , {
    "../../lang/index": 11,
    "../../lib/dom": 18,
    "../../lib/event": 19,
    "../../lib/hls/hlsparse": 23,
    "../../lib/object": 26,
    "../../lib/playerutil": 29,
    "../base/event/eventtype": 43
  }],
  91: [function (e, t, i) {
    var l = e("../base/event/eventtype")
      , u = e("../../lang/index")
      , r = e("../../lib/hls/hlsparse")
      , c = e("../../lib/object")
      , o = e("../../lib/playerutil")
      , n = function (a) {
        this.levels = [],
          this._player = a;
        var s = this;
        a.on(l.Player.LevelsLoaded, function (e) {
          if (0 < s.levels.length && (s.levels = []),
            (e = e.paramData) && e.levels) {
            for (var t = e.levels.length - 1; -1 < t; t--) {
              var i = e.levels[t];
              if (i.url && 0 < i.url.length && i.attrs && i.attrs.BANDWIDTH) {
                var r = i.url;
                c.isArray(r) && (r = r[0]);
                var o = {
                  Url: r,
                  desc: i.height || i.width,
                  bitrate: i.bitrate,
                  resolution: i.attrs.RESOLUTION,
                  bandwidth: i.attrs.BANDWIDTH
                };
                s.levels.push(o)
              }
            }
            if (0 < s.levels.length) {
              var n = u.get("Auto");
              s.levels.push({
                Url: e.url,
                desc: n
              }),
                a.trigger(l.Private.SelectorUpdateList, {
                  type: "quality",
                  text: n
                })
            }
          }
        }),
          a.on(l.Video.LoadStart, function () {
            if (a._options) {
              var e = a._options.source;
              !a._hls && e && o.isHls(e) && s.loadLevels(e)
            }
          })
      };
    (n.prototype = {
      loadLevels: function (e) {
        var t = new r
          , i = this;
        t.load(e, function (e) {
          i._player.trigger(l.Player.LevelsLoaded, e)
        })
      }
    }).dispose = function () {
      this._player = null
    }
      ,
      t.exports = n
  }
    , {
    "../../lang/index": 11,
    "../../lib/hls/hlsparse": 23,
    "../../lib/object": 26,
    "../../lib/playerutil": 29,
    "../base/event/eventtype": 43
  }],
  92: [function (e, t, i) {
    var r = e("../../lib/io")
      , o = e("../../lib/url")
      , n = e("../../lib/vtt/thumbnailvtt")
      , a = e("../base/event/eventtype")
      , s = function (e) {
        this._player = e,
          this.cues = [],
          this.baseUrl = "";
        var t = this;
        e.on(a.Private.ChangeURL, function () {
          t.cues = [],
            t.baseUrl = ""
        })
      };
    (s.prototype = {
      get: function (e) {
        var t = this;
        this.baseUrl = function (e) {
          var t = o.parseUrl(e);
          if (t) {
            var i = t.segments;
            if (i && 0 < i.length) {
              var r = i[i.length - 1];
              baseUrl = e.replace(r, "")
            }
          }
          return baseUrl
        }(e),
          r.get(e, function (e) {
            e && n.parse(e, function (e) {
              t.cues = e,
                t._player.trigger(a.Private.ThumbnailLoaded, e)
            })
          }, function (e) {
            console.log(e)
          })
      },
      findAvailableCue: function (e) {
        for (var t = this.cues.length, i = 0; i < t; i++) {
          var r = this.cues[i];
          if (r.startTime <= e && e < r.endTime)
            return r
        }
        return null
      },
      makeUrl: function (e) {
        return -1 == e.indexOf("://") && (e = this.baseUrl + e),
          e
      }
    }).dispose = function () {
      this._player = null
    }
      ,
      t.exports = s
  }
    , {
    "../../lib/io": 24,
    "../../lib/url": 32,
    "../../lib/vtt/thumbnailvtt": 34,
    "../base/event/eventtype": 43
  }],
  93: [function (e, t, i) {
    var a = e("../base/player")
      , s = e("../hls/hlsinjector")
      , r = e("../../lib/io")
      , o = a.extend({
        init: function (e, t) {
          a.call(this, e, t),
            this.loadVideoInfo()
        }
      });
    o.prototype.loadVideoInfo = function (i) {
      this.trigger("error_hide");
      var o = this._options.vid
        , n = this;
      if (!o)
        throw new Error("PrismPlayer Error: vid should not be null!");
      r.jsonp("//tv.taobao.com/player/json/getBaseVideoInfo.do?vid=" + o + "&playerType=3", function (e) {
        if (1 !== e.status || !e.data.source)
          throw new Error("PrismPlayer Error: #vid:" + o + " cannot find video resource!");
        var t, r = -1;
        _.each(e.data.source, function (e, t) {
          var i = +e.substring(1);
          r < i && (r = i)
        }),
          t = e.data.source["v" + r],
          t = _.unescape(t),
          n._options.source = t,
          s.inject(n, TaobaoTVPlayer, a.prototype, n._options),
          n.initPlay(),
          i && i()
      }, function () {
        throw new Error("PrismPlayer Error: network error!")
      })
    }
      ,
      o.prototype.loadByVid = function (e) {
        this._options.vid = e;
        var t = this;
        if (!e)
          throw new Error("PrismPlayer Error: vid should not be null!");
        this._monitor && this._monitor.updateVideoInfo({
          video_id: e,
          album_id: data.data.baseInfo.aid,
          source: src,
          from: t._options.from
        }),
          this._options.autoplay = !0,
          this.loadVideoInfo(function () {
            t.cover && t._options.autoplay && (Dom.css(t.cover, "display", "none"),
              delete t.cover),
              t.tag.play()
          })
      }
      ,
      t.exports = o
  }
    , {
    "../../lib/io": 24,
    "../base/player": 62,
    "../hls/hlsinjector": 73
  }],
  94: [function (e, t, i) {
    var r = e("../lib/oo")
      , o = e("../lib/data")
      , a = e("../lib/object")
      , n = e("../lib/dom")
      , s = e("../lib/event")
      , l = e("../lib/function")
      , u = e("../lib/layout")
      , c = (e("../lib/constants"),
        e("../lib/util"),
        e("../player/base/event/eventtype"))
      , d = e("./component/util")
      , p = r.extend({
        init: function (e, t) {
          var i = this;
          this._player = e,
            this._eventState = "",
            this._options = a.copy(t),
            this._el = this.createEl();
          var r = e.id;
          "function" == typeof e.id && (r = e.id()),
            this._id = r + "_component_" + o.guid(),
            this._children = [],
            this._childIndex = {},
            this._player.on(c.Private.UiH5Ready, function () {
              i.renderUI(),
                i.syncUI(),
                i.bindEvent()
            })
        }
      });
    p.prototype.renderUI = function () {
      u.render(this.el(), this.options()),
        this.el().id = this.id()
    }
      ,
      p.prototype.syncUI = function () { }
      ,
      p.prototype.bindEvent = function () { }
      ,
      p.prototype.createEl = function (e, t) {
        return n.createEl(e, t)
      }
      ,
      p.prototype.options = function (e) {
        return void 0 === e ? this._options : this._options = a.merge(this._options, e)
      }
      ,
      p.prototype.el = function () {
        return this._el
      }
      ,
      p.prototype._contentEl,
      p.prototype.player = function () {
        return this._player
      }
      ,
      p.prototype.contentEl = function () {
        return this._contentEl || this._el
      }
      ,
      p.prototype._id,
      p.prototype.id = function () {
        return this._id
      }
      ,
      p.prototype.getId = function () {
        return this._id
      }
      ,
      p.prototype.addChild = function (e, t) {
        var i;
        if ("string" == typeof e) {
          if (!this._player.UI[e])
            return;
          i = new this._player.UI[e](this._player, t)
        } else
          i = e;
        if (this._children.push(i),
          "function" == typeof i.id && (this._childIndex[i.id()] = i),
          "function" == typeof i.el && i.el()) {
          var r = i.el();
          r.id = i.id(),
            this.contentEl().appendChild(r)
        }
        return i
      }
      ,
      p.prototype.removeChild = function (e) {
        if (e && this._children) {
          for (var t = !1, i = this._children.length - 1; 0 <= i; i--)
            if (this._children[i] === e) {
              t = !0,
                this._children.splice(i, 1);
              break
            }
          if (t) {
            this._childIndex[e.id] = null;
            var r = e.el();
            r && r.parentNode === this.contentEl() && this.contentEl().removeChild(e.el())
          }
        }
      }
      ,
      p.prototype.initChildren = function () {
        var i, e, t, r, o;
        if (e = (i = this).options().children)
          if (a.isArray(e))
            for (var n = 0; n < e.length; n++)
              o = "string" == typeof (t = e[n]) ? (r = t,
                {}) : (r = t.name,
                  t),
                i.addChild(r, o);
          else
            a.each(e, function (e, t) {
              !1 !== t && i.addChild(e, t)
            })
      }
      ,
      p.prototype.on = function (e, t) {
        return s.on(this._el, e, l.bind(this, t)),
          this
      }
      ,
      p.prototype.off = function (e, t) {
        return s.off(this._el, e, t),
          this
      }
      ,
      p.prototype.one = function (e, t) {
        return s.one(this._el, e, l.bind(this, t)),
          this
      }
      ,
      p.prototype.trigger = function (e, t) {
        if (this._el)
          return (t || 0 == t) && (this._el.paramData = t),
            this._eventState = e,
            s.trigger(this._el, e),
            this
      }
      ,
      p.prototype.off = function (e) {
        return s.off(this._el, e),
          this
      }
      ,
      p.prototype.addClass = function (e) {
        return n.addClass(this._el, e),
          this
      }
      ,
      p.prototype.removeClass = function (e) {
        return n.removeClass(this._el, e),
          this
      }
      ,
      p.prototype.show = function () {
        return this._el.style.display = "block",
          this
      }
      ,
      p.prototype.hide = function () {
        return this._el.style.display = "none",
          this
      }
      ,
      p.prototype.destroy = function () {
        if (this.trigger({
          type: "destroy",
          bubbles: !1
        }),
          this._children)
          for (var e = this._children.length - 1; 0 <= e; e--)
            this._children[e].destroy && this._children[e].destroy();
        "function" == typeof this.disposeUI && this.disposeUI(),
          this.children_ = null,
          this.childIndex_ = null,
          this.off(),
          this._el.parentNode && this._el.id != this._player.id() && this._el.parentNode.removeChild(this._el),
          o.removeData(this._el),
          this._el = null
      }
      ,
      p.prototype.registerControlBarTooltip = d.registerTooltipEvent,
      t.exports = p
  }
    , {
    "../lib/constants": 15,
    "../lib/data": 17,
    "../lib/dom": 18,
    "../lib/event": 19,
    "../lib/function": 20,
    "../lib/layout": 25,
    "../lib/object": 26,
    "../lib/oo": 27,
    "../lib/util": 33,
    "../player/base/event/eventtype": 43,
    "./component/util": 121
  }],
  95: [function (e, t, i) {
    var r = e("../component")
      , o = e("../../lib/dom")
      , n = e("../../lib/event")
      , a = e("../../player/base/event/eventtype")
      , s = e("../../player/base/plugin/status")
      , l = r.extend({
        init: function (e, t) {
          r.call(this, e, t),
            this.addClass(t.className || "prism-big-play-btn")
        },
        createEl: function () {
          var e = r.prototype.createEl.call(this, "div");
          return e.innerHTML = '<div class="outter"></div>',
            e
        },
        bindEvent: function () {
          var t = this;
          this._player.on(a.Player.Play, function () {
            t.addClass("playing"),
              t.removeClass("pause"),
              t._hide()
          }),
            this._player.on(a.Player.Pause, function () {
              if (!t._player._switchSourcing) {
                t.removeClass("playing"),
                  t.addClass("pause");
                var e = t._player._status;
                e != s.ended && e != s.error && e != s.playing && t._show()
              }
            });
          var e = document.querySelector("#" + t.id() + " .outter");
          n.on(this.el(), "mouseover", function () {
            o.addClass(e, "big-playbtn-hover-animation")
          }),
            n.on(this.el(), "mouseout", function () {
              o.removeClass(e, "big-playbtn-hover-animation")
            }),
            this.on(a.Private.PlayClick, function () {
              if (t._player.paused()) {
                var e = t._player.getCurrentTime();
                (t._player.getDuration() <= e || t._player._ended || t._player.exceedPreviewTime(e)) && t._player.seek(0),
                  t._player.play(!0)
              } else
                t._player.pause(!0)
            }),
            this._player.on(a.Private.Play_Btn_Show, function () {
              t._show()
            }),
            this._player.on(a.Private.Play_Btn_Hide, function () {
              t._hide()
            })
        },
        _show: function () {
          o.css(this.el(), "display", "block")
        },
        _hide: function () {
          o.css(this.el(), "display", "none")
        }
      });
    t.exports = l
  }
    , {
    "../../lib/dom": 18,
    "../../lib/event": 19,
    "../../player/base/event/eventtype": 43,
    "../../player/base/plugin/status": 66,
    "../component": 94
  }],
  96: [function (e, t, i) {
    var r = e("../component")
      , o = e("../../lib/dom")
      , n = e("./util")
      , a = e("../../lang/index")
      , s = e("../../player/base/event/eventtype")
      , l = r.extend({
        init: function (e, t) {
          this.isOpened = !1,
            r.call(this, e, t),
            this.addClass(t.className || "prism-cc-btn")
        },
        createEl: function () {
          return r.prototype.createEl.call(this, "div")
        },
        bindEvent: function () {
          var i = this;
          this.on("click", function () {
            o.addClass(i._el, "disabled");
            var e = "on"
              , t = "";
            i.isOpened ? (i._player._ccService.close(),
              e = "off") : t = i._player._ccService.open(),
              i.isOpened = !i.isOpened,
              i._player.trigger(s.Private.CCStateChanged, {
                value: e,
                lang: t
              }),
              i.disabledHandler && clearTimeout(i.disabledHandler),
              i.disabledHandler = setTimeout(function () {
                o.removeClass(i._el, "disabled")
              }, 1e3),
              i._player.trigger(s.Private.MarkerTextHide)
          }),
            this._player.on(s.Private.CCChanged, function (e) {
              var t = e.paramData;
              i.isOpened = "off" != t
            }),
            n.registerTooltipEvent.call(this, this.el(), function () {
              return i.isOpened ? a.get("CloseSubtitle") : a.get("OpenSubtitle")
            })
        },
        disposeUI: function () {
          this.disabledHandler && (clearTimeout(this.disabledHandler),
            this.disabledHandler = null)
        }
      });
    t.exports = l
  }
    , {
    "../../lang/index": 11,
    "../../lib/dom": 18,
    "../../player/base/event/eventtype": 43,
    "../component": 94,
    "./util": 121
  }],
  97: [function (e, t, i) {
    var r = e("../component")
      , n = e("../../player/base/event/eventtype")
      , a = e("../../lib/event")
      , s = e("../../lib/dom")
      , o = r.extend({
        init: function (e, t) {
          r.call(this, e, t),
            this.addClass(t.className || "prism-controlbar"),
            this.initChildren(),
            this.onEvent()
        },
        createEl: function () {
          var e = r.prototype.createEl.call(this);
          return e.innerHTML = '<div class="prism-controlbar-bg"></div>',
            e
        },
        onEvent: function () {
          var i = this.player()
            , e = i.options()
            , r = this;
          a.on(this._el, "mouseover", function () {
            var e = document.querySelector("#" + r.id() + " .prism-progress-cursor");
            s.css(e, "display", "block")
          }),
            a.on(this._el, "mouseout", function (e) {
              var t = document.querySelector("#" + r.id() + " .prism-progress-cursor");
              s.css(t, "display", "none"),
                i.trigger(n.Private.ThumbnailHide)
            }),
            this.timer = null;
          var t = e.controlBarVisibility;
          if (1 == e.controlBarForOver && (t = "hover"),
            "hover" == t) {
            r.hide();
            var o = function () {
              r._hideHandler && clearTimeout(r._hideHandler),
                r._show(),
                i.fullscreenService.getIsFullScreen() && r._hide()
            };
            i.on(n.Private.MouseOver, function () {
              o()
            }),
              a.on(this._player.tag, "click", function (e) {
                e && e.target == e.currentTarget && o()
              }),
              a.on(this._player.tag, "touchstart", function (e) {
                e && e.target == e.currentTarget && o()
              }),
              i.on(n.Private.MouseOut, function () {
                r._hideHandler = setTimeout(function () {
                  r.hide(),
                    i.trigger(n.Private.HideBar),
                    i.trigger(n.Private.VolumeVisibilityChange, ""),
                    i.trigger(n.Private.SettingListHide)
                })
              })
          } else
            "click" == t ? (i.on(n.Private.Click, function (e) {
              i._isError || (e.preventDefault(),
                e.stopPropagation(),
                r._show(),
                r._hide())
            }),
              i.on(n.Player.Ready, function () {
                r._hide()
              }),
              i.on(n.Private.TouchStart, function () {
                r._show()
              }),
              i.on(n.Private.TouchMove, function () {
                r._show()
              }),
              i.on(n.Private.TouchEnd, function () {
                r._hide()
              })) : r._show()
        },
        _show: function () {
          this.show(),
            this._player.trigger(n.Private.ShowBar),
            this.timer && (clearTimeout(this.timer),
              this.timer = null)
        },
        _hide: function () {
          var e = this
            , t = this.player().options().showBarTime;
          this.timer = setTimeout(function () {
            e.hide(),
              e._player.trigger(n.Private.HideBar),
              e._player.trigger(n.Private.VolumeVisibilityChange, ""),
              e._player.trigger(n.Private.SettingListHide)
          }, t)
        },
        disposeUI: function () {
          this.timer && (clearTimeout(this.timer),
            this.timer = null),
            this._hideHandler && (clearTimeout(this._hideHandler),
              this._hideHandler = null)
        }
      });
    t.exports = o
  }
    , {
    "../../lib/dom": 18,
    "../../lib/event": 19,
    "../../player/base/event/eventtype": 43,
    "../component": 94
  }],
  98: [function (e, t, i) {
    var r = e("../component")
      , o = e("../../lib/dom")
      , n = e("../../player/base/event/eventtype")
      , a = r.extend({
        init: function (e, t) {
          r.call(this, e, t),
            this.addClass(t.className || "prism-cover")
        },
        createEl: function () {
          var e = r.prototype.createEl.call(this, "div")
            , t = this.options().cover;
          return t ? e.style.backgroundImage = "url(" + t + ")" : o.css(e, "display", "none"),
            e
        },
        _hide: function (e) {
          var t = document.querySelector("#" + this.id() + " .prism-cover");
          t && o.css(t, "display", "none")
        },
        _show: function (e) {
          var t = document.querySelector("#" + this.id() + " .prism-cover");
          t && o.css(t, "display", "block")
        },
        bindEvent: function () {
          this._player.on(n.Private.Cover_Show, this._show),
            this._player.on(n.Private.Cover_Hide, this._hide)
        }
      });
    t.exports = a
  }
    , {
    "../../lib/dom": 18,
    "../../player/base/event/eventtype": 43,
    "../component": 94
  }],
  99: [function (e, t, i) {
    var r = e("../component")
      , h = e("../../lib/util")
      , f = e("../../lib/dom")
      , o = e("../../lib/event")
      , n = e("../../lib/ua")
      , _ = e("../../lang/index")
      , a = e("../../player/base/event/eventtype")
      , s = r.extend({
        init: function (e, t) {
          r.call(this, e, t),
            this.className = t.className ? t.className : "prism-ErrorMessage",
            this.addClass(this.className)
        },
        createEl: function () {
          var e = r.prototype.createEl.call(this, "div");
          return e.innerHTML = "<div class='prism-error-content'><p></p></div><div class='prism-error-operation'><a class='prism-button prism-button-refresh'>" + _.get("Refresh_Text") + "</a><a class='prism-button prism-button-retry'  target='_blank'>" + _.get("Retry") + "</a><a class='prism-button prism-button-orange'  target='_blank'>" + _.get("Detection_Text") + "</a></div><div class='prism-detect-info prism-center'><p class='errorCode'><span class='info-label'>code\uff1a</span><span class='info-content'></span></p><p class='vid'><span class='info-label'>vid:</span><span class='info-content'></span></p><p class='uuid'><span class='info-label'>uuid:</span><span class='info-content'></span></p><p class='requestId'><span class='info-label'>requestId:</span><span class='info-content'></span></p><p class='dateTime'><span class='info-label'>" + _.get("Play_DateTime") + "\uff1a</span><span class='info-content'></span></p></div>",
            e
        },
        bindEvent: function () {
          var i = this;
          i._player.on(a.Private.Error_Show, function (e) {
            var t = null;
            i._player.getMonitorInfo && (t = i._player.getMonitorInfo()),
              i._show(e, t)
          }),
            i._player.on(a.Private.Error_Hide, function () {
              i._hide()
            });
          var e = document.querySelector("#" + i.id() + " .prism-button-refresh");
          if (o.on(e, "click", function () {
            location.reload(!0)
          }),
            n.IS_MOBILE) {
            e = document.querySelector("#" + i.id() + " .prism-detect-info");
            f.addClass(e, "prism-width90")
          }
          var t = document.querySelector("#" + i.id() + " .prism-button-retry");
          o.on(t, "click", function () {
            var e = i._player.getCurrentTime()
              , t = i._player._options.source;
            i._player._setDefaultCC = !0,
              i._player._loadByUrlInner(t, e, !0)
          })
        },
        _show: function (e, t) {
          var i = e.paramData
            , r = ""
            , o = "";
          i.mediaId && (r = i.mediaId);
          var n = document.querySelector("#" + this.id() + " .prism-button-orange");
          if (n) {
            if (t && this._player._options.diagnosisButtonVisible) {
              t.vu ? o = decodeURIComponent(t.vu) : f.css(n, "display", "none");
              var a = "//player.alicdn.com/detection.html?from=h5&vid=" + r + "&source=" + (o ? encodeURIComponent(o) : "") + "&uuid=" + t.uuid + "&lang=" + _.getCurrentLanguage();
              n && (n.href = a)
            } else
              f.css(n, "display", "none");
            var s = i.display_msg || i.error_msg;
            document.querySelector("#" + this.id() + " .prism-error-content p").innerHTML = s,
              document.querySelector("#" + this.id() + " .errorCode .info-content").innerText = i.error_code;
            var l = document.querySelector("#" + this.id() + " .vid");
            if (i.mediaId ? (f.css(l, "display", "block"),
              document.querySelector("#" + this.id() + " .vid .info-content").innerText = i.mediaId) : f.css(l, "display", "none"),
              i.uuid)
              document.querySelector("#" + this.id() + " .uuid .info-content").innerText = i.uuid;
            else {
              var u = document.querySelector("#" + this.id() + " .uuid");
              f.css(u, "display", "none")
            }
            if (i.requestId)
              document.querySelector("#" + this.id() + " .requestId .info-content").innerText = i.requestId;
            else {
              var c = document.querySelector("#" + this.id() + " .requestId");
              f.css(c, "display", "none")
            }
            document.querySelector("#" + this.id() + " .dateTime .info-content").innerText = h.formatDate(new Date, "yyyy-MM-dd HH:mm:ss");
            var d = document.querySelector("#" + this.id());
            f.css(d, "display", "block");
            var p = this;
            p.playHideHandler && clearTimeout(p.playHideHandler),
              p.playHideHandler = setTimeout(function () {
                p._player.trigger("play_btn_hide")
              })
          }
        },
        _hide: function () {
          var e = document.querySelector("#" + this.id());
          f.css(e, "display", "none")
        },
        disposeUI: function () {
          this.playHideHandler && (clearTimeout(this.playHideHandler),
            this.playHideHandler = null)
        }
      });
    t.exports = s
  }
    , {
    "../../lang/index": 11,
    "../../lib/dom": 18,
    "../../lib/event": 19,
    "../../lib/ua": 31,
    "../../lib/util": 33,
    "../../player/base/event/eventtype": 43,
    "../component": 94
  }],
  100: [function (e, t, i) {
    var r = e("../component")
      , o = e("../../player/base/event/eventtype")
      , n = (e("../../lib/event"),
        e("../../lib/ua"))
      , a = e("../../lang/index")
      , s = e("./util")
      , l = r.extend({
        init: function (e, t) {
          r.call(this, e, t),
            this.addClass(t.className || "prism-fullscreen-btn")
        },
        bindEvent: function () {
          var e = this;
          this._player.on(o.Player.RequestFullScreen, function () {
            n.IS_IOS || e.addClass("fullscreen")
          }),
            this._player.on(o.Player.CancelFullScreen, function () {
              e.removeClass("fullscreen")
            }),
            s.registerTooltipEvent.call(this, this.el(), function () {
              return e._player.fullscreenService.getIsFullScreen() ? a.get("ExistFullScreen") : a.get("Fullscreen")
            }),
            this.on("click", function () {
              e._player.fullscreenService.getIsFullScreen() ? e._player.fullscreenService.cancelFullScreen() : e._player.fullscreenService.requestFullScreen(),
                e._player.trigger(o.Private.MarkerTextHide)
            })
        }
      });
    t.exports = l
  }
    , {
    "../../lang/index": 11,
    "../../lib/event": 19,
    "../../lib/ua": 31,
    "../../player/base/event/eventtype": 43,
    "../component": 94,
    "./util": 121
  }],
  101: [function (e, t, i) {
    "use strict";
    var r = e("../component")
      , o = e("../../lib/dom")
      , n = e("../../player/base/event/eventtype")
      , a = r.extend({
        init: function (e, t) {
          r.call(this, e, t),
            this.addClass(t.className || "prism-hide")
        },
        createEl: function () {
          var e = r.prototype.createEl.call(this, "div");
          return e.innerHTML = '<div class="circle"></div> <div class="circle1"></div>',
            e
        },
        _loading_hide: function (e) {
          var t = document.querySelector("#" + this.id() + " .prism-loading");
          t && (o.removeClass(t, "prism-loading"),
            o.addClass(t, "prism-hide"))
        },
        _loading_show: function (e) {
          var t = document.querySelector("#" + this.id() + " .prism-hide");
          t && (o.removeClass(t, "prism-hide"),
            o.addClass(t, "prism-loading"))
        },
        bindEvent: function () {
          this._player.on(n.Private.H5_Loading_Show, this._loading_show),
            this._player.on(n.Private.H5_Loading_Hide, this._loading_hide)
        }
      });
    t.exports = a
  }
    , {
    "../../lib/dom": 18,
    "../../player/base/event/eventtype": 43,
    "../component": 94
  }],
  102: [function (e, t, i) {
    var r = e("../component")
      , o = (e("../../lib/util"),
        e("../../lib/dom"))
      , n = (e("../../lib/event"),
        e("../../lib/ua"),
        e("../../lang/index"),
        e("../../player/base/event/eventtype"))
      , a = r.extend({
        init: function (e, t) {
          r.call(this, e, t),
            this.className = t.className ? t.className : "prism-info-display",
            this.addClass(this.className)
        },
        createEl: function () {
          return r.prototype.createEl.call(this, "p")
        },
        bindEvent: function () {
          var r = this;
          r._player.on(n.Private.Info_Show, function (e) {
            var t = document.querySelector("#" + r.id())
              , i = e.paramData;
            i && (void 0 !== i.text && i.text ? (t.innerHTML = i.text,
              void 0 !== i.duration && i.duration && (r.handler && clearTimeout(r.handler),
                r.handler = setTimeout(function () {
                  o.css(t, "display", "none")
                }, i.duration)),
              "lb" == i.align ? (o.addClass(t, "prism-info-left-bottom"),
                o.removeClass(t, "prism-info-top-center")) : "tc" == i.align ? (o.addClass(t, "prism-info-top-center"),
                  o.removeClass(t, "prism-info-left-bottom")) : (o.removeClass(t, "prism-info-left-bottom"),
                    o.removeClass(t, "prism-info-top-center")),
              i.isBlack ? o.addClass(t, "prism-info-black") : o.removeClass(t, "prism-info-black")) : t.innerHTML = i,
              o.css(t, "display", "block"))
          }),
            r._player.on(n.Private.Info_Hide, function (e) {
              var t = document.querySelector("#" + r.id());
              o.css(t, "display", "none")
            })
        },
        disposeUI: function () {
          this.handler && (clearTimeout(this.handler),
            this.handler = null)
        }
      });
    t.exports = a
  }
    , {
    "../../lang/index": 11,
    "../../lib/dom": 18,
    "../../lib/event": 19,
    "../../lib/ua": 31,
    "../../lib/util": 33,
    "../../player/base/event/eventtype": 43,
    "../component": 94
  }],
  103: [function (e, t, i) {
    var r = e("../component")
      , o = e("./util")
      , n = (e("../../lib/util"),
        e("../../lib/dom"))
      , a = e("../../lib/event")
      , s = e("../../lib/playerUtil")
      , l = e("../../lang/index")
      , u = r.extend({
        init: function (e, t) {
          r.call(this, e, t),
            this.className = t.className ? t.className : "prism-live-display",
            this.addClass(this.className)
        },
        createEl: function () {
          var e = r.prototype.createEl.call(this, "p");
          return e.innerText = "LIVE",
            s.isLiveShift(this._player._options) && n.addClass(e, "live-shift-display"),
            e
        },
        bindEvent: function () {
          var e = document.querySelector("#" + this.id())
            , t = this;
          s.isLiveShift(this._player._options) && (a.on(e, "click", function () {
            t._player._liveshiftService.switchToLive()
          }),
            o.registerTooltipEvent.call(this, this.el(), l.get("SwitchToLive")))
        }
      });
    t.exports = u
  }
    , {
    "../../lang/index": 11,
    "../../lib/dom": 18,
    "../../lib/event": 19,
    "../../lib/playerUtil": 28,
    "../../lib/util": 33,
    "../component": 94,
    "./util": 121
  }],
  104: [function (e, t, i) {
    var r = e("../component")
      , o = (e("../../lib/dom"),
        e("../../lib/event"),
        e("../../player/base/event/eventtype"))
      , n = e("../../player/base/plugin/status")
      , a = r.extend({
        init: function (e, t) {
          r.call(this, e, t),
            this.addClass(t.className || "prism-animation")
        },
        bindEvent: function () {
          var t = this;
          this._player.on(o.Player.Play, function () {
            t._player._isManualPlay && (t.removeClass("prism-pause-animation"),
              t.addClass("prism-play-animation"),
              t.removeClass("play-apply-animation"),
              t.playHandler && clearTimeout(t.playHandler),
              t.playHandler = setTimeout(function () {
                t.addClass("play-apply-animation")
              }))
          }),
            this._player.on(o.Player.Pause, function () {
              var e = t._player._status;
              e != n.ended && e != n.error && t._player._isManualPause && (t.removeClass("prism-play-animation"),
                t.addClass("prism-pause-animation"),
                t.removeClass("play-apply-animation"),
                t.pauseHandler && clearTimeout(t.pauseHandler),
                t.pauseHandler = setTimeout(function () {
                  t.addClass("play-apply-animation")
                }))
            })
        },
        disposeUI: function () {
          this.playHandler && (clearTimeout(this.playHandler),
            this.playHandler = null),
            this.pauseHandler && (clearTimeout(this.pauseHandler),
              this.pauseHandler = null)
        }
      });
    t.exports = a
  }
    , {
    "../../lib/dom": 18,
    "../../lib/event": 19,
    "../../player/base/event/eventtype": 43,
    "../../player/base/plugin/status": 66,
    "../component": 94
  }],
  105: [function (e, t, i) {
    var r = e("../component")
      , o = e("../../player/base/event/eventtype")
      , n = e("./util")
      , a = e("../../lang/index")
      , s = r.extend({
        init: function (e, t) {
          r.call(this, e, t),
            this.addClass(t.className || "prism-play-btn")
        },
        bindEvent: function () {
          var t = this;
          this._player.on(o.Player.Play, function () {
            t.addClass("playing")
          }),
            this._player.on(o.Player.Pause, function () {
              t.removeClass("playing")
            }),
            this.on(o.Private.PlayClick, function () {
              if (t._player.paused()) {
                var e = t._player.getCurrentTime();
                (t._player.getDuration() <= e || t._player._ended || t._player.exceedPreviewTime(e)) && t._player.seek(0),
                  t._player.play(!0),
                  t.addClass("playing")
              } else
                t._player.pause(!0),
                  t.removeClass("playing");
              t._player.trigger(o.Private.MarkerTextHide)
            }),
            n.registerTooltipEvent.call(this, this.el(), function () {
              return t._player.paused() ? a.get("Play") : a.get("Pause")
            })
        }
      });
    t.exports = s
  }
    , {
    "../../lang/index": 11,
    "../../player/base/event/eventtype": 43,
    "../component": 94,
    "./util": 121
  }],
  106: [function (e, t, i) {
    var r = e("../component")
      , a = e("../../lib/dom")
      , n = (e("../../lib/constants"),
        e("../../lib/event"))
      , s = e("../../lib/ua")
      , l = e("../../lib/function")
      , o = e("../../lang/index")
      , u = e("../../config")
      , c = e("../../lib/util")
      , d = e("../../player/base/event/eventtype")
      , p = r.extend({
        init: function (e, t) {
          r.call(this, e, t),
            this.className = t.className ? t.className : "prism-progress",
            this.addClass(this.className)
        },
        createEl: function () {
          var e = r.prototype.createEl.call(this);
          return e.innerHTML = '<div class="prism-progress-loaded"></div><div class="prism-progress-played"></div><div class="prism-progress-marker"></div><div class="prism-progress-cursor"><img></img></div><p class="prism-progress-time"></p>',
            e
        },
        bindEvent: function () {
          var t = this;
          this.loadedNode = document.querySelector("#" + this.id() + " .prism-progress-loaded"),
            this.playedNode = document.querySelector("#" + this.id() + " .prism-progress-played"),
            this.cursorNode = document.querySelector("#" + this.id() + " .prism-progress-cursor"),
            this.timeNode = document.querySelector("#" + this.id() + " .prism-progress-time"),
            this.timeNode = document.querySelector("#" + this._player._options.id + " .prism-progress-time");
          var i = document.querySelector("#" + this.id())
            , e = document.querySelector("#" + this.id() + " .prism-progress-cursor img")
            , r = "https://" + u.domain + "/de/prismplayer/" + u.h5Version + "/skins/default/img/dragcursor.png";
          u.domain ? -1 < u.domain.indexOf("localhost") && (r = "//" + u.domain + "/build/skins/default/img/dragcursor.png") : r = "de/prismplayer/" + u.h5Version + "/skins/default/img/dragcursor.png",
            e.src = r,
            n.on(this.cursorNode, "mousedown", function (e) {
              t._onMouseDown(e)
            }),
            n.on(this.cursorNode, "touchstart", function (e) {
              t._onMouseDown(e)
            }),
            n.on(i, "mousemove", function (e) {
              t._progressMove(e)
            }),
            n.on(i, "touchmove", function (e) {
              t._progressMove(e)
            });
          var o = function (e) {
            t._progressDown = e
          };
          n.on(i, "mousedown", function (e) {
            o(!0)
          }),
            n.on(i, "touchstart", function (e) {
              o(!0)
            }),
            n.on(i, "mouseup", function (e) {
              o(!1)
            }),
            n.on(i, "touchend", function (e) {
              o(!1)
            }),
            n.on(this._el, "click", function (e) {
              t._onMouseClick(e)
            }),
            this._player.on(d.Private.HideProgress, function (e) {
              t._hideProgress(e)
            }),
            this._player.on(d.Private.CancelHideProgress, function (e) {
              t._cancelHideProgress(e)
            }),
            n.on(i, d.Private.MouseOver, function (e) {
              t._onMouseOver(e)
            }),
            n.on(i, d.Private.MouseOut, function (e) {
              t._onMouseOut(e)
            }),
            n.on(this.controlNode, d.Private.MouseLeave, function (e) {
              t._offMouseUp()
            }),
            s.IS_PC ? (n.on(i, "mouseover", function () {
              a.addClass(i, "prism-progress-hover"),
                a.addClass(t.cursorNode, "cursor-hover")
            }),
              n.on(i, "mouseout", function (e) {
                a.removeClass(i, "prism-progress-hover"),
                  a.removeClass(t.cursorNode, "cursor-hover"),
                  t._progressDown = !1
              })) : (a.addClass(i, "prism-progress-hover"),
                a.addClass(t.cursorNode, "cursor-hover")),
            this.bindTimeupdate = l.bind(this, this._onTimeupdate),
            this._player.on(d.Player.TimeUpdate, this.bindTimeupdate),
            s.IS_IPAD ? this.interval = setInterval(function () {
              t._onProgress()
            }, 500) : this._player.on(d.Video.Progress, function () {
              t._onProgress()
            })
        },
        _progressMove: function (e) {
          e.preventDefault();
          var t = this._getSeconds(e);
          if (t != 1 / 0) {
            var i = c.formatTime(t)
              , r = this._getDistance(e);
            this.cursorNode && (this._player.trigger(d.Private.ThumbnailShow, {
              time: t,
              formatTime: i,
              left: r,
              progressWidth: this.el().offsetWidth
            }),
              this._progressDown && this._onMouseMove(e))
          }
        },
        _hideProgress: function (e) {
          n.off(this.cursorNode, "mousedown"),
            n.off(this.cursorNode, "touchstart")
        },
        _cancelHideProgress: function (e) {
          var t = this;
          n.on(this.cursorNode, "mousedown", function (e) {
            t._onMouseDown(e)
          }),
            n.on(this.cursorNode, "touchstart", function (e) {
              t._onMouseDown(e)
            })
        },
        _canSeekable: function (e) {
          var t = !0;
          return "function" == typeof this._player.canSeekable && (t = this._player.canSeekable(e)),
            t
        },
        _onMouseOver: function (e) {
          this._cursorHideHandler && (clearTimeout(this._cursorHideHandler),
            this._cursorHideHandler = null),
            this._mouseInProgress || this._updateCursorPosition(this._player.getCurrentTime()),
            this._mouseInProgress = !0
        },
        _onMouseOut: function (e) {
          var t = this;
          this._cursorHideHandler && clearTimeout(this._cursorHideHandler),
            this._cursorHideHandler = setTimeout(function () {
              t._player.trigger(d.Private.ThumbnailHide),
                t._mouseInProgress = !1
            })
        },
        _getSeconds: function (e) {
          var t = this._getDistance(e)
            , i = this.el().offsetWidth
            , r = this._player.getDuration() ? t / i * this._player.getDuration() : 0;
          return r < 0 && (r = 0),
            r > this._player.getDuration() && (r = this._player.getDuration()),
            r
        },
        _getDistance: function (e) {
          for (var t = this.el().offsetLeft, i = this.el(); i = i.offsetParent;) {
            var r = a.getTranslateX(i);
            t += i.offsetLeft + r
          }
          var o = e.touches ? e.touches[0].pageX : e.pageX;
          return Math.abs(o - t)
        },
        _onMouseClick: function (e) {
          var t = this
            , i = t._getSeconds(e);
          if (t._canSeekable(i)) {
            t._player.exceedPreviewTime(i) && (i = t._player.getPreviewTime()),
              t._updateCursorPosition(i);
            this._mouseClickTimeHandle && clearTimeout(this._mouseClickTimeHandle),
              this._mouseClickTimeHandle = setTimeout(function () {
                t._player._seeking = !0,
                  t._player.trigger(d.Private.SeekStart, {
                    fromTime: t._player.getCurrentTime()
                  }),
                  t._player.seek(i),
                  t._player.trigger(d.Private.EndStart, {
                    toTime: i
                  }),
                  t._mouseClickTimeHandle = null,
                  t._inWaitingSeek = !1
              }, 300),
              this._inWaitingSeek = !0
          } else
            t._player.trigger(d.Private.Info_Show, {
              text: o.get("Can_Not_Seekable"),
              duration: 2e3
            })
        },
        _onMouseDown: function (e) {
          var t = this;
          e.preventDefault(),
            this._player.trigger(d.Private.SeekStart, {
              fromTime: this._player.getCurrentTime()
            }),
            n.on(this.controlNode, "mousemove", function (e) {
              t._onMouseMove(e)
            }),
            n.on(this.controlNode, "touchmove", function (e) {
              t._onMouseMove(e)
            }),
            n.on(this._player.tag, "mouseup", function (e) {
              t._onPlayerMouseUp(e)
            }),
            n.on(this._player.tag, "touchend", function (e) {
              t._onPlayerMouseUp(e)
            }),
            n.on(this.controlNode, "mouseup", function (e) {
              t._onControlBarMouseUp(e)
            }),
            n.on(this.controlNode, "touchend", function (e) {
              t._onControlBarMouseUp(e)
            })
        },
        _onMouseUp: function (e) {
          this._onMouseUpIntern(e)
        },
        _onControlBarMouseUp: function (e) {
          this._onMouseUpIntern(e)
        },
        _onPlayerMouseUp: function (e) {
          this._onMouseUpIntern(e)
        },
        _offMouseUp: function () {
          n.off(this.controlNode, "mousemove"),
            n.off(this.controlNode, "touchmove"),
            n.off(this._player.tag, "mouseup"),
            n.off(this._player.tag, "touchend"),
            n.off(this.controlNode, "mouseup"),
            n.off(this.controlNode, "touchend")
        },
        _onMouseUpIntern: function (e) {
          e.preventDefault(),
            this._offMouseUp();
          var t = this.playedNode.offsetWidth / this.el().offsetWidth * this._player.getDuration();
          this._player.getDuration();
          isNaN(t) || this._player.seek(t),
            this._player.trigger(d.Private.EndStart, {
              toTime: t
            })
        },
        _onMouseMove: function (e) {
          e.preventDefault();
          var t = this._getSeconds(e);
          this._player.exceedPreviewTime(t) && (t = this._player.getPreviewTime()),
            this._player.seek(t),
            this._updateProgressBar(this.playedNode, t),
            this._updateCursorPosition(t)
        },
        _onTimeupdate: function (e) {
          this._inWaitingSeek || this._player._seeking || this._progressDown || (this._updateProgressBar(this.playedNode, this._player.getCurrentTime()),
            this._updateCursorPosition(this._player.getCurrentTime()),
            this._player.trigger(d.Private.UpdateProgressBar, {
              time: this._player.getCurrentTime()
            }))
        },
        _onProgress: function (e) {
          this._player.getDuration() && 1 <= this._player.getBuffered().length && this._updateProgressBar(this.loadedNode, this._player.getBuffered().end(this._player.getBuffered().length - 1))
        },
        _updateProgressBar: function (e, t) {
          var i = this._player.getDuration();
          if (1 != this._player._switchSourcing && i) {
            var r = t / i + .005;
            1 < r && (r = 1),
              e && a.css(e, "width", 100 * r + "%")
          }
        },
        _updateCursorPosition: function (e) {
          var t = this._player.getDuration();
          if (1 != this._player._switchSourcing && t) {
            var i = 1
              , r = this._player.el().clientWidth
              , o = 10 / r
              , n = e / t - o;
            0 != r && (i = 1 - o),
              n = n < 0 ? 0 : n,
              this.cursorNode && (i < n ? (a.css(this.cursorNode, "right", "0px"),
                a.css(this.cursorNode, "left", "auto")) : (a.css(this.cursorNode, "right", "auto"),
                  a.css(this.cursorNode, "left", 100 * n + "%")))
          }
        },
        disposeUI: function () {
          this.cursorNodeHandler && (clearTimeout(this.cursorNodeHandler),
            this.cursorNodeHandler = null),
            this._cursorHideHandler && (clearTimeout(this._cursorHideHandler),
              this._cursorHideHandler = null),
            this._mouseClickTimeHandle && (clearTimeout(this._mouseClickTimeHandle),
              this._mouseClickTimeHandle = null)
        }
      });
    t.exports = p
  }
    , {
    "../../config": 5,
    "../../lang/index": 11,
    "../../lib/constants": 15,
    "../../lib/dom": 18,
    "../../lib/event": 19,
    "../../lib/function": 20,
    "../../lib/ua": 31,
    "../../lib/util": 33,
    "../../player/base/event/eventtype": 43,
    "../component": 94
  }],
  107: [function (e, t, i) {
    var r = e("../component")
      , o = (e("../../lib/util"),
        e("../../lib/dom"))
      , n = e("../../lib/event")
      , a = e("../../player/base/event/eventtype")
      , s = r.extend({
        init: function (e, t) {
          r.call(this, e, t),
            this.className = t.className ? t.className : "prism-marker-text",
            this.addClass(this.className)
        },
        createEl: function () {
          var e = r.prototype.createEl.call(this, "div");
          return e.innerHTML = "<p></p>",
            e
        },
        bindEvent: function () {
          var r = this;
          r._player.on(a.Private.MarkerTextShow, function (e) {
            var t = e.paramData
              , i = a.Player.MarkerDotOver;
            if (r._player.trigger(i, e.paramData),
              t.progressMarker.isCustomized)
              r._player.trigger(a.Private.LifeCycleChanged, {
                type: i,
                data: e.paramData
              });
            else {
              r._thumbnailShowHanlde && (o.css(r.el(), "display", "none"),
                clearTimeout(r._thumbnailShowHanlde)),
                r._thumbnailShowHanlde = setTimeout(function () {
                  if (document.querySelector("#" + r.id() + " p").innerText = t.progressMarker.text || "",
                    t) {
                    o.css(r.el(), "display", "block");
                    var e = r._player.el().offsetWidth;
                    left = e * t.left,
                      width = r.el().offsetWidth,
                      left + width > e ? (o.css(r.el(), "right", "0px"),
                        o.css(r.el(), "left", "auto")) : (left -= width / 2,
                          left = left < 0 ? 0 : left,
                          o.css(r.el(), "right", "auto"),
                          o.css(r.el(), "left", left + "px"))
                  }
                }, 30)
            }
          }),
            r._player.on(a.Private.MarkerTextHide, function (e) {
              r._player.trigger(a.Player.MarkerDotOut),
                r._player.trigger(a.Private.LifeCycleChanged, {
                  type: a.Player.MarkerDotOut,
                  data: ""
                }),
                r._thumbnailShowHanlde && clearTimeout(r._thumbnailShowHanlde),
                o.css(r.el(), "display", "none")
            }),
            n.on(r._player.tag, "click", function (e) {
              e && e.target == e.currentTarget && r._player.trigger(a.Private.MarkerTextHide)
            }),
            n.on(r._player.tag, "touchstart", function (e) {
              e && e.target == e.currentTarget && r._player.trigger(a.Private.MarkerTextHide)
            })
        },
        disposeUI: function () {
          this._thumbnailShowHanlde && (clearTimeout(this._thumbnailShowHanlde),
            this._thumbnailShowHanlde = null)
        }
      });
    t.exports = s
  }
    , {
    "../../lib/dom": 18,
    "../../lib/event": 19,
    "../../lib/util": 33,
    "../../player/base/event/eventtype": 43,
    "../component": 94
  }],
  108: [function (e, t, i) {
    var r = e("./selector")
      , s = e("../../../lib/object")
      , u = (e("../../../lib/util"),
        e("../../../lib/cookie"))
      , l = e("../../../lib/dom")
      , c = (e("../../../lib/event"),
        e("../../../lib/constants"))
      , d = e("../../../lang/index")
      , p = e("../../../player/base/event/eventtype")
      , o = r.extend({
        init: function (e, t) {
          this.Name = d.get("Quality"),
            this.Type = "quality",
            this.Tooltip = d.get("Quality_Switch_To"),
            r.call(this, e, t),
            this._isMasterLevel = !1
        },
        showTip: function (e, t) {
          this._player.trigger(p.Private.Info_Show, {
            text: e,
            duration: t,
            align: "lb"
          })
        },
        bindEvent: function () {
          this.bindCommonEvent();
          var s = this;
          this._player.on(p.Private.QualityChange, function (e) {
            var t = s._player._urls
              , i = e.paramData;
            if (i.levelSwitch) {
              var r = i.desc;
              s._autoSWitchDesc = r,
                s._updateText(r)
            } else if (0 < s._player._currentPlayIndex) {
              s._autoSWitchDesc = "";
              var o = s._player._currentPlayIndex
                , n = t[o - 1].desc
                , a = t[o].desc;
              s.showTip(n + e.paramData + a, 1e3),
                s._player.trigger(p.Private.SelectorValueChange, t[o].Url)
            }
          });
          var e = document.querySelector("#" + s.id() + " .selector-list");
          this._player.on(p.Player.LevelSwitch, function () {
            l.addClass(e, "disabled")
          }),
            this._player.on(p.Player.LevelSwitched, function () {
              l.removeClass(e, "disabled")
            })
        },
        generateList: function (e) {
          var t = this._player._urls
            , o = this._player._currentPlayIndex
            , i = this._player._qualityService.levels;
          0 < i.length && (this._isMasterLevel = !0,
            o = (t = i).length - 1);
          var n = document.querySelector("#" + this.id() + " .selector-list");
          if (0 < t.length) {
            var a = this;
            s.each(t, function (e, t) {
              if (e.desc) {
                var i = l.createEl.call(this, "li", {
                  key: e.Url,
                  index: t,
                  text: e.desc
                })
                  , r = l.createEl.call(this, "span", {
                    key: e.Url,
                    index: t,
                    text: e.desc
                  });
                t == o && (l.addClass(i, "current"),
                  a._previousSelection = i),
                  r.innerText = e.desc,
                  i.appendChild(r),
                  n.appendChild(i)
              }
            })
          }
          this._autoSWitchDesc && this._updateText(this._autoSWitchDesc)
        },
        execute: function (e) {
          if (this._player._switchSourcing = !0,
            this._isMasterLevel) {
            var t = this._player._qualityService.levels;
            for (n = 0; n < t.length; n++)
              t[n].Url == e && t[n].desc != d.get("Auto") && this._updateText("");
            this._player._switchLevel && this._player._switchLevel(e)
          } else {
            for (var i = this._player._urls.length, r = this._player._currentPlayIndex, o = -1, n = 0; n < i; n++)
              if (this._player._urls[n].Url == e) {
                o = this._player._currentPlayIndex = n,
                  u.set(c.SelectedStreamLevel, this._player._urls[n].definition, 365);
                break
              }
            if (r != o && -1 < o) {
              var a = this._player.getCurrentTime();
              this._previousCurrentTime ? "playing" != this._player._status && (a = this._previousCurrentTime) : this._previousCurrentTime = a,
                this._previousCurrentTime = a;
              var s = this._player.autoplay || "pause" != this._player._status;
              this._player.autoplay || 0 != a || (s = !1),
                this._player._loadByUrlInner(e, a, s)
            }
          }
          var l = this;
          setTimeout(function () {
            l._player._switchSourcing = !1
          })
        },
        _updateText: function (e) {
          var t = document.querySelector("#" + this.id() + " .selector-list .current")
            , i = document.querySelector("#" + this.id() + " .selector-list .current span")
            , r = d.get("Auto");
          i && i.innerText && -1 < i.innerText.indexOf(r) && (r += e ? "(" + e + ")" : "",
            i.innerText = r,
            t && (t.text = r))
        }
      });
    t.exports = o
  }
    , {
    "../../../lang/index": 11,
    "../../../lib/constants": 15,
    "../../../lib/cookie": 16,
    "../../../lib/dom": 18,
    "../../../lib/event": 19,
    "../../../lib/object": 26,
    "../../../lib/util": 33,
    "../../../player/base/event/eventtype": 43,
    "./selector": 114
  }],
  109: [function (e, t, i) {
    var r = e("./selector")
      , a = e("../../../lib/object")
      , s = (e("../../../lib/util"),
        e("../../../lib/cookie"),
        e("../../../lib/dom"))
      , o = (e("../../../lib/event"),
        e("./util"),
        e("../../../lang/index"))
      , l = e("../../../player/base/event/eventtype")
      , n = r.extend({
        init: function (e, t) {
          this.Name = o.get("AudioTrack"),
            this.Type = "audio",
            this.Tooltip = o.get("AudioTrack_Switch_To"),
            r.call(this, e, t)
        },
        bindEvent: function () {
          this.bindCommonEvent();
          var o = this
            , n = document.querySelector("#" + o.id() + " .selector-list");
          document.querySelector("#" + o.id() + " .header");
          o._player.on(l.Private.ChangeURL, function () {
            o._hasGeneratedList = !1
          }),
            this._player.on(l.Player.AudioTrackSwitch, function () {
              s.addClass(n, "disabled")
            }),
            this._player.on(l.Player.AudioTrackSwitched, function () {
              s.removeClass(n, "disabled")
            }),
            o._player.on(l.Player.AudioTrackReady, function (e) {
              o._hasGeneratedList || (o._clear(),
                (e = e.paramData) && (a.each(e, function (e, t) {
                  var i = s.createEl.call(o, "li", {
                    key: e.value,
                    text: e.text
                  })
                    , r = s.createEl.call(o, "span", {
                      key: e.value,
                      text: e.text
                    });
                  r.innerText = e.text,
                    i.appendChild(r),
                    n.appendChild(i)
                }),
                  o._hasGeneratedList = !0))
            })
        },
        execute: function (e) {
          this._player._audioTrackService["switch"](e)
        }
      });
    t.exports = n
  }
    , {
    "../../../lang/index": 11,
    "../../../lib/cookie": 16,
    "../../../lib/dom": 18,
    "../../../lib/event": 19,
    "../../../lib/object": 26,
    "../../../lib/util": 33,
    "../../../player/base/event/eventtype": 43,
    "./selector": 114,
    "./util": 116
  }],
  110: [function (e, t, i) {
    var r = e("../../component")
      , o = (e("../../../lib/dom"),
        e("../../../player/base/event/eventtype"))
      , n = e("./list")
      , a = e("../../../lang/index")
      , s = e("../util")
      , l = r.extend({
        init: function (e, t) {
          r.call(this, e, t),
            this.addClass(t.className || "prism-setting-btn"),
            this._settingList = new n(e, t),
            e.addChild(this._settingList, t)
        },
        createEl: function () {
          return r.prototype.createEl.call(this, "div")
        },
        bindEvent: function () {
          var e = this;
          this.on("click", function () {
            e._settingList.isOpened ? e._player.trigger(o.Private.SettingListHide) : e._player.trigger(o.Private.SettingListShow),
              e._player.trigger(o.Private.SelectorHide),
              e._player.trigger(o.Private.MarkerTextHide),
              e._player.trigger(o.Private.VolumeVisibilityChange, "")
          }),
            s.registerTooltipEvent.call(this, this.el(), a.get("Setting"))
        }
      });
    t.exports = l
  }
    , {
    "../../../lang/index": 11,
    "../../../lib/dom": 18,
    "../../../player/base/event/eventtype": 43,
    "../../component": 94,
    "../util": 121,
    "./list": 113
  }],
  111: [function (e, t, i) {
    var r = e("./selector")
      , s = e("../../../lib/object")
      , l = e("../../../lib/dom")
      , o = (e("../../../lib/event"),
        e("./util"),
        e("../../../lib/cookie"))
      , n = e("../../../lib/constants")
      , a = e("../../../lang/index")
      , u = e("../../../player/base/event/eventtype")
      , c = r.extend({
        init: function (e, t) {
          this.Name = a.get("Subtitle"),
            this.Type = "cc",
            this.Tooltip = a.get("CC_Switch_To"),
            r.call(this, e, t)
        },
        bindEvent: function () {
          this.bindCommonEvent();
          var o = this;
          this._player.on(u.Private.CCStateChanged, function (e) {
            var t = e.paramData.value
              , i = e.paramData.lang;
            "on" == t && i ? o._backCCText = i : "off" == t && "" == o._backCCText && (o._backCCText = o._previousSelection.text);
            var r = "Off";
            "on" == t && (r = o._backCCText),
              o._player.trigger(u.Private.SelectorUpdateList, {
                type: "cc",
                text: r
              })
          })
        },
        generateList: function (o) {
          var n = document.querySelector("#" + this.id() + " .selector-list")
            , e = this._player._ccService.tracks
            , a = this;
          s.each(e, function (e, t) {
            var i = l.createEl.call(this, "li", {
              key: e.value,
              text: e.text
            })
              , r = l.createEl.call(this, "span", {
                key: e.value,
                text: e.text
              });
            e.text == o && (l.addClass(i, "current"),
              a._previousSelection = i),
              r.innerText = e.text,
              i.appendChild(r),
              n.appendChild(i)
          })
        },
        execute: function (e) {
          this._backCCText = "",
            o.set(n.SelectedCC, e, 365),
            this._player._ccService["switch"](e),
            this._player.trigger(u.Private.CCChanged, e)
        }
      });
    t.exports = c
  }
    , {
    "../../../lang/index": 11,
    "../../../lib/constants": 15,
    "../../../lib/cookie": 16,
    "../../../lib/dom": 18,
    "../../../lib/event": 19,
    "../../../lib/object": 26,
    "../../../player/base/event/eventtype": 43,
    "./selector": 114,
    "./util": 116
  }],
  112: [function (e, t, i) {
    t.exports = {
      CC: e("./cc"),
      Speed: e("./speed"),
      Quality: e("./Quality"),
      Audio: e("./audio")
    }
  }
    , {
    "./Quality": 108,
    "./audio": 109,
    "./cc": 111,
    "./speed": 115
  }],
  113: [function (e, t, i) {
    var a = e("../../component")
      , r = e("../../../lib/dom")
      , n = e("../../../lib/ua")
      , s = e("../../../lib/event")
      , l = e("../../../player/base/event/eventtype")
      , o = e("./export")
      , u = e("./util")
      , c = e("../../../lang/index")
      , d = a.extend({
        init: function (e, t) {
          for (var i in this.isOpened = !1,
            a.call(this, e, t),
            this.addClass(t.className || "prism-setting-list"),
            o) {
            var r = new o[i](e, t);
            e.addChild(r, t)
          }
        },
        createEl: function () {
          var e = a.prototype.createEl.call(this, "div")
            , t = "<div class='prism-setting-item prism-setting-{type}' type={type}><div class='setting-content'><span class='setting-title'>{value}</span><span class='array'></span><span class='current-setting'></span></div></div>"
            , i = t.replace(/{type}/g, "speed").replace("{value}", c.get("Speed"))
            , r = t.replace(/{type}/g, "cc").replace("{value}", c.get("Subtitle"))
            , o = t.replace(/{type}/g, "audio").replace("{value}", c.get("AudioTrack"))
            , n = t.replace(/{type}/g, "quality").replace("{value}", c.get("Quality"));
          return e.innerHTML = i + r + o + n,
            e
        },
        bindEvent: function () {
          document.querySelector("#" + this.id() + " .prism-setting-speed .current-setting").innerText = c.get("Speed_1X_Text");
          var o = this
            , t = function () {
              o._player.trigger(l.Private.SettingListHide),
                o.isOpened = !1
            }
            , i = function (e) {
              e && e.text && (document.querySelector("#" + o.id() + " .prism-setting-" + e.type + " .current-setting").innerText = e.text)
            };
          this._player.on(l.Private.SettingListShow, function (e) {
            o.isOpened = !0;
            e = e.paramData;
            i(e),
              r.css(o.el(), "display", "block")
          }),
            this._player.on(l.Private.UpdateToSettingList, function (e) {
              e = e.paramData;
              i(e)
            }),
            this._player.on(l.Private.SelectorUpdateList, function (e) {
              e = e.paramData;
              i(e),
                o._player.trigger(l.Private.SelectorValueChange, e)
            }),
            this._player.on(l.Private.SettingListHide, function () {
              o.isOpened = !1,
                r.css(o.el(), "display", "none")
            }),
            s.on(this.el(), "click", function (e) {
              o._player.trigger(l.Private.SettingListHide);
              var t = e.srcElement ? e.srcElement : e.target;
              if (t = u.findItemElementForList(t)) {
                var i = t.getAttribute("type");
                o._player.trigger(l.Private.SelectorShow, {
                  type: i
                })
              }
            });
          var e = n.IS_MOBILE ? "touchleave" : "mouseleave";
          s.on(this.el(), e, function () {
            t()
          }),
            s.on(this._player.tag, "click", function (e) {
              e && e.target == e.currentTarget && t()
            }),
            s.on(this._player.tag, "touchstart", function (e) {
              e && e.target == e.currentTarget && t()
            }),
            this._player.on(l.Private.QualityChange, function (e) {
              var t = e.paramData;
              if (t.levelSwitch) {
                var i = document.querySelector("#" + o.id() + " .prism-setting-quality .current-setting")
                  , r = c.get("Auto");
                -1 < i.innerText.indexOf(r) && (i.innerText = r + (t.desc ? "(" + t.desc + ")" : ""))
              }
            })
        }
      });
    t.exports = d
  }
    , {
    "../../../lang/index": 11,
    "../../../lib/dom": 18,
    "../../../lib/event": 19,
    "../../../lib/ua": 31,
    "../../../player/base/event/eventtype": 43,
    "../../component": 94,
    "./export": 112,
    "./util": 116
  }],
  114: [function (e, t, i) {
    var r = e("../../component")
      , o = (e("../../../lib/object"),
        e("../../../lib/util"),
        e("../../../lib/ua"))
      , a = (e("../../../lib/cookie"),
        e("../../../lib/dom"))
      , s = e("../../../lib/event")
      , l = e("./util")
      , u = (e("../../../lang/index"),
        e("../../../player/base/event/eventtype"))
      , n = r.extend({
        init: function (e, t) {
          this._hasGeneratedList = !1,
            this._previousSelection = null,
            this._backupSelector = "",
            r.call(this, e, t),
            this.className = t.className ? t.className : "prism-" + this.Type + "-selector prism-setting-selector",
            this.addClass(this.className)
        },
        createEl: function () {
          var e = r.prototype.createEl.call(this, "div");
          return e.innerHTML = '<div class="header"><div class="left-array"></div><span>' + this.Name + '</span></div><ul class="selector-list"></ul>',
            e
        },
        bindEvent: function () {
          this.bindCommonEvent()
        },
        bindCommonEvent: function () {
          var n = this
            , e = document.querySelector("#" + n.id() + " .selector-list")
            , t = document.querySelector("#" + n.id() + " .header");
          this._player.on(u.Private.ChangeURL, function () {
            n._hasGeneratedList = !1
          }),
            s.on(t, "click", function () {
              n._player.trigger(u.Private.SelectorHide),
                n._player.trigger(u.Private.SettingListShow, {
                  type: n.Type,
                  text: n._previousSelection ? n._previousSelection.text : ""
                })
            }),
            s.on(e, "click", function (e) {
              var t = e.srcElement ? e.srcElement : e.target
                , i = t.key
                , r = t.text;
              if (void 0 !== r) {
                n._previousSelection && a.removeClass(n._previousSelection, "current"),
                  n._previousSelection = l.findliElementForSelector(t),
                  a.addClass(n._previousSelection, "current"),
                  n.execute && n.execute(i);
                var o = n.Tooltip + "<span>" + r + "</span>";
                n._player.trigger(u.Private.Info_Show, {
                  text: o,
                  duration: 1e3,
                  align: "lb"
                })
              }
            }),
            n._player.on(u.Private.SelectorHide, function () {
              i()
            }),
            n._player.on(u.Private.SelectorValueChange, function (e) {
              var t = e.paramData;
              if (t) {
                if (t.type != n.Type)
                  return;
                var i = document.querySelectorAll("#" + n.id() + " .selector-list li");
                if (i) {
                  var r = i.length;
                  0 == r && (n._backupSelector = t.text);
                  for (var o = 0; o < r; o++)
                    if (i[o].text == t.text) {
                      n._previousSelection && a.removeClass(n._previousSelection, "current"),
                        a.addClass(i[o], "current"),
                        n._previousSelection = i[o];
                      break
                    }
                }
              }
            }),
            n._player.on(u.Private.SelectorShow, function (e) {
              if ((e = e.paramData).type == n.Type) {
                var t = document.querySelector("#" + n._player.id() + " .prism-" + e.type + "-selector");
                n._hasGeneratedList || (n._clear(),
                  n.generateList(n._backupSelector),
                  n._backupSelector = "",
                  n._hasGeneratedList = !0),
                  a.css(t, "display", "block")
              }
            });
          var i = function () {
            a.css(n.el(), "display", "none"),
              n._player.trigger(u.Private.UpdateToSettingList, {
                type: n.Type,
                text: n._previousSelection ? n._previousSelection.text : ""
              })
          }
            , r = o.IS_MOBILE ? "touchleave" : "mouseleave";
          s.on(this.el(), r, function () {
            i()
          }),
            s.on(this._player.tag, "click", function (e) {
              e && e.target == e.currentTarget && i()
            }),
            s.on(this._player.tag, "touchstart", function (e) {
              e && e.target == e.currentTarget && i()
            })
        },
        setSelected: function (e) { },
        generateList: function () { },
        _clear: function () {
          document.querySelector("#" + this.id() + " .selector-list").innerHTML = ""
        }
      });
    t.exports = n
  }
    , {
    "../../../lang/index": 11,
    "../../../lib/cookie": 16,
    "../../../lib/dom": 18,
    "../../../lib/event": 19,
    "../../../lib/object": 26,
    "../../../lib/ua": 31,
    "../../../lib/util": 33,
    "../../../player/base/event/eventtype": 43,
    "../../component": 94,
    "./util": 116
  }],
  115: [function (e, t, i) {
    var r = e("./selector")
      , a = e("../../../lib/object")
      , s = (e("../../../lib/util"),
        e("../../../lib/cookie"),
        e("../../../lib/dom"))
      , l = (e("../../../lib/event"),
        e("./util"),
        e("../../../lib/constants"))
      , u = e("../../../lang/index")
      , o = (e("../../../player/base/event/eventtype"),
        r.extend({
          init: function (e, t) {
            this.Name = u.get("Speed"),
              this.Type = "speed",
              this.Tooltip = u.get("Speed_Switch_To"),
              r.call(this, e, t)
          },
          generateList: function () {
            var o = document.querySelector("#" + this.id() + " .selector-list")
              , e = l.SpeedLevels
              , n = this;
            a.each(e, function (e, t) {
              var i = s.createEl.call(this, "li", {
                key: e.key,
                text: e.text
              })
                , r = s.createEl.call(this, "span", {
                  key: e.key,
                  text: e.text
                });
              r.innerText = e.text,
                e.text == u.get("Speed_1X_Text") && (s.addClass(i, "current"),
                  n._previousSelection = i),
                i.appendChild(r),
                o.appendChild(i)
            })
          },
          execute: function (e) {
            this._player.setSpeed(e)
          }
        }));
    t.exports = o
  }
    , {
    "../../../lang/index": 11,
    "../../../lib/constants": 15,
    "../../../lib/cookie": 16,
    "../../../lib/dom": 18,
    "../../../lib/event": 19,
    "../../../lib/object": 26,
    "../../../lib/util": 33,
    "../../../player/base/event/eventtype": 43,
    "./selector": 114,
    "./util": 116
  }],
  116: [function (e, i, t) {
    i.exports.findliElementForSelector = function (e) {
      if (!e || "li" == e.tagName.toLowerCase())
        return e;
      var t = e.parentElement;
      return t && "li" == t.tagName.toLowerCase() ? t : null
    }
      ,
      i.exports.findliElementByKey = function (e, t) {
        document.querySelectors(e);
        return null
      }
      ,
      i.exports.findItemElementForList = function (e) {
        if (!e || -1 < e.className.indexOf("prism-setting-item"))
          return e;
        var t = e.parentElement;
        return t && (e = i.exports.findItemElementForList(t)),
          e
      }
  }
    , {}],
  117: [function (e, t, i) {
    var r = e("../component")
      , o = e("../../lib/dom")
      , f = e("../../lib/util")
      , n = e("../../lang/index")
      , _ = e("../../player/base/event/eventtype")
      , a = e("./util")
      , s = r.extend({
        init: function (e, t) {
          r.call(this, e, t),
            this.addClass(t.className || "prism-snapshot-btn")
        },
        createEl: function () {
          return r.prototype.createEl.call(this, "div")
        },
        bindEvent: function () {
          var h = this;
          this._player.on(_.Private.Snapshot_Hide, function () {
            o.css(h._el, "display", "none")
          }),
            a.registerTooltipEvent.call(this, this.el(), n.get("Snapshot")),
            this.on("click", function () {
              h.trigger(_.Player.Snapshoting);
              var e = document.createElement("canvas")
                , t = h._player.tag
                , i = t.videoWidth
                , r = t.videoHeight
                , o = h._player._getSanpshotMatric();
              e.width = o.width || i,
                e.height = o.height || r;
              var n = h._player.getCurrentTime()
                , a = e.getContext("2d");
              a.save();
              var s = h._player.getImage();
              "vertical" == s ? (a.translate(0, e.height),
                a.scale(1, -1)) : "horizon" == s && (a.translate(e.width, 0),
                  a.scale(-1, 1)),
                a.drawImage(t, 0, 0, i, r),
                a.restore(),
                g(a, h._player.getOptions());
              var l = ""
                , u = "";
              try {
                l = e.toDataURL("image/jpeg", o.rate || 1)
              } catch (e) {
                u = e
              }
              var c = ""
                , d = ""
                , p = "";
              l && (d = (c = l).substr(c.indexOf(",") + 1),
                p = f.toBinary(d)),
                h.trigger(_.Player.Snapshoted, {
                  time: n,
                  base64: c,
                  binary: p,
                  error: u
                })
            })
        }
      })
      , g = function (e, t) {
        var i = t.snapshotWatermark;
        i && i.text && (e.font = i.font,
          i.fillColor && (e.fillStyle = i.fillColor,
            e.fillText(i.text, i.left, i.top)),
          i.strokeColor && (e.strokeStyle = i.strokeColor,
            e.strokeText(i.text, i.left, i.top)),
          e.stroke())
      };
    t.exports = s
  }
    , {
    "../../lang/index": 11,
    "../../lib/dom": 18,
    "../../lib/util": 33,
    "../../player/base/event/eventtype": 43,
    "../component": 94,
    "./util": 121
  }],
  118: [function (e, t, i) {
    var r = e("../component")
      , c = (e("../../lib/util"),
        e("../../lib/dom"))
      , o = e("../../lib/event")
      , n = (e("../../lib/ua"),
        e("../../lang/index"),
        e("../../player/base/event/eventtype"))
      , a = r.extend({
        init: function (e, t) {
          r.call(this, e, t),
            this.className = t.className ? t.className : "prism-thumbnail",
            this.addClass(this.className)
        },
        createEl: function () {
          var e = r.prototype.createEl.call(this, "div");
          return e.innerHTML = "<img></img><span></span>",
            e
        },
        bindEvent: function () {
          var u = this;
          o.on(this._el, "mousemove", function (e) {
            e.preventDefault()
          }),
            o.on(this._el, "touchmove", function (e) {
              e.preventDefault()
            }),
            u._player.on(n.Private.ThumbnailLoaded, function (e) {
              var t = e.paramData;
              if (t && 0 < t.length) {
                var i = u._player._thumbnailService.makeUrl(t[0].text);
                u._player.log("THUMBNAILSTART", {
                  tu: encodeURIComponent(i)
                });
                var r = (new Date).getTime();
                if (t[0].isBig)
                  c.css(u.el(), "background", "url(" + i + ")"),
                    c.css(u.el(), "width", t[0].w + "px"),
                    c.css(u.el(), "height", t[0].h + "px"),
                    u._player.log("THUMBNAILCOMPLETE", {
                      ftt: (new Date).getTime() - r
                    });
                else {
                  var o = document.querySelector("#" + u.id() + " img");
                  o.onload = function () {
                    var e = o.width
                      , t = o.height;
                    c.css(u.el(), "width", e + "px"),
                      c.css(u.el(), "height", t + "px"),
                      u._player.log("THUMBNAILCOMPLETE", {
                        ftt: (new Date).getTime() - r
                      })
                  }
                    ,
                    o.src = i
                }
              }
            }),
            u._player.on(n.Private.ThumbnailShow, function (l) {
              u._thumbnailShowHanlde && clearTimeout(u._thumbnailShowHanlde),
                u._thumbnailShowHanlde = setTimeout(function () {
                  var e = document.querySelector("#" + u.id() + " span")
                    , t = l.paramData;
                  if (e.innerText = t.formatTime,
                    t) {
                    var i = u._player._thumbnailService.findAvailableCue(t.time);
                    if (i)
                      if (i.isBig) {
                        var r = u._player._thumbnailService.makeUrl(i.text);
                        c.css(u.el(), "background", "url(" + r + ")"),
                          i.w,
                          i.h;
                        var o = -1 * i.x + "px " + -1 * i.y + "px";
                        c.css(u.el(), "background-position", o)
                      } else {
                        var n = document.querySelector("#" + u.id() + " img");
                        r = u._player._thumbnailService.makeUrl(i.text),
                          n.src != r && (n.src = r)
                      }
                    else
                      c.css(u.el(), "border", "none"),
                        c.css(e, "left", "0px");
                    c.css(u.el(), "display", "block");
                    var a = 0
                      , s = i ? u.el().offsetWidth : e.offsetWidth;
                    a = t.left + s > t.progressWidth ? t.left - s : (a = t.left - s / 2) < 0 ? 0 : a,
                      c.css(u.el(), "left", a + "px")
                  }
                }, 30)
            }),
            u._player.on(n.Private.ThumbnailHide, function (e) {
              u._thumbnailShowHanlde && clearTimeout(u._thumbnailShowHanlde),
                c.css(u.el(), "display", "none")
            })
        },
        _createSamllThumbnail: function () { },
        disposeUI: function () {
          this._thumbnailShowHanlde && (clearTimeout(this._thumbnailShowHanlde),
            this._thumbnailShowHanlde = null)
        }
      });
    t.exports = a
  }
    , {
    "../../lang/index": 11,
    "../../lib/dom": 18,
    "../../lib/event": 19,
    "../../lib/ua": 31,
    "../../lib/util": 33,
    "../../player/base/event/eventtype": 43,
    "../component": 94
  }],
  119: [function (e, t, i) {
    var r = e("../component")
      , o = e("../../lib/util")
      , n = e("../../player/base/event/eventtype")
      , a = r.extend({
        init: function (e, t) {
          r.call(this, e, t),
            this.className = t.className ? t.className : "prism-time-display",
            this.addClass(this.className)
        },
        createEl: function () {
          var e = r.prototype.createEl.call(this, "div");
          return e.innerHTML = '<span class="current-time">00:00</span> <span class="time-bound">/</span> <span class="duration">00:00</span>',
            e
        },
        bindEvent: function () {
          var i = this;
          this._player.on(n.Video.DurationChange, function () {
            var e = o.formatTime(i._player.getDisplayDuration());
            e ? (document.querySelector("#" + i.id() + " .time-bound").style.display = "inline",
              document.querySelector("#" + i.id() + " .duration").style.display = "inline",
              document.querySelector("#" + i.id() + " .duration").innerText = e) : (document.querySelector("#" + i.id() + " .duration").style.display = "none",
                document.querySelector("#" + i.id() + " .time-bound").style.display = "none")
          }),
            this._player.on(n.Video.TimeUpdate, function () {
              var e = i._player.getCurrentTime()
                , t = o.formatTime(e);
              document.querySelector("#" + i.id() + " .current-time") && (t ? (document.querySelector("#" + i.id() + " .current-time").style.display = "inline",
                document.querySelector("#" + i.id() + " .current-time").innerText = t) : document.querySelector("#" + i.id() + " .current-time").style.display = "none")
            })
        }
      });
    t.exports = a
  }
    , {
    "../../lib/util": 33,
    "../../player/base/event/eventtype": 43,
    "../component": 94
  }],
  120: [function (e, t, i) {
    var r = e("../component")
      , s = e("../../lib/dom")
      , o = e("../../player/base/event/eventtype")
      , n = r.extend({
        init: function (e, t) {
          r.call(this, e, t),
            this.className = t.className ? t.className : "prism-tooltip",
            this.addClass(this.className)
        },
        createEl: function () {
          var e = r.prototype.createEl.call(this, "p");
          return e.innerText = "\u63d0\u793a\u4fe1\u606f",
            e
        },
        bindEvent: function () {
          var a = this;
          a._player.on(o.Private.TooltipShow, function (e) {
            var t = document.querySelector("#" + a.id())
              , i = e.paramData;
            t.innerText = i.text,
              s.css(t, "display", "block");
            var r = t.offsetWidth
              , o = document.querySelector("#" + a._player.id() + " .prism-controlbar");
            if (o) {
              var n = o.offsetWidth;
              i.left + r > n ? s.css(t, "left", n - r + "px") : s.css(t, "left", i.left - (r - i.width) / 2 + "px")
            }
          }),
            a._player.on(o.Private.TooltipHide, function (e) {
              var t = document.querySelector("#" + a.id());
              s.css(t, "display", "none")
            })
        }
      });
    t.exports = n
  }
    , {
    "../../lib/dom": 18,
    "../../player/base/event/eventtype": 43,
    "../component": 94
  }],
  121: [function (e, t, i) {
    var r = e("../../lib/event")
      , s = e("../../player/base/event/eventtype");
    t.exports.registerTooltipEvent = function (e, o) {
      var n = this
        , a = function () {
          n._controlbarTooltipHandler && (clearTimeout(n._controlbarTooltipHandler),
            n._controlbarTooltipHandler = null)
        };
      r.on(this.el(), "mouseover", function (e) {
        a(),
          n._controlbarTooltipHandler = setTimeout(function () {
            n._player.trigger(s.Private.TooltipHide)
          }, 4e3);
        var t = n.el().offsetLeft
          , i = n.el().offsetWidth
          , r = o;
        "function" == typeof r && (r = o.call(this)),
          n._player.trigger(s.Private.TooltipShow, {
            left: t,
            width: i,
            text: r
          })
      }),
        r.on(this.el(), "mouseout", function () {
          a(),
            n._player.trigger(s.Private.TooltipHide)
        })
    }
      ,
      t.exports.throttle = function (i, r) {
        var o = Date.now();
        return function () {
          var e = arguments
            , t = Date.now();
          r <= t - o && (i(e),
            o = t)
        }
      }
  }
    , {
    "../../lib/event": 19,
    "../../player/base/event/eventtype": 43
  }],
  122: [function (e, t, i) {
    var r = e("../component")
      , o = e("../../lib/dom")
      , n = e("../../lib/event")
      , a = e("../../player/base/event/eventtype")
      , s = e("./util")
      , l = e("../../lang/index")
      , u = e("./volumecontrol")
      , c = r.extend({
        init: function (e, t) {
          r.call(this, e, t),
            this.addClass(t.className || "prism-volume");
          var i = new u(e, t);
          e.addChild(i, t)
        },
        createEl: function () {
          var e = r.prototype.createEl.call(this, "div");
          return e.innerHTML = '<div class="volume-icon"><div class="short-horizontal"></div><div class="long-horizontal"></div></div>',
            e
        },
        bindEvent: function () {
          var i = this;
          this.icon = document.querySelector("#" + i.id() + "  .volume-icon"),
            s.registerTooltipEvent.call(this, this.el(), function () {
              return i._player.muted() || 0 == i._player.getVolume() ? l.get("Muted") : l.get("Volume")
            }),
            n.on(this.icon, "click", function (e) {
              var t = i.el().offsetLeft;
              i._player.trigger(a.Private.SettingListHide),
                i._player.trigger(a.Private.SelectorHide),
                i._player.trigger(a.Private.VolumeVisibilityChange, t),
                i._player.trigger(a.Private.MarkerTextHide)
            });
          var e = document.querySelector("#" + i.id() + "  .long-horizontal")
            , t = document.querySelector("#" + i.id() + "  .short-horizontal");
          n.on(this.el(), "mouseover", function () {
            o.removeClass(e, "volume-hover-animation"),
              setTimeout(function () {
                o.addClass(e, "volume-hover-animation")
              }),
              setTimeout(function () {
                o.removeClass(e, "volume-hover-animation"),
                  o.addClass(t, "volume-hover-animation"),
                  setTimeout(function () {
                    o.removeClass(t, "volume-hover-animation"),
                      o.addClass(e, "volume-hover-animation")
                  }, 300)
              }, 300)
          })
        }
      });
    t.exports = c
  }
    , {
    "../../lang/index": 11,
    "../../lib/dom": 18,
    "../../lib/event": 19,
    "../../player/base/event/eventtype": 43,
    "../component": 94,
    "./util": 121,
    "./volumecontrol": 123
  }],
  123: [function (e, t, i) {
    var r = e("../component")
      , o = e("../../lib/dom")
      , n = e("../../lib/event")
      , a = e("../../player/base/event/eventtype")
      , s = (e("./util"),
        e("../../lang/index"),
        r.extend({
          init: function (e, t) {
            r.call(this, e, t),
              this.addClass(t.className || "prism-volume-control"),
              this._shown = !1
          },
          createEl: function () {
            var e = r.prototype.createEl.call(this, "div");
            return e.innerHTML = '<div class="volume-range"><div class="volume-value"></div><div class="volume-cursor"></div></div>',
              e
          },
          bindEvent: function () {
            var r = this;
            this.icon = document.querySelector("#" + r._player.id() + "  .volume-icon"),
              this.control = document.querySelector("#" + r.id()),
              this.volumnValue = document.querySelector("#" + r.id() + "  .volume-value"),
              this.volumnRange = document.querySelector("#" + r.id() + "  .volume-range"),
              this.volumnCursor = document.querySelector("#" + r.id() + "  .volume-cursor"),
              this._player.on(a.Private.VolumeVisibilityChange, function (e) {
                var t = e.paramData;
                if (!r._shown && t) {
                  var i = r._player.getVolume();
                  r._setVolumnUI(i),
                    o.css(r.control, "display", "block"),
                    t && o.css(r.control, "left", t - 5 + "px"),
                    r._shown = !0
                } else
                  o.css(r.control, "display", "none"),
                    r._shown = !1
              }),
              n.on(this.volumnRange, "click", function (e) {
                var t = o.getPointerPosition(r.volumnRange, e).y;
                t < 0 || 1 < t || (t < 0 && (t = 0),
                  1 < t && (t = 1),
                  r._setVolumnUI(t),
                  r._setMuteUI(t),
                  r._player.setVolume(t))
              }),
              n.on(this._player.tag, "click", function (e) {
                e && e.target == e.currentTarget && o.css(r.control, "display", "none")
              }),
              n.on(this._player.tag, "touchstart", function (e) {
                e && e.target == e.currentTarget && o.css(r.control, "display", "none")
              }),
              n.on(this.volumnCursor, "mousedown", function (e) {
                r._onMouseDown(e)
              }),
              n.on(this.volumnCursor, "touchstart", function (e) {
                r._onMouseDown(e)
              }),
              this._player.on(a.Private.VolumnChanged, function (e) {
                var t = e.paramData;
                -1 < t && r._setVolumnUI(t),
                  r._setMuteUI(t)
              }),
              n.on(this.control, "mouseleave", function () {
                o.css(r.control, "display", "none"),
                  r._shown = !1
              }),
              n.on(this.control, "mouseover", function () {
                o.addClass(r.control, "hover")
              }),
              r._rangeBottom = r._getBottom()
          },
          _getBottom: function () {
            if (window.getComputedStyle) {
              var e = window.getComputedStyle(this.volumnRange, null).getPropertyValue("bottom");
              return parseFloat(e)
            }
            return 26
          },
          _onMouseDown: function (e) {
            var t = this;
            e.preventDefault(),
              n.on(this.control, "mousemove", function (e) {
                t._onMouseMove(e)
              }),
              n.on(this.control, "touchmove", function (e) {
                t._onMouseMove(e)
              }),
              n.on(this._player.tag, "mouseup", function (e) {
                t._onMouseUp(e)
              }),
              n.on(this._player.tag, "touchend", function (e) {
                t._onMouseUp(e)
              }),
              n.on(this.control, "mouseup", function (e) {
                t._onMouseUp(e)
              }),
              n.on(this.control, "touchend", function (e) {
                t._onMouseUp(e)
              })
          },
          _onMouseUp: function (e) {
            if (e.preventDefault(),
              this._offEvent(),
              this.volumnRange.offsetHeight) {
              var t = (this.volumnValue.offsetHeight / this.volumnRange.offsetHeight).toFixed(2);
              this._player.setVolume(t),
                this._setMuteUI(t)
            }
          },
          _onMouseMove: function (e) {
            e.preventDefault();
            var t = o.getPointerPosition(this.volumnRange, e).y;
            t < 0 || 1 < t || (t < 0 && (t = 0),
              1 < t && (t = 1),
              this._setVolumnUI(t))
          },
          _getPosition: function (e) {
            for (var t = this.volumnRange, i = 0; t = t.offsetParent;)
              i += t.offsetTop;
            var r = this.volumnRange.offsetHeight
              , o = this.volumnCursor.offsetHeight
              , n = e.touches ? e.touches[0].pageY : e.pageY;
            return r < n - i && (n = e.clientY),
              (r - (n - i) + o) / (r = this.volumnRange.offsetHeight)
          },
          _offEvent: function () {
            n.off(this._player.tag, "mouseup"),
              n.off(this._player.tag, "touchend"),
              n.off(this.control, "mousemove"),
              n.off(this.control, "touchmove"),
              n.off(this.control, "mouseup"),
              n.off(this.control, "touchend")
          },
          _setMuteUI: function (e) {
            isNaN(e) || (0 == e || -1 == e ? o.addClass(this.icon, "mute") : o.removeClass(this.icon, "mute"))
          },
          _setVolumnUI: function (e) {
            isNaN(e) || (o.css(this.volumnValue, "height", 100 * e + "%"),
              1 == e && (e = .99),
              o.css(this.volumnCursor, "bottom", 100 * e + "%"))
          }
        }));
    t.exports = s
  }
    , {
    "../../lang/index": 11,
    "../../lib/dom": 18,
    "../../lib/event": 19,
    "../../player/base/event/eventtype": 43,
    "../component": 94,
    "./util": 121
  }],
  124: [function (e, t, i) {
    t.exports = {
      H5Loading: e("./component/h5-loading"),
      bigPlayButton: e("./component/big-play-button"),
      controlBar: e("./component/controlbar"),
      progress: e("./component/progress"),
      playButton: e("./component/play-button"),
      liveDisplay: e("./component/live-display"),
      timeDisplay: e("./component/time-display"),
      fullScreenButton: e("./component/fullscreen-button"),
      volume: e("./component/volume"),
      snapshot: e("./component/snapshot"),
      errorDisplay: e("./component/error-display"),
      infoDisplay: e("./component/info-display"),
      liveShiftProgress: e("../commonui/liveshiftprogress"),
      liveShiftTimeDisplay: e("../commonui/livetimedisplay"),
      setting: e("./component/setting/button"),
      subtitle: e("./component/cc-button"),
      thumbnail: e("./component/thumbnail"),
      tooltip: e("./component/tooltip")
    }
  }
    , {
    "../commonui/liveshiftprogress": 3,
    "../commonui/livetimedisplay": 4,
    "./component/big-play-button": 95,
    "./component/cc-button": 96,
    "./component/controlbar": 97,
    "./component/error-display": 99,
    "./component/fullscreen-button": 100,
    "./component/h5-loading": 101,
    "./component/info-display": 102,
    "./component/live-display": 103,
    "./component/play-button": 105,
    "./component/progress": 106,
    "./component/setting/button": 110,
    "./component/snapshot": 117,
    "./component/thumbnail": 118,
    "./component/time-display": 119,
    "./component/tooltip": 120,
    "./component/volume": 122
  }],
  125: [function (e, t, i) {
    var r, o;
    r = this,
      o = function () {
        var c, i, e, t, r, d, o, n, a, s, l, u, p = p || (c = Math,
          i = Object.create || function () {
            function i() { }
            return function (e) {
              var t;
              return i.prototype = e,
                t = new i,
                i.prototype = null,
                t
            }
          }(),
          t = (e = {}).lib = {},
          r = t.Base = {
            extend: function (e) {
              var t = i(this);
              return e && t.mixIn(e),
                t.hasOwnProperty("init") && this.init !== t.init || (t.init = function () {
                  t.$super.init.apply(this, arguments)
                }
                ),
                (t.init.prototype = t).$super = this,
                t
            },
            create: function () {
              var e = this.extend();
              return e.init.apply(e, arguments),
                e
            },
            init: function () { },
            mixIn: function (e) {
              for (var t in e)
                e.hasOwnProperty(t) && (this[t] = e[t]);
              e.hasOwnProperty("toString") && (this.toString = e.toString)
            },
            clone: function () {
              return this.init.prototype.extend(this)
            }
          },
          d = t.WordArray = r.extend({
            init: function (e, t) {
              e = this.words = e || [],
                this.sigBytes = null != t ? t : 4 * e.length
            },
            toString: function (e) {
              return (e || n).stringify(this)
            },
            concat: function (e) {
              var t = this.words
                , i = e.words
                , r = this.sigBytes
                , o = e.sigBytes;
              if (this.clamp(),
                r % 4)
                for (var n = 0; n < o; n++) {
                  var a = i[n >>> 2] >>> 24 - n % 4 * 8 & 255;
                  t[r + n >>> 2] |= a << 24 - (r + n) % 4 * 8
                }
              else
                for (n = 0; n < o; n += 4)
                  t[r + n >>> 2] = i[n >>> 2];
              return this.sigBytes += o,
                this
            },
            clamp: function () {
              var e = this.words
                , t = this.sigBytes;
              e[t >>> 2] &= 4294967295 << 32 - t % 4 * 8,
                e.length = c.ceil(t / 4)
            },
            clone: function () {
              var e = r.clone.call(this);
              return e.words = this.words.slice(0),
                e
            },
            random: function (e) {
              for (var t, i = [], r = function (t) {
                t = t;
                var i = 987654321
                  , r = 4294967295;
                return function () {
                  var e = ((i = 36969 * (65535 & i) + (i >> 16) & r) << 16) + (t = 18e3 * (65535 & t) + (t >> 16) & r) & r;
                  return e /= 4294967296,
                    (e += .5) * (.5 < c.random() ? 1 : -1)
                }
              }, o = 0; o < e; o += 4) {
                var n = r(4294967296 * (t || c.random()));
                t = 987654071 * n(),
                  i.push(4294967296 * n() | 0)
              }
              return new d.init(i, e)
            }
          }),
          o = e.enc = {},
          n = o.Hex = {
            stringify: function (e) {
              for (var t = e.words, i = e.sigBytes, r = [], o = 0; o < i; o++) {
                var n = t[o >>> 2] >>> 24 - o % 4 * 8 & 255;
                r.push((n >>> 4).toString(16)),
                  r.push((15 & n).toString(16))
              }
              return r.join("")
            },
            parse: function (e) {
              for (var t = e.length, i = [], r = 0; r < t; r += 2)
                i[r >>> 3] |= parseInt(e.substr(r, 2), 16) << 24 - r % 8 * 4;
              return new d.init(i, t / 2)
            }
          },
          a = o.Latin1 = {
            stringify: function (e) {
              for (var t = e.words, i = e.sigBytes, r = [], o = 0; o < i; o++) {
                var n = t[o >>> 2] >>> 24 - o % 4 * 8 & 255;
                r.push(String.fromCharCode(n))
              }
              return r.join("")
            },
            parse: function (e) {
              for (var t = e.length, i = [], r = 0; r < t; r++)
                i[r >>> 2] |= (255 & e.charCodeAt(r)) << 24 - r % 4 * 8;
              return new d.init(i, t)
            }
          },
          s = o.Utf8 = {
            stringify: function (e) {
              try {
                return decodeURIComponent(escape(a.stringify(e)))
              } catch (e) {
                throw new Error("Malformed UTF-8 data")
              }
            },
            parse: function (e) {
              return a.parse(unescape(encodeURIComponent(e)))
            }
          },
          l = t.BufferedBlockAlgorithm = r.extend({
            reset: function () {
              this._data = new d.init,
                this._nDataBytes = 0
            },
            _append: function (e) {
              "string" == typeof e && (e = s.parse(e)),
                this._data.concat(e),
                this._nDataBytes += e.sigBytes
            },
            _process: function (e) {
              var t = this._data
                , i = t.words
                , r = t.sigBytes
                , o = this.blockSize
                , n = r / (4 * o)
                , a = (n = e ? c.ceil(n) : c.max((0 | n) - this._minBufferSize, 0)) * o
                , s = c.min(4 * a, r);
              if (a) {
                for (var l = 0; l < a; l += o)
                  this._doProcessBlock(i, l);
                var u = i.splice(0, a);
                t.sigBytes -= s
              }
              return new d.init(u, s)
            },
            clone: function () {
              var e = r.clone.call(this);
              return e._data = this._data.clone(),
                e
            },
            _minBufferSize: 0
          }),
          t.Hasher = l.extend({
            cfg: r.extend(),
            init: function (e) {
              this.cfg = this.cfg.extend(e),
                this.reset()
            },
            reset: function () {
              l.reset.call(this),
                this._doReset()
            },
            update: function (e) {
              return this._append(e),
                this._process(),
                this
            },
            finalize: function (e) {
              return e && this._append(e),
                this._doFinalize()
            },
            blockSize: 16,
            _createHelper: function (i) {
              return function (e, t) {
                return new i.init(t).finalize(e)
              }
            },
            _createHmacHelper: function (i) {
              return function (e, t) {
                return new u.HMAC.init(i, t).finalize(e)
              }
            }
          }),
          u = e.algo = {},
          e);
        return p
      }
      ,
      "object" == typeof i ? t.exports = i = o() : "function" == typeof define && define.amd ? define([], o) : r.CryptoJS = o()
  }
    , {}],
  126: [function (e, t, i) {
    var r, o;
    r = this,
      o = function (e) {
        var t, l;
        return l = (t = e).lib.WordArray,
          t.enc.Base64 = {
            stringify: function (e) {
              var t = e.words
                , i = e.sigBytes
                , r = this._map;
              e.clamp();
              for (var o = [], n = 0; n < i; n += 3)
                for (var a = (t[n >>> 2] >>> 24 - n % 4 * 8 & 255) << 16 | (t[n + 1 >>> 2] >>> 24 - (n + 1) % 4 * 8 & 255) << 8 | t[n + 2 >>> 2] >>> 24 - (n + 2) % 4 * 8 & 255, s = 0; s < 4 && n + .75 * s < i; s++)
                  o.push(r.charAt(a >>> 6 * (3 - s) & 63));
              var l = r.charAt(64);
              if (l)
                for (; o.length % 4;)
                  o.push(l);
              return o.join("")
            },
            parse: function (e) {
              var t = e.length
                , i = this._map
                , r = this._reverseMap;
              if (!r) {
                r = this._reverseMap = [];
                for (var o = 0; o < i.length; o++)
                  r[i.charCodeAt(o)] = o
              }
              var n = i.charAt(64);
              if (n) {
                var a = e.indexOf(n);
                -1 !== a && (t = a)
              }
              return function (e, t, i) {
                for (var r = [], o = 0, n = 0; n < t; n++)
                  if (n % 4) {
                    var a = i[e.charCodeAt(n - 1)] << n % 4 * 2
                      , s = i[e.charCodeAt(n)] >>> 6 - n % 4 * 2;
                    r[o >>> 2] |= (a | s) << 24 - o % 4 * 8,
                      o++
                  }
                return l.create(r, o)
              }(e, t, r)
            },
            _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
          },
          e.enc.Base64
      }
      ,
      "object" == typeof i ? t.exports = i = o(e("./core")) : "function" == typeof define && define.amd ? define(["./core"], o) : o(r.CryptoJS)
  }
    , {
    "./core": 125
  }],
  127: [function (e, t, i) {
    var r, o;
    r = this,
      o = function (e) {
        return e.enc.Utf8
      }
      ,
      "object" == typeof i ? t.exports = i = o(e("./core")) : "function" == typeof define && define.amd ? define(["./core"], o) : o(r.CryptoJS)
  }
    , {
    "./core": 125
  }],
  128: [function (e, t, i) {
    var r, o;
    r = this,
      o = function (e) {
        return e.HmacSHA1
      }
      ,
      "object" == typeof i ? t.exports = i = o(e("./core"), e("./sha1"), e("./hmac")) : "function" == typeof define && define.amd ? define(["./core", "./sha1", "./hmac"], o) : o(r.CryptoJS)
  }
    , {
    "./core": 125,
    "./hmac": 129,
    "./sha1": 130
  }],
  129: [function (e, t, i) {
    var r, o;
    r = this,
      o = function (e) {
        var t, i, u;
        i = (t = e).lib.Base,
          u = t.enc.Utf8,
          t.algo.HMAC = i.extend({
            init: function (e, t) {
              e = this._hasher = new e.init,
                "string" == typeof t && (t = u.parse(t));
              var i = e.blockSize
                , r = 4 * i;
              t.sigBytes > r && (t = e.finalize(t)),
                t.clamp();
              for (var o = this._oKey = t.clone(), n = this._iKey = t.clone(), a = o.words, s = n.words, l = 0; l < i; l++)
                a[l] ^= 1549556828,
                  s[l] ^= 909522486;
              o.sigBytes = n.sigBytes = r,
                this.reset()
            },
            reset: function () {
              var e = this._hasher;
              e.reset(),
                e.update(this._iKey)
            },
            update: function (e) {
              return this._hasher.update(e),
                this
            },
            finalize: function (e) {
              var t = this._hasher
                , i = t.finalize(e);
              return t.reset(),
                t.finalize(this._oKey.clone().concat(i))
            }
          })
      }
      ,
      "object" == typeof i ? t.exports = i = o(e("./core")) : "function" == typeof define && define.amd ? define(["./core"], o) : o(r.CryptoJS)
  }
    , {
    "./core": 125
  }],
  130: [function (e, t, i) {
    var r, o;
    r = this,
      o = function (e) {
        var t, i, r, o, n, d, a;
        return i = (t = e).lib,
          r = i.WordArray,
          o = i.Hasher,
          n = t.algo,
          d = [],
          a = n.SHA1 = o.extend({
            _doReset: function () {
              this._hash = new r.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
            },
            _doProcessBlock: function (e, t) {
              for (var i = this._hash.words, r = i[0], o = i[1], n = i[2], a = i[3], s = i[4], l = 0; l < 80; l++) {
                if (l < 16)
                  d[l] = 0 | e[t + l];
                else {
                  var u = d[l - 3] ^ d[l - 8] ^ d[l - 14] ^ d[l - 16];
                  d[l] = u << 1 | u >>> 31
                }
                var c = (r << 5 | r >>> 27) + s + d[l];
                c += l < 20 ? 1518500249 + (o & n | ~o & a) : l < 40 ? 1859775393 + (o ^ n ^ a) : l < 60 ? (o & n | o & a | n & a) - 1894007588 : (o ^ n ^ a) - 899497514,
                  s = a,
                  a = n,
                  n = o << 30 | o >>> 2,
                  o = r,
                  r = c
              }
              i[0] = i[0] + r | 0,
                i[1] = i[1] + o | 0,
                i[2] = i[2] + n | 0,
                i[3] = i[3] + a | 0,
                i[4] = i[4] + s | 0
            },
            _doFinalize: function () {
              var e = this._data
                , t = e.words
                , i = 8 * this._nDataBytes
                , r = 8 * e.sigBytes;
              return t[r >>> 5] |= 128 << 24 - r % 32,
                t[14 + (64 + r >>> 9 << 4)] = Math.floor(i / 4294967296),
                t[15 + (64 + r >>> 9 << 4)] = i,
                e.sigBytes = 4 * t.length,
                this._process(),
                this._hash
            },
            clone: function () {
              var e = o.clone.call(this);
              return e._hash = this._hash.clone(),
                e
            }
          }),
          t.SHA1 = o._createHelper(a),
          t.HmacSHA1 = o._createHmacHelper(a),
          e.SHA1
      }
      ,
      "object" == typeof i ? t.exports = i = o(e("./core")) : "function" == typeof define && define.amd ? define(["./core"], o) : o(r.CryptoJS)
  }
    , {
    "./core": 125
  }]
}, {}, [6]);
// Aliyun OSS SDK for JavaScript v6.10.0
// Copyright Aliyun.com, Inc. or its affiliates. All Rights Reserved.
// License at https://github.com/ali-sdk/ali-oss/blob/master/LICENSE
!function (e) { if ("object" == typeof exports && "undefined" != typeof module) module.exports = e(); else if ("function" == typeof define && define.amd) define([], e); else { var t; t = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, t.OSS = e() } }(function () {
  var define, module, exports; return function () { function e(t, r, n) { function o(s, a) { if (!r[s]) { if (!t[s]) { var u = "function" == typeof require && require; if (!a && u) return u(s, !0); if (i) return i(s, !0); var c = new Error("Cannot find module '" + s + "'"); throw c.code = "MODULE_NOT_FOUND", c } var l = r[s] = { exports: {} }; t[s][0].call(l.exports, function (e) { return o(t[s][1][e] || e) }, l, l.exports, e, t, r, n) } return r[s].exports } for (var i = "function" == typeof require && require, s = 0; s < n.length; s++)o(n[s]); return o } return e }()({
    1: [function (e, t, r) { "use strict"; var n = e("./browser/client"); n.Buffer = e("buffer").Buffer, n.urllib = e("../shims/xhr"), n.version = e("./browser/version").version, t.exports = n }, { "../shims/xhr": 291, "./browser/client": 2, "./browser/version": 5, buffer: 73 }], 2: [function (e, t, r) { (function (r, n) { "use strict"; function o(e) { return e && e.__esModule ? e : { default: e } } function i() { var e = w.name, t = w.version; e && e.toLowerCase && "ie" === e.toLowerCase() && t.split(".")[0] < 10 && console.warn("ali-oss does not support the current browser") } function s() { return location && "https:" === location.protocol } function a(e, t) { if (i(), !(this instanceof a)) return new a(e, t); e && e.inited ? this.options = e : this.options = a.initOptions(e), this.options.cancelFlag = !1, this.options.urllib ? this.urllib = this.options.urllib : (this.urllib = E, this.agent = this.options.agent || A), this.ctx = t, this.userAgent = this._getUserAgent(), this.options.amendTimeSkewed = 0 } var u = e("babel-runtime/core-js/promise"), c = o(u), l = e("babel-runtime/regenerator"), f = o(l), p = e("babel-runtime/core-js/object/assign"), h = o(p), d = e("debug")("ali-oss"), m = e("copy-to"), b = e("xml2js"), y = e("agentkeepalive"), g = e("merge-descriptors"), v = e("url"), _ = e("is-type-of"), w = e("platform"), x = e("utility"), E = e("urllib"), T = e("./version"), S = e("bowser"), j = e("../common/signUtils"), O = e("../common/utils/isIP"), N = O.isIP, k = e("../common/client/initOptions"), I = e("../common/utils/createRequest"), C = I.createRequest, A = new y; t.exports = a, a.initOptions = function (e) { e.stsToken || console.warn("Please use STS Token for safety, see more details at https://help.aliyun.com/document_detail/32077.html"); var t = (0, h.default)({ secure: s(), useFetch: !1 }, e); return k(t) }; var D = a.prototype; D.debug = d, g(D, e("./object")), g(D, e("../common/bucket/getBucketWebsite")), g(D, e("../common/bucket/putBucketWebsite")), g(D, e("../common/bucket/deleteBucketWebsite")), g(D, e("../common/bucket/getBucketLifecycle")), g(D, e("../common/bucket/putBucketLifecycle")), g(D, e("../common/bucket/deleteBucketLifecycle")), g(D, e("../common/bucket/putBucketVersioning")), g(D, e("../common/bucket/getBucketVersioning")), g(D, e("./managed-upload")), g(D, e("../common/multipart")), g(D, e("../common/parallel")), D.signature = function (e) { return this.debug("authorization stringToSign: %s", e, "info"), j.computeSignature(this.options.accessKeySecret, e) }, D.authorization = function (e, t, r, n) { var o = j.buildCanonicalString(e.toUpperCase(), t, { headers: n, parameters: r }); return j.authorization(this.options.accessKeyId, this.options.accessKeySecret, o) }, D.request = function (e) { var t, r, n, o, i, s; return f.default.async(function (a) { for (; ;)switch (a.prev = a.next) { case 0: return t = C.call(this, e), this.options.useFetch || (t.params.mode = "disable-fetch"), r = void 0, n = void 0, o = !!e.stream, a.prev = 5, a.next = 8, f.default.awrap(this.urllib.request(t.url, t.params)); case 8: r = a.sent, this.debug("response %s %s, got %s, headers: %j", e.method, t.url, r.status, r.headers, "info"), a.next = 15; break; case 12: a.prev = 12, a.t0 = a.catch(5), n = a.t0; case 15: if (i = void 0, !r || !e.successStatuses || -1 !== e.successStatuses.indexOf(r.status)) { a.next = 28; break } return a.next = 19, f.default.awrap(this.requestError(r)); case 19: if (i = a.sent, "RequestTimeTooSkewed" !== i.code || o) { a.next = 25; break } return this.options.amendTimeSkewed = +new Date(i.serverTime) - new Date, a.next = 24, f.default.awrap(this.request(e)); case 24: return a.abrupt("return", a.sent); case 25: i.params = e, a.next = 32; break; case 28: if (!n) { a.next = 32; break } return a.next = 31, f.default.awrap(this.requestError(n)); case 31: i = a.sent; case 32: if (!i) { a.next = 34; break } throw i; case 34: if (!e.xmlResponse) { a.next = 39; break } return a.next = 37, f.default.awrap(this.parseXML(r.data)); case 37: s = a.sent, r.data = s; case 39: return a.abrupt("return", r); case 40: case "end": return a.stop() } }, null, this, [[5, 12]]) }, D._getResource = function (e) { var t = "/"; return e.bucket && (t += e.bucket + "/"), e.object && (t += e.object), t }, D._isIP = N, D._escape = function (e) { return x.encodeURIComponent(e).replace(/%2F/g, "/") }, D._getReqUrl = function (e) { var t = {}; m(this.options.endpoint).to(t); var r = this._isIP(t.hostname), n = this.options.cname; !e.bucket || n || r || (t.host = e.bucket + "." + t.host); var o = "/"; e.bucket && r && (o += e.bucket + "/"), e.object && (o += this._escape(e.object).replace(/\+/g, "%2B")), t.pathname = o; var i = {}; if (e.query && g(i, e.query), e.subres) { var s = {}; _.string(e.subres) ? s[e.subres] = "" : _.array(e.subres) ? e.subres.forEach(function (e) { s[e] = "" }) : s = e.subres, g(i, s) } return t.query = i, v.format(t) }, D._getUserAgent = function () { var e = n && n.browser ? "js" : "nodejs", t = "aliyun-sdk-" + e + "/" + T.version, r = w.description; return !r && n && (r = "Node.js " + n.version.slice(1) + " on " + n.platform + " " + n.arch), this._checkUserAgent(t + " " + r) }, D._checkUserAgent = function (e) { return e.replace(/\u03b1/, "alpha").replace(/\u03b2/, "beta") }, D.checkBrowserAndVersion = function (e, t) { return S.name === e && S.version.split(".")[0] === t }, D.parseXML = function (e) { return new c.default(function (t, n) { r.isBuffer(e) && (e = e.toString()), b.parseString(e, { explicitRoot: !1, explicitArray: !1 }, function (e, r) { e ? n(e) : t(r) }) }) }, D.requestError = function (e) { var t, r, n, o; return f.default.async(function (i) { for (; ;)switch (i.prev = i.next) { case 0: if (t = null, e.data && e.data.length) { i.next = 5; break } -1 === e.status || -2 === e.status ? (t = new Error(e.message), t.name = e.name, t.status = e.status, t.code = e.name) : (404 === e.status ? (t = new Error("Object not exists"), t.name = "NoSuchKeyError", t.status = 404, t.code = "NoSuchKey") : 412 === e.status ? (t = new Error("Pre condition failed"), t.name = "PreconditionFailedError", t.status = 412, t.code = "PreconditionFailed") : (t = new Error("Unknow error, status: " + e.status), t.name = "UnknowError", t.status = e.status), t.requestId = e.headers["x-oss-request-id"], t.host = ""), i.next = 33; break; case 5: return r = String(e.data), this.debug("request response error data: %s", r, "error"), n = void 0, i.prev = 8, i.next = 11, f.default.awrap(this.parseXML(r)); case 11: if (i.t0 = i.sent, i.t0) { i.next = 14; break } i.t0 = {}; case 14: n = i.t0, i.next = 24; break; case 17: return i.prev = 17, i.t1 = i.catch(8), this.debug(r, "error"), i.t1.message += "\nraw xml: " + r, i.t1.status = e.status, i.t1.requestId = e.headers["x-oss-request-id"], i.abrupt("return", i.t1); case 24: o = n.Message || "unknow request error, status: " + e.status, n.Condition && (o += " (condition: " + n.Condition + ")"), t = new Error(o), t.name = n.Code ? n.Code + "Error" : "UnknowError", t.status = e.status, t.code = n.Code, t.requestId = n.RequestId, t.hostId = n.HostId, t.serverTime = n.ServerTime; case 33: return this.debug("generate error %j", t, "error"), i.abrupt("return", t); case 35: case "end": return i.stop() } }, null, this, [[8, 17]]) } }).call(this, { isBuffer: e("../../node_modules/is-buffer/index.js") }, e("_process")) }, { "../../node_modules/is-buffer/index.js": 197, "../common/bucket/deleteBucketLifecycle": 6, "../common/bucket/deleteBucketWebsite": 7, "../common/bucket/getBucketLifecycle": 8, "../common/bucket/getBucketVersioning": 9, "../common/bucket/getBucketWebsite": 10, "../common/bucket/putBucketLifecycle": 11, "../common/bucket/putBucketVersioning": 12, "../common/bucket/putBucketWebsite": 13, "../common/client/initOptions": 15, "../common/multipart": 18, "../common/parallel": 33, "../common/signUtils": 34, "../common/utils/createRequest": 38, "../common/utils/isIP": 45, "./managed-upload": 3, "./object": 4, "./version": 5, _process: 208, agentkeepalive: 48, "babel-runtime/core-js/object/assign": 54, "babel-runtime/core-js/promise": 61, "babel-runtime/regenerator": 68, bowser: 70, "copy-to": 76, debug: 288, "is-type-of": 289, "merge-descriptors": 200, platform: 206, url: 238, urllib: 291, utility: 290, xml2js: 249 }], 3: [function (e, t, r) { (function (t) { "use strict"; function n(e) { return e && e.__esModule ? e : { default: e } } function o(e, t) { if (!(this instanceof o)) return new o(e, t); x.call(this, t), this.file = e, this.reader = new FileReader, this.start = 0, this.finish = !1, this.fileBuffer = null } var i = e("babel-runtime/core-js/array/from"), s = n(i), a = e("babel-runtime/core-js/promise"), u = n(a), c = e("babel-runtime/regenerator"), l = n(c), f = e("is-type-of"), p = e("util"), h = e("path"), d = e("mime"), m = e("copy-to"), b = e("../common/utils/isBlob"), y = b.isBlob, g = e("../common/utils/isFile"), v = g.isFile, _ = r; _.multipartUpload = function (e, t, r) { var n, o, i, s, a, u, c, f, p; return l.default.async(function (m) { for (; ;)switch (m.prev = m.next) { case 0: if (this.resetCancelFlag(), r = r || {}, !r.checkpoint || !r.checkpoint.uploadId) { m.next = 6; break } return m.next = 5, l.default.awrap(this._resumeMultipart(r.checkpoint, r)); case 5: return m.abrupt("return", m.sent); case 6: return n = 102400, r.mime || (v(t) ? r.mime = d.getType(h.extname(t.name)) : y(t) ? r.mime = t.type : r.mime = d.getType(h.extname(t))), r.headers = r.headers || {}, this._convertMetaToHeaders(r.meta, r.headers), m.next = 12, l.default.awrap(this._getFileSize(t)); case 12: if (!((o = m.sent) < n)) { m.next = 25; break } return i = this._createStream(t, 0, o), r.contentLength = o, m.next = 18, l.default.awrap(this.putStream(e, i, r)); case 18: if (s = m.sent, !r || !r.progress) { m.next = 22; break } return m.next = 22, l.default.awrap(r.progress(1)); case 22: return a = { res: s.res, bucket: this.options.bucket, name: e, etag: s.res.headers.etag }, (r.headers && r.headers["x-oss-callback"] || r.callback) && (a.data = s.data), m.abrupt("return", a); case 25: if (!r.partSize || parseInt(r.partSize, 10) === r.partSize) { m.next = 27; break } throw new Error("partSize must be int number"); case 27: if (!(r.partSize && r.partSize < n)) { m.next = 29; break } throw new Error("partSize must not be smaller than " + n); case 29: return m.next = 31, l.default.awrap(this.initMultipartUpload(e, r)); case 31: if (u = m.sent, c = u.uploadId, f = this._getPartSize(o, r.partSize), p = { file: t, name: e, fileSize: o, partSize: f, uploadId: c, doneParts: [] }, !r || !r.progress) { m.next = 38; break } return m.next = 38, l.default.awrap(r.progress(0, p, u.res)); case 38: return m.next = 40, l.default.awrap(this._resumeMultipart(p, r)); case 40: return m.abrupt("return", m.sent); case 41: case "end": return m.stop() } }, null, this) }, _._resumeMultipart = function (e, t) { var r, n, o, i, a, c, f, p, h, d, b, y, g, v, _, w, x, E; return l.default.async(function (T) { for (; ;)switch (T.prev = T.next) { case 0: if (r = this, !this.isCancel()) { T.next = 3; break } throw this._makeCancelEvent(); case 3: return n = e.file, o = e.fileSize, i = e.partSize, a = e.uploadId, c = e.doneParts, f = e.name, p = [], c.length > 0 && m(c).to(p), h = this._divideParts(o, i), d = h.length, b = !1, y = function (r, o) { var i = this; return new u.default(function (s, u) { var p, y, g, v; return l.default.async(function (i) { for (; ;)switch (i.prev = i.next) { case 0: if (i.prev = 0, r.isCancel()) { i.next = 18; break } return p = h[o - 1], y = { stream: r._createStream(n, p.start, p.end), size: p.end - p.start }, i.next = 6, l.default.awrap(r._uploadPart(f, a, o, y)); case 6: if (g = i.sent, r.isCancel() || b) { i.next = 15; break } if (e.doneParts.push({ number: o, etag: g.res.headers.etag }), !t.progress) { i.next = 12; break } return i.next = 12, l.default.awrap(t.progress(c.length / d, e, g.res)); case 12: s({ number: o, etag: g.res.headers.etag }), i.next = 16; break; case 15: s(); case 16: i.next = 19; break; case 18: s(); case 19: i.next = 30; break; case 21: i.prev = 21, i.t0 = i.catch(0), v = new Error, v.name = i.t0.name, v.message = i.t0.message, v.stack = i.t0.stack, v.partNum = o, m(i.t0).to(v), u(v); case 30: case "end": return i.stop() } }, null, i, [[0, 21]]) }) }, g = (0, s.default)(new Array(d), function (e, t) { return t + 1 }), v = p.map(function (e) { return e.number }), _ = g.filter(function (e) { return v.indexOf(e) < 0 }), w = 5, x = t.parallel || w, T.next = 17, l.default.awrap(this._parallel(_, x, function (e) { return new u.default(function (t, n) { y(r, e).then(function (e) { e && p.push(e), t() }).catch(function (e) { n(e) }) }) })); case 17: if (E = T.sent, b = !0, !this.isCancel()) { T.next = 22; break } throw y = null, this._makeCancelEvent(); case 22: if (!(E && E.length > 0)) { T.next = 25; break } throw E[0].message = "Failed to upload some parts with error: " + E[0].toString() + " part_num: " + E[0].partNum, E[0]; case 25: return T.next = 27, l.default.awrap(this.completeMultipartUpload(f, a, p, t)); case 27: return T.abrupt("return", T.sent); case 28: case "end": return T.stop() } }, null, this) }, _._getFileSize = function (e) { return l.default.async(function (t) { for (; ;)switch (t.prev = t.next) { case 0: if (!f.buffer(e)) { t.next = 4; break } return t.abrupt("return", e.length); case 4: if (!y(e) && !v(e)) { t.next = 6; break } return t.abrupt("return", e.size); case 6: throw new Error("_getFileSize requires Buffer/File/Blob."); case 7: case "end": return t.stop() } }, null, this) }; var w = e("stream"), x = w.Readable; p.inherits(o, x), o.prototype.readFileAndPush = function (e) { if (this.fileBuffer) for (var t = !0; t && this.fileBuffer && this.start < this.fileBuffer.length;) { var r = this.start, n = r + e; n = n > this.fileBuffer.length ? this.fileBuffer.length : n, this.start = n, t = this.push(this.fileBuffer.slice(r, n)) } }, o.prototype._read = function (e) { if (this.file && this.start >= this.file.size || this.fileBuffer && this.start >= this.fileBuffer.length || this.finish || 0 === this.start && !this.file) return this.finish || (this.fileBuffer = null, this.finish = !0), void this.push(null); e = e || 16384; var r = this; this.reader.onload = function (n) { r.fileBuffer = t.from(new Uint8Array(n.target.result)), r.file = null, r.readFileAndPush(e) }, 0 === this.start ? this.reader.readAsArrayBuffer(this.file) : this.readFileAndPush(e) }, _._createStream = function (e, t, r) { if (y(e) || v(e)) return new o(e.slice(t, r)); throw new Error("_createStream requires File/Blob.") }, _._getPartSize = function (e, t) { return t ? Math.max(Math.ceil(e / 1e4), t) : 1048576 }, _._divideParts = function (e, t) { for (var r = Math.ceil(e / t), n = [], o = 0; o < r; o++) { var i = t * o, s = Math.min(i + t, e); n.push({ start: i, end: s }) } return n } }).call(this, e("buffer").Buffer) }, { "../common/utils/isBlob": 43, "../common/utils/isFile": 44, "babel-runtime/core-js/array/from": 52, "babel-runtime/core-js/promise": 61, "babel-runtime/regenerator": 68, buffer: 73, "copy-to": 76, "is-type-of": 289, mime: 202, path: 205, stream: 230, util: 243 }], 4: [function (e, t, r) { "use strict"; function n(e) { return e && e.__esModule ? e : { default: e } } var o = e("babel-runtime/core-js/promise"), i = n(o), s = e("babel-runtime/core-js/object/keys"), a = n(s), u = e("babel-runtime/core-js/object/assign"), c = n(u), l = e("babel-runtime/regenerator"), f = n(l), p = e("utility"), h = e("fs"), d = e("is-type-of"), m = e("url"), b = e("copy-to"), y = e("path"), g = e("mime"), v = e("../common/callback"), _ = e("../common/signUtils"), w = e("merge-descriptors"), x = e("../common/utils/isBlob"), E = x.isBlob, T = e("../common/utils/isFile"), S = T.isFile, j = r; j.append = function (e, t, r) { var n; return f.default.async(function (o) { for (; ;)switch (o.prev = o.next) { case 0: return r = r || {}, void 0 === r.position && (r.position = "0"), r.subres = { append: "", position: r.position }, r.method = "POST", o.next = 6, f.default.awrap(this.put(e, t, r)); case 6: return n = o.sent, n.nextAppendPosition = n.res.headers["x-oss-next-append-position"], o.abrupt("return", n); case 9: case "end": return o.stop() } }, null, this) }, j.put = function (e, t, r) { var n, o, i, s, a, u, c; return f.default.async(function (l) { for (; ;)switch (l.prev = l.next) { case 0: if (n = void 0, r = r || {}, e = this._objectName(e), !d.buffer(t)) { l.next = 7; break } n = t, l.next = 33; break; case 7: if (!E(t) && !S(t)) { l.next = 32; break } return r.mime || (S(t) ? r.mime = g.getType(y.extname(t.name)) : r.mime = t.type), o = this._createStream(t, 0, t.size), l.next = 12, f.default.awrap(this._getFileSize(t)); case 12: return r.contentLength = l.sent, l.prev = 13, l.next = 16, f.default.awrap(this.putStream(e, o, r)); case 16: return i = l.sent, l.abrupt("return", i); case 20: if (l.prev = 20, l.t0 = l.catch(13), "RequestTimeTooSkewed" !== l.t0.code) { l.next = 29; break } return this.options.amendTimeSkewed = +new Date(l.t0.serverTime) - new Date, l.next = 26, f.default.awrap(this.put(e, t, r)); case 26: return l.abrupt("return", l.sent); case 29: throw l.t0; case 30: l.next = 33; break; case 32: throw new TypeError("Must provide Buffer/Blob/File for put."); case 33: return r.headers = r.headers || {}, this._convertMetaToHeaders(r.meta, r.headers), s = r.method || "PUT", a = this._objectRequestParams(s, e, r), v.encodeCallback(a, r), a.mime = r.mime, a.content = n, a.successStatuses = [200], l.next = 43, f.default.awrap(this.request(a)); case 43: return u = l.sent, c = { name: e, url: this._objectUrl(e), res: u.res }, a.headers && a.headers["x-oss-callback"] && (c.data = JSON.parse(u.data.toString())), l.abrupt("return", c); case 47: case "end": return l.stop() } }, null, this, [[13, 20]]) }, j.putStream = function (e, t, r) { var n, o, i, s; return f.default.async(function (a) { for (; ;)switch (a.prev = a.next) { case 0: return r = r || {}, r.headers = r.headers || {}, e = this._objectName(e), r.contentLength ? r.headers["Content-Length"] = r.contentLength : r.headers["Transfer-Encoding"] = "chunked", this._convertMetaToHeaders(r.meta, r.headers), n = r.method || "PUT", o = this._objectRequestParams(n, e, r), v.encodeCallback(o, r), o.mime = r.mime, o.stream = t, o.successStatuses = [200], a.next = 13, f.default.awrap(this.request(o)); case 13: return i = a.sent, s = { name: e, url: this._objectUrl(e), res: i.res }, o.headers && o.headers["x-oss-callback"] && (s.data = JSON.parse(i.data.toString())), a.abrupt("return", s); case 17: case "end": return a.stop() } }, null, this) }, w(j, e("../common/object/copyObject")), w(j, e("../common/object/getObjectTagging")), w(j, e("../common/object/putObjectTagging")), w(j, e("../common/object/deleteObjectTagging")), w(j, e("../common/image")), w(j, e("../common/object/getBucketVersions")), w(j, e("../common/object/getACL")), w(j, e("../common/object/putACL")), w(j, e("../common/object/head")), w(j, e("../common/object/delete")), w(j, e("../common/object/get")), w(j, e("../common/object/putSymlink")), w(j, e("../common/object/getSymlink")), w(j, e("../common/object/deleteMulti")), w(j, e("../common/object/getObjectMeta")), j.putMeta = function (e, t, r) { var n; return f.default.async(function (o) { for (; ;)switch (o.prev = o.next) { case 0: return o.next = 2, f.default.awrap(this.copy(e, e, { meta: t || {}, timeout: r && r.timeout, ctx: r && r.ctx })); case 2: return n = o.sent, o.abrupt("return", n); case 4: case "end": return o.stop() } }, null, this) }, j.list = function (e, t) { var r, n, o, i, s; return f.default.async(function (a) { for (; ;)switch (a.prev = a.next) { case 0: return r = this._objectRequestParams("GET", "", t), r.query = e, r.xmlResponse = !0, r.successStatuses = [200], a.next = 6, f.default.awrap(this.request(r)); case 6: return n = a.sent, o = n.data.Contents, i = this, o && (Array.isArray(o) || (o = [o]), o = o.map(function (e) { return { name: e.Key, url: i._objectUrl(e.Key), lastModified: e.LastModified, etag: e.ETag, type: e.Type, size: Number(e.Size), storageClass: e.StorageClass, owner: { id: e.Owner.ID, displayName: e.Owner.DisplayName } } })), s = n.data.CommonPrefixes || null, s && (Array.isArray(s) || (s = [s]), s = s.map(function (e) { return e.Prefix })), a.abrupt("return", { res: n.res, objects: o, prefixes: s, nextMarker: n.data.NextMarker || null, isTruncated: "true" === n.data.IsTruncated }); case 13: case "end": return a.stop() } }, null, this) }, j.restore = function (e, t) { var r, n; return f.default.async(function (o) { for (; ;)switch (o.prev = o.next) { case 0: return t = t || {}, t.subres = (0, c.default)({ restore: "" }, t.subres), t.versionId && (t.subres.versionId = t.versionId), r = this._objectRequestParams("POST", e, t), r.successStatuses = [202], o.next = 7, f.default.awrap(this.request(r)); case 7: return n = o.sent, o.abrupt("return", { res: n.res }); case 9: case "end": return o.stop() } }, null, this) }, j.signatureUrl = function (e, t) { t = t || {}, e = this._objectName(e), t.method = t.method || "GET"; var r = p.timestamp() + (t.expires || 1800), n = { bucket: this.options.bucket, object: e }, o = this._getResource(n); this.options.stsToken && (t["security-token"] = this.options.stsToken); var i = _._signatureForURL(this.options.accessKeySecret, t, o, r), s = m.parse(this._getReqUrl(n)); return s.query = { OSSAccessKeyId: this.options.accessKeyId, Expires: r, Signature: i.Signature }, b(i.subResource).to(s.query), s.format() }, j.getObjectUrl = function (e, t) { return t ? "/" !== t[t.length - 1] && (t += "/") : t = this.options.endpoint.format(), t + this._escape(this._objectName(e)) }, j._objectUrl = function (e) { return this._getReqUrl({ bucket: this.options.bucket, object: e }) }, j.generateObjectUrl = function (e, t) { if (t) "/" !== t[t.length - 1] && (t += "/"); else { t = this.options.endpoint.format(); var r = m.parse(t), n = this.options.bucket; r.hostname = n + "." + r.hostname, r.host = n + "." + r.host, t = r.format() } return t + this._escape(this._objectName(e)) }, j._objectRequestParams = function (e, t, r) { if (!this.options.bucket) throw new Error("Please create a bucket first"); r = r || {}, t = this._objectName(t); var n = { object: t, bucket: this.options.bucket, method: e, subres: r && r.subres, timeout: r && r.timeout, ctx: r && r.ctx }; return r.headers && (n.headers = {}, b(r.headers).to(n.headers)), n }, j._objectName = function (e) { return e.replace(/^\/+/, "") }, j._convertMetaToHeaders = function (e, t) { e && (0, a.default)(e).forEach(function (r) { t["x-oss-meta-" + r] = e[r] }) }, j._deleteFileSafe = function (e) { var t = this; return new i.default(function (r) { h.exists(e, function (n) { n ? h.unlink(e, function (n) { n && t.debug("unlink %j error: %s", e, n, "error"), r() }) : r() }) }) } }, { "../common/callback": 14, "../common/image": 16, "../common/object/copyObject": 19, "../common/object/delete": 20, "../common/object/deleteMulti": 21, "../common/object/deleteObjectTagging": 22, "../common/object/get": 23, "../common/object/getACL": 24, "../common/object/getBucketVersions": 25, "../common/object/getObjectMeta": 26, "../common/object/getObjectTagging": 27, "../common/object/getSymlink": 28, "../common/object/head": 29, "../common/object/putACL": 30, "../common/object/putObjectTagging": 31, "../common/object/putSymlink": 32, "../common/signUtils": 34, "../common/utils/isBlob": 43, "../common/utils/isFile": 44, "babel-runtime/core-js/object/assign": 54, "babel-runtime/core-js/object/keys": 60, "babel-runtime/core-js/promise": 61, "babel-runtime/regenerator": 68, "copy-to": 76, fs: 71, "is-type-of": 289, "merge-descriptors": 200, mime: 202, path: 205, url: 238, utility: 290 }], 5: [function (e, t, r) { "use strict"; r.version = "6.10.0" }, {}], 6: [function (e, t, r) { "use strict"; var n = e("babel-runtime/regenerator"), o = function (e) { return e && e.__esModule ? e : { default: e } }(n), i = e("../utils/checkBucketName"), s = i.checkBucketName; r.deleteBucketLifecycle = function (e, t) { var r, n; return o.default.async(function (i) { for (; ;)switch (i.prev = i.next) { case 0: return s(e), r = this._bucketRequestParams("DELETE", e, "lifecycle", t), r.successStatuses = [204], i.next = 5, o.default.awrap(this.request(r)); case 5: return n = i.sent, i.abrupt("return", { res: n.res }); case 7: case "end": return i.stop() } }, null, this) } }, { "../utils/checkBucketName": 35, "babel-runtime/regenerator": 68 }], 7: [function (e, t, r) { "use strict"; var n = e("babel-runtime/regenerator"), o = function (e) { return e && e.__esModule ? e : { default: e } }(n), i = e("../utils/checkBucketName"), s = i.checkBucketName; r.deleteBucketWebsite = function (e, t) { var r, n; return o.default.async(function (i) { for (; ;)switch (i.prev = i.next) { case 0: return s(e), r = this._bucketRequestParams("DELETE", e, "website", t), r.successStatuses = [204], i.next = 5, o.default.awrap(this.request(r)); case 5: return n = i.sent, i.abrupt("return", { res: n.res }); case 7: case "end": return i.stop() } }, null, this) } }, { "../utils/checkBucketName": 35, "babel-runtime/regenerator": 68 }], 8: [function (e, t, r) { "use strict"; var n = e("babel-runtime/regenerator"), o = function (e) { return e && e.__esModule ? e : { default: e } }(n), i = e("../utils/checkBucketName"), s = i.checkBucketName, a = e("../utils/isArray"), u = a.isArray, c = e("../utils/formatObjKey"), l = c.formatObjKey; r.getBucketLifecycle = function (e, t) { var r, n, i; return o.default.async(function (a) { for (; ;)switch (a.prev = a.next) { case 0: return s(e), r = this._bucketRequestParams("GET", e, "lifecycle", t), r.successStatuses = [200], r.xmlResponse = !0, a.next = 6, o.default.awrap(this.request(r)); case 6: return n = a.sent, i = n.data.Rule || null, i && (u(i) || (i = [i]), i = i.map(function (e) { return e.ID && (e.id = e.ID, delete e.ID), e.Tag && !u(e.Tag) && (e.Tag = [e.Tag]), l(e, "firstLowerCase") })), a.abrupt("return", { rules: i, res: n.res }); case 10: case "end": return a.stop() } }, null, this) } }, { "../utils/checkBucketName": 35, "../utils/formatObjKey": 40, "../utils/isArray": 42, "babel-runtime/regenerator": 68 }], 9: [function (e, t, r) { "use strict"; var n = e("babel-runtime/regenerator"), o = function (e) { return e && e.__esModule ? e : { default: e } }(n), i = e("../utils/checkBucketName"), s = i.checkBucketName; r.getBucketVersioning = function (e, t) { var r, n, i; return o.default.async(function (a) { for (; ;)switch (a.prev = a.next) { case 0: return s(e), r = this._bucketRequestParams("GET", e, "versioning", t), r.xmlResponse = !0, r.successStatuses = [200], a.next = 6, o.default.awrap(this.request(r)); case 6: return n = a.sent, i = n.data.Status, a.abrupt("return", { status: n.status, versionStatus: i, res: n.res }); case 9: case "end": return a.stop() } }, null, this) } }, { "../utils/checkBucketName": 35, "babel-runtime/regenerator": 68 }], 10: [function (e, t, r) { "use strict"; var n = e("babel-runtime/regenerator"), o = function (e) { return e && e.__esModule ? e : { default: e } }(n), i = e("../utils/checkBucketName"), s = i.checkBucketName, a = e("../utils/isObject"), u = a.isObject; r.getBucketWebsite = function (e, t) { var r, n, i; return o.default.async(function (a) { for (; ;)switch (a.prev = a.next) { case 0: return s(e), r = this._bucketRequestParams("GET", e, "website", t), r.successStatuses = [200], r.xmlResponse = !0, a.next = 6, o.default.awrap(this.request(r)); case 6: return n = a.sent, i = [], n.data.RoutingRules && n.data.RoutingRules.RoutingRule && (i = u(n.data.RoutingRules.RoutingRule) ? [n.data.RoutingRules.RoutingRule] : n.data.RoutingRules.RoutingRule), a.abrupt("return", { index: n.data.IndexDocument && n.data.IndexDocument.Suffix || "", supportSubDir: n.data.IndexDocument && n.data.IndexDocument.SupportSubDir || "false", type: n.data.IndexDocument && n.data.IndexDocument.Type, routingRules: i, error: n.data.ErrorDocument && n.data.ErrorDocument.Key || null, res: n.res }); case 10: case "end": return a.stop() } }, null, this) } }, { "../utils/checkBucketName": 35, "../utils/isObject": 46, "babel-runtime/regenerator": 68 }], 11: [function (e, t, r) { "use strict"; function n(e) { e.days && (e.expiration = { days: e.days }), e.date && (e.expiration = { createdBeforeDate: e.date }) } function o(e, t) { var r = e.days, n = e.createdBeforeDate; if (!r && !n) throw new Error(t + " must includes days or createdBeforeDate"); if (r && !/^[1-9][0-9]*$/.test(r)) throw new Error("days must be a positive integer"); if (n && !/\d{4}-\d{2}-\d{2}T00:00:00.000Z/.test(n)) throw new Error("createdBeforeDate must be date and conform to iso8601 format") } function i(e) { if (!p(e) && !b(e)) throw new Error("tag must be Object or Array"); e = b(e) ? [e] : e; var t = {}; d(e).forEach(function (e) { t[e.key] = e.value }), _(t) } function s(e) { if (e.id && x(e.id) > 255) throw new Error("ID is composed of 255 bytes at most"); if ("" === e.prefix || void 0 === e.prefix) throw new Error("Rule must includes prefix"); if (!["Enabled", "Disabled"].includes(e.status)) throw new Error("Status must be  Enabled or Disabled"); if (e.transition) { if (!["IA", "Archive"].includes(e.transition.storageClass)) throw new Error("StorageClass must be  IA or Archive"); o(e.transition, "Transition") } if (e.expiration) if (e.expiration.expiredObjectDeleteMarker) { if (e.expiration.days || e.expiration.createdBeforeDate) throw new Error("expiredObjectDeleteMarker cannot be used with days or createdBeforeDate") } else o(e.expiration, "Expiration"); if (e.abortMultipartUpload && o(e.abortMultipartUpload, "AbortMultipartUpload"), !(e.expiration || e.abortMultipartUpload || e.transition || e.noncurrentVersionTransition)) throw new Error("Rule must includes expiration or abortMultipartUpload or transition or noncurrentVersionTransition"); if (e.tag) { if (e.abortMultipartUpload) throw new Error("Tag cannot be used with abortMultipartUpload"); i(e.tag) } } var a = e("babel-runtime/regenerator"), u = function (e) { return e && e.__esModule ? e : { default: e } }(a), c = e("../utils/checkBucketName"), l = c.checkBucketName, f = e("../utils/isArray"), p = f.isArray, h = e("../utils/deepCopy"), d = h.deepCopy, m = e("../utils/isObject"), b = m.isObject, y = e("../utils/obj2xml"), g = y.obj2xml, v = e("../utils/checkObjectTag"), _ = v.checkObjectTag, w = e("../utils/getStrBytesCount"), x = w.getStrBytesCount; r.putBucketLifecycle = function (e, t, r) { var o, i, a, c, f; return u.default.async(function (h) { for (; ;)switch (h.prev = h.next) { case 0: if (l(e), p(t)) { h.next = 3; break } throw new Error("rules must be Array"); case 3: return o = this._bucketRequestParams("PUT", e, "lifecycle", r), i = [], a = { LifecycleConfiguration: { Rule: i } }, t.forEach(function (e) { n(e), s(e), e.id && (e.ID = e.id, delete e.id), i.push(e) }), c = g(a, { headers: !0, firstUpperCase: !0 }), o.content = c, o.mime = "xml", o.successStatuses = [200], h.next = 13, u.default.awrap(this.request(o)); case 13: return f = h.sent, h.abrupt("return", { res: f.res }); case 15: case "end": return h.stop() } }, null, this) } }, { "../utils/checkBucketName": 35, "../utils/checkObjectTag": 36, "../utils/deepCopy": 39, "../utils/getStrBytesCount": 41, "../utils/isArray": 42, "../utils/isObject": 46, "../utils/obj2xml": 47, "babel-runtime/regenerator": 68 }], 12: [function (e, t, r) { "use strict"; var n = e("babel-runtime/regenerator"), o = function (e) { return e && e.__esModule ? e : { default: e } }(n), i = e("../utils/checkBucketName"), s = i.checkBucketName, a = e("../utils/obj2xml"), u = a.obj2xml; r.putBucketVersioning = function (e, t) { var r, n, i, a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}; return o.default.async(function (c) { for (; ;)switch (c.prev = c.next) { case 0: if (s(e), ["Enabled", "Suspended"].includes(t)) { c.next = 3; break } throw new Error("status must be Enabled or Suspended"); case 3: return r = this._bucketRequestParams("PUT", e, "versioning", a), n = { VersioningConfiguration: { Status: t } }, r.mime = "xml", r.content = u(n, { headers: !0 }), c.next = 9, o.default.awrap(this.request(r)); case 9: return i = c.sent, c.abrupt("return", { res: i.res, status: i.status }); case 11: case "end": return c.stop() } }, null, this) } }, { "../utils/checkBucketName": 35, "../utils/obj2xml": 47, "babel-runtime/regenerator": 68 }], 13: [function (e, t, r) { "use strict"; var n = e("babel-runtime/regenerator"), o = function (e) { return e && e.__esModule ? e : { default: e } }(n), i = e("../utils/checkBucketName"), s = i.checkBucketName, a = e("../utils/obj2xml"), u = a.obj2xml, c = e("../utils/isArray"), l = c.isArray; r.putBucketWebsite = function (e) { var t, r, n, i, a, c = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, f = arguments[2]; return o.default.async(function (p) { for (; ;)switch (p.prev = p.next) { case 0: if (s(e), t = this._bucketRequestParams("PUT", e, "website", f), r = { Suffix: c.index || "index.html" }, n = { IndexDocument: r }, i = { WebsiteConfiguration: n }, c.supportSubDir && (r.SupportSubDir = c.supportSubDir), c.type && (r.Type = c.type), c.error && (n.ErrorDocument = { Key: c.error }), void 0 === c.routingRules) { p.next = 12; break } if (l(c.routingRules)) { p.next = 11; break } throw new Error("RoutingRules must be Array"); case 11: n.RoutingRules = { RoutingRule: c.routingRules }; case 12: return i = u(i), t.content = i, t.mime = "xml", t.successStatuses = [200], p.next = 18, o.default.awrap(this.request(t)); case 18: return a = p.sent, p.abrupt("return", { res: a.res }); case 20: case "end": return p.stop() } }, null, this) } }, { "../utils/checkBucketName": 35, "../utils/isArray": 42, "../utils/obj2xml": 47, "babel-runtime/regenerator": 68 }], 14: [function (e, t, r) { (function (t) { "use strict"; function n(e) { return e && e.__esModule ? e : { default: e } } var o = e("babel-runtime/core-js/object/keys"), i = n(o), s = e("babel-runtime/core-js/json/stringify"), a = n(s); r.encodeCallback = function (e, r) { if (e.headers = e.headers || {}, !Object.prototype.hasOwnProperty.call(e.headers, "x-oss-callback") && r.callback) { var n = { callbackUrl: encodeURI(r.callback.url), callbackBody: r.callback.body }; r.callback.host && (n.callbackHost = r.callback.host), r.callback.contentType && (n.callbackBodyType = r.callback.contentType); var o = t.from((0, a.default)(n)).toString("base64"); if (e.headers["x-oss-callback"] = o, r.callback.customValue) { var s = {}; (0, i.default)(r.callback.customValue).forEach(function (e) { s["x:" + e] = r.callback.customValue[e] }), e.headers["x-oss-callback-var"] = t.from((0, a.default)(s)).toString("base64") } } } }).call(this, e("buffer").Buffer) }, { "babel-runtime/core-js/json/stringify": 53, "babel-runtime/core-js/object/keys": 60, buffer: 73 }], 15: [function (e, t, r) {
      "use strict"; function n(e, t) { var r = u.parse(e); if (r.protocol || (r = u.parse("http" + (t ? "s" : "") + "://" + e)), "http:" !== r.protocol && "https:" !== r.protocol) throw new Error("Endpoint protocol must be http or https."); return r } function o(e, t, r) { var n = r ? "https://" : "http://", o = t ? "-internal.aliyuncs.com" : ".aliyuncs.com"; return "vpc100-oss-cn-" === e.substr(0, "vpc100-oss-cn-".length) && (o = ".aliyuncs.com"), u.parse(n + e + o) } var i = e("babel-runtime/core-js/object/assign"), s = function (e) { return e && e.__esModule ? e : { default: e } }(i), a = e("humanize-ms"), u = e("url"), c = e("../utils/checkBucketName"), l = c.checkBucketName; t.exports = function (e) {
        if (!e || !e.accessKeyId || !e.accessKeySecret) throw new Error("require accessKeyId, accessKeySecret"); e.bucket && l(e.bucket); var t = (0, s.default)({ region: "oss-cn-hangzhou", internal: !1, secure: !1, timeout: 6e4, bucket: null, endpoint: null, cname: !1, isRequestPay: !1, sldEnable: !1 }, e); if (t.accessKeyId = t.accessKeyId.trim(), t.accessKeySecret = t.accessKeySecret.trim(), t.timeout && (t.timeout = a(t.timeout)), t.endpoint) t.endpoint = n(t.endpoint, t.secure); else { if (!t.region) throw new Error("require options.endpoint or options.region"); t.endpoint = o(t.region, t.internal, t.secure) } return t.inited = !0, t
      }
    }, { "../utils/checkBucketName": 35, "babel-runtime/core-js/object/assign": 54, "humanize-ms": 194, url: 238 }], 16: [function (e, t, r) { "use strict"; e("merge-descriptors")(r, e("./processObjectSave")) }, { "./processObjectSave": 17, "merge-descriptors": 200 }], 17: [function (e, t, r) { "use strict"; function n(e, t) { if (!e) throw new Error(t + " is required"); if ("string" != typeof e) throw new Error(t + " must be String") } var o = e("babel-runtime/regenerator"), i = function (e) { return e && e.__esModule ? e : { default: e } }(o), s = e("../utils/checkBucketName"), a = s.checkBucketName, u = e("querystring"), c = e("js-base64"), l = c.Base64.encode; r.processObjectSave = function (e, t, r, o) { var s, c, f, p; return i.default.async(function (h) { for (; ;)switch (h.prev = h.next) { case 0: return n(e, "sourceObject"), n(t, "targetObject"), n(r, "process"), t = this._objectName(t), o && a(o), s = this._objectRequestParams("POST", e, { subres: "x-oss-process" }), c = o ? ",b_" + l(o) : "", t = l(t), f = { "x-oss-process": r + "|sys/saveas,o_" + t + c }, s.content = u.stringify(f), h.next = 12, i.default.awrap(this.request(s)); case 12: return p = h.sent, h.abrupt("return", { res: p.res, status: p.res.status }); case 14: case "end": return h.stop() } }, null, this) } }, { "../utils/checkBucketName": 35, "babel-runtime/regenerator": 68, "js-base64": 199, querystring: 212 }], 18: [function (e, t, r) { "use strict"; var n = e("babel-runtime/regenerator"), o = function (e) { return e && e.__esModule ? e : { default: e } }(n), i = e("copy-to"), s = e("./callback"), a = e("./utils/deepCopy"), u = a.deepCopy, c = r; c.listUploads = function (e, t) { var r, n, s, a; return o.default.async(function (u) { for (; ;)switch (u.prev = u.next) { case 0: return t = t || {}, r = {}, i(t).to(r), r.subres = "uploads", n = this._objectRequestParams("GET", "", r), n.query = e, n.xmlResponse = !0, n.successStatuses = [200], u.next = 10, o.default.awrap(this.request(n)); case 10: return s = u.sent, a = s.data.Upload || [], Array.isArray(a) || (a = [a]), a = a.map(function (e) { return { name: e.Key, uploadId: e.UploadId, initiated: e.Initiated } }), u.abrupt("return", { res: s.res, uploads: a, bucket: s.data.Bucket, nextKeyMarker: s.data.NextKeyMarker, nextUploadIdMarker: s.data.NextUploadIdMarker, isTruncated: "true" === s.data.IsTruncated }); case 15: case "end": return u.stop() } }, null, this) }, c.listParts = function (e, t, r, n) { var s, a, u; return o.default.async(function (c) { for (; ;)switch (c.prev = c.next) { case 0: return n = n || {}, s = {}, i(n).to(s), s.subres = { uploadId: t }, a = this._objectRequestParams("GET", e, s), a.query = r, a.xmlResponse = !0, a.successStatuses = [200], c.next = 10, o.default.awrap(this.request(a)); case 10: return u = c.sent, c.abrupt("return", { res: u.res, uploadId: u.data.UploadId, bucket: u.data.Bucket, name: u.data.Key, partNumberMarker: u.data.PartNumberMarker, nextPartNumberMarker: u.data.NextPartNumberMarker, maxParts: u.data.MaxParts, isTruncated: u.data.IsTruncated, parts: u.data.Part || [] }); case 12: case "end": return c.stop() } }, null, this) }, c.abortMultipartUpload = function (e, t, r) { var n, s, a; return o.default.async(function (u) { for (; ;)switch (u.prev = u.next) { case 0: return this._stop(), r = r || {}, n = {}, i(r).to(n), n.subres = { uploadId: t }, s = this._objectRequestParams("DELETE", e, n), s.successStatuses = [204], u.next = 9, o.default.awrap(this.request(s)); case 9: return a = u.sent, u.abrupt("return", { res: a.res }); case 11: case "end": return u.stop() } }, null, this) }, c.initMultipartUpload = function (e, t) { var r, n, s; return o.default.async(function (a) { for (; ;)switch (a.prev = a.next) { case 0: return t = t || {}, r = {}, i(t).to(r), r.headers = r.headers || {}, this._convertMetaToHeaders(t.meta, r.headers), r.subres = "uploads", n = this._objectRequestParams("POST", e, r), n.mime = t.mime, n.xmlResponse = !0, n.successStatuses = [200], a.next = 12, o.default.awrap(this.request(n)); case 12: return s = a.sent, a.abrupt("return", { res: s.res, bucket: s.data.Bucket, name: s.data.Key, uploadId: s.data.UploadId }); case 14: case "end": return a.stop() } }, null, this) }, c.uploadPart = function (e, t, r, n, i, s, a) { var u; return o.default.async(function (c) { for (; ;)switch (c.prev = c.next) { case 0: return u = { stream: this._createStream(n, i, s), size: s - i }, c.next = 3, o.default.awrap(this._uploadPart(e, t, r, u, a)); case 3: return c.abrupt("return", c.sent); case 4: case "end": return c.stop() } }, null, this) }, c.completeMultipartUpload = function (e, t, r, n) { var i, a, c, l, f, p, h, d; return o.default.async(function (m) { for (; ;)switch (m.prev = m.next) { case 0: for (i = r.concat().sort(function (e, t) { return e.number - t.number }).filter(function (e, t, r) { return !t || e.number !== r[t - 1].number }), a = '<?xml version="1.0" encoding="UTF-8"?>\n<CompleteMultipartUpload>\n', c = 0; c < i.length; c++)l = i[c], a += "<Part>\n", a += "<PartNumber>" + l.number + "</PartNumber>\n", a += "<ETag>" + l.etag + "</ETag>\n", a += "</Part>\n"; return a += "</CompleteMultipartUpload>", n = n || {}, f = {}, f = u(n), f.headers && delete f.headers["x-oss-server-side-encryption"], f.subres = { uploadId: t }, p = this._objectRequestParams("POST", e, f), s.encodeCallback(p, f), p.mime = "xml", p.content = a, p.headers && p.headers["x-oss-callback"] || (p.xmlResponse = !0), p.successStatuses = [200], m.next = 17, o.default.awrap(this.request(p)); case 17: return h = m.sent, d = { res: h.res, bucket: p.bucket, name: e, etag: h.res.headers.etag }, p.headers && p.headers["x-oss-callback"] && (d.data = JSON.parse(h.data.toString())), m.abrupt("return", d); case 21: case "end": return m.stop() } }, null, this) }, c._uploadPart = function (e, t, r, n, s) { var a, u, c; return o.default.async(function (l) { for (; ;)switch (l.prev = l.next) { case 0: return s = s || {}, a = {}, i(s).to(a), a.headers = { "Content-Length": n.size }, a.subres = { partNumber: r, uploadId: t }, u = this._objectRequestParams("PUT", e, a), u.mime = a.mime, u.stream = n.stream, u.successStatuses = [200], l.next = 11, o.default.awrap(this.request(u)); case 11: if (c = l.sent, c.res.headers.etag) { l.next = 14; break } throw new Error("Please set the etag of expose-headers in OSS \n https://help.aliyun.com/document_detail/32069.html"); case 14: return n.stream = null, u.stream = null, l.abrupt("return", { name: e, etag: c.res.headers.etag, res: c.res }); case 17: case "end": return l.stop() } }, null, this) } }, { "./callback": 14, "./utils/deepCopy": 39, "babel-runtime/regenerator": 68, "copy-to": 76 }], 19: [function (e, t, r) { "use strict"; function n(e) { return e && e.__esModule ? e : { default: e } } var o = e("babel-runtime/regenerator"), i = n(o), s = e("babel-runtime/core-js/object/keys"), a = n(s), u = e("babel-runtime/helpers/typeof"), c = n(u), l = e("../utils/checkBucketName"), f = l.checkBucketName, p = r; p.copy = function (e, t, r, n) { var o, s, u; return i.default.async(function (l) { for (; ;)switch (l.prev = l.next) { case 0: return "object" === (void 0 === r ? "undefined" : (0, c.default)(r)) && (n = r), n = n || {}, n.headers = n.headers || {}, (0, a.default)(n.headers).forEach(function (e) { n.headers["x-oss-copy-source-" + e.toLowerCase()] = n.headers[e] }), n.meta && (n.headers["x-oss-metadata-directive"] = "REPLACE"), this._convertMetaToHeaders(n.meta, n.headers), t = this._getSourceName(t, r), n.versionId && (t = t + "?versionId=" + n.versionId), n.headers["x-oss-copy-source"] = t, o = this._objectRequestParams("PUT", e, n), o.xmlResponse = !0, o.successStatuses = [200, 304], l.next = 14, i.default.awrap(this.request(o)); case 14: return s = l.sent, u = s.data, u && (u = { etag: u.ETag, lastModified: u.LastModified }), l.abrupt("return", { data: u, res: s.res }); case 18: case "end": return l.stop() } }, null, this) }, p._getSourceName = function (e, t) { return "string" == typeof t ? e = this._objectName(e) : "/" !== e[0] ? t = this.options.bucket : (t = e.replace(/\/(.+?)(\/.*)/, "$1"), e = e.replace(/(\/.+?\/)(.*)/, "$2")), f(t), e = encodeURI(e), e = "/" + t + "/" + e } }, { "../utils/checkBucketName": 35, "babel-runtime/core-js/object/keys": 60, "babel-runtime/helpers/typeof": 67, "babel-runtime/regenerator": 68 }], 20: [function (e, t, r) { "use strict"; function n(e) { return e && e.__esModule ? e : { default: e } } var o = e("babel-runtime/regenerator"), i = n(o), s = e("babel-runtime/core-js/object/assign"), a = n(s); r.delete = function (e) { var t, r, n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}; return i.default.async(function (o) { for (; ;)switch (o.prev = o.next) { case 0: return n.subres = (0, a.default)({}, n.subres), n.versionId && (n.subres.versionId = n.versionId), t = this._objectRequestParams("DELETE", e, n), t.successStatuses = [204], o.next = 6, i.default.awrap(this.request(t)); case 6: return r = o.sent, o.abrupt("return", { res: r.res }); case 8: case "end": return o.stop() } }, null, this) } }, { "babel-runtime/core-js/object/assign": 54, "babel-runtime/regenerator": 68 }], 21: [function (e, t, r) { "use strict"; function n(e) { return e && e.__esModule ? e : { default: e } } var o = e("babel-runtime/regenerator"), i = n(o), s = e("babel-runtime/core-js/object/assign"), a = n(s), u = e("utility"), c = e("../utils/obj2xml"), l = c.obj2xml; r.deleteMulti = function (e) { var t, r, n, o, s, c, f, p, h, d, m, b, y = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}; return i.default.async(function (g) { for (; ;)switch (g.prev = g.next) { case 0: if (t = [], e && e.length) { g.next = 3; break } throw new Error("names is required"); case 3: for (r = 0; r < e.length; r++)n = {}, "string" == typeof e[r] ? n.Key = u.escape(this._objectName(e[r])) : (o = e[r], s = o.key, c = o.versionId, n.Key = u.escape(this._objectName(s)), n.VersionId = c), t.push(n); return f = { Delete: { Quiet: !!y.quiet, Object: t } }, p = l(f, { headers: !0 }), y.subres = (0, a.default)({ delete: "" }, y.subres), y.versionId && (y.subres.versionId = y.versionId), h = this._objectRequestParams("POST", "", y), h.mime = "xml", h.content = p, h.xmlResponse = !0, h.successStatuses = [200], g.next = 15, i.default.awrap(this.request(h)); case 15: return d = g.sent, m = d.data, b = m && m.Deleted || null, b && (Array.isArray(b) || (b = [b])), g.abrupt("return", { res: d.res, deleted: b || [] }); case 20: case "end": return g.stop() } }, null, this) } }, { "../utils/obj2xml": 47, "babel-runtime/core-js/object/assign": 54, "babel-runtime/regenerator": 68, utility: 290 }], 22: [function (e, t, r) { "use strict"; function n(e) { return e && e.__esModule ? e : { default: e } } var o = e("babel-runtime/regenerator"), i = n(o), s = e("babel-runtime/core-js/object/assign"), a = n(s); r.deleteObjectTagging = function (e) { var t, r, n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}; return i.default.async(function (o) { for (; ;)switch (o.prev = o.next) { case 0: return n.subres = (0, a.default)({ tagging: "" }, n.subres), n.versionId && (n.subres.versionId = n.versionId), e = this._objectName(e), t = this._objectRequestParams("DELETE", e, n), t.successStatuses = [204], o.next = 7, i.default.awrap(this.request(t)); case 7: return r = o.sent, o.abrupt("return", { status: r.status, res: r.res }); case 9: case "end": return o.stop() } }, null, this) } }, { "babel-runtime/core-js/object/assign": 54, "babel-runtime/regenerator": 68 }], 23: [function (e, t, r) { "use strict"; function n(e) { return e && e.__esModule ? e : { default: e } } var o = e("babel-runtime/regenerator"), i = n(o), s = e("babel-runtime/core-js/object/assign"), a = n(s), u = e("fs"), c = e("is-type-of"); r.get = function (e, t) { var r, n, o, s, l = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}; return i.default.async(function (f) { for (; ;)switch (f.prev = f.next) { case 0: return r = null, n = !1, c.writableStream(t) ? r = t : c.string(t) ? (r = u.createWriteStream(t), n = !0) : l = t, l = l || {}, l.subres = (0, a.default)({}, l.subres), l.versionId && (l.subres.versionId = l.versionId), l.process && (l.subres["x-oss-process"] = l.process), o = void 0, f.prev = 8, s = this._objectRequestParams("GET", e, l), s.writeStream = r, s.successStatuses = [200, 206, 304], f.next = 14, i.default.awrap(this.request(s)); case 14: o = f.sent, n && r.destroy(), f.next = 25; break; case 18: if (f.prev = 18, f.t0 = f.catch(8), !n) { f.next = 24; break } return r.destroy(), f.next = 24, i.default.awrap(this._deleteFileSafe(t)); case 24: throw f.t0; case 25: return f.abrupt("return", { res: o.res, content: o.data }); case 26: case "end": return f.stop() } }, null, this, [[8, 18]]) } }, { "babel-runtime/core-js/object/assign": 54, "babel-runtime/regenerator": 68, fs: 71, "is-type-of": 289 }], 24: [function (e, t, r) { "use strict"; function n(e) { return e && e.__esModule ? e : { default: e } } var o = e("babel-runtime/regenerator"), i = n(o), s = e("babel-runtime/core-js/object/assign"), a = n(s); r.getACL = function (e) { var t, r, n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}; return i.default.async(function (o) { for (; ;)switch (o.prev = o.next) { case 0: return n.subres = (0, a.default)({ acl: "" }, n.subres), n.versionId && (n.subres.versionId = n.versionId), e = this._objectName(e), t = this._objectRequestParams("GET", e, n), t.successStatuses = [200], t.xmlResponse = !0, o.next = 8, i.default.awrap(this.request(t)); case 8: return r = o.sent, o.abrupt("return", { acl: r.data.AccessControlList.Grant, owner: { id: r.data.Owner.ID, displayName: r.data.Owner.DisplayName }, res: r.res }); case 10: case "end": return o.stop() } }, null, this) } }, { "babel-runtime/core-js/object/assign": 54, "babel-runtime/regenerator": 68 }], 25: [function (e, t, r) { "use strict"; function n(e) { return e && e.__esModule ? e : { default: e } } function o() { var e, t, r, n, o, i, a = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, u = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}; return l.default.async(function (c) { for (; ;)switch (c.prev = c.next) { case 0: if (!a.versionIdMarker || void 0 !== a.keyMarker) { c.next = 2; break } throw new Error("A version-id marker cannot be specified without a key marker"); case 2: return u.subres = (0, p.default)({ versions: "" }, u.subres), u.versionId && (u.subres.versionId = u.versionId), e = this._objectRequestParams("GET", "", u), e.xmlResponse = !0, e.successStatuses = [200], e.query = s(a), c.next = 10, l.default.awrap(this.request(e)); case 10: return t = c.sent, r = t.data.Version || [], n = t.data.DeleteMarker || [], o = this, r && (Array.isArray(r) || (r = [r]), r = r.map(function (e) { return { name: e.Key, url: o._objectUrl(e.Key), lastModified: e.LastModified, isLatest: "true" === e.IsLatest, versionId: e.VersionId, etag: e.ETag, type: e.Type, size: Number(e.Size), storageClass: e.StorageClass, owner: { id: e.Owner.ID, displayName: e.Owner.DisplayName } } })), n && (y(n) || (n = [n]), n = n.map(function (e) { return { name: e.Key, lastModified: e.LastModified, versionId: e.VersionId, owner: { id: e.Owner.ID, displayName: e.Owner.DisplayName } } })), i = t.data.CommonPrefixes || null, i && (y(i) || (i = [i]), i = i.map(function (e) { return e.Prefix })), c.abrupt("return", { res: t.res, objects: r, deleteMarker: n, prefixes: i, nextMarker: t.data.NextMarker || null, NextVersionIdMarker: t.data.NextVersionIdMarker || null, isTruncated: "true" === t.data.IsTruncated }); case 19: case "end": return c.stop() } }, null, this) } function i(e) { return e.replace(/([A-Z])/g, "-$1").toLowerCase() } function s() { var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t = {}; return m(e) && (0, u.default)(e).forEach(function (r) { t[i(r)] = e[r] }), t } var a = e("babel-runtime/core-js/object/keys"), u = n(a), c = e("babel-runtime/regenerator"), l = n(c), f = e("babel-runtime/core-js/object/assign"), p = n(f), h = r, d = e("../utils/isObject"), m = d.isObject, b = e("../utils/isArray"), y = b.isArray; h.getBucketVersions = o, h.listObjectVersions = o }, { "../utils/isArray": 42, "../utils/isObject": 46, "babel-runtime/core-js/object/assign": 54, "babel-runtime/core-js/object/keys": 60, "babel-runtime/regenerator": 68 }], 26: [function (e, t, r) { "use strict"; function n(e) { return e && e.__esModule ? e : { default: e } } var o = e("babel-runtime/regenerator"), i = n(o), s = e("babel-runtime/core-js/object/assign"), a = n(s); r.getObjectMeta = function (e, t) { var r, n; return i.default.async(function (o) { for (; ;)switch (o.prev = o.next) { case 0: return t = t || {}, e = this._objectName(e), t.subres = (0, a.default)({ objectMeta: "" }, t.subres), t.versionId && (t.subres.versionId = t.versionId), r = this._objectRequestParams("HEAD", e, t), r.successStatuses = [200], o.next = 8, i.default.awrap(this.request(r)); case 8: return n = o.sent, o.abrupt("return", { status: n.status, res: n.res }); case 10: case "end": return o.stop() } }, null, this) } }, { "babel-runtime/core-js/object/assign": 54, "babel-runtime/regenerator": 68 }], 27: [function (e, t, r) { "use strict"; function n(e) { return e && e.__esModule ? e : { default: e } } var o = e("babel-runtime/regenerator"), i = n(o), s = e("babel-runtime/core-js/object/assign"), a = n(s), u = r, c = e("../utils/isObject"), l = c.isObject; u.getObjectTagging = function (e) { var t, r, n, o, s, u = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}; return i.default.async(function (c) { for (; ;)switch (c.prev = c.next) { case 0: return u.subres = (0, a.default)({ tagging: "" }, u.subres), u.versionId && (u.subres.versionId = u.versionId), e = this._objectName(e), t = this._objectRequestParams("GET", e, u), t.successStatuses = [200], c.next = 7, i.default.awrap(this.request(t)); case 7: return r = c.sent, c.next = 10, i.default.awrap(this.parseXML(r.data)); case 10: return n = c.sent, o = n.TagSet.Tag, o = o && l(o) ? [o] : o || [], s = {}, o.forEach(function (e) { s[e.Key] = e.Value }), c.abrupt("return", { status: r.status, res: r.res, tag: s }); case 16: case "end": return c.stop() } }, null, this) } }, { "../utils/isObject": 46, "babel-runtime/core-js/object/assign": 54, "babel-runtime/regenerator": 68 }], 28: [function (e, t, r) { "use strict"; function n(e) { return e && e.__esModule ? e : { default: e } } var o = e("babel-runtime/regenerator"), i = n(o), s = e("babel-runtime/core-js/object/assign"), a = n(s); r.getSymlink = function (e) { var t, r, n, o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}; return i.default.async(function (s) { for (; ;)switch (s.prev = s.next) { case 0: return o.subres = (0, a.default)({ symlink: "" }, o.subres), o.versionId && (o.subres.versionId = o.versionId), e = this._objectName(e), t = this._objectRequestParams("GET", e, o), t.successStatuses = [200], s.next = 7, i.default.awrap(this.request(t)); case 7: return r = s.sent, n = r.res.headers["x-oss-symlink-target"], s.abrupt("return", { targetName: decodeURIComponent(n), res: r.res }); case 10: case "end": return s.stop() } }, null, this) } }, { "babel-runtime/core-js/object/assign": 54, "babel-runtime/regenerator": 68 }], 29: [function (e, t, r) { "use strict"; function n(e) { return e && e.__esModule ? e : { default: e } } var o = e("babel-runtime/regenerator"), i = n(o), s = e("babel-runtime/core-js/object/keys"), a = n(s), u = e("babel-runtime/core-js/object/assign"), c = n(u); r.head = function (e) { var t, r, n, o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}; return i.default.async(function (s) { for (; ;)switch (s.prev = s.next) { case 0: return o.subres = (0, c.default)({}, o.subres), o.versionId && (o.subres.versionId = o.versionId), t = this._objectRequestParams("HEAD", e, o), t.successStatuses = [200, 304], s.next = 6, i.default.awrap(this.request(t)); case 6: return r = s.sent, n = { meta: null, res: r.res, status: r.status }, 200 === r.status && (0, a.default)(r.headers).forEach(function (e) { 0 === e.indexOf("x-oss-meta-") && (n.meta || (n.meta = {}), n.meta[e.substring(11)] = r.headers[e]) }), s.abrupt("return", n); case 10: case "end": return s.stop() } }, null, this) } }, { "babel-runtime/core-js/object/assign": 54, "babel-runtime/core-js/object/keys": 60, "babel-runtime/regenerator": 68 }], 30: [function (e, t, r) { "use strict"; function n(e) { return e && e.__esModule ? e : { default: e } } var o = e("babel-runtime/regenerator"), i = n(o), s = e("babel-runtime/core-js/object/assign"), a = n(s); r.putACL = function (e, t, r) { var n, o; return i.default.async(function (s) { for (; ;)switch (s.prev = s.next) { case 0: return r = r || {}, r.subres = (0, a.default)({ acl: "" }, r.subres), r.versionId && (r.subres.versionId = r.versionId), r.headers = r.headers || {}, r.headers["x-oss-object-acl"] = t, e = this._objectName(e), n = this._objectRequestParams("PUT", e, r), n.successStatuses = [200], s.next = 10, i.default.awrap(this.request(n)); case 10: return o = s.sent, s.abrupt("return", { res: o.res }); case 12: case "end": return s.stop() } }, null, this) } }, { "babel-runtime/core-js/object/assign": 54, "babel-runtime/regenerator": 68 }], 31: [function (e, t, r) { "use strict"; function n(e) { return e && e.__esModule ? e : { default: e } } var o = e("babel-runtime/regenerator"), i = n(o), s = e("babel-runtime/core-js/object/keys"), a = n(s), u = e("babel-runtime/core-js/object/assign"), c = n(u), l = e("../utils/obj2xml"), f = l.obj2xml, p = e("../utils/checkObjectTag"), h = p.checkObjectTag; r.putObjectTagging = function (e, t) { var r, n, o, s = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}; return i.default.async(function (u) { for (; ;)switch (u.prev = u.next) { case 0: return h(t), s.subres = (0, c.default)({ tagging: "" }, s.subres), s.versionId && (s.subres.versionId = s.versionId), e = this._objectName(e), r = this._objectRequestParams("PUT", e, s), r.successStatuses = [200], t = (0, a.default)(t).map(function (e) { return { Key: e, Value: t[e] } }), n = { Tagging: { TagSet: { Tag: t } } }, r.mime = "xml", r.content = f(n), u.next = 12, i.default.awrap(this.request(r)); case 12: return o = u.sent, u.abrupt("return", { res: o.res, status: o.status }); case 14: case "end": return u.stop() } }, null, this) } }, { "../utils/checkObjectTag": 36, "../utils/obj2xml": 47, "babel-runtime/core-js/object/assign": 54, "babel-runtime/core-js/object/keys": 60, "babel-runtime/regenerator": 68 }], 32: [function (e, t, r) { "use strict"; function n(e) { return e && e.__esModule ? e : { default: e } } var o = e("babel-runtime/regenerator"), i = n(o), s = e("babel-runtime/core-js/object/assign"), a = n(s); r.putSymlink = function (e, t, r) { var n, o; return i.default.async(function (s) { for (; ;)switch (s.prev = s.next) { case 0: return r = r || {}, r.headers = r.headers || {}, t = this._escape(this._objectName(t)), this._convertMetaToHeaders(r.meta, r.headers), r.headers["x-oss-symlink-target"] = t, r.subres = (0, a.default)({ symlink: "" }, r.subres), r.versionId && (r.subres.versionId = r.versionId), r.storageClass && (r.headers["x-oss-storage-class"] = r.storageClass), e = this._objectName(e), n = this._objectRequestParams("PUT", e, r), n.successStatuses = [200], s.next = 13, i.default.awrap(this.request(n)); case 13: return o = s.sent, s.abrupt("return", { res: o.res }); case 15: case "end": return s.stop() } }, null, this) } }, { "babel-runtime/core-js/object/assign": 54, "babel-runtime/regenerator": 68 }], 33: [function (e, t, r) { "use strict"; function n(e) { return e && e.__esModule ? e : { default: e } } var o = e("babel-runtime/regenerator"), i = n(o), s = e("babel-runtime/core-js/promise"), a = n(s), u = r; u._parallelNode = function (e, t, r, n) { var o, s, u, c, l, f, p, h; return i.default.async(function (d) { for (; ;)switch (d.prev = d.next) { case 0: o = this, s = [], u = [], c = e.length / t, l = e.length % t, f = 0 === l ? c : (e.length - l) / t + 1, p = 1, h = 0; case 8: if (!(h < e.length)) { d.next = 26; break } if (!o.isCancel()) { d.next = 11; break } return d.abrupt("break", 26); case 11: if (n ? u.push(r(o, e[h], n)) : u.push(r(o, e[h])), u.length !== t && (p !== f || h !== e.length - 1)) { d.next = 23; break } return d.prev = 13, p += 1, d.next = 17, i.default.awrap(a.default.all(u)); case 17: d.next = 22; break; case 19: d.prev = 19, d.t0 = d.catch(13), s.push(d.t0); case 22: u = []; case 23: h++, d.next = 8; break; case 26: return d.abrupt("return", s); case 27: case "end": return d.stop() } }, null, this, [[13, 19]]) }, u._parallel = function (e, t, r) { var n = this; return new a.default(function (o) { function i(e) { return function () { if (null === e) throw new Error("Callback was already called."); var t = e; e = null; for (var r = arguments.length, n = Array(r), o = 0; o < r; o++)n[o] = arguments[o]; t.apply(this, n) } } function s(e, t) { p -= 1, e ? (f = !0, c.push(e), o(c)) : t === {} || f && p <= 0 ? (f = !0, o(c)) : h || (n.isCancel() ? o(c) : u()) } function a(e, t) { r(e).then(function (e) { t(null, e) }).catch(function (e) { t(e) }) } function u() { for (h = !0; p < t && !f && !n.isCancel();) { var e = l(); if (null === e || c.length > 0) return f = !0, void (p <= 0 && o(c)); p += 1, a(e.value, i(s)) } h = !1 } var c = []; if (t <= 0 || !e) return void o(c); var l = function (e) { var t = -1, r = e.length; return function () { return ++t < r && !n.isCancel() ? { value: e[t], key: t } : null } }(e), f = !1, p = 0, h = !1; u() }) }, u.cancel = function (e) { this.options.cancelFlag = !0, e && this.abortMultipartUpload(e.name, e.uploadId, e.options) }, u.isCancel = function () { return this.options.cancelFlag }, u.resetCancelFlag = function () { this.options.cancelFlag = !1 }, u._stop = function () { this.options.cancelFlag = !0 }, u._makeCancelEvent = function () { return { status: 0, name: "cancel" } } }, { "babel-runtime/core-js/promise": 61, "babel-runtime/regenerator": 68 }], 34: [function (e, t, r) { (function (t) { "use strict"; function n(e) { return e && e.__esModule ? e : { default: e } } var o = e("babel-runtime/core-js/json/stringify"), i = n(o), s = e("babel-runtime/core-js/object/keys"), a = n(s), u = e("./../../shims/crypto/crypto.js"), c = e("is-type-of"); r.buildCanonicalizedResource = function (e, t) { var r = "" + e, n = "?"; if (c.string(t) && "" !== t.trim()) r += n + t; else if (c.array(t)) t.sort(), r += n + t.join("&"); else if (t) { var o = function (e, t) { return e[0] > t[0] ? 1 : e[0] < t[0] ? -1 : 0 }, i = function (e) { r += n + e, t[e] && (r += "=" + t[e]), n = "&" }; (0, a.default)(t).sort(o).forEach(i) } return r }, r.buildCanonicalString = function (e, t, r, n) { r = r || {}; var o = r.headers || {}, i = [], s = {}, u = [e.toUpperCase(), o["Content-Md5"] || "", o["Content-Type"] || o["Content-Type".toLowerCase()], n || o["x-oss-date"]]; return (0, a.default)(o).forEach(function (e) { var t = e.toLowerCase(); 0 === t.indexOf("x-oss-") && (s[t] = String(o[e]).trim()) }), (0, a.default)(s).sort().forEach(function (e) { i.push(e + ":" + s[e]) }), u = u.concat(i), u.push(this.buildCanonicalizedResource(t, r.parameters)), u.join("\n") }, r.computeSignature = function (e, r) { return u.createHmac("sha1", e).update(t.from(r, "utf8")).digest("base64") }, r.authorization = function (e, t, r) { return "OSS " + e + ":" + this.computeSignature(t, r) }, r._signatureForURL = function (e) { var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, n = arguments[2], o = arguments[3], s = {}, u = r.subResource, c = void 0 === u ? {} : u; if (r.process) { c["x-oss-process"] = r.process } if (r.trafficLimit) { c["x-oss-traffic-limit"] = r.trafficLimit } if (r.response && (0, a.default)(r.response).forEach(function (e) { var t = "response-" + e.toLowerCase(); c[t] = r.response[e] }), (0, a.default)(r).forEach(function (e) { var t = e.toLowerCase(), n = r[e]; 0 === t.indexOf("x-oss-") ? s[t] = n : 0 === t.indexOf("content-md5") ? s[e] = n : 0 === t.indexOf("content-type") && (s[e] = n) }), Object.prototype.hasOwnProperty.call(r, "security-token") && (c["security-token"] = r["security-token"]), Object.prototype.hasOwnProperty.call(r, "callback")) { var l = { callbackUrl: encodeURI(r.callback.url), callbackBody: r.callback.body }; if (r.callback.host && (l.callbackHost = r.callback.host), r.callback.contentType && (l.callbackBodyType = r.callback.contentType), c.callback = t.from((0, i.default)(l)).toString("base64"), r.callback.customValue) { var f = {}; (0, a.default)(r.callback.customValue).forEach(function (e) { f["x:" + e] = r.callback.customValue[e] }), c["callback-var"] = t.from((0, i.default)(f)).toString("base64") } } var p = this.buildCanonicalString(r.method, n, { headers: s, parameters: c }, o.toString()); return { Signature: this.computeSignature(e, p), subResource: c } } }).call(this, e("buffer").Buffer) }, { "./../../shims/crypto/crypto.js": 284, "babel-runtime/core-js/json/stringify": 53, "babel-runtime/core-js/object/keys": 60, buffer: 73, "is-type-of": 289 }], 35: [function (e, t, r) { "use strict"; Object.defineProperty(r, "__esModule", { value: !0 }), r.checkBucketName = void 0, r.checkBucketName = function (e, t) { if (!(t ? /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/ : /^[a-z0-9_][a-z0-9-_]{1,61}[a-z0-9_]$/).test(e)) throw new Error("The bucket must be conform to the specifications") } }, {}], 36: [function (e, t, r) { "use strict"; function n(e) { if (!c(e)) throw new Error("tag must be Object"); var t = (0, i.default)(e); if (t.length > 10) throw new Error("maximum of 10 tags for a object"); var r = ["key", "value"]; t.forEach(function (e) { e.forEach(function (e, t) { a(e, f[r[t]]) }) }) } var o = e("babel-runtime/core-js/object/entries"), i = function (e) { return e && e.__esModule ? e : { default: e } }(o); Object.defineProperty(r, "__esModule", { value: !0 }), r.checkObjectTag = void 0; var s = e("./checkValid"), a = s.checkValid, u = e("./isObject"), c = u.isObject, l = [{ validator: function (e) { if ("string" != typeof e) throw new Error("the key and value of the tag must be String") } }, { pattern: /^[a-zA-Z0-9 +-=._:\/]+$/, msg: "tag can contain letters, numbers, spaces, and the following symbols: plus sign (+), hyphen (-), equal sign (=), period (.), underscore (_), colon (:), and forward slash (/)" }], f = { key: [].concat(l, [{ pattern: /^.{1,128}$/, msg: "tag key can be a maximum of 128 bytes in length" }]), value: [].concat(l, [{ pattern: /^.{0,256}$/, msg: "tag value can be a maximum of 256 bytes in length" }]) }; r.checkObjectTag = n }, { "./checkValid": 37, "./isObject": 46, "babel-runtime/core-js/object/entries": 57 }], 37: [function (e, t, r) { "use strict"; function n(e, t) { t.forEach(function (t) { if (t.validator) t.validator(e); else if (t.pattern && !t.pattern.test(e)) throw new Error(t.msg) }) } Object.defineProperty(r, "__esModule", { value: !0 }), r.checkValid = void 0, r.checkValid = n }, {}], 38: [function (e, t, r) { (function (t) { "use strict"; function n(e, t) { return e[t] || e[t.toLowerCase()] } function o(e, t) { delete e[t], delete e[t.toLowerCase()] } function i(e) { var r = new Date; this.options.amendTimeSkewed && (r = +new Date + this.options.amendTimeSkewed); var i = { "x-oss-date": f(r, "UTC:ddd, dd mmm yyyy HH:MM:ss 'GMT'"), "x-oss-user-agent": this.userAgent }; this.userAgent.includes("nodejs") && (i["User-Agent"] = this.userAgent), this.options.isRequestPay && (0, a.default)(i, { "x-oss-request-payer": "requester" }), this.options.stsToken && (i["x-oss-security-token"] = this.options.stsToken), p(e.headers).to(i), n(i, "Content-Type") || (e.mime && e.mime.indexOf("/") > 0 ? i["Content-Type"] = e.mime : i["Content-Type"] = l.getType(e.mime || h.extname(e.object || ""))), n(i, "Content-Type") || o(i, "Content-Type"), e.content && (i["Content-Md5"] = u.createHash("md5").update(t.from(e.content, "utf8")).digest("base64"), i["Content-Length"] || (i["Content-Length"] = e.content.length)); var s = this._getResource(e); i.authorization = this.authorization(e.method, s, e.subres, i); var d = this._getReqUrl(e); c("request %s %s, with headers %j, !!stream: %s", e.method, d, i, !!e.stream); var m = e.timeout || this.options.timeout, b = { method: e.method, content: e.content, stream: e.stream, headers: i, timeout: m, writeStream: e.writeStream, customResponse: e.customResponse, ctx: e.ctx || this.ctx }; return this.agent && (b.agent = this.agent), this.httpsAgent && (b.httpsAgent = this.httpsAgent), { url: d, params: b } } var s = e("babel-runtime/core-js/object/assign"), a = function (e) { return e && e.__esModule ? e : { default: e } }(s); Object.defineProperty(r, "__esModule", { value: !0 }), r.createRequest = void 0; var u = e("./../../../shims/crypto/crypto.js"), c = e("debug")("ali-oss"), l = e("mime"), f = e("dateformat"), p = e("copy-to"), h = e("path"); r.createRequest = i }).call(this, e("buffer").Buffer) }, { "./../../../shims/crypto/crypto.js": 284, "babel-runtime/core-js/object/assign": 54, buffer: 73, "copy-to": 76, dateformat: 190, debug: 288, mime: 202, path: 205 }], 39: [function (e, t, r) { "use strict"; function n(e) { return e && e.__esModule ? e : { default: e } } var o = e("babel-runtime/core-js/object/keys"), i = n(o), s = e("babel-runtime/helpers/typeof"), a = n(s); Object.defineProperty(r, "__esModule", { value: !0 }), r.deepCopy = void 0, r.deepCopy = function (e) { if (null === e || "object" !== (void 0 === e ? "undefined" : (0, a.default)(e))) return e; var t = Array.isArray(e) ? [] : {}; return (0, i.default)(e).forEach(function (n) { t[n] = r.deepCopy(e[n]) }), t } }, { "babel-runtime/core-js/object/keys": 60, "babel-runtime/helpers/typeof": 67 }], 40: [function (e, t, r) { "use strict"; function n(e) { return e && e.__esModule ? e : { default: e } } function o(e, t) { if (null === e || "object" !== (void 0 === e ? "undefined" : (0, c.default)(e))) return e; var r = void 0; if (Array.isArray(e)) { r = []; for (var n = 0; n < e.length; n++)r.push(o(e[n], t)) } else r = {}, (0, a.default)(e).forEach(function (n) { r[i(n, t)] = o(e[n], t) }); return r } function i(e, t) { return "firstUpperCase" === t ? e = e.replace(/^./, function (e) { return e.toUpperCase() }) : "firstLowerCase" === t && (e = e.replace(/^./, function (e) { return e.toLowerCase() })), e } var s = e("babel-runtime/core-js/object/keys"), a = n(s), u = e("babel-runtime/helpers/typeof"), c = n(u); Object.defineProperty(r, "__esModule", { value: !0 }), r.formatObjKey = void 0, r.formatObjKey = o }, { "babel-runtime/core-js/object/keys": 60, "babel-runtime/helpers/typeof": 67 }], 41: [function (e, t, r) { "use strict"; function n(e) { for (var t = 0, r = 0; r < e.length; r++) { /^[\u00-\uff]$/.test(e.charAt(r)) ? t += 1 : t += 2 } return t } Object.defineProperty(r, "__esModule", { value: !0 }), r.getStrBytesCount = void 0, r.getStrBytesCount = n }, {}], 42: [function (e, t, r) { "use strict"; Object.defineProperty(r, "__esModule", { value: !0 }), r.isArray = void 0, r.isArray = function (e) { return "[object Array]" === Object.prototype.toString.call(e) } }, {}], 43: [function (e, t, r) { "use strict"; function n(e) { return "undefined" != typeof Blob && e instanceof Blob } Object.defineProperty(r, "__esModule", { value: !0 }), r.isBlob = void 0, r.isBlob = n }, {}], 44: [function (e, t, r) { "use strict"; Object.defineProperty(r, "__esModule", { value: !0 }), r.isFile = void 0, r.isFile = function (e) { return "undefined" != typeof File && e instanceof File } }, {}], 45: [function (e, t, r) {
      "use strict"; Object.defineProperty(r, "__esModule", { value: !0 }), r.isIP = void 0, r.isIP = function (e) {
        var t = /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/, r = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/; return t.test(e) || r.test(e)
      }
    }, {}], 46: [function (e, t, r) { "use strict"; Object.defineProperty(r, "__esModule", { value: !0 }), r.isObject = void 0, r.isObject = function (e) { return "[object Object]" === Object.prototype.toString.call(e) } }, {}], 47: [function (e, t, r) { "use strict"; function n(e) { return Object.prototype.toString.call(e).replace(/(.*? |])/g, "").toLowerCase() } function o(e, t) { var r = ""; return t && t.headers && (r = '<?xml version="1.0" encoding="UTF-8"?>\n'), t && t.firstUpperCase && (e = a.formatObjKey(e, "firstUpperCase")), "object" === n(e) ? (0, s.default)(e).forEach(function (t) { "string" === n(e[t]) || "number" === n(e[t]) ? r += "<" + t + ">" + e[t] + "</" + t + ">" : "object" === n(e[t]) ? r += "<" + t + ">" + o(e[t]) + "</" + t + ">" : "array" === n(e[t]) ? r += e[t].map(function (e) { return "<" + t + ">" + o(e) + "</" + t + ">" }).join("") : r += "<" + t + ">" + e[t].toString() + "</" + t + ">" }) : r += e.toString(), r } var i = e("babel-runtime/core-js/object/keys"), s = function (e) { return e && e.__esModule ? e : { default: e } }(i); Object.defineProperty(r, "__esModule", { value: !0 }), r.obj2xml = void 0; var a = e("./formatObjKey"); r.obj2xml = o }, { "./formatObjKey": 40, "babel-runtime/core-js/object/keys": 60 }], 48: [function (e, t, r) { function n() { } t.exports = n, t.exports.HttpsAgent = n }, {}], 49: [function (e, t, r) { t.exports = e("./register")().Promise }, { "./register": 51 }], 50: [function (e, t, r) { "use strict"; var n = null; t.exports = function (e, t) { return function (r, o) { r = r || null, o = o || {}; var i = !1 !== o.global; if (null === n && i && (n = e["@@any-promise/REGISTRATION"] || null), null !== n && null !== r && n.implementation !== r) throw new Error('any-promise already defined as "' + n.implementation + '".  You can only register an implementation before the first  call to require("any-promise") and an implementation cannot be changed'); return null === n && (n = null !== r && void 0 !== o.Promise ? { Promise: o.Promise, implementation: r } : t(r), i && (e["@@any-promise/REGISTRATION"] = n)), n } } }, {}], 51: [function (e, t, r) { "use strict"; function n() { if (void 0 === window.Promise) throw new Error("any-promise browser requires a polyfill or explicit registration e.g: require('any-promise/register/bluebird')"); return { Promise: window.Promise, implementation: "window.Promise" } } t.exports = e("./loader")(window, n) }, { "./loader": 50 }], 52: [function (e, t, r) { t.exports = { default: e("core-js/library/fn/array/from"), __esModule: !0 } }, { "core-js/library/fn/array/from": 77 }], 53: [function (e, t, r) { t.exports = { default: e("core-js/library/fn/json/stringify"), __esModule: !0 } }, { "core-js/library/fn/json/stringify": 78 }], 54: [function (e, t, r) { t.exports = { default: e("core-js/library/fn/object/assign"), __esModule: !0 } }, { "core-js/library/fn/object/assign": 79 }], 55: [function (e, t, r) { t.exports = { default: e("core-js/library/fn/object/create"), __esModule: !0 } }, { "core-js/library/fn/object/create": 80 }], 56: [function (e, t, r) { t.exports = { default: e("core-js/library/fn/object/define-property"), __esModule: !0 } }, { "core-js/library/fn/object/define-property": 81 }], 57: [function (e, t, r) { t.exports = { default: e("core-js/library/fn/object/entries"), __esModule: !0 } }, { "core-js/library/fn/object/entries": 82 }], 58: [function (e, t, r) { t.exports = { default: e("core-js/library/fn/object/get-own-property-names"), __esModule: !0 } }, { "core-js/library/fn/object/get-own-property-names": 83 }], 59: [function (e, t, r) { t.exports = { default: e("core-js/library/fn/object/get-prototype-of"), __esModule: !0 } }, { "core-js/library/fn/object/get-prototype-of": 84 }], 60: [function (e, t, r) { t.exports = { default: e("core-js/library/fn/object/keys"), __esModule: !0 } }, { "core-js/library/fn/object/keys": 85 }], 61: [function (e, t, r) { t.exports = { default: e("core-js/library/fn/promise"), __esModule: !0 } }, { "core-js/library/fn/promise": 86 }], 62: [function (e, t, r) { t.exports = { default: e("core-js/library/fn/set-immediate"), __esModule: !0 } }, { "core-js/library/fn/set-immediate": 87 }], 63: [function (e, t, r) { t.exports = { default: e("core-js/library/fn/string/from-code-point"), __esModule: !0 } }, { "core-js/library/fn/string/from-code-point": 88 }], 64: [function (e, t, r) { t.exports = { default: e("core-js/library/fn/symbol"), __esModule: !0 } }, { "core-js/library/fn/symbol": 90 }], 65: [function (e, t, r) { t.exports = { default: e("core-js/library/fn/symbol/has-instance"), __esModule: !0 } }, { "core-js/library/fn/symbol/has-instance": 89 }], 66: [function (e, t, r) { t.exports = { default: e("core-js/library/fn/symbol/iterator"), __esModule: !0 } }, { "core-js/library/fn/symbol/iterator": 91 }], 67: [function (e, t, r) { "use strict"; function n(e) { return e && e.__esModule ? e : { default: e } } r.__esModule = !0; var o = e("../core-js/symbol/iterator"), i = n(o), s = e("../core-js/symbol"), a = n(s), u = "function" == typeof a.default && "symbol" == typeof i.default ? function (e) { return typeof e } : function (e) { return e && "function" == typeof a.default && e.constructor === a.default && e !== a.default.prototype ? "symbol" : typeof e }; r.default = "function" == typeof a.default && "symbol" === u(i.default) ? function (e) { return void 0 === e ? "undefined" : u(e) } : function (e) { return e && "function" == typeof a.default && e.constructor === a.default && e !== a.default.prototype ? "symbol" : void 0 === e ? "undefined" : u(e) } }, { "../core-js/symbol": 64, "../core-js/symbol/iterator": 66 }], 68: [function (e, t, r) { t.exports = e("regenerator-runtime") }, { "regenerator-runtime": 226 }], 69: [function (e, t, r) { "use strict"; function n(e) { var t = e.length; if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4"); var r = e.indexOf("="); return -1 === r && (r = t), [r, r === t ? 0 : 4 - r % 4] } function o(e) { var t = n(e), r = t[0], o = t[1]; return 3 * (r + o) / 4 - o } function i(e, t, r) { return 3 * (t + r) / 4 - r } function s(e) { var t, r, o = n(e), s = o[0], a = o[1], u = new p(i(e, s, a)), c = 0, l = a > 0 ? s - 4 : s; for (r = 0; r < l; r += 4)t = f[e.charCodeAt(r)] << 18 | f[e.charCodeAt(r + 1)] << 12 | f[e.charCodeAt(r + 2)] << 6 | f[e.charCodeAt(r + 3)], u[c++] = t >> 16 & 255, u[c++] = t >> 8 & 255, u[c++] = 255 & t; return 2 === a && (t = f[e.charCodeAt(r)] << 2 | f[e.charCodeAt(r + 1)] >> 4, u[c++] = 255 & t), 1 === a && (t = f[e.charCodeAt(r)] << 10 | f[e.charCodeAt(r + 1)] << 4 | f[e.charCodeAt(r + 2)] >> 2, u[c++] = t >> 8 & 255, u[c++] = 255 & t), u } function a(e) { return l[e >> 18 & 63] + l[e >> 12 & 63] + l[e >> 6 & 63] + l[63 & e] } function u(e, t, r) { for (var n, o = [], i = t; i < r; i += 3)n = (e[i] << 16 & 16711680) + (e[i + 1] << 8 & 65280) + (255 & e[i + 2]), o.push(a(n)); return o.join("") } function c(e) { for (var t, r = e.length, n = r % 3, o = [], i = 0, s = r - n; i < s; i += 16383)o.push(u(e, i, i + 16383 > s ? s : i + 16383)); return 1 === n ? (t = e[r - 1], o.push(l[t >> 2] + l[t << 4 & 63] + "==")) : 2 === n && (t = (e[r - 2] << 8) + e[r - 1], o.push(l[t >> 10] + l[t >> 4 & 63] + l[t << 2 & 63] + "=")), o.join("") } r.byteLength = o, r.toByteArray = s, r.fromByteArray = c; for (var l = [], f = [], p = "undefined" != typeof Uint8Array ? Uint8Array : Array, h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", d = 0, m = h.length; d < m; ++d)l[d] = h[d], f[h.charCodeAt(d)] = d; f["-".charCodeAt(0)] = 62, f["_".charCodeAt(0)] = 63 }, {}], 70: [function (e, t, r) { !function (e, r, n) { void 0 !== t && t.exports ? t.exports = n() : "function" == typeof define && define.amd ? define("bowser", n) : e.bowser = n() }(this, 0, function () { function e(e) { function t(t) { var r = e.match(t); return r && r.length > 1 && r[1] || "" } function r(t) { var r = e.match(t); return r && r.length > 1 && r[2] || "" } var o, i = t(/(ipod|iphone|ipad)/i).toLowerCase(), a = /like android/i.test(e), u = !a && /android/i.test(e), c = /nexus\s*[0-6]\s*/i.test(e), l = !c && /nexus\s*[0-9]+/i.test(e), f = /CrOS/.test(e), p = /silk/i.test(e), h = /sailfish/i.test(e), d = /tizen/i.test(e), m = /(web|hpw)(o|0)s/i.test(e), b = /windows phone/i.test(e), y = (/SamsungBrowser/i.test(e), !b && /windows/i.test(e)), g = !i && !p && /macintosh/i.test(e), v = !u && !h && !d && !m && /linux/i.test(e), _ = r(/edg([ea]|ios)\/(\d+(\.\d+)?)/i), w = t(/version\/(\d+(\.\d+)?)/i), x = /tablet/i.test(e) && !/tablet pc/i.test(e), E = !x && /[^-]mobi/i.test(e), T = /xbox/i.test(e); /opera/i.test(e) ? o = { name: "Opera", opera: s, version: w || t(/(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i) } : /opr\/|opios/i.test(e) ? o = { name: "Opera", opera: s, version: t(/(?:opr|opios)[\s\/](\d+(\.\d+)?)/i) || w } : /SamsungBrowser/i.test(e) ? o = { name: "Samsung Internet for Android", samsungBrowser: s, version: w || t(/(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i) } : /Whale/i.test(e) ? o = { name: "NAVER Whale browser", whale: s, version: t(/(?:whale)[\s\/](\d+(?:\.\d+)+)/i) } : /MZBrowser/i.test(e) ? o = { name: "MZ Browser", mzbrowser: s, version: t(/(?:MZBrowser)[\s\/](\d+(?:\.\d+)+)/i) } : /coast/i.test(e) ? o = { name: "Opera Coast", coast: s, version: w || t(/(?:coast)[\s\/](\d+(\.\d+)?)/i) } : /focus/i.test(e) ? o = { name: "Focus", focus: s, version: t(/(?:focus)[\s\/](\d+(?:\.\d+)+)/i) } : /yabrowser/i.test(e) ? o = { name: "Yandex Browser", yandexbrowser: s, version: w || t(/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i) } : /ucbrowser/i.test(e) ? o = { name: "UC Browser", ucbrowser: s, version: t(/(?:ucbrowser)[\s\/](\d+(?:\.\d+)+)/i) } : /mxios/i.test(e) ? o = { name: "Maxthon", maxthon: s, version: t(/(?:mxios)[\s\/](\d+(?:\.\d+)+)/i) } : /epiphany/i.test(e) ? o = { name: "Epiphany", epiphany: s, version: t(/(?:epiphany)[\s\/](\d+(?:\.\d+)+)/i) } : /puffin/i.test(e) ? o = { name: "Puffin", puffin: s, version: t(/(?:puffin)[\s\/](\d+(?:\.\d+)?)/i) } : /sleipnir/i.test(e) ? o = { name: "Sleipnir", sleipnir: s, version: t(/(?:sleipnir)[\s\/](\d+(?:\.\d+)+)/i) } : /k-meleon/i.test(e) ? o = { name: "K-Meleon", kMeleon: s, version: t(/(?:k-meleon)[\s\/](\d+(?:\.\d+)+)/i) } : b ? (o = { name: "Windows Phone", osname: "Windows Phone", windowsphone: s }, _ ? (o.msedge = s, o.version = _) : (o.msie = s, o.version = t(/iemobile\/(\d+(\.\d+)?)/i))) : /msie|trident/i.test(e) ? o = { name: "Internet Explorer", msie: s, version: t(/(?:msie |rv:)(\d+(\.\d+)?)/i) } : f ? o = { name: "Chrome", osname: "Chrome OS", chromeos: s, chromeBook: s, chrome: s, version: t(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i) } : /edg([ea]|ios)/i.test(e) ? o = { name: "Microsoft Edge", msedge: s, version: _ } : /vivaldi/i.test(e) ? o = { name: "Vivaldi", vivaldi: s, version: t(/vivaldi\/(\d+(\.\d+)?)/i) || w } : h ? o = { name: "Sailfish", osname: "Sailfish OS", sailfish: s, version: t(/sailfish\s?browser\/(\d+(\.\d+)?)/i) } : /seamonkey\//i.test(e) ? o = { name: "SeaMonkey", seamonkey: s, version: t(/seamonkey\/(\d+(\.\d+)?)/i) } : /firefox|iceweasel|fxios/i.test(e) ? (o = { name: "Firefox", firefox: s, version: t(/(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i) }, /\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(e) && (o.firefoxos = s, o.osname = "Firefox OS")) : p ? o = { name: "Amazon Silk", silk: s, version: t(/silk\/(\d+(\.\d+)?)/i) } : /phantom/i.test(e) ? o = { name: "PhantomJS", phantom: s, version: t(/phantomjs\/(\d+(\.\d+)?)/i) } : /slimerjs/i.test(e) ? o = { name: "SlimerJS", slimer: s, version: t(/slimerjs\/(\d+(\.\d+)?)/i) } : /blackberry|\bbb\d+/i.test(e) || /rim\stablet/i.test(e) ? o = { name: "BlackBerry", osname: "BlackBerry OS", blackberry: s, version: w || t(/blackberry[\d]+\/(\d+(\.\d+)?)/i) } : m ? (o = { name: "WebOS", osname: "WebOS", webos: s, version: w || t(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i) }, /touchpad\//i.test(e) && (o.touchpad = s)) : /bada/i.test(e) ? o = { name: "Bada", osname: "Bada", bada: s, version: t(/dolfin\/(\d+(\.\d+)?)/i) } : d ? o = { name: "Tizen", osname: "Tizen", tizen: s, version: t(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || w } : /qupzilla/i.test(e) ? o = { name: "QupZilla", qupzilla: s, version: t(/(?:qupzilla)[\s\/](\d+(?:\.\d+)+)/i) || w } : /chromium/i.test(e) ? o = { name: "Chromium", chromium: s, version: t(/(?:chromium)[\s\/](\d+(?:\.\d+)?)/i) || w } : /chrome|crios|crmo/i.test(e) ? o = { name: "Chrome", chrome: s, version: t(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i) } : u ? o = { name: "Android", version: w } : /safari|applewebkit/i.test(e) ? (o = { name: "Safari", safari: s }, w && (o.version = w)) : i ? (o = { name: "iphone" == i ? "iPhone" : "ipad" == i ? "iPad" : "iPod" }, w && (o.version = w)) : o = /googlebot/i.test(e) ? { name: "Googlebot", googlebot: s, version: t(/googlebot\/(\d+(\.\d+))/i) || w } : { name: t(/^(.*)\/(.*) /), version: r(/^(.*)\/(.*) /) }, !o.msedge && /(apple)?webkit/i.test(e) ? (/(apple)?webkit\/537\.36/i.test(e) ? (o.name = o.name || "Blink", o.blink = s) : (o.name = o.name || "Webkit", o.webkit = s), !o.version && w && (o.version = w)) : !o.opera && /gecko\//i.test(e) && (o.name = o.name || "Gecko", o.gecko = s, o.version = o.version || t(/gecko\/(\d+(\.\d+)?)/i)), o.windowsphone || !u && !o.silk ? !o.windowsphone && i ? (o[i] = s, o.ios = s, o.osname = "iOS") : g ? (o.mac = s, o.osname = "macOS") : T ? (o.xbox = s, o.osname = "Xbox") : y ? (o.windows = s, o.osname = "Windows") : v && (o.linux = s, o.osname = "Linux") : (o.android = s, o.osname = "Android"); var S = ""; o.windows ? S = function (e) { switch (e) { case "NT": return "NT"; case "XP": return "XP"; case "NT 5.0": return "2000"; case "NT 5.1": return "XP"; case "NT 5.2": return "2003"; case "NT 6.0": return "Vista"; case "NT 6.1": return "7"; case "NT 6.2": return "8"; case "NT 6.3": return "8.1"; case "NT 10.0": return "10"; default: return } }(t(/Windows ((NT|XP)( \d\d?.\d)?)/i)) : o.windowsphone ? S = t(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i) : o.mac ? (S = t(/Mac OS X (\d+([_\.\s]\d+)*)/i), S = S.replace(/[_\s]/g, ".")) : i ? (S = t(/os (\d+([_\s]\d+)*) like mac os x/i), S = S.replace(/[_\s]/g, ".")) : u ? S = t(/android[ \/-](\d+(\.\d+)*)/i) : o.webos ? S = t(/(?:web|hpw)os\/(\d+(\.\d+)*)/i) : o.blackberry ? S = t(/rim\stablet\sos\s(\d+(\.\d+)*)/i) : o.bada ? S = t(/bada\/(\d+(\.\d+)*)/i) : o.tizen && (S = t(/tizen[\/\s](\d+(\.\d+)*)/i)), S && (o.osversion = S); var j = !o.windows && S.split(".")[0]; return x || l || "ipad" == i || u && (3 == j || j >= 4 && !E) || o.silk ? o.tablet = s : (E || "iphone" == i || "ipod" == i || u || c || o.blackberry || o.webos || o.bada) && (o.mobile = s), o.msedge || o.msie && o.version >= 10 || o.yandexbrowser && o.version >= 15 || o.vivaldi && o.version >= 1 || o.chrome && o.version >= 20 || o.samsungBrowser && o.version >= 4 || o.whale && 1 === n([o.version, "1.0"]) || o.mzbrowser && 1 === n([o.version, "6.0"]) || o.focus && 1 === n([o.version, "1.0"]) || o.firefox && o.version >= 20 || o.safari && o.version >= 6 || o.opera && o.version >= 10 || o.ios && o.osversion && o.osversion.split(".")[0] >= 6 || o.blackberry && o.version >= 10.1 || o.chromium && o.version >= 20 ? o.a = s : o.msie && o.version < 10 || o.chrome && o.version < 20 || o.firefox && o.version < 20 || o.safari && o.version < 6 || o.opera && o.version < 10 || o.ios && o.osversion && o.osversion.split(".")[0] < 6 || o.chromium && o.version < 20 ? o.c = s : o.x = s, o } function t(e) { return e.split(".").length } function r(e, t) { var r, n = []; if (Array.prototype.map) return Array.prototype.map.call(e, t); for (r = 0; r < e.length; r++)n.push(t(e[r])); return n } function n(e) { for (var n = Math.max(t(e[0]), t(e[1])), o = r(e, function (e) { var o = n - t(e); return e += new Array(o + 1).join(".0"), r(e.split("."), function (e) { return new Array(20 - e.length).join("0") + e }).reverse() }); --n >= 0;) { if (o[0][n] > o[1][n]) return 1; if (o[0][n] !== o[1][n]) return -1; if (0 === n) return 0 } } function o(t, r, o) { var i = a; "string" == typeof r && (o = r, r = void 0), void 0 === r && (r = !1), o && (i = e(o)); var s = "" + i.version; for (var u in t) if (t.hasOwnProperty(u) && i[u]) { if ("string" != typeof t[u]) throw new Error("Browser version in the minVersion map should be a string: " + u + ": " + String(t)); return n([s, t[u]]) < 0 } return r } function i(e, t, r) { return !o(e, t, r) } var s = !0, a = e("undefined" != typeof navigator ? navigator.userAgent || "" : ""); return a.test = function (e) { for (var t = 0; t < e.length; ++t) { var r = e[t]; if ("string" == typeof r && r in a) return !0 } return !1 }, a.isUnsupportedBrowser = o, a.compareVersions = n, a.check = i, a._detect = e, a.detect = e, a }) }, {}], 71: [function (e, t, r) { }, {}], 72: [function (e, t, r) { function n(e) { if (e && !u(e)) throw new Error("Unknown encoding: " + e) } function o(e) { return e.toString(this.encoding) } function i(e) { this.charReceived = e.length % 2, this.charLength = this.charReceived ? 2 : 0 } function s(e) { this.charReceived = e.length % 3, this.charLength = this.charReceived ? 3 : 0 } var a = e("buffer").Buffer, u = a.isEncoding || function (e) { switch (e && e.toLowerCase()) { case "hex": case "utf8": case "utf-8": case "ascii": case "binary": case "base64": case "ucs2": case "ucs-2": case "utf16le": case "utf-16le": case "raw": return !0; default: return !1 } }, c = r.StringDecoder = function (e) { switch (this.encoding = (e || "utf8").toLowerCase().replace(/[-_]/, ""), n(e), this.encoding) { case "utf8": this.surrogateSize = 3; break; case "ucs2": case "utf16le": this.surrogateSize = 2, this.detectIncompleteChar = i; break; case "base64": this.surrogateSize = 3, this.detectIncompleteChar = s; break; default: return void (this.write = o) }this.charBuffer = new a(6), this.charReceived = 0, this.charLength = 0 }; c.prototype.write = function (e) { for (var t = ""; this.charLength;) { var r = e.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : e.length; if (e.copy(this.charBuffer, this.charReceived, 0, r), this.charReceived += r, this.charReceived < this.charLength) return ""; e = e.slice(r, e.length), t = this.charBuffer.slice(0, this.charLength).toString(this.encoding); var n = t.charCodeAt(t.length - 1); if (!(n >= 55296 && n <= 56319)) { if (this.charReceived = this.charLength = 0, 0 === e.length) return t; break } this.charLength += this.surrogateSize, t = "" } this.detectIncompleteChar(e); var o = e.length; this.charLength && (e.copy(this.charBuffer, 0, e.length - this.charReceived, o), o -= this.charReceived), t += e.toString(this.encoding, 0, o); var o = t.length - 1, n = t.charCodeAt(o); if (n >= 55296 && n <= 56319) { var i = this.surrogateSize; return this.charLength += i, this.charReceived += i, this.charBuffer.copy(this.charBuffer, i, 0, i), e.copy(this.charBuffer, 0, 0, i), t.substring(0, o) } return t }, c.prototype.detectIncompleteChar = function (e) { for (var t = e.length >= 3 ? 3 : e.length; t > 0; t--) { var r = e[e.length - t]; if (1 == t && r >> 5 == 6) { this.charLength = 2; break } if (t <= 2 && r >> 4 == 14) { this.charLength = 3; break } if (t <= 3 && r >> 3 == 30) { this.charLength = 4; break } } this.charReceived = t }, c.prototype.end = function (e) { var t = ""; if (e && e.length && (t = this.write(e)), this.charReceived) { var r = this.charReceived, n = this.charBuffer, o = this.encoding; t += n.slice(0, r).toString(o) } return t } }, { buffer: 73 }], 73: [function (e, t, r) {
      (function (t, n) {
        "use strict"; function o() { return n.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823 } function i(e, t) { if (o() < t) throw new RangeError("Invalid typed array length"); return n.TYPED_ARRAY_SUPPORT ? (e = new Uint8Array(t), e.__proto__ = n.prototype) : (null === e && (e = new n(t)), e.length = t), e } function n(e, t, r) { if (!(n.TYPED_ARRAY_SUPPORT || this instanceof n)) return new n(e, t, r); if ("number" == typeof e) { if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string"); return c(this, e) } return s(this, e, t, r) } function s(e, t, r, n) { if ("number" == typeof t) throw new TypeError('"value" argument must not be a number'); return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? p(e, t, r, n) : "string" == typeof t ? l(e, t, r) : h(e, t) } function a(e) { if ("number" != typeof e) throw new TypeError('"size" argument must be a number'); if (e < 0) throw new RangeError('"size" argument must not be negative') } function u(e, t, r, n) { return a(t), t <= 0 ? i(e, t) : void 0 !== r ? "string" == typeof n ? i(e, t).fill(r, n) : i(e, t).fill(r) : i(e, t) } function c(e, t) { if (a(t), e = i(e, t < 0 ? 0 : 0 | d(t)), !n.TYPED_ARRAY_SUPPORT) for (var r = 0; r < t; ++r)e[r] = 0; return e } function l(e, t, r) { if ("string" == typeof r && "" !== r || (r = "utf8"), !n.isEncoding(r)) throw new TypeError('"encoding" must be a valid string encoding'); var o = 0 | b(t, r); e = i(e, o); var s = e.write(t, r); return s !== o && (e = e.slice(0, s)), e } function f(e, t) { var r = t.length < 0 ? 0 : 0 | d(t.length); e = i(e, r); for (var n = 0; n < r; n += 1)e[n] = 255 & t[n]; return e } function p(e, t, r, o) { if (t.byteLength, r < 0 || t.byteLength < r) throw new RangeError("'offset' is out of bounds"); if (t.byteLength < r + (o || 0)) throw new RangeError("'length' is out of bounds"); return t = void 0 === r && void 0 === o ? new Uint8Array(t) : void 0 === o ? new Uint8Array(t, r) : new Uint8Array(t, r, o), n.TYPED_ARRAY_SUPPORT ? (e = t, e.__proto__ = n.prototype) : e = f(e, t), e } function h(e, t) { if (n.isBuffer(t)) { var r = 0 | d(t.length); return e = i(e, r), 0 === e.length ? e : (t.copy(e, 0, 0, r), e) } if (t) { if ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length || Y(t.length) ? i(e, 0) : f(e, t); if ("Buffer" === t.type && Q(t.data)) return f(e, t.data) } throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.") } function d(e) { if (e >= o()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + o().toString(16) + " bytes"); return 0 | e } function m(e) { return +e != e && (e = 0), n.alloc(+e) } function b(e, t) { if (n.isBuffer(e)) return e.length; if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) return e.byteLength; "string" != typeof e && (e = "" + e); var r = e.length; if (0 === r) return 0; for (var o = !1; ;)switch (t) { case "ascii": case "latin1": case "binary": return r; case "utf8": case "utf-8": case void 0: return z(e).length; case "ucs2": case "ucs-2": case "utf16le": case "utf-16le": return 2 * r; case "hex": return r >>> 1; case "base64": return W(e).length; default: if (o) return z(e).length; t = ("" + t).toLowerCase(), o = !0 } } function y(e, t, r) { var n = !1; if ((void 0 === t || t < 0) && (t = 0), t > this.length) return ""; if ((void 0 === r || r > this.length) && (r = this.length), r <= 0) return ""; if (r >>>= 0, t >>>= 0, r <= t) return ""; for (e || (e = "utf8"); ;)switch (e) { case "hex": return A(this, t, r); case "utf8": case "utf-8": return N(this, t, r); case "ascii": return I(this, t, r); case "latin1": case "binary": return C(this, t, r); case "base64": return O(this, t, r); case "ucs2": case "ucs-2": case "utf16le": case "utf-16le": return D(this, t, r); default: if (n) throw new TypeError("Unknown encoding: " + e); e = (e + "").toLowerCase(), n = !0 } } function g(e, t, r) { var n = e[t]; e[t] = e[r], e[r] = n } function v(e, t, r, o, i) { if (0 === e.length) return -1; if ("string" == typeof r ? (o = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), r = +r, isNaN(r) && (r = i ? 0 : e.length - 1), r < 0 && (r = e.length + r), r >= e.length) { if (i) return -1; r = e.length - 1 } else if (r < 0) { if (!i) return -1; r = 0 } if ("string" == typeof t && (t = n.from(t, o)), n.isBuffer(t)) return 0 === t.length ? -1 : _(e, t, r, o, i); if ("number" == typeof t) return t &= 255, n.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(e, t, r) : Uint8Array.prototype.lastIndexOf.call(e, t, r) : _(e, [t], r, o, i); throw new TypeError("val must be string, number or Buffer") } function _(e, t, r, n, o) { function i(e, t) { return 1 === s ? e[t] : e.readUInt16BE(t * s) } var s = 1, a = e.length, u = t.length; if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) { if (e.length < 2 || t.length < 2) return -1; s = 2, a /= 2, u /= 2, r /= 2 } var c; if (o) { var l = -1; for (c = r; c < a; c++)if (i(e, c) === i(t, -1 === l ? 0 : c - l)) { if (-1 === l && (l = c), c - l + 1 === u) return l * s } else -1 !== l && (c -= c - l), l = -1 } else for (r + u > a && (r = a - u), c = r; c >= 0; c--) { for (var f = !0, p = 0; p < u; p++)if (i(e, c + p) !== i(t, p)) { f = !1; break } if (f) return c } return -1 } function w(e, t, r, n) { r = Number(r) || 0; var o = e.length - r; n ? (n = Number(n)) > o && (n = o) : n = o; var i = t.length; if (i % 2 != 0) throw new TypeError("Invalid hex string"); n > i / 2 && (n = i / 2); for (var s = 0; s < n; ++s) { var a = parseInt(t.substr(2 * s, 2), 16); if (isNaN(a)) return s; e[r + s] = a } return s } function x(e, t, r, n) { return K(z(t, e.length - r), e, r, n) } function E(e, t, r, n) { return K(V(t), e, r, n) } function T(e, t, r, n) { return E(e, t, r, n) } function S(e, t, r, n) { return K(W(t), e, r, n) } function j(e, t, r, n) { return K(H(t, e.length - r), e, r, n) } function O(e, t, r) { return 0 === t && r === e.length ? $.fromByteArray(e) : $.fromByteArray(e.slice(t, r)) } function N(e, t, r) { r = Math.min(e.length, r); for (var n = [], o = t; o < r;) { var i = e[o], s = null, a = i > 239 ? 4 : i > 223 ? 3 : i > 191 ? 2 : 1; if (o + a <= r) { var u, c, l, f; switch (a) { case 1: i < 128 && (s = i); break; case 2: u = e[o + 1], 128 == (192 & u) && (f = (31 & i) << 6 | 63 & u) > 127 && (s = f); break; case 3: u = e[o + 1], c = e[o + 2], 128 == (192 & u) && 128 == (192 & c) && (f = (15 & i) << 12 | (63 & u) << 6 | 63 & c) > 2047 && (f < 55296 || f > 57343) && (s = f); break; case 4: u = e[o + 1], c = e[o + 2], l = e[o + 3], 128 == (192 & u) && 128 == (192 & c) && 128 == (192 & l) && (f = (15 & i) << 18 | (63 & u) << 12 | (63 & c) << 6 | 63 & l) > 65535 && f < 1114112 && (s = f) } } null === s ? (s = 65533, a = 1) : s > 65535 && (s -= 65536, n.push(s >>> 10 & 1023 | 55296), s = 56320 | 1023 & s), n.push(s), o += a } return k(n) } function k(e) { var t = e.length; if (t <= Z) return String.fromCharCode.apply(String, e); for (var r = "", n = 0; n < t;)r += String.fromCharCode.apply(String, e.slice(n, n += Z)); return r } function I(e, t, r) { var n = ""; r = Math.min(e.length, r); for (var o = t; o < r; ++o)n += String.fromCharCode(127 & e[o]); return n } function C(e, t, r) { var n = ""; r = Math.min(e.length, r); for (var o = t; o < r; ++o)n += String.fromCharCode(e[o]); return n } function A(e, t, r) { var n = e.length; (!t || t < 0) && (t = 0), (!r || r < 0 || r > n) && (r = n); for (var o = "", i = t; i < r; ++i)o += G(e[i]); return o } function D(e, t, r) { for (var n = e.slice(t, r), o = "", i = 0; i < n.length; i += 2)o += String.fromCharCode(n[i] + 256 * n[i + 1]); return o } function M(e, t, r) { if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint"); if (e + t > r) throw new RangeError("Trying to access beyond buffer length") } function P(e, t, r, o, i, s) { if (!n.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance'); if (t > i || t < s) throw new RangeError('"value" argument is out of bounds'); if (r + o > e.length) throw new RangeError("Index out of range") } function L(e, t, r, n) { t < 0 && (t = 65535 + t + 1); for (var o = 0, i = Math.min(e.length - r, 2); o < i; ++o)e[r + o] = (t & 255 << 8 * (n ? o : 1 - o)) >>> 8 * (n ? o : 1 - o) } function R(e, t, r, n) { t < 0 && (t = 4294967295 + t + 1); for (var o = 0, i = Math.min(e.length - r, 4); o < i; ++o)e[r + o] = t >>> 8 * (n ? o : 3 - o) & 255 } function B(e, t, r, n, o, i) { if (r + n > e.length) throw new RangeError("Index out of range"); if (r < 0) throw new RangeError("Index out of range") } function F(e, t, r, n, o) { return o || B(e, t, r, 4, 3.4028234663852886e38, -3.4028234663852886e38), J.write(e, t, r, n, 23, 4), r + 4 } function U(e, t, r, n, o) { return o || B(e, t, r, 8, 1.7976931348623157e308, -1.7976931348623157e308), J.write(e, t, r, n, 52, 8), r + 8 } function q(e) { if (e = X(e).replace(ee, ""), e.length < 2) return ""; for (; e.length % 4 != 0;)e += "="; return e } function X(e) { return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "") } function G(e) { return e < 16 ? "0" + e.toString(16) : e.toString(16) } function z(e, t) { t = t || 1 / 0; for (var r, n = e.length, o = null, i = [], s = 0; s < n; ++s) { if ((r = e.charCodeAt(s)) > 55295 && r < 57344) { if (!o) { if (r > 56319) { (t -= 3) > -1 && i.push(239, 191, 189); continue } if (s + 1 === n) { (t -= 3) > -1 && i.push(239, 191, 189); continue } o = r; continue } if (r < 56320) { (t -= 3) > -1 && i.push(239, 191, 189), o = r; continue } r = 65536 + (o - 55296 << 10 | r - 56320) } else o && (t -= 3) > -1 && i.push(239, 191, 189); if (o = null, r < 128) { if ((t -= 1) < 0) break; i.push(r) } else if (r < 2048) { if ((t -= 2) < 0) break; i.push(r >> 6 | 192, 63 & r | 128) } else if (r < 65536) { if ((t -= 3) < 0) break; i.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128) } else { if (!(r < 1114112)) throw new Error("Invalid code point"); if ((t -= 4) < 0) break; i.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128) } } return i } function V(e) { for (var t = [], r = 0; r < e.length; ++r)t.push(255 & e.charCodeAt(r)); return t } function H(e, t) { for (var r, n, o, i = [], s = 0; s < e.length && !((t -= 2) < 0); ++s)r = e.charCodeAt(s), n = r >> 8, o = r % 256, i.push(o), i.push(n); return i } function W(e) { return $.toByteArray(q(e)) } function K(e, t, r, n) { for (var o = 0; o < n && !(o + r >= t.length || o >= e.length); ++o)t[o + r] = e[o]; return o } function Y(e) { return e !== e } var $ = e("base64-js"), J = e("ieee754"), Q = e("isarray"); r.Buffer = n, r.SlowBuffer = m, r.INSPECT_MAX_BYTES = 50, n.TYPED_ARRAY_SUPPORT = void 0 !== t.TYPED_ARRAY_SUPPORT ? t.TYPED_ARRAY_SUPPORT : function () { try { var e = new Uint8Array(1); return e.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }, 42 === e.foo() && "function" == typeof e.subarray && 0 === e.subarray(1, 1).byteLength } catch (e) { return !1 } }(), r.kMaxLength = o(), n.poolSize = 8192, n._augment = function (e) { return e.__proto__ = n.prototype, e }, n.from = function (e, t, r) { return s(null, e, t, r) }, n.TYPED_ARRAY_SUPPORT && (n.prototype.__proto__ = Uint8Array.prototype, n.__proto__ = Uint8Array, "undefined" != typeof Symbol && Symbol.species && n[Symbol.species] === n && Object.defineProperty(n, Symbol.species, { value: null, configurable: !0 })), n.alloc = function (e, t, r) { return u(null, e, t, r) }, n.allocUnsafe = function (e) { return c(null, e) }, n.allocUnsafeSlow = function (e) { return c(null, e) }, n.isBuffer = function (e) { return !(null == e || !e._isBuffer) }, n.compare = function (e, t) { if (!n.isBuffer(e) || !n.isBuffer(t)) throw new TypeError("Arguments must be Buffers"); if (e === t) return 0; for (var r = e.length, o = t.length, i = 0, s = Math.min(r, o); i < s; ++i)if (e[i] !== t[i]) { r = e[i], o = t[i]; break } return r < o ? -1 : o < r ? 1 : 0 }, n.isEncoding = function (e) { switch (String(e).toLowerCase()) { case "hex": case "utf8": case "utf-8": case "ascii": case "latin1": case "binary": case "base64": case "ucs2": case "ucs-2": case "utf16le": case "utf-16le": return !0; default: return !1 } }, n.concat = function (e, t) { if (!Q(e)) throw new TypeError('"list" argument must be an Array of Buffers'); if (0 === e.length) return n.alloc(0); var r; if (void 0 === t) for (t = 0, r = 0; r < e.length; ++r)t += e[r].length; var o = n.allocUnsafe(t), i = 0; for (r = 0; r < e.length; ++r) { var s = e[r]; if (!n.isBuffer(s)) throw new TypeError('"list" argument must be an Array of Buffers'); s.copy(o, i), i += s.length } return o }, n.byteLength = b, n.prototype._isBuffer = !0, n.prototype.swap16 = function () { var e = this.length; if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits"); for (var t = 0; t < e; t += 2)g(this, t, t + 1); return this }, n.prototype.swap32 = function () { var e = this.length; if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits"); for (var t = 0; t < e; t += 4)g(this, t, t + 3), g(this, t + 1, t + 2); return this }, n.prototype.swap64 = function () { var e = this.length; if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits"); for (var t = 0; t < e; t += 8)g(this, t, t + 7), g(this, t + 1, t + 6), g(this, t + 2, t + 5), g(this, t + 3, t + 4); return this }, n.prototype.toString = function () { var e = 0 | this.length; return 0 === e ? "" : 0 === arguments.length ? N(this, 0, e) : y.apply(this, arguments) }, n.prototype.equals = function (e) { if (!n.isBuffer(e)) throw new TypeError("Argument must be a Buffer"); return this === e || 0 === n.compare(this, e) }, n.prototype.inspect = function () { var e = "", t = r.INSPECT_MAX_BYTES; return this.length > 0 && (e = this.toString("hex", 0, t).match(/.{2}/g).join(" "), this.length > t && (e += " ... ")), "<Buffer " + e + ">" }, n.prototype.compare = function (e, t, r, o, i) { if (!n.isBuffer(e)) throw new TypeError("Argument must be a Buffer"); if (void 0 === t && (t = 0), void 0 === r && (r = e ? e.length : 0), void 0 === o && (o = 0), void 0 === i && (i = this.length), t < 0 || r > e.length || o < 0 || i > this.length) throw new RangeError("out of range index"); if (o >= i && t >= r) return 0; if (o >= i) return -1; if (t >= r) return 1; if (t >>>= 0, r >>>= 0, o >>>= 0, i >>>= 0, this === e) return 0; for (var s = i - o, a = r - t, u = Math.min(s, a), c = this.slice(o, i), l = e.slice(t, r), f = 0; f < u; ++f)if (c[f] !== l[f]) { s = c[f], a = l[f]; break } return s < a ? -1 : a < s ? 1 : 0 }, n.prototype.includes = function (e, t, r) { return -1 !== this.indexOf(e, t, r) }, n.prototype.indexOf = function (e, t, r) { return v(this, e, t, r, !0) }, n.prototype.lastIndexOf = function (e, t, r) { return v(this, e, t, r, !1) }, n.prototype.write = function (e, t, r, n) { if (void 0 === t) n = "utf8", r = this.length, t = 0; else if (void 0 === r && "string" == typeof t) n = t, r = this.length, t = 0; else { if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported"); t |= 0, isFinite(r) ? (r |= 0, void 0 === n && (n = "utf8")) : (n = r, r = void 0) } var o = this.length - t; if ((void 0 === r || r > o) && (r = o), e.length > 0 && (r < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds"); n || (n = "utf8"); for (var i = !1; ;)switch (n) { case "hex": return w(this, e, t, r); case "utf8": case "utf-8": return x(this, e, t, r); case "ascii": return E(this, e, t, r); case "latin1": case "binary": return T(this, e, t, r); case "base64": return S(this, e, t, r); case "ucs2": case "ucs-2": case "utf16le": case "utf-16le": return j(this, e, t, r); default: if (i) throw new TypeError("Unknown encoding: " + n); n = ("" + n).toLowerCase(), i = !0 } }, n.prototype.toJSON = function () { return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) } }; var Z = 4096; n.prototype.slice = function (e, t) { var r = this.length; e = ~~e, t = void 0 === t ? r : ~~t, e < 0 ? (e += r) < 0 && (e = 0) : e > r && (e = r), t < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r), t < e && (t = e); var o; if (n.TYPED_ARRAY_SUPPORT) o = this.subarray(e, t), o.__proto__ = n.prototype; else { var i = t - e; o = new n(i, void 0); for (var s = 0; s < i; ++s)o[s] = this[s + e] } return o }, n.prototype.readUIntLE = function (e, t, r) { e |= 0, t |= 0, r || M(e, t, this.length); for (var n = this[e], o = 1, i = 0; ++i < t && (o *= 256);)n += this[e + i] * o; return n }, n.prototype.readUIntBE = function (e, t, r) { e |= 0, t |= 0, r || M(e, t, this.length); for (var n = this[e + --t], o = 1; t > 0 && (o *= 256);)n += this[e + --t] * o; return n }, n.prototype.readUInt8 = function (e, t) { return t || M(e, 1, this.length), this[e] }, n.prototype.readUInt16LE = function (e, t) { return t || M(e, 2, this.length), this[e] | this[e + 1] << 8 }, n.prototype.readUInt16BE = function (e, t) { return t || M(e, 2, this.length), this[e] << 8 | this[e + 1] }, n.prototype.readUInt32LE = function (e, t) { return t || M(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3] }, n.prototype.readUInt32BE = function (e, t) {
          return t || M(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
        }, n.prototype.readIntLE = function (e, t, r) { e |= 0, t |= 0, r || M(e, t, this.length); for (var n = this[e], o = 1, i = 0; ++i < t && (o *= 256);)n += this[e + i] * o; return o *= 128, n >= o && (n -= Math.pow(2, 8 * t)), n }, n.prototype.readIntBE = function (e, t, r) { e |= 0, t |= 0, r || M(e, t, this.length); for (var n = t, o = 1, i = this[e + --n]; n > 0 && (o *= 256);)i += this[e + --n] * o; return o *= 128, i >= o && (i -= Math.pow(2, 8 * t)), i }, n.prototype.readInt8 = function (e, t) { return t || M(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e] }, n.prototype.readInt16LE = function (e, t) { t || M(e, 2, this.length); var r = this[e] | this[e + 1] << 8; return 32768 & r ? 4294901760 | r : r }, n.prototype.readInt16BE = function (e, t) { t || M(e, 2, this.length); var r = this[e + 1] | this[e] << 8; return 32768 & r ? 4294901760 | r : r }, n.prototype.readInt32LE = function (e, t) { return t || M(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24 }, n.prototype.readInt32BE = function (e, t) { return t || M(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3] }, n.prototype.readFloatLE = function (e, t) { return t || M(e, 4, this.length), J.read(this, e, !0, 23, 4) }, n.prototype.readFloatBE = function (e, t) { return t || M(e, 4, this.length), J.read(this, e, !1, 23, 4) }, n.prototype.readDoubleLE = function (e, t) { return t || M(e, 8, this.length), J.read(this, e, !0, 52, 8) }, n.prototype.readDoubleBE = function (e, t) { return t || M(e, 8, this.length), J.read(this, e, !1, 52, 8) }, n.prototype.writeUIntLE = function (e, t, r, n) { if (e = +e, t |= 0, r |= 0, !n) { P(this, e, t, r, Math.pow(2, 8 * r) - 1, 0) } var o = 1, i = 0; for (this[t] = 255 & e; ++i < r && (o *= 256);)this[t + i] = e / o & 255; return t + r }, n.prototype.writeUIntBE = function (e, t, r, n) { if (e = +e, t |= 0, r |= 0, !n) { P(this, e, t, r, Math.pow(2, 8 * r) - 1, 0) } var o = r - 1, i = 1; for (this[t + o] = 255 & e; --o >= 0 && (i *= 256);)this[t + o] = e / i & 255; return t + r }, n.prototype.writeUInt8 = function (e, t, r) { return e = +e, t |= 0, r || P(this, e, t, 1, 255, 0), n.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), this[t] = 255 & e, t + 1 }, n.prototype.writeUInt16LE = function (e, t, r) { return e = +e, t |= 0, r || P(this, e, t, 2, 65535, 0), n.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : L(this, e, t, !0), t + 2 }, n.prototype.writeUInt16BE = function (e, t, r) { return e = +e, t |= 0, r || P(this, e, t, 2, 65535, 0), n.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : L(this, e, t, !1), t + 2 }, n.prototype.writeUInt32LE = function (e, t, r) { return e = +e, t |= 0, r || P(this, e, t, 4, 4294967295, 0), n.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e) : R(this, e, t, !0), t + 4 }, n.prototype.writeUInt32BE = function (e, t, r) { return e = +e, t |= 0, r || P(this, e, t, 4, 4294967295, 0), n.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : R(this, e, t, !1), t + 4 }, n.prototype.writeIntLE = function (e, t, r, n) { if (e = +e, t |= 0, !n) { var o = Math.pow(2, 8 * r - 1); P(this, e, t, r, o - 1, -o) } var i = 0, s = 1, a = 0; for (this[t] = 255 & e; ++i < r && (s *= 256);)e < 0 && 0 === a && 0 !== this[t + i - 1] && (a = 1), this[t + i] = (e / s >> 0) - a & 255; return t + r }, n.prototype.writeIntBE = function (e, t, r, n) { if (e = +e, t |= 0, !n) { var o = Math.pow(2, 8 * r - 1); P(this, e, t, r, o - 1, -o) } var i = r - 1, s = 1, a = 0; for (this[t + i] = 255 & e; --i >= 0 && (s *= 256);)e < 0 && 0 === a && 0 !== this[t + i + 1] && (a = 1), this[t + i] = (e / s >> 0) - a & 255; return t + r }, n.prototype.writeInt8 = function (e, t, r) { return e = +e, t |= 0, r || P(this, e, t, 1, 127, -128), n.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1 }, n.prototype.writeInt16LE = function (e, t, r) { return e = +e, t |= 0, r || P(this, e, t, 2, 32767, -32768), n.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : L(this, e, t, !0), t + 2 }, n.prototype.writeInt16BE = function (e, t, r) { return e = +e, t |= 0, r || P(this, e, t, 2, 32767, -32768), n.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : L(this, e, t, !1), t + 2 }, n.prototype.writeInt32LE = function (e, t, r) { return e = +e, t |= 0, r || P(this, e, t, 4, 2147483647, -2147483648), n.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24) : R(this, e, t, !0), t + 4 }, n.prototype.writeInt32BE = function (e, t, r) { return e = +e, t |= 0, r || P(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), n.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : R(this, e, t, !1), t + 4 }, n.prototype.writeFloatLE = function (e, t, r) { return F(this, e, t, !0, r) }, n.prototype.writeFloatBE = function (e, t, r) { return F(this, e, t, !1, r) }, n.prototype.writeDoubleLE = function (e, t, r) { return U(this, e, t, !0, r) }, n.prototype.writeDoubleBE = function (e, t, r) { return U(this, e, t, !1, r) }, n.prototype.copy = function (e, t, r, o) { if (r || (r = 0), o || 0 === o || (o = this.length), t >= e.length && (t = e.length), t || (t = 0), o > 0 && o < r && (o = r), o === r) return 0; if (0 === e.length || 0 === this.length) return 0; if (t < 0) throw new RangeError("targetStart out of bounds"); if (r < 0 || r >= this.length) throw new RangeError("sourceStart out of bounds"); if (o < 0) throw new RangeError("sourceEnd out of bounds"); o > this.length && (o = this.length), e.length - t < o - r && (o = e.length - t + r); var i, s = o - r; if (this === e && r < t && t < o) for (i = s - 1; i >= 0; --i)e[i + t] = this[i + r]; else if (s < 1e3 || !n.TYPED_ARRAY_SUPPORT) for (i = 0; i < s; ++i)e[i + t] = this[i + r]; else Uint8Array.prototype.set.call(e, this.subarray(r, r + s), t); return s }, n.prototype.fill = function (e, t, r, o) { if ("string" == typeof e) { if ("string" == typeof t ? (o = t, t = 0, r = this.length) : "string" == typeof r && (o = r, r = this.length), 1 === e.length) { var i = e.charCodeAt(0); i < 256 && (e = i) } if (void 0 !== o && "string" != typeof o) throw new TypeError("encoding must be a string"); if ("string" == typeof o && !n.isEncoding(o)) throw new TypeError("Unknown encoding: " + o) } else "number" == typeof e && (e &= 255); if (t < 0 || this.length < t || this.length < r) throw new RangeError("Out of range index"); if (r <= t) return this; t >>>= 0, r = void 0 === r ? this.length : r >>> 0, e || (e = 0); var s; if ("number" == typeof e) for (s = t; s < r; ++s)this[s] = e; else { var a = n.isBuffer(e) ? e : z(new n(e, o).toString()), u = a.length; for (s = 0; s < r - t; ++s)this[s + t] = a[s % u] } return this }; var ee = /[^+\/0-9A-Za-z-_]/g
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("buffer").Buffer)
    }, { "base64-js": 69, buffer: 73, ieee754: 195, isarray: 198 }], 74: [function (e, t, r) { t.exports = { 100: "Continue", 101: "Switching Protocols", 102: "Processing", 200: "OK", 201: "Created", 202: "Accepted", 203: "Non-Authoritative Information", 204: "No Content", 205: "Reset Content", 206: "Partial Content", 207: "Multi-Status", 208: "Already Reported", 226: "IM Used", 300: "Multiple Choices", 301: "Moved Permanently", 302: "Found", 303: "See Other", 304: "Not Modified", 305: "Use Proxy", 307: "Temporary Redirect", 308: "Permanent Redirect", 400: "Bad Request", 401: "Unauthorized", 402: "Payment Required", 403: "Forbidden", 404: "Not Found", 405: "Method Not Allowed", 406: "Not Acceptable", 407: "Proxy Authentication Required", 408: "Request Timeout", 409: "Conflict", 410: "Gone", 411: "Length Required", 412: "Precondition Failed", 413: "Payload Too Large", 414: "URI Too Long", 415: "Unsupported Media Type", 416: "Range Not Satisfiable", 417: "Expectation Failed", 418: "I'm a teapot", 421: "Misdirected Request", 422: "Unprocessable Entity", 423: "Locked", 424: "Failed Dependency", 425: "Unordered Collection", 426: "Upgrade Required", 428: "Precondition Required", 429: "Too Many Requests", 431: "Request Header Fields Too Large", 451: "Unavailable For Legal Reasons", 500: "Internal Server Error", 501: "Not Implemented", 502: "Bad Gateway", 503: "Service Unavailable", 504: "Gateway Timeout", 505: "HTTP Version Not Supported", 506: "Variant Also Negotiates", 507: "Insufficient Storage", 508: "Loop Detected", 509: "Bandwidth Limit Exceeded", 510: "Not Extended", 511: "Network Authentication Required" } }, {}], 75: [function (e, t, r) { t.exports = { O_RDONLY: 0, O_WRONLY: 1, O_RDWR: 2, S_IFMT: 61440, S_IFREG: 32768, S_IFDIR: 16384, S_IFCHR: 8192, S_IFBLK: 24576, S_IFIFO: 4096, S_IFLNK: 40960, S_IFSOCK: 49152, O_CREAT: 512, O_EXCL: 2048, O_NOCTTY: 131072, O_TRUNC: 1024, O_APPEND: 8, O_DIRECTORY: 1048576, O_NOFOLLOW: 256, O_SYNC: 128, O_SYMLINK: 2097152, O_NONBLOCK: 4, S_IRWXU: 448, S_IRUSR: 256, S_IWUSR: 128, S_IXUSR: 64, S_IRWXG: 56, S_IRGRP: 32, S_IWGRP: 16, S_IXGRP: 8, S_IRWXO: 7, S_IROTH: 4, S_IWOTH: 2, S_IXOTH: 1, E2BIG: 7, EACCES: 13, EADDRINUSE: 48, EADDRNOTAVAIL: 49, EAFNOSUPPORT: 47, EAGAIN: 35, EALREADY: 37, EBADF: 9, EBADMSG: 94, EBUSY: 16, ECANCELED: 89, ECHILD: 10, ECONNABORTED: 53, ECONNREFUSED: 61, ECONNRESET: 54, EDEADLK: 11, EDESTADDRREQ: 39, EDOM: 33, EDQUOT: 69, EEXIST: 17, EFAULT: 14, EFBIG: 27, EHOSTUNREACH: 65, EIDRM: 90, EILSEQ: 92, EINPROGRESS: 36, EINTR: 4, EINVAL: 22, EIO: 5, EISCONN: 56, EISDIR: 21, ELOOP: 62, EMFILE: 24, EMLINK: 31, EMSGSIZE: 40, EMULTIHOP: 95, ENAMETOOLONG: 63, ENETDOWN: 50, ENETRESET: 52, ENETUNREACH: 51, ENFILE: 23, ENOBUFS: 55, ENODATA: 96, ENODEV: 19, ENOENT: 2, ENOEXEC: 8, ENOLCK: 77, ENOLINK: 97, ENOMEM: 12, ENOMSG: 91, ENOPROTOOPT: 42, ENOSPC: 28, ENOSR: 98, ENOSTR: 99, ENOSYS: 78, ENOTCONN: 57, ENOTDIR: 20, ENOTEMPTY: 66, ENOTSOCK: 38, ENOTSUP: 45, ENOTTY: 25, ENXIO: 6, EOPNOTSUPP: 102, EOVERFLOW: 84, EPERM: 1, EPIPE: 32, EPROTO: 100, EPROTONOSUPPORT: 43, EPROTOTYPE: 41, ERANGE: 34, EROFS: 30, ESPIPE: 29, ESRCH: 3, ESTALE: 70, ETIME: 101, ETIMEDOUT: 60, ETXTBSY: 26, EWOULDBLOCK: 35, EXDEV: 18, SIGHUP: 1, SIGINT: 2, SIGQUIT: 3, SIGILL: 4, SIGTRAP: 5, SIGABRT: 6, SIGIOT: 6, SIGBUS: 10, SIGFPE: 8, SIGKILL: 9, SIGUSR1: 30, SIGSEGV: 11, SIGUSR2: 31, SIGPIPE: 13, SIGALRM: 14, SIGTERM: 15, SIGCHLD: 20, SIGCONT: 19, SIGSTOP: 17, SIGTSTP: 18, SIGTTIN: 21, SIGTTOU: 22, SIGURG: 16, SIGXCPU: 24, SIGXFSZ: 25, SIGVTALRM: 26, SIGPROF: 27, SIGWINCH: 28, SIGIO: 23, SIGSYS: 12, SSL_OP_ALL: 2147486719, SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION: 262144, SSL_OP_CIPHER_SERVER_PREFERENCE: 4194304, SSL_OP_CISCO_ANYCONNECT: 32768, SSL_OP_COOKIE_EXCHANGE: 8192, SSL_OP_CRYPTOPRO_TLSEXT_BUG: 2147483648, SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS: 2048, SSL_OP_EPHEMERAL_RSA: 0, SSL_OP_LEGACY_SERVER_CONNECT: 4, SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER: 32, SSL_OP_MICROSOFT_SESS_ID_BUG: 1, SSL_OP_MSIE_SSLV2_RSA_PADDING: 0, SSL_OP_NETSCAPE_CA_DN_BUG: 536870912, SSL_OP_NETSCAPE_CHALLENGE_BUG: 2, SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG: 1073741824, SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG: 8, SSL_OP_NO_COMPRESSION: 131072, SSL_OP_NO_QUERY_MTU: 4096, SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION: 65536, SSL_OP_NO_SSLv2: 16777216, SSL_OP_NO_SSLv3: 33554432, SSL_OP_NO_TICKET: 16384, SSL_OP_NO_TLSv1: 67108864, SSL_OP_NO_TLSv1_1: 268435456, SSL_OP_NO_TLSv1_2: 134217728, SSL_OP_PKCS1_CHECK_1: 0, SSL_OP_PKCS1_CHECK_2: 0, SSL_OP_SINGLE_DH_USE: 1048576, SSL_OP_SINGLE_ECDH_USE: 524288, SSL_OP_SSLEAY_080_CLIENT_DH_BUG: 128, SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG: 0, SSL_OP_TLS_BLOCK_PADDING_BUG: 512, SSL_OP_TLS_D5_BUG: 256, SSL_OP_TLS_ROLLBACK_BUG: 8388608, ENGINE_METHOD_DSA: 2, ENGINE_METHOD_DH: 4, ENGINE_METHOD_RAND: 8, ENGINE_METHOD_ECDH: 16, ENGINE_METHOD_ECDSA: 32, ENGINE_METHOD_CIPHERS: 64, ENGINE_METHOD_DIGESTS: 128, ENGINE_METHOD_STORE: 256, ENGINE_METHOD_PKEY_METHS: 512, ENGINE_METHOD_PKEY_ASN1_METHS: 1024, ENGINE_METHOD_ALL: 65535, ENGINE_METHOD_NONE: 0, DH_CHECK_P_NOT_SAFE_PRIME: 2, DH_CHECK_P_NOT_PRIME: 1, DH_UNABLE_TO_CHECK_GENERATOR: 4, DH_NOT_SUITABLE_GENERATOR: 8, NPN_ENABLED: 1, RSA_PKCS1_PADDING: 1, RSA_SSLV23_PADDING: 2, RSA_NO_PADDING: 3, RSA_PKCS1_OAEP_PADDING: 4, RSA_X931_PADDING: 5, RSA_PKCS1_PSS_PADDING: 6, POINT_CONVERSION_COMPRESSED: 2, POINT_CONVERSION_UNCOMPRESSED: 4, POINT_CONVERSION_HYBRID: 6, F_OK: 0, R_OK: 4, W_OK: 2, X_OK: 1, UV_UDP_REUSEADDR: 4 } }, {}], 76: [function (e, t, r) { "use strict"; function n(e, t) { if (!(this instanceof n)) return new n(e, t); this.src = e, this._withAccess = t } function o(e, t) { return void 0 === e[t] && void 0 === e.__lookupGetter__(t) && void 0 === e.__lookupSetter__(t) } var i = Array.prototype.slice; t.exports = n, n.prototype.withAccess = function (e) { return this._withAccess = !1 !== e, this }, n.prototype.pick = function (e) { return Array.isArray(e) || (e = i.call(arguments)), e.length && (this.keys = e), this }, n.prototype.to = function (e) { if (e = e || {}, !this.src) return e; var t = this.keys || Object.keys(this.src); if (!this._withAccess) { for (var r = 0; r < t.length; r++)n = t[r], void 0 === e[n] && (e[n] = this.src[n]); return e } for (var r = 0; r < t.length; r++) { var n = t[r]; if (o(e, n)) { var i = this.src.__lookupGetter__(n), s = this.src.__lookupSetter__(n); i && e.__defineGetter__(n, i), s && e.__defineSetter__(n, s), i || s || (e[n] = this.src[n]) } } return e }, n.prototype.toCover = function (e) { for (var t = this.keys || Object.keys(this.src), r = 0; r < t.length; r++) { var n = t[r]; delete e[n]; var o = this.src.__lookupGetter__(n), i = this.src.__lookupSetter__(n); o && e.__defineGetter__(n, o), i && e.__defineSetter__(n, i), o || i || (e[n] = this.src[n]) } }, n.prototype.override = n.prototype.toCover, n.prototype.and = function (e) { var t = {}; return this.to(t), this.src = e, this.to(t), this.src = t, this } }, {}], 77: [function (e, t, r) { e("../../modules/es6.string.iterator"), e("../../modules/es6.array.from"), t.exports = e("../../modules/_core").Array.from }, { "../../modules/_core": 99, "../../modules/es6.array.from": 168, "../../modules/es6.string.iterator": 180 }], 78: [function (e, t, r) { var n = e("../../modules/_core"), o = n.JSON || (n.JSON = { stringify: JSON.stringify }); t.exports = function (e) { return o.stringify.apply(o, arguments) } }, { "../../modules/_core": 99 }], 79: [function (e, t, r) { e("../../modules/es6.object.assign"), t.exports = e("../../modules/_core").Object.assign }, { "../../modules/_core": 99, "../../modules/es6.object.assign": 171 }], 80: [function (e, t, r) { e("../../modules/es6.object.create"); var n = e("../../modules/_core").Object; t.exports = function (e, t) { return n.create(e, t) } }, { "../../modules/_core": 99, "../../modules/es6.object.create": 172 }], 81: [function (e, t, r) { e("../../modules/es6.object.define-property"); var n = e("../../modules/_core").Object; t.exports = function (e, t, r) { return n.defineProperty(e, t, r) } }, { "../../modules/_core": 99, "../../modules/es6.object.define-property": 173 }], 82: [function (e, t, r) { e("../../modules/es7.object.entries"), t.exports = e("../../modules/_core").Object.entries }, { "../../modules/_core": 99, "../../modules/es7.object.entries": 182 }], 83: [function (e, t, r) { e("../../modules/es6.object.get-own-property-names"); var n = e("../../modules/_core").Object; t.exports = function (e) { return n.getOwnPropertyNames(e) } }, { "../../modules/_core": 99, "../../modules/es6.object.get-own-property-names": 174 }], 84: [function (e, t, r) { e("../../modules/es6.object.get-prototype-of"), t.exports = e("../../modules/_core").Object.getPrototypeOf }, { "../../modules/_core": 99, "../../modules/es6.object.get-prototype-of": 175 }], 85: [function (e, t, r) { e("../../modules/es6.object.keys"), t.exports = e("../../modules/_core").Object.keys }, { "../../modules/_core": 99, "../../modules/es6.object.keys": 176 }], 86: [function (e, t, r) { e("../modules/es6.object.to-string"), e("../modules/es6.string.iterator"), e("../modules/web.dom.iterable"), e("../modules/es6.promise"), e("../modules/es7.promise.finally"), e("../modules/es7.promise.try"), t.exports = e("../modules/_core").Promise }, { "../modules/_core": 99, "../modules/es6.object.to-string": 177, "../modules/es6.promise": 178, "../modules/es6.string.iterator": 180, "../modules/es7.promise.finally": 183, "../modules/es7.promise.try": 184, "../modules/web.dom.iterable": 187 }], 87: [function (e, t, r) { e("../modules/web.immediate"), t.exports = e("../modules/_core").setImmediate }, { "../modules/_core": 99, "../modules/web.immediate": 188 }], 88: [function (e, t, r) { e("../../modules/es6.string.from-code-point"), t.exports = e("../../modules/_core").String.fromCodePoint }, { "../../modules/_core": 99, "../../modules/es6.string.from-code-point": 179 }], 89: [function (e, t, r) { e("../../modules/es6.function.has-instance"), t.exports = e("../../modules/_wks-ext").f("hasInstance") }, { "../../modules/_wks-ext": 165, "../../modules/es6.function.has-instance": 170 }], 90: [function (e, t, r) { e("../../modules/es6.symbol"), e("../../modules/es6.object.to-string"), e("../../modules/es7.symbol.async-iterator"), e("../../modules/es7.symbol.observable"), t.exports = e("../../modules/_core").Symbol }, { "../../modules/_core": 99, "../../modules/es6.object.to-string": 177, "../../modules/es6.symbol": 181, "../../modules/es7.symbol.async-iterator": 185, "../../modules/es7.symbol.observable": 186 }], 91: [function (e, t, r) { e("../../modules/es6.string.iterator"), e("../../modules/web.dom.iterable"), t.exports = e("../../modules/_wks-ext").f("iterator") }, { "../../modules/_wks-ext": 165, "../../modules/es6.string.iterator": 180, "../../modules/web.dom.iterable": 187 }], 92: [function (e, t, r) { t.exports = function (e) { if ("function" != typeof e) throw TypeError(e + " is not a function!"); return e } }, {}], 93: [function (e, t, r) { t.exports = function () { } }, {}], 94: [function (e, t, r) { t.exports = function (e, t, r, n) { if (!(e instanceof t) || void 0 !== n && n in e) throw TypeError(r + ": incorrect invocation!"); return e } }, {}], 95: [function (e, t, r) { var n = e("./_is-object"); t.exports = function (e) { if (!n(e)) throw TypeError(e + " is not an object!"); return e } }, { "./_is-object": 119 }], 96: [function (e, t, r) { var n = e("./_to-iobject"), o = e("./_to-length"), i = e("./_to-absolute-index"); t.exports = function (e) { return function (t, r, s) { var a, u = n(t), c = o(u.length), l = i(s, c); if (e && r != r) { for (; c > l;)if ((a = u[l++]) != a) return !0 } else for (; c > l; l++)if ((e || l in u) && u[l] === r) return e || l || 0; return !e && -1 } } }, { "./_to-absolute-index": 156, "./_to-iobject": 158, "./_to-length": 159 }], 97: [function (e, t, r) { var n = e("./_cof"), o = e("./_wks")("toStringTag"), i = "Arguments" == n(function () { return arguments }()), s = function (e, t) { try { return e[t] } catch (e) { } }; t.exports = function (e) { var t, r, a; return void 0 === e ? "Undefined" : null === e ? "Null" : "string" == typeof (r = s(t = Object(e), o)) ? r : i ? n(t) : "Object" == (a = n(t)) && "function" == typeof t.callee ? "Arguments" : a } }, { "./_cof": 98, "./_wks": 166 }], 98: [function (e, t, r) { var n = {}.toString; t.exports = function (e) { return n.call(e).slice(8, -1) } }, {}], 99: [function (e, t, r) { var n = t.exports = { version: "2.6.11" }; "number" == typeof __e && (__e = n) }, {}], 100: [function (e, t, r) { "use strict"; var n = e("./_object-dp"), o = e("./_property-desc"); t.exports = function (e, t, r) { t in e ? n.f(e, t, o(0, r)) : e[t] = r } }, { "./_object-dp": 132, "./_property-desc": 146 }], 101: [function (e, t, r) { var n = e("./_a-function"); t.exports = function (e, t, r) { if (n(e), void 0 === t) return e; switch (r) { case 1: return function (r) { return e.call(t, r) }; case 2: return function (r, n) { return e.call(t, r, n) }; case 3: return function (r, n, o) { return e.call(t, r, n, o) } }return function () { return e.apply(t, arguments) } } }, { "./_a-function": 92 }], 102: [function (e, t, r) { t.exports = function (e) { if (void 0 == e) throw TypeError("Can't call method on  " + e); return e } }, {}], 103: [function (e, t, r) { t.exports = !e("./_fails")(function () { return 7 != Object.defineProperty({}, "a", { get: function () { return 7 } }).a }) }, { "./_fails": 108 }], 104: [function (e, t, r) { var n = e("./_is-object"), o = e("./_global").document, i = n(o) && n(o.createElement); t.exports = function (e) { return i ? o.createElement(e) : {} } }, { "./_global": 110, "./_is-object": 119 }], 105: [function (e, t, r) { t.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",") }, {}], 106: [function (e, t, r) { var n = e("./_object-keys"), o = e("./_object-gops"), i = e("./_object-pie"); t.exports = function (e) { var t = n(e), r = o.f; if (r) for (var s, a = r(e), u = i.f, c = 0; a.length > c;)u.call(e, s = a[c++]) && t.push(s); return t } }, { "./_object-gops": 137, "./_object-keys": 140, "./_object-pie": 141 }], 107: [function (e, t, r) { var n = e("./_global"), o = e("./_core"), i = e("./_ctx"), s = e("./_hide"), a = e("./_has"), u = function (e, t, r) { var c, l, f, p = e & u.F, h = e & u.G, d = e & u.S, m = e & u.P, b = e & u.B, y = e & u.W, g = h ? o : o[t] || (o[t] = {}), v = g.prototype, _ = h ? n : d ? n[t] : (n[t] || {}).prototype; h && (r = t); for (c in r) (l = !p && _ && void 0 !== _[c]) && a(g, c) || (f = l ? _[c] : r[c], g[c] = h && "function" != typeof _[c] ? r[c] : b && l ? i(f, n) : y && _[c] == f ? function (e) { var t = function (t, r, n) { if (this instanceof e) { switch (arguments.length) { case 0: return new e; case 1: return new e(t); case 2: return new e(t, r) }return new e(t, r, n) } return e.apply(this, arguments) }; return t.prototype = e.prototype, t }(f) : m && "function" == typeof f ? i(Function.call, f) : f, m && ((g.virtual || (g.virtual = {}))[c] = f, e & u.R && v && !v[c] && s(v, c, f))) }; u.F = 1, u.G = 2, u.S = 4, u.P = 8, u.B = 16, u.W = 32, u.U = 64, u.R = 128, t.exports = u }, { "./_core": 99, "./_ctx": 101, "./_global": 110, "./_has": 111, "./_hide": 112 }], 108: [function (e, t, r) { t.exports = function (e) { try { return !!e() } catch (e) { return !0 } } }, {}], 109: [function (e, t, r) { var n = e("./_ctx"), o = e("./_iter-call"), i = e("./_is-array-iter"), s = e("./_an-object"), a = e("./_to-length"), u = e("./core.get-iterator-method"), c = {}, l = {}, r = t.exports = function (e, t, r, f, p) { var h, d, m, b, y = p ? function () { return e } : u(e), g = n(r, f, t ? 2 : 1), v = 0; if ("function" != typeof y) throw TypeError(e + " is not iterable!"); if (i(y)) { for (h = a(e.length); h > v; v++)if ((b = t ? g(s(d = e[v])[0], d[1]) : g(e[v])) === c || b === l) return b } else for (m = y.call(e); !(d = m.next()).done;)if ((b = o(m, g, d.value, t)) === c || b === l) return b }; r.BREAK = c, r.RETURN = l }, { "./_an-object": 95, "./_ctx": 101, "./_is-array-iter": 117, "./_iter-call": 120, "./_to-length": 159, "./core.get-iterator-method": 167 }], 110: [function (e, t, r) { var n = t.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")(); "number" == typeof __g && (__g = n) }, {}], 111: [function (e, t, r) { var n = {}.hasOwnProperty; t.exports = function (e, t) { return n.call(e, t) } }, {}], 112: [function (e, t, r) { var n = e("./_object-dp"), o = e("./_property-desc"); t.exports = e("./_descriptors") ? function (e, t, r) { return n.f(e, t, o(1, r)) } : function (e, t, r) { return e[t] = r, e } }, { "./_descriptors": 103, "./_object-dp": 132, "./_property-desc": 146 }], 113: [function (e, t, r) { var n = e("./_global").document; t.exports = n && n.documentElement }, { "./_global": 110 }], 114: [function (e, t, r) { t.exports = !e("./_descriptors") && !e("./_fails")(function () { return 7 != Object.defineProperty(e("./_dom-create")("div"), "a", { get: function () { return 7 } }).a }) }, { "./_descriptors": 103, "./_dom-create": 104, "./_fails": 108 }], 115: [function (e, t, r) { t.exports = function (e, t, r) { var n = void 0 === r; switch (t.length) { case 0: return n ? e() : e.call(r); case 1: return n ? e(t[0]) : e.call(r, t[0]); case 2: return n ? e(t[0], t[1]) : e.call(r, t[0], t[1]); case 3: return n ? e(t[0], t[1], t[2]) : e.call(r, t[0], t[1], t[2]); case 4: return n ? e(t[0], t[1], t[2], t[3]) : e.call(r, t[0], t[1], t[2], t[3]) }return e.apply(r, t) } }, {}], 116: [function (e, t, r) { var n = e("./_cof"); t.exports = Object("z").propertyIsEnumerable(0) ? Object : function (e) { return "String" == n(e) ? e.split("") : Object(e) } }, { "./_cof": 98 }], 117: [function (e, t, r) { var n = e("./_iterators"), o = e("./_wks")("iterator"), i = Array.prototype; t.exports = function (e) { return void 0 !== e && (n.Array === e || i[o] === e) } }, { "./_iterators": 125, "./_wks": 166 }], 118: [function (e, t, r) { var n = e("./_cof"); t.exports = Array.isArray || function (e) { return "Array" == n(e) } }, { "./_cof": 98 }], 119: [function (e, t, r) { t.exports = function (e) { return "object" == typeof e ? null !== e : "function" == typeof e } }, {}], 120: [function (e, t, r) { var n = e("./_an-object"); t.exports = function (e, t, r, o) { try { return o ? t(n(r)[0], r[1]) : t(r) } catch (t) { var i = e.return; throw void 0 !== i && n(i.call(e)), t } } }, { "./_an-object": 95 }], 121: [function (e, t, r) { "use strict"; var n = e("./_object-create"), o = e("./_property-desc"), i = e("./_set-to-string-tag"), s = {}; e("./_hide")(s, e("./_wks")("iterator"), function () { return this }), t.exports = function (e, t, r) { e.prototype = n(s, { next: o(1, r) }), i(e, t + " Iterator") } }, { "./_hide": 112, "./_object-create": 131, "./_property-desc": 146, "./_set-to-string-tag": 150, "./_wks": 166 }], 122: [function (e, t, r) { "use strict"; var n = e("./_library"), o = e("./_export"), i = e("./_redefine"), s = e("./_hide"), a = e("./_iterators"), u = e("./_iter-create"), c = e("./_set-to-string-tag"), l = e("./_object-gpo"), f = e("./_wks")("iterator"), p = !([].keys && "next" in [].keys()), h = function () { return this }; t.exports = function (e, t, r, d, m, b, y) { u(r, t, d); var g, v, _, w = function (e) { if (!p && e in S) return S[e]; switch (e) { case "keys": case "values": return function () { return new r(this, e) } }return function () { return new r(this, e) } }, x = t + " Iterator", E = "values" == m, T = !1, S = e.prototype, j = S[f] || S["@@iterator"] || m && S[m], O = j || w(m), N = m ? E ? w("entries") : O : void 0, k = "Array" == t ? S.entries || j : j; if (k && (_ = l(k.call(new e))) !== Object.prototype && _.next && (c(_, x, !0), n || "function" == typeof _[f] || s(_, f, h)), E && j && "values" !== j.name && (T = !0, O = function () { return j.call(this) }), n && !y || !p && !T && S[f] || s(S, f, O), a[t] = O, a[x] = h, m) if (g = { values: E ? O : w("values"), keys: b ? O : w("keys"), entries: N }, y) for (v in g) v in S || i(S, v, g[v]); else o(o.P + o.F * (p || T), t, g); return g } }, { "./_export": 107, "./_hide": 112, "./_iter-create": 121, "./_iterators": 125, "./_library": 126, "./_object-gpo": 138, "./_redefine": 148, "./_set-to-string-tag": 150, "./_wks": 166 }], 123: [function (e, t, r) { var n = e("./_wks")("iterator"), o = !1; try { var i = [7][n](); i.return = function () { o = !0 }, Array.from(i, function () { throw 2 }) } catch (e) { } t.exports = function (e, t) { if (!t && !o) return !1; var r = !1; try { var i = [7], s = i[n](); s.next = function () { return { done: r = !0 } }, i[n] = function () { return s }, e(i) } catch (e) { } return r } }, { "./_wks": 166 }], 124: [function (e, t, r) { t.exports = function (e, t) { return { value: t, done: !!e } } }, {}], 125: [function (e, t, r) { t.exports = {} }, {}], 126: [function (e, t, r) { t.exports = !0 }, {}], 127: [function (e, t, r) { var n = e("./_uid")("meta"), o = e("./_is-object"), i = e("./_has"), s = e("./_object-dp").f, a = 0, u = Object.isExtensible || function () { return !0 }, c = !e("./_fails")(function () { return u(Object.preventExtensions({})) }), l = function (e) { s(e, n, { value: { i: "O" + ++a, w: {} } }) }, f = function (e, t) { if (!o(e)) return "symbol" == typeof e ? e : ("string" == typeof e ? "S" : "P") + e; if (!i(e, n)) { if (!u(e)) return "F"; if (!t) return "E"; l(e) } return e[n].i }, p = function (e, t) { if (!i(e, n)) { if (!u(e)) return !0; if (!t) return !1; l(e) } return e[n].w }, h = function (e) { return c && d.NEED && u(e) && !i(e, n) && l(e), e }, d = t.exports = { KEY: n, NEED: !1, fastKey: f, getWeak: p, onFreeze: h } }, { "./_fails": 108, "./_has": 111, "./_is-object": 119, "./_object-dp": 132, "./_uid": 162 }], 128: [function (e, t, r) { var n = e("./_global"), o = e("./_task").set, i = n.MutationObserver || n.WebKitMutationObserver, s = n.process, a = n.Promise, u = "process" == e("./_cof")(s); t.exports = function () { var e, t, r, c = function () { var n, o; for (u && (n = s.domain) && n.exit(); e;) { o = e.fn, e = e.next; try { o() } catch (n) { throw e ? r() : t = void 0, n } } t = void 0, n && n.enter() }; if (u) r = function () { s.nextTick(c) }; else if (!i || n.navigator && n.navigator.standalone) if (a && a.resolve) { var l = a.resolve(void 0); r = function () { l.then(c) } } else r = function () { o.call(n, c) }; else { var f = !0, p = document.createTextNode(""); new i(c).observe(p, { characterData: !0 }), r = function () { p.data = f = !f } } return function (n) { var o = { fn: n, next: void 0 }; t && (t.next = o), e || (e = o, r()), t = o } } }, { "./_cof": 98, "./_global": 110, "./_task": 155 }], 129: [function (e, t, r) { "use strict"; function n(e) { var t, r; this.promise = new e(function (e, n) { if (void 0 !== t || void 0 !== r) throw TypeError("Bad Promise constructor"); t = e, r = n }), this.resolve = o(t), this.reject = o(r) } var o = e("./_a-function"); t.exports.f = function (e) { return new n(e) } }, { "./_a-function": 92 }], 130: [function (e, t, r) { "use strict"; var n = e("./_descriptors"), o = e("./_object-keys"), i = e("./_object-gops"), s = e("./_object-pie"), a = e("./_to-object"), u = e("./_iobject"), c = Object.assign; t.exports = !c || e("./_fails")(function () { var e = {}, t = {}, r = Symbol(), n = "abcdefghijklmnopqrst"; return e[r] = 7, n.split("").forEach(function (e) { t[e] = e }), 7 != c({}, e)[r] || Object.keys(c({}, t)).join("") != n }) ? function (e, t) { for (var r = a(e), c = arguments.length, l = 1, f = i.f, p = s.f; c > l;)for (var h, d = u(arguments[l++]), m = f ? o(d).concat(f(d)) : o(d), b = m.length, y = 0; b > y;)h = m[y++], n && !p.call(d, h) || (r[h] = d[h]); return r } : c }, { "./_descriptors": 103, "./_fails": 108, "./_iobject": 116, "./_object-gops": 137, "./_object-keys": 140, "./_object-pie": 141, "./_to-object": 160 }], 131: [function (e, t, r) { var n = e("./_an-object"), o = e("./_object-dps"), i = e("./_enum-bug-keys"), s = e("./_shared-key")("IE_PROTO"), a = function () { }, u = function () { var t, r = e("./_dom-create")("iframe"), n = i.length; for (r.style.display = "none", e("./_html").appendChild(r), r.src = "javascript:", t = r.contentWindow.document, t.open(), t.write("<script>document.F=Object<\/script>"), t.close(), u = t.F; n--;)delete u.prototype[i[n]]; return u() }; t.exports = Object.create || function (e, t) { var r; return null !== e ? (a.prototype = n(e), r = new a, a.prototype = null, r[s] = e) : r = u(), void 0 === t ? r : o(r, t) } }, { "./_an-object": 95, "./_dom-create": 104, "./_enum-bug-keys": 105, "./_html": 113, "./_object-dps": 133, "./_shared-key": 151 }], 132: [function (e, t, r) { var n = e("./_an-object"), o = e("./_ie8-dom-define"), i = e("./_to-primitive"), s = Object.defineProperty; r.f = e("./_descriptors") ? Object.defineProperty : function (e, t, r) { if (n(e), t = i(t, !0), n(r), o) try { return s(e, t, r) } catch (e) { } if ("get" in r || "set" in r) throw TypeError("Accessors not supported!"); return "value" in r && (e[t] = r.value), e } }, { "./_an-object": 95, "./_descriptors": 103, "./_ie8-dom-define": 114, "./_to-primitive": 161 }], 133: [function (e, t, r) { var n = e("./_object-dp"), o = e("./_an-object"), i = e("./_object-keys"); t.exports = e("./_descriptors") ? Object.defineProperties : function (e, t) { o(e); for (var r, s = i(t), a = s.length, u = 0; a > u;)n.f(e, r = s[u++], t[r]); return e } }, { "./_an-object": 95, "./_descriptors": 103, "./_object-dp": 132, "./_object-keys": 140 }], 134: [function (e, t, r) { var n = e("./_object-pie"), o = e("./_property-desc"), i = e("./_to-iobject"), s = e("./_to-primitive"), a = e("./_has"), u = e("./_ie8-dom-define"), c = Object.getOwnPropertyDescriptor; r.f = e("./_descriptors") ? c : function (e, t) { if (e = i(e), t = s(t, !0), u) try { return c(e, t) } catch (e) { } if (a(e, t)) return o(!n.f.call(e, t), e[t]) } }, { "./_descriptors": 103, "./_has": 111, "./_ie8-dom-define": 114, "./_object-pie": 141, "./_property-desc": 146, "./_to-iobject": 158, "./_to-primitive": 161 }], 135: [function (e, t, r) { var n = e("./_to-iobject"), o = e("./_object-gopn").f, i = {}.toString, s = "object" == typeof window && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [], a = function (e) { try { return o(e) } catch (e) { return s.slice() } }; t.exports.f = function (e) { return s && "[object Window]" == i.call(e) ? a(e) : o(n(e)) } }, { "./_object-gopn": 136, "./_to-iobject": 158 }], 136: [function (e, t, r) { var n = e("./_object-keys-internal"), o = e("./_enum-bug-keys").concat("length", "prototype"); r.f = Object.getOwnPropertyNames || function (e) { return n(e, o) } }, { "./_enum-bug-keys": 105, "./_object-keys-internal": 139 }], 137: [function (e, t, r) { r.f = Object.getOwnPropertySymbols }, {}], 138: [function (e, t, r) { var n = e("./_has"), o = e("./_to-object"), i = e("./_shared-key")("IE_PROTO"), s = Object.prototype; t.exports = Object.getPrototypeOf || function (e) { return e = o(e), n(e, i) ? e[i] : "function" == typeof e.constructor && e instanceof e.constructor ? e.constructor.prototype : e instanceof Object ? s : null } }, { "./_has": 111, "./_shared-key": 151, "./_to-object": 160 }], 139: [function (e, t, r) { var n = e("./_has"), o = e("./_to-iobject"), i = e("./_array-includes")(!1), s = e("./_shared-key")("IE_PROTO"); t.exports = function (e, t) { var r, a = o(e), u = 0, c = []; for (r in a) r != s && n(a, r) && c.push(r); for (; t.length > u;)n(a, r = t[u++]) && (~i(c, r) || c.push(r)); return c } }, { "./_array-includes": 96, "./_has": 111, "./_shared-key": 151, "./_to-iobject": 158 }], 140: [function (e, t, r) { var n = e("./_object-keys-internal"), o = e("./_enum-bug-keys"); t.exports = Object.keys || function (e) { return n(e, o) } }, { "./_enum-bug-keys": 105, "./_object-keys-internal": 139 }], 141: [function (e, t, r) { r.f = {}.propertyIsEnumerable }, {}], 142: [function (e, t, r) { var n = e("./_export"), o = e("./_core"), i = e("./_fails"); t.exports = function (e, t) { var r = (o.Object || {})[e] || Object[e], s = {}; s[e] = t(r), n(n.S + n.F * i(function () { r(1) }), "Object", s) } }, { "./_core": 99, "./_export": 107, "./_fails": 108 }], 143: [function (e, t, r) { var n = e("./_descriptors"), o = e("./_object-keys"), i = e("./_to-iobject"), s = e("./_object-pie").f; t.exports = function (e) { return function (t) { for (var r, a = i(t), u = o(a), c = u.length, l = 0, f = []; c > l;)r = u[l++], n && !s.call(a, r) || f.push(e ? [r, a[r]] : a[r]); return f } } }, { "./_descriptors": 103, "./_object-keys": 140, "./_object-pie": 141, "./_to-iobject": 158 }], 144: [function (e, t, r) { t.exports = function (e) { try { return { e: !1, v: e() } } catch (e) { return { e: !0, v: e } } } }, {}], 145: [function (e, t, r) { var n = e("./_an-object"), o = e("./_is-object"), i = e("./_new-promise-capability"); t.exports = function (e, t) { if (n(e), o(t) && t.constructor === e) return t; var r = i.f(e); return (0, r.resolve)(t), r.promise } }, { "./_an-object": 95, "./_is-object": 119, "./_new-promise-capability": 129 }], 146: [function (e, t, r) { t.exports = function (e, t) { return { enumerable: !(1 & e), configurable: !(2 & e), writable: !(4 & e), value: t } } }, {}], 147: [function (e, t, r) { var n = e("./_hide"); t.exports = function (e, t, r) { for (var o in t) r && e[o] ? e[o] = t[o] : n(e, o, t[o]); return e } }, { "./_hide": 112 }], 148: [function (e, t, r) { t.exports = e("./_hide") }, { "./_hide": 112 }], 149: [function (e, t, r) { "use strict"; var n = e("./_global"), o = e("./_core"), i = e("./_object-dp"), s = e("./_descriptors"), a = e("./_wks")("species"); t.exports = function (e) { var t = "function" == typeof o[e] ? o[e] : n[e]; s && t && !t[a] && i.f(t, a, { configurable: !0, get: function () { return this } }) } }, { "./_core": 99, "./_descriptors": 103, "./_global": 110, "./_object-dp": 132, "./_wks": 166 }], 150: [function (e, t, r) { var n = e("./_object-dp").f, o = e("./_has"), i = e("./_wks")("toStringTag"); t.exports = function (e, t, r) { e && !o(e = r ? e : e.prototype, i) && n(e, i, { configurable: !0, value: t }) } }, { "./_has": 111, "./_object-dp": 132, "./_wks": 166 }], 151: [function (e, t, r) { var n = e("./_shared")("keys"), o = e("./_uid"); t.exports = function (e) { return n[e] || (n[e] = o(e)) } }, { "./_shared": 152, "./_uid": 162 }], 152: [function (e, t, r) {
      var n = e("./_core"), o = e("./_global"), i = o["__core-js_shared__"] || (o["__core-js_shared__"] = {}); (t.exports = function (e, t) { return i[e] || (i[e] = void 0 !== t ? t : {}) })("versions", []).push({ version: n.version, mode: e("./_library") ? "pure" : "global", copyright: "\xa9 2019 Denis Pushkarev (zloirock.ru)" })
    }, { "./_core": 99, "./_global": 110, "./_library": 126 }], 153: [function (e, t, r) { var n = e("./_an-object"), o = e("./_a-function"), i = e("./_wks")("species"); t.exports = function (e, t) { var r, s = n(e).constructor; return void 0 === s || void 0 == (r = n(s)[i]) ? t : o(r) } }, { "./_a-function": 92, "./_an-object": 95, "./_wks": 166 }], 154: [function (e, t, r) { var n = e("./_to-integer"), o = e("./_defined"); t.exports = function (e) { return function (t, r) { var i, s, a = String(o(t)), u = n(r), c = a.length; return u < 0 || u >= c ? e ? "" : void 0 : (i = a.charCodeAt(u), i < 55296 || i > 56319 || u + 1 === c || (s = a.charCodeAt(u + 1)) < 56320 || s > 57343 ? e ? a.charAt(u) : i : e ? a.slice(u, u + 2) : s - 56320 + (i - 55296 << 10) + 65536) } } }, { "./_defined": 102, "./_to-integer": 157 }], 155: [function (e, t, r) { var n, o, i, s = e("./_ctx"), a = e("./_invoke"), u = e("./_html"), c = e("./_dom-create"), l = e("./_global"), f = l.process, p = l.setImmediate, h = l.clearImmediate, d = l.MessageChannel, m = l.Dispatch, b = 0, y = {}, g = function () { var e = +this; if (y.hasOwnProperty(e)) { var t = y[e]; delete y[e], t() } }, v = function (e) { g.call(e.data) }; p && h || (p = function (e) { for (var t = [], r = 1; arguments.length > r;)t.push(arguments[r++]); return y[++b] = function () { a("function" == typeof e ? e : Function(e), t) }, n(b), b }, h = function (e) { delete y[e] }, "process" == e("./_cof")(f) ? n = function (e) { f.nextTick(s(g, e, 1)) } : m && m.now ? n = function (e) { m.now(s(g, e, 1)) } : d ? (o = new d, i = o.port2, o.port1.onmessage = v, n = s(i.postMessage, i, 1)) : l.addEventListener && "function" == typeof postMessage && !l.importScripts ? (n = function (e) { l.postMessage(e + "", "*") }, l.addEventListener("message", v, !1)) : n = "onreadystatechange" in c("script") ? function (e) { u.appendChild(c("script")).onreadystatechange = function () { u.removeChild(this), g.call(e) } } : function (e) { setTimeout(s(g, e, 1), 0) }), t.exports = { set: p, clear: h } }, { "./_cof": 98, "./_ctx": 101, "./_dom-create": 104, "./_global": 110, "./_html": 113, "./_invoke": 115 }], 156: [function (e, t, r) { var n = e("./_to-integer"), o = Math.max, i = Math.min; t.exports = function (e, t) { return e = n(e), e < 0 ? o(e + t, 0) : i(e, t) } }, { "./_to-integer": 157 }], 157: [function (e, t, r) { var n = Math.ceil, o = Math.floor; t.exports = function (e) { return isNaN(e = +e) ? 0 : (e > 0 ? o : n)(e) } }, {}], 158: [function (e, t, r) { var n = e("./_iobject"), o = e("./_defined"); t.exports = function (e) { return n(o(e)) } }, { "./_defined": 102, "./_iobject": 116 }], 159: [function (e, t, r) { var n = e("./_to-integer"), o = Math.min; t.exports = function (e) { return e > 0 ? o(n(e), 9007199254740991) : 0 } }, { "./_to-integer": 157 }], 160: [function (e, t, r) { var n = e("./_defined"); t.exports = function (e) { return Object(n(e)) } }, { "./_defined": 102 }], 161: [function (e, t, r) { var n = e("./_is-object"); t.exports = function (e, t) { if (!n(e)) return e; var r, o; if (t && "function" == typeof (r = e.toString) && !n(o = r.call(e))) return o; if ("function" == typeof (r = e.valueOf) && !n(o = r.call(e))) return o; if (!t && "function" == typeof (r = e.toString) && !n(o = r.call(e))) return o; throw TypeError("Can't convert object to primitive value") } }, { "./_is-object": 119 }], 162: [function (e, t, r) { var n = 0, o = Math.random(); t.exports = function (e) { return "Symbol(".concat(void 0 === e ? "" : e, ")_", (++n + o).toString(36)) } }, {}], 163: [function (e, t, r) { var n = e("./_global"), o = n.navigator; t.exports = o && o.userAgent || "" }, { "./_global": 110 }], 164: [function (e, t, r) { var n = e("./_global"), o = e("./_core"), i = e("./_library"), s = e("./_wks-ext"), a = e("./_object-dp").f; t.exports = function (e) { var t = o.Symbol || (o.Symbol = i ? {} : n.Symbol || {}); "_" == e.charAt(0) || e in t || a(t, e, { value: s.f(e) }) } }, { "./_core": 99, "./_global": 110, "./_library": 126, "./_object-dp": 132, "./_wks-ext": 165 }], 165: [function (e, t, r) { r.f = e("./_wks") }, { "./_wks": 166 }], 166: [function (e, t, r) { var n = e("./_shared")("wks"), o = e("./_uid"), i = e("./_global").Symbol, s = "function" == typeof i; (t.exports = function (e) { return n[e] || (n[e] = s && i[e] || (s ? i : o)("Symbol." + e)) }).store = n }, { "./_global": 110, "./_shared": 152, "./_uid": 162 }], 167: [function (e, t, r) { var n = e("./_classof"), o = e("./_wks")("iterator"), i = e("./_iterators"); t.exports = e("./_core").getIteratorMethod = function (e) { if (void 0 != e) return e[o] || e["@@iterator"] || i[n(e)] } }, { "./_classof": 97, "./_core": 99, "./_iterators": 125, "./_wks": 166 }], 168: [function (e, t, r) { "use strict"; var n = e("./_ctx"), o = e("./_export"), i = e("./_to-object"), s = e("./_iter-call"), a = e("./_is-array-iter"), u = e("./_to-length"), c = e("./_create-property"), l = e("./core.get-iterator-method"); o(o.S + o.F * !e("./_iter-detect")(function (e) { Array.from(e) }), "Array", { from: function (e) { var t, r, o, f, p = i(e), h = "function" == typeof this ? this : Array, d = arguments.length, m = d > 1 ? arguments[1] : void 0, b = void 0 !== m, y = 0, g = l(p); if (b && (m = n(m, d > 2 ? arguments[2] : void 0, 2)), void 0 == g || h == Array && a(g)) for (t = u(p.length), r = new h(t); t > y; y++)c(r, y, b ? m(p[y], y) : p[y]); else for (f = g.call(p), r = new h; !(o = f.next()).done; y++)c(r, y, b ? s(f, m, [o.value, y], !0) : o.value); return r.length = y, r } }) }, { "./_create-property": 100, "./_ctx": 101, "./_export": 107, "./_is-array-iter": 117, "./_iter-call": 120, "./_iter-detect": 123, "./_to-length": 159, "./_to-object": 160, "./core.get-iterator-method": 167 }], 169: [function (e, t, r) { "use strict"; var n = e("./_add-to-unscopables"), o = e("./_iter-step"), i = e("./_iterators"), s = e("./_to-iobject"); t.exports = e("./_iter-define")(Array, "Array", function (e, t) { this._t = s(e), this._i = 0, this._k = t }, function () { var e = this._t, t = this._k, r = this._i++; return !e || r >= e.length ? (this._t = void 0, o(1)) : "keys" == t ? o(0, r) : "values" == t ? o(0, e[r]) : o(0, [r, e[r]]) }, "values"), i.Arguments = i.Array, n("keys"), n("values"), n("entries") }, { "./_add-to-unscopables": 93, "./_iter-define": 122, "./_iter-step": 124, "./_iterators": 125, "./_to-iobject": 158 }], 170: [function (e, t, r) { "use strict"; var n = e("./_is-object"), o = e("./_object-gpo"), i = e("./_wks")("hasInstance"), s = Function.prototype; i in s || e("./_object-dp").f(s, i, { value: function (e) { if ("function" != typeof this || !n(e)) return !1; if (!n(this.prototype)) return e instanceof this; for (; e = o(e);)if (this.prototype === e) return !0; return !1 } }) }, { "./_is-object": 119, "./_object-dp": 132, "./_object-gpo": 138, "./_wks": 166 }], 171: [function (e, t, r) { var n = e("./_export"); n(n.S + n.F, "Object", { assign: e("./_object-assign") }) }, { "./_export": 107, "./_object-assign": 130 }], 172: [function (e, t, r) { var n = e("./_export"); n(n.S, "Object", { create: e("./_object-create") }) }, { "./_export": 107, "./_object-create": 131 }], 173: [function (e, t, r) { var n = e("./_export"); n(n.S + n.F * !e("./_descriptors"), "Object", { defineProperty: e("./_object-dp").f }) }, { "./_descriptors": 103, "./_export": 107, "./_object-dp": 132 }], 174: [function (e, t, r) { e("./_object-sap")("getOwnPropertyNames", function () { return e("./_object-gopn-ext").f }) }, { "./_object-gopn-ext": 135, "./_object-sap": 142 }], 175: [function (e, t, r) { var n = e("./_to-object"), o = e("./_object-gpo"); e("./_object-sap")("getPrototypeOf", function () { return function (e) { return o(n(e)) } }) }, { "./_object-gpo": 138, "./_object-sap": 142, "./_to-object": 160 }], 176: [function (e, t, r) { var n = e("./_to-object"), o = e("./_object-keys"); e("./_object-sap")("keys", function () { return function (e) { return o(n(e)) } }) }, { "./_object-keys": 140, "./_object-sap": 142, "./_to-object": 160 }], 177: [function (e, t, r) { arguments[4][71][0].apply(r, arguments) }, { dup: 71 }], 178: [function (e, t, r) { "use strict"; var n, o, i, s, a = e("./_library"), u = e("./_global"), c = e("./_ctx"), l = e("./_classof"), f = e("./_export"), p = e("./_is-object"), h = e("./_a-function"), d = e("./_an-instance"), m = e("./_for-of"), b = e("./_species-constructor"), y = e("./_task").set, g = e("./_microtask")(), v = e("./_new-promise-capability"), _ = e("./_perform"), w = e("./_user-agent"), x = e("./_promise-resolve"), E = u.TypeError, T = u.process, S = T && T.versions, j = S && S.v8 || "", O = u.Promise, N = "process" == l(T), k = function () { }, I = o = v.f, C = !!function () { try { var t = O.resolve(1), r = (t.constructor = {})[e("./_wks")("species")] = function (e) { e(k, k) }; return (N || "function" == typeof PromiseRejectionEvent) && t.then(k) instanceof r && 0 !== j.indexOf("6.6") && -1 === w.indexOf("Chrome/66") } catch (e) { } }(), A = function (e) { var t; return !(!p(e) || "function" != typeof (t = e.then)) && t }, D = function (e, t) { if (!e._n) { e._n = !0; var r = e._c; g(function () { for (var n = e._v, o = 1 == e._s, i = 0; r.length > i;)!function (t) { var r, i, s, a = o ? t.ok : t.fail, u = t.resolve, c = t.reject, l = t.domain; try { a ? (o || (2 == e._h && L(e), e._h = 1), !0 === a ? r = n : (l && l.enter(), r = a(n), l && (l.exit(), s = !0)), r === t.promise ? c(E("Promise-chain cycle")) : (i = A(r)) ? i.call(r, u, c) : u(r)) : c(n) } catch (e) { l && !s && l.exit(), c(e) } }(r[i++]); e._c = [], e._n = !1, t && !e._h && M(e) }) } }, M = function (e) { y.call(u, function () { var t, r, n, o = e._v, i = P(e); if (i && (t = _(function () { N ? T.emit("unhandledRejection", o, e) : (r = u.onunhandledrejection) ? r({ promise: e, reason: o }) : (n = u.console) && n.error && n.error("Unhandled promise rejection", o) }), e._h = N || P(e) ? 2 : 1), e._a = void 0, i && t.e) throw t.v }) }, P = function (e) { return 1 !== e._h && 0 === (e._a || e._c).length }, L = function (e) { y.call(u, function () { var t; N ? T.emit("rejectionHandled", e) : (t = u.onrejectionhandled) && t({ promise: e, reason: e._v }) }) }, R = function (e) { var t = this; t._d || (t._d = !0, t = t._w || t, t._v = e, t._s = 2, t._a || (t._a = t._c.slice()), D(t, !0)) }, B = function (e) { var t, r = this; if (!r._d) { r._d = !0, r = r._w || r; try { if (r === e) throw E("Promise can't be resolved itself"); (t = A(e)) ? g(function () { var n = { _w: r, _d: !1 }; try { t.call(e, c(B, n, 1), c(R, n, 1)) } catch (e) { R.call(n, e) } }) : (r._v = e, r._s = 1, D(r, !1)) } catch (e) { R.call({ _w: r, _d: !1 }, e) } } }; C || (O = function (e) { d(this, O, "Promise", "_h"), h(e), n.call(this); try { e(c(B, this, 1), c(R, this, 1)) } catch (e) { R.call(this, e) } }, n = function (e) { this._c = [], this._a = void 0, this._s = 0, this._d = !1, this._v = void 0, this._h = 0, this._n = !1 }, n.prototype = e("./_redefine-all")(O.prototype, { then: function (e, t) { var r = I(b(this, O)); return r.ok = "function" != typeof e || e, r.fail = "function" == typeof t && t, r.domain = N ? T.domain : void 0, this._c.push(r), this._a && this._a.push(r), this._s && D(this, !1), r.promise }, catch: function (e) { return this.then(void 0, e) } }), i = function () { var e = new n; this.promise = e, this.resolve = c(B, e, 1), this.reject = c(R, e, 1) }, v.f = I = function (e) { return e === O || e === s ? new i(e) : o(e) }), f(f.G + f.W + f.F * !C, { Promise: O }), e("./_set-to-string-tag")(O, "Promise"), e("./_set-species")("Promise"), s = e("./_core").Promise, f(f.S + f.F * !C, "Promise", { reject: function (e) { var t = I(this); return (0, t.reject)(e), t.promise } }), f(f.S + f.F * (a || !C), "Promise", { resolve: function (e) { return x(a && this === s ? O : this, e) } }), f(f.S + f.F * !(C && e("./_iter-detect")(function (e) { O.all(e).catch(k) })), "Promise", { all: function (e) { var t = this, r = I(t), n = r.resolve, o = r.reject, i = _(function () { var r = [], i = 0, s = 1; m(e, !1, function (e) { var a = i++, u = !1; r.push(void 0), s++, t.resolve(e).then(function (e) { u || (u = !0, r[a] = e, --s || n(r)) }, o) }), --s || n(r) }); return i.e && o(i.v), r.promise }, race: function (e) { var t = this, r = I(t), n = r.reject, o = _(function () { m(e, !1, function (e) { t.resolve(e).then(r.resolve, n) }) }); return o.e && n(o.v), r.promise } }) }, { "./_a-function": 92, "./_an-instance": 94, "./_classof": 97, "./_core": 99, "./_ctx": 101, "./_export": 107, "./_for-of": 109, "./_global": 110, "./_is-object": 119, "./_iter-detect": 123, "./_library": 126, "./_microtask": 128, "./_new-promise-capability": 129, "./_perform": 144, "./_promise-resolve": 145, "./_redefine-all": 147, "./_set-species": 149, "./_set-to-string-tag": 150, "./_species-constructor": 153, "./_task": 155, "./_user-agent": 163, "./_wks": 166 }], 179: [function (e, t, r) { var n = e("./_export"), o = e("./_to-absolute-index"), i = String.fromCharCode, s = String.fromCodePoint; n(n.S + n.F * (!!s && 1 != s.length), "String", { fromCodePoint: function (e) { for (var t, r = [], n = arguments.length, s = 0; n > s;) { if (t = +arguments[s++], o(t, 1114111) !== t) throw RangeError(t + " is not a valid code point"); r.push(t < 65536 ? i(t) : i(55296 + ((t -= 65536) >> 10), t % 1024 + 56320)) } return r.join("") } }) }, { "./_export": 107, "./_to-absolute-index": 156 }], 180: [function (e, t, r) { "use strict"; var n = e("./_string-at")(!0); e("./_iter-define")(String, "String", function (e) { this._t = String(e), this._i = 0 }, function () { var e, t = this._t, r = this._i; return r >= t.length ? { value: void 0, done: !0 } : (e = n(t, r), this._i += e.length, { value: e, done: !1 }) }) }, { "./_iter-define": 122, "./_string-at": 154 }], 181: [function (e, t, r) { "use strict"; var n = e("./_global"), o = e("./_has"), i = e("./_descriptors"), s = e("./_export"), a = e("./_redefine"), u = e("./_meta").KEY, c = e("./_fails"), l = e("./_shared"), f = e("./_set-to-string-tag"), p = e("./_uid"), h = e("./_wks"), d = e("./_wks-ext"), m = e("./_wks-define"), b = e("./_enum-keys"), y = e("./_is-array"), g = e("./_an-object"), v = e("./_is-object"), _ = e("./_to-object"), w = e("./_to-iobject"), x = e("./_to-primitive"), E = e("./_property-desc"), T = e("./_object-create"), S = e("./_object-gopn-ext"), j = e("./_object-gopd"), O = e("./_object-gops"), N = e("./_object-dp"), k = e("./_object-keys"), I = j.f, C = N.f, A = S.f, D = n.Symbol, M = n.JSON, P = M && M.stringify, L = h("_hidden"), R = h("toPrimitive"), B = {}.propertyIsEnumerable, F = l("symbol-registry"), U = l("symbols"), q = l("op-symbols"), X = Object.prototype, G = "function" == typeof D && !!O.f, z = n.QObject, V = !z || !z.prototype || !z.prototype.findChild, H = i && c(function () { return 7 != T(C({}, "a", { get: function () { return C(this, "a", { value: 7 }).a } })).a }) ? function (e, t, r) { var n = I(X, t); n && delete X[t], C(e, t, r), n && e !== X && C(X, t, n) } : C, W = function (e) { var t = U[e] = T(D.prototype); return t._k = e, t }, K = G && "symbol" == typeof D.iterator ? function (e) { return "symbol" == typeof e } : function (e) { return e instanceof D }, Y = function (e, t, r) { return e === X && Y(q, t, r), g(e), t = x(t, !0), g(r), o(U, t) ? (r.enumerable ? (o(e, L) && e[L][t] && (e[L][t] = !1), r = T(r, { enumerable: E(0, !1) })) : (o(e, L) || C(e, L, E(1, {})), e[L][t] = !0), H(e, t, r)) : C(e, t, r) }, $ = function (e, t) { g(e); for (var r, n = b(t = w(t)), o = 0, i = n.length; i > o;)Y(e, r = n[o++], t[r]); return e }, J = function (e, t) { return void 0 === t ? T(e) : $(T(e), t) }, Q = function (e) { var t = B.call(this, e = x(e, !0)); return !(this === X && o(U, e) && !o(q, e)) && (!(t || !o(this, e) || !o(U, e) || o(this, L) && this[L][e]) || t) }, Z = function (e, t) { if (e = w(e), t = x(t, !0), e !== X || !o(U, t) || o(q, t)) { var r = I(e, t); return !r || !o(U, t) || o(e, L) && e[L][t] || (r.enumerable = !0), r } }, ee = function (e) { for (var t, r = A(w(e)), n = [], i = 0; r.length > i;)o(U, t = r[i++]) || t == L || t == u || n.push(t); return n }, te = function (e) { for (var t, r = e === X, n = A(r ? q : w(e)), i = [], s = 0; n.length > s;)!o(U, t = n[s++]) || r && !o(X, t) || i.push(U[t]); return i }; G || (D = function () { if (this instanceof D) throw TypeError("Symbol is not a constructor!"); var e = p(arguments.length > 0 ? arguments[0] : void 0), t = function (r) { this === X && t.call(q, r), o(this, L) && o(this[L], e) && (this[L][e] = !1), H(this, e, E(1, r)) }; return i && V && H(X, e, { configurable: !0, set: t }), W(e) }, a(D.prototype, "toString", function () { return this._k }), j.f = Z, N.f = Y, e("./_object-gopn").f = S.f = ee, e("./_object-pie").f = Q, O.f = te, i && !e("./_library") && a(X, "propertyIsEnumerable", Q, !0), d.f = function (e) { return W(h(e)) }), s(s.G + s.W + s.F * !G, { Symbol: D }); for (var re = "hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","), ne = 0; re.length > ne;)h(re[ne++]); for (var oe = k(h.store), ie = 0; oe.length > ie;)m(oe[ie++]); s(s.S + s.F * !G, "Symbol", { for: function (e) { return o(F, e += "") ? F[e] : F[e] = D(e) }, keyFor: function (e) { if (!K(e)) throw TypeError(e + " is not a symbol!"); for (var t in F) if (F[t] === e) return t }, useSetter: function () { V = !0 }, useSimple: function () { V = !1 } }), s(s.S + s.F * !G, "Object", { create: J, defineProperty: Y, defineProperties: $, getOwnPropertyDescriptor: Z, getOwnPropertyNames: ee, getOwnPropertySymbols: te }); var se = c(function () { O.f(1) }); s(s.S + s.F * se, "Object", { getOwnPropertySymbols: function (e) { return O.f(_(e)) } }), M && s(s.S + s.F * (!G || c(function () { var e = D(); return "[null]" != P([e]) || "{}" != P({ a: e }) || "{}" != P(Object(e)) })), "JSON", { stringify: function (e) { for (var t, r, n = [e], o = 1; arguments.length > o;)n.push(arguments[o++]); if (r = t = n[1], (v(t) || void 0 !== e) && !K(e)) return y(t) || (t = function (e, t) { if ("function" == typeof r && (t = r.call(this, e, t)), !K(t)) return t }), n[1] = t, P.apply(M, n) } }), D.prototype[R] || e("./_hide")(D.prototype, R, D.prototype.valueOf), f(D, "Symbol"), f(Math, "Math", !0), f(n.JSON, "JSON", !0) }, { "./_an-object": 95, "./_descriptors": 103, "./_enum-keys": 106, "./_export": 107, "./_fails": 108, "./_global": 110, "./_has": 111, "./_hide": 112, "./_is-array": 118, "./_is-object": 119, "./_library": 126, "./_meta": 127, "./_object-create": 131, "./_object-dp": 132, "./_object-gopd": 134, "./_object-gopn": 136, "./_object-gopn-ext": 135, "./_object-gops": 137, "./_object-keys": 140, "./_object-pie": 141, "./_property-desc": 146, "./_redefine": 148, "./_set-to-string-tag": 150, "./_shared": 152, "./_to-iobject": 158, "./_to-object": 160, "./_to-primitive": 161, "./_uid": 162, "./_wks": 166, "./_wks-define": 164, "./_wks-ext": 165 }], 182: [function (e, t, r) { var n = e("./_export"), o = e("./_object-to-array")(!0); n(n.S, "Object", { entries: function (e) { return o(e) } }) }, { "./_export": 107, "./_object-to-array": 143 }], 183: [function (e, t, r) { "use strict"; var n = e("./_export"), o = e("./_core"), i = e("./_global"), s = e("./_species-constructor"), a = e("./_promise-resolve"); n(n.P + n.R, "Promise", { finally: function (e) { var t = s(this, o.Promise || i.Promise), r = "function" == typeof e; return this.then(r ? function (r) { return a(t, e()).then(function () { return r }) } : e, r ? function (r) { return a(t, e()).then(function () { throw r }) } : e) } }) }, { "./_core": 99, "./_export": 107, "./_global": 110, "./_promise-resolve": 145, "./_species-constructor": 153 }], 184: [function (e, t, r) { "use strict"; var n = e("./_export"), o = e("./_new-promise-capability"), i = e("./_perform"); n(n.S, "Promise", { try: function (e) { var t = o.f(this), r = i(e); return (r.e ? t.reject : t.resolve)(r.v), t.promise } }) }, { "./_export": 107, "./_new-promise-capability": 129, "./_perform": 144 }], 185: [function (e, t, r) { e("./_wks-define")("asyncIterator") }, { "./_wks-define": 164 }], 186: [function (e, t, r) { e("./_wks-define")("observable") }, { "./_wks-define": 164 }], 187: [function (e, t, r) { e("./es6.array.iterator"); for (var n = e("./_global"), o = e("./_hide"), i = e("./_iterators"), s = e("./_wks")("toStringTag"), a = "CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","), u = 0; u < a.length; u++) { var c = a[u], l = n[c], f = l && l.prototype; f && !f[s] && o(f, s, c), i[c] = i.Array } }, { "./_global": 110, "./_hide": 112, "./_iterators": 125, "./_wks": 166, "./es6.array.iterator": 169 }], 188: [function (e, t, r) { var n = e("./_export"), o = e("./_task"); n(n.G + n.B, { setImmediate: o.set, clearImmediate: o.clear }) }, { "./_export": 107, "./_task": 155 }], 189: [function (e, t, r) { (function (t) { "use strict"; function n(e) { return Array.isArray ? Array.isArray(e) : "[object Array]" === y(e) } function o(e) { return "boolean" == typeof e } function i(e) { return null === e } function s(e) { return null == e } function a(e) { return "number" == typeof e } function u(e) { return "string" == typeof e } function c(e) { return "symbol" === (void 0 === e ? "undefined" : (0, v.default)(e)) } function l(e) { return void 0 === e } function f(e) { return "[object RegExp]" === y(e) } function p(e) { return "object" === (void 0 === e ? "undefined" : (0, v.default)(e)) && null !== e } function h(e) { return "[object Date]" === y(e) } function d(e) { return "[object Error]" === y(e) || e instanceof Error } function m(e) { return "function" == typeof e } function b(e) { return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" === (void 0 === e ? "undefined" : (0, v.default)(e)) || void 0 === e } function y(e) { return Object.prototype.toString.call(e) } var g = e("babel-runtime/helpers/typeof"), v = function (e) { return e && e.__esModule ? e : { default: e } }(g); r.isArray = n, r.isBoolean = o, r.isNull = i, r.isNullOrUndefined = s, r.isNumber = a, r.isString = u, r.isSymbol = c, r.isUndefined = l, r.isRegExp = f, r.isObject = p, r.isDate = h, r.isError = d, r.isFunction = m, r.isPrimitive = b, r.isBuffer = t.isBuffer }).call(this, { isBuffer: e("../../is-buffer/index.js") }) }, { "../../is-buffer/index.js": 197, "babel-runtime/helpers/typeof": 67 }], 190: [function (e, t, r) { "use strict"; var n = e("babel-runtime/helpers/typeof"), o = function (e) { return e && e.__esModule ? e : { default: e } }(n); !function (e) { function n(e, t) { for (e = String(e), t = t || 2; e.length < t;)e = "0" + e; return e } function i(e) { var t = new Date(e.getFullYear(), e.getMonth(), e.getDate()); t.setDate(t.getDate() - (t.getDay() + 6) % 7 + 3); var r = new Date(t.getFullYear(), 0, 4); r.setDate(r.getDate() - (r.getDay() + 6) % 7 + 3); var n = t.getTimezoneOffset() - r.getTimezoneOffset(); t.setHours(t.getHours() - n); var o = (t - r) / 6048e5; return 1 + Math.floor(o) } function s(e) { var t = e.getDay(); return 0 === t && (t = 7), t } function a(e) { return null === e ? "null" : void 0 === e ? "undefined" : "object" !== (void 0 === e ? "undefined" : (0, o.default)(e)) ? void 0 === e ? "undefined" : (0, o.default)(e) : Array.isArray(e) ? "array" : {}.toString.call(e).slice(8, -1).toLowerCase() } var u = function () { var e = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZWN]|'[^']*'|'[^']*'/g, t = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g, r = /[^-+\dA-Z]/g; return function (o, c, l, f) { if (1 !== arguments.length || "string" !== a(o) || /\d/.test(o) || (c = o, o = void 0), o = o || new Date, o instanceof Date || (o = new Date(o)), isNaN(o)) throw TypeError("Invalid date"); c = String(u.masks[c] || c || u.masks.default); var p = c.slice(0, 4); "UTC:" !== p && "GMT:" !== p || (c = c.slice(4), l = !0, "GMT:" === p && (f = !0)); var h = l ? "getUTC" : "get", d = o[h + "Date"](), m = o[h + "Day"](), b = o[h + "Month"](), y = o[h + "FullYear"](), g = o[h + "Hours"](), v = o[h + "Minutes"](), _ = o[h + "Seconds"](), w = o[h + "Milliseconds"](), x = l ? 0 : o.getTimezoneOffset(), E = i(o), T = s(o), S = { d: d, dd: n(d), ddd: u.i18n.dayNames[m], dddd: u.i18n.dayNames[m + 7], m: b + 1, mm: n(b + 1), mmm: u.i18n.monthNames[b], mmmm: u.i18n.monthNames[b + 12], yy: String(y).slice(2), yyyy: y, h: g % 12 || 12, hh: n(g % 12 || 12), H: g, HH: n(g), M: v, MM: n(v), s: _, ss: n(_), l: n(w, 3), L: n(Math.round(w / 10)), t: g < 12 ? "a" : "p", tt: g < 12 ? "am" : "pm", T: g < 12 ? "A" : "P", TT: g < 12 ? "AM" : "PM", Z: f ? "GMT" : l ? "UTC" : (String(o).match(t) || [""]).pop().replace(r, ""), o: (x > 0 ? "-" : "+") + n(100 * Math.floor(Math.abs(x) / 60) + Math.abs(x) % 60, 4), S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10], W: E, N: T }; return c.replace(e, function (e) { return e in S ? S[e] : e.slice(1, e.length - 1) }) } }(); u.masks = { default: "ddd mmm dd yyyy HH:MM:ss", shortDate: "m/d/yy", mediumDate: "mmm d, yyyy", longDate: "mmmm d, yyyy", fullDate: "dddd, mmmm d, yyyy", shortTime: "h:MM TT", mediumTime: "h:MM:ss TT", longTime: "h:MM:ss TT Z", isoDate: "yyyy-mm-dd", isoTime: "HH:MM:ss", isoDateTime: "yyyy-mm-dd'T'HH:MM:sso", isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'", expiresHeaderFormat: "ddd, dd mmm yyyy HH:MM:ss Z" }, u.i18n = { dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] }, "function" == typeof define && define.amd ? define(function () { return u }) : "object" === (void 0 === r ? "undefined" : (0, o.default)(r)) ? t.exports = u : e.dateFormat = u }(void 0) }, { "babel-runtime/helpers/typeof": 67 }], 191: [function (e, t, r) { "use strict"; function n(e) { var t = "" + e, r = o.exec(t); if (!r) return t; var n, i = "", s = 0, a = 0; for (s = r.index; s < t.length; s++) { switch (t.charCodeAt(s)) { case 34: n = "&quot;"; break; case 38: n = "&amp;"; break; case 39: n = "&#39;"; break; case 60: n = "&lt;"; break; case 62: n = "&gt;"; break; default: continue }a !== s && (i += t.substring(a, s)), a = s + 1, i += n } return a !== s ? i + t.substring(a, s) : i } var o = /["'&<>]/; t.exports = n }, {}], 192: [function (e, t, r) { function n() { this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0 } function o(e) { return "function" == typeof e } function i(e) { return "number" == typeof e } function s(e) { return "object" == typeof e && null !== e } function a(e) { return void 0 === e } t.exports = n, n.EventEmitter = n, n.prototype._events = void 0, n.prototype._maxListeners = void 0, n.defaultMaxListeners = 10, n.prototype.setMaxListeners = function (e) { if (!i(e) || e < 0 || isNaN(e)) throw TypeError("n must be a positive number"); return this._maxListeners = e, this }, n.prototype.emit = function (e) { var t, r, n, i, u, c; if (this._events || (this._events = {}), "error" === e && (!this._events.error || s(this._events.error) && !this._events.error.length)) { if ((t = arguments[1]) instanceof Error) throw t; var l = new Error('Uncaught, unspecified "error" event. (' + t + ")"); throw l.context = t, l } if (r = this._events[e], a(r)) return !1; if (o(r)) switch (arguments.length) { case 1: r.call(this); break; case 2: r.call(this, arguments[1]); break; case 3: r.call(this, arguments[1], arguments[2]); break; default: i = Array.prototype.slice.call(arguments, 1), r.apply(this, i) } else if (s(r)) for (i = Array.prototype.slice.call(arguments, 1), c = r.slice(), n = c.length, u = 0; u < n; u++)c[u].apply(this, i); return !0 }, n.prototype.addListener = function (e, t) { var r; if (!o(t)) throw TypeError("listener must be a function"); return this._events || (this._events = {}), this._events.newListener && this.emit("newListener", e, o(t.listener) ? t.listener : t), this._events[e] ? s(this._events[e]) ? this._events[e].push(t) : this._events[e] = [this._events[e], t] : this._events[e] = t, s(this._events[e]) && !this._events[e].warned && (r = a(this._maxListeners) ? n.defaultMaxListeners : this._maxListeners) && r > 0 && this._events[e].length > r && (this._events[e].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[e].length), "function" == typeof console.trace && console.trace()), this }, n.prototype.on = n.prototype.addListener, n.prototype.once = function (e, t) { function r() { this.removeListener(e, r), n || (n = !0, t.apply(this, arguments)) } if (!o(t)) throw TypeError("listener must be a function"); var n = !1; return r.listener = t, this.on(e, r), this }, n.prototype.removeListener = function (e, t) { var r, n, i, a; if (!o(t)) throw TypeError("listener must be a function"); if (!this._events || !this._events[e]) return this; if (r = this._events[e], i = r.length, n = -1, r === t || o(r.listener) && r.listener === t) delete this._events[e], this._events.removeListener && this.emit("removeListener", e, t); else if (s(r)) { for (a = i; a-- > 0;)if (r[a] === t || r[a].listener && r[a].listener === t) { n = a; break } if (n < 0) return this; 1 === r.length ? (r.length = 0, delete this._events[e]) : r.splice(n, 1), this._events.removeListener && this.emit("removeListener", e, t) } return this }, n.prototype.removeAllListeners = function (e) { var t, r; if (!this._events) return this; if (!this._events.removeListener) return 0 === arguments.length ? this._events = {} : this._events[e] && delete this._events[e], this; if (0 === arguments.length) { for (t in this._events) "removeListener" !== t && this.removeAllListeners(t); return this.removeAllListeners("removeListener"), this._events = {}, this } if (r = this._events[e], o(r)) this.removeListener(e, r); else if (r) for (; r.length;)this.removeListener(e, r[r.length - 1]); return delete this._events[e], this }, n.prototype.listeners = function (e) { return this._events && this._events[e] ? o(this._events[e]) ? [this._events[e]] : this._events[e].slice() : [] }, n.prototype.listenerCount = function (e) { if (this._events) { var t = this._events[e]; if (o(t)) return 1; if (t) return t.length } return 0 }, n.listenerCount = function (e, t) { return e.listenerCount(t) } }, {}], 193: [function (e, t, r) { var n = e("http"), o = t.exports; for (var i in n) n.hasOwnProperty(i) && (o[i] = n[i]); o.request = function (e, t) { return e || (e = {}), e.scheme = "https", e.protocol = "https:", n.request.call(this, e, t) } }, { http: 231 }], 194: [function (e, t, r) { "use strict"; var n = e("util"), o = e("ms"); t.exports = function (e) { if ("number" == typeof e) return e; var t = o(e); if (void 0 === t) { var r = new Error(n.format("humanize-ms(%j) result undefined", e)); console.warn(r.stack) } return t } }, { ms: 204, util: 243 }], 195: [function (e, t, r) { r.read = function (e, t, r, n, o) { var i, s, a = 8 * o - n - 1, u = (1 << a) - 1, c = u >> 1, l = -7, f = r ? o - 1 : 0, p = r ? -1 : 1, h = e[t + f]; for (f += p, i = h & (1 << -l) - 1, h >>= -l, l += a; l > 0; i = 256 * i + e[t + f], f += p, l -= 8); for (s = i & (1 << -l) - 1, i >>= -l, l += n; l > 0; s = 256 * s + e[t + f], f += p, l -= 8); if (0 === i) i = 1 - c; else { if (i === u) return s ? NaN : 1 / 0 * (h ? -1 : 1); s += Math.pow(2, n), i -= c } return (h ? -1 : 1) * s * Math.pow(2, i - n) }, r.write = function (e, t, r, n, o, i) { var s, a, u, c = 8 * i - o - 1, l = (1 << c) - 1, f = l >> 1, p = 23 === o ? Math.pow(2, -24) - Math.pow(2, -77) : 0, h = n ? 0 : i - 1, d = n ? 1 : -1, m = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0; for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (a = isNaN(t) ? 1 : 0, s = l) : (s = Math.floor(Math.log(t) / Math.LN2), t * (u = Math.pow(2, -s)) < 1 && (s--, u *= 2), t += s + f >= 1 ? p / u : p * Math.pow(2, 1 - f), t * u >= 2 && (s++, u /= 2), s + f >= l ? (a = 0, s = l) : s + f >= 1 ? (a = (t * u - 1) * Math.pow(2, o), s += f) : (a = t * Math.pow(2, f - 1) * Math.pow(2, o), s = 0)); o >= 8; e[r + h] = 255 & a, h += d, a /= 256, o -= 8); for (s = s << o | a, c += o; c > 0; e[r + h] = 255 & s, h += d, s /= 256, c -= 8); e[r + h - d] |= 128 * m } }, {}], 196: [function (e, t, r) { "function" == typeof Object.create ? t.exports = function (e, t) { t && (e.super_ = t, e.prototype = Object.create(t.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } })) } : t.exports = function (e, t) { if (t) { e.super_ = t; var r = function () { }; r.prototype = t.prototype, e.prototype = new r, e.prototype.constructor = e } } }, {}], 197: [function (e, t, r) { function n(e) { return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e) } function o(e) { return "function" == typeof e.readFloatLE && "function" == typeof e.slice && n(e.slice(0, 0)) } t.exports = function (e) { return null != e && (n(e) || o(e) || !!e._isBuffer) } }, {}], 198: [function (e, t, r) { var n = {}.toString; t.exports = Array.isArray || function (e) { return "[object Array]" == n.call(e) } }, {}], 199: [function (require, module, exports) {
      (function (global) {
        !function (e, t) { "object" == typeof exports && void 0 !== module ? module.exports = t(e) : "function" == typeof define && define.amd ? define(t) : t(e) }("undefined" != typeof self ? self : "undefined" != typeof window ? window : void 0 !== global ? global : this, function (global) {
          "use strict"; global = global || {}; var _Base64 = global.Base64, version = "2.5.2", buffer; if (void 0 !== module && module.exports) try { buffer = eval("require('buffer').Buffer") } catch (e) { buffer = void 0 } var b64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", b64tab = function (e) { for (var t = {}, r = 0, n = e.length; r < n; r++)t[e.charAt(r)] = r; return t }(b64chars), fromCharCode = String.fromCharCode, cb_utob = function (e) { if (e.length < 2) { var t = e.charCodeAt(0); return t < 128 ? e : t < 2048 ? fromCharCode(192 | t >>> 6) + fromCharCode(128 | 63 & t) : fromCharCode(224 | t >>> 12 & 15) + fromCharCode(128 | t >>> 6 & 63) + fromCharCode(128 | 63 & t) } var t = 65536 + 1024 * (e.charCodeAt(0) - 55296) + (e.charCodeAt(1) - 56320); return fromCharCode(240 | t >>> 18 & 7) + fromCharCode(128 | t >>> 12 & 63) + fromCharCode(128 | t >>> 6 & 63) + fromCharCode(128 | 63 & t) }, re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g, utob = function (e) { return e.replace(re_utob, cb_utob) }, cb_encode = function (e) { var t = [0, 2, 1][e.length % 3], r = e.charCodeAt(0) << 16 | (e.length > 1 ? e.charCodeAt(1) : 0) << 8 | (e.length > 2 ? e.charCodeAt(2) : 0); return [b64chars.charAt(r >>> 18), b64chars.charAt(r >>> 12 & 63), t >= 2 ? "=" : b64chars.charAt(r >>> 6 & 63), t >= 1 ? "=" : b64chars.charAt(63 & r)].join("") }, btoa = global.btoa ? function (e) { return global.btoa(e) } : function (e) { return e.replace(/[\s\S]{1,3}/g, cb_encode) }, _encode = function (e) { return "[object Uint8Array]" === Object.prototype.toString.call(e) ? e.toString("base64") : btoa(utob(String(e))) }, encode = function (e, t) { return t ? _encode(String(e)).replace(/[+\/]/g, function (e) { return "+" == e ? "-" : "_" }).replace(/=/g, "") : _encode(e) }, encodeURI = function (e) { return encode(e, !0) }, re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g, cb_btou = function (e) { switch (e.length) { case 4: var t = (7 & e.charCodeAt(0)) << 18 | (63 & e.charCodeAt(1)) << 12 | (63 & e.charCodeAt(2)) << 6 | 63 & e.charCodeAt(3), r = t - 65536; return fromCharCode(55296 + (r >>> 10)) + fromCharCode(56320 + (1023 & r)); case 3: return fromCharCode((15 & e.charCodeAt(0)) << 12 | (63 & e.charCodeAt(1)) << 6 | 63 & e.charCodeAt(2)); default: return fromCharCode((31 & e.charCodeAt(0)) << 6 | 63 & e.charCodeAt(1)) } }, btou = function (e) { return e.replace(re_btou, cb_btou) }, cb_decode = function (e) { var t = e.length, r = t % 4, n = (t > 0 ? b64tab[e.charAt(0)] << 18 : 0) | (t > 1 ? b64tab[e.charAt(1)] << 12 : 0) | (t > 2 ? b64tab[e.charAt(2)] << 6 : 0) | (t > 3 ? b64tab[e.charAt(3)] : 0), o = [fromCharCode(n >>> 16), fromCharCode(n >>> 8 & 255), fromCharCode(255 & n)]; return o.length -= [0, 0, 2, 1][r], o.join("") }, _atob = global.atob ? function (e) { return global.atob(e) } : function (e) { return e.replace(/\S{1,4}/g, cb_decode) }, atob = function (e) { return _atob(String(e).replace(/[^A-Za-z0-9\+\/]/g, "")) }, _decode = buffer ? buffer.from && Uint8Array && buffer.from !== Uint8Array.from ? function (e) { return (e.constructor === buffer.constructor ? e : buffer.from(e, "base64")).toString() } : function (e) { return (e.constructor === buffer.constructor ? e : new buffer(e, "base64")).toString() } : function (e) { return btou(_atob(e)) }, decode = function (e) { return _decode(String(e).replace(/[-_]/g, function (e) { return "-" == e ? "+" : "/" }).replace(/[^A-Za-z0-9\+\/]/g, "")) }, noConflict = function () { var e = global.Base64; return global.Base64 = _Base64, e }; if (global.Base64 = { VERSION: version, atob: atob, btoa: btoa, fromBase64: decode, toBase64: encode, utob: utob, encode: encode, encodeURI: encodeURI, btou: btou, decode: decode, noConflict: noConflict, __buffer__: buffer }, "function" == typeof Object.defineProperty) {
            var noEnum = function (e) { return { value: e, enumerable: !1, writable: !0, configurable: !0 } }; global.Base64.extendString = function () {
              Object.defineProperty(String.prototype, "fromBase64", noEnum(function () { return decode(this) })),
                Object.defineProperty(String.prototype, "toBase64", noEnum(function (e) { return encode(this, e) })), Object.defineProperty(String.prototype, "toBase64URI", noEnum(function () { return encode(this, !0) }))
            }
          } return global.Meteor && (Base64 = global.Base64), void 0 !== module && module.exports ? module.exports.Base64 = global.Base64 : "function" == typeof define && define.amd && define([], function () { return global.Base64 }), { Base64: global.Base64 }
        })
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}], 200: [function (e, t, r) { "use strict"; function n(e, t, r) { if (!e) throw new TypeError("argument dest is required"); if (!t) throw new TypeError("argument src is required"); return void 0 === r && (r = !0), Object.getOwnPropertyNames(t).forEach(function (n) { if (r || !o.call(e, n)) { var i = Object.getOwnPropertyDescriptor(t, n); Object.defineProperty(e, n, i) } }), e } t.exports = n; var o = Object.prototype.hasOwnProperty }, {}], 201: [function (e, t, r) { "use strict"; function n() { this._types = Object.create(null), this._extensions = Object.create(null); for (var e = 0; e < arguments.length; e++)this.define(arguments[e]); this.define = this.define.bind(this), this.getType = this.getType.bind(this), this.getExtension = this.getExtension.bind(this) } n.prototype.define = function (e, t) { for (var r in e) { var n = e[r].map(function (e) { return e.toLowerCase() }); r = r.toLowerCase(); for (var o = 0; o < n.length; o++) { var i = n[o]; if ("*" != i[0]) { if (!t && i in this._types) throw new Error('Attempt to change mapping for "' + i + '" extension from "' + this._types[i] + '" to "' + r + '". Pass `force=true` to allow this, otherwise remove "' + i + '" from the list of extensions for "' + r + '".'); this._types[i] = r } } if (t || !this._extensions[r]) { var i = n[0]; this._extensions[r] = "*" != i[0] ? i : i.substr(1) } } }, n.prototype.getType = function (e) { e = String(e); var t = e.replace(/^.*[\/\\]/, "").toLowerCase(), r = t.replace(/^.*\./, "").toLowerCase(), n = t.length < e.length; return (r.length < t.length - 1 || !n) && this._types[r] || null }, n.prototype.getExtension = function (e) { return (e = /^\s*([^;\s]*)/.test(e) && RegExp.$1) && this._extensions[e.toLowerCase()] || null }, t.exports = n }, {}], 202: [function (e, t, r) { "use strict"; var n = e("./Mime"); t.exports = new n(e("./types/standard")) }, { "./Mime": 201, "./types/standard": 203 }], 203: [function (e, t, r) { t.exports = { "application/andrew-inset": ["ez"], "application/applixware": ["aw"], "application/atom+xml": ["atom"], "application/atomcat+xml": ["atomcat"], "application/atomdeleted+xml": ["atomdeleted"], "application/atomsvc+xml": ["atomsvc"], "application/atsc-dwd+xml": ["dwd"], "application/atsc-held+xml": ["held"], "application/atsc-rsat+xml": ["rsat"], "application/bdoc": ["bdoc"], "application/calendar+xml": ["xcs"], "application/ccxml+xml": ["ccxml"], "application/cdfx+xml": ["cdfx"], "application/cdmi-capability": ["cdmia"], "application/cdmi-container": ["cdmic"], "application/cdmi-domain": ["cdmid"], "application/cdmi-object": ["cdmio"], "application/cdmi-queue": ["cdmiq"], "application/cu-seeme": ["cu"], "application/dash+xml": ["mpd"], "application/davmount+xml": ["davmount"], "application/docbook+xml": ["dbk"], "application/dssc+der": ["dssc"], "application/dssc+xml": ["xdssc"], "application/ecmascript": ["ecma", "es"], "application/emma+xml": ["emma"], "application/emotionml+xml": ["emotionml"], "application/epub+zip": ["epub"], "application/exi": ["exi"], "application/fdt+xml": ["fdt"], "application/font-tdpfr": ["pfr"], "application/geo+json": ["geojson"], "application/gml+xml": ["gml"], "application/gpx+xml": ["gpx"], "application/gxf": ["gxf"], "application/gzip": ["gz"], "application/hjson": ["hjson"], "application/hyperstudio": ["stk"], "application/inkml+xml": ["ink", "inkml"], "application/ipfix": ["ipfix"], "application/its+xml": ["its"], "application/java-archive": ["jar", "war", "ear"], "application/java-serialized-object": ["ser"], "application/java-vm": ["class"], "application/javascript": ["js", "mjs"], "application/json": ["json", "map"], "application/json5": ["json5"], "application/jsonml+json": ["jsonml"], "application/ld+json": ["jsonld"], "application/lgr+xml": ["lgr"], "application/lost+xml": ["lostxml"], "application/mac-binhex40": ["hqx"], "application/mac-compactpro": ["cpt"], "application/mads+xml": ["mads"], "application/manifest+json": ["webmanifest"], "application/marc": ["mrc"], "application/marcxml+xml": ["mrcx"], "application/mathematica": ["ma", "nb", "mb"], "application/mathml+xml": ["mathml"], "application/mbox": ["mbox"], "application/mediaservercontrol+xml": ["mscml"], "application/metalink+xml": ["metalink"], "application/metalink4+xml": ["meta4"], "application/mets+xml": ["mets"], "application/mmt-aei+xml": ["maei"], "application/mmt-usd+xml": ["musd"], "application/mods+xml": ["mods"], "application/mp21": ["m21", "mp21"], "application/mp4": ["mp4s", "m4p"], "application/mrb-consumer+xml": ["*xdf"], "application/mrb-publish+xml": ["*xdf"], "application/msword": ["doc", "dot"], "application/mxf": ["mxf"], "application/n-quads": ["nq"], "application/n-triples": ["nt"], "application/node": ["cjs"], "application/octet-stream": ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "exe", "dll", "deb", "dmg", "iso", "img", "msi", "msp", "msm", "buffer"], "application/oda": ["oda"], "application/oebps-package+xml": ["opf"], "application/ogg": ["ogx"], "application/omdoc+xml": ["omdoc"], "application/onenote": ["onetoc", "onetoc2", "onetmp", "onepkg"], "application/oxps": ["oxps"], "application/p2p-overlay+xml": ["relo"], "application/patch-ops-error+xml": ["*xer"], "application/pdf": ["pdf"], "application/pgp-encrypted": ["pgp"], "application/pgp-signature": ["asc", "sig"], "application/pics-rules": ["prf"], "application/pkcs10": ["p10"], "application/pkcs7-mime": ["p7m", "p7c"], "application/pkcs7-signature": ["p7s"], "application/pkcs8": ["p8"], "application/pkix-attr-cert": ["ac"], "application/pkix-cert": ["cer"], "application/pkix-crl": ["crl"], "application/pkix-pkipath": ["pkipath"], "application/pkixcmp": ["pki"], "application/pls+xml": ["pls"], "application/postscript": ["ai", "eps", "ps"], "application/provenance+xml": ["provx"], "application/pskc+xml": ["pskcxml"], "application/raml+yaml": ["raml"], "application/rdf+xml": ["rdf", "owl"], "application/reginfo+xml": ["rif"], "application/relax-ng-compact-syntax": ["rnc"], "application/resource-lists+xml": ["rl"], "application/resource-lists-diff+xml": ["rld"], "application/rls-services+xml": ["rs"], "application/route-apd+xml": ["rapd"], "application/route-s-tsid+xml": ["sls"], "application/route-usd+xml": ["rusd"], "application/rpki-ghostbusters": ["gbr"], "application/rpki-manifest": ["mft"], "application/rpki-roa": ["roa"], "application/rsd+xml": ["rsd"], "application/rss+xml": ["rss"], "application/rtf": ["rtf"], "application/sbml+xml": ["sbml"], "application/scvp-cv-request": ["scq"], "application/scvp-cv-response": ["scs"], "application/scvp-vp-request": ["spq"], "application/scvp-vp-response": ["spp"], "application/sdp": ["sdp"], "application/senml+xml": ["senmlx"], "application/sensml+xml": ["sensmlx"], "application/set-payment-initiation": ["setpay"], "application/set-registration-initiation": ["setreg"], "application/shf+xml": ["shf"], "application/sieve": ["siv", "sieve"], "application/smil+xml": ["smi", "smil"], "application/sparql-query": ["rq"], "application/sparql-results+xml": ["srx"], "application/srgs": ["gram"], "application/srgs+xml": ["grxml"], "application/sru+xml": ["sru"], "application/ssdl+xml": ["ssdl"], "application/ssml+xml": ["ssml"], "application/swid+xml": ["swidtag"], "application/tei+xml": ["tei", "teicorpus"], "application/thraud+xml": ["tfi"], "application/timestamped-data": ["tsd"], "application/toml": ["toml"], "application/ttml+xml": ["ttml"], "application/urc-ressheet+xml": ["rsheet"], "application/voicexml+xml": ["vxml"], "application/wasm": ["wasm"], "application/widget": ["wgt"], "application/winhlp": ["hlp"], "application/wsdl+xml": ["wsdl"], "application/wspolicy+xml": ["wspolicy"], "application/xaml+xml": ["xaml"], "application/xcap-att+xml": ["xav"], "application/xcap-caps+xml": ["xca"], "application/xcap-diff+xml": ["xdf"], "application/xcap-el+xml": ["xel"], "application/xcap-error+xml": ["xer"], "application/xcap-ns+xml": ["xns"], "application/xenc+xml": ["xenc"], "application/xhtml+xml": ["xhtml", "xht"], "application/xliff+xml": ["xlf"], "application/xml": ["xml", "xsl", "xsd", "rng"], "application/xml-dtd": ["dtd"], "application/xop+xml": ["xop"], "application/xproc+xml": ["xpl"], "application/xslt+xml": ["xslt"], "application/xspf+xml": ["xspf"], "application/xv+xml": ["mxml", "xhvml", "xvml", "xvm"], "application/yang": ["yang"], "application/yin+xml": ["yin"], "application/zip": ["zip"], "audio/3gpp": ["*3gpp"], "audio/adpcm": ["adp"], "audio/basic": ["au", "snd"], "audio/midi": ["mid", "midi", "kar", "rmi"], "audio/mobile-xmf": ["mxmf"], "audio/mp3": ["*mp3"], "audio/mp4": ["m4a", "mp4a"], "audio/mpeg": ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"], "audio/ogg": ["oga", "ogg", "spx"], "audio/s3m": ["s3m"], "audio/silk": ["sil"], "audio/wav": ["wav"], "audio/wave": ["*wav"], "audio/webm": ["weba"], "audio/xm": ["xm"], "font/collection": ["ttc"], "font/otf": ["otf"], "font/ttf": ["ttf"], "font/woff": ["woff"], "font/woff2": ["woff2"], "image/aces": ["exr"], "image/apng": ["apng"], "image/bmp": ["bmp"], "image/cgm": ["cgm"], "image/dicom-rle": ["drle"], "image/emf": ["emf"], "image/fits": ["fits"], "image/g3fax": ["g3"], "image/gif": ["gif"], "image/heic": ["heic"], "image/heic-sequence": ["heics"], "image/heif": ["heif"], "image/heif-sequence": ["heifs"], "image/hej2k": ["hej2"], "image/hsj2": ["hsj2"], "image/ief": ["ief"], "image/jls": ["jls"], "image/jp2": ["jp2", "jpg2"], "image/jpeg": ["jpeg", "jpg", "jpe"], "image/jph": ["jph"], "image/jphc": ["jhc"], "image/jpm": ["jpm"], "image/jpx": ["jpx", "jpf"], "image/jxr": ["jxr"], "image/jxra": ["jxra"], "image/jxrs": ["jxrs"], "image/jxs": ["jxs"], "image/jxsc": ["jxsc"], "image/jxsi": ["jxsi"], "image/jxss": ["jxss"], "image/ktx": ["ktx"], "image/png": ["png"], "image/sgi": ["sgi"], "image/svg+xml": ["svg", "svgz"], "image/t38": ["t38"], "image/tiff": ["tif", "tiff"], "image/tiff-fx": ["tfx"], "image/webp": ["webp"], "image/wmf": ["wmf"], "message/disposition-notification": ["disposition-notification"], "message/global": ["u8msg"], "message/global-delivery-status": ["u8dsn"], "message/global-disposition-notification": ["u8mdn"], "message/global-headers": ["u8hdr"], "message/rfc822": ["eml", "mime"], "model/3mf": ["3mf"], "model/gltf+json": ["gltf"], "model/gltf-binary": ["glb"], "model/iges": ["igs", "iges"], "model/mesh": ["msh", "mesh", "silo"], "model/mtl": ["mtl"], "model/obj": ["obj"], "model/stl": ["stl"], "model/vrml": ["wrl", "vrml"], "model/x3d+binary": ["*x3db", "x3dbz"], "model/x3d+fastinfoset": ["x3db"], "model/x3d+vrml": ["*x3dv", "x3dvz"], "model/x3d+xml": ["x3d", "x3dz"], "model/x3d-vrml": ["x3dv"], "text/cache-manifest": ["appcache", "manifest"], "text/calendar": ["ics", "ifb"], "text/coffeescript": ["coffee", "litcoffee"], "text/css": ["css"], "text/csv": ["csv"], "text/html": ["html", "htm", "shtml"], "text/jade": ["jade"], "text/jsx": ["jsx"], "text/less": ["less"], "text/markdown": ["markdown", "md"], "text/mathml": ["mml"], "text/mdx": ["mdx"], "text/n3": ["n3"], "text/plain": ["txt", "text", "conf", "def", "list", "log", "in", "ini"], "text/richtext": ["rtx"], "text/rtf": ["*rtf"], "text/sgml": ["sgml", "sgm"], "text/shex": ["shex"], "text/slim": ["slim", "slm"], "text/stylus": ["stylus", "styl"], "text/tab-separated-values": ["tsv"], "text/troff": ["t", "tr", "roff", "man", "me", "ms"], "text/turtle": ["ttl"], "text/uri-list": ["uri", "uris", "urls"], "text/vcard": ["vcard"], "text/vtt": ["vtt"], "text/xml": ["*xml"], "text/yaml": ["yaml", "yml"], "video/3gpp": ["3gp", "3gpp"], "video/3gpp2": ["3g2"], "video/h261": ["h261"], "video/h263": ["h263"], "video/h264": ["h264"], "video/jpeg": ["jpgv"], "video/jpm": ["*jpm", "jpgm"], "video/mj2": ["mj2", "mjp2"], "video/mp2t": ["ts"], "video/mp4": ["mp4", "mp4v", "mpg4"], "video/mpeg": ["mpeg", "mpg", "mpe", "m1v", "m2v"], "video/ogg": ["ogv"], "video/quicktime": ["qt", "mov"], "video/webm": ["webm"] } }, {}], 204: [function (e, t, r) { function n(e) { if (e = String(e), !(e.length > 100)) { var t = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e); if (t) { var r = parseFloat(t[1]); switch ((t[2] || "ms").toLowerCase()) { case "years": case "year": case "yrs": case "yr": case "y": return r * p; case "weeks": case "week": case "w": return r * f; case "days": case "day": case "d": return r * l; case "hours": case "hour": case "hrs": case "hr": case "h": return r * c; case "minutes": case "minute": case "mins": case "min": case "m": return r * u; case "seconds": case "second": case "secs": case "sec": case "s": return r * a; case "milliseconds": case "millisecond": case "msecs": case "msec": case "ms": return r; default: return } } } } function o(e) { var t = Math.abs(e); return t >= l ? Math.round(e / l) + "d" : t >= c ? Math.round(e / c) + "h" : t >= u ? Math.round(e / u) + "m" : t >= a ? Math.round(e / a) + "s" : e + "ms" } function i(e) { var t = Math.abs(e); return t >= l ? s(e, t, l, "day") : t >= c ? s(e, t, c, "hour") : t >= u ? s(e, t, u, "minute") : t >= a ? s(e, t, a, "second") : e + " ms" } function s(e, t, r, n) { var o = t >= 1.5 * r; return Math.round(e / r) + " " + n + (o ? "s" : "") } var a = 1e3, u = 60 * a, c = 60 * u, l = 24 * c, f = 7 * l, p = 365.25 * l; t.exports = function (e, t) { t = t || {}; var r = typeof e; if ("string" === r && e.length > 0) return n(e); if ("number" === r && isFinite(e)) return t.long ? i(e) : o(e); throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(e)) } }, {}], 205: [function (e, t, r) { (function (e) { function t(e, t) { for (var r = 0, n = e.length - 1; n >= 0; n--) { var o = e[n]; "." === o ? e.splice(n, 1) : ".." === o ? (e.splice(n, 1), r++) : r && (e.splice(n, 1), r--) } if (t) for (; r--; r)e.unshift(".."); return e } function n(e) { "string" != typeof e && (e += ""); var t, r = 0, n = -1, o = !0; for (t = e.length - 1; t >= 0; --t)if (47 === e.charCodeAt(t)) { if (!o) { r = t + 1; break } } else -1 === n && (o = !1, n = t + 1); return -1 === n ? "" : e.slice(r, n) } function o(e, t) { if (e.filter) return e.filter(t); for (var r = [], n = 0; n < e.length; n++)t(e[n], n, e) && r.push(e[n]); return r } r.resolve = function () { for (var r = "", n = !1, i = arguments.length - 1; i >= -1 && !n; i--) { var s = i >= 0 ? arguments[i] : e.cwd(); if ("string" != typeof s) throw new TypeError("Arguments to path.resolve must be strings"); s && (r = s + "/" + r, n = "/" === s.charAt(0)) } return r = t(o(r.split("/"), function (e) { return !!e }), !n).join("/"), (n ? "/" : "") + r || "." }, r.normalize = function (e) { var n = r.isAbsolute(e), s = "/" === i(e, -1); return e = t(o(e.split("/"), function (e) { return !!e }), !n).join("/"), e || n || (e = "."), e && s && (e += "/"), (n ? "/" : "") + e }, r.isAbsolute = function (e) { return "/" === e.charAt(0) }, r.join = function () { var e = Array.prototype.slice.call(arguments, 0); return r.normalize(o(e, function (e, t) { if ("string" != typeof e) throw new TypeError("Arguments to path.join must be strings"); return e }).join("/")) }, r.relative = function (e, t) { function n(e) { for (var t = 0; t < e.length && "" === e[t]; t++); for (var r = e.length - 1; r >= 0 && "" === e[r]; r--); return t > r ? [] : e.slice(t, r - t + 1) } e = r.resolve(e).substr(1), t = r.resolve(t).substr(1); for (var o = n(e.split("/")), i = n(t.split("/")), s = Math.min(o.length, i.length), a = s, u = 0; u < s; u++)if (o[u] !== i[u]) { a = u; break } for (var c = [], u = a; u < o.length; u++)c.push(".."); return c = c.concat(i.slice(a)), c.join("/") }, r.sep = "/", r.delimiter = ":", r.dirname = function (e) { if ("string" != typeof e && (e += ""), 0 === e.length) return "."; for (var t = e.charCodeAt(0), r = 47 === t, n = -1, o = !0, i = e.length - 1; i >= 1; --i)if (47 === (t = e.charCodeAt(i))) { if (!o) { n = i; break } } else o = !1; return -1 === n ? r ? "/" : "." : r && 1 === n ? "/" : e.slice(0, n) }, r.basename = function (e, t) { var r = n(e); return t && r.substr(-1 * t.length) === t && (r = r.substr(0, r.length - t.length)), r }, r.extname = function (e) { "string" != typeof e && (e += ""); for (var t = -1, r = 0, n = -1, o = !0, i = 0, s = e.length - 1; s >= 0; --s) { var a = e.charCodeAt(s); if (47 !== a) -1 === n && (o = !1, n = s + 1), 46 === a ? -1 === t ? t = s : 1 !== i && (i = 1) : -1 !== t && (i = -1); else if (!o) { r = s + 1; break } } return -1 === t || -1 === n || 0 === i || 1 === i && t === n - 1 && t === r + 1 ? "" : e.slice(t, n) }; var i = "b" === "ab".substr(-1) ? function (e, t, r) { return e.substr(t, r) } : function (e, t, r) { return t < 0 && (t = e.length + t), e.substr(t, r) } }).call(this, e("_process")) }, { _process: 208 }], 206: [function (e, t, r) { (function (e) { (function () { "use strict"; function n(e) { return e = String(e), e.charAt(0).toUpperCase() + e.slice(1) } function o(e, t, r) { var n = { "10.0": "10", 6.4: "10 Technical Preview", 6.3: "8.1", 6.2: "8", 6.1: "Server 2008 R2 / 7", "6.0": "Server 2008 / Vista", 5.2: "Server 2003 / XP 64-bit", 5.1: "XP", 5.01: "2000 SP1", "5.0": "2000", "4.0": "NT", "4.90": "ME" }; return t && r && /^Win/i.test(e) && !/^Windows Phone /i.test(e) && (n = n[/[\d.]+$/.exec(e)]) && (e = "Windows " + n), e = String(e), t && r && (e = e.replace(RegExp(t, "i"), r)), e = s(e.replace(/ ce$/i, " CE").replace(/\bhpw/i, "web").replace(/\bMacintosh\b/, "Mac OS").replace(/_PowerPC\b/i, " OS").replace(/\b(OS X) [^ \d]+/i, "$1").replace(/\bMac (OS X)\b/, "$1").replace(/\/(\d)/, " $1").replace(/_/g, ".").replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, "").replace(/\bx86\.64\b/gi, "x86_64").replace(/\b(Windows Phone) OS\b/, "$1").replace(/\b(Chrome OS \w+) [\d.]+\b/, "$1").split(" on ")[0]) } function i(e, t) { var r = -1, n = e ? e.length : 0; if ("number" == typeof n && n > -1 && n <= v) for (; ++r < n;)t(e[r], r, e); else a(e, t) } function s(e) { return e = p(e), /^(?:webOS|i(?:OS|P))/.test(e) ? e : n(e) } function a(e, t) { for (var r in e) x.call(e, r) && t(e[r], r, e) } function u(e) { return null == e ? n(e) : E.call(e).slice(8, -1) } function c(e, t) { var r = null != e ? typeof e[t] : "number"; return !(/^(?:boolean|number|string|undefined)$/.test(r) || "object" == r && !e[t]) } function l(e) { return String(e).replace(/([ -])(?!$)/g, "$1?") } function f(e, t) { var r = null; return i(e, function (n, o) { r = t(r, n, o, e) }), r } function p(e) { return String(e).replace(/^ +| +$/g, "") } function h(e) { function t(t) { return f(t, function (t, r) { var n = r.pattern || l(r); return !t && (t = RegExp("\\b" + n + " *\\d+[.\\w_]*", "i").exec(e) || RegExp("\\b" + n + " *\\w+-[\\w]*", "i").exec(e) || RegExp("\\b" + n + "(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)", "i").exec(e)) && ((t = String(r.label && !RegExp(n, "i").test(r.label) ? r.label : t).split("/"))[1] && !/[\d.]+/.test(t[0]) && (t[0] += " " + t[1]), r = r.label || r, t = s(t[0].replace(RegExp(n, "i"), r).replace(RegExp("; *(?:" + r + "[_-])?", "i"), " ").replace(RegExp("(" + r + ")[-_.]?(\\w)", "i"), "$1 $2"))), t }) } function r() { return this.description || "" } var n = m, i = e && "object" == typeof e && "String" != u(e); i && (n = e, e = null); var d = n.navigator || {}, b = d.userAgent || ""; e || (e = b); var y, g, v = i ? !!d.likeChrome : /\bChrome\b/.test(e) && !/internal|\n/i.test(E.toString()), w = i ? "Object" : "ScriptBridgingProxyObject", x = i ? "Object" : "Environment", T = i && n.java ? "JavaPackage" : u(n.java), S = i ? "Object" : "RuntimeObject", j = /\bJava/.test(T) && n.java, O = j && u(n.environment) == x, N = j ? "a" : "\u03b1", k = j ? "b" : "\u03b2", I = n.document || {}, C = n.operamini || n.opera, A = _.test(A = i && C ? C["[[Class]]"] : u(C)) ? A : C = null, D = e, M = [], P = null, L = e == b, R = L && C && "function" == typeof C.version && C.version(), B = function (t) { return f(t, function (t, r) { return t || RegExp("\\b" + (r.pattern || l(r)) + "\\b", "i").exec(e) && (r.label || r) }) }([{ label: "EdgeHTML", pattern: "Edge" }, "Trident", { label: "WebKit", pattern: "AppleWebKit" }, "iCab", "Presto", "NetFront", "Tasman", "KHTML", "Gecko"]), F = function (t) { return f(t, function (t, r) { return t || RegExp("\\b" + (r.pattern || l(r)) + "\\b", "i").exec(e) && (r.label || r) }) }(["Adobe AIR", "Arora", "Avant Browser", "Breach", "Camino", "Electron", "Epiphany", "Fennec", "Flock", "Galeon", "GreenBrowser", "iCab", "Iceweasel", "K-Meleon", "Konqueror", "Lunascape", "Maxthon", { label: "Microsoft Edge", pattern: "Edge" }, "Midori", "Nook Browser", "PaleMoon", "PhantomJS", "Raven", "Rekonq", "RockMelt", { label: "Samsung Internet", pattern: "SamsungBrowser" }, "SeaMonkey", { label: "Silk", pattern: "(?:Cloud9|Silk-Accelerated)" }, "Sleipnir", "SlimBrowser", { label: "SRWare Iron", pattern: "Iron" }, "Sunrise", "Swiftfox", "Waterfox", "WebPositive", "Opera Mini", { label: "Opera Mini", pattern: "OPiOS" }, "Opera", { label: "Opera", pattern: "OPR" }, "Chrome", { label: "Chrome Mobile", pattern: "(?:CriOS|CrMo)" }, { label: "Firefox", pattern: "(?:Firefox|Minefield)" }, { label: "Firefox for iOS", pattern: "FxiOS" }, { label: "IE", pattern: "IEMobile" }, { label: "IE", pattern: "MSIE" }, "Safari"]), U = t([{ label: "BlackBerry", pattern: "BB10" }, "BlackBerry", { label: "Galaxy S", pattern: "GT-I9000" }, { label: "Galaxy S2", pattern: "GT-I9100" }, { label: "Galaxy S3", pattern: "GT-I9300" }, { label: "Galaxy S4", pattern: "GT-I9500" }, { label: "Galaxy S5", pattern: "SM-G900" }, { label: "Galaxy S6", pattern: "SM-G920" }, { label: "Galaxy S6 Edge", pattern: "SM-G925" }, { label: "Galaxy S7", pattern: "SM-G930" }, { label: "Galaxy S7 Edge", pattern: "SM-G935" }, "Google TV", "Lumia", "iPad", "iPod", "iPhone", "Kindle", { label: "Kindle Fire", pattern: "(?:Cloud9|Silk-Accelerated)" }, "Nexus", "Nook", "PlayBook", "PlayStation Vita", "PlayStation", "TouchPad", "Transformer", { label: "Wii U", pattern: "WiiU" }, "Wii", "Xbox One", { label: "Xbox 360", pattern: "Xbox" }, "Xoom"]), q = function (t) { return f(t, function (t, r, n) { return t || (r[U] || r[/^[a-z]+(?: +[a-z]+\b)*/i.exec(U)] || RegExp("\\b" + l(n) + "(?:\\b|\\w*\\d)", "i").exec(e)) && n }) }({ Apple: { iPad: 1, iPhone: 1, iPod: 1 }, Archos: {}, Amazon: { Kindle: 1, "Kindle Fire": 1 }, Asus: { Transformer: 1 }, "Barnes & Noble": { Nook: 1 }, BlackBerry: { PlayBook: 1 }, Google: { "Google TV": 1, Nexus: 1 }, HP: { TouchPad: 1 }, HTC: {}, LG: {}, Microsoft: { Xbox: 1, "Xbox One": 1 }, Motorola: { Xoom: 1 }, Nintendo: { "Wii U": 1, Wii: 1 }, Nokia: { Lumia: 1 }, Samsung: { "Galaxy S": 1, "Galaxy S2": 1, "Galaxy S3": 1, "Galaxy S4": 1 }, Sony: { PlayStation: 1, "PlayStation Vita": 1 } }), X = function (t) { return f(t, function (t, r) { var n = r.pattern || l(r); return !t && (t = RegExp("\\b" + n + "(?:/[\\d.]+|[ \\w.]*)", "i").exec(e)) && (t = o(t, n, r.label || r)), t }) }(["Windows Phone", "Android", "CentOS", { label: "Chrome OS", pattern: "CrOS" }, "Debian", "Fedora", "FreeBSD", "Gentoo", "Haiku", "Kubuntu", "Linux Mint", "OpenBSD", "Red Hat", "SuSE", "Ubuntu", "Xubuntu", "Cygwin", "Symbian OS", "hpwOS", "webOS ", "webOS", "Tablet OS", "Tizen", "Linux", "Mac OS X", "Macintosh", "Mac", "Windows 98;", "Windows "]); if (B && (B = [B]), q && !U && (U = t([q])), (y = /\bGoogle TV\b/.exec(U)) && (U = y[0]), /\bSimulator\b/i.test(e) && (U = (U ? U + " " : "") + "Simulator"), "Opera Mini" == F && /\bOPiOS\b/.test(e) && M.push("running in Turbo/Uncompressed mode"), "IE" == F && /\blike iPhone OS\b/.test(e) ? (y = h(e.replace(/like iPhone OS/, "")), q = y.manufacturer, U = y.product) : /^iP/.test(U) ? (F || (F = "Safari"), X = "iOS" + ((y = / OS ([\d_]+)/i.exec(e)) ? " " + y[1].replace(/_/g, ".") : "")) : "Konqueror" != F || /buntu/i.test(X) ? q && "Google" != q && (/Chrome/.test(F) && !/\bMobile Safari\b/i.test(e) || /\bVita\b/.test(U)) || /\bAndroid\b/.test(X) && /^Chrome/.test(F) && /\bVersion\//i.test(e) ? (F = "Android Browser", X = /\bAndroid\b/.test(X) ? X : "Android") : "Silk" == F ? (/\bMobi/i.test(e) || (X = "Android", M.unshift("desktop mode")), /Accelerated *= *true/i.test(e) && M.unshift("accelerated")) : "PaleMoon" == F && (y = /\bFirefox\/([\d.]+)\b/.exec(e)) ? M.push("identifying as Firefox " + y[1]) : "Firefox" == F && (y = /\b(Mobile|Tablet|TV)\b/i.exec(e)) ? (X || (X = "Firefox OS"), U || (U = y[1])) : !F || (y = !/\bMinefield\b/i.test(e) && /\b(?:Firefox|Safari)\b/.exec(F)) ? (F && !U && /[\/,]|^[^(]+?\)/.test(e.slice(e.indexOf(y + "/") + 8)) && (F = null), (y = U || q || X) && (U || q || /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(X)) && (F = /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(X) ? X : y) + " Browser")) : "Electron" == F && (y = (/\bChrome\/([\d.]+)\b/.exec(e) || 0)[1]) && M.push("Chromium " + y) : X = "Kubuntu", R || (R = function (t) { return f(t, function (t, r) { return t || (RegExp(r + "(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)", "i").exec(e) || 0)[1] || null }) }(["(?:Cloud9|CriOS|CrMo|Edge|FxiOS|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|SamsungBrowser|Silk(?!/[\\d.]+$))", "Version", l(F), "(?:Firefox|Minefield|NetFront)"])), (y = "iCab" == B && parseFloat(R) > 3 && "WebKit" || /\bOpera\b/.test(F) && (/\bOPR\b/.test(e) ? "Blink" : "Presto") || /\b(?:Midori|Nook|Safari)\b/i.test(e) && !/^(?:Trident|EdgeHTML)$/.test(B) && "WebKit" || !B && /\bMSIE\b/i.test(e) && ("Mac OS" == X ? "Tasman" : "Trident") || "WebKit" == B && /\bPlayStation\b(?! Vita\b)/i.test(F) && "NetFront") && (B = [y]), "IE" == F && (y = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(e) || 0)[1]) ? (F += " Mobile", X = "Windows Phone " + (/\+$/.test(y) ? y : y + ".x"), M.unshift("desktop mode")) : /\bWPDesktop\b/i.test(e) ? (F = "IE Mobile", X = "Windows Phone 8.x", M.unshift("desktop mode"), R || (R = (/\brv:([\d.]+)/.exec(e) || 0)[1])) : "IE" != F && "Trident" == B && (y = /\brv:([\d.]+)/.exec(e)) && (F && M.push("identifying as " + F + (R ? " " + R : "")), F = "IE", R = y[1]), L) { if (c(n, "global")) if (j && (y = j.lang.System, D = y.getProperty("os.arch"), X = X || y.getProperty("os.name") + " " + y.getProperty("os.version")), O) { try { R = n.require("ringo/engine").version.join("."), F = "RingoJS" } catch (e) { (y = n.system) && y.global.system == n.system && (F = "Narwhal", X || (X = y[0].os || null)) } F || (F = "Rhino") } else "object" == typeof n.process && !n.process.browser && (y = n.process) && ("object" == typeof y.versions && ("string" == typeof y.versions.electron ? (M.push("Node " + y.versions.node), F = "Electron", R = y.versions.electron) : "string" == typeof y.versions.nw && (M.push("Chromium " + R, "Node " + y.versions.node), F = "NW.js", R = y.versions.nw)), F || (F = "Node.js", D = y.arch, X = y.platform, R = /[\d.]+/.exec(y.version), R = R ? R[0] : null)); else u(y = n.runtime) == w ? (F = "Adobe AIR", X = y.flash.system.Capabilities.os) : u(y = n.phantom) == S ? (F = "PhantomJS", R = (y = y.version || null) && y.major + "." + y.minor + "." + y.patch) : "number" == typeof I.documentMode && (y = /\bTrident\/(\d+)/i.exec(e)) ? (R = [R, I.documentMode], (y = +y[1] + 4) != R[1] && (M.push("IE " + R[1] + " mode"), B && (B[1] = ""), R[1] = y), R = "IE" == F ? String(R[1].toFixed(1)) : R[0]) : "number" == typeof I.documentMode && /^(?:Chrome|Firefox)\b/.test(F) && (M.push("masking as " + F + " " + R), F = "IE", R = "11.0", B = ["Trident"], X = "Windows"); X = X && s(X) } if (R && (y = /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(R) || /(?:alpha|beta)(?: ?\d)?/i.exec(e + ";" + (L && d.appMinorVersion)) || /\bMinefield\b/i.test(e) && "a") && (P = /b/i.test(y) ? "beta" : "alpha", R = R.replace(RegExp(y + "\\+?$"), "") + ("beta" == P ? k : N) + (/\d+\+?/.exec(y) || "")), "Fennec" == F || "Firefox" == F && /\b(?:Android|Firefox OS)\b/.test(X)) F = "Firefox Mobile"; else if ("Maxthon" == F && R) R = R.replace(/\.[\d.]+/, ".x"); else if (/\bXbox\b/i.test(U)) "Xbox 360" == U && (X = null), "Xbox 360" == U && /\bIEMobile\b/.test(e) && M.unshift("mobile mode"); else if (!/^(?:Chrome|IE|Opera)$/.test(F) && (!F || U || /Browser|Mobi/.test(F)) || "Windows CE" != X && !/Mobi/i.test(e)) if ("IE" == F && L) try { null === n.external && M.unshift("platform preview") } catch (e) { M.unshift("embedded") } else (/\bBlackBerry\b/.test(U) || /\bBB10\b/.test(e)) && (y = (RegExp(U.replace(/ +/g, " *") + "/([.\\d]+)", "i").exec(e) || 0)[1] || R) ? (y = [y, /BB10/.test(e)], X = (y[1] ? (U = null, q = "BlackBerry") : "Device Software") + " " + y[0], R = null) : this != a && "Wii" != U && (L && C || /Opera/.test(F) && /\b(?:MSIE|Firefox)\b/i.test(e) || "Firefox" == F && /\bOS X (?:\d+\.){2,}/.test(X) || "IE" == F && (X && !/^Win/.test(X) && R > 5.5 || /\bWindows XP\b/.test(X) && R > 8 || 8 == R && !/\bTrident\b/.test(e))) && !_.test(y = h.call(a, e.replace(_, "") + ";")) && y.name && (y = "ing as " + y.name + ((y = y.version) ? " " + y : ""), _.test(F) ? (/\bIE\b/.test(y) && "Mac OS" == X && (X = null), y = "identify" + y) : (y = "mask" + y, F = A ? s(A.replace(/([a-z])([A-Z])/g, "$1 $2")) : "Opera", /\bIE\b/.test(y) && (X = null), L || (R = null)), B = ["Presto"], M.push(y)); else F += " Mobile"; (y = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(e) || 0)[1]) && (y = [parseFloat(y.replace(/\.(\d)$/, ".0$1")), y], "Safari" == F && "+" == y[1].slice(-1) ? (F = "WebKit Nightly", P = "alpha", R = y[1].slice(0, -1)) : R != y[1] && R != (y[2] = (/\bSafari\/([\d.]+\+?)/i.exec(e) || 0)[1]) || (R = null), y[1] = (/\bChrome\/([\d.]+)/i.exec(e) || 0)[1], 537.36 == y[0] && 537.36 == y[2] && parseFloat(y[1]) >= 28 && "WebKit" == B && (B = ["Blink"]), L && (v || y[1]) ? (B && (B[1] = "like Chrome"), y = y[1] || (y = y[0], y < 530 ? 1 : y < 532 ? 2 : y < 532.05 ? 3 : y < 533 ? 4 : y < 534.03 ? 5 : y < 534.07 ? 6 : y < 534.1 ? 7 : y < 534.13 ? 8 : y < 534.16 ? 9 : y < 534.24 ? 10 : y < 534.3 ? 11 : y < 535.01 ? 12 : y < 535.02 ? "13+" : y < 535.07 ? 15 : y < 535.11 ? 16 : y < 535.19 ? 17 : y < 536.05 ? 18 : y < 536.1 ? 19 : y < 537.01 ? 20 : y < 537.11 ? "21+" : y < 537.13 ? 23 : y < 537.18 ? 24 : y < 537.24 ? 25 : y < 537.36 ? 26 : "Blink" != B ? "27" : "28")) : (B && (B[1] = "like Safari"), y = y[0], y = y < 400 ? 1 : y < 500 ? 2 : y < 526 ? 3 : y < 533 ? 4 : y < 534 ? "4+" : y < 535 ? 5 : y < 537 ? 6 : y < 538 ? 7 : y < 601 ? 8 : "8"), B && (B[1] += " " + (y += "number" == typeof y ? ".x" : /[.+]/.test(y) ? "" : "+")), "Safari" == F && (!R || parseInt(R) > 45) && (R = y)), "Opera" == F && (y = /\bzbov|zvav$/.exec(X)) ? (F += " ", M.unshift("desktop mode"), "zvav" == y ? (F += "Mini", R = null) : F += "Mobile", X = X.replace(RegExp(" *" + y + "$"), "")) : "Safari" == F && /\bChrome\b/.exec(B && B[1]) && (M.unshift("desktop mode"), F = "Chrome Mobile", R = null, /\bOS X\b/.test(X) ? (q = "Apple", X = "iOS 4.3+") : X = null), R && 0 == R.indexOf(y = /[\d.]+$/.exec(X)) && e.indexOf("/" + y + "-") > -1 && (X = p(X.replace(y, ""))), B && !/\b(?:Avant|Nook)\b/.test(F) && (/Browser|Lunascape|Maxthon/.test(F) || "Safari" != F && /^iOS/.test(X) && /\bSafari\b/.test(B[1]) || /^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Samsung Internet|Sleipnir|Web)/.test(F) && B[1]) && (y = B[B.length - 1]) && M.push(y), M.length && (M = ["(" + M.join("; ") + ")"]), q && U && U.indexOf(q) < 0 && M.push("on " + q), U && M.push((/^on /.test(M[M.length - 1]) ? "" : "on ") + U), X && (y = / ([\d.+]+)$/.exec(X), g = y && "/" == X.charAt(X.length - y[0].length - 1), X = { architecture: 32, family: y && !g ? X.replace(y[0], "") : X, version: y ? y[1] : null, toString: function () { var e = this.version; return this.family + (e && !g ? " " + e : "") + (64 == this.architecture ? " 64-bit" : "") } }), (y = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(D)) && !/\bi686\b/i.test(D) ? (X && (X.architecture = 64, X.family = X.family.replace(RegExp(" *" + y), "")), F && (/\bWOW64\b/i.test(e) || L && /\w(?:86|32)$/.test(d.cpuClass || d.platform) && !/\bWin64; x64\b/i.test(e)) && M.unshift("32-bit")) : X && /^OS X/.test(X.family) && "Chrome" == F && parseFloat(R) >= 39 && (X.architecture = 64), e || (e = null); var G = {}; return G.description = e, G.layout = B && B[0], G.manufacturer = q, G.name = F, G.prerelease = P, G.product = U, G.ua = e, G.version = F && R, G.os = X || { architecture: null, family: null, version: null, toString: function () { return "null" } }, G.parse = h, G.toString = r, G.version && M.unshift(R), G.name && M.unshift(F), X && F && (X != String(X).split(" ")[0] || X != F.split(" ")[0] && !U) && M.push(U ? "(" + X + ")" : "on " + X), M.length && (G.description = M.join(" ")), G } var d = { function: !0, object: !0 }, m = d[typeof window] && window || this, b = d[typeof r] && r, y = d[typeof t] && t && !t.nodeType && t, g = b && y && "object" == typeof e && e; !g || g.global !== g && g.window !== g && g.self !== g || (m = g); var v = Math.pow(2, 53) - 1, _ = /\bOpera/, w = Object.prototype, x = w.hasOwnProperty, E = w.toString, T = h(); "function" == typeof define && "object" == typeof define.amd && define.amd ? (m.platform = T, define(function () { return T })) : b && y ? a(T, function (e, t) { b[t] = e }) : m.platform = T }).call(this) }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}) }, {}], 207: [function (e, t, r) { (function (e) { "use strict"; function r(t, r, n, o) { if ("function" != typeof t) throw new TypeError('"callback" argument must be a function'); var i, s, a = arguments.length; switch (a) { case 0: case 1: return e.nextTick(t); case 2: return e.nextTick(function () { t.call(null, r) }); case 3: return e.nextTick(function () { t.call(null, r, n) }); case 4: return e.nextTick(function () { t.call(null, r, n, o) }); default: for (i = new Array(a - 1), s = 0; s < i.length;)i[s++] = arguments[s]; return e.nextTick(function () { t.apply(null, i) }) } } void 0 === e || !e.version || 0 === e.version.indexOf("v0.") || 0 === e.version.indexOf("v1.") && 0 !== e.version.indexOf("v1.8.") ? t.exports = { nextTick: r } : t.exports = e }).call(this, e("_process")) }, { _process: 208 }], 208: [function (e, t, r) { function n() { throw new Error("setTimeout has not been defined") } function o() { throw new Error("clearTimeout has not been defined") } function i(e) { if (f === setTimeout) return setTimeout(e, 0); if ((f === n || !f) && setTimeout) return f = setTimeout, setTimeout(e, 0); try { return f(e, 0) } catch (t) { try { return f.call(null, e, 0) } catch (t) { return f.call(this, e, 0) } } } function s(e) { if (p === clearTimeout) return clearTimeout(e); if ((p === o || !p) && clearTimeout) return p = clearTimeout, clearTimeout(e); try { return p(e) } catch (t) { try { return p.call(null, e) } catch (t) { return p.call(this, e) } } } function a() { b && d && (b = !1, d.length ? m = d.concat(m) : y = -1, m.length && u()) } function u() { if (!b) { var e = i(a); b = !0; for (var t = m.length; t;) { for (d = m, m = []; ++y < t;)d && d[y].run(); y = -1, t = m.length } d = null, b = !1, s(e) } } function c(e, t) { this.fun = e, this.array = t } function l() { } var f, p, h = t.exports = {}; !function () { try { f = "function" == typeof setTimeout ? setTimeout : n } catch (e) { f = n } try { p = "function" == typeof clearTimeout ? clearTimeout : o } catch (e) { p = o } }(); var d, m = [], b = !1, y = -1; h.nextTick = function (e) { var t = new Array(arguments.length - 1); if (arguments.length > 1) for (var r = 1; r < arguments.length; r++)t[r - 1] = arguments[r]; m.push(new c(e, t)), 1 !== m.length || b || i(u) }, c.prototype.run = function () { this.fun.apply(null, this.array) }, h.title = "browser", h.browser = !0, h.env = {}, h.argv = [], h.version = "", h.versions = {}, h.on = l, h.addListener = l, h.once = l, h.off = l, h.removeListener = l, h.removeAllListeners = l, h.emit = l, h.prependListener = l, h.prependOnceListener = l, h.listeners = function (e) { return [] }, h.binding = function (e) { throw new Error("process.binding is not supported") }, h.cwd = function () { return "/" }, h.chdir = function (e) { throw new Error("process.chdir is not supported") }, h.umask = function () { return 0 } }, {}], 209: [function (e, t, r) {
      (function (e) {
        !function (n) {
          function o(e) { throw new RangeError(D[e]) } function i(e, t) { for (var r = e.length, n = []; r--;)n[r] = t(e[r]); return n } function s(e, t) { var r = e.split("@"), n = ""; return r.length > 1 && (n = r[0] + "@", e = r[1]), e = e.replace(A, "."), n + i(e.split("."), t).join(".") } function a(e) {
            for (var t, r, n = [], o = 0, i = e.length; o < i;)t = e.charCodeAt(o++), t >= 55296 && t <= 56319 && o < i ? (r = e.charCodeAt(o++), 56320 == (64512 & r) ? n.push(((1023 & t) << 10) + (1023 & r) + 65536) : (n.push(t), o--)) : n.push(t); return n
          } function u(e) { return i(e, function (e) { var t = ""; return e > 65535 && (e -= 65536, t += L(e >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), t += L(e) }).join("") } function c(e) { return e - 48 < 10 ? e - 22 : e - 65 < 26 ? e - 65 : e - 97 < 26 ? e - 97 : x } function l(e, t) { return e + 22 + 75 * (e < 26) - ((0 != t) << 5) } function f(e, t, r) { var n = 0; for (e = r ? P(e / j) : e >> 1, e += P(e / t); e > M * T >> 1; n += x)e = P(e / M); return P(n + (M + 1) * e / (e + S)) } function p(e) { var t, r, n, i, s, a, l, p, h, d, m = [], b = e.length, y = 0, g = N, v = O; for (r = e.lastIndexOf(k), r < 0 && (r = 0), n = 0; n < r; ++n)e.charCodeAt(n) >= 128 && o("not-basic"), m.push(e.charCodeAt(n)); for (i = r > 0 ? r + 1 : 0; i < b;) { for (s = y, a = 1, l = x; i >= b && o("invalid-input"), p = c(e.charCodeAt(i++)), (p >= x || p > P((w - y) / a)) && o("overflow"), y += p * a, h = l <= v ? E : l >= v + T ? T : l - v, !(p < h); l += x)d = x - h, a > P(w / d) && o("overflow"), a *= d; t = m.length + 1, v = f(y - s, t, 0 == s), P(y / t) > w - g && o("overflow"), g += P(y / t), y %= t, m.splice(y++, 0, g) } return u(m) } function h(e) { var t, r, n, i, s, u, c, p, h, d, m, b, y, g, v, _ = []; for (e = a(e), b = e.length, t = N, r = 0, s = O, u = 0; u < b; ++u)(m = e[u]) < 128 && _.push(L(m)); for (n = i = _.length, i && _.push(k); n < b;) { for (c = w, u = 0; u < b; ++u)(m = e[u]) >= t && m < c && (c = m); for (y = n + 1, c - t > P((w - r) / y) && o("overflow"), r += (c - t) * y, t = c, u = 0; u < b; ++u)if (m = e[u], m < t && ++r > w && o("overflow"), m == t) { for (p = r, h = x; d = h <= s ? E : h >= s + T ? T : h - s, !(p < d); h += x)v = p - d, g = x - d, _.push(L(l(d + v % g, 0))), p = P(v / g); _.push(L(l(p, 0))), s = f(r, y, n == i), r = 0, ++n } ++r, ++t } return _.join("") } function d(e) { return s(e, function (e) { return I.test(e) ? p(e.slice(4).toLowerCase()) : e }) } function m(e) { return s(e, function (e) { return C.test(e) ? "xn--" + h(e) : e }) } var b = "object" == typeof r && r && !r.nodeType && r, y = "object" == typeof t && t && !t.nodeType && t, g = "object" == typeof e && e; g.global !== g && g.window !== g && g.self !== g || (n = g); var v, _, w = 2147483647, x = 36, E = 1, T = 26, S = 38, j = 700, O = 72, N = 128, k = "-", I = /^xn--/, C = /[^\x20-\x7E]/, A = /[\x2E\u3002\uFF0E\uFF61]/g, D = { overflow: "Overflow: input needs wider integers to process", "not-basic": "Illegal input >= 0x80 (not a basic code point)", "invalid-input": "Invalid input" }, M = x - E, P = Math.floor, L = String.fromCharCode; if (v = { version: "1.4.1", ucs2: { decode: a, encode: u }, decode: p, encode: h, toASCII: m, toUnicode: d }, "function" == typeof define && "object" == typeof define.amd && define.amd) define("punycode", function () { return v }); else if (b && y) if (t.exports == b) y.exports = v; else for (_ in v) v.hasOwnProperty(_) && (b[_] = v[_]); else n.punycode = v
        }(this)
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}], 210: [function (e, t, r) { "use strict"; function n(e, t) { return Object.prototype.hasOwnProperty.call(e, t) } t.exports = function (e, t, r, i) { t = t || "&", r = r || "="; var s = {}; if ("string" != typeof e || 0 === e.length) return s; var a = /\+/g; e = e.split(t); var u = 1e3; i && "number" == typeof i.maxKeys && (u = i.maxKeys); var c = e.length; u > 0 && c > u && (c = u); for (var l = 0; l < c; ++l) { var f, p, h, d, m = e[l].replace(a, "%20"), b = m.indexOf(r); b >= 0 ? (f = m.substr(0, b), p = m.substr(b + 1)) : (f = m, p = ""), h = decodeURIComponent(f), d = decodeURIComponent(p), n(s, h) ? o(s[h]) ? s[h].push(d) : s[h] = [s[h], d] : s[h] = d } return s }; var o = Array.isArray || function (e) { return "[object Array]" === Object.prototype.toString.call(e) } }, {}], 211: [function (e, t, r) { "use strict"; function n(e, t) { if (e.map) return e.map(t); for (var r = [], n = 0; n < e.length; n++)r.push(t(e[n], n)); return r } var o = function (e) { switch (typeof e) { case "string": return e; case "boolean": return e ? "true" : "false"; case "number": return isFinite(e) ? e : ""; default: return "" } }; t.exports = function (e, t, r, a) { return t = t || "&", r = r || "=", null === e && (e = void 0), "object" == typeof e ? n(s(e), function (s) { var a = encodeURIComponent(o(s)) + r; return i(e[s]) ? n(e[s], function (e) { return a + encodeURIComponent(o(e)) }).join(t) : a + encodeURIComponent(o(e[s])) }).join(t) : a ? encodeURIComponent(o(a)) + r + encodeURIComponent(o(e)) : "" }; var i = Array.isArray || function (e) { return "[object Array]" === Object.prototype.toString.call(e) }, s = Object.keys || function (e) { var t = []; for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.push(r); return t } }, {}], 212: [function (e, t, r) { "use strict"; r.decode = r.parse = e("./decode"), r.encode = r.stringify = e("./encode") }, { "./decode": 210, "./encode": 211 }], 213: [function (e, t, r) { t.exports = e("./lib/_stream_duplex.js") }, { "./lib/_stream_duplex.js": 214 }], 214: [function (e, t, r) { "use strict"; function n(e) { return e && e.__esModule ? e : { default: e } } function o(e) { if (!(this instanceof o)) return new o(e); d.call(this, e), m.call(this, e), e && !1 === e.readable && (this.readable = !1), e && !1 === e.writable && (this.writable = !1), this.allowHalfOpen = !0, e && !1 === e.allowHalfOpen && (this.allowHalfOpen = !1), this.once("end", i) } function i() { this.allowHalfOpen || this._writableState.ended || f.nextTick(s, this) } function s(e) { e.end() } var a = e("babel-runtime/core-js/object/create"), u = n(a), c = e("babel-runtime/core-js/object/keys"), l = n(c), f = e("process-nextick-args"), p = l.default || function (e) { var t = []; for (var r in e) t.push(r); return t }; t.exports = o; var h = (0, u.default)(e("core-util-is")); h.inherits = e("inherits"); var d = e("./_stream_readable"), m = e("./_stream_writable"); h.inherits(o, d); for (var b = p(m.prototype), y = 0; y < b.length; y++) { var g = b[y]; o.prototype[g] || (o.prototype[g] = m.prototype[g]) } Object.defineProperty(o.prototype, "writableHighWaterMark", { enumerable: !1, get: function () { return this._writableState.highWaterMark } }), Object.defineProperty(o.prototype, "destroyed", { get: function () { return void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed && this._writableState.destroyed) }, set: function (e) { void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed = e, this._writableState.destroyed = e) } }), o.prototype._destroy = function (e, t) { this.push(null), this.end(), f.nextTick(t, e) } }, { "./_stream_readable": 216, "./_stream_writable": 218, "babel-runtime/core-js/object/create": 55, "babel-runtime/core-js/object/keys": 60, "core-util-is": 189, inherits: 196, "process-nextick-args": 207 }], 215: [function (e, t, r) { "use strict"; function n(e) { if (!(this instanceof n)) return new n(e); s.call(this, e) } var o = e("babel-runtime/core-js/object/create"), i = function (e) { return e && e.__esModule ? e : { default: e } }(o); t.exports = n; var s = e("./_stream_transform"), a = (0, i.default)(e("core-util-is")); a.inherits = e("inherits"), a.inherits(n, s), n.prototype._transform = function (e, t, r) { r(null, e) } }, { "./_stream_transform": 217, "babel-runtime/core-js/object/create": 55, "core-util-is": 189, inherits: 196 }], 216: [function (e, t, r) { (function (r, n) { "use strict"; function o(e) { return e && e.__esModule ? e : { default: e } } function i(e) { return X.from(e) } function s(e) { return X.isBuffer(e) || e instanceof G } function a(e, t, r) { if ("function" == typeof e.prependListener) return e.prependListener(t, r); e._events && e._events[t] ? F(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]] : e.on(t, r) } function u(t, r) { B = B || e("./_stream_duplex"), t = t || {}; var n = r instanceof B; this.objectMode = !!t.objectMode, n && (this.objectMode = this.objectMode || !!t.readableObjectMode); var o = t.highWaterMark, i = t.readableHighWaterMark, s = this.objectMode ? 16 : 16384; this.highWaterMark = o || 0 === o ? o : n && (i || 0 === i) ? i : s, this.highWaterMark = Math.floor(this.highWaterMark), this.buffer = new K, this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.destroyed = !1, this.defaultEncoding = t.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, t.encoding && (W || (W = e("string_decoder/").StringDecoder), this.decoder = new W(t.encoding), this.encoding = t.encoding) } function c(t) { if (B = B || e("./_stream_duplex"), !(this instanceof c)) return new c(t); this._readableState = new u(t, this), this.readable = !0, t && ("function" == typeof t.read && (this._read = t.read), "function" == typeof t.destroy && (this._destroy = t.destroy)), q.call(this) } function l(e, t, r, n, o) { var s = e._readableState; if (null === t) s.reading = !1, b(e, s); else { var a; o || (a = p(s, t)), a ? e.emit("error", a) : s.objectMode || t && t.length > 0 ? ("string" == typeof t || s.objectMode || (0, M.default)(t) === X.prototype || (t = i(t)), n ? s.endEmitted ? e.emit("error", new Error("stream.unshift() after end event")) : f(e, s, t, !0) : s.ended ? e.emit("error", new Error("stream.push() after EOF")) : (s.reading = !1, s.decoder && !r ? (t = s.decoder.write(t), s.objectMode || 0 !== t.length ? f(e, s, t, !1) : v(e, s)) : f(e, s, t, !1))) : n || (s.reading = !1) } return h(s) } function f(e, t, r, n) { t.flowing && 0 === t.length && !t.sync ? (e.emit("data", r), e.read(0)) : (t.length += t.objectMode ? 1 : r.length, n ? t.buffer.unshift(r) : t.buffer.push(r), t.needReadable && y(e)), v(e, t) } function p(e, t) { var r; return s(t) || "string" == typeof t || void 0 === t || e.objectMode || (r = new TypeError("Invalid non-string/buffer chunk")), r } function h(e) { return !e.ended && (e.needReadable || e.length < e.highWaterMark || 0 === e.length) } function d(e) { return e >= J ? e = J : (e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e++), e } function m(e, t) { return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : e !== e ? t.flowing && t.length ? t.buffer.head.data.length : t.length : (e > t.highWaterMark && (t.highWaterMark = d(e)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0)) } function b(e, t) { if (!t.ended) { if (t.decoder) { var r = t.decoder.end(); r && r.length && (t.buffer.push(r), t.length += t.objectMode ? 1 : r.length) } t.ended = !0, y(e) } } function y(e) { var t = e._readableState; t.needReadable = !1, t.emittedReadable || (H("emitReadable", t.flowing), t.emittedReadable = !0, t.sync ? R.nextTick(g, e) : g(e)) } function g(e) { H("emit readable"), e.emit("readable"), S(e) } function v(e, t) { t.readingMore || (t.readingMore = !0, R.nextTick(_, e, t)) } function _(e, t) { for (var r = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (H("maybeReadMore read 0"), e.read(0), r !== t.length);)r = t.length; t.readingMore = !1 } function w(e) { return function () { var t = e._readableState; H("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, 0 === t.awaitDrain && U(e, "data") && (t.flowing = !0, S(e)) } } function x(e) { H("readable nexttick read 0"), e.read(0) } function E(e, t) { t.resumeScheduled || (t.resumeScheduled = !0, R.nextTick(T, e, t)) } function T(e, t) { t.reading || (H("resume read 0"), e.read(0)), t.resumeScheduled = !1, t.awaitDrain = 0, e.emit("resume"), S(e), t.flowing && !t.reading && e.read(0) } function S(e) { var t = e._readableState; for (H("flow", t.flowing); t.flowing && null !== e.read();); } function j(e, t) { if (0 === t.length) return null; var r; return t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (r = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.head.data : t.buffer.concat(t.length), t.buffer.clear()) : r = O(e, t.buffer, t.decoder), r } function O(e, t, r) { var n; return e < t.head.data.length ? (n = t.head.data.slice(0, e), t.head.data = t.head.data.slice(e)) : n = e === t.head.data.length ? t.shift() : r ? N(e, t) : k(e, t), n } function N(e, t) { var r = t.head, n = 1, o = r.data; for (e -= o.length; r = r.next;) { var i = r.data, s = e > i.length ? i.length : e; if (s === i.length ? o += i : o += i.slice(0, e), 0 === (e -= s)) { s === i.length ? (++n, r.next ? t.head = r.next : t.head = t.tail = null) : (t.head = r, r.data = i.slice(s)); break } ++n } return t.length -= n, o } function k(e, t) { var r = X.allocUnsafe(e), n = t.head, o = 1; for (n.data.copy(r), e -= n.data.length; n = n.next;) { var i = n.data, s = e > i.length ? i.length : e; if (i.copy(r, r.length - e, 0, s), 0 === (e -= s)) { s === i.length ? (++o, n.next ? t.head = n.next : t.head = t.tail = null) : (t.head = n, n.data = i.slice(s)); break } ++o } return t.length -= o, r } function I(e) { var t = e._readableState; if (t.length > 0) throw new Error('"endReadable()" called on non-empty stream'); t.endEmitted || (t.ended = !0, R.nextTick(C, t, e)) } function C(e, t) { e.endEmitted || 0 !== e.length || (e.endEmitted = !0, t.readable = !1, t.emit("end")) } function A(e, t) { for (var r = 0, n = e.length; r < n; r++)if (e[r] === t) return r; return -1 } var D = e("babel-runtime/core-js/object/get-prototype-of"), M = o(D), P = e("babel-runtime/core-js/object/create"), L = o(P), R = e("process-nextick-args"); t.exports = c; var B, F = e("isarray"); c.ReadableState = u; var U = (e("events").EventEmitter, function (e, t) { return e.listeners(t).length }), q = e("./internal/streams/stream"), X = e("safe-buffer").Buffer, G = n.Uint8Array || function () { }, z = (0, L.default)(e("core-util-is")); z.inherits = e("inherits"); var V = e("util"), H = void 0; H = V && V.debuglog ? V.debuglog("stream") : function () { }; var W, K = e("./internal/streams/BufferList"), Y = e("./internal/streams/destroy"); z.inherits(c, q); var $ = ["error", "close", "destroy", "pause", "resume"]; Object.defineProperty(c.prototype, "destroyed", { get: function () { return void 0 !== this._readableState && this._readableState.destroyed }, set: function (e) { this._readableState && (this._readableState.destroyed = e) } }), c.prototype.destroy = Y.destroy, c.prototype._undestroy = Y.undestroy, c.prototype._destroy = function (e, t) { this.push(null), t(e) }, c.prototype.push = function (e, t) { var r, n = this._readableState; return n.objectMode ? r = !0 : "string" == typeof e && (t = t || n.defaultEncoding, t !== n.encoding && (e = X.from(e, t), t = ""), r = !0), l(this, e, t, !1, r) }, c.prototype.unshift = function (e) { return l(this, e, null, !0, !1) }, c.prototype.isPaused = function () { return !1 === this._readableState.flowing }, c.prototype.setEncoding = function (t) { return W || (W = e("string_decoder/").StringDecoder), this._readableState.decoder = new W(t), this._readableState.encoding = t, this }; var J = 8388608; c.prototype.read = function (e) { H("read", e), e = parseInt(e, 10); var t = this._readableState, r = e; if (0 !== e && (t.emittedReadable = !1), 0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended)) return H("read: emitReadable", t.length, t.ended), 0 === t.length && t.ended ? I(this) : y(this), null; if (0 === (e = m(e, t)) && t.ended) return 0 === t.length && I(this), null; var n = t.needReadable; H("need readable", n), (0 === t.length || t.length - e < t.highWaterMark) && (n = !0, H("length less than watermark", n)), t.ended || t.reading ? (n = !1, H("reading or ended", n)) : n && (H("do read"), t.reading = !0, t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1, t.reading || (e = m(r, t))); var o; return o = e > 0 ? j(e, t) : null, null === o ? (t.needReadable = !0, e = 0) : t.length -= e, 0 === t.length && (t.ended || (t.needReadable = !0), r !== e && t.ended && I(this)), null !== o && this.emit("data", o), o }, c.prototype._read = function (e) { this.emit("error", new Error("_read() is not implemented")) }, c.prototype.pipe = function (e, t) { function n(e, t) { H("onunpipe"), e === p && t && !1 === t.hasUnpiped && (t.hasUnpiped = !0, i()) } function o() { H("onend"), e.end() } function i() { H("cleanup"), e.removeListener("close", c), e.removeListener("finish", l), e.removeListener("drain", b), e.removeListener("error", u), e.removeListener("unpipe", n), p.removeListener("end", o), p.removeListener("end", f), p.removeListener("data", s), y = !0, !h.awaitDrain || e._writableState && !e._writableState.needDrain || b() } function s(t) { H("ondata"), g = !1, !1 !== e.write(t) || g || ((1 === h.pipesCount && h.pipes === e || h.pipesCount > 1 && -1 !== A(h.pipes, e)) && !y && (H("false write response, pause", p._readableState.awaitDrain), p._readableState.awaitDrain++, g = !0), p.pause()) } function u(t) { H("onerror", t), f(), e.removeListener("error", u), 0 === U(e, "error") && e.emit("error", t) } function c() { e.removeListener("finish", l), f() } function l() { H("onfinish"), e.removeListener("close", c), f() } function f() { H("unpipe"), p.unpipe(e) } var p = this, h = this._readableState; switch (h.pipesCount) { case 0: h.pipes = e; break; case 1: h.pipes = [h.pipes, e]; break; default: h.pipes.push(e) }h.pipesCount += 1, H("pipe count=%d opts=%j", h.pipesCount, t); var d = (!t || !1 !== t.end) && e !== r.stdout && e !== r.stderr, m = d ? o : f; h.endEmitted ? R.nextTick(m) : p.once("end", m), e.on("unpipe", n); var b = w(p); e.on("drain", b); var y = !1, g = !1; return p.on("data", s), a(e, "error", u), e.once("close", c), e.once("finish", l), e.emit("pipe", p), h.flowing || (H("pipe resume"), p.resume()), e }, c.prototype.unpipe = function (e) { var t = this._readableState, r = { hasUnpiped: !1 }; if (0 === t.pipesCount) return this; if (1 === t.pipesCount) return e && e !== t.pipes ? this : (e || (e = t.pipes), t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this, r), this); if (!e) { var n = t.pipes, o = t.pipesCount; t.pipes = null, t.pipesCount = 0, t.flowing = !1; for (var i = 0; i < o; i++)n[i].emit("unpipe", this, r); return this } var s = A(t.pipes, e); return -1 === s ? this : (t.pipes.splice(s, 1), t.pipesCount -= 1, 1 === t.pipesCount && (t.pipes = t.pipes[0]), e.emit("unpipe", this, r), this) }, c.prototype.on = function (e, t) { var r = q.prototype.on.call(this, e, t); if ("data" === e) !1 !== this._readableState.flowing && this.resume(); else if ("readable" === e) { var n = this._readableState; n.endEmitted || n.readableListening || (n.readableListening = n.needReadable = !0, n.emittedReadable = !1, n.reading ? n.length && y(this) : R.nextTick(x, this)) } return r }, c.prototype.addListener = c.prototype.on, c.prototype.resume = function () { var e = this._readableState; return e.flowing || (H("resume"), e.flowing = !0, E(this, e)), this }, c.prototype.pause = function () { return H("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (H("pause"), this._readableState.flowing = !1, this.emit("pause")), this }, c.prototype.wrap = function (e) { var t = this, r = this._readableState, n = !1; e.on("end", function () { if (H("wrapped end"), r.decoder && !r.ended) { var e = r.decoder.end(); e && e.length && t.push(e) } t.push(null) }), e.on("data", function (o) { if (H("wrapped data"), r.decoder && (o = r.decoder.write(o)), (!r.objectMode || null !== o && void 0 !== o) && (r.objectMode || o && o.length)) { t.push(o) || (n = !0, e.pause()) } }); for (var o in e) void 0 === this[o] && "function" == typeof e[o] && (this[o] = function (t) { return function () { return e[t].apply(e, arguments) } }(o)); for (var i = 0; i < $.length; i++)e.on($[i], this.emit.bind(this, $[i])); return this._read = function (t) { H("wrapped _read", t), n && (n = !1, e.resume()) }, this }, Object.defineProperty(c.prototype, "readableHighWaterMark", { enumerable: !1, get: function () { return this._readableState.highWaterMark } }), c._fromList = j }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}) }, { "./_stream_duplex": 214, "./internal/streams/BufferList": 219, "./internal/streams/destroy": 220, "./internal/streams/stream": 221, _process: 208, "babel-runtime/core-js/object/create": 55, "babel-runtime/core-js/object/get-prototype-of": 59, "core-util-is": 189, events: 192, inherits: 196, isarray: 198, "process-nextick-args": 207, "safe-buffer": 228, "string_decoder/": 235, util: 71 }], 217: [function (e, t, r) { "use strict"; function n(e, t) { var r = this._transformState; r.transforming = !1; var n = r.writecb; if (!n) return this.emit("error", new Error("write callback called multiple times")); r.writechunk = null, r.writecb = null, null != t && this.push(t), n(e); var o = this._readableState; o.reading = !1, (o.needReadable || o.length < o.highWaterMark) && this._read(o.highWaterMark) } function o(e) { if (!(this instanceof o)) return new o(e); c.call(this, e), this._transformState = { afterTransform: n.bind(this), needTransform: !1, transforming: !1, writecb: null, writechunk: null, writeencoding: null }, this._readableState.needReadable = !0, this._readableState.sync = !1, e && ("function" == typeof e.transform && (this._transform = e.transform), "function" == typeof e.flush && (this._flush = e.flush)), this.on("prefinish", i) } function i() { var e = this; "function" == typeof this._flush ? this._flush(function (t, r) { s(e, t, r) }) : s(this, null, null) } function s(e, t, r) { if (t) return e.emit("error", t); if (null != r && e.push(r), e._writableState.length) throw new Error("Calling transform done when ws.length != 0"); if (e._transformState.transforming) throw new Error("Calling transform done when still transforming"); return e.push(null) } var a = e("babel-runtime/core-js/object/create"), u = function (e) { return e && e.__esModule ? e : { default: e } }(a); t.exports = o; var c = e("./_stream_duplex"), l = (0, u.default)(e("core-util-is")); l.inherits = e("inherits"), l.inherits(o, c), o.prototype.push = function (e, t) { return this._transformState.needTransform = !1, c.prototype.push.call(this, e, t) }, o.prototype._transform = function (e, t, r) { throw new Error("_transform() is not implemented") }, o.prototype._write = function (e, t, r) { var n = this._transformState; if (n.writecb = r, n.writechunk = e, n.writeencoding = t, !n.transforming) { var o = this._readableState; (n.needTransform || o.needReadable || o.length < o.highWaterMark) && this._read(o.highWaterMark) } }, o.prototype._read = function (e) { var t = this._transformState; null !== t.writechunk && t.writecb && !t.transforming ? (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform)) : t.needTransform = !0 }, o.prototype._destroy = function (e, t) { var r = this; c.prototype._destroy.call(this, e, function (e) { t(e), r.emit("close") }) } }, { "./_stream_duplex": 214, "babel-runtime/core-js/object/create": 55, "core-util-is": 189, inherits: 196 }], 218: [function (e, t, r) { (function (r, n) { "use strict"; function o(e) { return e && e.__esModule ? e : { default: e } } function i(e) { var t = this; this.next = null, this.entry = null, this.finish = function () { O(t, e) } } function s(e) { return z.from(e) } function a(e) { return z.isBuffer(e) || e instanceof V } function u() { } function c(t, r) { F = F || e("./_stream_duplex"), t = t || {}; var n = r instanceof F; this.objectMode = !!t.objectMode, n && (this.objectMode = this.objectMode || !!t.writableObjectMode); var o = t.highWaterMark, s = t.writableHighWaterMark, a = this.objectMode ? 16 : 16384; this.highWaterMark = o || 0 === o ? o : n && (s || 0 === s) ? s : a, this.highWaterMark = Math.floor(this.highWaterMark), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1; var u = !1 === t.decodeStrings; this.decodeStrings = !u, this.defaultEncoding = t.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function (e) { g(r, e) }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new i(this) } function l(t) { if (F = F || e("./_stream_duplex"), !(W.call(l, this) || this instanceof F)) return new l(t); this._writableState = new c(t, this), this.writable = !0, t && ("function" == typeof t.write && (this._write = t.write), "function" == typeof t.writev && (this._writev = t.writev), "function" == typeof t.destroy && (this._destroy = t.destroy), "function" == typeof t.final && (this._final = t.final)), G.call(this) } function f(e, t) { var r = new Error("write after end"); e.emit("error", r), B.nextTick(t, r) } function p(e, t, r, n) { var o = !0, i = !1; return null === r ? i = new TypeError("May not write null values to stream") : "string" == typeof r || void 0 === r || t.objectMode || (i = new TypeError("Invalid non-string/buffer chunk")), i && (e.emit("error", i), B.nextTick(n, i), o = !1), o } function h(e, t, r) { return e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = z.from(t, r)), t } function d(e, t, r, n, o, i) { if (!r) { var s = h(t, n, o); n !== s && (r = !0, o = "buffer", n = s) } var a = t.objectMode ? 1 : n.length; t.length += a; var u = t.length < t.highWaterMark; if (u || (t.needDrain = !0), t.writing || t.corked) { var c = t.lastBufferedRequest; t.lastBufferedRequest = { chunk: n, encoding: o, isBuf: r, callback: i, next: null }, c ? c.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, t.bufferedRequestCount += 1 } else m(e, t, !1, a, n, o, i); return u } function m(e, t, r, n, o, i, s) { t.writelen = n, t.writecb = s, t.writing = !0, t.sync = !0, r ? e._writev(o, t.onwrite) : e._write(o, i, t.onwrite), t.sync = !1 } function b(e, t, r, n, o) { --t.pendingcb, r ? (B.nextTick(o, n), B.nextTick(S, e, t), e._writableState.errorEmitted = !0, e.emit("error", n)) : (o(n), e._writableState.errorEmitted = !0, e.emit("error", n), S(e, t)) } function y(e) { e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0 } function g(e, t) { var r = e._writableState, n = r.sync, o = r.writecb; if (y(r), t) b(e, r, n, t, o); else { var i = x(r); i || r.corked || r.bufferProcessing || !r.bufferedRequest || w(e, r), n ? U(v, e, r, i, o) : v(e, r, i, o) } } function v(e, t, r, n) { r || _(e, t), t.pendingcb--, n(), S(e, t) } function _(e, t) { 0 === t.length && t.needDrain && (t.needDrain = !1, e.emit("drain")) } function w(e, t) { t.bufferProcessing = !0; var r = t.bufferedRequest; if (e._writev && r && r.next) { var n = t.bufferedRequestCount, o = new Array(n), s = t.corkedRequestsFree; s.entry = r; for (var a = 0, u = !0; r;)o[a] = r, r.isBuf || (u = !1), r = r.next, a += 1; o.allBuffers = u, m(e, t, !0, t.length, o, "", s.finish), t.pendingcb++, t.lastBufferedRequest = null, s.next ? (t.corkedRequestsFree = s.next, s.next = null) : t.corkedRequestsFree = new i(t), t.bufferedRequestCount = 0 } else { for (; r;) { var c = r.chunk, l = r.encoding, f = r.callback; if (m(e, t, !1, t.objectMode ? 1 : c.length, c, l, f), r = r.next, t.bufferedRequestCount--, t.writing) break } null === r && (t.lastBufferedRequest = null) } t.bufferedRequest = r, t.bufferProcessing = !1 } function x(e) { return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing } function E(e, t) { e._final(function (r) { t.pendingcb--, r && e.emit("error", r), t.prefinished = !0, e.emit("prefinish"), S(e, t) }) } function T(e, t) { t.prefinished || t.finalCalled || ("function" == typeof e._final ? (t.pendingcb++, t.finalCalled = !0, B.nextTick(E, e, t)) : (t.prefinished = !0, e.emit("prefinish"))) } function S(e, t) { var r = x(t); return r && (T(e, t), 0 === t.pendingcb && (t.finished = !0, e.emit("finish"))), r } function j(e, t, r) { t.ending = !0, S(e, t), r && (t.finished ? B.nextTick(r) : e.once("finish", r)), t.ended = !0, e.writable = !1 } function O(e, t, r) { var n = e.entry; for (e.entry = null; n;) { var o = n.callback; t.pendingcb--, o(r), n = n.next } t.corkedRequestsFree ? t.corkedRequestsFree.next = e : t.corkedRequestsFree = e } var N = e("babel-runtime/core-js/object/define-property"), k = o(N), I = e("babel-runtime/core-js/symbol/has-instance"), C = o(I), A = e("babel-runtime/core-js/symbol"), D = o(A), M = e("babel-runtime/core-js/object/create"), P = o(M), L = e("babel-runtime/core-js/set-immediate"), R = o(L), B = e("process-nextick-args"); t.exports = l; var F, U = !r.browser && ["v0.10", "v0.9."].indexOf(r.version.slice(0, 5)) > -1 ? R.default : B.nextTick; l.WritableState = c; var q = (0, P.default)(e("core-util-is")); q.inherits = e("inherits"); var X = { deprecate: e("util-deprecate") }, G = e("./internal/streams/stream"), z = e("safe-buffer").Buffer, V = n.Uint8Array || function () { }, H = e("./internal/streams/destroy"); q.inherits(l, G), c.prototype.getBuffer = function () { for (var e = this.bufferedRequest, t = []; e;)t.push(e), e = e.next; return t }, function () { try { Object.defineProperty(c.prototype, "buffer", { get: X.deprecate(function () { return this.getBuffer() }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003") }) } catch (e) { } }(); var W; "function" == typeof D.default && C.default && "function" == typeof Function.prototype[C.default] ? (W = Function.prototype[C.default], (0, k.default)(l, C.default, { value: function (e) { return !!W.call(this, e) || this === l && (e && e._writableState instanceof c) } })) : W = function (e) { return e instanceof this }, l.prototype.pipe = function () { this.emit("error", new Error("Cannot pipe, not readable")) }, l.prototype.write = function (e, t, r) { var n = this._writableState, o = !1, i = !n.objectMode && a(e); return i && !z.isBuffer(e) && (e = s(e)), "function" == typeof t && (r = t, t = null), i ? t = "buffer" : t || (t = n.defaultEncoding), "function" != typeof r && (r = u), n.ended ? f(this, r) : (i || p(this, n, e, r)) && (n.pendingcb++, o = d(this, n, i, e, t, r)), o }, l.prototype.cork = function () { this._writableState.corked++ }, l.prototype.uncork = function () { var e = this._writableState; e.corked && (e.corked--, e.writing || e.corked || e.finished || e.bufferProcessing || !e.bufferedRequest || w(this, e)) }, l.prototype.setDefaultEncoding = function (e) { if ("string" == typeof e && (e = e.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + e); return this._writableState.defaultEncoding = e, this }, Object.defineProperty(l.prototype, "writableHighWaterMark", { enumerable: !1, get: function () { return this._writableState.highWaterMark } }), l.prototype._write = function (e, t, r) { r(new Error("_write() is not implemented")) }, l.prototype._writev = null, l.prototype.end = function (e, t, r) { var n = this._writableState; "function" == typeof e ? (r = e, e = null, t = null) : "function" == typeof t && (r = t, t = null), null !== e && void 0 !== e && this.write(e, t), n.corked && (n.corked = 1, this.uncork()), n.ending || n.finished || j(this, n, r) }, Object.defineProperty(l.prototype, "destroyed", { get: function () { return void 0 !== this._writableState && this._writableState.destroyed }, set: function (e) { this._writableState && (this._writableState.destroyed = e) } }), l.prototype.destroy = H.destroy, l.prototype._undestroy = H.undestroy, l.prototype._destroy = function (e, t) { this.end(), t(e) } }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}) }, { "./_stream_duplex": 214, "./internal/streams/destroy": 220, "./internal/streams/stream": 221, _process: 208, "babel-runtime/core-js/object/create": 55, "babel-runtime/core-js/object/define-property": 56, "babel-runtime/core-js/set-immediate": 62, "babel-runtime/core-js/symbol": 64, "babel-runtime/core-js/symbol/has-instance": 65, "core-util-is": 189, inherits: 196, "process-nextick-args": 207, "safe-buffer": 228, "util-deprecate": 240 }], 219: [function (e, t, r) { "use strict"; function n(e, t) { if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function") } function o(e, t, r) { e.copy(t, r) } var i = e("safe-buffer").Buffer, s = e("util"); t.exports = function () { function e() { n(this, e), this.head = null, this.tail = null, this.length = 0 } return e.prototype.push = function (e) { var t = { data: e, next: null }; this.length > 0 ? this.tail.next = t : this.head = t, this.tail = t, ++this.length }, e.prototype.unshift = function (e) { var t = { data: e, next: this.head }; 0 === this.length && (this.tail = t), this.head = t, ++this.length }, e.prototype.shift = function () { if (0 !== this.length) { var e = this.head.data; return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next, --this.length, e } }, e.prototype.clear = function () { this.head = this.tail = null, this.length = 0 }, e.prototype.join = function (e) { if (0 === this.length) return ""; for (var t = this.head, r = "" + t.data; t = t.next;)r += e + t.data; return r }, e.prototype.concat = function (e) { if (0 === this.length) return i.alloc(0); if (1 === this.length) return this.head.data; for (var t = i.allocUnsafe(e >>> 0), r = this.head, n = 0; r;)o(r.data, t, n), n += r.data.length, r = r.next; return t }, e }(), s && s.inspect && s.inspect.custom && (t.exports.prototype[s.inspect.custom] = function () { var e = s.inspect({ length: this.length }); return this.constructor.name + " " + e }) }, { "safe-buffer": 228, util: 71 }], 220: [function (e, t, r) { "use strict"; function n(e, t) { var r = this, n = this._readableState && this._readableState.destroyed, o = this._writableState && this._writableState.destroyed; return n || o ? (t ? t(e) : !e || this._writableState && this._writableState.errorEmitted || s.nextTick(i, this, e), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(e || null, function (e) { !t && e ? (s.nextTick(i, r, e), r._writableState && (r._writableState.errorEmitted = !0)) : t && t(e) }), this) } function o() { this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1) } function i(e, t) { e.emit("error", t) } var s = e("process-nextick-args"); t.exports = { destroy: n, undestroy: o } }, { "process-nextick-args": 207 }], 221: [function (e, t, r) { "use strict"; t.exports = e("events").EventEmitter }, { events: 192 }], 222: [function (e, t, r) { t.exports = e("./readable").PassThrough }, { "./readable": 223 }], 223: [function (e, t, r) { r = t.exports = e("./lib/_stream_readable.js"), r.Stream = r, r.Readable = r, r.Writable = e("./lib/_stream_writable.js"), r.Duplex = e("./lib/_stream_duplex.js"), r.Transform = e("./lib/_stream_transform.js"), r.PassThrough = e("./lib/_stream_passthrough.js") }, { "./lib/_stream_duplex.js": 214, "./lib/_stream_passthrough.js": 215, "./lib/_stream_readable.js": 216, "./lib/_stream_transform.js": 217, "./lib/_stream_writable.js": 218 }], 224: [function (e, t, r) { t.exports = e("./readable").Transform }, { "./readable": 223 }], 225: [function (e, t, r) { t.exports = e("./lib/_stream_writable.js") }, { "./lib/_stream_writable.js": 218 }], 226: [function (e, t, r) { var n = function () { return this }() || Function("return this")(), o = n.regeneratorRuntime && Object.getOwnPropertyNames(n).indexOf("regeneratorRuntime") >= 0, i = o && n.regeneratorRuntime; if (n.regeneratorRuntime = void 0, t.exports = e("./runtime"), o) n.regeneratorRuntime = i; else try { delete n.regeneratorRuntime } catch (e) { n.regeneratorRuntime = void 0 } }, { "./runtime": 227 }], 227: [function (e, t, r) {
      !function (e) {
        "use strict"; function r(e, t, r, n) { var i = t && t.prototype instanceof o ? t : o, s = Object.create(i.prototype), a = new h(n || []); return s._invoke = c(e, r, a), s } function n(e, t, r) { try { return { type: "normal", arg: e.call(t, r) } } catch (e) { return { type: "throw", arg: e } } } function o() { } function i() { } function s() { } function a(e) { ["next", "throw", "return"].forEach(function (t) { e[t] = function (e) { return this._invoke(t, e) } }) } function u(e) {
          function t(r, o, i, s) {
            var a = n(e[r], e, o); if ("throw" !== a.type) {
              var u = a.arg, c = u.value
                ; return c && "object" == typeof c && g.call(c, "__await") ? Promise.resolve(c.__await).then(function (e) { t("next", e, i, s) }, function (e) { t("throw", e, i, s) }) : Promise.resolve(c).then(function (e) { u.value = e, i(u) }, s)
            } s(a.arg)
          } function r(e, r) { function n() { return new Promise(function (n, o) { t(e, r, n, o) }) } return o = o ? o.then(n, n) : n() } var o; this._invoke = r
        } function c(e, t, r) { var o = S; return function (i, s) { if (o === O) throw new Error("Generator is already running"); if (o === N) { if ("throw" === i) throw s; return m() } for (r.method = i, r.arg = s; ;) { var a = r.delegate; if (a) { var u = l(a, r); if (u) { if (u === k) continue; return u } } if ("next" === r.method) r.sent = r._sent = r.arg; else if ("throw" === r.method) { if (o === S) throw o = N, r.arg; r.dispatchException(r.arg) } else "return" === r.method && r.abrupt("return", r.arg); o = O; var c = n(e, t, r); if ("normal" === c.type) { if (o = r.done ? N : j, c.arg === k) continue; return { value: c.arg, done: r.done } } "throw" === c.type && (o = N, r.method = "throw", r.arg = c.arg) } } } function l(e, t) { var r = e.iterator[t.method]; if (r === b) { if (t.delegate = null, "throw" === t.method) { if (e.iterator.return && (t.method = "return", t.arg = b, l(e, t), "throw" === t.method)) return k; t.method = "throw", t.arg = new TypeError("The iterator does not provide a 'throw' method") } return k } var o = n(r, e.iterator, t.arg); if ("throw" === o.type) return t.method = "throw", t.arg = o.arg, t.delegate = null, k; var i = o.arg; return i ? i.done ? (t[e.resultName] = i.value, t.next = e.nextLoc, "return" !== t.method && (t.method = "next", t.arg = b), t.delegate = null, k) : i : (t.method = "throw", t.arg = new TypeError("iterator result is not an object"), t.delegate = null, k) } function f(e) { var t = { tryLoc: e[0] }; 1 in e && (t.catchLoc = e[1]), 2 in e && (t.finallyLoc = e[2], t.afterLoc = e[3]), this.tryEntries.push(t) } function p(e) { var t = e.completion || {}; t.type = "normal", delete t.arg, e.completion = t } function h(e) { this.tryEntries = [{ tryLoc: "root" }], e.forEach(f, this), this.reset(!0) } function d(e) { if (e) { var t = e[_]; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var r = -1, n = function t() { for (; ++r < e.length;)if (g.call(e, r)) return t.value = e[r], t.done = !1, t; return t.value = b, t.done = !0, t }; return n.next = n } } return { next: m } } function m() { return { value: b, done: !0 } } var b, y = Object.prototype, g = y.hasOwnProperty, v = "function" == typeof Symbol ? Symbol : {}, _ = v.iterator || "@@iterator", w = v.asyncIterator || "@@asyncIterator", x = v.toStringTag || "@@toStringTag", E = "object" == typeof t, T = e.regeneratorRuntime; if (T) return void (E && (t.exports = T)); T = e.regeneratorRuntime = E ? t.exports : {}, T.wrap = r; var S = "suspendedStart", j = "suspendedYield", O = "executing", N = "completed", k = {}, I = {}; I[_] = function () { return this }; var C = Object.getPrototypeOf, A = C && C(C(d([]))); A && A !== y && g.call(A, _) && (I = A); var D = s.prototype = o.prototype = Object.create(I); i.prototype = D.constructor = s, s.constructor = i, s[x] = i.displayName = "GeneratorFunction", T.isGeneratorFunction = function (e) { var t = "function" == typeof e && e.constructor; return !!t && (t === i || "GeneratorFunction" === (t.displayName || t.name)) }, T.mark = function (e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, s) : (e.__proto__ = s, x in e || (e[x] = "GeneratorFunction")), e.prototype = Object.create(D), e }, T.awrap = function (e) { return { __await: e } }, a(u.prototype), u.prototype[w] = function () { return this }, T.AsyncIterator = u, T.async = function (e, t, n, o) { var i = new u(r(e, t, n, o)); return T.isGeneratorFunction(t) ? i : i.next().then(function (e) { return e.done ? e.value : i.next() }) }, a(D), D[x] = "Generator", D[_] = function () { return this }, D.toString = function () { return "[object Generator]" }, T.keys = function (e) { var t = []; for (var r in e) t.push(r); return t.reverse(), function r() { for (; t.length;) { var n = t.pop(); if (n in e) return r.value = n, r.done = !1, r } return r.done = !0, r } }, T.values = d, h.prototype = { constructor: h, reset: function (e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = b, this.done = !1, this.delegate = null, this.method = "next", this.arg = b, this.tryEntries.forEach(p), !e) for (var t in this) "t" === t.charAt(0) && g.call(this, t) && !isNaN(+t.slice(1)) && (this[t] = b) }, stop: function () { this.done = !0; var e = this.tryEntries[0], t = e.completion; if ("throw" === t.type) throw t.arg; return this.rval }, dispatchException: function (e) { function t(t, n) { return i.type = "throw", i.arg = e, r.next = t, n && (r.method = "next", r.arg = b), !!n } if (this.done) throw e; for (var r = this, n = this.tryEntries.length - 1; n >= 0; --n) { var o = this.tryEntries[n], i = o.completion; if ("root" === o.tryLoc) return t("end"); if (o.tryLoc <= this.prev) { var s = g.call(o, "catchLoc"), a = g.call(o, "finallyLoc"); if (s && a) { if (this.prev < o.catchLoc) return t(o.catchLoc, !0); if (this.prev < o.finallyLoc) return t(o.finallyLoc) } else if (s) { if (this.prev < o.catchLoc) return t(o.catchLoc, !0) } else { if (!a) throw new Error("try statement without catch or finally"); if (this.prev < o.finallyLoc) return t(o.finallyLoc) } } } }, abrupt: function (e, t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var n = this.tryEntries[r]; if (n.tryLoc <= this.prev && g.call(n, "finallyLoc") && this.prev < n.finallyLoc) { var o = n; break } } o && ("break" === e || "continue" === e) && o.tryLoc <= t && t <= o.finallyLoc && (o = null); var i = o ? o.completion : {}; return i.type = e, i.arg = t, o ? (this.method = "next", this.next = o.finallyLoc, k) : this.complete(i) }, complete: function (e, t) { if ("throw" === e.type) throw e.arg; return "break" === e.type || "continue" === e.type ? this.next = e.arg : "return" === e.type ? (this.rval = this.arg = e.arg, this.method = "return", this.next = "end") : "normal" === e.type && t && (this.next = t), k }, finish: function (e) { for (var t = this.tryEntries.length - 1; t >= 0; --t) { var r = this.tryEntries[t]; if (r.finallyLoc === e) return this.complete(r.completion, r.afterLoc), p(r), k } }, catch: function (e) { for (var t = this.tryEntries.length - 1; t >= 0; --t) { var r = this.tryEntries[t]; if (r.tryLoc === e) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; p(r) } return o } } throw new Error("illegal catch attempt") }, delegateYield: function (e, t, r) { return this.delegate = { iterator: d(e), resultName: t, nextLoc: r }, "next" === this.method && (this.arg = b), k } }
      }(function () { return this }() || Function("return this")())
    }, {}], 228: [function (e, t, r) { function n(e, t) { for (var r in e) t[r] = e[r] } function o(e, t, r) { return s(e, t, r) } var i = e("buffer"), s = i.Buffer; s.from && s.alloc && s.allocUnsafe && s.allocUnsafeSlow ? t.exports = i : (n(i, r), r.Buffer = o), n(s, o), o.from = function (e, t, r) { if ("number" == typeof e) throw new TypeError("Argument must not be a number"); return s(e, t, r) }, o.alloc = function (e, t, r) { if ("number" != typeof e) throw new TypeError("Argument must be a number"); var n = s(e); return void 0 !== t ? "string" == typeof r ? n.fill(t, r) : n.fill(t) : n.fill(0), n }, o.allocUnsafe = function (e) { if ("number" != typeof e) throw new TypeError("Argument must be a number"); return s(e) }, o.allocUnsafeSlow = function (e) { if ("number" != typeof e) throw new TypeError("Argument must be a number"); return i.SlowBuffer(e) } }, { buffer: 73 }], 229: [function (e, t, r) { (function (t) { "use strict"; function n(e) { return e && e.__esModule ? e : { default: e } } var o = e("babel-runtime/core-js/string/from-code-point"), i = n(o), s = e("babel-runtime/core-js/json/stringify"), a = n(s), u = e("babel-runtime/helpers/typeof"), c = n(u), l = e("babel-runtime/core-js/object/define-property"), f = n(l), p = e("babel-runtime/core-js/object/keys"), h = n(p), d = e("babel-runtime/core-js/object/create"), m = n(d); !function (r) { function n(e, t) { if (!(this instanceof n)) return new n(e, t); var o = this; s(o), o.q = o.c = "", o.bufferCheckPosition = r.MAX_BUFFER_LENGTH, o.opt = t || {}, o.opt.lowercase = o.opt.lowercase || o.opt.lowercasetags, o.looseCase = o.opt.lowercase ? "toLowerCase" : "toUpperCase", o.tags = [], o.closed = o.closedRoot = o.sawRoot = !1, o.tag = o.error = null, o.strict = !!e, o.noscript = !(!e && !o.opt.noscript), o.state = K.BEGIN, o.strictEntities = o.opt.strictEntities, o.ENTITIES = o.strictEntities ? (0, m.default)(r.XML_ENTITIES) : (0, m.default)(r.ENTITIES), o.attribList = [], o.opt.xmlns && (o.ns = (0, m.default)(G)), o.trackPosition = !1 !== o.opt.position, o.trackPosition && (o.position = o.line = o.column = 0), _(o, "onready") } function o(e) { for (var t = Math.max(r.MAX_BUFFER_LENGTH, 10), n = 0, o = 0, i = L.length; o < i; o++) { var s = e[L[o]].length; if (s > t) switch (L[o]) { case "textNode": x(e); break; case "cdata": w(e, "oncdata", e.cdata), e.cdata = ""; break; case "script": w(e, "onscript", e.script), e.script = ""; break; default: T(e, "Max buffer length exceeded: " + L[o]) }n = Math.max(n, s) } var a = r.MAX_BUFFER_LENGTH - n; e.bufferCheckPosition = a + e.position } function s(e) { for (var t = 0, r = L.length; t < r; t++)e[L[t]] = "" } function u(e) { x(e), "" !== e.cdata && (w(e, "oncdata", e.cdata), e.cdata = ""), "" !== e.script && (w(e, "onscript", e.script), e.script = "") } function l(e, t) { return new p(e, t) } function p(e, t) { if (!(this instanceof p)) return new p(e, t); R.apply(this), this._parser = new n(e, t), this.writable = !0, this.readable = !0; var r = this; this._parser.onend = function () { r.emit("end") }, this._parser.onerror = function (e) { r.emit("error", e), r._parser.error = null }, this._decoder = null, B.forEach(function (e) { (0, f.default)(r, "on" + e, { get: function () { return r._parser["on" + e] }, set: function (t) { if (!t) return r.removeAllListeners(e), r._parser["on" + e] = t, t; r.on(e, t) }, enumerable: !0, configurable: !1 }) }) } function d(e) { return " " === e || "\n" === e || "\r" === e || "\t" === e } function b(e) { return '"' === e || "'" === e } function y(e) { return ">" === e || d(e) } function g(e, t) { return e.test(t) } function v(e, t) { return !g(e, t) } function _(e, t, r) { e[t] && e[t](r) } function w(e, t, r) { e.textNode && x(e), _(e, t, r) } function x(e) { e.textNode = E(e.opt, e.textNode), e.textNode && _(e, "ontext", e.textNode), e.textNode = "" } function E(e, t) { return e.trim && (t = t.trim()), e.normalize && (t = t.replace(/\s+/g, " ")), t } function T(e, t) { return x(e), e.trackPosition && (t += "\nLine: " + e.line + "\nColumn: " + e.column + "\nChar: " + e.c), t = new Error(t), e.error = t, _(e, "onerror", t), e } function S(e) { return e.sawRoot && !e.closedRoot && j(e, "Unclosed root tag"), e.state !== K.BEGIN && e.state !== K.BEGIN_WHITESPACE && e.state !== K.TEXT && T(e, "Unexpected end"), x(e), e.c = "", e.closed = !0, _(e, "onend"), n.call(e, e.strict, e.opt), e } function j(e, t) { if ("object" !== (void 0 === e ? "undefined" : (0, c.default)(e)) || !(e instanceof n)) throw new Error("bad call to strictFail"); e.strict && T(e, t) } function O(e) { e.strict || (e.tagName = e.tagName[e.looseCase]()); var t = e.tags[e.tags.length - 1] || e, r = e.tag = { name: e.tagName, attributes: {} }; e.opt.xmlns && (r.ns = t.ns), e.attribList.length = 0, w(e, "onopentagstart", r) } function N(e, t) { var r = e.indexOf(":"), n = r < 0 ? ["", e] : e.split(":"), o = n[0], i = n[1]; return t && "xmlns" === e && (o = "xmlns", i = ""), { prefix: o, local: i } } function k(e) { if (e.strict || (e.attribName = e.attribName[e.looseCase]()), -1 !== e.attribList.indexOf(e.attribName) || e.tag.attributes.hasOwnProperty(e.attribName)) return void (e.attribName = e.attribValue = ""); if (e.opt.xmlns) { var t = N(e.attribName, !0), r = t.prefix, n = t.local; if ("xmlns" === r) if ("xml" === n && e.attribValue !== q) j(e, "xml: prefix must be bound to " + q + "\nActual: " + e.attribValue); else if ("xmlns" === n && e.attribValue !== X) j(e, "xmlns: prefix must be bound to " + X + "\nActual: " + e.attribValue); else { var o = e.tag, i = e.tags[e.tags.length - 1] || e; o.ns === i.ns && (o.ns = (0, m.default)(i.ns)), o.ns[n] = e.attribValue } e.attribList.push([e.attribName, e.attribValue]) } else e.tag.attributes[e.attribName] = e.attribValue, w(e, "onattribute", { name: e.attribName, value: e.attribValue }); e.attribName = e.attribValue = "" } function I(e, t) { if (e.opt.xmlns) { var r = e.tag, n = N(e.tagName); r.prefix = n.prefix, r.local = n.local, r.uri = r.ns[n.prefix] || "", r.prefix && !r.uri && (j(e, "Unbound namespace prefix: " + (0, a.default)(e.tagName)), r.uri = n.prefix); var o = e.tags[e.tags.length - 1] || e; r.ns && o.ns !== r.ns && (0, h.default)(r.ns).forEach(function (t) { w(e, "onopennamespace", { prefix: t, uri: r.ns[t] }) }); for (var i = 0, s = e.attribList.length; i < s; i++) { var u = e.attribList[i], c = u[0], l = u[1], f = N(c, !0), p = f.prefix, d = f.local, m = "" === p ? "" : r.ns[p] || "", b = { name: c, value: l, prefix: p, local: d, uri: m }; p && "xmlns" !== p && !m && (j(e, "Unbound namespace prefix: " + (0, a.default)(p)), b.uri = p), e.tag.attributes[c] = b, w(e, "onattribute", b) } e.attribList.length = 0 } e.tag.isSelfClosing = !!t, e.sawRoot = !0, e.tags.push(e.tag), w(e, "onopentag", e.tag), t || (e.noscript || "script" !== e.tagName.toLowerCase() ? e.state = K.TEXT : e.state = K.SCRIPT, e.tag = null, e.tagName = ""), e.attribName = e.attribValue = "", e.attribList.length = 0 } function C(e) { if (!e.tagName) return j(e, "Weird empty close tag."), e.textNode += "</>", void (e.state = K.TEXT); if (e.script) { if ("script" !== e.tagName) return e.script += "</" + e.tagName + ">", e.tagName = "", void (e.state = K.SCRIPT); w(e, "onscript", e.script), e.script = "" } var t = e.tags.length, r = e.tagName; e.strict || (r = r[e.looseCase]()); for (var n = r; t--;) { if (e.tags[t].name === n) break; j(e, "Unexpected close tag") } if (t < 0) return j(e, "Unmatched closing tag: " + e.tagName), e.textNode += "</" + e.tagName + ">", void (e.state = K.TEXT); e.tagName = r; for (var o = e.tags.length; o-- > t;) { var i = e.tag = e.tags.pop(); e.tagName = e.tag.name, w(e, "onclosetag", e.tagName); var s = {}; for (var a in i.ns) s[a] = i.ns[a]; var u = e.tags[e.tags.length - 1] || e; e.opt.xmlns && i.ns !== u.ns && (0, h.default)(i.ns).forEach(function (t) { var r = i.ns[t]; w(e, "onclosenamespace", { prefix: t, uri: r }) }) } 0 === t && (e.closedRoot = !0), e.tagName = e.attribValue = e.attribName = "", e.attribList.length = 0, e.state = K.TEXT } function A(e) { var t, r = e.entity, n = r.toLowerCase(), o = ""; return e.ENTITIES[r] ? e.ENTITIES[r] : e.ENTITIES[n] ? e.ENTITIES[n] : (r = n, "#" === r.charAt(0) && ("x" === r.charAt(1) ? (r = r.slice(2), t = parseInt(r, 16), o = t.toString(16)) : (r = r.slice(1), t = parseInt(r, 10), o = t.toString(10))), r = r.replace(/^0+/, ""), isNaN(t) || o.toLowerCase() !== r ? (j(e, "Invalid character entity"), "&" + e.entity + ";") : (0, i.default)(t)) } function D(e, t) { "<" === t ? (e.state = K.OPEN_WAKA, e.startTagPosition = e.position) : d(t) || (j(e, "Non-whitespace before first tag."), e.textNode = t, e.state = K.TEXT) } function M(e, t) { var r = ""; return t < e.length && (r = e.charAt(t)), r } function P(e) { var t = this; if (this.error) throw this.error; if (t.closed) return T(t, "Cannot write after close. Assign an onready handler."); if (null === e) return S(t); "object" === (void 0 === e ? "undefined" : (0, c.default)(e)) && (e = e.toString()); for (var r = 0, n = ""; ;) { if (n = M(e, r++), t.c = n, !n) break; switch (t.trackPosition && (t.position++, "\n" === n ? (t.line++, t.column = 0) : t.column++), t.state) { case K.BEGIN: if (t.state = K.BEGIN_WHITESPACE, "\ufeff" === n) continue; D(t, n); continue; case K.BEGIN_WHITESPACE: D(t, n); continue; case K.TEXT: if (t.sawRoot && !t.closedRoot) { for (var i = r - 1; n && "<" !== n && "&" !== n;)(n = M(e, r++)) && t.trackPosition && (t.position++, "\n" === n ? (t.line++, t.column = 0) : t.column++); t.textNode += e.substring(i, r - 1) } "<" !== n || t.sawRoot && t.closedRoot && !t.strict ? (d(n) || t.sawRoot && !t.closedRoot || j(t, "Text data outside of root node."), "&" === n ? t.state = K.TEXT_ENTITY : t.textNode += n) : (t.state = K.OPEN_WAKA, t.startTagPosition = t.position); continue; case K.SCRIPT: "<" === n ? t.state = K.SCRIPT_ENDING : t.script += n; continue; case K.SCRIPT_ENDING: "/" === n ? t.state = K.CLOSE_TAG : (t.script += "<" + n, t.state = K.SCRIPT); continue; case K.OPEN_WAKA: if ("!" === n) t.state = K.SGML_DECL, t.sgmlDecl = ""; else if (d(n)); else if (g(z, n)) t.state = K.OPEN_TAG, t.tagName = n; else if ("/" === n) t.state = K.CLOSE_TAG, t.tagName = ""; else if ("?" === n) t.state = K.PROC_INST, t.procInstName = t.procInstBody = ""; else { if (j(t, "Unencoded <"), t.startTagPosition + 1 < t.position) { var s = t.position - t.startTagPosition; n = new Array(s).join(" ") + n } t.textNode += "<" + n, t.state = K.TEXT } continue; case K.SGML_DECL: (t.sgmlDecl + n).toUpperCase() === F ? (w(t, "onopencdata"), t.state = K.CDATA, t.sgmlDecl = "", t.cdata = "") : t.sgmlDecl + n === "--" ? (t.state = K.COMMENT, t.comment = "", t.sgmlDecl = "") : (t.sgmlDecl + n).toUpperCase() === U ? (t.state = K.DOCTYPE, (t.doctype || t.sawRoot) && j(t, "Inappropriately located doctype declaration"), t.doctype = "", t.sgmlDecl = "") : ">" === n ? (w(t, "onsgmldeclaration", t.sgmlDecl), t.sgmlDecl = "", t.state = K.TEXT) : b(n) ? (t.state = K.SGML_DECL_QUOTED, t.sgmlDecl += n) : t.sgmlDecl += n; continue; case K.SGML_DECL_QUOTED: n === t.q && (t.state = K.SGML_DECL, t.q = ""), t.sgmlDecl += n; continue; case K.DOCTYPE: ">" === n ? (t.state = K.TEXT, w(t, "ondoctype", t.doctype), t.doctype = !0) : (t.doctype += n, "[" === n ? t.state = K.DOCTYPE_DTD : b(n) && (t.state = K.DOCTYPE_QUOTED, t.q = n)); continue; case K.DOCTYPE_QUOTED: t.doctype += n, n === t.q && (t.q = "", t.state = K.DOCTYPE); continue; case K.DOCTYPE_DTD: t.doctype += n, "]" === n ? t.state = K.DOCTYPE : b(n) && (t.state = K.DOCTYPE_DTD_QUOTED, t.q = n); continue; case K.DOCTYPE_DTD_QUOTED: t.doctype += n, n === t.q && (t.state = K.DOCTYPE_DTD, t.q = ""); continue; case K.COMMENT: "-" === n ? t.state = K.COMMENT_ENDING : t.comment += n; continue; case K.COMMENT_ENDING: "-" === n ? (t.state = K.COMMENT_ENDED, t.comment = E(t.opt, t.comment), t.comment && w(t, "oncomment", t.comment), t.comment = "") : (t.comment += "-" + n, t.state = K.COMMENT); continue; case K.COMMENT_ENDED: ">" !== n ? (j(t, "Malformed comment"), t.comment += "--" + n, t.state = K.COMMENT) : t.state = K.TEXT; continue; case K.CDATA: "]" === n ? t.state = K.CDATA_ENDING : t.cdata += n; continue; case K.CDATA_ENDING: "]" === n ? t.state = K.CDATA_ENDING_2 : (t.cdata += "]" + n, t.state = K.CDATA); continue; case K.CDATA_ENDING_2: ">" === n ? (t.cdata && w(t, "oncdata", t.cdata), w(t, "onclosecdata"), t.cdata = "", t.state = K.TEXT) : "]" === n ? t.cdata += "]" : (t.cdata += "]]" + n, t.state = K.CDATA); continue; case K.PROC_INST: "?" === n ? t.state = K.PROC_INST_ENDING : d(n) ? t.state = K.PROC_INST_BODY : t.procInstName += n; continue; case K.PROC_INST_BODY: if (!t.procInstBody && d(n)) continue; "?" === n ? t.state = K.PROC_INST_ENDING : t.procInstBody += n; continue; case K.PROC_INST_ENDING: ">" === n ? (w(t, "onprocessinginstruction", { name: t.procInstName, body: t.procInstBody }), t.procInstName = t.procInstBody = "", t.state = K.TEXT) : (t.procInstBody += "?" + n, t.state = K.PROC_INST_BODY); continue; case K.OPEN_TAG: g(V, n) ? t.tagName += n : (O(t), ">" === n ? I(t) : "/" === n ? t.state = K.OPEN_TAG_SLASH : (d(n) || j(t, "Invalid character in tag name"), t.state = K.ATTRIB)); continue; case K.OPEN_TAG_SLASH: ">" === n ? (I(t, !0), C(t)) : (j(t, "Forward-slash in opening tag not followed by >"), t.state = K.ATTRIB); continue; case K.ATTRIB: if (d(n)) continue; ">" === n ? I(t) : "/" === n ? t.state = K.OPEN_TAG_SLASH : g(z, n) ? (t.attribName = n, t.attribValue = "", t.state = K.ATTRIB_NAME) : j(t, "Invalid attribute name"); continue; case K.ATTRIB_NAME: "=" === n ? t.state = K.ATTRIB_VALUE : ">" === n ? (j(t, "Attribute without value"), t.attribValue = t.attribName, k(t), I(t)) : d(n) ? t.state = K.ATTRIB_NAME_SAW_WHITE : g(V, n) ? t.attribName += n : j(t, "Invalid attribute name"); continue; case K.ATTRIB_NAME_SAW_WHITE: if ("=" === n) t.state = K.ATTRIB_VALUE; else { if (d(n)) continue; j(t, "Attribute without value"), t.tag.attributes[t.attribName] = "", t.attribValue = "", w(t, "onattribute", { name: t.attribName, value: "" }), t.attribName = "", ">" === n ? I(t) : g(z, n) ? (t.attribName = n, t.state = K.ATTRIB_NAME) : (j(t, "Invalid attribute name"), t.state = K.ATTRIB) } continue; case K.ATTRIB_VALUE: if (d(n)) continue; b(n) ? (t.q = n, t.state = K.ATTRIB_VALUE_QUOTED) : (j(t, "Unquoted attribute value"), t.state = K.ATTRIB_VALUE_UNQUOTED, t.attribValue = n); continue; case K.ATTRIB_VALUE_QUOTED: if (n !== t.q) { "&" === n ? t.state = K.ATTRIB_VALUE_ENTITY_Q : t.attribValue += n; continue } k(t), t.q = "", t.state = K.ATTRIB_VALUE_CLOSED; continue; case K.ATTRIB_VALUE_CLOSED: d(n) ? t.state = K.ATTRIB : ">" === n ? I(t) : "/" === n ? t.state = K.OPEN_TAG_SLASH : g(z, n) ? (j(t, "No whitespace between attributes"), t.attribName = n, t.attribValue = "", t.state = K.ATTRIB_NAME) : j(t, "Invalid attribute name"); continue; case K.ATTRIB_VALUE_UNQUOTED: if (!y(n)) { "&" === n ? t.state = K.ATTRIB_VALUE_ENTITY_U : t.attribValue += n; continue } k(t), ">" === n ? I(t) : t.state = K.ATTRIB; continue; case K.CLOSE_TAG: if (t.tagName) ">" === n ? C(t) : g(V, n) ? t.tagName += n : t.script ? (t.script += "</" + t.tagName, t.tagName = "", t.state = K.SCRIPT) : (d(n) || j(t, "Invalid tagname in closing tag"), t.state = K.CLOSE_TAG_SAW_WHITE); else { if (d(n)) continue; v(z, n) ? t.script ? (t.script += "</" + n, t.state = K.SCRIPT) : j(t, "Invalid tagname in closing tag.") : t.tagName = n } continue; case K.CLOSE_TAG_SAW_WHITE: if (d(n)) continue; ">" === n ? C(t) : j(t, "Invalid characters in closing tag"); continue; case K.TEXT_ENTITY: case K.ATTRIB_VALUE_ENTITY_Q: case K.ATTRIB_VALUE_ENTITY_U: var a, u; switch (t.state) { case K.TEXT_ENTITY: a = K.TEXT, u = "textNode"; break; case K.ATTRIB_VALUE_ENTITY_Q: a = K.ATTRIB_VALUE_QUOTED, u = "attribValue"; break; case K.ATTRIB_VALUE_ENTITY_U: a = K.ATTRIB_VALUE_UNQUOTED, u = "attribValue" }";" === n ? (t[u] += A(t), t.entity = "", t.state = a) : g(t.entity.length ? W : H, n) ? t.entity += n : (j(t, "Invalid character in entity name"), t[u] += "&" + t.entity + n, t.entity = "", t.state = a); continue; default: throw new Error(t, "Unknown state: " + t.state) } } return t.position >= t.bufferCheckPosition && o(t), t } r.parser = function (e, t) { return new n(e, t) }, r.SAXParser = n, r.SAXStream = p, r.createStream = l, r.MAX_BUFFER_LENGTH = 65536; var L = ["comment", "sgmlDecl", "textNode", "tagName", "doctype", "procInstName", "procInstBody", "entity", "attribName", "attribValue", "cdata", "script"]; r.EVENTS = ["text", "processinginstruction", "sgmldeclaration", "doctype", "comment", "opentagstart", "attribute", "opentag", "closetag", "opencdata", "cdata", "closecdata", "error", "end", "ready", "script", "opennamespace", "closenamespace"], m.default || (Object.create = function (e) { function t() { } return t.prototype = e, new t }), h.default || (Object.keys = function (e) { var t = []; for (var r in e) e.hasOwnProperty(r) && t.push(r); return t }), n.prototype = { end: function () { S(this) }, write: P, resume: function () { return this.error = null, this }, close: function () { return this.write(null) }, flush: function () { u(this) } }; var R; try { R = e("stream").Stream } catch (e) { R = function () { } } var B = r.EVENTS.filter(function (e) { return "error" !== e && "end" !== e }); p.prototype = (0, m.default)(R.prototype, { constructor: { value: p } }), p.prototype.write = function (r) { if ("function" == typeof t && "function" == typeof t.isBuffer && t.isBuffer(r)) { if (!this._decoder) { var n = e("string_decoder").StringDecoder; this._decoder = new n("utf8") } r = this._decoder.write(r) } return this._parser.write(r.toString()), this.emit("data", r), !0 }, p.prototype.end = function (e) { return e && e.length && this.write(e), this._parser.end(), !0 }, p.prototype.on = function (e, t) { var r = this; return r._parser["on" + e] || -1 === B.indexOf(e) || (r._parser["on" + e] = function () { var t = 1 === arguments.length ? [arguments[0]] : Array.apply(null, arguments); t.splice(0, 0, e), r.emit.apply(r, t) }), R.prototype.on.call(r, e, t) }; var F = "[CDATA[", U = "DOCTYPE", q = "http://www.w3.org/XML/1998/namespace", X = "http://www.w3.org/2000/xmlns/", G = { xml: q, xmlns: X }, z = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, V = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, H = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, W = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, K = 0; r.STATE = { BEGIN: K++, BEGIN_WHITESPACE: K++, TEXT: K++, TEXT_ENTITY: K++, OPEN_WAKA: K++, SGML_DECL: K++, SGML_DECL_QUOTED: K++, DOCTYPE: K++, DOCTYPE_QUOTED: K++, DOCTYPE_DTD: K++, DOCTYPE_DTD_QUOTED: K++, COMMENT_STARTING: K++, COMMENT: K++, COMMENT_ENDING: K++, COMMENT_ENDED: K++, CDATA: K++, CDATA_ENDING: K++, CDATA_ENDING_2: K++, PROC_INST: K++, PROC_INST_BODY: K++, PROC_INST_ENDING: K++, OPEN_TAG: K++, OPEN_TAG_SLASH: K++, ATTRIB: K++, ATTRIB_NAME: K++, ATTRIB_NAME_SAW_WHITE: K++, ATTRIB_VALUE: K++, ATTRIB_VALUE_QUOTED: K++, ATTRIB_VALUE_CLOSED: K++, ATTRIB_VALUE_UNQUOTED: K++, ATTRIB_VALUE_ENTITY_Q: K++, ATTRIB_VALUE_ENTITY_U: K++, CLOSE_TAG: K++, CLOSE_TAG_SAW_WHITE: K++, SCRIPT: K++, SCRIPT_ENDING: K++ }, r.XML_ENTITIES = { amp: "&", gt: ">", lt: "<", quot: '"', apos: "'" }, r.ENTITIES = { amp: "&", gt: ">", lt: "<", quot: '"', apos: "'", AElig: 198, Aacute: 193, Acirc: 194, Agrave: 192, Aring: 197, Atilde: 195, Auml: 196, Ccedil: 199, ETH: 208, Eacute: 201, Ecirc: 202, Egrave: 200, Euml: 203, Iacute: 205, Icirc: 206, Igrave: 204, Iuml: 207, Ntilde: 209, Oacute: 211, Ocirc: 212, Ograve: 210, Oslash: 216, Otilde: 213, Ouml: 214, THORN: 222, Uacute: 218, Ucirc: 219, Ugrave: 217, Uuml: 220, Yacute: 221, aacute: 225, acirc: 226, aelig: 230, agrave: 224, aring: 229, atilde: 227, auml: 228, ccedil: 231, eacute: 233, ecirc: 234, egrave: 232, eth: 240, euml: 235, iacute: 237, icirc: 238, igrave: 236, iuml: 239, ntilde: 241, oacute: 243, ocirc: 244, ograve: 242, oslash: 248, otilde: 245, ouml: 246, szlig: 223, thorn: 254, uacute: 250, ucirc: 251, ugrave: 249, uuml: 252, yacute: 253, yuml: 255, copy: 169, reg: 174, nbsp: 160, iexcl: 161, cent: 162, pound: 163, curren: 164, yen: 165, brvbar: 166, sect: 167, uml: 168, ordf: 170, laquo: 171, not: 172, shy: 173, macr: 175, deg: 176, plusmn: 177, sup1: 185, sup2: 178, sup3: 179, acute: 180, micro: 181, para: 182, middot: 183, cedil: 184, ordm: 186, raquo: 187, frac14: 188, frac12: 189, frac34: 190, iquest: 191, times: 215, divide: 247, OElig: 338, oelig: 339, Scaron: 352, scaron: 353, Yuml: 376, fnof: 402, circ: 710, tilde: 732, Alpha: 913, Beta: 914, Gamma: 915, Delta: 916, Epsilon: 917, Zeta: 918, Eta: 919, Theta: 920, Iota: 921, Kappa: 922, Lambda: 923, Mu: 924, Nu: 925, Xi: 926, Omicron: 927, Pi: 928, Rho: 929, Sigma: 931, Tau: 932, Upsilon: 933, Phi: 934, Chi: 935, Psi: 936, Omega: 937, alpha: 945, beta: 946, gamma: 947, delta: 948, epsilon: 949, zeta: 950, eta: 951, theta: 952, iota: 953, kappa: 954, lambda: 955, mu: 956, nu: 957, xi: 958, omicron: 959, pi: 960, rho: 961, sigmaf: 962, sigma: 963, tau: 964, upsilon: 965, phi: 966, chi: 967, psi: 968, omega: 969, thetasym: 977, upsih: 978, piv: 982, ensp: 8194, emsp: 8195, thinsp: 8201, zwnj: 8204, zwj: 8205, lrm: 8206, rlm: 8207, ndash: 8211, mdash: 8212, lsquo: 8216, rsquo: 8217, sbquo: 8218, ldquo: 8220, rdquo: 8221, bdquo: 8222, dagger: 8224, Dagger: 8225, bull: 8226, hellip: 8230, permil: 8240, prime: 8242, Prime: 8243, lsaquo: 8249, rsaquo: 8250, oline: 8254, frasl: 8260, euro: 8364, image: 8465, weierp: 8472, real: 8476, trade: 8482, alefsym: 8501, larr: 8592, uarr: 8593, rarr: 8594, darr: 8595, harr: 8596, crarr: 8629, lArr: 8656, uArr: 8657, rArr: 8658, dArr: 8659, hArr: 8660, forall: 8704, part: 8706, exist: 8707, empty: 8709, nabla: 8711, isin: 8712, notin: 8713, ni: 8715, prod: 8719, sum: 8721, minus: 8722, lowast: 8727, radic: 8730, prop: 8733, infin: 8734, ang: 8736, and: 8743, or: 8744, cap: 8745, cup: 8746, int: 8747, there4: 8756, sim: 8764, cong: 8773, asymp: 8776, ne: 8800, equiv: 8801, le: 8804, ge: 8805, sub: 8834, sup: 8835, nsub: 8836, sube: 8838, supe: 8839, oplus: 8853, otimes: 8855, perp: 8869, sdot: 8901, lceil: 8968, rceil: 8969, lfloor: 8970, rfloor: 8971, lang: 9001, rang: 9002, loz: 9674, spades: 9824, clubs: 9827, hearts: 9829, diams: 9830 }, (0, h.default)(r.ENTITIES).forEach(function (e) { var t = r.ENTITIES[e], n = "number" == typeof t ? String.fromCharCode(t) : t; r.ENTITIES[e] = n }); for (var Y in r.STATE) r.STATE[r.STATE[Y]] = Y; K = r.STATE, i.default || function () { var e = String.fromCharCode, t = Math.floor, r = function () { var r, n, o = [], i = -1, s = arguments.length; if (!s) return ""; for (var a = ""; ++i < s;) { var u = Number(arguments[i]); if (!isFinite(u) || u < 0 || u > 1114111 || t(u) !== u) throw RangeError("Invalid code point: " + u); u <= 65535 ? o.push(u) : (u -= 65536, r = 55296 + (u >> 10), n = u % 1024 + 56320, o.push(r, n)), (i + 1 === s || o.length > 16384) && (a += e.apply(null, o), o.length = 0) } return a }; f.default ? Object.defineProperty(String, "fromCodePoint", { value: r, configurable: !0, writable: !0 }) : String.fromCodePoint = r }() }(void 0 === r ? (void 0).sax = {} : r) }).call(this, e("buffer").Buffer) }, { "babel-runtime/core-js/json/stringify": 53, "babel-runtime/core-js/object/create": 55, "babel-runtime/core-js/object/define-property": 56, "babel-runtime/core-js/object/keys": 60, "babel-runtime/core-js/string/from-code-point": 63, "babel-runtime/helpers/typeof": 67, buffer: 73, stream: 230, string_decoder: 72 }], 230: [function (e, t, r) { function n() { o.call(this) } t.exports = n; var o = e("events").EventEmitter; e("inherits")(n, o), n.Readable = e("readable-stream/readable.js"), n.Writable = e("readable-stream/writable.js"), n.Duplex = e("readable-stream/duplex.js"), n.Transform = e("readable-stream/transform.js"), n.PassThrough = e("readable-stream/passthrough.js"), n.Stream = n, n.prototype.pipe = function (e, t) { function r(t) { e.writable && !1 === e.write(t) && c.pause && c.pause() } function n() { c.readable && c.resume && c.resume() } function i() { l || (l = !0, e.end()) } function s() { l || (l = !0, "function" == typeof e.destroy && e.destroy()) } function a(e) { if (u(), 0 === o.listenerCount(this, "error")) throw e } function u() { c.removeListener("data", r), e.removeListener("drain", n), c.removeListener("end", i), c.removeListener("close", s), c.removeListener("error", a), e.removeListener("error", a), c.removeListener("end", u), c.removeListener("close", u), e.removeListener("close", u) } var c = this; c.on("data", r), e.on("drain", n), e._isStdio || t && !1 === t.end || (c.on("end", i), c.on("close", s)); var l = !1; return c.on("error", a), e.on("error", a), c.on("end", u), c.on("close", u), e.on("close", u), e.emit("pipe", c), e } }, { events: 192, inherits: 196, "readable-stream/duplex.js": 213, "readable-stream/passthrough.js": 222, "readable-stream/readable.js": 223, "readable-stream/transform.js": 224, "readable-stream/writable.js": 225 }], 231: [function (e, t, r) { (function (t) { var n = e("./lib/request"), o = e("./lib/response"), i = e("xtend"), s = e("builtin-status-codes"), a = e("url"), u = r; u.request = function (e, r) { e = "string" == typeof e ? a.parse(e) : i(e); var o = -1 === t.location.protocol.search(/^https?:$/) ? "http:" : "", s = e.protocol || o, u = e.hostname || e.host, c = e.port, l = e.path || "/"; u && -1 !== u.indexOf(":") && (u = "[" + u + "]"), e.url = (u ? s + "//" + u : "") + (c ? ":" + c : "") + l, e.method = (e.method || "GET").toUpperCase(), e.headers = e.headers || {}; var f = new n(e); return r && f.on("response", r), f }, u.get = function (e, t) { var r = u.request(e, t); return r.end(), r }, u.ClientRequest = n, u.IncomingMessage = o.IncomingMessage, u.Agent = function () { }, u.Agent.defaultMaxSockets = 4, u.globalAgent = new u.Agent, u.STATUS_CODES = s, u.METHODS = ["CHECKOUT", "CONNECT", "COPY", "DELETE", "GET", "HEAD", "LOCK", "M-SEARCH", "MERGE", "MKACTIVITY", "MKCOL", "MOVE", "NOTIFY", "OPTIONS", "PATCH", "POST", "PROPFIND", "PROPPATCH", "PURGE", "PUT", "REPORT", "SEARCH", "SUBSCRIBE", "TRACE", "UNLOCK", "UNSUBSCRIBE"] }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}) }, { "./lib/request": 233, "./lib/response": 234, "builtin-status-codes": 74, url: 238, xtend: 283 }], 232: [function (e, t, r) { (function (e) { "use strict"; function t() { if (void 0 !== i) return i; if (e.XMLHttpRequest) { i = new e.XMLHttpRequest; try { i.open("GET", e.XDomainRequest ? "/" : "https://example.com") } catch (e) { i = null } } else i = null; return i } function n(e) { var r = t(); if (!r) return !1; try { return r.responseType = e, r.responseType === e } catch (e) { } return !1 } function o(e) { return "function" == typeof e } r.fetch = o(e.fetch) && o(e.ReadableStream), r.writableStream = o(e.WritableStream), r.abortController = o(e.AbortController), r.blobConstructor = !1; try { new Blob([new ArrayBuffer(1)]), r.blobConstructor = !0 } catch (e) { } var i, s = void 0 !== e.ArrayBuffer, a = s && o(e.ArrayBuffer.prototype.slice); r.arraybuffer = r.fetch || s && n("arraybuffer"), r.msstream = !r.fetch && a && n("ms-stream"), r.mozchunkedarraybuffer = !r.fetch && s && n("moz-chunked-arraybuffer"), r.overrideMimeType = r.fetch || !!t() && o(t().overrideMimeType), r.vbArray = o(e.VBArray), i = null }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}) }, {}], 233: [function (e, t, r) {
      (function (r, n, o) {
        "use strict"; function i(e, t) { return c.fetch && t ? "fetch" : c.mozchunkedarraybuffer ? "moz-chunked-arraybuffer" : c.msstream ? "ms-stream" : c.arraybuffer && e ? "arraybuffer" : c.vbArray && e ? "text:vbarray" : "text" } function s(e) { try { var t = e.status; return null !== t && 0 !== t } catch (e) { return !1 } } var a = e("babel-runtime/core-js/object/keys"), u = function (e) { return e && e.__esModule ? e : { default: e } }(a), c = e("./capability"), l = e("inherits"), f = e("./response"), p = e("readable-stream"), h = e("to-arraybuffer"), d = f.IncomingMessage, m = f.readyStates, b = t.exports = function (e) { var t = this; p.Writable.call(t), t._opts = e, t._body = [], t._headers = {}, e.auth && t.setHeader("Authorization", "Basic " + new o(e.auth).toString("base64")), (0, u.default)(e.headers).forEach(function (r) { t.setHeader(r, e.headers[r]) }); var r, n = !0; if ("disable-fetch" === e.mode || "requestTimeout" in e && !c.abortController) n = !1, r = !0; else if ("prefer-streaming" === e.mode) r = !1; else if ("allow-wrong-content-type" === e.mode) r = !c.overrideMimeType; else { if (e.mode && "default" !== e.mode && "prefer-fast" !== e.mode) throw new Error("Invalid value for opts.mode"); r = !0 } t._mode = i(r, n), t._fetchTimer = null, t.on("finish", function () { t._onFinish() }) }; l(b, p.Writable), b.prototype.setHeader = function (e, t) { var r = this, n = e.toLowerCase(); -1 === y.indexOf(n) && (r._headers[n] = { name: e, value: t }) }, b.prototype.getHeader = function (e) { var t = this._headers[e.toLowerCase()]; return t ? t.value : null }, b.prototype.removeHeader = function (e) { delete this._headers[e.toLowerCase()] }, b.prototype._onFinish = function () {
          var e = this; if (!e._destroyed) {
            var t = e._opts, i = e._headers, s = null; "GET" !== t.method && "HEAD" !== t.method && (s = c.arraybuffer ? h(o.concat(e._body)) : c.blobConstructor ? new n.Blob(e._body.map(function (e) { return h(e) }), { type: (i["content-type"] || {}).value || "" }) : o.concat(e._body).toString()); var a = []; if ((0, u.default)(i).forEach(function (e) { var t = i[e].name, r = i[e].value; Array.isArray(r) ? r.forEach(function (e) { a.push([t, e]) }) : a.push([t, r]) }), "fetch" === e._mode) {
              var l = null; if (c.abortController) {
                var f = new AbortController; l = f.signal, e._fetchAbortController = f, "requestTimeout" in t && 0 !== t.requestTimeout && (e._fetchTimer = n.setTimeout(function () {
                  e.emit("requestTimeout"),
                    e._fetchAbortController && e._fetchAbortController.abort()
                }, t.requestTimeout))
              } n.fetch(e._opts.url, { method: e._opts.method, headers: a, body: s || void 0, mode: "cors", credentials: t.withCredentials ? "include" : "same-origin", signal: l }).then(function (t) { e._fetchResponse = t, e._connect() }, function (t) { n.clearTimeout(e._fetchTimer), e._destroyed || e.emit("error", t) })
            } else { var p = e._xhr = new n.XMLHttpRequest; try { p.open(e._opts.method, e._opts.url, !0) } catch (t) { return void r.nextTick(function () { e.emit("error", t) }) } "responseType" in p && (p.responseType = e._mode.split(":")[0]), "withCredentials" in p && (p.withCredentials = !!t.withCredentials), "text" === e._mode && "overrideMimeType" in p && p.overrideMimeType("text/plain; charset=x-user-defined"), "requestTimeout" in t && (p.timeout = t.requestTimeout, p.ontimeout = function () { e.emit("requestTimeout") }), a.forEach(function (e) { p.setRequestHeader(e[0], e[1]) }), e._response = null, p.onreadystatechange = function () { switch (p.readyState) { case m.LOADING: case m.DONE: e._onXHRProgress() } }, "moz-chunked-arraybuffer" === e._mode && (p.onprogress = function () { e._onXHRProgress() }), p.onerror = function () { e._destroyed || e.emit("error", new Error("XHR error")) }; try { p.send(s) } catch (t) { return void r.nextTick(function () { e.emit("error", t) }) } }
          }
        }, b.prototype._onXHRProgress = function () { var e = this; s(e._xhr) && !e._destroyed && (e._response || e._connect(), e._response._onXHRProgress()) }, b.prototype._connect = function () { var e = this; e._destroyed || (e._response = new d(e._xhr, e._fetchResponse, e._mode, e._fetchTimer), e._response.on("error", function (t) { e.emit("error", t) }), e.emit("response", e._response)) }, b.prototype._write = function (e, t, r) { this._body.push(e), r() }, b.prototype.abort = b.prototype.destroy = function () { var e = this; e._destroyed = !0, n.clearTimeout(e._fetchTimer), e._response && (e._response._destroyed = !0), e._xhr ? e._xhr.abort() : e._fetchAbortController && e._fetchAbortController.abort() }, b.prototype.end = function (e, t, r) { var n = this; "function" == typeof e && (r = e, e = void 0), p.Writable.prototype.end.call(n, e, t, r) }, b.prototype.flushHeaders = function () { }, b.prototype.setTimeout = function () { }, b.prototype.setNoDelay = function () { }, b.prototype.setSocketKeepAlive = function () { }; var y = ["accept-charset", "accept-encoding", "access-control-request-headers", "access-control-request-method", "connection", "content-length", "cookie", "cookie2", "date", "dnt", "expect", "host", "keep-alive", "origin", "referer", "te", "trailer", "transfer-encoding", "upgrade", "user-agent", "via"]
      }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("buffer").Buffer)
    }, { "./capability": 232, "./response": 234, _process: 208, "babel-runtime/core-js/object/keys": 60, buffer: 73, inherits: 196, "readable-stream": 223, "to-arraybuffer": 237 }], 234: [function (e, t, r) { (function (t, n, o) { "use strict"; var i = e("babel-runtime/core-js/promise"), s = function (e) { return e && e.__esModule ? e : { default: e } }(i), a = e("./capability"), u = e("inherits"), c = e("readable-stream"), l = r.readyStates = { UNSENT: 0, OPENED: 1, HEADERS_RECEIVED: 2, LOADING: 3, DONE: 4 }, f = r.IncomingMessage = function (e, r, i, u) { var l = this; if (c.Readable.call(l), l._mode = i, l.headers = {}, l.rawHeaders = [], l.trailers = {}, l.rawTrailers = [], l.on("end", function () { t.nextTick(function () { l.emit("close") }) }), "fetch" === i) { if (l._fetchResponse = r, l.url = r.url, l.statusCode = r.status, l.statusMessage = r.statusText, r.headers.forEach(function (e, t) { l.headers[t.toLowerCase()] = e, l.rawHeaders.push(t, e) }), a.writableStream) { var f = new WritableStream({ write: function (e) { return new s.default(function (t, r) { l._destroyed ? r() : l.push(new o(e)) ? t() : l._resumeFetch = t }) }, close: function () { n.clearTimeout(u), l._destroyed || l.push(null) }, abort: function (e) { l._destroyed || l.emit("error", e) } }); try { return void r.body.pipeTo(f).catch(function (e) { n.clearTimeout(u), l._destroyed || l.emit("error", e) }) } catch (e) { } } var p = r.body.getReader(); !function e() { p.read().then(function (t) { if (!l._destroyed) { if (t.done) return n.clearTimeout(u), void l.push(null); l.push(new o(t.value)), e() } }).catch(function (e) { n.clearTimeout(u), l._destroyed || l.emit("error", e) }) }() } else { l._xhr = e, l._pos = 0, l.url = e.responseURL, l.statusCode = e.status, l.statusMessage = e.statusText; if (e.getAllResponseHeaders().split(/\r?\n/).forEach(function (e) { var t = e.match(/^([^:]+):\s*(.*)/); if (t) { var r = t[1].toLowerCase(); "set-cookie" === r ? (void 0 === l.headers[r] && (l.headers[r] = []), l.headers[r].push(t[2])) : void 0 !== l.headers[r] ? l.headers[r] += ", " + t[2] : l.headers[r] = t[2], l.rawHeaders.push(t[1], t[2]) } }), l._charset = "x-user-defined", !a.overrideMimeType) { var h = l.rawHeaders["mime-type"]; if (h) { var d = h.match(/;\s*charset=([^;])(;|$)/); d && (l._charset = d[1].toLowerCase()) } l._charset || (l._charset = "utf-8") } } }; u(f, c.Readable), f.prototype._read = function () { var e = this, t = e._resumeFetch; t && (e._resumeFetch = null, t()) }, f.prototype._onXHRProgress = function () { var e = this, t = e._xhr, r = null; switch (e._mode) { case "text:vbarray": if (t.readyState !== l.DONE) break; try { r = new n.VBArray(t.responseBody).toArray() } catch (e) { } if (null !== r) { e.push(new o(r)); break } case "text": try { r = t.responseText } catch (t) { e._mode = "text:vbarray"; break } if (r.length > e._pos) { var i = r.substr(e._pos); if ("x-user-defined" === e._charset) { for (var s = new o(i.length), a = 0; a < i.length; a++)s[a] = 255 & i.charCodeAt(a); e.push(s) } else e.push(i, e._charset); e._pos = r.length } break; case "arraybuffer": if (t.readyState !== l.DONE || !t.response) break; r = t.response, e.push(new o(new Uint8Array(r))); break; case "moz-chunked-arraybuffer": if (r = t.response, t.readyState !== l.LOADING || !r) break; e.push(new o(new Uint8Array(r))); break; case "ms-stream": if (r = t.response, t.readyState !== l.LOADING) break; var u = new n.MSStreamReader; u.onprogress = function () { u.result.byteLength > e._pos && (e.push(new o(new Uint8Array(u.result.slice(e._pos)))), e._pos = u.result.byteLength) }, u.onload = function () { e.push(null) }, u.readAsArrayBuffer(r) }e._xhr.readyState === l.DONE && "ms-stream" !== e._mode && e.push(null) } }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("buffer").Buffer) }, { "./capability": 232, _process: 208, "babel-runtime/core-js/promise": 61, buffer: 73, inherits: 196, "readable-stream": 223 }], 235: [function (e, t, r) { "use strict"; function n(e) { if (!e) return "utf8"; for (var t; ;)switch (e) { case "utf8": case "utf-8": return "utf8"; case "ucs2": case "ucs-2": case "utf16le": case "utf-16le": return "utf16le"; case "latin1": case "binary": return "latin1"; case "base64": case "ascii": case "hex": return e; default: if (t) return; e = ("" + e).toLowerCase(), t = !0 } } function o(e) { var t = n(e); if ("string" != typeof t && (g.isEncoding === v || !v(e))) throw new Error("Unknown encoding: " + e); return t || e } function i(e) { this.encoding = o(e); var t; switch (this.encoding) { case "utf16le": this.text = p, this.end = h, t = 4; break; case "utf8": this.fillLast = c, t = 4; break; case "base64": this.text = d, this.end = m, t = 3; break; default: return this.write = b, void (this.end = y) }this.lastNeed = 0, this.lastTotal = 0, this.lastChar = g.allocUnsafe(t) } function s(e) { return e <= 127 ? 0 : e >> 5 == 6 ? 2 : e >> 4 == 14 ? 3 : e >> 3 == 30 ? 4 : e >> 6 == 2 ? -1 : -2 } function a(e, t, r) { var n = t.length - 1; if (n < r) return 0; var o = s(t[n]); return o >= 0 ? (o > 0 && (e.lastNeed = o - 1), o) : --n < r || -2 === o ? 0 : (o = s(t[n])) >= 0 ? (o > 0 && (e.lastNeed = o - 2), o) : --n < r || -2 === o ? 0 : (o = s(t[n]), o >= 0 ? (o > 0 && (2 === o ? o = 0 : e.lastNeed = o - 3), o) : 0) } function u(e, t, r) { if (128 != (192 & t[0])) return e.lastNeed = 0, "\ufffd"; if (e.lastNeed > 1 && t.length > 1) { if (128 != (192 & t[1])) return e.lastNeed = 1, "\ufffd"; if (e.lastNeed > 2 && t.length > 2 && 128 != (192 & t[2])) return e.lastNeed = 2, "\ufffd" } } function c(e) { var t = this.lastTotal - this.lastNeed, r = u(this, e, t); return void 0 !== r ? r : this.lastNeed <= e.length ? (e.copy(this.lastChar, t, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal)) : (e.copy(this.lastChar, t, 0, e.length), void (this.lastNeed -= e.length)) } function l(e, t) { var r = a(this, e, t); if (!this.lastNeed) return e.toString("utf8", t); this.lastTotal = r; var n = e.length - (r - this.lastNeed); return e.copy(this.lastChar, 0, n), e.toString("utf8", t, n) } function f(e) { var t = e && e.length ? this.write(e) : ""; return this.lastNeed ? t + "\ufffd" : t } function p(e, t) { if ((e.length - t) % 2 == 0) { var r = e.toString("utf16le", t); if (r) { var n = r.charCodeAt(r.length - 1); if (n >= 55296 && n <= 56319) return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1], r.slice(0, -1) } return r } return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = e[e.length - 1], e.toString("utf16le", t, e.length - 1) } function h(e) { var t = e && e.length ? this.write(e) : ""; if (this.lastNeed) { var r = this.lastTotal - this.lastNeed; return t + this.lastChar.toString("utf16le", 0, r) } return t } function d(e, t) { var r = (e.length - t) % 3; return 0 === r ? e.toString("base64", t) : (this.lastNeed = 3 - r, this.lastTotal = 3, 1 === r ? this.lastChar[0] = e[e.length - 1] : (this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1]), e.toString("base64", t, e.length - r)) } function m(e) { var t = e && e.length ? this.write(e) : ""; return this.lastNeed ? t + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t } function b(e) { return e.toString(this.encoding) } function y(e) { return e && e.length ? this.write(e) : "" } var g = e("safe-buffer").Buffer, v = g.isEncoding || function (e) { switch ((e = "" + e) && e.toLowerCase()) { case "hex": case "utf8": case "utf-8": case "ascii": case "binary": case "base64": case "ucs2": case "ucs-2": case "utf16le": case "utf-16le": case "raw": return !0; default: return !1 } }; r.StringDecoder = i, i.prototype.write = function (e) { if (0 === e.length) return ""; var t, r; if (this.lastNeed) { if (void 0 === (t = this.fillLast(e))) return ""; r = this.lastNeed, this.lastNeed = 0 } else r = 0; return r < e.length ? t ? t + this.text(e, r) : this.text(e, r) : t || "" }, i.prototype.end = f, i.prototype.text = l, i.prototype.fillLast = function (e) { if (this.lastNeed <= e.length) return e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal); e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length), this.lastNeed -= e.length } }, { "safe-buffer": 228 }], 236: [function (e, t, r) { (function (t, n) { function o(e, t) { this._id = e, this._clearFn = t } var i = e("process/browser.js").nextTick, s = Function.prototype.apply, a = Array.prototype.slice, u = {}, c = 0; r.setTimeout = function () { return new o(s.call(setTimeout, window, arguments), clearTimeout) }, r.setInterval = function () { return new o(s.call(setInterval, window, arguments), clearInterval) }, r.clearTimeout = r.clearInterval = function (e) { e.close() }, o.prototype.unref = o.prototype.ref = function () { }, o.prototype.close = function () { this._clearFn.call(window, this._id) }, r.enroll = function (e, t) { clearTimeout(e._idleTimeoutId), e._idleTimeout = t }, r.unenroll = function (e) { clearTimeout(e._idleTimeoutId), e._idleTimeout = -1 }, r._unrefActive = r.active = function (e) { clearTimeout(e._idleTimeoutId); var t = e._idleTimeout; t >= 0 && (e._idleTimeoutId = setTimeout(function () { e._onTimeout && e._onTimeout() }, t)) }, r.setImmediate = "function" == typeof t ? t : function (e) { var t = c++, n = !(arguments.length < 2) && a.call(arguments, 1); return u[t] = !0, i(function () { u[t] && (n ? e.apply(null, n) : e.call(null), r.clearImmediate(t)) }), t }, r.clearImmediate = "function" == typeof n ? n : function (e) { delete u[e] } }).call(this, e("timers").setImmediate, e("timers").clearImmediate) }, { "process/browser.js": 208, timers: 236 }], 237: [function (e, t, r) { var n = e("buffer").Buffer; t.exports = function (e) { if (e instanceof Uint8Array) { if (0 === e.byteOffset && e.byteLength === e.buffer.byteLength) return e.buffer; if ("function" == typeof e.buffer.slice) return e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength) } if (n.isBuffer(e)) { for (var t = new Uint8Array(e.length), r = e.length, o = 0; o < r; o++)t[o] = e[o]; return t.buffer } throw new Error("Argument must be a Buffer") } }, { buffer: 73 }], 238: [function (e, t, r) { "use strict"; function n() { this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, this.path = null, this.href = null } function o(e, t, r) { if (e && c.isObject(e) && e instanceof n) return e; var o = new n; return o.parse(e, t, r), o } function i(e) { return c.isString(e) && (e = o(e)), e instanceof n ? e.format() : n.prototype.format.call(e) } function s(e, t) { return o(e, !1, !0).resolve(t) } function a(e, t) { return e ? o(e, !1, !0).resolveObject(t) : t } var u = e("punycode"), c = e("./util"); r.parse = o, r.resolve = s, r.resolveObject = a, r.format = i, r.Url = n; var l = /^([a-z0-9.+-]+:)/i, f = /:[0-9]*$/, p = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, h = ["<", ">", '"', "`", " ", "\r", "\n", "\t"], d = ["{", "}", "|", "\\", "^", "`"].concat(h), m = ["'"].concat(d), b = ["%", "/", "?", ";", "#"].concat(m), y = ["/", "?", "#"], g = /^[+a-z0-9A-Z_-]{0,63}$/, v = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, _ = { javascript: !0, "javascript:": !0 }, w = { javascript: !0, "javascript:": !0 }, x = { http: !0, https: !0, ftp: !0, gopher: !0, file: !0, "http:": !0, "https:": !0, "ftp:": !0, "gopher:": !0, "file:": !0 }, E = e("querystring"); n.prototype.parse = function (e, t, r) { if (!c.isString(e)) throw new TypeError("Parameter 'url' must be a string, not " + typeof e); var n = e.indexOf("?"), o = -1 !== n && n < e.indexOf("#") ? "?" : "#", i = e.split(o), s = /\\/g; i[0] = i[0].replace(s, "/"), e = i.join(o); var a = e; if (a = a.trim(), !r && 1 === e.split("#").length) { var f = p.exec(a); if (f) return this.path = a, this.href = a, this.pathname = f[1], f[2] ? (this.search = f[2], this.query = t ? E.parse(this.search.substr(1)) : this.search.substr(1)) : t && (this.search = "", this.query = {}), this } var h = l.exec(a); if (h) { h = h[0]; var d = h.toLowerCase(); this.protocol = d, a = a.substr(h.length) } if (r || h || a.match(/^\/\/[^@\/]+@[^@\/]+/)) { var T = "//" === a.substr(0, 2); !T || h && w[h] || (a = a.substr(2), this.slashes = !0) } if (!w[h] && (T || h && !x[h])) { for (var S = -1, j = 0; j < y.length; j++) { var O = a.indexOf(y[j]); -1 !== O && (-1 === S || O < S) && (S = O) } var N, k; k = -1 === S ? a.lastIndexOf("@") : a.lastIndexOf("@", S), -1 !== k && (N = a.slice(0, k), a = a.slice(k + 1), this.auth = decodeURIComponent(N)), S = -1; for (var j = 0; j < b.length; j++) { var O = a.indexOf(b[j]); -1 !== O && (-1 === S || O < S) && (S = O) } -1 === S && (S = a.length), this.host = a.slice(0, S), a = a.slice(S), this.parseHost(), this.hostname = this.hostname || ""; var I = "[" === this.hostname[0] && "]" === this.hostname[this.hostname.length - 1]; if (!I) for (var C = this.hostname.split(/\./), j = 0, A = C.length; j < A; j++) { var D = C[j]; if (D && !D.match(g)) { for (var M = "", P = 0, L = D.length; P < L; P++)D.charCodeAt(P) > 127 ? M += "x" : M += D[P]; if (!M.match(g)) { var R = C.slice(0, j), B = C.slice(j + 1), F = D.match(v); F && (R.push(F[1]), B.unshift(F[2])), B.length && (a = "/" + B.join(".") + a), this.hostname = R.join("."); break } } } this.hostname.length > 255 ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(), I || (this.hostname = u.toASCII(this.hostname)); var U = this.port ? ":" + this.port : "", q = this.hostname || ""; this.host = q + U, this.href += this.host, I && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), "/" !== a[0] && (a = "/" + a)) } if (!_[d]) for (var j = 0, A = m.length; j < A; j++) { var X = m[j]; if (-1 !== a.indexOf(X)) { var G = encodeURIComponent(X); G === X && (G = escape(X)), a = a.split(X).join(G) } } var z = a.indexOf("#"); -1 !== z && (this.hash = a.substr(z), a = a.slice(0, z)); var V = a.indexOf("?"); if (-1 !== V ? (this.search = a.substr(V), this.query = a.substr(V + 1), t && (this.query = E.parse(this.query)), a = a.slice(0, V)) : t && (this.search = "", this.query = {}), a && (this.pathname = a), x[d] && this.hostname && !this.pathname && (this.pathname = "/"), this.pathname || this.search) { var U = this.pathname || "", H = this.search || ""; this.path = U + H } return this.href = this.format(), this }, n.prototype.format = function () { var e = this.auth || ""; e && (e = encodeURIComponent(e), e = e.replace(/%3A/i, ":"), e += "@"); var t = this.protocol || "", r = this.pathname || "", n = this.hash || "", o = !1, i = ""; this.host ? o = e + this.host : this.hostname && (o = e + (-1 === this.hostname.indexOf(":") ? this.hostname : "[" + this.hostname + "]"), this.port && (o += ":" + this.port)), this.query && c.isObject(this.query) && Object.keys(this.query).length && (i = E.stringify(this.query)); var s = this.search || i && "?" + i || ""; return t && ":" !== t.substr(-1) && (t += ":"), this.slashes || (!t || x[t]) && !1 !== o ? (o = "//" + (o || ""), r && "/" !== r.charAt(0) && (r = "/" + r)) : o || (o = ""), n && "#" !== n.charAt(0) && (n = "#" + n), s && "?" !== s.charAt(0) && (s = "?" + s), r = r.replace(/[?#]/g, function (e) { return encodeURIComponent(e) }), s = s.replace("#", "%23"), t + o + r + s + n }, n.prototype.resolve = function (e) { return this.resolveObject(o(e, !1, !0)).format() }, n.prototype.resolveObject = function (e) { if (c.isString(e)) { var t = new n; t.parse(e, !1, !0), e = t } for (var r = new n, o = Object.keys(this), i = 0; i < o.length; i++) { var s = o[i]; r[s] = this[s] } if (r.hash = e.hash, "" === e.href) return r.href = r.format(), r; if (e.slashes && !e.protocol) { for (var a = Object.keys(e), u = 0; u < a.length; u++) { var l = a[u]; "protocol" !== l && (r[l] = e[l]) } return x[r.protocol] && r.hostname && !r.pathname && (r.path = r.pathname = "/"), r.href = r.format(), r } if (e.protocol && e.protocol !== r.protocol) { if (!x[e.protocol]) { for (var f = Object.keys(e), p = 0; p < f.length; p++) { var h = f[p]; r[h] = e[h] } return r.href = r.format(), r } if (r.protocol = e.protocol, e.host || w[e.protocol]) r.pathname = e.pathname; else { for (var d = (e.pathname || "").split("/"); d.length && !(e.host = d.shift());); e.host || (e.host = ""), e.hostname || (e.hostname = ""), "" !== d[0] && d.unshift(""), d.length < 2 && d.unshift(""), r.pathname = d.join("/") } if (r.search = e.search, r.query = e.query, r.host = e.host || "", r.auth = e.auth, r.hostname = e.hostname || e.host, r.port = e.port, r.pathname || r.search) { var m = r.pathname || "", b = r.search || ""; r.path = m + b } return r.slashes = r.slashes || e.slashes, r.href = r.format(), r } var y = r.pathname && "/" === r.pathname.charAt(0), g = e.host || e.pathname && "/" === e.pathname.charAt(0), v = g || y || r.host && e.pathname, _ = v, E = r.pathname && r.pathname.split("/") || [], d = e.pathname && e.pathname.split("/") || [], T = r.protocol && !x[r.protocol]; if (T && (r.hostname = "", r.port = null, r.host && ("" === E[0] ? E[0] = r.host : E.unshift(r.host)), r.host = "", e.protocol && (e.hostname = null, e.port = null, e.host && ("" === d[0] ? d[0] = e.host : d.unshift(e.host)), e.host = null), v = v && ("" === d[0] || "" === E[0])), g) r.host = e.host || "" === e.host ? e.host : r.host, r.hostname = e.hostname || "" === e.hostname ? e.hostname : r.hostname, r.search = e.search, r.query = e.query, E = d; else if (d.length) E || (E = []), E.pop(), E = E.concat(d), r.search = e.search, r.query = e.query; else if (!c.isNullOrUndefined(e.search)) { if (T) { r.hostname = r.host = E.shift(); var S = !!(r.host && r.host.indexOf("@") > 0) && r.host.split("@"); S && (r.auth = S.shift(), r.host = r.hostname = S.shift()) } return r.search = e.search, r.query = e.query, c.isNull(r.pathname) && c.isNull(r.search) || (r.path = (r.pathname ? r.pathname : "") + (r.search ? r.search : "")), r.href = r.format(), r } if (!E.length) return r.pathname = null, r.search ? r.path = "/" + r.search : r.path = null, r.href = r.format(), r; for (var j = E.slice(-1)[0], O = (r.host || e.host || E.length > 1) && ("." === j || ".." === j) || "" === j, N = 0, k = E.length; k >= 0; k--)j = E[k], "." === j ? E.splice(k, 1) : ".." === j ? (E.splice(k, 1), N++) : N && (E.splice(k, 1), N--); if (!v && !_) for (; N--; N)E.unshift(".."); !v || "" === E[0] || E[0] && "/" === E[0].charAt(0) || E.unshift(""), O && "/" !== E.join("/").substr(-1) && E.push(""); var I = "" === E[0] || E[0] && "/" === E[0].charAt(0); if (T) { r.hostname = r.host = I ? "" : E.length ? E.shift() : ""; var S = !!(r.host && r.host.indexOf("@") > 0) && r.host.split("@"); S && (r.auth = S.shift(), r.host = r.hostname = S.shift()) } return v = v || r.host && E.length, v && !I && E.unshift(""), E.length ? r.pathname = E.join("/") : (r.pathname = null, r.path = null), c.isNull(r.pathname) && c.isNull(r.search) || (r.path = (r.pathname ? r.pathname : "") + (r.search ? r.search : "")), r.auth = e.auth || r.auth, r.slashes = r.slashes || e.slashes, r.href = r.format(), r }, n.prototype.parseHost = function () { var e = this.host, t = f.exec(e); t && (t = t[0], ":" !== t && (this.port = t.substr(1)), e = e.substr(0, e.length - t.length)), e && (this.hostname = e) } }, { "./util": 239, punycode: 209, querystring: 212 }], 239: [function (e, t, r) { "use strict"; t.exports = { isString: function (e) { return "string" == typeof e }, isObject: function (e) { return "object" == typeof e && null !== e }, isNull: function (e) { return null === e }, isNullOrUndefined: function (e) { return null == e } } }, {}], 240: [function (e, t, r) { (function (e) { function r(e, t) { function r() { if (!o) { if (n("throwDeprecation")) throw new Error(t); n("traceDeprecation") ? console.trace(t) : console.warn(t), o = !0 } return e.apply(this, arguments) } if (n("noDeprecation")) return e; var o = !1; return r } function n(t) { try { if (!e.localStorage) return !1 } catch (e) { return !1 } var r = e.localStorage[t]; return null != r && "true" === String(r).toLowerCase() } t.exports = r }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}) }, {}], 241: [function (e, t, r) { "function" == typeof Object.create ? t.exports = function (e, t) { e.super_ = t, e.prototype = Object.create(t.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } }) } : t.exports = function (e, t) { e.super_ = t; var r = function () { }; r.prototype = t.prototype, e.prototype = new r, e.prototype.constructor = e } }, {}], 242: [function (e, t, r) { t.exports = function (e) { return e && "object" == typeof e && "function" == typeof e.copy && "function" == typeof e.fill && "function" == typeof e.readUInt8 } }, {}], 243: [function (e, t, r) { (function (t, n) { function o(e, t) { var n = { seen: [], stylize: s }; return arguments.length >= 3 && (n.depth = arguments[2]), arguments.length >= 4 && (n.colors = arguments[3]), m(t) ? n.showHidden = t : t && r._extend(n, t), w(n.showHidden) && (n.showHidden = !1), w(n.depth) && (n.depth = 2), w(n.colors) && (n.colors = !1), w(n.customInspect) && (n.customInspect = !0), n.colors && (n.stylize = i), u(n, e, n.depth) } function i(e, t) { var r = o.styles[t]; return r ? "\x1b[" + o.colors[r][0] + "m" + e + "\x1b[" + o.colors[r][1] + "m" : e } function s(e, t) { return e } function a(e) { var t = {}; return e.forEach(function (e, r) { t[e] = !0 }), t } function u(e, t, n) { if (e.customInspect && t && j(t.inspect) && t.inspect !== r.inspect && (!t.constructor || t.constructor.prototype !== t)) { var o = t.inspect(n, e); return v(o) || (o = u(e, o, n)), o } var i = c(e, t); if (i) return i; var s = Object.keys(t), m = a(s); if (e.showHidden && (s = Object.getOwnPropertyNames(t)), S(t) && (s.indexOf("message") >= 0 || s.indexOf("description") >= 0)) return l(t); if (0 === s.length) { if (j(t)) { var b = t.name ? ": " + t.name : ""; return e.stylize("[Function" + b + "]", "special") } if (x(t)) return e.stylize(RegExp.prototype.toString.call(t), "regexp"); if (T(t)) return e.stylize(Date.prototype.toString.call(t), "date"); if (S(t)) return l(t) } var y = "", g = !1, _ = ["{", "}"]; if (d(t) && (g = !0, _ = ["[", "]"]), j(t)) { y = " [Function" + (t.name ? ": " + t.name : "") + "]" } if (x(t) && (y = " " + RegExp.prototype.toString.call(t)), T(t) && (y = " " + Date.prototype.toUTCString.call(t)), S(t) && (y = " " + l(t)), 0 === s.length && (!g || 0 == t.length)) return _[0] + y + _[1]; if (n < 0) return x(t) ? e.stylize(RegExp.prototype.toString.call(t), "regexp") : e.stylize("[Object]", "special"); e.seen.push(t); var w; return w = g ? f(e, t, n, m, s) : s.map(function (r) { return p(e, t, n, m, r, g) }), e.seen.pop(), h(w, y, _) } function c(e, t) { if (w(t)) return e.stylize("undefined", "undefined"); if (v(t)) { var r = "'" + JSON.stringify(t).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'"; return e.stylize(r, "string") } return g(t) ? e.stylize("" + t, "number") : m(t) ? e.stylize("" + t, "boolean") : b(t) ? e.stylize("null", "null") : void 0 } function l(e) { return "[" + Error.prototype.toString.call(e) + "]" } function f(e, t, r, n, o) { for (var i = [], s = 0, a = t.length; s < a; ++s)C(t, String(s)) ? i.push(p(e, t, r, n, String(s), !0)) : i.push(""); return o.forEach(function (o) { o.match(/^\d+$/) || i.push(p(e, t, r, n, o, !0)) }), i } function p(e, t, r, n, o, i) { var s, a, c; if (c = Object.getOwnPropertyDescriptor(t, o) || { value: t[o] }, c.get ? a = c.set ? e.stylize("[Getter/Setter]", "special") : e.stylize("[Getter]", "special") : c.set && (a = e.stylize("[Setter]", "special")), C(n, o) || (s = "[" + o + "]"), a || (e.seen.indexOf(c.value) < 0 ? (a = b(r) ? u(e, c.value, null) : u(e, c.value, r - 1), a.indexOf("\n") > -1 && (a = i ? a.split("\n").map(function (e) { return "  " + e }).join("\n").substr(2) : "\n" + a.split("\n").map(function (e) { return "   " + e }).join("\n"))) : a = e.stylize("[Circular]", "special")), w(s)) { if (i && o.match(/^\d+$/)) return a; s = JSON.stringify("" + o), s.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (s = s.substr(1, s.length - 2), s = e.stylize(s, "name")) : (s = s.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), s = e.stylize(s, "string")) } return s + ": " + a } function h(e, t, r) { var n = 0; return e.reduce(function (e, t) { return n++, t.indexOf("\n") >= 0 && n++, e + t.replace(/\u001b\[\d\d?m/g, "").length + 1 }, 0) > 60 ? r[0] + ("" === t ? "" : t + "\n ") + " " + e.join(",\n  ") + " " + r[1] : r[0] + t + " " + e.join(", ") + " " + r[1] } function d(e) { return Array.isArray(e) } function m(e) { return "boolean" == typeof e } function b(e) { return null === e } function y(e) { return null == e } function g(e) { return "number" == typeof e } function v(e) { return "string" == typeof e } function _(e) { return "symbol" == typeof e } function w(e) { return void 0 === e } function x(e) { return E(e) && "[object RegExp]" === N(e) } function E(e) { return "object" == typeof e && null !== e } function T(e) { return E(e) && "[object Date]" === N(e) } function S(e) { return E(e) && ("[object Error]" === N(e) || e instanceof Error) } function j(e) { return "function" == typeof e } function O(e) { return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || void 0 === e } function N(e) { return Object.prototype.toString.call(e) } function k(e) { return e < 10 ? "0" + e.toString(10) : e.toString(10) } function I() { var e = new Date, t = [k(e.getHours()), k(e.getMinutes()), k(e.getSeconds())].join(":"); return [e.getDate(), P[e.getMonth()], t].join(" ") } function C(e, t) { return Object.prototype.hasOwnProperty.call(e, t) } var A = /%[sdj%]/g; r.format = function (e) { if (!v(e)) { for (var t = [], r = 0; r < arguments.length; r++)t.push(o(arguments[r])); return t.join(" ") } for (var r = 1, n = arguments, i = n.length, s = String(e).replace(A, function (e) { if ("%%" === e) return "%"; if (r >= i) return e; switch (e) { case "%s": return String(n[r++]); case "%d": return Number(n[r++]); case "%j": try { return JSON.stringify(n[r++]) } catch (e) { return "[Circular]" } default: return e } }), a = n[r]; r < i; a = n[++r])b(a) || !E(a) ? s += " " + a : s += " " + o(a); return s }, r.deprecate = function (e, o) { function i() { if (!s) { if (t.throwDeprecation) throw new Error(o); t.traceDeprecation ? console.trace(o) : console.error(o), s = !0 } return e.apply(this, arguments) } if (w(n.process)) return function () { return r.deprecate(e, o).apply(this, arguments) }; if (!0 === t.noDeprecation) return e; var s = !1; return i }; var D, M = {}; r.debuglog = function (e) { if (w(D) && (D = t.env.NODE_DEBUG || ""), e = e.toUpperCase(), !M[e]) if (new RegExp("\\b" + e + "\\b", "i").test(D)) { var n = t.pid; M[e] = function () { var t = r.format.apply(r, arguments); console.error("%s %d: %s", e, n, t) } } else M[e] = function () { }; return M[e] }, r.inspect = o, o.colors = { bold: [1, 22], italic: [3, 23], underline: [4, 24], inverse: [7, 27], white: [37, 39], grey: [90, 39], black: [30, 39], blue: [34, 39], cyan: [36, 39], green: [32, 39], magenta: [35, 39], red: [31, 39], yellow: [33, 39] }, o.styles = { special: "cyan", number: "yellow", boolean: "yellow", undefined: "grey", null: "bold", string: "green", date: "magenta", regexp: "red" }, r.isArray = d, r.isBoolean = m, r.isNull = b, r.isNullOrUndefined = y, r.isNumber = g, r.isString = v, r.isSymbol = _, r.isUndefined = w, r.isRegExp = x, r.isObject = E, r.isDate = T, r.isError = S, r.isFunction = j, r.isPrimitive = O, r.isBuffer = e("./support/isBuffer"); var P = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; r.log = function () { console.log("%s - %s", I(), r.format.apply(r, arguments)) }, r.inherits = e("inherits"), r._extend = function (e, t) { if (!t || !E(t)) return e; for (var r = Object.keys(t), n = r.length; n--;)e[r[n]] = t[r[n]]; return e } }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}) }, { "./support/isBuffer": 242, _process: 208, inherits: 241 }], 244: [function (e, t, r) { "use strict"; (function () { r.stripBOM = function (e) { return "\ufeff" === e[0] ? e.substring(1) : e } }).call(void 0) }, {}], 245: [function (e, t, r) { "use strict"; function n(e) { return e && e.__esModule ? e : { default: e } } var o = e("babel-runtime/helpers/typeof"), i = n(o), s = e("babel-runtime/core-js/object/keys"), a = n(s); (function () { var t, n, o, s, u, c = {}.hasOwnProperty; t = e("xmlbuilder"), n = e("./defaults").defaults, s = function (e) { return "string" == typeof e && (e.indexOf("&") >= 0 || e.indexOf(">") >= 0 || e.indexOf("<") >= 0) }, u = function (e) { return "<![CDATA[" + o(e) + "]]>" }, o = function (e) { return e.replace("]]>", "]]]]><![CDATA[>") }, r.Builder = function () { function e(e) { var t, r, o; this.options = {}, r = n[.2]; for (t in r) c.call(r, t) && (o = r[t], this.options[t] = o); for (t in e) c.call(e, t) && (o = e[t], this.options[t] = o) } return e.prototype.buildObject = function (e) { var r, o, l, f, p; return r = this.options.attrkey, o = this.options.charkey, 1 === (0, a.default)(e).length && this.options.rootName === n[.2].rootName ? (p = (0, a.default)(e)[0], e = e[p]) : p = this.options.rootName, l = function (e) { return function (t, n) { var a, f, p, h, d, m; if ("object" !== (void 0 === n ? "undefined" : (0, i.default)(n))) e.options.cdata && s(n) ? t.raw(u(n)) : t.txt(n); else if (Array.isArray(n)) { for (h in n) if (c.call(n, h)) { f = n[h]; for (d in f) p = f[d], t = l(t.ele(d), p).up() } } else for (d in n) if (c.call(n, d)) if (f = n[d], d === r) { if ("object" === (void 0 === f ? "undefined" : (0, i.default)(f))) for (a in f) m = f[a], t = t.att(a, m) } else if (d === o) t = e.options.cdata && s(f) ? t.raw(u(f)) : t.txt(f); else if (Array.isArray(f)) for (h in f) c.call(f, h) && (p = f[h], t = "string" == typeof p ? e.options.cdata && s(p) ? t.ele(d).raw(u(p)).up() : t.ele(d, p).up() : l(t.ele(d), p).up()); else "object" === (void 0 === f ? "undefined" : (0, i.default)(f)) ? t = l(t.ele(d), f).up() : "string" == typeof f && e.options.cdata && s(f) ? t = t.ele(d).raw(u(f)).up() : (null == f && (f = ""), t = t.ele(d, f.toString()).up()); return t } }(this), f = t.create(p, this.options.xmldec, this.options.doctype, { headless: this.options.headless, allowSurrogateChars: this.options.allowSurrogateChars }), l(f, e).end(this.options.renderOpts) }, e }() }).call(void 0) }, { "./defaults": 246, "babel-runtime/core-js/object/keys": 60, "babel-runtime/helpers/typeof": 67, xmlbuilder: 282 }], 246: [function (e, t, r) { "use strict"; (function () { r.defaults = { .1: { explicitCharkey: !1, trim: !0, normalize: !0, normalizeTags: !1, attrkey: "@", charkey: "#", explicitArray: !1, ignoreAttrs: !1, mergeAttrs: !1, explicitRoot: !1, validator: null, xmlns: !1, explicitChildren: !1, childkey: "@@", charsAsChildren: !1, includeWhiteChars: !1, async: !1, strict: !0, attrNameProcessors: null, attrValueProcessors: null, tagNameProcessors: null, valueProcessors: null, emptyTag: "" }, .2: { explicitCharkey: !1, trim: !1, normalize: !1, normalizeTags: !1, attrkey: "$", charkey: "_", explicitArray: !0, ignoreAttrs: !1, mergeAttrs: !1, explicitRoot: !0, validator: null, xmlns: !1, explicitChildren: !1, preserveChildrenOrder: !1, childkey: "$$", charsAsChildren: !1, includeWhiteChars: !1, async: !1, strict: !0, attrNameProcessors: null, attrValueProcessors: null, tagNameProcessors: null, valueProcessors: null, rootName: "root", xmldec: { version: "1.0", encoding: "UTF-8", standalone: !0 }, doctype: null, renderOpts: { pretty: !0, indent: "  ", newline: "\n" }, headless: !1, chunkSize: 1e4, emptyTag: "", cdata: !1 } } }).call(void 0) }, {}], 247: [function (e, t, r) {
      "use strict"; function n(e) { return e && e.__esModule ? e : { default: e } } var o = e("babel-runtime/core-js/promise"), i = n(o), s = e("babel-runtime/core-js/object/get-own-property-names"), a = n(s), u = e("babel-runtime/core-js/object/keys"), c = n(u), l = e("babel-runtime/helpers/typeof"), f = n(l); (function () {
        var t, n, o, s, u, l, p, h, d = function (e, t) { return function () { return e.apply(t, arguments) } }, m = function (e, t) { function r() { this.constructor = e } for (var n in t) b.call(t, n) && (e[n] = t[n]); return r.prototype = t.prototype, e.prototype = new r, e.__super__ = t.prototype, e }, b = {}.hasOwnProperty; p = e("sax"), o = e("events"), t = e("./bom"), l = e("./processors"), h = e("timers").setImmediate, n = e("./defaults").defaults, s = function (e) { return "object" === (void 0 === e ? "undefined" : (0, f.default)(e)) && null != e && 0 === (0, c.default)(e).length }, u = function (e, t, r) { var n, o, i; for (n = 0, o = e.length; n < o; n++)i = e[n], t = i(t, r); return t }, r.Parser = function (e) {
          function o(e) { this.parseStringPromise = d(this.parseStringPromise, this), this.parseString = d(this.parseString, this), this.reset = d(this.reset, this), this.assignOrPush = d(this.assignOrPush, this), this.processAsync = d(this.processAsync, this); var t, o, i; if (!(this instanceof r.Parser)) return new r.Parser(e); this.options = {}, o = n[.2]; for (t in o) b.call(o, t) && (i = o[t], this.options[t] = i); for (t in e) b.call(e, t) && (i = e[t], this.options[t] = i); this.options.xmlns && (this.options.xmlnskey = this.options.attrkey + "ns"), this.options.normalizeTags && (this.options.tagNameProcessors || (this.options.tagNameProcessors = []), this.options.tagNameProcessors.unshift(l.normalize)), this.reset() } return m(o, e), o.prototype.processAsync = function () { var e, t; try { return this.remaining.length <= this.options.chunkSize ? (e = this.remaining, this.remaining = "", this.saxParser = this.saxParser.write(e), this.saxParser.close()) : (e = this.remaining.substr(0, this.options.chunkSize), this.remaining = this.remaining.substr(this.options.chunkSize, this.remaining.length), this.saxParser = this.saxParser.write(e), h(this.processAsync)) } catch (e) { if (t = e, !this.saxParser.errThrown) return this.saxParser.errThrown = !0, this.emit(t) } }, o.prototype.assignOrPush = function (e, t, r) { return t in e ? (e[t] instanceof Array || (e[t] = [e[t]]), e[t].push(r)) : this.options.explicitArray ? e[t] = [r] : e[t] = r }, o.prototype.reset = function () {
            var e, t, r, n; return this.removeAllListeners(), this.saxParser = p.parser(this.options.strict, { trim: !1, normalize: !1, xmlns: this.options.xmlns }), this.saxParser.errThrown = !1, this.saxParser.onerror = function (e) {
              return function (t) { if (e.saxParser.resume(), !e.saxParser.errThrown) return e.saxParser.errThrown = !0, e.emit("error", t) }
            }(this), this.saxParser.onend = function (e) { return function () { if (!e.saxParser.ended) return e.saxParser.ended = !0, e.emit("end", e.resultObject) } }(this), this.saxParser.ended = !1, this.EXPLICIT_CHARKEY = this.options.explicitCharkey, this.resultObject = null, n = [], e = this.options.attrkey, t = this.options.charkey, this.saxParser.onopentag = function (r) { return function (o) { var i, s, a, c, l; if (a = {}, a[t] = "", !r.options.ignoreAttrs) { l = o.attributes; for (i in l) b.call(l, i) && (e in a || r.options.mergeAttrs || (a[e] = {}), s = r.options.attrValueProcessors ? u(r.options.attrValueProcessors, o.attributes[i], i) : o.attributes[i], c = r.options.attrNameProcessors ? u(r.options.attrNameProcessors, i) : i, r.options.mergeAttrs ? r.assignOrPush(a, c, s) : a[e][c] = s) } return a["#name"] = r.options.tagNameProcessors ? u(r.options.tagNameProcessors, o.name) : o.name, r.options.xmlns && (a[r.options.xmlnskey] = { uri: o.uri, local: o.local }), n.push(a) } }(this), this.saxParser.onclosetag = function (e) { return function () { var r, o, i, l, p, h, d, m, y, g; if (h = n.pop(), p = h["#name"], e.options.explicitChildren && e.options.preserveChildrenOrder || delete h["#name"], !0 === h.cdata && (r = h.cdata, delete h.cdata), y = n[n.length - 1], h[t].match(/^\s*$/) && !r ? (o = h[t], delete h[t]) : (e.options.trim && (h[t] = h[t].trim()), e.options.normalize && (h[t] = h[t].replace(/\s{2,}/g, " ").trim()), h[t] = e.options.valueProcessors ? u(e.options.valueProcessors, h[t], p) : h[t], 1 === (0, c.default)(h).length && t in h && !e.EXPLICIT_CHARKEY && (h = h[t])), s(h) && (h = "" !== e.options.emptyTag ? e.options.emptyTag : o), null != e.options.validator && (g = "/" + function () { var e, t, r; for (r = [], e = 0, t = n.length; e < t; e++)l = n[e], r.push(l["#name"]); return r }().concat(p).join("/"), function () { var t; try { h = e.options.validator(g, y && y[p], h) } catch (r) { return t = r, e.emit("error", t) } }()), e.options.explicitChildren && !e.options.mergeAttrs && "object" === (void 0 === h ? "undefined" : (0, f.default)(h))) if (e.options.preserveChildrenOrder) { if (y) { y[e.options.childkey] = y[e.options.childkey] || [], d = {}; for (i in h) b.call(h, i) && (d[i] = h[i]); y[e.options.childkey].push(d), delete h["#name"], 1 === (0, c.default)(h).length && t in h && !e.EXPLICIT_CHARKEY && (h = h[t]) } } else l = {}, e.options.attrkey in h && (l[e.options.attrkey] = h[e.options.attrkey], delete h[e.options.attrkey]), !e.options.charsAsChildren && e.options.charkey in h && (l[e.options.charkey] = h[e.options.charkey], delete h[e.options.charkey]), (0, a.default)(h).length > 0 && (l[e.options.childkey] = h), h = l; return n.length > 0 ? e.assignOrPush(y, p, h) : (e.options.explicitRoot && (m = h, h = {}, h[p] = m), e.resultObject = h, e.saxParser.ended = !0, e.emit("end", e.resultObject)) } }(this), r = function (e) { return function (r) { var o, i; if (i = n[n.length - 1]) return i[t] += r, e.options.explicitChildren && e.options.preserveChildrenOrder && e.options.charsAsChildren && (e.options.includeWhiteChars || "" !== r.replace(/\\n/g, "").trim()) && (i[e.options.childkey] = i[e.options.childkey] || [], o = { "#name": "__text__" }, o[t] = r, e.options.normalize && (o[t] = o[t].replace(/\s{2,}/g, " ").trim()), i[e.options.childkey].push(o)), i } }(this), this.saxParser.ontext = r, this.saxParser.oncdata = function (e) { return function (e) { var t; if (t = r(e)) return t.cdata = !0 } }()
          }, o.prototype.parseString = function (e, r) { var n; null != r && "function" == typeof r && (this.on("end", function (e) { return this.reset(), r(null, e) }), this.on("error", function (e) { return this.reset(), r(e) })); try { return e = e.toString(), "" === e.trim() ? (this.emit("end", null), !0) : (e = t.stripBOM(e), this.options.async ? (this.remaining = e, h(this.processAsync), this.saxParser) : this.saxParser.write(e).close()) } catch (e) { if (n = e, !this.saxParser.errThrown && !this.saxParser.ended) return this.emit("error", n), this.saxParser.errThrown = !0; if (this.saxParser.ended) throw n } }, o.prototype.parseStringPromise = function (e) { return new i.default(function (t) { return function (r, n) { return t.parseString(e, function (e, t) { return e ? n(e) : r(t) }) } }(this)) }, o
        }(o), r.parseString = function (e, t, n) { var o, i, s; return null != n ? ("function" == typeof n && (o = n), "object" === (void 0 === t ? "undefined" : (0, f.default)(t)) && (i = t)) : ("function" == typeof t && (o = t), i = {}), s = new r.Parser(i), s.parseString(e, o) }, r.parseStringPromise = function (e, t) { var n, o; return "object" === (void 0 === t ? "undefined" : (0, f.default)(t)) && (n = t), o = new r.Parser(n), o.parseStringPromise(e) }
      }).call(void 0)
    }, { "./bom": 244, "./defaults": 246, "./processors": 248, "babel-runtime/core-js/object/get-own-property-names": 58, "babel-runtime/core-js/object/keys": 60, "babel-runtime/core-js/promise": 61, "babel-runtime/helpers/typeof": 67, events: 192, sax: 229, timers: 236 }], 248: [function (e, t, r) { "use strict"; (function () { var e; e = new RegExp(/(?!xmlns)^.*:/), r.normalize = function (e) { return e.toLowerCase() }, r.firstCharLowerCase = function (e) { return e.charAt(0).toLowerCase() + e.slice(1) }, r.stripPrefix = function (t) { return t.replace(e, "") }, r.parseNumbers = function (e) { return isNaN(e) || (e = e % 1 == 0 ? parseInt(e, 10) : parseFloat(e)), e }, r.parseBooleans = function (e) { return /^(?:true|false)$/i.test(e) && (e = "true" === e.toLowerCase()), e } }).call(void 0) }, {}], 249: [function (e, t, r) { "use strict"; (function () { var t, n, o, i, s = function (e, t) { function r() { this.constructor = e } for (var n in t) a.call(t, n) && (e[n] = t[n]); return r.prototype = t.prototype, e.prototype = new r, e.__super__ = t.prototype, e }, a = {}.hasOwnProperty; n = e("./defaults"), t = e("./builder"), o = e("./parser"), i = e("./processors"), r.defaults = n.defaults, r.processors = i, r.ValidationError = function (e) { function t(e) { this.message = e } return s(t, e), t }(Error), r.Builder = t.Builder, r.Parser = o.Parser, r.parseString = o.parseString, r.parseStringPromise = o.parseStringPromise }).call(void 0) }, { "./builder": 245, "./defaults": 246, "./parser": 247, "./processors": 248 }], 250: [function (e, t, r) { "use strict"; (function () { t.exports = { Disconnected: 1, Preceding: 2, Following: 4, Contains: 8, ContainedBy: 16, ImplementationSpecific: 32 } }).call(void 0) }, {}], 251: [function (e, t, r) { "use strict"; (function () { t.exports = { Element: 1, Attribute: 2, Text: 3, CData: 4, EntityReference: 5, EntityDeclaration: 6, ProcessingInstruction: 7, Comment: 8, Document: 9, DocType: 10, DocumentFragment: 11, NotationDeclaration: 12, Declaration: 201, Raw: 202, AttributeDeclaration: 203, ElementDeclaration: 204, Dummy: 205 } }).call(void 0) }, {}], 252: [function (e, t, r) { "use strict"; function n(e) { return e && e.__esModule ? e : { default: e } } var o = e("babel-runtime/core-js/object/get-prototype-of"), i = n(o), s = e("babel-runtime/helpers/typeof"), a = n(s), u = e("babel-runtime/core-js/object/assign"), c = n(u); (function () { var e, r, n, o, s, u, l, f = [].slice, p = {}.hasOwnProperty; e = function () { var e, t, r, n, o, i; if (i = arguments[0], o = 2 <= arguments.length ? f.call(arguments, 1) : [], s(c.default)) c.default.apply(null, arguments); else for (e = 0, r = o.length; e < r; e++)if (null != (n = o[e])) for (t in n) p.call(n, t) && (i[t] = n[t]); return i }, s = function (e) { return !!e && "[object Function]" === Object.prototype.toString.call(e) }, u = function (e) { var t; return !!e && ("function" === (t = void 0 === e ? "undefined" : (0, a.default)(e)) || "object" === t) }, n = function (e) { return s(Array.isArray) ? Array.isArray(e) : "[object Array]" === Object.prototype.toString.call(e) }, o = function (e) { var t; if (n(e)) return !e.length; for (t in e) if (p.call(e, t)) return !1; return !0 }, l = function (e) { var t, r; return u(e) && (r = (0, i.default)(e)) && (t = r.constructor) && "function" == typeof t && t instanceof t && Function.prototype.toString.call(t) === Function.prototype.toString.call(Object) }, r = function (e) { return s(e.valueOf) ? e.valueOf() : e }, t.exports.assign = e, t.exports.isFunction = s, t.exports.isObject = u, t.exports.isArray = n, t.exports.isEmpty = o, t.exports.isPlainObject = l, t.exports.getValue = r }).call(void 0) }, { "babel-runtime/core-js/object/assign": 54, "babel-runtime/core-js/object/get-prototype-of": 59, "babel-runtime/helpers/typeof": 67 }], 253: [function (e, t, r) { "use strict"; (function () { t.exports = { None: 0, OpenTag: 1, InsideTag: 2, CloseTag: 3 } }).call(void 0) }, {}], 254: [function (e, t, r) { "use strict"; var n = e("babel-runtime/core-js/object/create"), o = function (e) { return e && e.__esModule ? e : { default: e } }(n); (function () { var r; r = e("./NodeType"), e("./XMLNode"), t.exports = function () { function e(e, t, n) { if (this.parent = e, this.parent && (this.options = this.parent.options, this.stringify = this.parent.stringify), null == t) throw new Error("Missing attribute name. " + this.debugInfo(t)); this.name = this.stringify.name(t), this.value = this.stringify.attValue(n), this.type = r.Attribute, this.isId = !1, this.schemaTypeInfo = null } return Object.defineProperty(e.prototype, "nodeType", { get: function () { return this.type } }), Object.defineProperty(e.prototype, "ownerElement", { get: function () { return this.parent } }), Object.defineProperty(e.prototype, "textContent", { get: function () { return this.value }, set: function (e) { return this.value = e || "" } }), Object.defineProperty(e.prototype, "namespaceURI", { get: function () { return "" } }), Object.defineProperty(e.prototype, "prefix", { get: function () { return "" } }), Object.defineProperty(e.prototype, "localName", { get: function () { return this.name } }), Object.defineProperty(e.prototype, "specified", { get: function () { return !0 } }), e.prototype.clone = function () { return (0, o.default)(this) }, e.prototype.toString = function (e) { return this.options.writer.attribute(this, this.options.writer.filterOptions(e)) }, e.prototype.debugInfo = function (e) { return e = e || this.name, null == e ? "parent: <" + this.parent.name + ">" : "attribute: {" + e + "}, parent: <" + this.parent.name + ">" }, e.prototype.isEqualNode = function (e) { return e.namespaceURI === this.namespaceURI && (e.prefix === this.prefix && (e.localName === this.localName && e.value === this.value)) }, e }() }).call(void 0) }, { "./NodeType": 251, "./XMLNode": 273, "babel-runtime/core-js/object/create": 55 }], 255: [function (e, t, r) { "use strict"; var n = e("babel-runtime/core-js/object/create"), o = function (e) { return e && e.__esModule ? e : { default: e } }(n); (function () { var r, n, i = function (e, t) { function r() { this.constructor = e } for (var n in t) s.call(t, n) && (e[n] = t[n]); return r.prototype = t.prototype, e.prototype = new r, e.__super__ = t.prototype, e }, s = {}.hasOwnProperty; r = e("./NodeType"), n = e("./XMLCharacterData"), t.exports = function (e) { function t(e, n) { if (t.__super__.constructor.call(this, e), null == n) throw new Error("Missing CDATA text. " + this.debugInfo()); this.name = "#cdata-section", this.type = r.CData, this.value = this.stringify.cdata(n) } return i(t, e), t.prototype.clone = function () { return (0, o.default)(this) }, t.prototype.toString = function (e) { return this.options.writer.cdata(this, this.options.writer.filterOptions(e)) }, t }(n) }).call(void 0) }, { "./NodeType": 251, "./XMLCharacterData": 256, "babel-runtime/core-js/object/create": 55 }], 256: [function (e, t, r) { "use strict"; var n = e("babel-runtime/core-js/object/create"), o = function (e) { return e && e.__esModule ? e : { default: e } }(n); (function () { var r, n = function (e, t) { function r() { this.constructor = e } for (var n in t) i.call(t, n) && (e[n] = t[n]); return r.prototype = t.prototype, e.prototype = new r, e.__super__ = t.prototype, e }, i = {}.hasOwnProperty; r = e("./XMLNode"), t.exports = function (e) { function t(e) { t.__super__.constructor.call(this, e), this.value = "" } return n(t, e), Object.defineProperty(t.prototype, "data", { get: function () { return this.value }, set: function (e) { return this.value = e || "" } }), Object.defineProperty(t.prototype, "length", { get: function () { return this.value.length } }), Object.defineProperty(t.prototype, "textContent", { get: function () { return this.value }, set: function (e) { return this.value = e || "" } }), t.prototype.clone = function () { return (0, o.default)(this) }, t.prototype.substringData = function (e, t) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.appendData = function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.insertData = function (e, t) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.deleteData = function (e, t) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.replaceData = function (e, t, r) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.isEqualNode = function (e) { return !!t.__super__.isEqualNode.apply(this, arguments).isEqualNode(e) && e.data === this.data }, t }(r) }).call(void 0) }, { "./XMLNode": 273, "babel-runtime/core-js/object/create": 55 }], 257: [function (e, t, r) { "use strict"; var n = e("babel-runtime/core-js/object/create"), o = function (e) { return e && e.__esModule ? e : { default: e } }(n); (function () { var r, n, i = function (e, t) { function r() { this.constructor = e } for (var n in t) s.call(t, n) && (e[n] = t[n]); return r.prototype = t.prototype, e.prototype = new r, e.__super__ = t.prototype, e }, s = {}.hasOwnProperty; r = e("./NodeType"), n = e("./XMLCharacterData"), t.exports = function (e) { function t(e, n) { if (t.__super__.constructor.call(this, e), null == n) throw new Error("Missing comment text. " + this.debugInfo()); this.name = "#comment", this.type = r.Comment, this.value = this.stringify.comment(n) } return i(t, e), t.prototype.clone = function () { return (0, o.default)(this) }, t.prototype.toString = function (e) { return this.options.writer.comment(this, this.options.writer.filterOptions(e)) }, t }(n) }).call(void 0) }, { "./NodeType": 251, "./XMLCharacterData": 256, "babel-runtime/core-js/object/create": 55 }], 258: [function (e, t, r) { "use strict"; function n(e) { return e && e.__esModule ? e : { default: e } } var o = e("babel-runtime/core-js/object/keys"), i = n(o), s = e("babel-runtime/core-js/object/create"), a = n(s); (function () { var r, n; r = e("./XMLDOMErrorHandler"), n = e("./XMLDOMStringList"), t.exports = function () { function e() { this.defaultParams = { "canonical-form": !1, "cdata-sections": !1, comments: !1, "datatype-normalization": !1, "element-content-whitespace": !0, entities: !0, "error-handler": new r, infoset: !0, "validate-if-schema": !1, namespaces: !0, "namespace-declarations": !0, "normalize-characters": !1, "schema-location": "", "schema-type": "", "split-cdata-sections": !0, validate: !1, "well-formed": !0 }, this.params = (0, a.default)(this.defaultParams) } return Object.defineProperty(e.prototype, "parameterNames", { get: function () { return new n((0, i.default)(this.defaultParams)) } }), e.prototype.getParameter = function (e) { return this.params.hasOwnProperty(e) ? this.params[e] : null }, e.prototype.canSetParameter = function (e, t) { return !0 }, e.prototype.setParameter = function (e, t) { return null != t ? this.params[e] = t : delete this.params[e] }, e }() }).call(void 0) }, { "./XMLDOMErrorHandler": 259, "./XMLDOMStringList": 261, "babel-runtime/core-js/object/create": 55, "babel-runtime/core-js/object/keys": 60 }], 259: [function (e, t, r) { "use strict"; (function () { t.exports = function () { function e() { } return e.prototype.handleError = function (e) { throw new Error(e) }, e }() }).call(void 0) }, {}], 260: [function (e, t, r) { "use strict"; (function () { t.exports = function () { function e() { } return e.prototype.hasFeature = function (e, t) { return !0 }, e.prototype.createDocumentType = function (e, t, r) { throw new Error("This DOM method is not implemented.") }, e.prototype.createDocument = function (e, t, r) { throw new Error("This DOM method is not implemented.") }, e.prototype.createHTMLDocument = function (e) { throw new Error("This DOM method is not implemented.") }, e.prototype.getFeature = function (e, t) { throw new Error("This DOM method is not implemented.") }, e }() }).call(void 0) }, {}], 261: [function (e, t, r) { "use strict"; (function () { t.exports = function () { function e(e) { this.arr = e || [] } return Object.defineProperty(e.prototype, "length", { get: function () { return this.arr.length } }), e.prototype.item = function (e) { return this.arr[e] || null }, e.prototype.contains = function (e) { return -1 !== this.arr.indexOf(e) }, e }() }).call(void 0) }, {}], 262: [function (e, t, r) { "use strict"; (function () { var r, n, o = function (e, t) { function r() { this.constructor = e } for (var n in t) i.call(t, n) && (e[n] = t[n]); return r.prototype = t.prototype, e.prototype = new r, e.__super__ = t.prototype, e }, i = {}.hasOwnProperty; n = e("./XMLNode"), r = e("./NodeType"), t.exports = function (e) { function t(e, n, o, i, s, a) { if (t.__super__.constructor.call(this, e), null == n) throw new Error("Missing DTD element name. " + this.debugInfo()); if (null == o) throw new Error("Missing DTD attribute name. " + this.debugInfo(n)); if (!i) throw new Error("Missing DTD attribute type. " + this.debugInfo(n)); if (!s) throw new Error("Missing DTD attribute default. " + this.debugInfo(n)); if (0 !== s.indexOf("#") && (s = "#" + s), !s.match(/^(#REQUIRED|#IMPLIED|#FIXED|#DEFAULT)$/)) throw new Error("Invalid default value type; expected: #REQUIRED, #IMPLIED, #FIXED or #DEFAULT. " + this.debugInfo(n)); if (a && !s.match(/^(#FIXED|#DEFAULT)$/)) throw new Error("Default value only applies to #FIXED or #DEFAULT. " + this.debugInfo(n)); this.elementName = this.stringify.name(n), this.type = r.AttributeDeclaration, this.attributeName = this.stringify.name(o), this.attributeType = this.stringify.dtdAttType(i), a && (this.defaultValue = this.stringify.dtdAttDefault(a)), this.defaultValueType = s } return o(t, e), t.prototype.toString = function (e) { return this.options.writer.dtdAttList(this, this.options.writer.filterOptions(e)) }, t }(n) }).call(void 0) }, { "./NodeType": 251, "./XMLNode": 273 }], 263: [function (e, t, r) { "use strict"; (function () { var r, n, o = function (e, t) { function r() { this.constructor = e } for (var n in t) i.call(t, n) && (e[n] = t[n]); return r.prototype = t.prototype, e.prototype = new r, e.__super__ = t.prototype, e }, i = {}.hasOwnProperty; n = e("./XMLNode"), r = e("./NodeType"), t.exports = function (e) { function t(e, n, o) { if (t.__super__.constructor.call(this, e), null == n) throw new Error("Missing DTD element name. " + this.debugInfo()); o || (o = "(#PCDATA)"), Array.isArray(o) && (o = "(" + o.join(",") + ")"), this.name = this.stringify.name(n), this.type = r.ElementDeclaration, this.value = this.stringify.dtdElementValue(o) } return o(t, e), t.prototype.toString = function (e) { return this.options.writer.dtdElement(this, this.options.writer.filterOptions(e)) }, t }(n) }).call(void 0) }, { "./NodeType": 251, "./XMLNode": 273 }], 264: [function (e, t, r) { "use strict"; (function () { var r, n, o, i = function (e, t) { function r() { this.constructor = e } for (var n in t) s.call(t, n) && (e[n] = t[n]); return r.prototype = t.prototype, e.prototype = new r, e.__super__ = t.prototype, e }, s = {}.hasOwnProperty; o = e("./Utility").isObject, n = e("./XMLNode"), r = e("./NodeType"), t.exports = function (e) { function t(e, n, i, s) { if (t.__super__.constructor.call(this, e), null == i) throw new Error("Missing DTD entity name. " + this.debugInfo(i)); if (null == s) throw new Error("Missing DTD entity value. " + this.debugInfo(i)); if (this.pe = !!n, this.name = this.stringify.name(i), this.type = r.EntityDeclaration, o(s)) { if (!s.pubID && !s.sysID) throw new Error("Public and/or system identifiers are required for an external entity. " + this.debugInfo(i)); if (s.pubID && !s.sysID) throw new Error("System identifier is required for a public external entity. " + this.debugInfo(i)); if (this.internal = !1, null != s.pubID && (this.pubID = this.stringify.dtdPubID(s.pubID)), null != s.sysID && (this.sysID = this.stringify.dtdSysID(s.sysID)), null != s.nData && (this.nData = this.stringify.dtdNData(s.nData)), this.pe && this.nData) throw new Error("Notation declaration is not allowed in a parameter entity. " + this.debugInfo(i)) } else this.value = this.stringify.dtdEntityValue(s), this.internal = !0 } return i(t, e), Object.defineProperty(t.prototype, "publicId", { get: function () { return this.pubID } }), Object.defineProperty(t.prototype, "systemId", { get: function () { return this.sysID } }), Object.defineProperty(t.prototype, "notationName", { get: function () { return this.nData || null } }), Object.defineProperty(t.prototype, "inputEncoding", { get: function () { return null } }), Object.defineProperty(t.prototype, "xmlEncoding", { get: function () { return null } }), Object.defineProperty(t.prototype, "xmlVersion", { get: function () { return null } }), t.prototype.toString = function (e) { return this.options.writer.dtdEntity(this, this.options.writer.filterOptions(e)) }, t }(n) }).call(void 0) }, { "./NodeType": 251, "./Utility": 252, "./XMLNode": 273 }], 265: [function (e, t, r) { "use strict"; (function () { var r, n, o = function (e, t) { function r() { this.constructor = e } for (var n in t) i.call(t, n) && (e[n] = t[n]); return r.prototype = t.prototype, e.prototype = new r, e.__super__ = t.prototype, e }, i = {}.hasOwnProperty; n = e("./XMLNode"), r = e("./NodeType"), t.exports = function (e) { function t(e, n, o) { if (t.__super__.constructor.call(this, e), null == n) throw new Error("Missing DTD notation name. " + this.debugInfo(n)); if (!o.pubID && !o.sysID) throw new Error("Public or system identifiers are required for an external entity. " + this.debugInfo(n)); this.name = this.stringify.name(n), this.type = r.NotationDeclaration, null != o.pubID && (this.pubID = this.stringify.dtdPubID(o.pubID)), null != o.sysID && (this.sysID = this.stringify.dtdSysID(o.sysID)) } return o(t, e), Object.defineProperty(t.prototype, "publicId", { get: function () { return this.pubID } }), Object.defineProperty(t.prototype, "systemId", { get: function () { return this.sysID } }), t.prototype.toString = function (e) { return this.options.writer.dtdNotation(this, this.options.writer.filterOptions(e)) }, t }(n) }).call(void 0) }, { "./NodeType": 251, "./XMLNode": 273 }], 266: [function (e, t, r) { "use strict"; (function () { var r, n, o, i = function (e, t) { function r() { this.constructor = e } for (var n in t) s.call(t, n) && (e[n] = t[n]); return r.prototype = t.prototype, e.prototype = new r, e.__super__ = t.prototype, e }, s = {}.hasOwnProperty; o = e("./Utility").isObject, n = e("./XMLNode"), r = e("./NodeType"), t.exports = function (e) { function t(e, n, i, s) { var a; t.__super__.constructor.call(this, e), o(n) && (a = n, n = a.version, i = a.encoding, s = a.standalone), n || (n = "1.0"), this.type = r.Declaration, this.version = this.stringify.xmlVersion(n), null != i && (this.encoding = this.stringify.xmlEncoding(i)), null != s && (this.standalone = this.stringify.xmlStandalone(s)) } return i(t, e), t.prototype.toString = function (e) { return this.options.writer.declaration(this, this.options.writer.filterOptions(e)) }, t }(n) }).call(void 0) }, { "./NodeType": 251, "./Utility": 252, "./XMLNode": 273 }], 267: [function (e, t, r) { "use strict"; (function () { var r, n, o, i, s, a, u, c, l = function (e, t) { function r() { this.constructor = e } for (var n in t) f.call(t, n) && (e[n] = t[n]); return r.prototype = t.prototype, e.prototype = new r, e.__super__ = t.prototype, e }, f = {}.hasOwnProperty; c = e("./Utility").isObject, u = e("./XMLNode"), r = e("./NodeType"), n = e("./XMLDTDAttList"), i = e("./XMLDTDEntity"), o = e("./XMLDTDElement"), s = e("./XMLDTDNotation"), a = e("./XMLNamedNodeMap"), t.exports = function (e) { function t(e, n, o) { var i, s, a, u, l, f; if (t.__super__.constructor.call(this, e), this.type = r.DocType, e.children) for (u = e.children, s = 0, a = u.length; s < a; s++)if (i = u[s], i.type === r.Element) { this.name = i.name; break } this.documentObject = e, c(n) && (l = n, n = l.pubID, o = l.sysID), null == o && (f = [n, o], o = f[0], n = f[1]), null != n && (this.pubID = this.stringify.dtdPubID(n)), null != o && (this.sysID = this.stringify.dtdSysID(o)) } return l(t, e), Object.defineProperty(t.prototype, "entities", { get: function () { var e, t, n, o, i; for (o = {}, i = this.children, t = 0, n = i.length; t < n; t++)e = i[t], e.type !== r.EntityDeclaration || e.pe || (o[e.name] = e); return new a(o) } }), Object.defineProperty(t.prototype, "notations", { get: function () { var e, t, n, o, i; for (o = {}, i = this.children, t = 0, n = i.length; t < n; t++)e = i[t], e.type === r.NotationDeclaration && (o[e.name] = e); return new a(o) } }), Object.defineProperty(t.prototype, "publicId", { get: function () { return this.pubID } }), Object.defineProperty(t.prototype, "systemId", { get: function () { return this.sysID } }), Object.defineProperty(t.prototype, "internalSubset", { get: function () { throw new Error("This DOM method is not implemented." + this.debugInfo()) } }), t.prototype.element = function (e, t) { var r; return r = new o(this, e, t), this.children.push(r), this }, t.prototype.attList = function (e, t, r, o, i) { var s; return s = new n(this, e, t, r, o, i), this.children.push(s), this }, t.prototype.entity = function (e, t) { var r; return r = new i(this, !1, e, t), this.children.push(r), this }, t.prototype.pEntity = function (e, t) { var r; return r = new i(this, !0, e, t), this.children.push(r), this }, t.prototype.notation = function (e, t) { var r; return r = new s(this, e, t), this.children.push(r), this }, t.prototype.toString = function (e) { return this.options.writer.docType(this, this.options.writer.filterOptions(e)) }, t.prototype.ele = function (e, t) { return this.element(e, t) }, t.prototype.att = function (e, t, r, n, o) { return this.attList(e, t, r, n, o) }, t.prototype.ent = function (e, t) { return this.entity(e, t) }, t.prototype.pent = function (e, t) { return this.pEntity(e, t) }, t.prototype.not = function (e, t) { return this.notation(e, t) }, t.prototype.up = function () { return this.root() || this.documentObject }, t.prototype.isEqualNode = function (e) { return !!t.__super__.isEqualNode.apply(this, arguments).isEqualNode(e) && (e.name === this.name && (e.publicId === this.publicId && e.systemId === this.systemId)) }, t }(u) }).call(void 0) }, { "./NodeType": 251, "./Utility": 252, "./XMLDTDAttList": 262, "./XMLDTDElement": 263, "./XMLDTDEntity": 264, "./XMLDTDNotation": 265, "./XMLNamedNodeMap": 272, "./XMLNode": 273 }], 268: [function (e, t, r) { "use strict"; (function () { var r, n, o, i, s, a, u, c = function (e, t) { function r() { this.constructor = e } for (var n in t) l.call(t, n) && (e[n] = t[n]); return r.prototype = t.prototype, e.prototype = new r, e.__super__ = t.prototype, e }, l = {}.hasOwnProperty; u = e("./Utility").isPlainObject, o = e("./XMLDOMImplementation"), n = e("./XMLDOMConfiguration"), i = e("./XMLNode"), r = e("./NodeType"), a = e("./XMLStringifier"), s = e("./XMLStringWriter"), t.exports = function (e) { function t(e) { t.__super__.constructor.call(this, null), this.name = "#document", this.type = r.Document, this.documentURI = null, this.domConfig = new n, e || (e = {}), e.writer || (e.writer = new s), this.options = e, this.stringify = new a(e) } return c(t, e), Object.defineProperty(t.prototype, "implementation", { value: new o }), Object.defineProperty(t.prototype, "doctype", { get: function () { var e, t, n, o; for (o = this.children, t = 0, n = o.length; t < n; t++)if (e = o[t], e.type === r.DocType) return e; return null } }), Object.defineProperty(t.prototype, "documentElement", { get: function () { return this.rootObject || null } }), Object.defineProperty(t.prototype, "inputEncoding", { get: function () { return null } }), Object.defineProperty(t.prototype, "strictErrorChecking", { get: function () { return !1 } }), Object.defineProperty(t.prototype, "xmlEncoding", { get: function () { return 0 !== this.children.length && this.children[0].type === r.Declaration ? this.children[0].encoding : null } }), Object.defineProperty(t.prototype, "xmlStandalone", { get: function () { return 0 !== this.children.length && this.children[0].type === r.Declaration && "yes" === this.children[0].standalone } }), Object.defineProperty(t.prototype, "xmlVersion", { get: function () { return 0 !== this.children.length && this.children[0].type === r.Declaration ? this.children[0].version : "1.0" } }), Object.defineProperty(t.prototype, "URL", { get: function () { return this.documentURI } }), Object.defineProperty(t.prototype, "origin", { get: function () { return null } }), Object.defineProperty(t.prototype, "compatMode", { get: function () { return null } }), Object.defineProperty(t.prototype, "characterSet", { get: function () { return null } }), Object.defineProperty(t.prototype, "contentType", { get: function () { return null } }), t.prototype.end = function (e) { var t; return t = {}, e ? u(e) && (t = e, e = this.options.writer) : e = this.options.writer, e.document(this, e.filterOptions(t)) }, t.prototype.toString = function (e) { return this.options.writer.document(this, this.options.writer.filterOptions(e)) }, t.prototype.createElement = function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.createDocumentFragment = function () { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.createTextNode = function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.createComment = function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.createCDATASection = function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.createProcessingInstruction = function (e, t) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.createAttribute = function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.createEntityReference = function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.getElementsByTagName = function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.importNode = function (e, t) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.createElementNS = function (e, t) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.createAttributeNS = function (e, t) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.getElementsByTagNameNS = function (e, t) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.getElementById = function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.adoptNode = function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.normalizeDocument = function () { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.renameNode = function (e, t, r) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.getElementsByClassName = function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.createEvent = function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.createRange = function () { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.createNodeIterator = function (e, t, r) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.createTreeWalker = function (e, t, r) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t }(i) }).call(void 0) }, { "./NodeType": 251, "./Utility": 252, "./XMLDOMConfiguration": 258, "./XMLDOMImplementation": 260, "./XMLNode": 273, "./XMLStringWriter": 278, "./XMLStringifier": 279 }], 269: [function (e, t, r) {
      "use strict"; (function () {
        var r, n, o, i, s, a, u, c, l, f, p, h, d, m, b, y, g, v, _, w, x, E, T, S = {}.hasOwnProperty; T = e("./Utility"), x = T.isObject, w = T.isFunction, E = T.isPlainObject, _ = T.getValue, r = e("./NodeType"), h = e("./XMLDocument"), d = e("./XMLElement"), i = e("./XMLCData"), s = e("./XMLComment"), b = e("./XMLRaw"), v = e("./XMLText"), m = e("./XMLProcessingInstruction"), f = e("./XMLDeclaration"), p = e("./XMLDocType"), a = e("./XMLDTDAttList"), c = e("./XMLDTDEntity"), u = e("./XMLDTDElement"), l = e("./XMLDTDNotation"), o = e("./XMLAttribute"), g = e("./XMLStringifier"), y = e("./XMLStringWriter"), n = e("./WriterState"), t.exports = function () {
          function e(e, t, n) { var o; this.name = "?xml", this.type = r.Document, e || (e = {}), o = {}, e.writer ? E(e.writer) && (o = e.writer, e.writer = new y) : e.writer = new y, this.options = e, this.writer = e.writer, this.writerOptions = this.writer.filterOptions(o), this.stringify = new g(e), this.onDataCallback = t || function () { }, this.onEndCallback = n || function () { }, this.currentNode = null, this.currentLevel = -1, this.openTags = {}, this.documentStarted = !1, this.documentCompleted = !1, this.root = null } return e.prototype.createChildNode = function (e) { var t, n, o, i, s, a, u, c; switch (e.type) { case r.CData: this.cdata(e.value); break; case r.Comment: this.comment(e.value); break; case r.Element: o = {}, u = e.attribs; for (n in u) S.call(u, n) && (t = u[n], o[n] = t.value); this.node(e.name, o); break; case r.Dummy: this.dummy(); break; case r.Raw: this.raw(e.value); break; case r.Text: this.text(e.value); break; case r.ProcessingInstruction: this.instruction(e.target, e.value); break; default: throw new Error("This XML node type is not supported in a JS object: " + e.constructor.name) }for (c = e.children, s = 0, a = c.length; s < a; s++)i = c[s], this.createChildNode(i), i.type === r.Element && this.up(); return this }, e.prototype.dummy = function () { return this }, e.prototype.node = function (e, t, r) { var n; if (null == e) throw new Error("Missing node name."); if (this.root && -1 === this.currentLevel) throw new Error("Document can only have one root node. " + this.debugInfo(e)); return this.openCurrent(), e = _(e), null == t && (t = {}), t = _(t), x(t) || (n = [t, r], r = n[0], t = n[1]), this.currentNode = new d(this, e, t), this.currentNode.children = !1, this.currentLevel++, this.openTags[this.currentLevel] = this.currentNode, null != r && this.text(r), this }, e.prototype.element = function (e, t, n) { var o, i, s, a, u, c; if (this.currentNode && this.currentNode.type === r.DocType) this.dtdElement.apply(this, arguments); else if (Array.isArray(e) || x(e) || w(e)) for (a = this.options.noValidation, this.options.noValidation = !0, c = new h(this.options).element("TEMP_ROOT"), c.element(e), this.options.noValidation = a, u = c.children, i = 0, s = u.length; i < s; i++)o = u[i], this.createChildNode(o), o.type === r.Element && this.up(); else this.node(e, t, n); return this }, e.prototype.attribute = function (e, t) {
            var r, n; if (!this.currentNode || this.currentNode.children) throw new Error("att() can only be used immediately after an ele() call in callback mode. " + this.debugInfo(e)); if (null != e && (e = _(e)), x(e)) for (r in e) S.call(e, r) && (n = e[r], this.attribute(r, n)); else w(t) && (t = t.apply()),
              this.options.keepNullAttributes && null == t ? this.currentNode.attribs[e] = new o(this, e, "") : null != t && (this.currentNode.attribs[e] = new o(this, e, t)); return this
          }, e.prototype.text = function (e) { var t; return this.openCurrent(), t = new v(this, e), this.onData(this.writer.text(t, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this }, e.prototype.cdata = function (e) { var t; return this.openCurrent(), t = new i(this, e), this.onData(this.writer.cdata(t, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this }, e.prototype.comment = function (e) { var t; return this.openCurrent(), t = new s(this, e), this.onData(this.writer.comment(t, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this }, e.prototype.raw = function (e) { var t; return this.openCurrent(), t = new b(this, e), this.onData(this.writer.raw(t, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this }, e.prototype.instruction = function (e, t) { var r, n, o, i, s; if (this.openCurrent(), null != e && (e = _(e)), null != t && (t = _(t)), Array.isArray(e)) for (r = 0, i = e.length; r < i; r++)n = e[r], this.instruction(n); else if (x(e)) for (n in e) S.call(e, n) && (o = e[n], this.instruction(n, o)); else w(t) && (t = t.apply()), s = new m(this, e, t), this.onData(this.writer.processingInstruction(s, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1); return this }, e.prototype.declaration = function (e, t, r) { var n; if (this.openCurrent(), this.documentStarted) throw new Error("declaration() must be the first node."); return n = new f(this, e, t, r), this.onData(this.writer.declaration(n, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this }, e.prototype.doctype = function (e, t, r) { if (this.openCurrent(), null == e) throw new Error("Missing root node name."); if (this.root) throw new Error("dtd() must come before the root node."); return this.currentNode = new p(this, t, r), this.currentNode.rootNodeName = e, this.currentNode.children = !1, this.currentLevel++, this.openTags[this.currentLevel] = this.currentNode, this }, e.prototype.dtdElement = function (e, t) { var r; return this.openCurrent(), r = new u(this, e, t), this.onData(this.writer.dtdElement(r, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this }, e.prototype.attList = function (e, t, r, n, o) { var i; return this.openCurrent(), i = new a(this, e, t, r, n, o), this.onData(this.writer.dtdAttList(i, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this }, e.prototype.entity = function (e, t) { var r; return this.openCurrent(), r = new c(this, !1, e, t), this.onData(this.writer.dtdEntity(r, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this }, e.prototype.pEntity = function (e, t) { var r; return this.openCurrent(), r = new c(this, !0, e, t), this.onData(this.writer.dtdEntity(r, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this }, e.prototype.notation = function (e, t) { var r; return this.openCurrent(), r = new l(this, e, t), this.onData(this.writer.dtdNotation(r, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1), this }, e.prototype.up = function () { if (this.currentLevel < 0) throw new Error("The document node has no parent."); return this.currentNode ? (this.currentNode.children ? this.closeNode(this.currentNode) : this.openNode(this.currentNode), this.currentNode = null) : this.closeNode(this.openTags[this.currentLevel]), delete this.openTags[this.currentLevel], this.currentLevel--, this }, e.prototype.end = function () { for (; this.currentLevel >= 0;)this.up(); return this.onEnd() }, e.prototype.openCurrent = function () { if (this.currentNode) return this.currentNode.children = !0, this.openNode(this.currentNode) }, e.prototype.openNode = function (e) { var t, o, i, s; if (!e.isOpen) { if (this.root || 0 !== this.currentLevel || e.type !== r.Element || (this.root = e), o = "", e.type === r.Element) { this.writerOptions.state = n.OpenTag, o = this.writer.indent(e, this.writerOptions, this.currentLevel) + "<" + e.name, s = e.attribs; for (i in s) S.call(s, i) && (t = s[i], o += this.writer.attribute(t, this.writerOptions, this.currentLevel)); o += (e.children ? ">" : "/>") + this.writer.endline(e, this.writerOptions, this.currentLevel), this.writerOptions.state = n.InsideTag } else this.writerOptions.state = n.OpenTag, o = this.writer.indent(e, this.writerOptions, this.currentLevel) + "<!DOCTYPE " + e.rootNodeName, e.pubID && e.sysID ? o += ' PUBLIC "' + e.pubID + '" "' + e.sysID + '"' : e.sysID && (o += ' SYSTEM "' + e.sysID + '"'), e.children ? (o += " [", this.writerOptions.state = n.InsideTag) : (this.writerOptions.state = n.CloseTag, o += ">"), o += this.writer.endline(e, this.writerOptions, this.currentLevel); return this.onData(o, this.currentLevel), e.isOpen = !0 } }, e.prototype.closeNode = function (e) { var t; if (!e.isClosed) return t = "", this.writerOptions.state = n.CloseTag, t = e.type === r.Element ? this.writer.indent(e, this.writerOptions, this.currentLevel) + "</" + e.name + ">" + this.writer.endline(e, this.writerOptions, this.currentLevel) : this.writer.indent(e, this.writerOptions, this.currentLevel) + "]>" + this.writer.endline(e, this.writerOptions, this.currentLevel), this.writerOptions.state = n.None, this.onData(t, this.currentLevel), e.isClosed = !0 }, e.prototype.onData = function (e, t) { return this.documentStarted = !0, this.onDataCallback(e, t + 1) }, e.prototype.onEnd = function () { return this.documentCompleted = !0, this.onEndCallback() }, e.prototype.debugInfo = function (e) { return null == e ? "" : "node: <" + e + ">" }, e.prototype.ele = function () { return this.element.apply(this, arguments) }, e.prototype.nod = function (e, t, r) { return this.node(e, t, r) }, e.prototype.txt = function (e) { return this.text(e) }, e.prototype.dat = function (e) { return this.cdata(e) }, e.prototype.com = function (e) { return this.comment(e) }, e.prototype.ins = function (e, t) { return this.instruction(e, t) }, e.prototype.dec = function (e, t, r) { return this.declaration(e, t, r) }, e.prototype.dtd = function (e, t, r) { return this.doctype(e, t, r) }, e.prototype.e = function (e, t, r) { return this.element(e, t, r) }, e.prototype.n = function (e, t, r) { return this.node(e, t, r) }, e.prototype.t = function (e) { return this.text(e) }, e.prototype.d = function (e) { return this.cdata(e) }, e.prototype.c = function (e) { return this.comment(e) }, e.prototype.r = function (e) { return this.raw(e) }, e.prototype.i = function (e, t) { return this.instruction(e, t) }, e.prototype.att = function () { return this.currentNode && this.currentNode.type === r.DocType ? this.attList.apply(this, arguments) : this.attribute.apply(this, arguments) }, e.prototype.a = function () { return this.currentNode && this.currentNode.type === r.DocType ? this.attList.apply(this, arguments) : this.attribute.apply(this, arguments) }, e.prototype.ent = function (e, t) { return this.entity(e, t) }, e.prototype.pent = function (e, t) { return this.pEntity(e, t) }, e.prototype.not = function (e, t) { return this.notation(e, t) }, e
        }()
      }).call(void 0)
    }, { "./NodeType": 251, "./Utility": 252, "./WriterState": 253, "./XMLAttribute": 254, "./XMLCData": 255, "./XMLComment": 257, "./XMLDTDAttList": 262, "./XMLDTDElement": 263, "./XMLDTDEntity": 264, "./XMLDTDNotation": 265, "./XMLDeclaration": 266, "./XMLDocType": 267, "./XMLDocument": 268, "./XMLElement": 271, "./XMLProcessingInstruction": 275, "./XMLRaw": 276, "./XMLStringWriter": 278, "./XMLStringifier": 279, "./XMLText": 280 }], 270: [function (e, t, r) { "use strict"; var n = e("babel-runtime/core-js/object/create"), o = function (e) { return e && e.__esModule ? e : { default: e } }(n); (function () { var r, n, i = function (e, t) { function r() { this.constructor = e } for (var n in t) s.call(t, n) && (e[n] = t[n]); return r.prototype = t.prototype, e.prototype = new r, e.__super__ = t.prototype, e }, s = {}.hasOwnProperty; n = e("./XMLNode"), r = e("./NodeType"), t.exports = function (e) { function t(e) { t.__super__.constructor.call(this, e), this.type = r.Dummy } return i(t, e), t.prototype.clone = function () { return (0, o.default)(this) }, t.prototype.toString = function (e) { return "" }, t }(n) }).call(void 0) }, { "./NodeType": 251, "./XMLNode": 273, "babel-runtime/core-js/object/create": 55 }], 271: [function (e, t, r) { "use strict"; var n = e("babel-runtime/core-js/object/create"), o = function (e) { return e && e.__esModule ? e : { default: e } }(n); (function () { var r, n, i, s, a, u, c, l, f = function (e, t) { function r() { this.constructor = e } for (var n in t) p.call(t, n) && (e[n] = t[n]); return r.prototype = t.prototype, e.prototype = new r, e.__super__ = t.prototype, e }, p = {}.hasOwnProperty; l = e("./Utility"), c = l.isObject, u = l.isFunction, a = l.getValue, s = e("./XMLNode"), r = e("./NodeType"), n = e("./XMLAttribute"), i = e("./XMLNamedNodeMap"), t.exports = function (e) { function t(e, n, o) { var i, s, a, u; if (t.__super__.constructor.call(this, e), null == n) throw new Error("Missing element name. " + this.debugInfo()); if (this.name = this.stringify.name(n), this.type = r.Element, this.attribs = {}, this.schemaTypeInfo = null, null != o && this.attribute(o), e.type === r.Document && (this.isRoot = !0, this.documentObject = e, e.rootObject = this, e.children)) for (u = e.children, s = 0, a = u.length; s < a; s++)if (i = u[s], i.type === r.DocType) { i.name = this.name; break } } return f(t, e), Object.defineProperty(t.prototype, "tagName", { get: function () { return this.name } }), Object.defineProperty(t.prototype, "namespaceURI", { get: function () { return "" } }), Object.defineProperty(t.prototype, "prefix", { get: function () { return "" } }), Object.defineProperty(t.prototype, "localName", { get: function () { return this.name } }), Object.defineProperty(t.prototype, "id", { get: function () { throw new Error("This DOM method is not implemented." + this.debugInfo()) } }), Object.defineProperty(t.prototype, "className", { get: function () { throw new Error("This DOM method is not implemented." + this.debugInfo()) } }), Object.defineProperty(t.prototype, "classList", { get: function () { throw new Error("This DOM method is not implemented." + this.debugInfo()) } }), Object.defineProperty(t.prototype, "attributes", { get: function () { return this.attributeMap && this.attributeMap.nodes || (this.attributeMap = new i(this.attribs)), this.attributeMap } }), t.prototype.clone = function () { var e, t, r, n; r = (0, o.default)(this), r.isRoot && (r.documentObject = null), r.attribs = {}, n = this.attribs; for (t in n) p.call(n, t) && (e = n[t], r.attribs[t] = e.clone()); return r.children = [], this.children.forEach(function (e) { var t; return t = e.clone(), t.parent = r, r.children.push(t) }), r }, t.prototype.attribute = function (e, t) { var r, o; if (null != e && (e = a(e)), c(e)) for (r in e) p.call(e, r) && (o = e[r], this.attribute(r, o)); else u(t) && (t = t.apply()), this.options.keepNullAttributes && null == t ? this.attribs[e] = new n(this, e, "") : null != t && (this.attribs[e] = new n(this, e, t)); return this }, t.prototype.removeAttribute = function (e) { var t, r, n; if (null == e) throw new Error("Missing attribute name. " + this.debugInfo()); if (e = a(e), Array.isArray(e)) for (r = 0, n = e.length; r < n; r++)t = e[r], delete this.attribs[t]; else delete this.attribs[e]; return this }, t.prototype.toString = function (e) { return this.options.writer.element(this, this.options.writer.filterOptions(e)) }, t.prototype.att = function (e, t) { return this.attribute(e, t) }, t.prototype.a = function (e, t) { return this.attribute(e, t) }, t.prototype.getAttribute = function (e) { return this.attribs.hasOwnProperty(e) ? this.attribs[e].value : null }, t.prototype.setAttribute = function (e, t) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.getAttributeNode = function (e) { return this.attribs.hasOwnProperty(e) ? this.attribs[e] : null }, t.prototype.setAttributeNode = function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.removeAttributeNode = function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.getElementsByTagName = function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.getAttributeNS = function (e, t) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.setAttributeNS = function (e, t, r) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.removeAttributeNS = function (e, t) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.getAttributeNodeNS = function (e, t) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.setAttributeNodeNS = function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.getElementsByTagNameNS = function (e, t) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.hasAttribute = function (e) { return this.attribs.hasOwnProperty(e) }, t.prototype.hasAttributeNS = function (e, t) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.setIdAttribute = function (e, t) { return this.attribs.hasOwnProperty(e) ? this.attribs[e].isId : t }, t.prototype.setIdAttributeNS = function (e, t, r) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.setIdAttributeNode = function (e, t) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.getElementsByTagName = function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.getElementsByTagNameNS = function (e, t) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.getElementsByClassName = function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.isEqualNode = function (e) { var r, n, o; if (!t.__super__.isEqualNode.apply(this, arguments).isEqualNode(e)) return !1; if (e.namespaceURI !== this.namespaceURI) return !1; if (e.prefix !== this.prefix) return !1; if (e.localName !== this.localName) return !1; if (e.attribs.length !== this.attribs.length) return !1; for (r = n = 0, o = this.attribs.length - 1; 0 <= o ? n <= o : n >= o; r = 0 <= o ? ++n : --n)if (!this.attribs[r].isEqualNode(e.attribs[r])) return !1; return !0 }, t }(s) }).call(void 0) }, { "./NodeType": 251, "./Utility": 252, "./XMLAttribute": 254, "./XMLNamedNodeMap": 272, "./XMLNode": 273, "babel-runtime/core-js/object/create": 55 }], 272: [function (e, t, r) { "use strict"; var n = e("babel-runtime/core-js/object/keys"), o = function (e) { return e && e.__esModule ? e : { default: e } }(n); (function () { t.exports = function () { function e(e) { this.nodes = e } return Object.defineProperty(e.prototype, "length", { get: function () { return (0, o.default)(this.nodes).length || 0 } }), e.prototype.clone = function () { return this.nodes = null }, e.prototype.getNamedItem = function (e) { return this.nodes[e] }, e.prototype.setNamedItem = function (e) { var t; return t = this.nodes[e.nodeName], this.nodes[e.nodeName] = e, t || null }, e.prototype.removeNamedItem = function (e) { var t; return t = this.nodes[e], delete this.nodes[e], t || null }, e.prototype.item = function (e) { return this.nodes[(0, o.default)(this.nodes)[e]] || null }, e.prototype.getNamedItemNS = function (e, t) { throw new Error("This DOM method is not implemented.") }, e.prototype.setNamedItemNS = function (e) { throw new Error("This DOM method is not implemented.") }, e.prototype.removeNamedItemNS = function (e, t) { throw new Error("This DOM method is not implemented.") }, e }() }).call(void 0) }, { "babel-runtime/core-js/object/keys": 60 }], 273: [function (e, t, r) { "use strict"; (function () { var r, n, o, i, s, a, u, c, l, f, p, h, d, m, b, y, g, v, _ = {}.hasOwnProperty; v = e("./Utility"), g = v.isObject, y = v.isFunction, b = v.isEmpty, m = v.getValue, c = null, o = null, i = null, s = null, a = null, h = null, d = null, p = null, u = null, n = null, f = null, l = null, r = null, t.exports = function () { function t(t) { this.parent = t, this.parent && (this.options = this.parent.options, this.stringify = this.parent.stringify), this.value = null, this.children = [], this.baseURI = null, c || (c = e("./XMLElement"), o = e("./XMLCData"), i = e("./XMLComment"), s = e("./XMLDeclaration"), a = e("./XMLDocType"), h = e("./XMLRaw"), d = e("./XMLText"), p = e("./XMLProcessingInstruction"), u = e("./XMLDummy"), n = e("./NodeType"), f = e("./XMLNodeList"), l = e("./XMLNamedNodeMap"), r = e("./DocumentPosition")) } return Object.defineProperty(t.prototype, "nodeName", { get: function () { return this.name } }), Object.defineProperty(t.prototype, "nodeType", { get: function () { return this.type } }), Object.defineProperty(t.prototype, "nodeValue", { get: function () { return this.value } }), Object.defineProperty(t.prototype, "parentNode", { get: function () { return this.parent } }), Object.defineProperty(t.prototype, "childNodes", { get: function () { return this.childNodeList && this.childNodeList.nodes || (this.childNodeList = new f(this.children)), this.childNodeList } }), Object.defineProperty(t.prototype, "firstChild", { get: function () { return this.children[0] || null } }), Object.defineProperty(t.prototype, "lastChild", { get: function () { return this.children[this.children.length - 1] || null } }), Object.defineProperty(t.prototype, "previousSibling", { get: function () { var e; return e = this.parent.children.indexOf(this), this.parent.children[e - 1] || null } }), Object.defineProperty(t.prototype, "nextSibling", { get: function () { var e; return e = this.parent.children.indexOf(this), this.parent.children[e + 1] || null } }), Object.defineProperty(t.prototype, "ownerDocument", { get: function () { return this.document() || null } }), Object.defineProperty(t.prototype, "textContent", { get: function () { var e, t, r, o, i; if (this.nodeType === n.Element || this.nodeType === n.DocumentFragment) { for (i = "", o = this.children, t = 0, r = o.length; t < r; t++)e = o[t], e.textContent && (i += e.textContent); return i } return null }, set: function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) } }), t.prototype.setParent = function (e) { var t, r, n, o, i; for (this.parent = e, e && (this.options = e.options, this.stringify = e.stringify), o = this.children, i = [], r = 0, n = o.length; r < n; r++)t = o[r], i.push(t.setParent(this)); return i }, t.prototype.element = function (e, t, r) { var n, o, i, s, a, u, c, l, f, p, h; if (u = null, null === t && null == r && (f = [{}, null], t = f[0], r = f[1]), null == t && (t = {}), t = m(t), g(t) || (p = [t, r], r = p[0], t = p[1]), null != e && (e = m(e)), Array.isArray(e)) for (i = 0, c = e.length; i < c; i++)o = e[i], u = this.element(o); else if (y(e)) u = this.element(e.apply()); else if (g(e)) { for (a in e) if (_.call(e, a)) if (h = e[a], y(h) && (h = h.apply()), !this.options.ignoreDecorators && this.stringify.convertAttKey && 0 === a.indexOf(this.stringify.convertAttKey)) u = this.attribute(a.substr(this.stringify.convertAttKey.length), h); else if (!this.options.separateArrayItems && Array.isArray(h) && b(h)) u = this.dummy(); else if (g(h) && b(h)) u = this.element(a); else if (this.options.keepNullNodes || null != h) if (!this.options.separateArrayItems && Array.isArray(h)) for (s = 0, l = h.length; s < l; s++)o = h[s], n = {}, n[a] = o, u = this.element(n); else g(h) ? !this.options.ignoreDecorators && this.stringify.convertTextKey && 0 === a.indexOf(this.stringify.convertTextKey) ? u = this.element(h) : (u = this.element(a), u.element(h)) : u = this.element(a, h); else u = this.dummy() } else u = this.options.keepNullNodes || null !== r ? !this.options.ignoreDecorators && this.stringify.convertTextKey && 0 === e.indexOf(this.stringify.convertTextKey) ? this.text(r) : !this.options.ignoreDecorators && this.stringify.convertCDataKey && 0 === e.indexOf(this.stringify.convertCDataKey) ? this.cdata(r) : !this.options.ignoreDecorators && this.stringify.convertCommentKey && 0 === e.indexOf(this.stringify.convertCommentKey) ? this.comment(r) : !this.options.ignoreDecorators && this.stringify.convertRawKey && 0 === e.indexOf(this.stringify.convertRawKey) ? this.raw(r) : !this.options.ignoreDecorators && this.stringify.convertPIKey && 0 === e.indexOf(this.stringify.convertPIKey) ? this.instruction(e.substr(this.stringify.convertPIKey.length), r) : this.node(e, t, r) : this.dummy(); if (null == u) throw new Error("Could not create any elements with: " + e + ". " + this.debugInfo()); return u }, t.prototype.insertBefore = function (e, t, r) { var n, o, i, s, a; if (null != e ? e.type : void 0) return i = e, s = t, i.setParent(this), s ? (o = children.indexOf(s), a = children.splice(o), children.push(i), Array.prototype.push.apply(children, a)) : children.push(i), i; if (this.isRoot) throw new Error("Cannot insert elements at root level. " + this.debugInfo(e)); return o = this.parent.children.indexOf(this), a = this.parent.children.splice(o), n = this.parent.element(e, t, r), Array.prototype.push.apply(this.parent.children, a), n }, t.prototype.insertAfter = function (e, t, r) { var n, o, i; if (this.isRoot) throw new Error("Cannot insert elements at root level. " + this.debugInfo(e)); return o = this.parent.children.indexOf(this), i = this.parent.children.splice(o + 1), n = this.parent.element(e, t, r), Array.prototype.push.apply(this.parent.children, i), n }, t.prototype.remove = function () { var e; if (this.isRoot) throw new Error("Cannot remove the root element. " + this.debugInfo()); return e = this.parent.children.indexOf(this), [].splice.apply(this.parent.children, [e, e - e + 1].concat([])), this.parent }, t.prototype.node = function (e, t, r) { var n, o; return null != e && (e = m(e)), t || (t = {}), t = m(t), g(t) || (o = [t, r], r = o[0], t = o[1]), n = new c(this, e, t), null != r && n.text(r), this.children.push(n), n }, t.prototype.text = function (e) { var t; return g(e) && this.element(e), t = new d(this, e), this.children.push(t), this }, t.prototype.cdata = function (e) { var t; return t = new o(this, e), this.children.push(t), this }, t.prototype.comment = function (e) { var t; return t = new i(this, e), this.children.push(t), this }, t.prototype.commentBefore = function (e) { var t, r; return t = this.parent.children.indexOf(this), r = this.parent.children.splice(t), this.parent.comment(e), Array.prototype.push.apply(this.parent.children, r), this }, t.prototype.commentAfter = function (e) { var t, r; return t = this.parent.children.indexOf(this), r = this.parent.children.splice(t + 1), this.parent.comment(e), Array.prototype.push.apply(this.parent.children, r), this }, t.prototype.raw = function (e) { var t; return t = new h(this, e), this.children.push(t), this }, t.prototype.dummy = function () { return new u(this) }, t.prototype.instruction = function (e, t) { var r, n, o, i, s; if (null != e && (e = m(e)), null != t && (t = m(t)), Array.isArray(e)) for (i = 0, s = e.length; i < s; i++)r = e[i], this.instruction(r); else if (g(e)) for (r in e) _.call(e, r) && (n = e[r], this.instruction(r, n)); else y(t) && (t = t.apply()), o = new p(this, e, t), this.children.push(o); return this }, t.prototype.instructionBefore = function (e, t) { var r, n; return r = this.parent.children.indexOf(this), n = this.parent.children.splice(r), this.parent.instruction(e, t), Array.prototype.push.apply(this.parent.children, n), this }, t.prototype.instructionAfter = function (e, t) { var r, n; return r = this.parent.children.indexOf(this), n = this.parent.children.splice(r + 1), this.parent.instruction(e, t), Array.prototype.push.apply(this.parent.children, n), this }, t.prototype.declaration = function (e, t, r) { var o, i; return o = this.document(), i = new s(o, e, t, r), 0 === o.children.length ? o.children.unshift(i) : o.children[0].type === n.Declaration ? o.children[0] = i : o.children.unshift(i), o.root() || o }, t.prototype.dtd = function (e, t) { var r, o, i, s, u, c, l, f, p, h; for (o = this.document(), i = new a(o, e, t), p = o.children, s = u = 0, l = p.length; u < l; s = ++u)if (r = p[s], r.type === n.DocType) return o.children[s] = i, i; for (h = o.children, s = c = 0, f = h.length; c < f; s = ++c)if (r = h[s], r.isRoot) return o.children.splice(s, 0, i), i; return o.children.push(i), i }, t.prototype.up = function () { if (this.isRoot) throw new Error("The root node has no parent. Use doc() if you need to get the document object."); return this.parent }, t.prototype.root = function () { var e; for (e = this; e;) { if (e.type === n.Document) return e.rootObject; if (e.isRoot) return e; e = e.parent } }, t.prototype.document = function () { var e; for (e = this; e;) { if (e.type === n.Document) return e; e = e.parent } }, t.prototype.end = function (e) { return this.document().end(e) }, t.prototype.prev = function () { var e; if ((e = this.parent.children.indexOf(this)) < 1) throw new Error("Already at the first node. " + this.debugInfo()); return this.parent.children[e - 1] }, t.prototype.next = function () { var e; if (-1 === (e = this.parent.children.indexOf(this)) || e === this.parent.children.length - 1) throw new Error("Already at the last node. " + this.debugInfo()); return this.parent.children[e + 1] }, t.prototype.importDocument = function (e) { var t; return t = e.root().clone(), t.parent = this, t.isRoot = !1, this.children.push(t), this }, t.prototype.debugInfo = function (e) { var t, r; return e = e || this.name, null != e || (null != (t = this.parent) ? t.name : void 0) ? null == e ? "parent: <" + this.parent.name + ">" : (null != (r = this.parent) ? r.name : void 0) ? "node: <" + e + ">, parent: <" + this.parent.name + ">" : "node: <" + e + ">" : "" }, t.prototype.ele = function (e, t, r) { return this.element(e, t, r) }, t.prototype.nod = function (e, t, r) { return this.node(e, t, r) }, t.prototype.txt = function (e) { return this.text(e) }, t.prototype.dat = function (e) { return this.cdata(e) }, t.prototype.com = function (e) { return this.comment(e) }, t.prototype.ins = function (e, t) { return this.instruction(e, t) }, t.prototype.doc = function () { return this.document() }, t.prototype.dec = function (e, t, r) { return this.declaration(e, t, r) }, t.prototype.e = function (e, t, r) { return this.element(e, t, r) }, t.prototype.n = function (e, t, r) { return this.node(e, t, r) }, t.prototype.t = function (e) { return this.text(e) }, t.prototype.d = function (e) { return this.cdata(e) }, t.prototype.c = function (e) { return this.comment(e) }, t.prototype.r = function (e) { return this.raw(e) }, t.prototype.i = function (e, t) { return this.instruction(e, t) }, t.prototype.u = function () { return this.up() }, t.prototype.importXMLBuilder = function (e) { return this.importDocument(e) }, t.prototype.replaceChild = function (e, t) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.removeChild = function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.appendChild = function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.hasChildNodes = function () { return 0 !== this.children.length }, t.prototype.cloneNode = function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.normalize = function () { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.isSupported = function (e, t) { return !0 }, t.prototype.hasAttributes = function () { return 0 !== this.attribs.length }, t.prototype.compareDocumentPosition = function (e) { var t, n; return t = this, t === e ? 0 : this.document() !== e.document() ? (n = r.Disconnected | r.ImplementationSpecific, Math.random() < .5 ? n |= r.Preceding : n |= r.Following, n) : t.isAncestor(e) ? r.Contains | r.Preceding : t.isDescendant(e) ? r.Contains | r.Following : t.isPreceding(e) ? r.Preceding : r.Following }, t.prototype.isSameNode = function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.lookupPrefix = function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.isDefaultNamespace = function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.lookupNamespaceURI = function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.isEqualNode = function (e) { var t, r, n; if (e.nodeType !== this.nodeType) return !1; if (e.children.length !== this.children.length) return !1; for (t = r = 0, n = this.children.length - 1; 0 <= n ? r <= n : r >= n; t = 0 <= n ? ++r : --r)if (!this.children[t].isEqualNode(e.children[t])) return !1; return !0 }, t.prototype.getFeature = function (e, t) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.setUserData = function (e, t, r) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.getUserData = function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.contains = function (e) { return !!e && (e === this || this.isDescendant(e)) }, t.prototype.isDescendant = function (e) { var t, r, n, o; for (o = this.children, r = 0, n = o.length; r < n; r++) { if (t = o[r], e === t) return !0; if (t.isDescendant(e)) return !0 } return !1 }, t.prototype.isAncestor = function (e) { return e.isDescendant(this) }, t.prototype.isPreceding = function (e) { var t, r; return t = this.treePosition(e), r = this.treePosition(this), -1 !== t && -1 !== r && t < r }, t.prototype.isFollowing = function (e) { var t, r; return t = this.treePosition(e), r = this.treePosition(this), -1 !== t && -1 !== r && t > r }, t.prototype.treePosition = function (e) { var t, r; return r = 0, t = !1, this.foreachTreeNode(this.document(), function (n) { if (r++, !t && n === e) return t = !0 }), t ? r : -1 }, t.prototype.foreachTreeNode = function (e, t) { var r, n, o, i, s; for (e || (e = this.document()), i = e.children, n = 0, o = i.length; n < o; n++) { if (r = i[n], s = t(r)) return s; if (s = this.foreachTreeNode(r, t)) return s } }, t }() }).call(void 0) }, { "./DocumentPosition": 250, "./NodeType": 251, "./Utility": 252, "./XMLCData": 255, "./XMLComment": 257, "./XMLDeclaration": 266, "./XMLDocType": 267, "./XMLDummy": 270, "./XMLElement": 271, "./XMLNamedNodeMap": 272, "./XMLNodeList": 274, "./XMLProcessingInstruction": 275, "./XMLRaw": 276, "./XMLText": 280 }], 274: [function (e, t, r) { "use strict"; (function () { t.exports = function () { function e(e) { this.nodes = e } return Object.defineProperty(e.prototype, "length", { get: function () { return this.nodes.length || 0 } }), e.prototype.clone = function () { return this.nodes = null }, e.prototype.item = function (e) { return this.nodes[e] || null }, e }() }).call(void 0) }, {}], 275: [function (e, t, r) { "use strict"; var n = e("babel-runtime/core-js/object/create"), o = function (e) { return e && e.__esModule ? e : { default: e } }(n); (function () { var r, n, i = function (e, t) { function r() { this.constructor = e } for (var n in t) s.call(t, n) && (e[n] = t[n]); return r.prototype = t.prototype, e.prototype = new r, e.__super__ = t.prototype, e }, s = {}.hasOwnProperty; r = e("./NodeType"), n = e("./XMLCharacterData"), t.exports = function (e) { function t(e, n, o) { if (t.__super__.constructor.call(this, e), null == n) throw new Error("Missing instruction target. " + this.debugInfo()); this.type = r.ProcessingInstruction, this.target = this.stringify.insTarget(n), this.name = this.target, o && (this.value = this.stringify.insValue(o)) } return i(t, e), t.prototype.clone = function () { return (0, o.default)(this) }, t.prototype.toString = function (e) { return this.options.writer.processingInstruction(this, this.options.writer.filterOptions(e)) }, t.prototype.isEqualNode = function (e) { return !!t.__super__.isEqualNode.apply(this, arguments).isEqualNode(e) && e.target === this.target }, t }(n) }).call(void 0) }, { "./NodeType": 251, "./XMLCharacterData": 256, "babel-runtime/core-js/object/create": 55 }], 276: [function (e, t, r) { "use strict"; var n = e("babel-runtime/core-js/object/create"), o = function (e) { return e && e.__esModule ? e : { default: e } }(n); (function () { var r, n, i = function (e, t) { function r() { this.constructor = e } for (var n in t) s.call(t, n) && (e[n] = t[n]); return r.prototype = t.prototype, e.prototype = new r, e.__super__ = t.prototype, e }, s = {}.hasOwnProperty; r = e("./NodeType"), n = e("./XMLNode"), t.exports = function (e) { function t(e, n) { if (t.__super__.constructor.call(this, e), null == n) throw new Error("Missing raw text. " + this.debugInfo()); this.type = r.Raw, this.value = this.stringify.raw(n) } return i(t, e), t.prototype.clone = function () { return (0, o.default)(this) }, t.prototype.toString = function (e) { return this.options.writer.raw(this, this.options.writer.filterOptions(e)) }, t }(n) }).call(void 0) }, { "./NodeType": 251, "./XMLNode": 273, "babel-runtime/core-js/object/create": 55 }], 277: [function (e, t, r) {
      "use strict"; (function () {
        var r, n, o, i = function (e, t) { function r() { this.constructor = e } for (var n in t) s.call(t, n) && (e[n] = t[n]); return r.prototype = t.prototype, e.prototype = new r, e.__super__ = t.prototype, e }, s = {}.hasOwnProperty; r = e("./NodeType"), o = e("./XMLWriterBase"), n = e("./WriterState"), t.exports = function (e) {
          function t(e, r) { this.stream = e, t.__super__.constructor.call(this, r) } return i(t, e), t.prototype.endline = function (e, r, o) { return e.isLastRootNode && r.state === n.CloseTag ? "" : t.__super__.endline.call(this, e, r, o) }, t.prototype.document = function (e, t) { var r, n, o, i, s, a, u, c, l; for (u = e.children, n = o = 0, s = u.length; o < s; n = ++o)r = u[n], r.isLastRootNode = n === e.children.length - 1; for (t = this.filterOptions(t), c = e.children, l = [], i = 0, a = c.length; i < a; i++)r = c[i], l.push(this.writeChildNode(r, t, 0)); return l }, t.prototype.attribute = function (e, r, n) { return this.stream.write(t.__super__.attribute.call(this, e, r, n)) }, t.prototype.cdata = function (e, r, n) { return this.stream.write(t.__super__.cdata.call(this, e, r, n)) }, t.prototype.comment = function (e, r, n) { return this.stream.write(t.__super__.comment.call(this, e, r, n)) }, t.prototype.declaration = function (e, r, n) { return this.stream.write(t.__super__.declaration.call(this, e, r, n)) }, t.prototype.docType = function (e, t, r) { var o, i, s, a; if (r || (r = 0), this.openNode(e, t, r), t.state = n.OpenTag, this.stream.write(this.indent(e, t, r)), this.stream.write("<!DOCTYPE " + e.root().name), e.pubID && e.sysID ? this.stream.write(' PUBLIC "' + e.pubID + '" "' + e.sysID + '"') : e.sysID && this.stream.write(' SYSTEM "' + e.sysID + '"'), e.children.length > 0) { for (this.stream.write(" ["), this.stream.write(this.endline(e, t, r)), t.state = n.InsideTag, a = e.children, i = 0, s = a.length; i < s; i++)o = a[i], this.writeChildNode(o, t, r + 1); t.state = n.CloseTag, this.stream.write("]") } return t.state = n.CloseTag, this.stream.write(t.spaceBeforeSlash + ">"), this.stream.write(this.endline(e, t, r)), t.state = n.None, this.closeNode(e, t, r) }, t.prototype.element = function (e, t, o) {
            var i, a, u, c, l, f, p, h, d; o || (o = 0), this.openNode(e, t, o), t.state = n.OpenTag, this.stream.write(this.indent(e, t, o) + "<" + e.name), h = e.attribs; for (p in h) s.call(h, p) && (i = h[p], this.attribute(i, t, o)); if (u = e.children.length, c = 0 === u ? null : e.children[0], 0 === u || e.children.every(function (e) { return (e.type === r.Text || e.type === r.Raw) && "" === e.value })) t.allowEmpty ? (this.stream.write(">"), t.state = n.CloseTag, this.stream.write("</" + e.name + ">")) : (t.state = n.CloseTag,
              this.stream.write(t.spaceBeforeSlash + "/>")); else if (!t.pretty || 1 !== u || c.type !== r.Text && c.type !== r.Raw || null == c.value) { for (this.stream.write(">" + this.endline(e, t, o)), t.state = n.InsideTag, d = e.children, l = 0, f = d.length; l < f; l++)a = d[l], this.writeChildNode(a, t, o + 1); t.state = n.CloseTag, this.stream.write(this.indent(e, t, o) + "</" + e.name + ">") } else this.stream.write(">"), t.state = n.InsideTag, t.suppressPrettyCount++, !0, this.writeChildNode(c, t, o + 1), t.suppressPrettyCount--, !1, t.state = n.CloseTag, this.stream.write("</" + e.name + ">"); return this.stream.write(this.endline(e, t, o)), t.state = n.None, this.closeNode(e, t, o)
          }, t.prototype.processingInstruction = function (e, r, n) { return this.stream.write(t.__super__.processingInstruction.call(this, e, r, n)) }, t.prototype.raw = function (e, r, n) { return this.stream.write(t.__super__.raw.call(this, e, r, n)) }, t.prototype.text = function (e, r, n) { return this.stream.write(t.__super__.text.call(this, e, r, n)) }, t.prototype.dtdAttList = function (e, r, n) { return this.stream.write(t.__super__.dtdAttList.call(this, e, r, n)) }, t.prototype.dtdElement = function (e, r, n) { return this.stream.write(t.__super__.dtdElement.call(this, e, r, n)) }, t.prototype.dtdEntity = function (e, r, n) { return this.stream.write(t.__super__.dtdEntity.call(this, e, r, n)) }, t.prototype.dtdNotation = function (e, r, n) { return this.stream.write(t.__super__.dtdNotation.call(this, e, r, n)) }, t
        }(o)
      }).call(void 0)
    }, { "./NodeType": 251, "./WriterState": 253, "./XMLWriterBase": 281 }], 278: [function (e, t, r) { "use strict"; (function () { var r, n = function (e, t) { function r() { this.constructor = e } for (var n in t) o.call(t, n) && (e[n] = t[n]); return r.prototype = t.prototype, e.prototype = new r, e.__super__ = t.prototype, e }, o = {}.hasOwnProperty; r = e("./XMLWriterBase"), t.exports = function (e) { function t(e) { t.__super__.constructor.call(this, e) } return n(t, e), t.prototype.document = function (e, t) { var r, n, o, i, s; for (t = this.filterOptions(t), i = "", s = e.children, n = 0, o = s.length; n < o; n++)r = s[n], i += this.writeChildNode(r, t, 0); return t.pretty && i.slice(-t.newline.length) === t.newline && (i = i.slice(0, -t.newline.length)), i }, t }(r) }).call(void 0) }, { "./XMLWriterBase": 281 }], 279: [function (e, t, r) { "use strict"; (function () { var e = function (e, t) { return function () { return e.apply(t, arguments) } }, r = {}.hasOwnProperty; t.exports = function () { function t(t) { this.assertLegalName = e(this.assertLegalName, this), this.assertLegalChar = e(this.assertLegalChar, this); var n, o, i; t || (t = {}), this.options = t, this.options.version || (this.options.version = "1.0"), o = t.stringify || {}; for (n in o) r.call(o, n) && (i = o[n], this[n] = i) } return t.prototype.name = function (e) { return this.options.noValidation ? e : this.assertLegalName("" + e || "") }, t.prototype.text = function (e) { return this.options.noValidation ? e : this.assertLegalChar(this.textEscape("" + e || "")) }, t.prototype.cdata = function (e) { return this.options.noValidation ? e : (e = "" + e || "", e = e.replace("]]>", "]]]]><![CDATA[>"), this.assertLegalChar(e)) }, t.prototype.comment = function (e) { if (this.options.noValidation) return e; if (e = "" + e || "", e.match(/--/)) throw new Error("Comment text cannot contain double-hypen: " + e); return this.assertLegalChar(e) }, t.prototype.raw = function (e) { return this.options.noValidation ? e : "" + e || "" }, t.prototype.attValue = function (e) { return this.options.noValidation ? e : this.assertLegalChar(this.attEscape(e = "" + e || "")) }, t.prototype.insTarget = function (e) { return this.options.noValidation ? e : this.assertLegalChar("" + e || "") }, t.prototype.insValue = function (e) { if (this.options.noValidation) return e; if (e = "" + e || "", e.match(/\?>/)) throw new Error("Invalid processing instruction value: " + e); return this.assertLegalChar(e) }, t.prototype.xmlVersion = function (e) { if (this.options.noValidation) return e; if (e = "" + e || "", !e.match(/1\.[0-9]+/)) throw new Error("Invalid version number: " + e); return e }, t.prototype.xmlEncoding = function (e) { if (this.options.noValidation) return e; if (e = "" + e || "", !e.match(/^[A-Za-z](?:[A-Za-z0-9._-])*$/)) throw new Error("Invalid encoding: " + e); return this.assertLegalChar(e) }, t.prototype.xmlStandalone = function (e) { return this.options.noValidation ? e : e ? "yes" : "no" }, t.prototype.dtdPubID = function (e) { return this.options.noValidation ? e : this.assertLegalChar("" + e || "") }, t.prototype.dtdSysID = function (e) { return this.options.noValidation ? e : this.assertLegalChar("" + e || "") }, t.prototype.dtdElementValue = function (e) { return this.options.noValidation ? e : this.assertLegalChar("" + e || "") }, t.prototype.dtdAttType = function (e) { return this.options.noValidation ? e : this.assertLegalChar("" + e || "") }, t.prototype.dtdAttDefault = function (e) { return this.options.noValidation ? e : this.assertLegalChar("" + e || "") }, t.prototype.dtdEntityValue = function (e) { return this.options.noValidation ? e : this.assertLegalChar("" + e || "") }, t.prototype.dtdNData = function (e) { return this.options.noValidation ? e : this.assertLegalChar("" + e || "") }, t.prototype.convertAttKey = "@", t.prototype.convertPIKey = "?", t.prototype.convertTextKey = "#text", t.prototype.convertCDataKey = "#cdata", t.prototype.convertCommentKey = "#comment", t.prototype.convertRawKey = "#raw", t.prototype.assertLegalChar = function (e) { var t, r; if (this.options.noValidation) return e; if (t = "", "1.0" === this.options.version) { if (t = /[\0-\x08\x0B\f\x0E-\x1F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, r = e.match(t)) throw new Error("Invalid character in string: " + e + " at index " + r.index) } else if ("1.1" === this.options.version && (t = /[\0\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, r = e.match(t))) throw new Error("Invalid character in string: " + e + " at index " + r.index); return e }, t.prototype.assertLegalName = function (e) { var t; if (this.options.noValidation) return e; if (this.assertLegalChar(e), t = /^([:A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])([\x2D\.0-:A-Z_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/, !e.match(t)) throw new Error("Invalid character in name"); return e }, t.prototype.textEscape = function (e) { var t; return this.options.noValidation ? e : (t = this.options.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g, e.replace(t, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "&#xD;")) }, t.prototype.attEscape = function (e) { var t; return this.options.noValidation ? e : (t = this.options.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g, e.replace(t, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/\t/g, "&#x9;").replace(/\n/g, "&#xA;").replace(/\r/g, "&#xD;")) }, t }() }).call(void 0) }, {}], 280: [function (e, t, r) { "use strict"; var n = e("babel-runtime/core-js/object/create"), o = function (e) { return e && e.__esModule ? e : { default: e } }(n); (function () { var r, n, i = function (e, t) { function r() { this.constructor = e } for (var n in t) s.call(t, n) && (e[n] = t[n]); return r.prototype = t.prototype, e.prototype = new r, e.__super__ = t.prototype, e }, s = {}.hasOwnProperty; r = e("./NodeType"), n = e("./XMLCharacterData"), t.exports = function (e) { function t(e, n) { if (t.__super__.constructor.call(this, e), null == n) throw new Error("Missing element text. " + this.debugInfo()); this.name = "#text", this.type = r.Text, this.value = this.stringify.text(n) } return i(t, e), Object.defineProperty(t.prototype, "isElementContentWhitespace", { get: function () { throw new Error("This DOM method is not implemented." + this.debugInfo()) } }), Object.defineProperty(t.prototype, "wholeText", { get: function () { var e, t, r; for (r = "", t = this.previousSibling; t;)r = t.data + r, t = t.previousSibling; for (r += this.data, e = this.nextSibling; e;)r += e.data, e = e.nextSibling; return r } }), t.prototype.clone = function () { return (0, o.default)(this) }, t.prototype.toString = function (e) { return this.options.writer.text(this, this.options.writer.filterOptions(e)) }, t.prototype.splitText = function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t.prototype.replaceWholeText = function (e) { throw new Error("This DOM method is not implemented." + this.debugInfo()) }, t }(n) }).call(void 0) }, { "./NodeType": 251, "./XMLCharacterData": 256, "babel-runtime/core-js/object/create": 55 }], 281: [function (e, t, r) { "use strict"; (function () { var r, n, o, i = {}.hasOwnProperty; o = e("./Utility").assign, r = e("./NodeType"), e("./XMLDeclaration"), e("./XMLDocType"), e("./XMLCData"), e("./XMLComment"), e("./XMLElement"), e("./XMLRaw"), e("./XMLText"), e("./XMLProcessingInstruction"), e("./XMLDummy"), e("./XMLDTDAttList"), e("./XMLDTDElement"), e("./XMLDTDEntity"), e("./XMLDTDNotation"), n = e("./WriterState"), t.exports = function () { function e(e) { var t, r, n; e || (e = {}), this.options = e, r = e.writer || {}; for (t in r) i.call(r, t) && (n = r[t], this["_" + t] = this[t], this[t] = n) } return e.prototype.filterOptions = function (e) { var t, r, i, s, a, u, c, l; return e || (e = {}), e = o({}, this.options, e), t = { writer: this }, t.pretty = e.pretty || !1, t.allowEmpty = e.allowEmpty || !1, t.indent = null != (r = e.indent) ? r : "  ", t.newline = null != (i = e.newline) ? i : "\n", t.offset = null != (s = e.offset) ? s : 0, t.dontPrettyTextNodes = null != (a = null != (u = e.dontPrettyTextNodes) ? u : e.dontprettytextnodes) ? a : 0, t.spaceBeforeSlash = null != (c = null != (l = e.spaceBeforeSlash) ? l : e.spacebeforeslash) ? c : "", !0 === t.spaceBeforeSlash && (t.spaceBeforeSlash = " "), t.suppressPrettyCount = 0, t.user = {}, t.state = n.None, t }, e.prototype.indent = function (e, t, r) { var n; return !t.pretty || t.suppressPrettyCount ? "" : t.pretty && (n = (r || 0) + t.offset + 1) > 0 ? new Array(n).join(t.indent) : "" }, e.prototype.endline = function (e, t, r) { return !t.pretty || t.suppressPrettyCount ? "" : t.newline }, e.prototype.attribute = function (e, t, r) { var n; return this.openAttribute(e, t, r), n = " " + e.name + '="' + e.value + '"', this.closeAttribute(e, t, r), n }, e.prototype.cdata = function (e, t, r) { var o; return this.openNode(e, t, r), t.state = n.OpenTag, o = this.indent(e, t, r) + "<![CDATA[", t.state = n.InsideTag, o += e.value, t.state = n.CloseTag, o += "]]>" + this.endline(e, t, r), t.state = n.None, this.closeNode(e, t, r), o }, e.prototype.comment = function (e, t, r) { var o; return this.openNode(e, t, r), t.state = n.OpenTag, o = this.indent(e, t, r) + "\x3c!-- ", t.state = n.InsideTag, o += e.value, t.state = n.CloseTag, o += " --\x3e" + this.endline(e, t, r), t.state = n.None, this.closeNode(e, t, r), o }, e.prototype.declaration = function (e, t, r) { var o; return this.openNode(e, t, r), t.state = n.OpenTag, o = this.indent(e, t, r) + "<?xml", t.state = n.InsideTag, o += ' version="' + e.version + '"', null != e.encoding && (o += ' encoding="' + e.encoding + '"'), null != e.standalone && (o += ' standalone="' + e.standalone + '"'), t.state = n.CloseTag, o += t.spaceBeforeSlash + "?>", o += this.endline(e, t, r), t.state = n.None, this.closeNode(e, t, r), o }, e.prototype.docType = function (e, t, r) { var o, i, s, a, u; if (r || (r = 0), this.openNode(e, t, r), t.state = n.OpenTag, a = this.indent(e, t, r), a += "<!DOCTYPE " + e.root().name, e.pubID && e.sysID ? a += ' PUBLIC "' + e.pubID + '" "' + e.sysID + '"' : e.sysID && (a += ' SYSTEM "' + e.sysID + '"'), e.children.length > 0) { for (a += " [", a += this.endline(e, t, r), t.state = n.InsideTag, u = e.children, i = 0, s = u.length; i < s; i++)o = u[i], a += this.writeChildNode(o, t, r + 1); t.state = n.CloseTag, a += "]" } return t.state = n.CloseTag, a += t.spaceBeforeSlash + ">", a += this.endline(e, t, r), t.state = n.None, this.closeNode(e, t, r), a }, e.prototype.element = function (e, t, o) { var s, a, u, c, l, f, p, h, d, m, b, y, g, v; o || (o = 0), m = !1, b = "", this.openNode(e, t, o), t.state = n.OpenTag, b += this.indent(e, t, o) + "<" + e.name, y = e.attribs; for (d in y) i.call(y, d) && (s = y[d], b += this.attribute(s, t, o)); if (u = e.children.length, c = 0 === u ? null : e.children[0], 0 === u || e.children.every(function (e) { return (e.type === r.Text || e.type === r.Raw) && "" === e.value })) t.allowEmpty ? (b += ">", t.state = n.CloseTag, b += "</" + e.name + ">" + this.endline(e, t, o)) : (t.state = n.CloseTag, b += t.spaceBeforeSlash + "/>" + this.endline(e, t, o)); else if (!t.pretty || 1 !== u || c.type !== r.Text && c.type !== r.Raw || null == c.value) { if (t.dontPrettyTextNodes) for (g = e.children, l = 0, p = g.length; l < p; l++)if (a = g[l], (a.type === r.Text || a.type === r.Raw) && null != a.value) { t.suppressPrettyCount++, m = !0; break } for (b += ">" + this.endline(e, t, o), t.state = n.InsideTag, v = e.children, f = 0, h = v.length; f < h; f++)a = v[f], b += this.writeChildNode(a, t, o + 1); t.state = n.CloseTag, b += this.indent(e, t, o) + "</" + e.name + ">", m && t.suppressPrettyCount--, b += this.endline(e, t, o), t.state = n.None } else b += ">", t.state = n.InsideTag, t.suppressPrettyCount++, m = !0, b += this.writeChildNode(c, t, o + 1), t.suppressPrettyCount--, m = !1, t.state = n.CloseTag, b += "</" + e.name + ">" + this.endline(e, t, o); return this.closeNode(e, t, o), b }, e.prototype.writeChildNode = function (e, t, n) { switch (e.type) { case r.CData: return this.cdata(e, t, n); case r.Comment: return this.comment(e, t, n); case r.Element: return this.element(e, t, n); case r.Raw: return this.raw(e, t, n); case r.Text: return this.text(e, t, n); case r.ProcessingInstruction: return this.processingInstruction(e, t, n); case r.Dummy: return ""; case r.Declaration: return this.declaration(e, t, n); case r.DocType: return this.docType(e, t, n); case r.AttributeDeclaration: return this.dtdAttList(e, t, n); case r.ElementDeclaration: return this.dtdElement(e, t, n); case r.EntityDeclaration: return this.dtdEntity(e, t, n); case r.NotationDeclaration: return this.dtdNotation(e, t, n); default: throw new Error("Unknown XML node type: " + e.constructor.name) } }, e.prototype.processingInstruction = function (e, t, r) { var o; return this.openNode(e, t, r), t.state = n.OpenTag, o = this.indent(e, t, r) + "<?", t.state = n.InsideTag, o += e.target, e.value && (o += " " + e.value), t.state = n.CloseTag, o += t.spaceBeforeSlash + "?>", o += this.endline(e, t, r), t.state = n.None, this.closeNode(e, t, r), o }, e.prototype.raw = function (e, t, r) { var o; return this.openNode(e, t, r), t.state = n.OpenTag, o = this.indent(e, t, r), t.state = n.InsideTag, o += e.value, t.state = n.CloseTag, o += this.endline(e, t, r), t.state = n.None, this.closeNode(e, t, r), o }, e.prototype.text = function (e, t, r) { var o; return this.openNode(e, t, r), t.state = n.OpenTag, o = this.indent(e, t, r), t.state = n.InsideTag, o += e.value, t.state = n.CloseTag, o += this.endline(e, t, r), t.state = n.None, this.closeNode(e, t, r), o }, e.prototype.dtdAttList = function (e, t, r) { var o; return this.openNode(e, t, r), t.state = n.OpenTag, o = this.indent(e, t, r) + "<!ATTLIST", t.state = n.InsideTag, o += " " + e.elementName + " " + e.attributeName + " " + e.attributeType, "#DEFAULT" !== e.defaultValueType && (o += " " + e.defaultValueType), e.defaultValue && (o += ' "' + e.defaultValue + '"'), t.state = n.CloseTag, o += t.spaceBeforeSlash + ">" + this.endline(e, t, r), t.state = n.None, this.closeNode(e, t, r), o }, e.prototype.dtdElement = function (e, t, r) { var o; return this.openNode(e, t, r), t.state = n.OpenTag, o = this.indent(e, t, r) + "<!ELEMENT", t.state = n.InsideTag, o += " " + e.name + " " + e.value, t.state = n.CloseTag, o += t.spaceBeforeSlash + ">" + this.endline(e, t, r), t.state = n.None, this.closeNode(e, t, r), o }, e.prototype.dtdEntity = function (e, t, r) { var o; return this.openNode(e, t, r), t.state = n.OpenTag, o = this.indent(e, t, r) + "<!ENTITY", t.state = n.InsideTag, e.pe && (o += " %"), o += " " + e.name, e.value ? o += ' "' + e.value + '"' : (e.pubID && e.sysID ? o += ' PUBLIC "' + e.pubID + '" "' + e.sysID + '"' : e.sysID && (o += ' SYSTEM "' + e.sysID + '"'), e.nData && (o += " NDATA " + e.nData)), t.state = n.CloseTag, o += t.spaceBeforeSlash + ">" + this.endline(e, t, r), t.state = n.None, this.closeNode(e, t, r), o }, e.prototype.dtdNotation = function (e, t, r) { var o; return this.openNode(e, t, r), t.state = n.OpenTag, o = this.indent(e, t, r) + "<!NOTATION", t.state = n.InsideTag, o += " " + e.name, e.pubID && e.sysID ? o += ' PUBLIC "' + e.pubID + '" "' + e.sysID + '"' : e.pubID ? o += ' PUBLIC "' + e.pubID + '"' : e.sysID && (o += ' SYSTEM "' + e.sysID + '"'), t.state = n.CloseTag, o += t.spaceBeforeSlash + ">" + this.endline(e, t, r), t.state = n.None, this.closeNode(e, t, r), o }, e.prototype.openNode = function (e, t, r) { }, e.prototype.closeNode = function (e, t, r) { }, e.prototype.openAttribute = function (e, t, r) { }, e.prototype.closeAttribute = function (e, t, r) { }, e }() }).call(void 0) }, { "./NodeType": 251, "./Utility": 252, "./WriterState": 253, "./XMLCData": 255, "./XMLComment": 257, "./XMLDTDAttList": 262, "./XMLDTDElement": 263, "./XMLDTDEntity": 264, "./XMLDTDNotation": 265, "./XMLDeclaration": 266, "./XMLDocType": 267, "./XMLDummy": 270, "./XMLElement": 271, "./XMLProcessingInstruction": 275, "./XMLRaw": 276, "./XMLText": 280 }], 282: [function (e, t, r) { "use strict"; (function () { var r, n, o, i, s, a, u, c, l, f; f = e("./Utility"), c = f.assign, l = f.isFunction, o = e("./XMLDOMImplementation"), i = e("./XMLDocument"), s = e("./XMLDocumentCB"), u = e("./XMLStringWriter"), a = e("./XMLStreamWriter"), r = e("./NodeType"), n = e("./WriterState"), t.exports.create = function (e, t, r, n) { var o, s; if (null == e) throw new Error("Root element needs a name."); return n = c({}, t, r, n), o = new i(n), s = o.element(e), n.headless || (o.declaration(n), null == n.pubID && null == n.sysID || o.dtd(n)), s }, t.exports.begin = function (e, t, r) { var n; return l(e) && (n = [e, t], t = n[0], r = n[1], e = {}), t ? new s(e, t, r) : new i(e) }, t.exports.stringWriter = function (e) { return new u(e) }, t.exports.streamWriter = function (e, t) { return new a(e, t) }, t.exports.implementation = new o, t.exports.nodeType = r, t.exports.writerState = n }).call(void 0) }, { "./NodeType": 251, "./Utility": 252, "./WriterState": 253, "./XMLDOMImplementation": 260, "./XMLDocument": 268, "./XMLDocumentCB": 269, "./XMLStreamWriter": 277, "./XMLStringWriter": 278 }], 283: [function (e, t, r) { function n() { for (var e = {}, t = 0; t < arguments.length; t++) { var r = arguments[t]; for (var n in r) o.call(r, n) && (e[n] = r[n]) } return e } t.exports = n; var o = Object.prototype.hasOwnProperty }, {}], 284: [function (e, t, r) { "use strict"; function n(e, t, r) { s.isBuffer(t) || (t = s.from(t)), s.isBuffer(r) || (r = s.from(r)), t.length > l ? t = e(t) : t.length < l && (t = s.concat([t, f], l)); for (var n = s.alloc(l), o = s.alloc(l), i = 0; i < l; i++)n[i] = 54 ^ t[i], o[i] = 92 ^ t[i]; var a = e(s.concat([n, r])); return e(s.concat([o, a])) } function o(e, t) { e = e || "sha1"; var r = c[e], o = [], a = 0; return r || i("algorithm:", e, "is not yet supported"), { update: function (e) { return s.isBuffer(e) || (e = s.from(e)), o.push(e), a += e.length, this }, digest: function (e) { var i = s.concat(o), a = t ? n(r, t, i) : r(i); return o = null, e ? a.toString(e) : a } } } function i() { var e = [].slice.call(arguments).join(" "); throw new Error([e, "we accept pull requests", "http://github.com/dominictarr/crypto-browserify"].join("\n")) } var s = e("buffer").Buffer, a = e("./sha"), u = e("./md5"), c = { sha1: a, md5: u }, l = 64, f = s.alloc(l); f.fill(0), r.createHash = function (e) { return o(e) }, r.createHmac = function (e, t) { return o(e, t) }, r.createCredentials = function () { i("sorry,createCredentials is not implemented yet") }, r.createCipher = function () { i("sorry,createCipher is not implemented yet") }, r.createCipheriv = function () { i("sorry,createCipheriv is not implemented yet") }, r.createDecipher = function () { i("sorry,createDecipher is not implemented yet") }, r.createDecipheriv = function () { i("sorry,createDecipheriv is not implemented yet") }, r.createSign = function () { i("sorry,createSign is not implemented yet") }, r.createVerify = function () { i("sorry,createVerify is not implemented yet") }, r.createDiffieHellman = function () { i("sorry,createDiffieHellman is not implemented yet") }, r.pbkdf2 = function () { i("sorry,pbkdf2 is not implemented yet") } }, { "./md5": 286, "./sha": 287, buffer: 73 }], 285: [function (e, t, r) { "use strict"; function n(e, t) { if (e.length % a != 0) { var r = e.length + (a - e.length % a); e = s.concat([e, u], r) } for (var n = [], o = t ? e.readInt32BE : e.readInt32LE, i = 0; i < e.length; i += a)n.push(o.call(e, i)); return n } function o(e, t, r) { for (var n = s.alloc(t), o = r ? n.writeInt32BE : n.writeInt32LE, i = 0; i < e.length; i++)o.call(n, e[i], 4 * i, !0); return n } function i(e, t, r, i) { return s.isBuffer(e) || (e = s.from(e)), o(t(n(e, i), e.length * c), r, i) } var s = e("buffer").Buffer, a = 4, u = s.alloc(a); u.fill(0); var c = 8; t.exports = { hash: i } }, { buffer: 73 }], 286: [function (e, t, r) { "use strict"; function n(e, t) { e[t >> 5] |= 128 << t % 32, e[14 + (t + 64 >>> 9 << 4)] = t; for (var r = 1732584193, n = -271733879, o = -1732584194, l = 271733878, f = 0; f < e.length; f += 16) { var p = r, h = n, d = o, m = l; r = i(r, n, o, l, e[f + 0], 7, -680876936), l = i(l, r, n, o, e[f + 1], 12, -389564586), o = i(o, l, r, n, e[f + 2], 17, 606105819), n = i(n, o, l, r, e[f + 3], 22, -1044525330), r = i(r, n, o, l, e[f + 4], 7, -176418897), l = i(l, r, n, o, e[f + 5], 12, 1200080426), o = i(o, l, r, n, e[f + 6], 17, -1473231341), n = i(n, o, l, r, e[f + 7], 22, -45705983), r = i(r, n, o, l, e[f + 8], 7, 1770035416), l = i(l, r, n, o, e[f + 9], 12, -1958414417), o = i(o, l, r, n, e[f + 10], 17, -42063), n = i(n, o, l, r, e[f + 11], 22, -1990404162), r = i(r, n, o, l, e[f + 12], 7, 1804603682), l = i(l, r, n, o, e[f + 13], 12, -40341101), o = i(o, l, r, n, e[f + 14], 17, -1502002290), n = i(n, o, l, r, e[f + 15], 22, 1236535329), r = s(r, n, o, l, e[f + 1], 5, -165796510), l = s(l, r, n, o, e[f + 6], 9, -1069501632), o = s(o, l, r, n, e[f + 11], 14, 643717713), n = s(n, o, l, r, e[f + 0], 20, -373897302), r = s(r, n, o, l, e[f + 5], 5, -701558691), l = s(l, r, n, o, e[f + 10], 9, 38016083), o = s(o, l, r, n, e[f + 15], 14, -660478335), n = s(n, o, l, r, e[f + 4], 20, -405537848), r = s(r, n, o, l, e[f + 9], 5, 568446438), l = s(l, r, n, o, e[f + 14], 9, -1019803690), o = s(o, l, r, n, e[f + 3], 14, -187363961), n = s(n, o, l, r, e[f + 8], 20, 1163531501), r = s(r, n, o, l, e[f + 13], 5, -1444681467), l = s(l, r, n, o, e[f + 2], 9, -51403784), o = s(o, l, r, n, e[f + 7], 14, 1735328473), n = s(n, o, l, r, e[f + 12], 20, -1926607734), r = a(r, n, o, l, e[f + 5], 4, -378558), l = a(l, r, n, o, e[f + 8], 11, -2022574463), o = a(o, l, r, n, e[f + 11], 16, 1839030562), n = a(n, o, l, r, e[f + 14], 23, -35309556), r = a(r, n, o, l, e[f + 1], 4, -1530992060), l = a(l, r, n, o, e[f + 4], 11, 1272893353), o = a(o, l, r, n, e[f + 7], 16, -155497632), n = a(n, o, l, r, e[f + 10], 23, -1094730640), r = a(r, n, o, l, e[f + 13], 4, 681279174), l = a(l, r, n, o, e[f + 0], 11, -358537222), o = a(o, l, r, n, e[f + 3], 16, -722521979), n = a(n, o, l, r, e[f + 6], 23, 76029189), r = a(r, n, o, l, e[f + 9], 4, -640364487), l = a(l, r, n, o, e[f + 12], 11, -421815835), o = a(o, l, r, n, e[f + 15], 16, 530742520), n = a(n, o, l, r, e[f + 2], 23, -995338651), r = u(r, n, o, l, e[f + 0], 6, -198630844), l = u(l, r, n, o, e[f + 7], 10, 1126891415), o = u(o, l, r, n, e[f + 14], 15, -1416354905), n = u(n, o, l, r, e[f + 5], 21, -57434055), r = u(r, n, o, l, e[f + 12], 6, 1700485571), l = u(l, r, n, o, e[f + 3], 10, -1894986606), o = u(o, l, r, n, e[f + 10], 15, -1051523), n = u(n, o, l, r, e[f + 1], 21, -2054922799), r = u(r, n, o, l, e[f + 8], 6, 1873313359), l = u(l, r, n, o, e[f + 15], 10, -30611744), o = u(o, l, r, n, e[f + 6], 15, -1560198380), n = u(n, o, l, r, e[f + 13], 21, 1309151649), r = u(r, n, o, l, e[f + 4], 6, -145523070), l = u(l, r, n, o, e[f + 11], 10, -1120210379), o = u(o, l, r, n, e[f + 2], 15, 718787259), n = u(n, o, l, r, e[f + 9], 21, -343485551), r = c(r, p), n = c(n, h), o = c(o, d), l = c(l, m) } return Array(r, n, o, l) } function o(e, t, r, n, o, i) { return c(l(c(c(t, e), c(n, i)), o), r) } function i(e, t, r, n, i, s, a) { return o(t & r | ~t & n, e, t, i, s, a) } function s(e, t, r, n, i, s, a) { return o(t & n | r & ~n, e, t, i, s, a) } function a(e, t, r, n, i, s, a) { return o(t ^ r ^ n, e, t, i, s, a) } function u(e, t, r, n, i, s, a) { return o(r ^ (t | ~n), e, t, i, s, a) } function c(e, t) { var r = (65535 & e) + (65535 & t); return (e >> 16) + (t >> 16) + (r >> 16) << 16 | 65535 & r } function l(e, t) { return e << t | e >>> 32 - t } var f = e("./helpers"); t.exports = function (e) { return f.hash(e, n, 16) } }, { "./helpers": 285 }], 287: [function (e, t, r) { "use strict"; function n(e, t) { e[t >> 5] |= 128 << 24 - t % 32, e[15 + (t + 64 >> 9 << 4)] = t; for (var r = Array(80), n = 1732584193, u = -271733879, c = -1732584194, l = 271733878, f = -1009589776, p = 0; p < e.length; p += 16) { for (var h = n, d = u, m = c, b = l, y = f, g = 0; g < 80; g++) { r[g] = g < 16 ? e[p + g] : a(r[g - 3] ^ r[g - 8] ^ r[g - 14] ^ r[g - 16], 1); var v = s(s(a(n, 5), o(g, u, c, l)), s(s(f, r[g]), i(g))); f = l, l = c, c = a(u, 30), u = n, n = v } n = s(n, h), u = s(u, d), c = s(c, m), l = s(l, b), f = s(f, y) } return Array(n, u, c, l, f) } function o(e, t, r, n) { return e < 20 ? t & r | ~t & n : e < 40 ? t ^ r ^ n : e < 60 ? t & r | t & n | r & n : t ^ r ^ n } function i(e) { return e < 20 ? 1518500249 : e < 40 ? 1859775393 : e < 60 ? -1894007588 : -899497514 } function s(e, t) { var r = (65535 & e) + (65535 & t); return (e >> 16) + (t >> 16) + (r >> 16) << 16 | 65535 & r } function a(e, t) { return e << t | e >>> 32 - t } var u = e("./helpers"); t.exports = function (e) { return u.hash(e, n, 20, !0) } }, { "./helpers": 285 }], 288: [function (e, t, r) { "use strict"; t.exports = function () { return function () { } } }, {}], 289: [function (e, t, r) { (function (r) { "use strict"; function n(e) { return e instanceof a } var o = e("babel-runtime/helpers/typeof"), i = function (e) { return e && e.__esModule ? e : { default: e } }(o), s = e("stream"), a = s.Stream, u = e("../lib/common/utils/isArray"), c = u.isArray; t.exports.string = function (e) { return "string" == typeof e }, t.exports.array = c, t.exports.buffer = r.isBuffer, t.exports.writableStream = function (e) { return n(e) && "function" == typeof e._write && "object" === (0, i.default)(e._writableState) } }).call(this, { isBuffer: e("../node_modules/is-buffer/index.js") }) }, { "../lib/common/utils/isArray": 42, "../node_modules/is-buffer/index.js": 197, "babel-runtime/helpers/typeof": 67, stream: 230 }], 290: [function (e, t, r) { "use strict"; r.encodeURIComponent = function (e) { try { return encodeURIComponent(e) } catch (t) { return e } }, r.escape = e("escape-html"), r.timestamp = function (e) { if (e) { var t = e; return "string" == typeof t && (t = Number(t)), 10 === String(e).length && (t *= 1e3), new Date(t) } return Math.round(Date.now() / 1e3) } }, { "escape-html": 191 }], 291: [function (e, t, r) {
      (function (t, n) {
        "use strict"; function o(e) { return e && e.__esModule ? e : { default: e } } function i(e, t) { return void 0 === e ? t : e } function s(e, t) { return function (r, n, o) { if (r) return t(r); e({ data: n, status: o.statusCode, headers: o.headers, res: o }) } } var a, u = e("babel-runtime/core-js/json/stringify"), c = o(u), l = e("babel-runtime/helpers/typeof"), f = o(l), p = e("util"), h = e("url"), d = e("http"), m = e("https"), b = e("debug")("urllib"), y = e("humanize-ms"), g = 0, v = Math.pow(2, 31) - 10, _ = /^https?:\/\//i; r.TIMEOUTS = [y("300s"), y("300s")]; var w = ["json", "text"]; r.request = function (t, n, o) { return 2 === arguments.length && "function" == typeof n && (o = n, n = null), "function" == typeof o ? r.requestWithCallback(t, n, o) : (a || (a = e("any-promise")), new a(function (e, o) { r.requestWithCallback(t, n, s(e, o)) })) }, r.requestWithCallback = function (o, s, a) {
          function u() { K && (clearTimeout(K), K = null) } function l() { Y && (clearTimeout(Y), Y = null) } function x(e, n, i) { if (l(), !a) return console.warn("[urllib:warn] [%s] [%s] [worker:%s] %s %s callback twice!!!", Date(), k, t.pid, B.method, o), void (e && console.warn("[urllib:warn] [%s] [%s] [worker:%s] %s: %s\nstack: %s", Date(), k, t.pid, e.name, e.message, e.stack)); var u = a; a = null; var f = {}; if (i && (ee = i.statusCode, f = i.headers), 401 === ee && f["www-authenticate"] && (!s.headers || !s.headers.Authorization) && s.digestAuth) { var p = f["www-authenticate"]; if (p.indexOf("Digest ") >= 0) return b("Request#%d %s: got digest auth header WWW-Authenticate: %s", k, o, p), s.headers = s.headers || {}, s.headers.Authorization = digestAuthHeader(B.method, B.path, p, s.digestAuth), b("Request#%d %s: auth with digest header: %s", k, o, s.headers.Authorization), i.headers["set-cookie"] && (s.headers.Cookie = i.headers["set-cookie"].join(";")), r.requestWithCallback(o, s, u) } var h = Date.now() - A; oe && (oe.contentDownload = h), b("[%sms] done, %s bytes HTTP %s %s %s %s, keepAliveSocket: %s, timing: %j", h, Z, ee, B.method, B.host, B.path, Q, oe); var d = { status: ee, statusCode: ee, headers: f, size: Z, aborted: te, rt: h, keepAliveSocket: Q, data: n, requestUrls: s.requestUrls, timing: oe, remoteAddress: re, remotePort: ne }; if (e) { var m = ""; L && "function" == typeof L.getCurrentStatus && (m = ", agent status: " + (0, c.default)(L.getCurrentStatus())), e.message += ", " + B.method + " " + o + " " + ee + " (connected: " + J + ", keepalive socket: " + Q + m + ")\nheaders: " + (0, c.default)(f), e.data = n, e.path = B.path, e.status = ee, e.headers = f, e.res = d } u(e, n, s.streaming ? i : d), s.emitter && (I.url = o, I.socket = ue && ue.connection, I.options = B, I.size = H, s.emitter.emit("response", { requestId: k, error: e, ctx: s.ctx, req: I, res: d })) } function E(e) { var t = null; if (s.followRedirect && statuses.redirect[e.statusCode]) { s._followRedirectCount = (s._followRedirectCount || 0) + 1; var n = e.headers.location; if (n) { if (!(s._followRedirectCount > s.maxRedirects)) { var i = s.formatRedirectUrl ? s.formatRedirectUrl(o, n) : h.resolve(o, n); b("Request#%d %s: `redirected` from %s to %s", k, B.path, o, i), l(), s.headers && s.headers.Host && _.test(n) && (s.headers.Host = null); var u = a; return a = null, r.requestWithCallback(i, s, u), { redirect: !0, error: null } } t = new Error("Exceeded maxRedirects. Probably stuck in a redirect loop " + o), t.name = "MaxRedirectError" } else t = new Error("Got statusCode " + e.statusCode + " but cannot resolve next location from headers"), t.name = "FollowRedirectError" } return { redirect: !1, error: t } } function T(e, t, r) { return r(null, t, e.headers["content-encoding"]) } function S(e) { if (oe && (oe.waiting = Date.now() - A), b("Request#%d %s `req response` event emit: status %d, headers: %j", k, o, e.statusCode, e.headers), s.streaming) { var t = E(e); return t.redirect ? void e.resume() : t.error ? (e.resume(), x(t.error, null, e)) : x(null, null, e) } if (e.on("close", function () { b("Request#%d %s: `res close` event emit, total size %d", k, o, Z) }), e.on("error", function () { b("Request#%d %s: `res error` event emit, total size %d", k, o, Z) }), e.on("aborted", function () { te = !0, b("Request#%d %s: `res aborted` event emit, total size %d", k, o, Z) }), ie) { var t = E(e); return t.redirect ? void e.resume() : t.error ? (e.resume(), ie.end(), x(t.error, null, e)) : (!1 === s.consumeWriteStream ? e.on("end", x.bind(null, null, null, e)) : isNode010 || isNode012 ? first([[ie, "close"], [e, "aborted"]], function (t, r, n) { b("Request#%d %s: writeStream or res %s event emitted", k, o, n), x($ || null, null, e) }) : ie.on("close", function () { b("Request#%d %s: writeStream close event emitted", k, o), x($ || null, null, e) }), e.pipe(ie)) } var r = []; e.on("data", function (e) { b("Request#%d %s: `res data` event emit, size %d", k, o, e.length), Z += e.length, r.push(e) }), e.on("end", function () { var t = n.concat(r, Z); if (b("Request#%d %s: `res end` event emit, total size %d, _dumped: %s", k, o, Z, e._dumped), $) return x($, t, e); var i = E(e); if (i.error) return x(i.error, t, e); i.redirect || T(e, t, function (r, n, i) { if (r) return x(r, t, e); if (!i && w.indexOf(s.dataType) >= 0) { try { n = decodeBodyByCharset(n, e) } catch (t) { return b("decodeBodyByCharset error: %s", t), x(null, n, e) } if ("json" === s.dataType) if (0 === Z) n = null; else { var a = parseJSON(n, R); a.error ? r = a.error : n = a.data } } te && b("Request#%d %s: Remote socket was terminated before `response.end()` was called", k, o), x(r, n, e) }) }) } function j() { b("Response timer ticking, timeout: %d", ae), Y = setTimeout(function () { Y = null; var e = "Response timeout for " + ae + "ms"; $ = new Error(e), $.name = "ResponseTimeoutError", $.requestId = k, b("ResponseTimeout: Request#%d %s %s: %s, connected: %s", k, o, $.name, e, J), O() }, ae) } function O() { b("Request#%d %s abort, connected: %s", k, o, J), ue.socket || ($.noSocket = !0, x($)), ue.abort() } if (!o || "string" != typeof o && "object" !== (void 0 === o ? "undefined" : (0, f.default)(o))) { var N = p.format("expect request url to be a string or a http request options, but got %j", o); throw new Error(N) } 2 === arguments.length && "function" == typeof s && (a = s, s = null), s = s || {}, g >= v && (g = 0); var k = ++g; s.requestUrls = s.requestUrls || []; var I = { requestId: k, url: o, args: s, ctx: s.ctx }; s.emitter && s.emitter.emit("request", I), s.timeout = s.timeout || r.TIMEOUTS, s.maxRedirects = s.maxRedirects || 10, s.streaming = s.streaming || s.customResponse; var C, A = Date.now(); "string" == typeof o ? (_.test(o) || (o = "http://" + o), C = h.parse(o)) : C = o; var D = (s.type || s.method || C.method || "GET").toUpperCase(), M = C.port || 80, P = d, L = i(s.agent, r.agent), R = s.fixJSONCtlChars; "https:" === C.protocol && (P = m, L = i(s.httpsAgent, r.httpsAgent), C.port || (M = 443)); var B = { host: C.hostname || C.host || "localhost", path: C.path || "/", method: D, port: M, agent: L, headers: s.headers || {}, lookup: s.lookup }; Array.isArray(s.timeout) ? B.requestTimeout = s.timeout[s.timeout.length - 1] : void 0 !== s.timeout && (B.requestTimeout = s.timeout); for (var F = ["pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "secureProtocol", "secureOptions"], U = 0; U < F.length; U++) { var q = F[U]; s.hasOwnProperty(q) && (B[q] = s[q]) } !1 !== B.rejectUnauthorized || B.hasOwnProperty("secureOptions") || (B.secureOptions = e("constants").SSL_OP_NO_TLSv1_2); var X = s.auth || C.auth; X && (B.auth = X); var G = s.content || s.data, z = "GET" === D || "HEAD" === D || s.dataAsQueryString; if (!s.content && G && "string" != typeof G && !n.isBuffer(G)) if (z) G = s.nestedQuerystring ? qs.stringify(G) : querystring.stringify(G); else { var V = B.headers["Content-Type"] || B.headers["content-type"]; V || (V = "json" === s.contentType ? "application/json" : "application/x-www-form-urlencoded", B.headers["Content-Type"] = V), G = "application/json" === parseContentType(V).type ? (0, c.default)(G) : s.nestedQuerystring ? qs.stringify(G) : querystring.stringify(G) } z && G && (B.path += (C.query ? "&" : "?") + G, G = null); var H = 0; if (G) { var W = G.length; n.isBuffer(G) || (W = n.byteLength(G)), H = B.headers["Content-Length"] = W } "json" === s.dataType && (B.headers.Accept = "application/json"), "function" == typeof s.beforeRequest && s.beforeRequest(B); var K = null, Y = null, $ = null, J = !1, Q = !1, Z = 0, ee = -1, te = !1, re = "", ne = "", oe = null; s.timing && (oe = { queuing: 0, dnslookup: 0, connected: 0, requestSent: 0, waiting: 0, contentDownload: 0 }), B.headers["User-Agent"] || B.headers["user-agent"] || (B.headers["User-Agent"] = navigator.userAgent), s.gzip && (B.headers["Accept-Encoding"] || B.headers["accept-encoding"] || (B.headers["Accept-Encoding"] = "gzip")); var ie = s.writeStream; b("Request#%d %s %s with headers %j, options.path: %s", k, D, o, B.headers, B.path), s.requestUrls.push(o); var se, ae; Array.isArray(s.timeout) ? (se = y(s.timeout[0]), ae = y(s.timeout[1])) : se = ae = y(s.timeout), b("ConnectTimeout: %d, ResponseTimeout: %d", se, ae); var ue; B.mode = s.mode ? s.mode : ""; try { ue = P.request(B, S) } catch (e) { return x(e) } return "undefined" == typeof window ? function () {
            b("Connect timer ticking, timeout: %d", se), K = setTimeout(function () {
              K = null, -1 === ee && (ee = -2); var e = "Connect timeout for " + se + "ms", t = "ConnectionTimeoutError"; ue.socket || (t = "SocketAssignTimeoutError",
                e += ", working sockets is full"), $ = new Error(e), $.name = t, $.requestId = k, b("ConnectTimeout: Request#%d %s %s: %s, connected: %s", k, o, $.name, e, J), O()
            }, se)
          }() : ue.on("requestTimeout", function () { -1 === ee && (ee = -2); var e = "Connect timeout for " + se + "ms"; $ = new Error(e), $.name = "ConnectionTimeoutError", $.requestId = k, O() }), oe && ue.on("finish", function () { oe.requestSent = Date.now() - A }), ue.once("socket", function (e) { oe && (oe.queuing = Date.now() - A), isNode010 && e.socket && (e = e.socket); var t = e.readyState; if ("opening" === t) return e.once("lookup", function (e, t, r) { b("Request#%d %s lookup: %s, %s, %s", k, o, e, t, r), oe && (oe.dnslookup = Date.now() - A), t && (re = t) }), void e.once("connect", function () { oe && (oe.connected = Date.now() - A), u(), j(), b("Request#%d %s new socket connected", k, o), J = !0, re || (re = e.remoteAddress), ne = e.remotePort }); b("Request#%d %s reuse socket connected, readyState: %s", k, o, t), J = !0, Q = !0, re || (re = e.remoteAddress), ne = e.remotePort, u(), j() }), ue.on("error", function (e) { "Error" !== e.name && "TypeError" !== e.name || (e.name = J ? "ResponseError" : "RequestError"), e.message += ' (req "error")', b("Request#%d %s `req error` event emit, %s: %s", k, o, e.name, e.message), x($ || e) }), ie && ie.once("error", function (e) { e.message += ' (writeStream "error")', $ = e, b("Request#%d %s `writeStream error` event emit, %s: %s", k, o, e.name, e.message), O() }), s.stream ? (s.stream.pipe(ue), s.stream.once("error", function (e) { e.message += ' (stream "error")', $ = e, b("Request#%d %s `readStream error` event emit, %s: %s", k, o, e.name, e.message), O() })) : ue.end(G), ue.requestId = k, ue
        }
      }).call(this, e("_process"), e("buffer").Buffer)
    }, { _process: 208, "any-promise": 49, "babel-runtime/core-js/json/stringify": 53, "babel-runtime/helpers/typeof": 67, buffer: 73, constants: 75, debug: 288, http: 231, https: 193, "humanize-ms": 194, url: 238, util: 243 }]
  }, {}, [1])(1)
});
function MD5(sMessage) {
  function RotateLeft(lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }
  function AddUnsigned(lX, lY) {
    var lX4, lY4, lX8, lY8, lResult;
    lX8 = (lX & 0x80000000);
    lY8 = (lY & 0x80000000);
    lX4 = (lX & 0x40000000);
    lY4 = (lY & 0x40000000);
    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
    if (lX4 & lY4) {
      return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
      } else {
        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
      }
    } else {
      return (lResult ^ lX8 ^ lY8);
    }
  }
  function F(x, y, z) {
    return (x & y) | ((~x) & z);
  }
  function G(x, y, z) {
    return (x & z) | (y & (~z));
  }
  function H(x, y, z) {
    return (x ^ y ^ z);
  }
  function I(x, y, z) {
    return (y ^ (x | (~z)));
  }
  function FF(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }
  function GG(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }
  function HH(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }
  function II(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }
  function ConvertToWordArray(sMessage) {
    var lWordCount;
    var lMessageLength = sMessage.length;
    var lNumberOfWords_temp1 = lMessageLength + 8;
    var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    var lWordArray = Array(lNumberOfWords - 1);
    var lBytePosition = 0;
    var lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (sMessage.charCodeAt(lByteCount) << lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }
  function WordToHex(lValue) {
    var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      WordToHexValue_temp = "0" + lByte.toString(16);
      WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
    }
    return WordToHexValue;
  }
  var x = Array();
  var k, AA, BB, CC, DD, a, b, c, d
  var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
  var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
  var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
  var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
  // Steps 1 and 2. Append padding bits and length and convert to words
  x = ConvertToWordArray(sMessage);
  // Step 3. Initialise
  a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
  // Step 4. Process the message in 16-word blocks
  for (k = 0; k < x.length; k += 16) {
    AA = a; BB = b; CC = c; DD = d;
    a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
    d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
    c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
    b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
    a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
    d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
    c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
    b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
    d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
    c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
    b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
    a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
    d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
    c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
    b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
    a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
    d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
    c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
    b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
    a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
    d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
    b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
    a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
    d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
    c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
    b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
    a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
    d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
    c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
    b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
    a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
    d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
    c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
    b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
    a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
    d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
    c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
    b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
    a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
    d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
    c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
    b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
    a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
    d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
    c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
    b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
    a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
    d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
    c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
    b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
    a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
    d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
    c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
    b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
    a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
    d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
    c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
    b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
    a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
    d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
    c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
    b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
    a = AddUnsigned(a, AA); b = AddUnsigned(b, BB); c = AddUnsigned(c, CC); d = AddUnsigned(d, DD);
  }
  // Step 5. Output the 128 bit digest
  var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
  return temp.toLowerCase();
}
