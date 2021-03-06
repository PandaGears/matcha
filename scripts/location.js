var position;

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -33.9058688, lng: 18.415616 },
        zoom: 13
    });

    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input');
    var options = {
        componentRestrictions: { country: "za" }
    };


    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);
    var autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.bindTo('bounds', map);
    autocomplete.setFields(
        ['address_components', 'geometry', 'icon', 'name']);
    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);
    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });
    autocomplete.addListener('place_changed', function() {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }
        marker.setPosition(place.geometry.location);
        position = place.geometry.location;
        $.ajax({
            type: "POST",
            url: '/location',
            data: JSON.stringify(position),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function() {
                document.getElementById('locPara').innerHTML = 'You have a place in the world!';
                setTimeout(() => {
                    $('#locPara').text('');
                }, 3000);
            }

        })
    });
}