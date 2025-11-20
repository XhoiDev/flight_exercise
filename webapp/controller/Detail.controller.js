sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    "sap/ui/core/Fragment"
],
    function (Controller, MessageBox, JSONModel, Filter, FilterOperator, Fragment) {
        "use strict";

        return Controller.extend("flightui5.flightiu5freestyle.controller.Detail", {
            
            onInit: function () {
                 debugger
            this.getOwnerComponent().getRouter().getRoute("RouteDetailView").attachPatternMatched(this._onObjectMatched, this);
            //var oFlightJSONModel = new sap.ui.model.json.JSONModel();
            this.oTable = this.getView().byId("table");
            //read the data from Back End (READ_GET_ENTITYSET)

            //var oFilter = new sap.ui.model.Filter('Carrid',sap.ui.model.FilterOperator.EQ, index );


/*            oDataModel.read(sPath,  {
                filters: oFilter,
                sorters: [new sap.ui.model.Sorter("Carrid", false)],
                success: function (oresponse) {
                    console.log(oresponse);
                    //attach the data to the model
                    oFlightJSONModel.setData(oresponse.results);
                    //attach the Model to the View
                    
                    that.getView().setModel(oFlightJSONModel, "detailModel");
                },
                error: function (oerror) { },
            }); */
            },
            _onObjectMatched: function (oEvent) {
                let index = oEvent.getParameter("arguments").index;

            this.readOdata(index);
            },
         readOdata: function (i) {
            let that = this;
            debugger
            var oFlightJSONModel = new sap.ui.model.json.JSONModel();
            var oDataModel = this.getOwnerComponent().getModel();
           // var sPath = "/DetailsXHF";
           //var sPath = "/FlightXHF(Carrid='" + i + "',IsActiveEntity=true)/to_DetailsXHF";
           var sPath = "/FlightXHF(Carrid='" + i + "',IsActiveEntity=true)";
          //  var oFilter = new sap.ui.model.Filter("Carrid", sap.ui.model.FilterOperator.EQ, i );
                oDataModel.read(sPath,  {
                //filters: [oFilter], 
                urlParameters: {
                    "$expand":"to_DetailsXHF" // Replace with your navigation property name
                 },
                
             //   sorters: [new sap.ui.model.Sorter("Carrid", false)],
                success: function (oresponse) {
                    debugger
                    console.log(oresponse);
                    //attach the data to the model
                    oFlightJSONModel.setData(oresponse.to_DetailsXHF.results);
                    //attach the Model to the View
                    
                    that.getView().setModel(oFlightJSONModel, "detailModel");
                },
                error: function (oerror) { },
            });
         },
 
        })

    },


)