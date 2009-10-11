$.extend({
    reduce : function( arr, reduce, init ) {
        $.each(arr, function() {
            init = reduce( this,init );
        });

        return init;
    }
});

