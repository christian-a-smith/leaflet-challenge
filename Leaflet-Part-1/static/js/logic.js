let myurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
//create color scale for depth
function getdepthcolor(depth){
    if (depth < 10){return "green"} 
    else if (depth < 30){return "yellow"}
    else if (depth < 50){return "gold"}
    else if (depth < 70){return "orange"}
    else if (depth < 90){return "LightCoral"}
    else return "red"
};
//create the map
d3.json(myurl).then(function(alldata){
    console.log(alldata);
    let fullmap = L.map("map",{
        "zoom": 3,
        "center": [40,90],

    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(fullmap);
//add the depth and adjust the colors/opacity
L.geoJson(alldata,{pointToLayer:function(f, coord){
    return L.circleMarker(coord,{
        fillColor:getdepthcolor(f.geometry.coordinates[2]),
        stroke:false,
        fillOpacity:0.7,
        radius:f.properties.mag*5
    })
},
//Create the popups for each dot, display location, magnitude, and depth
onEachFeature:function(f,layer){
    layer.bindPopup(`<h3>Location: ${f.properties.place}</h3>
    Magnitude: ${f.properties.mag}<br>
    Depth: ${f.geometry.coordinates[2]}
    `)
}}).addTo(fullmap)


// Create a legend to display information about our map.
let legend = L.control({
    position: "bottomright"
  });

//populate the legend
legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend');
    let depths = [0, 10, 30, 50, 70, 90];
    //iterate through the depths list and grab the color from the top
    for (let i = 0; i < depths.length; i++) {
        let from = depths[i];
        let to = depths[i + 1];
        let color = getdepthcolor(from + 1);
//styling
        div.innerHTML +=
            '<div><i style="background:' + color + '"></i> ' +
            from + (to ? '&ndash;' + to : '+') + '</div>';
    }

    return div;
};

legend.addTo(fullmap);
});