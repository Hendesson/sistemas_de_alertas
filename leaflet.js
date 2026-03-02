var map = L.map('map', {
    center: [16.2, 19.8],
    zoom: 3
})
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © OpenStreetMap contributors',
maxZoom: 19
}).addTo(map);


// Função que retorna um tom de verde baseado em NUM_PROTOC
function getColor(num) {
    return num >= 19 ? '#00441b' :
           num >= 14 ? '#006d2c' :
           num >= 9  ? '#238b45' :
           num >= 5  ? '#41ab5d' :
           num >= 1  ? '#e5f5e0' :
                       '#e5f5e0'; // fallback (null / undefined)
}

// Função de estilo das feições
function stylePaises(feature) {
    const num = feature.properties?.NUM_PROTOC;

    return {
        color: '#00441b',                 // contorno verde escuro
        weight: 1,
        fillColor: getColor(num),         // AGORA depende do atributo
        fillOpacity: 0.7
    };
}

// Função para popup em cada feição
function onEachFeature(feature, layer) {
    if (feature.properties) {
        const p = feature.properties;

        let popupContent = `
            <strong>${p.NOME_PT ?? 'Sem nome'}</strong><br>
            Número de protocolos: ${p.NUM_PROTOC ?? '—'}
        `;

        layer.bindPopup(popupContent);
    }
}

// Carregando o GeoJSON
fetch('json/paises_com_protocolos.geojson')
    .then(response => response.json())
    .then(geojsonData => {
        L.geoJSON(geojsonData, {
            style: stylePaises,
            onEachFeature: onEachFeature
        }).addTo(map);
    });

/*
// template for the items in the data variable
{"title": '', "author": '', "accessLink": '', "year": '', "lat": null, "lng": null, "journal": ''},
*/

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h1>Distribuição espacial dos <br><br> protocolos de ondas de <br><br> calor e saúde pelo mundo.</h1>';
};

info.addTo(map)

var logo = L.control();

logo.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'logo'); // create a div with a class "logo"
    this.update();
    return this._div;
};

logo.update = function (props) {
    this._div.innerHTML = '<a href="http://lagas.unb.br/"><img src="images/lagas_e_geocalor.png" alt="logo do laboratório lagas"></a>';
};

logo.addTo(map)
logo.setPosition('bottomleft')

var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend'),
        grades = [1, 5, 9, 14, 19],
        labels = [];

    div.innerHTML += '<strong>Nº de protocolos</strong><br>';

    for (var i = 0; i < grades.length; i++) {
        var from = grades[i];
        var to = grades[i + 1] - 1;

        div.innerHTML +=
            '<i style="background:' + getColor(from) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+') + '<br>';
    }

    return div;
};

legend.addTo(map);
