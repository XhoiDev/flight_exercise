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

                onCreateRecord: function () {
            if (!this.oDialog) {
                this.loadFragment({
                    name: "flightui5.flightiu5freestyle.fragments.createAirline",
                }).then(
                    function (oDialog) {
                        this.oDialog = oDialog;
                        this.oDialog.open();
                    }.bind(this)
                );
            } else {
                this.oDialog.open();
            }
        },
        onUpdate: function () {
            var oTable = this.byId("table");
            var oSelectedItem = oTable.getSelectedItem();

            if (!oSelectedItem) {
                sap.m.MessageToast.show("Please select one airline to update");
                return;
            }

            var oData = oSelectedItem.getBindingContext("flightDataModel").getObject();

            if (!this.oUpdateDialog) {
                this.loadFragment({
                    name: "flightui5.flightiu5freestyle.fragments.updateDialog"
                }).then(function (oDialog) {
                    this.oUpdateDialog = oDialog;
                    this.getView().addDependent(this.oUpdateDialog);

                    this.byId("carrIDInput1").setValue(oData.Carrid);
                    this.byId("carrNameInput1").setValue(oData.Carrname);
                    this.byId("currCodeInput1").setValue(oData.Currcode);
                    this.byId("URLInput1").setValue(oData.Url);

                    this.oUpdateDialog.open();
                }.bind(this));
            } else {
                this.byId("carrIDInput1").setValue(oData.Carrid);
                this.byId("carrNameInput1").setValue(oData.Carrname);
                this.byId("currCodeInput1").setValue(oData.Currcode);
                this.byId("URLInput1").setValue(oData.Url);

                this.oUpdateDialog.open();
            }
        },
                onCreateNewRecord: function () {
            var oView = this.getView();
            var sCarrid = oView.byId("carrIDInput").getValue().trim();
            var sCarrname = oView.byId("carrNameInput").getValue().trim();
            var sCurrcode = oView.byId("currCodeInput").getValue().trim();
            var sUrl = oView.byId("URLInput").getValue().trim();

            if (!sCarrid) {
                sap.m.MessageToast.show("Carrid is mandatory");
                return;
            }

            var oPayload = {
                Carrid: sCarrid,
                Carrname: sCarrname,
                Currcode: sCurrcode,
                Url: sUrl
            };

            var oModel = this.getOwnerComponent().getModel();
            var that = this;
            oView.setBusy(true);

            oModel.create("/FlightXHF", oPayload, {
                success: function () {
                    oView.setBusy(false);
                    sap.m.MessageToast.show("Airline created successfully!");
                    oView.byId("createDialog").close();

                    that.readFlight();
                },
                error: function (oError) {
                    oView.setBusy(false);
                    sap.m.MessageToast.show("Error creating airline record");
                    console.error(oError);
                }
            });
        },
                onUpdateRecord: function () {
            var oView = this.getView();
            var oDataModel = this.getOwnerComponent().getModel();

            var sCarrid = this.byId("carrIDInput1").getValue().trim();
            var sCarrname = this.byId("carrNameInput1").getValue().trim();
            var sCurrcode = this.byId("currCodeInput1").getValue().trim();
            var sUrl = this.byId("URLInput1").getValue().trim();

            var oPayload = {
                Carrid: sCarrid,
                Carrname: sCarrname,
                Currcode: sCurrcode,
                Url: sUrl
            };

            oDataModel.callFunction("/modifyAirline", {
                method: "POST",
                urlParameters: oPayload,
                success: function () {
                    oView.setBusy(false);
                    sap.m.MessageToast.show("Airline updated via RAP action ");
                    this.byId("updateDialog").close();
                    this.readFlight();
                }.bind(this),
                error: function (oError) {
                    oView.setBusy(false);
                    sap.m.MessageBox.error("Update failed ");
                    console.error(oError);
                }
            });
        },
         onDelete: function () {
            var oTable = this.byId("table");
            var oSelectedItem = oTable.getSelectedItem();

            if (!oSelectedItem) {
                sap.m.MessageToast.show(" Please select one airline to delete");
                return;
            }

            var oData = oSelectedItem.getBindingContext("flightDataModel").getObject();

            if (!this.oDeleteDialog) {
                this.loadFragment({
                    name: "flightui5.flightiu5freestyle.fragments.deleteAirline"
                }).then(function (oDialog) {
                    this.oDeleteDialog = oDialog;
                    this.getView().addDependent(this.oDeleteDialog);

                    this.byId("carrIDInput2").setValue(oData.Carrid);
                    this.byId("carrNameInput2").setValue(oData.Carrname);
                    this.byId("currCodeInput2").setValue(oData.Currcode);
                    this.byId("URLInput2").setValue(oData.Url);

                    this.oDeleteDialog.open();
                }.bind(this));
            } else {
                this.byId("carrIDInput2").setValue(oData.Carrid);
                this.byId("carrNameInput2").setValue(oData.Carrname);
                this.byId("currCodeInput2").setValue(oData.Currcode);
                this.byId("URLInput2").setValue(oData.Url);

                this.oDeleteDialog.open();
            }
        },

        onDeleteRecord: function () {
            var oView = this.getView();
            var oDataModel = this.getOwnerComponent().getModel();

            var sCarrid = this.byId("carrIDInput2").getValue().trim();


            var oPayload = {
                Carrid: sCarrid,

            };

            oDataModel.callFunction("/deleteAirline", {
                method: "POST",
                urlParameters: oPayload,
                success: function () {
                    oView.setBusy(false);
                    sap.m.MessageToast.show("Airline deleted RAP action ");
                    this.byId("deleteDialog").close();
                    this.readFlight();
                }.bind(this),
                error: function (oError) {
                    oView.setBusy(false);
                    sap.m.MessageBox.error("Deleted failed ");
                    console.error(oError);
                }
            });
        },
            onCancelRecord: function () {
            var oDialog = this.byId("updateDialog");
            if (oDialog) {
                oDialog.close();
            }
        },        
    });
});