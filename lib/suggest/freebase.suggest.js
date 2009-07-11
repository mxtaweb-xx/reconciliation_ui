;(function($, undefined){

if (!window.console) {
    window.console = {};
}
if (!window.console.log) {
    window.console.log = function() {};
}

$.suggest = function(name, prototype) {

    $.fn[name] = function(options) {
        var isMethodCall = (typeof options === 'string'),
        args = Array.prototype.slice.call(arguments, 1);

        return this.each(function() {
                var instance = $.data(this, name);
                // TODO: if instance and isMethodCall: instance[method].apply
                $.data(this, name, new $.suggest[name](this, options))._init();
            });
    };

    $.suggest[name] = function(input, options) {
        var self = this;

        this.name = name;

        this.options = $.extend(true,
                                {},
                                $.suggest.defaults,
                                $.suggest[name].defaults,
                                options);
        if (!this.options.css_prefix) {
            this.options.css_prefix = "";
        }

        var pane_selector = this._pane_selector(this.options),
        $pane = $(pane_selector),
        $list = $.suggest.$$(this.options.css.list, $pane);

        if ($pane.length && $list.length && !$pane.data("lock.suggest")) {
            // resuse existing containers
            this.$pane = $pane;
            this.$list = $list;
        }
        else {
            this.$list = $('<ul class="' + this.options.css.list + '"></ul>');
            var pane_html = '<div style="display:none;position:absolute" class="fbs-reset ' + this.options.css.pane + '"></div>';
            //console.log("pane_html", pane_html);
            this.$pane = $(pane_html).append(this.$list);

            if (pane_selector[0] === "#") {
                this.$pane[0].id = pane_selector.substring(1);
                // locked and cannot be used by other suggest plugins
                this.$pane.data("lock.suggest", true);
            }


            $(document.body).append(this.$pane);
            this.$pane.bind("mousedown", function(e) {
                    //console.log("mousedown");
                    $(this).data("suggest").dont_hide = true;
                })
            .bind("mouseup", function(e) {
                    //console.log("mouseup");
                    var sug = $(this).data("suggest");
                    if (sug.dont_hide) {
                        sug.$input.focus();
                    }
                    sug.dont_hide = false;
                })
            .bind("click", function(e) {
                    //console.log("click");
                    e.stopPropagation();
                    var suggest = $(this).data("suggest");
                    var $selected = suggest.get_selected();
                    if ($selected) {
                        suggest.onselect($selected, true);
                        suggest.hide_all();
                    }
                });

            var hoverover = function(e) {
                var sug = $(this).data("suggest");
                if (sug) {
                    sug.hoverover_list(e);
                }
            };
            var hoverout = function(e) {
                var sug = $(this).data("suggest");
                if (sug) {
                    sug.hoverout_list(e);
                }
            };
            this.$list.hover(hoverover, hoverout);
        }

        //console.log(this.$pane, this.$list);

        this.$input = $(input)
        .attr("autocomplete", "off")
        .unbind(".suggest")
        .bind("keydown.suggest", function(e) {
                self.keydown(e);
            })
        .bind("keypress.suggest", function(e) {
                self.keypress(e);
            })
        .bind("keyup.suggest", function(e) {
                self.keyup(e);
            })
        .bind("blur.suggest", function(e) {
                self.blur(e);
            })
        .bind("textchange.suggest", function(e) {
                self.textchange();
            })
        .bind("focus.suggest", function(e) {
                self.focus(e);
            });

        // resize handler
        $(window).resize(function(e) {
                if (self.$pane.is(":visible")) {
                    var sug = self.$pane.data("suggest");
                    sug.position();
                    if (sug.options.flyout && sug.$flyoutpane && sug.$flyoutpane.is(":visible")) {
                        var selected = sug.get_selected();
                        if (selected) {
                            sug.flyout_position(selected);
                        }
                    }
                }
            });
    };

    $.suggest[name].prototype = $.extend({}, $.suggest.prototype, prototype);
};

// base suggest prototype
$.suggest.prototype = {

    _init: function() {},

    focus: function(e) {
        //console.log("focus dont_hide", this.dont_hide);

        if (!$.trim(this.$input.val()) && this.options.helptext) {
            this.hide_all();
            this.$list.prevAll().remove();
            this.$list.nextAll().remove();
            this.$list.empty().append('<li class="fbs-help fbs-help-on-focus">' + this.options.helptext + '</li>');
            this.position();
            this.$pane.show();
        }
        else {
            this.focus_hook(e);
        }
    },

    // override to be notified on focus and input has a value
    focus_hook: function(e) {
        if (!this.$pane.is(":visible")) {
            var sug = this.$pane.data("suggest");
            if (sug === this && $("li", this.$list).length) {
                this.position();
                this.$pane.show();
            }
        }
    },

    keydown: function(e) {
        var key = e.keyCode;
        if (key === 9) { // tab
            this.tab(e);
        }
        else if (key === 38 || key === 40) { // up/down
            if (!e.shiftKey) {
                // prevents cursor/caret from moving (in Safari)
                e.preventDefault();
            }
        }
    },

    keypress: function(e) {
        var key = e.keyCode;
        if (key === 38 || key === 40) { // up/down
            if (!e.shiftKey) {
                // prevents cursor/caret from moving
                e.preventDefault();
            }
        }
        else if (key === 13) { // enter
            this.enter(e);
        }
        else if (key === 27) { // escape
            this.escape(e);
        }
        else if ((e.metaKey || e.ctrlKey) && e.charCode === 118) {
            window.clearTimeout(this.keypress.timeout);
            var self = this;
            this.keypress.timeout = window.setTimeout(function() {self.textchange();}, 0);
        }
    },

    keyup: function(e) {
        var key = e.keyCode;
        //console.log("keyup", key);
        if (key === 38) { // up
            e.preventDefault();
            this.up(e);
        }
        else if (key === 40) { // down
            e.preventDefault();
            this.down(e);
        }
        else if (e.ctrlKey && key === 77) {
            $(".fbs-more-link", this.$pane).click();
        }

        else if ($.suggest.is_char(e)) {
            this.textchange();
        }


    },

    blur: function(e) {
        //console.log("blur dont_hide", this.dont_hide);
        if (this.dont_hide) {
            return;
        }
        var data = this.$input.data("data.suggest");

        if (!data) {
            this.check_required();
        }
        this.hide_all();
    },

    tab: function(e) {
        this.enter(e);
    },

    enter: function(e) {
        var visible = this.$pane.is(":visible") && !$(".fbs-help", this.$list).length;
        if (visible) {
            if (e.shiftKey) {
                this.shift_enter(e);
            }
            else {
                var $selected = this.get_selected();
                if ($selected) {
                    this.onselect($selected);
                    this.hide_all();
                }
                else {
                    if ($("."+this.options.css.item + ":visible", this.$list).length) {
                        this.updown(false);
                    }
                    else {
                        this.check_required();
                    }
                }
            }
            e.preventDefault();
        }
    },

    shift_enter: function(e) {},

    escape: function(e) {
        this.hide_all();
    },

    up: function(e) {
        //console.log("up");
        this.updown(true, e.ctrlKey || e.shiftKey);
    },

    down: function(e) {
        //console.log("up");
        this.updown(false, null, e.ctrlKey || e.shiftKey);
    },

    updown: function(goup, gofirst, golast) {
        //console.log("updown", goup, gofirst, golast);
        var $input = this.$input,
        opts = this.options,
        $pane = this.$pane,
        $list = this.$list;
        if (!$pane.is(":visible")) {
            if (!goup) {
                this.textchange();
            }
            return;
        }
        var $li = $("."+opts.css.item + ":visible", $list);
        if ($li.length) {
            var first = $li[0],
                last = $li[$li.length-1],
                $current = this.get_selected() || [],
                $first, $last, $prev, $next, data;

            window.clearTimeout(this.ignore_mouseover.timeout);
            this._ignore_mouseover = false;

            if (goup) {
                if (gofirst) {
                    $first = $(first);
                    $first.trigger("mouseover.suggest");
                    data = $first.data("data.suggest");
                    if (data) {
                        $input.val($.suggest.$$(opts.css.item_name, $first).text());
                    }
                    else {
                        $input.val($input.data("original.suggest"));
                        this.hoverout_list();
                    }
                    //console.log("scroll_to $first", $first, $list);
                    this.scroll_to($first);
                }
                else if (!$current.length) {
                    $last = $(last);
                    $last.trigger("mouseover.suggest");
                    data = $last.data("data.suggest");
                    if (data) {
                        $input.val($.suggest.$$(opts.css.item_name, $last).text());
                    }
                    else {
                        $input.val($input.data("original.suggest"));
                        this.hoverout_list();
                    }
                    //console.log("scroll_to $last", $last, $list);
                    this.scroll_to($last);
                }
                else if ($current[0] == first) {
                    $(first).removeClass(opts.css.selected);
                    $input.val($input.data("original.suggest"));
                    this.hoverout_list();
                }
                else {
                    $prev = $current.prevAll("."+opts.css.item + ":visible:first").trigger("mouseover.suggest");
                    //console.log("$prev", $prev);
                    data = $prev.data("data.suggest");
                    if (data) {
                        $input.val($.suggest.$$(opts.css.item_name, $prev).text());
                    }
                    else {
                        $input.val($input.data("original.suggest"));
                        this.hoverout_list();
                    }
                    //console.log("scroll_to $prev", $prev, $list);
                    this.scroll_to($prev);
                }
            }
            else {
                if (golast) {
                    $last = $(last);
                    $last.trigger("mouseover.suggest");
                    data = $last.data("data.suggest");
                    if (data) {
                        $input.val($.suggest.$$(opts.css.item_name, $last).text());
                    }
                    else {
                        $input.val($input.data("original.suggest"));
                        this.hoverout_list();
                    }
                    //console.log("scroll_to $last", $last, $list);
                    this.scroll_to($last);
                }
                else if (!$current.length) {
                    $first = $(first);
                    $first.trigger("mouseover.suggest");
                    data = $first.data("data.suggest");
                    if (data) {
                        $input.val($.suggest.$$(opts.css.item_name, $first).text());
                    }
                    else {
                        $input.val($input.data("original.suggest"));
                        this.hoverout_list();
                    }
                    //console.log("scroll_to $first", $first, $list);
                    this.scroll_to($first);
                }
                else if ($current[0] == last) {
                    $(last).removeClass(opts.css.selected);
                    $input.val($input.data("original.suggest"));
                    this.hoverout_list();
                }
                else {
                    $next = $current.nextAll("."+opts.css.item + ":visible:first").trigger("mouseover.suggest");
                    //console.log("$next", $next);
                    data = $next.data("data.suggest");
                    if (data) {
                        $input.val($.suggest.$$(opts.css.item_name, $next).text());
                    }
                    else {
                        $input.val($input.data("original.suggest"));
                        this.hoverout_list();
                    }
                    //console.log("scroll_to $next", $next, $list);
                    this.scroll_to($next);
                }
            }
        }
    },

    scroll_to: function($item) {
        var $list = this.$list,
        scrollTop = $list.scrollTop(),
        scrollBottom = scrollTop + $list.outerHeight(),
        item_height = $item.outerHeight(),
        offsetTop = $item[0].offsetTop,
        offsetBottom = offsetTop + item_height;
        if (offsetTop < scrollTop) {
            this.ignore_mouseover();
            $list.scrollTop(offsetTop);
        }
        else if (offsetBottom > scrollBottom) {
            this.ignore_mouseover();
            $list.scrollTop(scrollTop + offsetBottom - scrollBottom);
        }
    },

    textchange: function() {
        this.$input.removeData("data.suggest");
        var val = $.trim(this.$input.val());
        if (!val) {
            this.hide_all();
            return;
        }
        this.request(val);
    },

    request: function(val) {},

    response: function(data) {
        if (!this.check_response(data)) {
            return;
        }
        var result = [];

        if ($.isArray(data)) {
            result = data;
        }
        else if ("result" in data) {
            result = data.result;
        }

        var args = $.map(arguments, function(a) {
                return a;
            });

        this.response_hook.apply(this, args);

        var $first = null,
        self = this,
        $list = this.$list;
        $.each(result, function(i,n) {
                var $li = self.create_item(this, data)
                    .bind("mouseover.suggest", function(e) {
                            self.mouseover_item(e);
                        })
                    .data("data.suggest", this);
                self.$list.append($li);
                if (i === 0) {
                    $first = $li;
                }
            });

        this.$input.data("original.suggest", this.$input.val());
        this.$pane.data("suggest", this);
        this.$list.data("suggest", this);

        if (!result.length) {
            var $nomatch = $('<li class="nomatch">' + this.options.nomatch + '</li>')
                .bind("click.suggest", function(e) {
                        e.stopPropagation();
                        //                    self.$input.focus();
                    });
            self.$list.append($nomatch);
        }

        args.push($first);
        this.show_hook.apply(this, args);
        this.position();
        this.$pane.show();
    },

    create_item: function(data, response_data) {
        var opts = this.options,
        $li = $('<li class="' + opts.css.item + '"></li>');
        $li.append('<div class="' + opts.css.item_name + '">' + data.name + '</div>');
        return $li;
    },

    mouseover_item: function(e) {
        if (this._ignore_mouseover) {
            return;
        }
        var target = e.target;
        if (target.nodeName.toLowerCase() !== "li") {
            target = $(target).parents("li:first");
        }
        var $li = $(target),
        opts = this.options,
        $list = this.$list;
        $("."+opts.css.item, $list)
            .each(function() {
                if (this !== $li[0]) {
                    $(this).removeClass(opts.css.selected);
                }
            });
        if (!$li.hasClass(opts.css.selected)) {
            $li.addClass(opts.css.selected);
            this.mouseover_item_hook($li);
        }
    },

    mouseover_item_hook: function($li) {},

    hoverover_list: function(e) {},

    hoverout_list: function(e) {},

    check_response: function(response_data) {
        return true;
    },

    response_hook: function(response_data) {
        this.$pane.hide();
        this.$list.empty();
    },

    show_hook: function(response_data) {
        // remove anything next to list - added by other suggest plugins
        this.$list.prevAll().remove();
        this.$list.nextAll().remove();
    },

    position: function() {
        var $input = this.$input,
        $pane = this.$pane,
        pos = $input.offset(),
        input_width = $input.outerWidth(true),
        input_height = $input.outerHeight(true);
        pos.top += input_height;

        var old_pos = {
            top:  parseInt($pane.css("top"), 10),
            left:  parseInt($pane.css("left"), 10)
        },
        // show to calc dimensions
        pane_width = $pane.outerWidth(),
        pane_height = $pane.outerHeight(),
        pane_right = pos.left + pane_width,
        pane_bottom = pos.top + pane_height,
        pane_half = pos.top + pane_height / 2,
        scroll_left =  $(window).scrollLeft(),
        scroll_top =  $(window).scrollTop(),
        window_width = $(window).width(),
        window_height = $(window).height(),
        window_right = window_width + scroll_left,
        window_bottom = window_height + scroll_top;


        // is input left or right side of window?
        var left = true;
        if ('left' == this.options.align ) {
            left = true;
        }
        else if ('right' == this.options.align ) {
            left = false;
        }
        else if (pos.left > (scroll_left + window_width/2)) {
            left = false;
        }
        if (!left) {
            left = pos.left - (pane_width - input_width);
            if (left > scroll_left) {
                pos.left = left;
            }
        }

        if (pane_half > window_bottom) {
            // can we see at least half of the list?
            var top = pos.top - input_height - pane_height;
            if (top > scroll_top) {
                pos.top = top;
            }
        }

        //console.log("old_pos " + old_pos.top + ", " + old_pos.left);
        //console.log("new_pos " + pos.top + ", " + pos.left);

        if (!(pos.top === old_pos.top && pos.left === old_pos.left)) {
            $pane.css({top:pos.top, left:pos.left});
        }
    },

    ignore_mouseover: function(e) {
        this._ignore_mouseover = true;
        var self = this;
        this.ignore_mouseover.timeout = window.setTimeout(function() { self.ignore_mouseover_reset();}, 1000);
    },

    ignore_mouseover_reset: function() {
        this._ignore_mouseover = false;
    },

    get_selected: function() {
        var selected = null,
        select_class = this.options.css.selected;
        $("li", this.$list)
            .each(function() {
                var $this = $(this);
                if ($this.hasClass(select_class) && $this.is(":visible")) {
                    selected = $this;
                    return false;
                }
            });
        return selected;
    },

    onselect: function($selected, focus) {
        var data = $selected.data("data.suggest");
        if (data) {
            this.$input.val($.suggest.$$(this.options.css.item_name, $selected).text())
                .data("data.suggest", data)
                .trigger("fb-select", data);
        }
        else {
            this.check_required();
        }
        if (focus) {
            //          this.$input.focus();
        }
    },

    check_required: function() {
        switch(this.options.required) {
        case false:
        // required == FALSE : no selection is required
        // ignore
        break;
        case true:
        // required == TRUE  : selection required, empty value is allowed
        if (!$.trim(this.$input.val())) {
            this.$input.trigger("fb-required");
        }
        break;
        case 'always':
        // required == 'always'  : selection required, empty value NOT allowed
        this.$input.trigger("fb-required");
        }
    },

    hide_all: function(e) {
        this.$pane.hide();
    },

    _pane_selector: function(options) {
        // subclasses can over-write the default pane jquery selector
        // default is ".fbs-pane"
        return ("." + options.css_prefix + options.css.pane + ":first");
    }

};

$.extend($.suggest, {

             defaults: {

                 helptext: '<em class="fbs-help-text">Start typing to get some suggestions</em>',

                 /*
                  *  values can be false, true, 'always'
                  *  if false, don't trigger fb-required
                  *  if true, trigger fb-required on blur if nothing selected and input val is not empty
                  *  if 'always', trigger fb-required on blur if nother selected (even if input val is empty
                  */
                 required: false,

                 nomatch: "no matches",

                 // CSS default class names
                 css: {
                     pane: "fbs-pane",                    // outer pane of suggestion list <div>
                     list: "fbs-list",                    // suggestion list               <ul>
                     item: "fbs-item",                    // suggestion list item          <li>
                     item_name: "fbs-item-name",
                     selected: "fbs-selected"            // list item class on mouseover
                 },

                 /*
                  * css prefix that is prepended to the top level container classes
                  * (fbs-pane and fbs-flyout-pane)
                  *  i.e. if css_prefix="foo-" then pane class is "foo-fbs-pane"
                  */
                 css_prefix: null
             },

             $$: function(cls, ctx) {
                 /**
                  * helper for class selector
                  */
                 return $("." + cls, ctx);
             },

             use_jsonp: function(service_url) {
                 /*
                  * if we're on the same host, then we don't need to use jsonp.
                  * This greatly increases our cachability
                  */
                 if (!service_url) {
                     return false;             // no host == same host == no jsonp
                 }

                 var pathname_len = window.location.pathname.length;
                 var hostname = window.location.href;
                 hostname = hostname.substr(0, hostname.length - pathname_len);
                 //console.log("Hostname = ", hostname);
                 if (hostname === service_url) {
                     return false;
                 }
                 return true;
             },

             strongify: function(str, substr) {
                 var strong = str;
                 var index = str.toLowerCase().indexOf(substr.toLowerCase());
                 if (index >= 0) {
                     var substr_len = substr.length;
                     strong = str.substring(0, index) +
                         '<strong>' + str.substring(index, index + substr_len) + '</strong>' +
                         str.substring(index + substr_len);
                 }
                 return strong;
             },

             keyCode: {
                 //BACKSPACE: 8,
                 CAPS_LOCK: 20,
                 //COMMA: 188,
                 CONTROL: 17,
                 //DELETE: 46,
                 DOWN: 40,
                 END: 35,
                 ENTER: 13,
                 ESCAPE: 27,
                 HOME: 36,
                 INSERT: 45,
                 LEFT: 37,
                 //NUMPAD_ADD: 107,
                 //NUMPAD_DECIMAL: 110,
                 //NUMPAD_DIVIDE: 111,
                 NUMPAD_ENTER: 108,
                 //NUMPAD_MULTIPLY: 106,
                 //NUMPAD_SUBTRACT: 109,
                 PAGE_DOWN: 34,
                 PAGE_UP: 33,
                 //PERIOD: 190,
                 RIGHT: 39,
                 SHIFT: 16,
                 SPACE: 32,
                 TAB: 9,
                 UP: 38,
                 OPTION: 18,
                 APPLE: 224
             },

             is_char: function(e) {
                 if (e.type === "keypress") {
                     if ((e.metaKey || e.ctrlKey) && e.charCode === 118) { // ctrl+v
                         return true;
                     }
                     else if ("isChar" in e) {
                         return e.isChar;
                     }
                 }
                 else {
                     var not_char = $.suggest.keyCode.not_char;
                     if (!not_char) {
                         not_char = {};
                         $.each($.suggest.keyCode, function(k,v) {
                                    not_char[''+v] = 1;
                                });
                         $.suggest.keyCode.not_char = not_char;
                     }
                     return !(('' + e.keyCode) in not_char);
                 }
             }
         });

// *THE* Freebase suggest implementation
$.suggest("suggest", {
        _init: function() {
            var self = this;
            if (!this.options.flyout_service_url) {
                this.options.flyout_service_url = this.options.service_url;
            }
            this.jsonp = $.suggest.use_jsonp(this.options.service_url);

            if (this.options.flyout) {
                var $flyoutpane = $.suggest.$$(this.options.css.flyoutpane);
                if ($flyoutpane.length) {
                    this.$flyoutpane = $flyoutpane;
                }
                else {
                    this.$flyoutpane = $('<div style="display:none;position:absolute" class="fbs-reset ' + this.options.css_prefix + this.options.css.flyoutpane + '"></div>');
                    $(document.body).append(this.$flyoutpane);
                    var hoverover = function(e) {
                        $(this).data("suggest").hoverover_list(e);
                    };
                    var hoverout = function(e) {
                        $(this).data("suggest").hoverout_list(e);
                    };
                    this.$flyoutpane.hover(hoverover, hoverout)
                        .bind("mousedown.suggest", function(e) {
                                e.stopPropagation();
                                $(this).data("suggest").$pane.click();
                            });
                }
            }
        },

        shift_enter: function(e) {
            if (this.options.suggest_new) {
                this.suggest_new();
                this.hide_all();
            }
            else {
                this.check_required();
            }
        },

        hide_all: function(e) {
            this.$pane.hide();
            if (this.$flyoutpane) {
                this.$flyoutpane.hide();
            }
        },

        request: function(val, start) {
            var self = this;
            if (this.ac_xhr) {
                this.ac_xhr.abort();
            }
            var data = {
                prefix: val
            };
            if (start) {
                data.start = start;
            }

            var ac_param = {};
            $.each(["type", "type_strict", "mql_filter", "as_of_time"], function(i,n) {
                    ac_param[n] = self.options[n];
                });

            // legacy options.ac_param
            $.extend(ac_param, this.options.ac_param);

            $.each(ac_param, function(k,v) {
                    if (v === null || v === "") {
                        delete ac_param[k];
                    }
                    else if (typeof v === "object") {
                        if (typeof JSON == "undefined") {
                            init_JSON();
                        }
                        ac_param[k] = JSON.stringify(v);
                    }
                });

            $.extend(data, ac_param);

            $.ajax({
                    "type": "GET",
                        "url": this.options.service_url + this.options.service_path,
                        "data": data,
                        "beforeSend": function(xhr) {
                        self.ac_xhr = xhr;
                    },
                        "success": function(data, status) {
                            self.response(data, start ? start : -1);
                        },
                            "dataType": this.jsonp ? "jsonp" : "json"
                                });
        },


        create_item: function(data, response_data) {
            var opts = this.options,
                li_class = [opts.css.item];
            if ("class" in data) {
                li_class.push(data["class"]);
            }
            var $li =  $('<li class="' + li_class.join(" ") + '"></li>');

            /*
              if (data.alias && data.alias.length) {
              var alias = $.map(data.alias, function(a) {
              return $.suggest.strongify(a, response_data.prefix);
              });
              $li.append('<div class="' + opts.css.item_alias + '">' + alias.join(", ") + '</div>');
              }
            */
            $li.append('<div class="' + opts.css.item_name + '">' + $.suggest.strongify(data.name, response_data.prefix) + '</div>');
            /*
              if (data.type && data.type.length) {
              var types = $.map(data.type, function(a) { return a.name; });
              $li.append('<div class="' + opts.css.item_type + '">' + types.join(", ") + '</div>');
              }
            */
            //console.log("create_item", $li);
            return $li;
        },


        mouseover_item_hook: function($li) {
            var data = $li.data("data.suggest");
            if (this.options.flyout) {
                if (data) {
                    this.flyout_request(data);
                }
                else {
                    //this.$flyoutpane.hide();
                }
            }
        },

        check_response: function(response_data) {
            return response_data.prefix === $.trim(this.$input.val());
        },

        response_hook: function(response_data, start) {
            if (this.$flyoutpane) {
                this.$flyoutpane.hide();
            }
            if (start > 0) {
                $(".fbs-more", this.$pane).remove();
            }
            else {
                this.$pane.hide();
                this.$list.empty();
            }
        },

        show_hook: function(response_data, start, $first) {
            var opts = this.options,
                self = this;

            // remove more/suggest new divs
            //this.$list.nextAll().remove();

            var $header = $(".fbs-header", this.$pane),
                $more = $(".fbs-more", this.$pane),
                $suggestnew = $(".fbs-suggestnew", this.$pane);

            // header
            if (response_data.result && response_data.result.length && opts.header) {
                if (!$header.length) {
                    $header = $('<div class="fbs-header"></div>').click(function(e) {
                            e.stopPropagation();
                            return false;
                        });
                    this.$pane.prepend($header);
                }
                $header.html(opts.header);
            }
            else {
                $header.remove();
            }

            // more
            if (response_data.result && response_data.result.length && "start" in response_data) {
                if (!$more.length) {
                    $more = $('<div class="fbs-more"><a class="fbs-more-link" href="#" title="(Ctrl+m)">view more <span class="unicode">&#9660;</span></a></div>');
                    $(".fbs-more-link", $more)
                        .bind("click.suggest", function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                var $m = $(this).parent(".fbs-more");
                                $m.data("suggest").more($m.data("start.suggest"));
                            });
                    this.$list.after($more);
                }
                $more.data("suggest", self);
                $more.data("start.suggest", response_data.start);
            }
            else {
                $more.remove();
            }

            // suggest_new
            if (opts.suggest_new) {
                if (!$suggestnew.length) {
                    // create suggestnew option
                    $suggestnew = $('<div class="fbs-suggestnew"></div>').append(opts.suggest_new)
                        .bind("click.suggest", function(e) {
                                $(this).data("suggest").suggest_new(e);
                            });
                    this.$pane.append($suggestnew);
                }
                $suggestnew.data("suggest", self);
            }
            else {
                $suggestnew.remove();
            }

            // scroll to first if clicked on "more"
            if ($first) {
                if (start > 0) {
                    var top = $first[0].offsetTop;
                    var scrollTop = this.$list.scrollTop();
                    //console.log("scrollTop", top, scrollTop);
                    this.$list.animate({scrollTop: top}, "slow",
                                       function(){ $first.trigger("mouseover.suggest");});
                }
            }
        },

        suggest_new: function(e) {
            var val = $.trim(this.$input.val());
            if (!val) {
                return;
            }
            //console.log("suggest_new", val);
            this.$input.trigger("fb-select-new", val);
            this.hide_all();
        },

        more: function(start) {
            if (start) {
                var original_value = this.$input.data("original.suggest");
                if (original_value !== null) {
                    this.$input.val(original_value);
                }
                this.request($.trim(this.$input.val()), start);
            }
            return false;
        },

        flyout_request: function(data) {
            if (this.flyout_xhr) {
                this.flyout_xhr.abort();
            }

            var data_suggest = this.$flyoutpane.data("data.suggest");
            if (data_suggest && data_suggest.id === data.id) {
                if (!this.$flyoutpane.is(":visible")) {
                    var $selected = this.get_selected();
                    this.flyout_position($selected);
                    this.$flyoutpane
                        .show()
                        .data("data.suggest", data_suggest)
                        .data("suggest", this);
                }
                return;
            }

            //this.$flyoutpane.hide();

            var submit_data = {
                id: data.id
            };
            if (this.options.as_of_time) {
                submit_data.as_of_time = this.options.as_of_time;
            }

            var self = this;
            $.ajax({
                       "type": "GET",
                       "url": this.options.flyout_service_url + this.options.flyout_service_path,
                       "data": submit_data,
                       "beforeSend": function(xhr) {
                           self.flyout_xhr = xhr;
                       },
                       "success": function(data, status) {
                           self.flyout_response(data);
                       },
                       "dataType": this.jsonp ? "jsonp" : "json"
                   });
        },

        flyout_response: function(data) {
            var opts = this.options,
                $pane = this.$pane,
                $selected = this.get_selected() || [];
            //console.log("selected", $selected);
            if ($pane.is(":visible") && $selected.length) {
                var data_suggest = $selected.data("data.suggest");
                if (data_suggest && data.id === data_suggest.id) {
                    this.$flyoutpane.html(data.html);
                    this.flyout_position($selected);
                    this.$flyoutpane
                        .show()
                        .data("data.suggest", data_suggest)
                        .data("suggest", this);
                }
            }
        },

        flyout_position: function($item) {
            var pos,
                old_pos = {
                    top: parseInt(this.$flyoutpane.css("top"), 10),
                    left: parseInt(this.$flyoutpane.css("left"), 10)
                },
                pane_pos = this.$pane.offset(),
                pane_width = this.$pane.outerWidth(),
                flyout_height = this.$flyoutpane.outerHeight(),
                flyout_width = this.$flyoutpane.outerWidth();

                if (this.options.flyout === "bottom") {
                    // flyout position on top/bottom
                    pos = pane_pos;
                    var input_pos = this.$input.offset();
                    if (pane_pos.top < input_pos.top) {
                        pos.top -= flyout_height;
                    }
                    else {
                        pos.top += this.$pane.outerHeight();
                    }
                    this.$flyoutpane.addClass(this.options.css.flyoutpane + "-bottom");
                }
                else {
                    pos = $item.offset();
                    var item_height = $item.outerHeight();

                    pos.left += pane_width;
                    var flyout_right = pos.left + flyout_width,
                        scroll_left =  $(document.body).scrollLeft(),
                        window_right = $(window).width() + scroll_left;

                    pos.top = pos.top + item_height - flyout_height;
                    if (pos.top < pane_pos.top) {
                        pos.top = pane_pos.top;
                    }

                    if (flyout_right > window_right) {
                        var left = pos.left - (pane_width + flyout_width);
                        if (left > scroll_left) {
                            pos.left = left;
                        }
                    }
                    this.$flyoutpane.removeClass(this.options.css.flyoutpane + "-bottom");
                }

                if (!(pos.top === old_pos.top && pos.left === old_pos.left)) {
                    this.$flyoutpane.css({top:pos.top, left:pos.left});
                }
        },

        hoverover_list: function(e) {
            //console.log("hoverover_list", e);
            //window.clearTimeout(this.hoverout_list.timeout);
        },

        hoverout_list: function(e) {
            if (this.$flyoutpane && !this.get_selected()) {
                this.$flyoutpane.hide();
            }
            /*
            //console.log("hoverout_list", e);
            if (this._ignore_mouseover) {
            //console.log("ignoring mouseout");
            return;
            }
            window.clearTimeout(this.hoverout_list.timeout);

            var $flyoutpane = this.$flyoutpane;
            if ($flyoutpane) {
            function timeout() {
            $flyoutpane.hide();
            }
            this.hoverout_list.timeout = window.setTimeout(timeout, 200);
            }
            */
        }
    });

// Freebase suggest settings
$.extend($.suggest.suggest, {

             defaults: {

                 type: null,

                 type_strict: "any",

                 mql_filter: null,

                 as_of_time: null,

                 // base url for autocomplete service
                 service_url: "http://www.freebase.com",

                 // service_url + service_path = url to autocomplete service
                 service_path: "/private/suggest",

                 // 'left', 'right' or null
                 // where list will be aligned left or right with the input
                 align: null,

                 // whether or not to show flyout on mouseover
                 flyout: 'bottom',

                 // default is service_url if NULL
                 flyout_service_url: "http://flyout.freebaseapps.com",

                 // flyout_service_url + flyout_service_path = url to flyout service
                 flyout_service_path: "/flyout",

                 // any html snippet you want to show for the suggest new option
                 // clicking will trigger an fb-select-new event along with the input value
                 suggest_new: null,

                 // header shown above the suggest list
                 header: "Select an item from the list:",

                 nomatch: '<em class="fbs-nomatch-text">No suggested matches.</em><h3>Tips on getting better suggestions:</h3><ul class="fbs-search-tips"><li>Enter more or fewer characters</li><li>Add words related to your original search</li><li>Try alternate spellings</li><li>Check your spelling</li></ul>',

                 // CSS default class names
                 css: {
                     flyoutpane: "fbs-flyout-pane"       // outer pane of flyout          <div>
                 }
             }
         });

function init_JSON() {
    if(!this.JSON){JSON={}}(function(){function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z"};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==="string"){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}}());
}

})(jQuery);

jQuery.suggest.version='Version:r77376:77420 Built:Fri Jul 10 2009 by will';
