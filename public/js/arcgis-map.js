var arcgis_groupLayer;

function ArcGIS_Map_Init() {
    require([
        "esri/layers/GroupLayer",
        "esri/layers/FeatureLayer",
        "esri/Map", 
        "esri/views/SceneView",
        "esri/widgets/LayerList",
        "esri/layers/support/Field",
        "esri/geometry/Point",
        "esri/renderers/SimpleRenderer",
        "esri/symbols/PointSymbol3D",
        "esri/symbols/ObjectSymbol3DLayer",
        "esri/request",
        "dojo/_base/array",
        "dojo/dom",
        "dojo/on",
        "dojo/domReady!"
    ], function (GroupLayer, FeatureLayer, Map, SceneView, LayerList, Field, Point, SimpleRenderer, PointSymbol3D, ObjectSymbol3DLayer, esriRequest, 
    arrayUtils, dom, on) {
        
        var arcgis_fields = [
            {name: "ObjectID", alias: "ObjectID", type: "oid"},
            {name: "title", alias: "title", type: "string"},
            {name: "num", alias: "num", type: "integer"}
        ];

        arcgis_groupLayer = new GroupLayer({
            title: "商品房",
            visibility: true,
            visibilityMode: "exclusive"
        })

        var arcgis_arcgismap = new Map({
            basemap: "osm",
            layers: [arcgis_groupLayer]
        });

        var arcgis_initCam = {
            position: {
                x: 114.316200103,
                y: 30.4110841269,
                z: 200000,
                spatialReference: {
                    wkid: 4326
                }
            },
            heading: 0,
            tilt: 0
        };

        var arcgis_view = new SceneView({
            map: arcgis_arcgismap,
            container: "arcgismap",
            camera: arcgis_initCam
        });

        arcgis_view.then(function () {
            arcgis_layerList = new LayerList({
                view: arcgis_view
            })

            arcgis_view.ui.add(arcgis_layerList, "top-right");
        })

        $.getJSON("/js/json/realproperty.json", function (data) {
            var graphics = [];

            data.forEach(function(iSender, i) {
                graphics.push({
                    geometry: new Point({
                        longitude: iSender.fCoord_x,
                        latitude: iSender.fCoord_y
                    }),
                    attributes: {
                        ObjectID: iSender.sInstalmentID,
                        title: iSender.sTitle,
                        num: parseInt(iSender.fPriceAverage)
                    }
                })
            }, this);

            var arcgis_fireRenderer = new SimpleRenderer({
                symbol: new PointSymbol3D({
                    symbolLayers: [new ObjectSymbol3DLayer({
                        resource: {
                            primitive: "cube"
                        },
                        width: 500,
                        depth: 500,
                        material: {color: "#e6b600"}
                    })]
                }),
                label: "平均价格",
                visualVariables: [{
                    type: "size",
                    field: "num",
                    axis: "height"
                },{
                    type: "size",
                    axis: "width-and-depth",
                    useSymbolValue: true,
                }]
            });

            var arcgis_fireLayer = new FeatureLayer({
                source: graphics,
                fields: arcgis_fields,
                objectIdField: "ObjectID",
                renderer: arcgis_fireRenderer,
                spatialReference: {
                    wkid: 4326
                },
                geometryType: "point",
                popupTemplate: {
                    title: "{title}",
                    content: [{
                        type: "fields",
                        fieldInfos: [{
                            fieldName: "num",
                            label: "平均价格",
                            visible: true
                        }]
                    }]
                },
                title: "平均价格",
                id: "fireLayer"
            })

            arcgis_groupLayer.add(arcgis_fireLayer, 0);
        })
    })
}

// $(function () {
//     ArcGIS_Map_Init();
// })
ArcGIS_Map_Init();