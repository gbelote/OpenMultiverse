
var Area = function(arg1) {
    this.parts = $.makeArray(arg1);

    var me = this;
    $.each( this.parts, function() {
        OpenMultiverse.propagateMouseEvents( this, me );
    });
}

$.extend( Area.prototype, {
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

$.extend( Area.prototype, {
    setDragging: function( isDragging ) {
        $.each(this.parts, function() {
            this.setDragging( isDragging );
        });
    }
});

