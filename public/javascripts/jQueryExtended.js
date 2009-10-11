$.extend({
    reduce : function( arr, reduce, init ) {
        $.each(arr, function() {
            init = reduce( this,init );
        });

        return init;
    }
});

$.fn.extend({
    svg_draggable: function( ) {
        var me = this;
        var lastDrag = false;

        this.mousedown( function(e) {
            e.preventDefault();
            lastDrag = e;
            $(me).trigger( $.extend( e, { type: 'drag:start' } ) );

            var mousemoveHandler = function(e) {
                if( lastDrag ) {
                    $(me).trigger( $.extend( e, {
                        type: 'drag:update',
                        dx: e.pageX - lastDrag.pageX,
                        dy: e.pageY - lastDrag.pageY
                    }));

                    lastDrag = e;
                }
            }

            var mouseupHandler = function(e) {
                $(me).trigger( $.extend( e, { type: 'drag:end' } ) );
                lastDrag = false;

                $(window).unbind( 'mouseup', mouseupHandler );
                $(window).unbind( 'mousemove', mousemoveHandler );
            }

            $(window).bind( 'mousemove', mousemoveHandler );
            $(window).bind( 'mouseup', mouseupHandler );
        });
    }
});

