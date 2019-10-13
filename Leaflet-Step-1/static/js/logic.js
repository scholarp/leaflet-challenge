// Store API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {


// Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {


// Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }

// Create a GeoJSON layer containing the features array on the earthquakeData object
  var earthquakes = L.geoJSON(earthquakeData, {
    
    pointToLayer: function (feature, latlng) {
      var color;
      var r = 255;
      var g = Math.floor(255-80*feature.properties.mag);
      var b = Math.floor(255-80*feature.properties.mag);
      color= "rgb("+r+" ,"+g+","+ b+")"
      
      var geojsonMarkerOptions = {
        radius: 4*feature.properties.mag,
        fillColor: color,
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    },

// Run the onEachFeature function once for each piece of data in the array
    onEachFeature: onEachFeature
  });

// Sending earthquakes layer to the createMap function
  createMap(earthquakes);

}

// Define function to create a map
function createMap(earthquakes) {

// Define streetmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    accessToken: API_KEY
  });

// Define a baseMaps object to hold base layers
  var baseMaps = {
    "Street Map": streetmap
  };

// Create overlay object to hold overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

// Create map and give it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

// Establish colors depending on the magnitude of the earthquake

  function getColor(d) {
      return d < 1 ? 'rgb(255,255,255)' :
            d < 2  ? 'rgb(255,225,225)' :
            d < 3  ? 'rgb(255,195,195)' :
            d < 4  ? 'rgb(255,165,165)' :
            d < 5  ? 'rgb(255,135,135)' :
            d < 6  ? 'rgb(255,105,105)' :
                        'rgb(255,0,0)';
  }

// Create the map legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
      levels = [0, 1, 2, 3, 4, 5],
      labels = [];

      div.innerHTML+='Magnitude<br><hr>'
  
// Loop through magnitude intervals and generate a label with a colored square for each interval
      for (var i = 0; i < levels.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(levels[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
              levels[i] + (levels[i + 1] ? '&ndash;' + levels[i + 1] + '<br>' : '+');
  }
  
  return div;
  };
  
  legend.addTo(myMap);

}