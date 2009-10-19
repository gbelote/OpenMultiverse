
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
            this.raphaelObject.animate({ 'fill-opacity': 0.8 }, 60);
        }

        else
        {
            // TODO hack - need to move detail outside shape
            this.raphaelObject.animate({ 'fill-opacity': 0.4 }, 30);
        }
    }
});

$.extend( Rectangle.prototype, {
    translate: function (dx,dy) {
        this.setX( this.getX() + dx );
        this.setY( this.getY() + dy );
    }
});

var Point = function(x,y) {
    this.addProperty( 'x', x );
    this.addProperty( 'y', y );
}

$.extend( Point.prototype, OpenMultiverse.PropertyObject );

$.extend( Point.prototype, {
    translate: function (dx,dy) {
        this.setX( this.getX() + dx );
        this.setY( this.getY() + dy );
    }
});


var PolygonPath = function(points) {
    this.addProperty('points', points);
}

$.extend( PolygonPath.prototype, OpenMultiverse.PropertyObject );

$.extend( PolygonPath.prototype, {
    getPathString: function() {
        var str = "";
        $.each( this.getPoints(), function(i) {
            str += i == 0 ? "M" : "L";
            str += this.getX();
            str += " ";
            str += this.getY();
        });
        str += "z";

        return str;
    }
});

$.extend( PolygonPath.prototype, {
    raphaelObject: false,

    makeRenderable: function( paper, options ) {
        var settings = $.extend( { attr: {} }, options );

        this.raphaelObject = paper.path(this.getPathString());
        this.raphaelObject.attr( settings.attr );

        OpenMultiverse.propagateMouseEvents( this.raphaelObject.node, this );

        return this.raphaelObject;
    }
});

$.extend( PolygonPath.prototype, {
    setDragging: function( isDragging ) {
    }
});

$.extend( PolygonPath.prototype, {
    translate: function (dx,dy) {
        $.each( this.points, function() {
            this.translate(dx,dy);
        });
        // TODO unhack
        this.raphaelObject.translate(dx,dy);
    }
});


var LineSegment = function( p1, p2 ) {
    this.addProperty( 'p1', p1 );
    this.addProperty( 'p2', p2 );

    var me = this;
    $(p1).bind( "propchange", function(e) {
        $(me).trigger({
            type: "propchange",
            propertyName: 'p1',
            subevent: e,
            point: p1
        })
        me.repath();
    });

    $(p2).bind( "propchange", function(e) {
        $(me).trigger({
            type: "propchange",
            propertyName: 'p2',
            subevent: e,
            point: p2
        })
        me.repath();
    });
};

$.extend( LineSegment.prototype, {
    translate: function (dx,dy) {
        this.getP1().translate(dx,dy);
        this.getP2().translate(dx,dy);
    },

    // recompute the path
    repath: function () {
        this.raphaelObject.attr({
            path: [
                'M', this.getP1().getX(), ',', this.getP1().getY(),
                'L', this.getP2().getX(), ',', this.getP2().getY()
            ].join('')
        });
    }
});

$.extend( LineSegment.prototype, {
    raphaelObject: false,

    makeRenderable: function( paper, options ) {
        var settings = $.extend( { attr: {} }, options );

        this.raphaelObject = paper.line(
            this.getP1().getX(),
            this.getP1().getY(),
            this.getP2().getX(),
            this.getP2().getY());

        this.raphaelObject.attr( settings.attr );

        OpenMultiverse.propagateMouseEvents( this.raphaelObject.node, this );

        return this.raphaelObject;
    }
});

$.extend( LineSegment.prototype, OpenMultiverse.PropertyObject );

$.extend( Rectangle.prototype, {
    perimeter: function() {
        return new PolygonPath ([
            new Point(this.getX(), this.getY()),
            new Point(this.getX()+this.getWidth(), this.getY()),
            new Point(this.getX()+this.getWidth(), this.getY()+this.getHeight()),
            new Point(this.getX(), this.getY()+this.getHeight())
        ]);
    }
});



