
var Wall = function(arg1) {
    this.parts = $.makeArray(arg1);

    var me = this;
    $.each( this.parts, function() {
        OpenMultiverse.propagateMouseEvents( this, me );
    });
}

$.extend( Wall.prototype, {
    // Object in Raphael representing this
    raphaelObject: false,

    makeRenderable: function( paper, options ) {
        var settings = $.extend( {}, options );

        var raphaelObject = this.raphaelObject = paper.set();
        var me = this;
        $.each(this.parts, function() {
            raphaelObject.push( this.makeRenderable(paper,options) );
        });

        return raphaelObject;
    },
});

$.extend( Wall.prototype, {
    setDragging: function( isDragging ) {
        $.each(this.parts, function() {
            this.setDragging( isDragging );
        });
    }
});

$.extend( Wall.prototype, {
    translate: function (dx,dy) {
        $.each(this.parts, function() {
            this.translate(dx,dy);
        });
    }
});




