
var SelectBox = function (x,y,width,height,cornerLength) {
    this.addProperty( 'x', x );
    this.addProperty( 'y', y );
    this.addProperty( 'width', width );
    this.addProperty( 'height', height );
    this.addProperty( 'cornerLength', cornerLength );

    $(this).bind( 'propchange', function(e) {
        this.raphaelObject.attr({ path: this.getPathString() });
    });
}

$.extend( SelectBox.prototype, OpenMultiverse.PropertyObject );

$.extend( SelectBox.prototype, {
    raphaelObject: false,

    getPathString: function () {
        var x = this.getX();
        var y = this.getY();
        var width = this.getWidth();
        var height = this.getHeight();
        var cornerLength = this.getCornerLength();

        var str = "M"+x+","+(y+cornerLength);
        str += " L"+x+","+y;
        str += " L"+(x+cornerLength)+","+y;

        str += " M"+(x+width-cornerLength)+","+y;
        str += " L"+(x+width)+","+y;
        str += " L"+(x+width)+","+(y+cornerLength);

        str += " M"+(x+width)+","+(y+height-cornerLength);
        str += " L"+(x+width)+","+(y+height);
        str += " L"+(x+width-cornerLength)+","+(y+height);

        str += " M"+(x+cornerLength)+","+(y+height);
        str += " L"+x+","+(y+height);
        str += " L"+x+","+(y+height-cornerLength);

        return str;
    },

    attachToSet: function( set, options ) {
        var settings = $.extend( { attr: {
            'fill': 'white',
            'fill-opacity': 0.9
        }}, options );

        this.raphaelObject = set.paper.path( this.getPathString() );
        set.push( this.raphaelObject );
        this.raphaelObject.attr( settings.attr );

        OpenMultiverse.propagateMouseEvents( this.raphaelObject.node, this );

        return this.raphaelObject;
    }
});

OpenMultiverse.SelectableUI = {
    selection: [],
    clearSelection: function () {
        selection = []
    },
    singleSelect: function(target) {
        var selectBox = target.configSelectBox(false);
        selection = [ selectBox ];
    }
};

//$.extend(ui.main, OpenMultiverse.SelectableUI);

OpenMultiverse.Selectable = {
    selectBoxBuffer: 5,
    selectBoxCornerLength: 4,

    configSelectBox: function(targetUI) {
        var x = this.raphaelObject.x - this.selectBoxBuffer;
        var y = this.raphaelObject.y - this.selectBoxBuffer;
        var width = this.raphaelObject.width + 2*this.selectBoxBuffer;
        var height = this.raphaelObject.height + 2*this.selectBoxBuffer;
        var cornerLength = this.selectBoxCornerLength;

        if( existingBox ) {
            existingBox.setX(x);
            existingBox.setY(y);
            existingBox.setWidth(width);
            existingBox.setHeight(height);
            existingBox.setCornerLength(cornerLength);
        }

        else {
            var result = new SelectBox(x,y,width,height,cornerLength);
        }
    }
}





