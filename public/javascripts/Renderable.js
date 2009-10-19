
OpenMultiverse.Renderable = {
    raphaelSet: false,

    getSet: function () { return raphaelSet; }

    buildRaphaelModel: function (paper) {
        this.raphaelSet = paper.set();
    }
}

