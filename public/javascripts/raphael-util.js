
Raphael.fn.line = function (x1,y1,x2,y2) {
    return this.path("M{0},{1}L{2},{3}", x1, y1, x2, y2);
}


var ui = { };

$( function() {
    var buildUIComponent = function( key, id ) {
        var holder = $(document.getElementById(id));
        var width = holder.attr('clientWidth');
        var height = holder.attr('clientHeight');
        ui[key] = {
            elmt: holder,
            paper: Raphael( id, width-1, height-1 )
        };
    }

    buildUIComponent( 'main', 'MAIN' );
    buildUIComponent( 'topToolbar', 'TOP_TOOLBAR' );
    buildUIComponent( 'sideToolbar', 'SIDE_TOOLBAR' );

    gridable(ui.main);
} );

var gridable = function( component ) {
    component = $.extend(component, {
        gridlinesX: [],
        gridlinesY: [],

        drawGridline: function( x1,y1, x2,y2 ) {
            var ln = this.paper.line(x1,y1,x2,y2);
            ln.attr({ stroke: "#888888", opacity: 0.5 });
            ln.toBack();
        },

        makeGridlineX: function (x) {
            this.drawGridline( x, 0, x, this.paper.height );
        },

        makeGridlineY: function (y) {
            this.drawGridline( 0, y, this.paper.width, y );
        },

        setGrid: function ( offsetX, offsetY, gridWidth ) {
            // Remove all current gridlines
            for( var line in this.gridlinesX ) line.remove();
            for( var line in this.gridlinesY ) line.remove();

            for( var x = offsetX; x < this.paper.width; x += gridWidth ) {
                this.makeGridlineX( x );
            }

            for( var y = offsetY; y < this.paper.height; y += gridWidth ) {
                this.makeGridlineY( y );
            }
        }
    });
}

var buttons = {
    new_room: function(paper) {
        var button = paper.set();

        button.push( paper.rect( 0,0,40,40,3 ).attr({fill:'white'}) );
        button.push( paper.text( 22,20, "R+" ).attr ({font: "18px Fontin-Sans, Arial"} ) );

        return button;
    },

    custom_room: function(paper) {
        var button = paper.set();
        button.push( paper.rect( 0,0,40,40,3 ).attr({fill:'white'}) );
        button.push( paper.text( 20,20, "custom" ).attr ({
            font: "12px Fontin-Sans, Arial",
            rotation: -45
        }));

        return button;
    },

    square_room: function(paper) {
        var button = paper.set();

        button.push( paper.rect( 0,0,40,40,3 ).attr({fill:'white'}) );
        button.push( paper.rect( 10,10,20,20,0 ) );
        button.push( paper.circle( 10,10,2 ).attr({ fill:'black' }) );
        button.push( paper.circle( 30,10,2 ).attr({ fill:'black' }) );
        button.push( paper.circle( 30,30,2 ).attr({ fill:'black' }) );
        button.push( paper.circle( 10,30,2 ).attr({ fill:'black' }) );

        return button;
    },

    el_room: function(paper) {
        var button = paper.set();

        button.push( paper.rect( 0,0,40,40,3 ).attr({fill:'white'}) );
        button.push( paper.path( "M10,20L10,30L30,30L30,10L20,10L20,20,Z" ) );
        button.push( paper.circle( 10,20,2 ).attr({ fill:'black' }) );
        button.push( paper.circle( 10,30,2 ).attr({ fill:'black' }) );
        button.push( paper.circle( 30,30,2 ).attr({ fill:'black' }) );
        button.push( paper.circle( 30,10,2 ).attr({ fill:'black' }) );
        button.push( paper.circle( 20,10,2 ).attr({ fill:'black' }) );
        button.push( paper.circle( 20,20,2 ).attr({ fill:'black' }) );

        return button;
    }
};

Raphael.fn.button = function (name) {
    var btn = buttons[name](this);

    var fn_hvr_in = function(e) {
        btn.items[0].animate({fill:'#ddff55', opacity:0.8}, 100);
    }
    var fn_hvr_out = function(e) {
        btn.items[0].animate({fill:'#ffffff', opacity:1.0}, 100);
    }

    for( var elmt in btn.items ) {
        var node = $(btn.items[elmt].node);
        node.hover(fn_hvr_in,fn_hvr_out);
        node.css('cursor',"pointer");
    }

    return btn;
}

var build = {
    room: function( comp ) {
        var paper = comp.paper;
        var result = paper.set();

        result.push( paper.rect( 0,0,200,200 ).attr(
            {'fill': '#001dff', 'fill-opacity': 0.4, 'stroke': 'none'}) );

        return result;
    }
};

