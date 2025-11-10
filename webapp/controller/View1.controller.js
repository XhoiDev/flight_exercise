sap.ui.define([
    "sap/ui/core/mvc/Controller"
], 
    function(Controller)  {
    "use strict";

    return Controller.extend("flightui5.flightiu5freestyle.controller.View1", {
        onInit() {
            var oFlightJSONModel = new sap.ui.model.json.JSONModel();
            var that = this;
            this.oTable = this.getView().byId("table");
            //read the data from Back End (READ_GET_ENTITYSET)
            var oDataModel = this.getOwnerComponent().getModel();
            var sPath = "/FlightXHF";
            oDataModel.read(sPath, {
                sorters: [new sap.ui.model.Sorter("Carrid", false)],
                success: function (oresponse) {
                    console.log(oresponse);
                    //attach the data to the model
                    oFlightJSONModel.setData(oresponse.results);
                    //attach the Model to the View
                    that.getView().setModel(oFlightJSONModel, "flightDataModel");
                },
                error: function (oerror) { },
            });
        },
            navNext: function (index) {
                this.getOwnerComponent().getRouter().navTo("RouteDetailView", {
                    index: index
                });
            },
                onTableSelection: function (oEvent) {
                let tableIndex = oEvent.getSource().getBindingContext("flightDataModel").getObject().Carrid;
                this.navNext(tableIndex);
            },        
    });
});