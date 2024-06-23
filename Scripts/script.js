function loadTurfJs() {
    return new Promise((resolve, reject) => {
        if (typeof turf !== 'undefined') {
            resolve();
            return;
        }

        const script = document.createElement('script');

        script.src = 'https://cdn.jsdelivr.net/npm/@turf/turf?v=' + new Date().getTime();        
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Load Turf.js and then execute the main script
loadTurfJs().then(() => {
    var map = L.map('map', { attributionControl: false }).setView([31, 68], 5); // Set to your default view

    var googleSat = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 21,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(map);

    var googleStreet = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 21,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var baseLayers = {
        "Satellite View": googleSat,
        "Street View": googleStreet
    };

    L.control.layers(baseLayers, null, { collapsed: false, position: 'bottomright' }).addTo(map);

    L.control.locate({
        position: "topleft",
        strings: { title: "Go to My Location" },
        locateOptions: { enableHighAccuracy: true }
    }).addTo(map);

    function chakSort(array) {
        return array.sort((a, b) => {
            let [numA, alphaA] = a.split(" ");
            let [numB, alphaB] = b.split(" ");
            numA = parseInt(numA, 10);
            numB = parseInt(numB, 10);
            return numA !== numB ? numA - numB : alphaA.localeCompare(alphaB);
        });
    }

    function murabbaSort(a, b) {
        let [numA, denomA = 1] = a.includes('/') ? a.split('/').map(Number) : [Number(a), 1];
        let [numB, denomB = 1] = b.includes('/') ? b.split('/').map(Number) : [Number(b), 1];
        return numA !== numB ? numA - numB : denomA - denomB;
    }

    function loadGeoJson(url, onSuccess, onError) {
        fetch(url)
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(onSuccess)
            .catch(function(error) {
                console.error('Error loading GeoJSON: ', error);
                if (typeof onError === 'function') {
                    onError(error);
                }
            });
    }

    function updateLabelSize() {
        const zoomLevel = map.getZoom();
        let fontSize;
        if (zoomLevel < 10) {
            fontSize = '8px';
        } else if (zoomLevel >= 10 && zoomLevel < 15) {
            fontSize = '12px';
        } else {
            fontSize = '16px';
        }
        document.documentElement.style.setProperty('--label-font-size', fontSize);
    }

    var currentLayer = null;
    var Murabba_Layer = null;
    let chakNames = chakSort(data);

    // Define test.geojson data as a variable
    const testGeoJson = {
        "type": "FeatureCollection",
        "name": "E:\\GIS Projects\\Yazman\\Patwar Circle Data\\JSON Khasra\\1 DNB Khasra.geojson",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features": [
            { "type": "Feature", "properties": { "Murabba_No": "1", "Killa": "1" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 71.551639595687945, 29.108143464314736 ], [ 71.552329095127234, 29.108147653655951 ], [ 71.552332850162472, 29.107603186293716 ], [ 71.551643354374477, 29.107598996746052 ], [ 71.551639595687945, 29.108143464314736 ] ] ] } },
            { "type": "Feature", "properties": { "Murabba_No": "1", "Killa": "2" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 71.552329095127234, 29.108147653655951 ], [ 71.55301859456651, 29.108151842997167 ], [ 71.553022345950467, 29.107607375841379 ], [ 71.552332850162472, 29.107603186293716 ], [ 71.552329095127234, 29.108147653655951 ] ] ] } },
            { "type": "Feature", "properties": { "Murabba_No": "1", "Killa": "3" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 71.55301859456651, 29.108151842997167 ], [ 71.553708094005799, 29.108156032338385 ], [ 71.553711841738462, 29.107611565389043 ], [ 71.553022345950467, 29.107607375841379 ], [ 71.55301859456651, 29.108151842997167 ] ] ] } },
            { "type": "Feature", "properties": { "Murabba_No": "1", "Killa": "4" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 71.553708094005799, 29.108156032338385 ], [ 71.554397593445074, 29.108160221679601 ], [ 71.554401337526443, 29.107615754936706 ], [ 71.553711841738462, 29.107611565389043 ], [ 71.553708094005799, 29.108156032338385 ] ] ] } },
            { "type": "Feature", "properties": { "Murabba_No": "1", "Killa": "5" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 71.554397593445074, 29.108160221679601 ], [ 71.555087092884364, 29.108164411020816 ], [ 71.555090833314438, 29.10761994448437 ], [ 71.554401337526443, 29.107615754936706 ], [ 71.554397593445074, 29.108160221679601 ] ] ] } },
            { "type": "Feature", "properties": { "Murabba_No": "1", "Killa": "10" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 71.551643354374477, 29.107598996746052 ], [ 71.552332850162472, 29.107603186293716 ], [ 71.552336605197709, 29.10705871893148 ], [ 71.551647113061009, 29.107054529177368 ], [ 71.551643354374477, 29.107598996746052 ] ] ] } },
            { "type": "Feature", "properties": { "Murabba_No": "1", "Killa": "9" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 71.552332850162472, 29.107603186293716 ], [ 71.553022345950467, 29.107607375841379 ], [ 71.55302609733441, 29.107062908685592 ], [ 71.552336605197709, 29.10705871893148 ], [ 71.552332850162472, 29.107603186293716 ] ] ] } },
            { "type": "Feature", "properties": { "Murabba_No": "1", "Killa": "8" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 71.553022345950467, 29.107607375841379 ], [ 71.553711841738462, 29.107611565389043 ], [ 71.553715589471111, 29.107067098439703 ], [ 71.55302609733441, 29.107062908685592 ], [ 71.553022345950467, 29.107607375841379 ] ] ] } },
            { "type": "Feature", "properties": { "Murabba_No": "1", "Killa": "7" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 71.553711841738462, 29.107611565389043 ], [ 71.554401337526443, 29.107615754936706 ], [ 71.554405081607811, 29.107071288193815 ], [ 71.553715589471111, 29.107067098439703 ], [ 71.553711841738462, 29.107611565389043 ] ] ] } },
            { "type": "Feature", "properties": { "Murabba_No": "1", "Killa": "6" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 71.554401337526443, 29.107615754936706 ], [ 71.555090833314438, 29.10761994448437 ], [ 71.555094573744512, 29.107075477947927 ], [ 71.554405081607811, 29.107071288193815 ], [ 71.554401337526443, 29.107615754936706 ] ] ] } },
            { "type": "Feature", "properties": { "Murabba_No": "1", "Killa": "11" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 71.551647113061009, 29.107054529177368 ], [ 71.552336605197709, 29.10705871893148 ], [ 71.552340360232961, 29.106514251569241 ], [ 71.55165087174754, 29.106510061608681 ], [ 71.551647113061009, 29.107054529177368 ] ] ] } },
            { "type": "Feature", "properties": { "Murabba_No": "1", "Killa": "12" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 71.552336605197709, 29.10705871893148 ], [ 71.55302609733441, 29.107062908685592 ], [ 71.553029848718367, 29.106518441529801 ], [ 71.552340360232961, 29.106514251569241 ], [ 71.552336605197709, 29.10705871893148 ] ] ] } },
            { "type": "Feature", "properties": { "Murabba_No": "1", "Killa": "13" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 71.55302609733441, 29.107062908685592 ], [ 71.553715589471111, 29.107067098439703 ], [ 71.553719337203773, 29.10652263149036 ], [ 71.553029848718367, 29.106518441529801 ], [ 71.55302609733441, 29.107062908685592 ] ] ] } },
            { "type": "Feature", "properties": { "Murabba_No": "1", "Killa": "14" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 71.553715589471111, 29.107067098439703 ], [ 71.554405081607811, 29.107071288193815 ], [ 71.55440882568918, 29.10652682145092 ], [ 71.553719337203773, 29.10652263149036 ], [ 71.553715589471111, 29.107067098439703 ] ] ] } },
            { "type": "Feature", "properties": { "Murabba_No": "1", "Killa": "15" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 71.554405081607811, 29.107071288193815 ], [ 71.555094573744512, 29.107075477947927 ], [ 71.5550983141746, 29.10653101141148 ], [ 71.55440882568918, 29.10652682145092 ], [ 71.554405081607811, 29.107071288193815 ] ] ] } },
            { "type": "Feature", "properties": { "Murabba_No": "1", "Killa": "20" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 71.55165087174754, 29.106510061608681 ], [ 71.552340360232961, 29.106514251569241 ], [ 71.552344115268198, 29.105969784207005 ], [ 71.551654630434072, 29.105965594039997 ], [ 71.55165087174754, 29.106510061608681 ] ] ] } },
            { "type": "Feature", "properties": { "Murabba_No": "1", "Killa": "19" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 71.552340360232961, 29.106514251569241 ], [ 71.553029848718367, 29.106518441529801 ], [ 71.55303360010231, 29.105973974374013 ], [ 71.552344115268198, 29.105969784207005 ], [ 71.552340360232961, 29.106514251569241 ] ] ] } },
            { "type": "Feature", "properties": { "Murabba_No": "1", "Killa": "18" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 71.553029848718367, 29.106518441529801 ], [ 71.553719337203773, 29.10652263149036 ], [ 71.553723084936422, 29.105978164541021 ], [ 71.55303360010231, 29.105973974374013 ], [ 71.553029848718367, 29.106518441529801 ] ] ] } },
            { "type": "Feature", "properties": { "Murabba_No": "1", "Killa": "17" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 71.553719337203773, 29.10652263149036 ], [ 71.55440882568918, 29.10652682145092 ], [ 71.554412569770548, 29.105982354708029 ], [ 71.553723084936422, 29.105978164541021 ], [ 71.553719337203773, 29.10652263149036 ] ] ] } },
            { "type": "Feature", "properties": { "Murabba_No": "1", "Killa": "16" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 71.55440882568918, 29.10652682145092 ], [ 71.5550983141746, 29.10653101141148 ], [ 71.555102054604674, 29.105986544875037 ], [ 71.554412569770548, 29.105982354708029 ], [ 71.55440882568918, 29.10652682145092 ] ] ] } },
            { "type": "Feature", "properties": { "Murabba_No": "1", "Killa": "21" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 71.551654630434072, 29.105965594039997 ], [ 71.552344115268198, 29.105969784207005 ], [ 71.552347870303436, 29.105425316844769 ], [ 71.551658389120604, 29.105421126471313 ], [ 71.551654630434072, 29.105965594039997 ] ] ] } },
            { "type": "Feature", "properties": { "Murabba_No": "1", "Killa": "22" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 71.552344115268198, 29.105969784207005 ], [ 71.55303360010231, 29.105973974374013 ], [ 71.553037351486267, 29.105429507218226 ], [ 71.552347870303436, 29.105425316844769 ], [ 71.552344115268198, 29.105969784207005 ] ] ] } },
            { "type": "Feature", "properties": { "Murabba_No": "1", "Killa": "23" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 71.55303360010231, 29.105973974374013 ], [ 71.553723084936422, 29.105978164541021 ], [ 71.553726832669085, 29.105433697591678 ], [ 71.553037351486267, 29.105429507218226 ], [ 71.55303360010231, 29.105973974374013 ] ] ] } },
            { "type": "Feature", "properties": { "Murabba_No": "1", "Killa": "24" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 71.553723084936422, 29.105978164541021 ], [ 71.554412569770548, 29.105982354708029 ], [ 71.554416313851917, 29.105437887965135 ], [ 71.553726832669085, 29.105433697591678 ], [ 71.553723084936422, 29.105978164541021 ] ] ] } },
            { "type": "Feature", "properties": { "Murabba_No": "1", "Killa": "25" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 71.554412569770548, 29.105982354708029 ], [ 71.555102054604674, 29.105986544875037 ], [ 71.555105795034748, 29.105442078338591 ], [ 71.554416313851917, 29.105437887965135 ], [ 71.554412569770548, 29.105982354708029 ] ] ] } }
        ]
    };

    let testGeoJsonLayers = [];
    let blackLineLayers = [];

    // Populate first dropdown
    chakNames.forEach(function(name) {
        var option = document.createElement('option');
        option.value = option.textContent = name;
        document.getElementById('chak-dropdown').appendChild(option);
    });

    // Keep track of the previous tooltip
    let previousTooltip = null;

    // Handle chak dropdown change
    document.getElementById('chak-dropdown').addEventListener('change', function(e) {
        var chakName = e.target.value;
        if (currentLayer) {
            map.removeLayer(currentLayer);
        }
        if (Murabba_Layer) {
            map.removeLayer(Murabba_Layer);
        }
        // Remove all testGeoJson layers from the map
        testGeoJsonLayers.forEach(layer => map.removeLayer(layer));
        testGeoJsonLayers = [];

        // Remove all black line layers from the map
        blackLineLayers.forEach(layer => map.removeLayer(layer));
        blackLineLayers = [];

        if (chakName !== "Select Chak") {
            loadGeoJson("JSON Murabba/" + chakName + '.geojson', function(geojsonData) {
                currentLayer = L.geoJSON(geojsonData, {
                    style: function() {
                        return {
                            fillColor: "#000000",
                            fillOpacity: 0,
                            color: "#ff0c04",
                            weight: 3
                        };
                    },
                    onEachFeature: function(feature, layer) {
                        if (feature.properties && feature.properties.Murabba_No) {
                            layer.bindTooltip(feature.properties.Murabba_No, { permanent: true, direction: 'center', className: 'mustateel' }).openTooltip();
                        }
                    }
                }).addTo(map);

                let bounds = currentLayer.getBounds();
                map.setView(bounds.getCenter());
                map.fitBounds(bounds);

                // Clear and populate second dropdown
                var Murabba_NoDropdown = document.getElementById('Murabba_No-dropdown');
                Murabba_NoDropdown.innerHTML = '<option>Select Muraba</option>';

                var murabbaNumbers = geojsonData.features.map(function(feature) {
                    return feature.properties.Murabba_No;
                });

                murabbaNumbers.sort(murabbaSort);

                murabbaNumbers.forEach(function(number) {
                    var option = document.createElement('option');
                    option.value = option.textContent = number;
                    Murabba_NoDropdown.appendChild(option);
                });

            });
        }
    });

    document.getElementById('Murabba_No-dropdown').addEventListener('change', function(e) {
        var selectedMurabba_No = e.target.value;
        var chakName = document.getElementById('chak-dropdown').value;

        if (selectedMurabba_No !== "Select Muraba") {
            let murabbaFeature = currentLayer.toGeoJSON().features.find(feature => feature.properties.Murabba_No === selectedMurabba_No);
            if (murabbaFeature) {
                let killaFeature = murabbaFeature.geometry.coordinates[0]; // Get the coordinates of the first Killa

                let transformedGeoJson = transformGeoJsonWithTurf(testGeoJson, killaFeature[0], killaFeature[1], killaFeature[2], killaFeature[3]);

                let newLayer = L.geoJSON(transformedGeoJson, {
                    style: {
                        fillColor: "#000000",
                        fillOpacity: 0,
                        color: "#FFD700", // Bright Yellow for better visibility
                        weight: 4
                    },
                    onEachFeature: function(feature, layer) {
                        if (feature.properties && feature.properties.Killa) {
                            layer.bindTooltip(feature.properties.Killa, { permanent: true, direction: 'center', className: 'labelstyle' }).openTooltip();
                        }
                    }
                }).addTo(map);

                let blackLineLayer = L.geoJSON(transformedGeoJson, {
                    style: {
                        color: "#000000", // Cyan for better visibility
                        weight: 1,
                        dashArray: '10, 10', // Dotted lines
                        fillOpacity: 0,
                        opacity: 1
                    }
                }).addTo(map);

                // Add the new layers to the arrays and remove the oldest if there are more than 3 layers
                testGeoJsonLayers.push(newLayer);
                blackLineLayers.push(blackLineLayer);
                if (testGeoJsonLayers.length > 3) {
                    map.removeLayer(testGeoJsonLayers.shift());
                }
                if (blackLineLayers.length > 3) {
                    map.removeLayer(blackLineLayers.shift());
                }

                let bounds = newLayer.getBounds();
                map.setView(bounds.getCenter());
                map.fitBounds(bounds);

                // Update tooltip position
                updateMurabbaTooltip(selectedMurabba_No, killaFeature[0]);
            } else {
                console.error("Murabba number not found in current layer");
            }
        }
    });

    function transformGeoJsonWithTurf(geojsonData, topLeft, topRight, bottomRight, bottomLeft) {
        const matrixSize = 5;

        // Calculate the width and height of the Murabba
        const width = turf.distance(turf.point(topLeft), turf.point(topRight), { units: 'meters' });
        const height = turf.distance(turf.point(topLeft), turf.point(bottomLeft), { units: 'meters' });

        // Calculate the width and height of each cell in the 5x5 matrix
        const cellWidth = width / matrixSize;
        const cellHeight = height / matrixSize;

        // Calculate the bearing of each side of the Murabba
        const bearingTop = turf.bearing(turf.point(topLeft), turf.point(topRight));
        const bearingLeft = turf.bearing(turf.point(topLeft), turf.point(bottomLeft));

        geojsonData.features.forEach((feature, index) => {
            const col = index % matrixSize;
            const row = Math.floor(index / matrixSize);

            // Calculate the top-left corner of the cell
            const cellOrigin = turf.destination(turf.destination(turf.point(topLeft), col * cellWidth, bearingTop, { units: 'meters' }), row * cellHeight, bearingLeft, { units: 'meters' });

            const cellTopLeft = cellOrigin;
            const cellTopRight = turf.destination(cellTopLeft, cellWidth, bearingTop, { units: 'meters' });
            const cellBottomLeft = turf.destination(cellTopLeft, cellHeight, bearingLeft, { units: 'meters' });
            const cellBottomRight = turf.destination(cellTopRight, cellHeight, bearingLeft, { units: 'meters' });

            const newCoords = [
                [cellTopLeft.geometry.coordinates, cellTopRight.geometry.coordinates, cellBottomRight.geometry.coordinates, cellBottomLeft.geometry.coordinates, cellTopLeft.geometry.coordinates]
            ];

            feature.geometry.coordinates = newCoords;
        });

        return geojsonData;
    }

    function updateMurabbaTooltip(selectedMurabba_No, topLeft) {
        currentLayer.eachLayer(function(layer) {
            if (layer.feature.properties.Murabba_No === selectedMurabba_No) {
                if (previousTooltip) {
                    // Restore previous tooltip to the center
                    previousTooltip.tooltip.setLatLng(previousTooltip.layer.getBounds().getCenter());
                    previousTooltip.layer.openTooltip(previousTooltip.tooltip);
                }
                // Move current tooltip to the top-left corner of Killa 1
                let tooltip = layer.getTooltip();
                layer.unbindTooltip();
                layer.bindTooltip(selectedMurabba_No, { permanent: true, direction: 'top', className: 'mustateel no-arrow' }).setLatLng(topLeft).openTooltip();
                previousTooltip = { tooltip: tooltip, layer: layer };
            }
        });
    }

    map.on('zoomend', updateLabelSize);

    // Feature group to store drawable layers
    var drawnItems = new L.FeatureGroup().addTo(map);

    updateLabelSize();

    var drawControl = new L.Control.Draw({
        position: 'bottomleft',
        edit: {
            featureGroup: drawnItems
        },
        draw: {
            polyline: { allowIntersection: false },
            polygon: { allowIntersection: false, showArea: true },
            circle: true,
            rectangle: true,
            marker: true
        }
    });
    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, function(event) {
        var layer = event.layer;
        drawnItems.addLayer(layer);
        updateLabels(layer);
    });

    map.on(L.Draw.Event.EDITED, function(event) {
        var layers = event.layers;
        layers.eachLayer(function(layer) {
            updateLabels(layer, true);
        });
    });

    function updateLabels(layer, clearOld = false) {
        if (clearOld) {
            clearLabels(layer);
        }

        var type = layer instanceof L.Polygon ? 'polygon' :
            layer instanceof L.Rectangle ? 'rectangle' :
                layer instanceof L.Polyline ? 'polyline' :
                    layer instanceof L.Circle ? 'circle' :
                        layer instanceof L.Marker ? 'marker' : null;

        if (type === 'polygon' || type === 'rectangle' || type === 'polyline') {
            var latlngs = layer.getLatLngs();
            if (type === 'polygon' || type === 'rectangle') {
                latlngs = latlngs[0];
            }
            if (type === 'polygon' && !latlngs[latlngs.length - 1].equals(latlngs[0])) {
                latlngs.push(latlngs[0]);
            }
            latlngs.forEach((latlng, i) => {
                if (i < latlngs.length - 1) {
                    var pointA = latlng;
                    var pointB = latlngs[i + 1];
                    var distance = pointA.distanceTo(pointB) * 3.28084; // Convert to feet
                    var midpoint = L.latLng((pointA.lat + pointB.lat) / 2, (pointA.lng + pointB.lng) / 2);

                    var label = L.marker(midpoint, {
                        icon: L.divIcon({
                            className: 'segment-label',
                            html: `<div style="min-width: 50px; background-color: black; color: white; padding: 2px; border-radius: 3px; white-space: nowrap; text-align: center;">${distance.toFixed(2)} ft</div>`,
                            iconSize: null
                        })
                    }).addTo(map);

                    drawnItems.addLayer(label);
                }
            });

            if (type === 'polygon' || type === 'rectangle') {
                var areaSqFeet = L.GeometryUtil.geodesicArea(latlngs) * 10.7639; // Convert to square feet
                var areaLabel = formatArea(areaSqFeet);
                var center = layer.getBounds().getCenter();

                var areaMarker = L.marker(center, {
                    icon: L.divIcon({
                        className: 'area-label',
                        html: `<div style="min-width: 50px; background-color: black; color: white; padding: 2px; border-radius: 3px; white-space: nowrap; text-align: left;">${areaLabel}</div>`,
                        iconSize: null
                    })
                }).addTo(map);

                drawnItems.addLayer(areaMarker);
            }
        } else if (type === 'circle') {
            var radius = layer.getRadius() * 3.28084; // Convert to feet
            var areaSqFeet = Math.PI * (radius * radius); // Calculate area in square feet
            var areaLabel = formatArea(areaSqFeet);
            var center = layer.getLatLng();
            var radiusAndAreaLabel = L.marker(center, {
                icon: L.divIcon({
                    className: 'radius-area-label',
                    html: `<div style="background-color: black; color: white; padding: 2px; border-radius: 3px;">Radius: ${radius.toFixed(2)} ft<br> ${areaLabel}</div>`,
                })
            }).addTo(map);
            drawnItems.addLayer(radiusAndAreaLabel);
        } else if (type === 'marker') {
            var latlng = layer.getLatLng();
            var tooltipContent = `Lat:Long (${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)})`;
            layer.bindTooltip(tooltipContent, {
                permanent: true,
                direction: 'top',
                className: 'leaflet-tooltip.leaflet-clickable'
            }).openTooltip();
        }
    }

    function formatArea(areaSqFeet) {
        var oneMarla = 272.25;
        var oneKanal = 20 * oneMarla;
        var oneAcre = 8 * oneKanal;

        if (areaSqFeet < oneMarla) {
            return `Area:<br>${areaSqFeet.toFixed(2)} Sq. Feet`;
        } else if (areaSqFeet < oneKanal) {
            var marlas = Math.floor(areaSqFeet / oneMarla);
            var remainingFeet = areaSqFeet % oneMarla;
            return `Area:<br>${marlas} Marla<br>${remainingFeet.toFixed(2)} Sq. Feet`;
        } else if (areaSqFeet < oneAcre) {
            var kanals = Math.floor(areaSqFeet / oneKanal);
            var restFeetInKanal = areaSqFeet % oneKanal;
            var marlas = Math.floor(restFeetInKanal / oneMarla);
            var remainingFeet = restFeetInKanal % oneMarla;
            return `Area:<br>${kanals} Kanal<br>${marlas} Marla<br>${remainingFeet.toFixed(2)} Sq. Feet`;
        } else {
            var acres = Math.floor(areaSqFeet / oneAcre);
            var restFeetInAcre = areaSqFeet % oneAcre;
            var kanals = Math.floor(restFeetInAcre / oneKanal);
            var restFeetInKanal = restFeetInAcre % oneKanal;
            var marlas = Math.floor(restFeetInKanal / oneMarla);
            var remainingFeet = restFeetInKanal % oneMarla;
            return `Area:<br>${acres} Acre<br>${kanals} Kanal<br>${marlas} Marla<br>${remainingFeet.toFixed(2)} Sq. Feet`;
        }
    }

    function clearLabels(layer) {
        drawnItems.eachLayer(function(otherLayer) {
            if (otherLayer !== layer && otherLayer.options.icon && otherLayer.options.icon.options.className.includes('label')) {
                map.removeLayer(otherLayer);
                drawnItems.removeLayer(otherLayer);
            }
        });
    }

    map.on('draw:deleted', function(e) {
        var layers = e.layers;
        layers.eachLayer(function(layer) {
            map.removeLayer(layer);
            drawnItems.removeLayer(layer);
        });
    });
}).catch((error) => {
    console.error('Failed to load Turf.js:', error);
});
