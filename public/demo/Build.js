// Use to create a new initial room or extend a room through a door.
function createRoom( options ) {
    var settings = $.extend({
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        initialDoor: false
    }, options);

    // if we have x/y then plant room there
    // if we have an initial door, infer where x/y are
    // otherwise we don't have enough info, assume an arbitrary drop somewhere

}




function addDoorMode( component ) {
    $.extend( component, {
        ghostDoor: false,

        buildGhostDoor: function(e) {
            var door = this.createGhostDoor(component.paper, e);

            $(window).mousemove( door.mouseMoveHandler );
            $(window).mousedown( door.clickHandler );

            return door;
        },

        setDoorMode: function( value, e ) {
            if( value ) {
                this.ghostDoor = this.buildGhostDoor(e);
            }

            else if( this.ghostDoor ) {
                $(window).unbind('mousemove', this.ghostDoor.mouseMoveHandler);
                $(window).unbind('click', this.ghostDoor.clickHandler);
                this.ghostDoor = false;
            }
        },

        createGhostDoor: function (paper, e) {
            var x = e.pageX - 80; // HACK
            var y = e.pageY - 75; // HACK
            var width = 22;
            var length = 10;
            var bend = 0.125;
            var str = "M0,"+(-width*0.5);
            str += " C"+(-width*bend)+","+(-width*bend);
            str += " "+(-width*bend)+","+(width*bend);
            str += " 0,"+(width*0.5);
            
            str += " L"+length+","+(width*0.5);
            
            str += " C"+(length+width*bend)+","+(width*bend);
            str += " "+(length+width*bend)+","+(-width*bend);
            str += " "+length+","+(-width*0.5);
            
            str += "z";

            var result = paper.path(str).translate(x,y).attr({
                fill: 'gray',
                'fill-opacity': 0.5,
                'stroke-opacity': 0.5
            });
            $(result.node).attr('pointer-events', 'none');

            result.currentAngle = 90;
            
            var me = this;
            var last = e;
            result.mouseMoveHandler = function(e) {
                result.translate( e.pageX - last.pageX, e.pageY - last.pageY );
                last = e;
            }
            
            result.clickHandler = function(e) {
            }

            $(result).bind( 'enterwall', function(e) {
                var p1 = e.wall.getLine().getP1();
                var p2 = e.wall.getLine().getP2();
                var angle = 180 / Math.PI * Math.atan2(
                    p2.getY() - p1.getY(),
                    p2.getX() - p1.getX())
                    - result.currentAngle;

                result.rotate(angle);
                result.currentAngle += angle;

                result.attr({ 'fill-opacity': 1, 'stroke-opacity': 1 });
            });

            $(result).bind( 'leavewall', function(e) {
                result.rotate(90 - result.currentAngle);
                result.currentAngle = 90;
                result.attr({ 'fill-opacity': 0.5, 'stroke-opacity': 0.5 });
            });

            $(result).bind( 'clickwall', function(e) {
                var args = { width: 45, height: 45 };
                $.extend( args, {
                    'north': function() {
                        return { x: e.pageX - args.width/2 - 75, y: e.pageY - args.height - 75 };
                    },

                    'east': function() {
                        return { x: e.pageX - 75, y: e.pageY - args.height/2 - 75 };
                    },

                    'south': function() {
                        return { x: e.pageX - args.width/2 - 75, y: e.pageY - 75 };
                    },

                    'west': function() {
                        return { x: e.pageX - args.width - 75, y: e.pageY - args.height/2 - 75 };
                    }
                }[e.wall.getName()]());


                var newRoom = new SimpleRoom(args);
                newRoom.makeRenderable( paper );

                e.wall.getParentRooms()[0].getDoors().push(result);
                newRoom.getDoors().push(result);

                me.setDoorMode( false );

                result.rooms = [ e.wall.getParentRooms()[0], newRoom ];
            });

            result._translate = result.translate;
            result.translate = function(dx,dy,exclusion) {
                if( typeof exclusion == 'undefined' ) exclusion = [];

                if( -1 == $.inArray(result,exclusion) ) {
                    exclusion.push(result);
                    result._translate(dx,dy);
                }

            }
            
            return result;
        }
    });
}

