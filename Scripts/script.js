var map = L.map('map').setView([31,68], 5); // Set to your default view

var googleHybrid = L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(map); 

var googleSat = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 21,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(map);

var baseLayers = {
    "Google Hybrid": googleHybrid,
    "Google Satellite": googleSat
    };

L.control.layers(baseLayers, null, {collapsed: false, position: 'bottomright' }).addTo(map);
L.control
  .locate({
    position: "topleft",
    strings: {
    title: "Show My Location"
    },
    locateOptions: {
      enableHighAccuracy: true
    }
  })
  .addTo(map);



  function customSort(array) {
    return array.sort((a, b) => {
        // Splitting each string at the space
        let [numA, alphaA] = a.split(" ");
        let [numB, alphaB] = b.split(" ");

        // Parsing the numeric parts as integers
        numA = parseInt(numA, 10);
        numB = parseInt(numB, 10);

        // Comparing the numeric parts
        if (numA !== numB) {
            return numA - numB;
        }

        // If the numeric parts are equal, compare the alphabetical parts
        return alphaA.localeCompare(alphaB);
    });
} 

var currentLayer = null;
var Murabba_Layer = null;
let chakNames=customSort(data);
// Populate first dropdown
chakNames.forEach(function(name) {
    var option = document.createElement('option');
    option.value = option.textContent = name;
    document.getElementById('chak-dropdown').appendChild(option);
});


function updateLabelSize() {
    const zoomLevel = map.getZoom();
    let fontSize;

    // Adjust font size based on zoom level
    if (zoomLevel < 10) {
        fontSize = '8px'; // Smaller font at lower zoom levels
    } else if (zoomLevel >= 10 && zoomLevel < 15) {
        fontSize = '12px'; // Medium font for mid zoom levels
    } else {
        fontSize = '16px'; // Larger font at higher zoom levels
    }

    // Set the CSS variable to adjust label size
    document.documentElement.style.setProperty('--label-font-size', fontSize);
}


// Handle chak dropdown change
document.getElementById('chak-dropdown').addEventListener('change', function(e) {
    var chakName = e.target.value;
    if (currentLayer) {
        map.removeLayer(currentLayer);
        map.removeLayer(Murabba_Layer);
    }
    if (chakName !== "Select Chak") {
        loadGeoJson( "JSON Murabba/"+chakName + '.geojson', function(geojsonData) {
            currentLayer = L.geoJSON(geojsonData,{
                style: function() {
                    return {
                        fillColor: "#000000", // Black, but it will be transparent due to fillOpacity
                        fillOpacity: 0, // Transparent fill
                        color: "#ff0c04", // Border color
                        weight: 3 // Border width
                    };
                },
                onEachFeature: function(feature, layer) {
                    if (feature.properties && feature.properties.Murabba_No) {
                        layer.bindTooltip(feature.properties.Murabba_No,{ permanent: true ,direction: 'center',className: 'mustateel'}).openTooltip();
                    }
                }
            }).addTo(map);
            
            let bounds = currentLayer.getBounds();
            map.setView(bounds.getCenter());
            map.fitBounds(bounds);
        // Clear and populate second dropdown
var Murabba_NoDropdown = document.getElementById('Murabba_No-dropdown');
Murabba_NoDropdown.innerHTML = '<option>Select Muraba</option>';

// Collect all Murabba_No values into an array
var murabbaNumbers = geojsonData.features.map(function(feature) {
    return feature.properties.Murabba_No;
});

function customSort(a, b) {
    let [numA, denomA = 1] = a.includes('/') ? a.split('/').map(Number) : [Number(a), 1];
    let [numB, denomB = 1] = b.includes('/') ? b.split('/').map(Number) : [Number(b), 1];

    if (numA === numB) {
        return denomA - denomB;
    }
    return numA - numB;
}

murabbaNumbers.sort(customSort);

// Create and append option elements to the dropdown
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
    
    if (Murabba_Layer) {
        map.removeLayer(Murabba_Layer);
    }

    if (selectedMurabba_No !== "Select Muraba") {
        loadGeoJson("JSON Khasra/"+chakName + ' ' + 'Khasra' + '.geojson', function(geojsonData) {
            // Filter the GeoJSON data
            var filteredGeoJson = {
                ...geojsonData,
                features: geojsonData.features.filter(feature => 
                    feature.properties.Murabba_No === selectedMurabba_No)
            };

            // Add the filtered data to the map
            Murabba_Layer = L.geoJSON(filteredGeoJson,{
                style: function() {
                    return {
                        fillColor: "#000000", // Black, but it will be transparent due to fillOpacity
                        fillOpacity: 0, // Transparent fill
                        color: "#ede88f", // Border color
                        weight: 1 // Border width
                    };
                },
                onEachFeature: function(feature, layer) {
                    if (feature.properties && feature.properties.Killa) {
                        layer.bindTooltip(feature.properties.Killa,{ permanent: true ,direction: 'center',className: 'labelstyle'}).openTooltip();
                    }
                }
            }).addTo(map);

            let bounds = Murabba_Layer.getBounds();
            map.setView(bounds.getCenter());
            map.fitBounds(bounds);
        }, function() {
            console.error("Error loading Murabba_No GeoJSON");
        });
    }
});


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

map.on('zoomend', updateLabelSize);


// Feature group to store drawable layers
var drawnItems = new L.FeatureGroup().addTo(map);

updateLabelSize();

// Add drawing controls with positioning at the bottom left
var drawControl = new L.Control.Draw({
    position: 'bottomleft',
    edit: {
        featureGroup: drawnItems
    },
    draw: {
        polyline: {
            allowIntersection: false
        },
        polygon: {
            allowIntersection: false,
            showArea: true
        },
        circle: true,
        rectangle: true,
        marker: true
    }
});
map.addControl(drawControl);

// Handling the creation and edit of shapes
map.on(L.Draw.Event.CREATED, function(event) {
    var layer = event.layer;
    drawnItems.addLayer(layer);
    updateLabels(layer);
});

map.on(L.Draw.Event.EDITED, function(event) {
    var layers = event.layers;
    layers.eachLayer(function(layer) {
        updateLabels(layer, true); // Update with clearing old labels
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
        // Close the polygon if necessary
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
                        iconSize: null // Let Leaflet handle the size dynamically based on content
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
        var latlng = layer.getLatLng();  // Get the latitude and longitude
        var tooltipContent = `Lat:Long (${latlng.lat.toFixed(5)},  ${latlng.lng.toFixed(5)})`;
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
    drawnItems.eachLayer(function (otherLayer) {
        if (otherLayer !== layer && otherLayer.options.icon && otherLayer.options.icon.options.className.includes('label')) {
            map.removeLayer(otherLayer);
            drawnItems.removeLayer(otherLayer);
        }
    });
}

map.on('draw:deleted', function (e) {
    var layers = e.layers;
    layers.eachLayer(function (layer) {
        map.removeLayer(layer);
        drawnItems.removeLayer(layer);
    });
});
