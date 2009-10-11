
om.Resizeable = {
    addShapeChangeListener: function( name ) {
        $(this).bind("propchange", function(e) {
            if( e.propertyName == name ) {
                var newAttr = {};
                newAttr[name] = e.newValue;
                this.raphaelObject.attr(newAttr);
            }
        });
    }
}

var Rectangle = function( x,y,width,height ) {
    this.addProperty( 'x', x );
    this.addProperty( 'y', y );
    this.addProperty( 'width', width );
    this.addProperty( 'height', height );
}

$.extend( Rectangle.prototype, {
    raphaelObject: false,

    makeRenderable: function( paper, options ) {
        var settings = $.extend( { attr: {} }, options );

        this.raphaelObject = paper.rect(this.getX(),this.getY(),this.getWidth(),this.getHeight());
        this.raphaelObject.attr( settings.attr );

        this.addShapeChangeListener("x");
        this.addShapeChangeListener("y");
        this.addShapeChangeListener("width");
        this.addShapeChangeListener("height");

        OpenMultiverse.propagateMouseEvents( this.raphaelObject.node, this );

        return this.raphaelObject;
    }
});

$.extend( Rectangle.prototype, OpenMultiverse.PropertyObject );
$.extend( Rectangle.prototype, OpenMultiverse.Resizeable );

$.extend( Rectangle.prototype, {
    setDragging: function( isDragging ) {
        if( isDragging ) {
            this.raphaelObject.animate({ 'fill-opacity': 1 }, 60);
        }

        else
        {
            // TODO hack - need to move detail outside shape
            this.raphaelObject.animate({ 'fill-opacity': 0.4 }, 30);
        }
    }
});

