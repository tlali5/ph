(function() {
    let _shadowRoot;
    let _id;
    let _score;
    let _topn;
    let _coords;
    let _labels;

    let div;
    let Ar = [];
    let widgetName;

    let tmpl = document.createElement("template");
    tmpl.innerHTML = `
      <style>
      </style>
    `;

    class restAPI extends HTMLElement {

        constructor() {
            super();

            _shadowRoot = this.attachShadow({
                mode: "open"
            });
            _shadowRoot.appendChild(tmpl.content.cloneNode(true));

            _id = createGuid();

            //_shadowRoot.querySelector("#oView").id = _id + "_oView";

            this._export_settings = {};
            this._export_settings.restapiurl = "";
            this._export_settings.score = "";
            this._export_settings.topn = "";
            this._export_settings.coords = "";
            this._export_settings.name = "";
            this._export_settings.labels = "";

            this.addEventListener("click", event => {
                console.log('click');
            });

            this._firstConnection = 0;
            this._firstConnectionUI5 = 0;

        }

        connectedCallback() {
            try {
                if (window.commonApp) {
                    let outlineContainer = commonApp.getShell().findElements(true, ele => ele.hasStyleClass && ele.hasStyleClass("sapAppBuildingOutline"))[0]; // sId: "__container0"

                    if (outlineContainer && outlineContainer.getReactProps) {
                        let parseReactState = state => {
                            let components = {};

                            let globalState = state.globalState;
                            let instances = globalState.instances;
                            let app = instances.app["[{\"app\":\"MAIN_APPLICATION\"}]"];
                            let names = app.names;

                            for (let key in names) {
                                let name = names[key];

                                let obj = JSON.parse(key).pop();
                                let type = Object.keys(obj)[0];
                                let id = obj[type];

                                components[id] = {
                                    type: type,
                                    name: name
                                };
                            }

                            for (let componentId in components) {
                                let component = components[componentId];
                            }

                            let metadata = JSON.stringify({
                                components: components,
                                vars: app.globalVars
                            });

                            if (metadata != this.metadata) {
                                this.metadata = metadata;

                                this.dispatchEvent(new CustomEvent("propertiesChanged", {
                                    detail: {
                                        properties: {
                                            metadata: metadata
                                        }
                                    }
                                }));
                            }
                        };

                        let subscribeReactStore = store => {
                            this._subscription = store.subscribe({
                                effect: state => {
                                    parseReactState(state);
                                    return {
                                        result: 1
                                    };
                                }
                            });
                        };

                        let props = outlineContainer.getReactProps();
                        if (props) {
                            subscribeReactStore(props.store);
                        } else {
                            let oldRenderReactComponent = outlineContainer.renderReactComponent;
                            outlineContainer.renderReactComponent = e => {
                                let props = outlineContainer.getReactProps();
                                subscribeReactStore(props.store);

                                oldRenderReactComponent.call(outlineContainer, e);
                            }
                        }
                    }
                }
            } catch (e) {}
        }

        disconnectedCallback() {
            if (this._subscription) { // react store subscription
                this._subscription();
                this._subscription = null;
            }
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            if ("designMode" in changedProperties) {
                this._designMode = changedProperties["designMode"];
            }
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            UI5(changedProperties, this);
        }

        _renderExportButton() {
            let components = this.metadata ? JSON.parse(this.metadata)["components"] : {};
        }

        _firePropertiesChanged() {
            this.score = "";
            this.topn = "";
            this.coords = "";
            this.labels = "";
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        score: this.score,
                        topn: this.topn,
                        coords: this.coords,
                        labels: this.labels
                    }
                }
            }));
        
        }

        // SETTINGS
        get restapiurl() {
            return this._export_settings.restapiurl;
        }
        set restapiurl(value) {
            this._export_settings.restapiurl = value;
        }

        get name() {
            return this._export_settings.name;
        }
        set name(value) {
            this._export_settings.name = value;
        }

        get score() {
            return this._export_settings.score;
        }
        set score(value) {
            value = _score;
            this._export_settings.score = value;
        }

        get labels() {
            return this._export_settings.labels;
        }
        set labels(value) {
            value = _labels;
            this._export_settings.labels = value;
        }

        get topn() {
            return this._export_settings.topn;
        }
        set topn(value) {
            value = _topn;
            this._export_settings.topn = value;
        }

        get coords() {
            return this._export_settings.coords;
        }
        set coords(value) {
            value = _coords;
            this._export_settings.coords = value;
        }

        static get observedAttributes() {
            return [
                "restapiurl",
                "name",
                "score",
                "topn",
                "coords",
                "labels"
            ];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue != newValue) {
                this[name] = newValue;
            }
        }

    }
    customElements.define("com-fd-djaja-sap-sac-restapi", restAPI);

    function UI5(changedProperties, that) {
        var that_ = that;

        div = document.createElement('div');
        widgetName = that._export_settings.name;
        div.slot = "content_" + widgetName;

        var restAPIURL = that._export_settings.restapiurl;

        if (that._firstConnectionUI5 === 0) {

            let div0 = document.createElement('div');
            div0.innerHTML = '<?xml version="1.0"?><script id="oView_' + widgetName + '" name="oView_' + widgetName + '" type="sapui5/xmlview"><mvc:View xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc" xmlns:core="sap.ui.core" xmlns:l="sap.ui.layout" height="100%" controllerName="myView.Template"><l:VerticalLayout class="sapUiContentPadding" width="100%"><l:content><Input id="input"  placeholder="Enter product number..." liveChange=""/></l:content><Button id="buttonId" class="sapUiSmallMarginBottom" text="Get Similar Products" width="150px" press=".onButtonPress" /></l:VerticalLayout></mvc:View></script>';
            _shadowRoot.appendChild(div0);

            let div1 = document.createElement('div');
            div1.innerHTML = '<div id="ui5_content_' + widgetName + '" name="ui5_content_' + widgetName + '"><slot name="content_' + widgetName + '"></slot></div>';
            _shadowRoot.appendChild(div1);

            that_.appendChild(div);

            var mapcanvas_divstr = _shadowRoot.getElementById('oView_' + widgetName);

            Ar.push({
                'id': widgetName,
                'div': mapcanvas_divstr
            });
        }

        sap.ui.getCore().attachInit(function() {
            "use strict";

            //### Controller ###
            sap.ui.define([
                "jquery.sap.global",
                "sap/ui/core/mvc/Controller",
                "sap/m/MessageToast",
                'sap/m/MessageBox'
            ], function(jQuery, Controller, MessageToast, MessageBox) {
                "use strict";

                return Controller.extend("myView.Template", {

                    onButtonPress: function(oEvent) {

                        var product = oView.byId("input").getValue();

                        $.ajax({
                            url: restAPIURL,
                            type: 'GET',
                            data: $.param({
                                "product": product
                            }),
                            contentType: 'application/x-www-form-urlencoded',
                            success: function(data) {
                                console.log(data)
                                let result = '';
                                for (let i = 0; i < data['topn'].length; i++) {
                                    //console.log(data['topn'])
                                    result = result.concat(data['topn'][i])
                                }
                                //_score = data["similar products"];
                                _labels = data["labels"];
                                _topn =  data["topn"];
                                let concatcoords = '';
                                _coords = concatcoords.concat(data["x_coords"], ";" , data["y_coords"], ";" , data["z_coords"], ";" , data["labels"]);
                                const datasetarray = _coords.split(';');
                                that._firePropertiesChanged();
                                this.settings = {};
                                this.settings.score = "";
                                this.settings.topn = "";
                                this.settings.coords = "";
                                this.settings.labels = "";

                                that.dispatchEvent(new CustomEvent("onStart", {
                                    detail: {
                                        settings: this.settings
                                    }
                                }));

                            },
                            error: function(e) {
                                console.log("error: " + e);
                            }
                        });
                    }
                });
            });

            var foundIndex = Ar.findIndex(x => x.id == widgetName);
            var divfinal = Ar[foundIndex].div;

            //### THE APP: place the XMLView somewhere into DOM ###
            var oView = sap.ui.xmlview({
                viewContent: jQuery(divfinal).html(),
            });

            oView.placeAt(div);

            if (that_._designMode) {
                oView.byId("buttonId").setEnabled(false);
                oView.byId("input").setEnabled(false);
            } else {
                oView.byId("buttonId").setEnabled(true);
                oView.byId("input").setEnabled(true);
            }
        });
    }

    function createGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = Math.random() * 16 | 0,
                v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

})();