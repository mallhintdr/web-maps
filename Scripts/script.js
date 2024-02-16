var map = L.map('map').setView([31,68], 5); // Set to your default view

var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(map);

var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
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

L.control.scale({ 
    metric: true,
    imperial: false,
    position: 'bottomleft'
}).addTo(map);

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

// ... rest of the code remains the same
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


