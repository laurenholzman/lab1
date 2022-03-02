mapboxgl.accessToken =
  "pk.eyJ1IjoidGhlaGVsbG9tYXJ0aWFuIiwiYSI6ImNsMDc1NXBuazF6bXczZXJzd2ZseXB4MDgifQ.gQNA94PswehVHrpv6cBBSw";
let layers2;
let colors;
let title

const map = new mapboxgl.Map({
  container: "map", // container id
  style: "mapbox://styles/thehellomartian/cl07eg7hi002c14nrzfcxcf2o",
});

map.on("load", () => {
  // the rest of the code will go in here

  map.addSource("Median Household Income", {
    type: "vector",
    url: "mapbox://thehellomartian.0s3fc5pz",
  });
  map.addLayer(
    {
      id: "Median Household Income",
      type: "fill",
      source: "Median Household Income",
      layout: {
        // Make the layer visible by default.
        visibility: "visible",
      },

      "source-layer": "cb_2020_53_bg_500k_FeaturesT--cegnoo",
      paint: {
        "fill-color": [
          "step",
          ["get", "cb_2020_53_bg_500k.income"],
          "hsl(0, 0%, 86%)",
          -0.1,
          "hsl(0, 0%, 90%)",
          0,
          "hsl(95, 95%, 82%)",
          25000,
          "hsl(95, 95%, 82%)",
          75000,
          "hsl(95, 75%, 60%)",
          125000,
          "hsl(95, 75%, 45%)",
          175000,
          "hsl(95, 65%, 30%)",
          250000,
          "hsl(95, 45%, 15%)",
        ],
      },
    },
    "water-shadow"
  );

  // Add the Mapbox Terrain v2 vector tileset. Read more about
  // the structure of data in this tileset in the documentation:
  // https://docs.mapbox.com/vector-tiles/reference/mapbox-terrain-v2/
  map.addSource("Population", {
    type: "vector",
    url: "mapbox://thehellomartian.cmwoz3z5",
  });
  map.addLayer(
    {
      id: "Population",
      type: "fill",
      source: "Population",
      "source-layer": "cb_2020_53_bg_500k_FeaturesT-1lstu0",
      layout: {
        // Make the layer visible by default.
        visibility: "visible",
      },
      paint: {
        "fill-color": [
          "step",
          ["get", "wa_2020_pl94171_bg.P00010001"],

          "hsl(0, 0%, 90%)",
          0,
          "hsl(313, 95%, 82%)",
          900,
          "hsl(313, 95%, 82%)",
          1300,
          "hsl(313, 75%, 60%)",
          1600,
          "hsl(313, 75%, 45%)",
          2000,
          "hsl(313, 65%, 30%)",
          2700,
          "hsl(313, 45%, 15%)",
        ],
      },
    },
    "water-shadow"
  );
});

// After the last frame rendered before the map enters an "idle" state.
map.on("idle", () => {
  // If these two layers were not added to the map, abort
  if (!map.getLayer("Population") || !map.getLayer("Median Household Income")) {
    return;
  }

  // Enumerate ids of the layers.
  const toggleableLayerIds = ["Population", "Median Household Income"];

  // Set up the corresponding toggle button for each layer.
  for (const id of toggleableLayerIds) {
    // Skip layers that already have a button set up.
    if (document.getElementById(id)) {
      continue;
    }

    // Create a link.
    const link = document.createElement("a");
    link.id = id;
    link.href = "#";
    link.textContent = id;
    link.className = "active";

    // Show or hide layer when the toggle is clicked.
    link.onclick = function (e) {
      const clickedLayer = this.textContent;
      e.preventDefault();
      e.stopPropagation();

      const visibility = map.getLayoutProperty(clickedLayer, "visibility");

      // Toggle layer visibility by changing the layout object's visibility property.
      if (visibility === "visible") {
        map.setLayoutProperty(clickedLayer, "visibility", "none");
        this.className = "";
      } else {
        this.className = "active";
        map.setLayoutProperty(clickedLayer, "visibility", "visible");
      }
      //deciding which legend to make
      if (
        map.getLayoutProperty("Population", "visibility") == "visible" &&
        map.getZoom() > 8
      ) {
        layers2 = [
          "0",
          "1-899",
          "900-1299",
          "1300-1599",
          "1600-1999",
          "2000-2700",
          "2700+",
        ];
        colors = [
          "hsl(0, 0%, 90%)",

          "hsl(313, 95%, 82%)",

          "hsl(313, 95%, 82%)",

          "hsl(313, 75%, 60%)",

          "hsl(313, 75%, 45%)",

          "hsl(313, 65%, 30%)",

          "hsl(313, 45%, 15%)",
        ];
        title = 'Population';
      } else if (
        map.getLayoutProperty("Median Household Income", "visibility") == "visible" &&
        map.getZoom() > 8
      ) {
        layers2 = [
          "No data",
          "0-24,999",
          "25,000-74,999",
          "75,000-124,999",
          "125,000-174,999",
          "175,000-249,999",
          "250,000+",
        ];
        colors = [
          "hsl(0, 0%, 90%)",

          "hsl(95, 95%, 82%)",

          "hsl(95, 95%, 82%)",

          "hsl(95, 75%, 60%)",

          "hsl(95, 75%, 45%)",

          "hsl(95, 65%, 30%)",

          "hsl(95, 45%, 15%)",
        ];
      title = 'Median Household Income ($/year)';
      } else {
        layers2 = ["Greenspace"];
        colors = ["#b4e29c"];
        title = '';
      }
      //legend making
      const legend = document.getElementById("legend");
      legend.innerHTML = '<h4>' + title + '</h4>';

      layers2.forEach((layer2, i) => {
        const color = colors[i];
        const item = document.createElement("div");
        const key = document.createElement("span");
        key.className = "legend-key";
        key.style.backgroundColor = color;

        const value = document.createElement("span");
        value.innerHTML = `${layer2}`;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
      });
    };
    const layers = document.getElementById("menu");
    layers.appendChild(link);
  }

  map.on("zoom", () => {
    if (map.getZoom() < 8) {
      legend.innerHTML = "";

      const color = "#b4e29c";
      const item = document.createElement("div");
      const key = document.createElement("span");
      key.className = "legend-key";
      key.style.backgroundColor = color;

      const value = document.createElement("span");
      value.innerHTML = `${"Greenspace"}`;
      item.appendChild(key);
      item.appendChild(value);
      legend.appendChild(item);
    } else {
      //deciding which legend to make
      if (
        map.getLayoutProperty("Population", "visibility") == "visible" &&
        map.getZoom() > 8
      ) {
        layers2 = [
          "0",
          "1-899",
          "900-1299",
          "1300-1599",
          "1600-1999",
          "2000-2700",
          "2700+",
        ];
        colors = [
          "hsl(0, 0%, 90%)",

          "hsl(313, 95%, 82%)",

          "hsl(313, 95%, 82%)",

          "hsl(313, 75%, 60%)",

          "hsl(313, 75%, 45%)",

          "hsl(313, 65%, 30%)",

          "hsl(313, 45%, 15%)",
        ];
        title = 'Population';
      } else if (
        map.getLayoutProperty("Median Household Income", "visibility") == "visible" &&
        map.getZoom() > 8
      ) {
        layers2 = [
          "No data",
          "0-49,999",
          "50,000-99,999",
          "100,000-149,999",
          "150,000-199,999",
          "200,000-249,999",
          "250,000+",
        ];
        colors = [
          "hsl(0, 0%, 90%)",

          "hsl(95, 95%, 82%)",

          "hsl(95, 95%, 82%)",

          "hsl(95, 75%, 60%)",

          "hsl(95, 75%, 45%)",

          "hsl(95, 65%, 30%)",

          "hsl(95, 45%, 15%)",
        ];
        title = 'Median Household Income ($/year)';
      } else {
        layers2 = ["Greenspace"];
        colors = ["#b4e29c"];
        title = '';
      }
      //legend making
      const legend = document.getElementById("legend");
      legend.innerHTML = '<h4>' + title + '</h4>';
      

      layers2.forEach((layer2, i) => {
        const color = colors[i];
        const item = document.createElement("div");
        const key = document.createElement("span");
        key.className = "legend-key";
        key.style.backgroundColor = color;

        const value = document.createElement("span");
        value.innerHTML = `${layer2}`;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
      });
    }
  });
  // Add a new source from our GeoJSON data and
  // set the 'cluster' option to true. GL-JS will
  // add the point_count property to your source data.
  map.addSource("libraries", {
    type: "geojson",
    // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
    // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
    data:
      "https://raw.githubusercontent.com/thehellomartian/lab1/main/Libraries_FeaturesToJSON.geojson",
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
  });

  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "libraries",
    filter: ["has", "point_count"],
    paint: {
      // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
      // with three steps to implement three types of circles:
      //   * Blue, 20px circles when point count is less than 100
      //   * Yellow, 30px circles when point count is between 100 and 750
      //   * Pink, 40px circles when point count is greater than or equal to 750
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#51bbd6",
        10,
        "#51bbd6",
        50,
        "#51bbd6",
      ],
      "circle-radius": {
        property: "point_count",
        type: "exponential",
        stops: [
          [2, 10],
          [100, 30],
        ],
      },
    },
  });

  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "libraries",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
  });

  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "libraries",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#11b4da",
      "circle-radius": 5,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff",
    },
  });

  // inspect a cluster on click
  map.on("click", "clusters", (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["clusters"],
    });
    const clusterId = features[0].properties.cluster_id;
    map
      .getSource("libraries")
      .getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;

        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom,
        });
      });
  });
 
  map.on("click", "unclustered-point", (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const branch = e.features[0].properties.Branch;
     const lib = e.features[0].properties.Library;
    

    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(`Library: ${lib} <br> Branch: ${branch}`) 
      .addTo(map);
  });

  map.on("mouseenter", "clusters", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "clusters", () => {
    map.getCanvas().style.cursor = "";
  });
   map.on("mouseenter", "unclustered-point", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "unclustered-point", () => {
    map.getCanvas().style.cursor = "";
  });
});

function setup() {}

function draw() {}
