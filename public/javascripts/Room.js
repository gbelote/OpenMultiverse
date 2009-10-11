
var Room = function(area, wall) {
    this.area = area;
    this.wall = wall;

    $.each( area.parts, function() {
        $(this.raphaelObject.node).css('cursor','hand');
    });

    this.addProperty( 'dragging', false );

    $(this).bind("propchange", function(e) {
        if( e.propertyName == 'dragging' ) {
            area.setDragging( e.newValue );
            wall.setDragging( e.newValue );
        }
    });

    var me = this;
    var lastDrag = false;
    $(this).mousedown(function(e) {
        e.preventDefault();
        lastDrag = e;
        me.setDragging(true);

        var mousemoveHandler = function(e) {
            if( me.getDragging() ) {
                //console.log( "x: "+(e.pageX-lastDrag.pageX)+" y: "+(e.pageY-lastDrag.pageY) );
                //console.log(e);
                var dx = e.pageX - lastDrag.pageX;
                var dy = e.pageY - lastDrag.pageY;

                me.translate(dx,dy);

                lastDrag = e;
            }
        }

        var mouseupHandler = function(e) {
            me.setDragging(false);
            lastDrag = false;

            $(window).unbind( 'mouseup', mouseupHandler );
            $(window).unbind( 'mousemove', mousemoveHandler );
        }

        $(window).bind( 'mousemove', mousemoveHandler );
        $(window).bind( 'mouseup', mouseupHandler );
    });

    OpenMultiverse.propagateMouseEvents( this.area, this );
    //OpenMultiverse.propagateMouseEvents( this.wall, this );
};

$.extend( Room.prototype, {
    render: function( paper, options ) {
        var settings = { }
        var settings = $.extend( settings, options )
    }
});

$.extend( Room.prototype, {
    raphaelObject: false,

    makeRenderable: function( paper, options ) {
        var settings = $.extend( { area: {}, wall: {} }, options );

        var areaSettings = $.extend( {
            attr: {
                'fill': '#001dff',
                'fill-opacity': 0.4,
                'stroke': 'none'
            }
        }, settings.area );

        var wallSettings = $.extend( {
            attr: {
                'stroke-width': '3'
            }
        }, settings.wall );

        this.raphaelObject = paper.set();
        this.raphaelObject.push( this.area.makeRenderable(paper,areaSettings) );
        this.raphaelObject.push( this.wall.makeRenderable(paper,wallSettings) );
        return this.raphaelObject;
    }
});

$.extend( Room.prototype, OpenMultiverse.PropertyObject );

$.extend( Room.prototype, {
    translate: function (dx,dy) {
        this.area.translate(dx,dy);
        this.wall.translate(dx,dy);
    }
});

