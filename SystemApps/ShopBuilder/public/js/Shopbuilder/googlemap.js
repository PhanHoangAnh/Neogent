$(document).ready(prepareMap)

function prepareMap() {
    var geocoder = new google.maps.Geocoder();

    function geocodePosition(pos) {
        geocoder.geocode({
            latLng: pos
        }, function(responses) {
            if (responses && responses.length > 0) {
                updateMarkerAddress(responses[0].formatted_address);
            } else {
                updateMarkerAddress('Cannot determine address at this location.');
            }
        });
    }
    var latLng;
    // Try HTML5 geolocation.
    var options = {
        zoom: 10,
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    updatePos();

    function updatePos() {
        //var infoWindow = new google.maps.InfoWindow({map: map});

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos;
                if (!shopInfo.longitude && !shopInfo.latitude) {
                    pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                } else {
                    pos = {
                        lat: parseFloat(shopInfo.latitude),
                        lng: parseFloat(shopInfo.longitude)
                    }
                }

                latLng = new google.maps.LatLng(pos.lat, pos.lng);
                // infoWindow.setPosition(pos);
                // infoWindow.setContent('Location found.');
                map.setCenter(pos);
            }, function() {
                //handleLocationError(true, infoWindow, map.getCenter());
            }, options);
        } else {
            // Browser doesn't support Geolocation
            //  handleLocationError(false, infoWindow, map.getCenter());
        }
        // 
    }

    function updateMarkerStatus(str) {
        document.getElementById('markerStatus').innerHTML = str;
    }

    function updateMarkerPosition(latLng) {
        if (!latLng) {
            updatePos();
        } else {
            shopInfo.latitude = latLng.lat();
            shopInfo.longitude = latLng.lng();
            document.getElementById('info').innerHTML = [
                latLng.lat(),
                latLng.lng()
            ].join(', ');
        }
    }

    function updateMarkerAddress(str) {
        document.getElementById('address').innerHTML = str;
        document.getElementById('textAddress').value = str;
        document.getElementById('textAddress').parentNode.classList.remove("missing");
        // shopInfo.address = encodeURIComponent(str);
        shopInfo.address = str;
        //innerText
        //shopInfo.address = document.getElementById('textAddress').innerText;
    }


    function initialize() {
        map = new google.maps.Map(document.getElementById('mapCanvas'), {
            zoom: 15,
            center: latLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        var marker = new google.maps.Marker({
            position: latLng,
            title: 'Vị trí hiện tại của bạn',
            map: map,
            draggable: true
        });;

        // Update current position info.
        updateMarkerPosition(latLng);
        geocodePosition(latLng);

        // Add dragging event listeners.
        google.maps.event.addListener(marker, 'dragstart', function() {
            updateMarkerAddress('Dragging...');
        });

        google.maps.event.addListener(marker, 'drag', function() {
            updateMarkerStatus('Dragging...');
            updateMarkerPosition(marker.getPosition());
        });

        google.maps.event.addListener(marker, 'dragend', function() {
            updateMarkerStatus('Drag ended');
            geocodePosition(marker.getPosition());
        });
    }
    // Onload handler to fire off the app.
    google.maps.event.addDomListener(window, 'load', initialize);
    google.maps.event.addDomListener(window, "resize", function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        console.log(latLng.lat(), latLng.lng());
        map.setCenter({ lat: latLng.lat(), lng: latLng.lng() });
        // map.panTo({lat:latLng.lat(), lng:latLng.lng()});
    });
    var mapCover = document.getElementById("mapCover")
    mapCover.addEventListener('click', function() {
        setTimeout(function() {
            // google.maps.event.trigger(map, 'resize');
            google.maps.event.trigger(window, "resize", {});
            // map.setCenter(latLng);
        }, 500)
    });
}
