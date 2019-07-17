var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
$.getJSON(url, function(data) { createMap(data, myMap); });

var myMap = L.map("map", {
  center: [37.1, -95.7],
  zoom: 5
});

function getColor(a) {
  return a >= 7 ? '#500000' :
         a >= 5 ? '#800000' :
         a >= 3 ? '#d11212' :
         a >= 2 ? '#ff4242' :
         a >= 1 ? '#f29191' :
         '#ffffff';
};

function createMap(data, myMap) {
  var earthquakes = L.geoJson(data, {
    onEachFeature: function(feature, layer) {
      var popupOptions = {
        'maxWidth': '700',
        'className': 'custom'
      };
      var popUpInfo = "Mag: " + feature.properties.mag + "<br>Loc: " + feature.properties.place 
            + "<br>" + new Date(feature.properties.time);
        layer.bindPopup(popUpInfo, popupOptions);
      },
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        color: getColor(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        radius: 7.5*feature.properties.mag,
        fillOpacity: 0.9,
        opacity: 0.6
      });
    }
  }).addTo(myMap);

  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
  });

  var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
  };

  var overlayMaps = {
      Earthquakes: earthquakes
  };

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position:
    'topright'});

    legend.onAdd = function (myMap) {
    // DomUtil class connects webpages to script 
    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 1, 2, 3, 5, 7],
    labels = [];
    div.innerHTML+='<h5>Magnitude</h5>'
  
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML += '<i style="background:' + getColor(grades[i]) + '">&nbsp&nbsp&nbsp&nbsp</i>' 
        + grades[i] + (grades[i + 1]?'&ndash;' + grades[i + 1] + '<br>' : '+');
    };
    return div;
  };
  
  legend.addTo(myMap);
};