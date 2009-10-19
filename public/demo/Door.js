
var Door = function (x,y,length,width) {
    this.addProperty( 'x', x );
    this.addProperty( 'y', y );
    this.addProperty( 'length', length );
    this.addProperty( 'width', width );
}

$.extend( Door.prototype, OpenMultiverse.PropertyObject );

$.extend( Door.prototype, {
    raphaelObject: false,
    raphaelSet: false,

    makePathStr: function( ) {
        var x = this.getX();
        var y = this.getY();
        var width = this.getWidth();
        var length = this.getLength();
        var str = "M0,"+(-width*0.5);
        str += " C"+(-width*0.25)+","+(-width*0.25);
        str += " "+(-width*0.25)+","+(width*0.25);
        str += " 0,"+(width*0.5);

        str += " L"+length+","+(width*0.5);

        str += " C"+(length+width*0.25)+","+(width*0.25);
        str += " "+(length+width*0.25)+","+(-width*0.25);
        str += " "+length+","+(-width*0.5);

        str += "z";

        return str;
    },

    makeRenderable: function( paper, options ) {
        var settings = $.extend( { attr: {
            'fill': 'gray'
        }}, options );

        this.raphaelObject = paper.path( this.makePathStr() );
        this.raphaelObject.translate(this.getX(),this.getY());
        this.raphaelObject.attr( settings.attr );

        this.raphaelSet = paper.set();
        this.raphaelSet.push( this.raphaelObject );

        OpenMultiverse.propagateMouseEvents( this.raphaelObject.node, this );

        return this.raphaelObject;
    }
});

$.extend( Door.prototype, {
    translate: function (dx,dy) {
        this.setX( this.getX() + dx );
        this.setY( this.getY() + dy );
        this.raphaelObject.translate(dx,dy);
    }
});

$.extend( Door.prototype, {
    grabSelectBox: function (selectBox) {
        selectBox.setX( this.getX() - 5 );
        selectBox.setY( this.getY() - 10 );
        selectBox.setWidth( this.getLength() + 10 );
        selectBox.setHeight( this.getWidth() + 10 );
    }
});

