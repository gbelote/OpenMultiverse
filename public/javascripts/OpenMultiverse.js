// Create an OpemMultiverse namespace
var OpenMultiverse = {
    PropertyObject: {
        toCamelCase: function( str ) {
            var parts = str.split( /_+/ );
     
            var map = function(x) {
                return x.length == 1 ? x.toUpperCase() : x.slice(0,1).toUpperCase() + x.slice(1);
            }
     
            var reduce = function(x,a) {
                return a + x;
            }
     
            return $.reduce( $.map(parts, map), reduce, '' );
        },
     
        getSetterName: function( propertyName ) {
            return "set"+this.toCamelCase( propertyName );
        },
     
        getGetterName: function( propertyName ) {
            return "get"+this.toCamelCase( propertyName );
        },
     
        addProperty: function(key, value) {
            var fns = {};

            fns[key] = value;
     
            fns[this.getSetterName(key)] = function(value) {
                var oldValue = this[key];
                this[key] = value;
                $(this).trigger({
                    type: "propchange",
                    propertyName: key,
                    oldValue: oldValue,
                    newValue: value
                });
                return this;
            }
     
            fns[this.getGetterName(key)] = function() {
                return this[key];
            }
     
            $.extend( this, fns );
        }
    },

    propagateMouseEvents: function(elmt, obj) {
        var fn = function(e) { if(!e.isPropagationStopped()) $(obj).trigger(e) };
        $(elmt).mouseup(fn);
        $(elmt).mousedown(fn);
        $(elmt).click(fn);
        $(elmt).mouseover(fn);
        $(elmt).mouseout(fn);
        $(elmt).mousemove(fn);
        $(elmt).mouseenter(fn);
        $(elmt).mouseleave(fn);
    }

};

// define shortcut
var om = OpenMultiverse;

