var SimpleDoor = function (x,y,width,length) {
    this.addProperty( 'x', x );
    this.addProperty( 'y', y );

    this.currentAngle = 90;
}

$.extend( SimpleDoor.prototype, OpenMultiverse.PropertyObject );

$.extend( SimpleDoor.prototype, {
    raphaelObject: false,

    getPathString: function () {
        var x = this.getX(); // HACK
        var y = this.getY(); // HACK
        var width = this.getWidth();
        var length = this.getLength();
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

        return str;
    },

    makeRenderable: function( paper, options ) {
        var str = getPathString();

        this.raphaelObject = paper.path(str).translate(x,y).attr({
            fill: 'gray',
            'fill-opacity': 0.5,
            'stroke-opacity': 0.5
        });
        $(this.raphaelObject.node).attr('pointer-events', 'none');

        return this.raphaelObject;
    }
});


