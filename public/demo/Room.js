
var Room = function(area, wall, doors) {
    this.area = area || new Group([]);
    this.wall = wall || new Group([]);
    this.doors = doors || new Group([]);

    this.addProperty( 'dragging', false );

    $(this).bind("propchange", function(e) {
        if( e.propertyName == 'dragging' ) {
            area.setDragging( e.newValue );
            wall.setDragging( e.newValue );
        }
    });

    $(this).svg_draggable();
    $(this).bind('drag:start', function(e) { this.setDragging(true) });
    $(this).bind('drag:update', function(e) { this.translate(e.dx,e.dy) });
    $(this).bind('drag:end', function(e) { this.setDragging(false) });

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
        var settings = $.extend( { area: {}, wall: {}, doors: {} }, options );

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

        var doorsSettings = $.extend({
            attr: {
                'fill': 'gray'
            }
        }, settings.doors);

        this.raphaelObject = paper.set();
        this.raphaelObject.push( this.area.makeRenderable(paper,areaSettings) );
        this.raphaelObject.push( this.wall.makeRenderable(paper,wallSettings) );
        this.raphaelObject.push( this.doors.makeRenderable(paper,doorsSettings) );

        $.each( this.area.parts, function() { $(this.raphaelObject.node).css('cursor','move') });
        $.each( this.wall.parts, function() { $(this.raphaelObject.node).css('cursor','crosshair') });

        return this.raphaelObject;
    }
});

$.extend( Room.prototype, OpenMultiverse.PropertyObject );

$.extend( Room.prototype, {
    translate: function (dx,dy) {
        this.area.translate(dx,dy);
        this.wall.translate(dx,dy);
        this.doors.translate(dx,dy);
    }
});

