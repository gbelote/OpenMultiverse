var SimpleRoom = function( options ) {
    var settings = $.extend({
        x: 10,
        y: 10,
        width: 120,
        height: 120,
        initialDoor: false
    }, options);

    this.addProperty( 'x', settings.x );
    this.addProperty( 'y', settings.y );
    this.addProperty( 'width', settings.width );
    this.addProperty( 'height', settings.height );
    this.addProperty( 'dragging', false );

    $(this).bind("propchange", function(e) {
        if( e.propertyName == 'dragging' ) {
            // ...
        }
    });

    $(this).svg_draggable();
    $(this).bind('drag:start', function(e) {
        this.setDragging(true) });
    $(this).bind('drag:update', function(e) { this.translate(e.dx,e.dy) });
    $(this).bind('drag:end', function(e) { this.setDragging(false) });


    this.addProperty( 'walls', [] );
    this.addProperty( 'points', [] );
    this.addProperty( 'doors', [] );

    this.makeWalls();
}

$.extend( SimpleRoom.prototype, OpenMultiverse.PropertyObject );

$.extend( SimpleRoom.prototype, {
    makeWalls: function () {
        var x1 = this.getX();
        var y1 = this.getY();
        var x2 = this.getX()+this.getWidth();
        var y2 = this.getY()+this.getHeight();

        var points = [
            new Point( x1,y1 ),
            new Point( x2,y1 ),
            new Point( x2,y2 ),
            new Point( x1,y2 )
        ];

        points[0]['top'] = true;
        points[0]['left'] = true;
        points[1]['top'] = true;
        points[1]['left'] = false;
        points[2]['top'] = false;
        points[2]['left'] = false;
        points[3]['top'] = false;
        points[3]['left'] = true;

        this.setPoints(points);

        this.setWalls([
            new SimpleWall( points[0], points[1], [this]),
            new SimpleWall( points[1], points[2], [this]),
            new SimpleWall( points[2], points[3], [this]),
            new SimpleWall( points[3], points[0], [this])
        ]);

        this.addWallChangeListeners();
    },

    addWallChangeListeners: function() {
        var me = this;
        var updateDimensions = function(e) {
            var topLeft = me.getWalls()[0].getLine().getP1();
            var botRight = me.getWalls()[1].getLine().getP2();

            me.setX(topLeft.getX());
            me.setY(topLeft.getY());
            me.setWidth(botRight.getX() - topLeft.getX());
            me.setHeight(botRight.getY() - topLeft.getY());
        }

        $.each( this.getWalls(), function() {
            $(this).bind('propchange', updateDimensions);
        });

        $.each( this.getPoints(), function() {
            $(this).bind('propchange', updateDimensions);
        });
    }
});



$.extend( SimpleRoom.prototype, {
    raphaelObject: false,

    makeRenderable: function( paper, options ) {
        var settings = $.extend( { area: {}, wall: {}, doors: {}, corner: {} }, options );

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

        var cornerSettings = $.extend( {
            attr: {
                'fill': 'black',
                'r': 3
            }
        }, settings.corner );

        this.raphaelObject = paper.set();
        this.insideArea = paper.rect(this.getX(),this.getY(),this.getWidth(),this.getHeight());
        this.insideArea.attr( areaSettings.attr );

        this.raphaelObject.push(this.insideArea);
        OpenMultiverse.propagateMouseEvents( this.insideArea.node, this );

        this.addShapeChangeListener("x");
        this.addShapeChangeListener("y");
        this.addShapeChangeListener("width");
        this.addShapeChangeListener("height");

        var me = this;
        $.each( this.getWalls(), function() {
            this.makeRenderable( paper, wallSettings );
            $(this.raphaelObject.node).css('cursor','crosshair');
        });

        $.each( this.getPoints(), function() {
            this.makeRenderable( paper, cornerSettings );

            $(this).svg_draggable();
            $(this).bind('drag:start', function(e) {
            });
            $(this).bind('drag:update', function(e) {
                var xWall, yWall;

                if( this.left ) {
                    xWall = me.getWalls()[3].getLine();
                }

                else {
                    xWall = me.getWalls()[1].getLine();
                }

                if( this.top ) {
                    yWall = me.getWalls()[0].getLine();
                }

                else {
                    yWall = me.getWalls()[2].getLine();
                }

                xWall.translate( e.dx, 0 );
                yWall.translate( 0, e.dy );
            });
            $(this).bind('drag:end', function(e) {
            });
        });

        return this.raphaelObject;
    }
});

$.extend( SimpleRoom.prototype, OpenMultiverse.Resizeable );


$.extend( SimpleRoom.prototype, {
    translate: function (dx,dy,exclusion) {
        if( typeof exclusion == 'undefined' ) exclusion = [];

        if( -1 == $.inArray(this,exclusion) ) {
            exclusion.push(this);

            this.setX(this.getX() + dx);
            this.setY(this.getY() + dy);

            $.each( this.getPoints(), function() {
                this.translate(dx,dy,exclusion);
            }); 

            $.each( this.getDoors(), function() {
                this.translate(dx,dy,exclusion);
                $.each( this.rooms, function() {
                    this.translate(dx,dy,exclusion);
                });
            });
        }
    }
});

var SimpleWall = function( p1, p2, parentRooms ) {
    this.addProperty( 'line', new LineSegment(p1,p2) );
    this.addProperty( 'parentRooms', parentRooms );
    this.addProperty( 'dragging', false );

    $(this).mouseenter( function(e) {
        if( ui.main.ghostDoor ) {
            $(ui.main.ghostDoor).trigger( $.extend(e, { type: 'enterwall', wall: this } ) );
        }
    });

    $(this).mouseleave( function(e) {
        if( ui.main.ghostDoor ) {
            $(ui.main.ghostDoor).trigger( $.extend(e, { type: 'leavewall', wall: this } ));
        }
    });

    $(this).mousedown( function(e) {
        if( ui.main.ghostDoor ) {
            $(ui.main.ghostDoor).trigger( $.extend(e, { type: 'clickwall', wall: this }) );
        }
    });

    $(this).svg_draggable();
    $(this).bind('drag:start', function(e) { this.setDragging(true) });
    $(this).bind('drag:update', function(e) {
        var orien = this.getName();

        if( orien == 'north' || orien == 'south' ) {
            this.getLine().translate(0,e.dy);
        }

        else {
            this.getLine().translate(e.dx,0);
        }
    });
    $(this).bind('drag:end', function(e) { this.setDragging(false) });
}

$.extend( SimpleWall.prototype, OpenMultiverse.PropertyObject );

$.extend( SimpleWall.prototype, {
    raphaelObject: false,

    makeRenderable: function( paper, options ) {
        this.raphaelObject = this.getLine().makeRenderable( paper,options );
        OpenMultiverse.propagateMouseEvents( this.raphaelObject.node, this );
    }
});

$.extend( SimpleWall.prototype, {
    getName: function () {
        var p1 = this.getLine().getP1();
        var p2 = this.getLine().getP2();
        var angle = Math.floor( 180 / Math.PI * Math.atan2(
            p2.getY() - p1.getY(),
            p2.getX() - p1.getX()));

        return { 0: 'north', 90: 'east', 180: 'south', '-90': 'west' }[angle];
    }
});



