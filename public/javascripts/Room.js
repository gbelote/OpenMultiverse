
var Room = function(area, walls) {
    // Set of polygons
    this.area = area;
    // Set of paths
    this.walls = walls;

    this.addProperty( 'dragging', false );

    $(this).bind("propchange", function(e) {
        if( e.propertyName == 'dragging' ) {
            area.setDragging( e.newValue );
        }
    });

    var me = this;
    var lastDrag = false;
    $(this).mousedown(function(e) {
        e.preventDefault();
        lastDrag = e;
        me.setDragging(true);
    });

    $(window).mouseup(function(e) {
        me.setDragging(false);
        lastDrag = false;
    });

    $(window).mousemove(function(e) {
        if( me.getDragging() ) {
            //console.log( "x: "+(e.pageX-lastDrag.pageX)+" y: "+(e.pageY-lastDrag.pageY) );
            //console.log(e);
            var dx = e.pageX - lastDrag.pageX;
            var dy = e.pageY - lastDrag.pageY;

            // TODO unhack
            $.each(me.area.parts, function() {
                this.setX( this.getX() + dx );
                this.setY( this.getY() + dy );
            });

            lastDrag = e;
        }
    });

    OpenMultiverse.propagateMouseEvents( this.area, this );
    //OpenMultiverse.propagateMouseEvents( this.walls, this );
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
        var settings = $.extend( { area: {}, walls: {} }, options );

        var areaSettings = $.extend( {
            attr: {
                'fill': '#001dff',
                'fill-opacity': 0.4,
                'stroke': 'none'
            }
        }, settings.area );

        this.raphaelObject = paper.set();
        this.raphaelObject.push( this.area.makeRenderable(paper,areaSettings) );
        return this.raphaelObject;
    }
});

$.extend( Room.prototype, OpenMultiverse.PropertyObject );

