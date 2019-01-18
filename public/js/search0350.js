var map;
var map_init = false;
var map_isset = $('#map').length;
var country_markers = [];
var city_markers = [];
var markerCluster = [];

var uluru = {lat: 56.009657, lng: 37.9456611};

var countrySelector = '#country_list';
var citySelector = '#city_list';

$(document).on('change', '#servicesearch-price_from, #servicesearch-price_to, #service-rate, #currency_list', function () {
    $('#search_page').val(1);
    filtering();
});

function catalogListenerOn() {
    $(document).on('change.catalogMode', '#search-form input[type="checkbox"]', function () {
        $('#search_page').val(1);
        filtering();
    });
}
function catalogListenerOff() {
    $(document).off('change.catalogMode', '#search-form input[type="checkbox"]');
}

$('.searching_checkbox_relative').on('click.catalogModeRelative', function () {
    catalogListenerOff();
    if ($(this).hasClass('filter_catalog_relative_on')) {
        $(this).removeClass('filter_catalog_relative_on');
        $(this).parent('.item_title').next('.item_list').find('.jq-checkbox.checked.catalog_checker').click();
        $(this).parent('.item_title').next('.item_list').find('.searching_checkbox_relative').removeClass('filter_catalog_relative_on');
    } else {
        $(this).addClass('filter_catalog_relative_on');
        $(this).parent('.item_title').next('.item_list').find('.jq-checkbox.catalog_checker').not('.checked').click();
        $(this).parent('.item_title').next('.item_list').find('.searching_checkbox_relative').addClass('filter_catalog_relative_on');
    }
    catalogListenerOn();
    $('#search_page').val(1);
    filtering();
    });



$(document).on('change', countrySelector, function () {
    var country = $("option:selected", $(this)).text();
    var countryId = $(this).val();
    $('#search_page').val(1);

    clearMarkers();

    if (countryId != '' && countryId > 0) {
        getCountryCity(countryId);
        if (map_init) {
            geocode(country, 4);
            addCityMarkers(false);
        }
    } else {
        addAllCityMarkers();
        // addCountryMarkers();
        // getCountryCity(countryId);

        if (map_init) {
            map.setZoom(3),
                map.setCenter(uluru);
        }
    }

    setTimeout(function () {
        getItems();
    }, 500);

});

$(document).on('change', citySelector, function () {
    $('#search_page').val(1);

    var country = $("option:selected", $(countrySelector)).text();
    var city = $("option:selected", $(this)).text();
    var city_id = $(this).val();
    if (map_isset) {
        // geocode(country + ', ' + city, 10);
        addCityMarkers((city_id == 0 || city_id == null) ? false : true);
    }
    setTimeout(function () {
        getItems();
    }, 500);
});

$(document).ready(function () {
        initMap();
        addMarkers();
        catalogListenerOn();
});

function filtering() {
    clearMarkers();
    getItems();
    addAllCityMarkers();

    // addMarkers();
}

function addCountryMarkers() {
    var form_data = $('#search-form').serialize();
    $.get(get_marker_url, form_data, function (res) {
        if (res) {
            $.each(res, function (i, e) {
                var image = {
                    url: '/libs/js-marker-clusterer/images/m3.png',
                    // size: new google.maps.Size(32, 32),
                    origin: new google.maps.Point(0, 0)
                };
                var marker = new google.maps.Marker({
                    position: {lat: parseFloat(e.coords[0]), lng: parseFloat(e.coords[1])},
                    map: map,
                    label: String(e.count),
                    icon: image,
                    countryId: e.country_id
                });
                country_markers.push(marker);

                google.maps.event.addListener(marker, 'click', function () {
                    getCountryCity(this.countryId);
                    $(countrySelector).val(this.countryId).trigger('refresh');

                    map.setZoom(4);
                    map.setCenter(this.getPosition());

                    setTimeout(function () {
                        getItems();
                    }, 500);

                    clearMarkers();

                    addCityMarkers();

                });
            });
        }
    });
}

function addAllCityMarkers(center_city) {
    clearMarkers();
    $('#servicesearch-all').val(1);
    var form_data = $('#search-form').serialize();

    $.get(get_marker_url, form_data, function (res) {
        if (res && map_init) {
            $.each(res, function (i, e) {

                var image = {
                    url: '/libs/js-marker-clusterer/images/m3.png',
                    // size: new google.maps.Size(32, 32),
                    origin: new google.maps.Point(0, 0)
                };

                var marker = new google.maps.Marker({
                    position: {lat: parseFloat(e.coords[0]), lng: parseFloat(e.coords[1])},
                    map: map,
                    label: String(e.count),
                    icon: image,
                    // animation: google.maps.Animation.DROP,
                    cityId: e.city_id,
                    countryId: e.country_id,
                    serviceCount: e.count
                });

                city_markers.push(marker);

                if (center_city) {
                    map.setZoom(9);
                    map.setCenter(marker.getPosition());
                } else {
                    map.setZoom(4);
                }

                google.maps.event.addListener(marker, 'click', function () {
                    var cityId = this.cityId;
                    var countryId = this.countryId;
                    $(countrySelector).val(countryId).trigger('refresh');
                    $(citySelector).val(cityId).trigger('refresh');
                    getCountryCity(countryId);

                    setTimeout(function () {
                        $(citySelector).val(cityId).trigger('refresh');
                        getItems();
                    }, 1000);
                    // map.setZoom(9);
                    map.setCenter(this.getPosition());
                });
            });

            markerCluster = new MarkerClusterer(map, city_markers, {
                imagePath: '/libs/js-marker-clusterer/images/m',
                // imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
                maxZoom: 12
            });

            markerCluster.setCalculator(function(markers, numStyles) {
                var index = 0,
                    count = markers.reduce(function(sum, marker) {
                        return sum + marker.serviceCount;
                    }, 0),
                    total = count;

                while (total !== 0) {
                    total = parseInt(total / 5, 10);
                    index++;
                }

                index = Math.min(index, numStyles);

                return {
                    text: count,
                    index: index
                };
            });
        }
    })
}


function addCityMarkers(center_city) {
    clearMarkers();
    var form_data = $('#search-form').serialize();
    $.get(get_marker_url, form_data, function (res) {
        if (res && map_init) {
            $.each(res, function (i, e) {

                var image = {
                    url: '/libs/js-marker-clusterer/images/marker1.png',
                    // size: new google.maps.Size(32, 32),
                    origin: new google.maps.Point(0, 0)
                };

                var marker = new google.maps.Marker({
                    position: {lat: parseFloat(e.coords[0]), lng: parseFloat(e.coords[1])},
                    map: map,
                    label: String(e.count),
                    icon: image,
                    // animation: google.maps.Animation.DROP,
                    cityId: e.city_id,
                    countryId: e.country_id,
                    serviceCount: e.count
                });

                city_markers.push(marker);

                if (center_city) {
                    map.setZoom(9);
                    map.setCenter(marker.getPosition());
                } else {
                    map.setZoom(4);
                }

                google.maps.event.addListener(marker, 'click', function () {
                    var cityId = this.cityId;
                    // getCountryCity(this.countryId);
                    // $(countrySelector).val(this.countryId).trigger('refresh');
                    $(citySelector).val(cityId).trigger('refresh');


                    // setTimeout(function () {
                    //     $(citySelector).val(cityId).trigger('refresh');
                    // }, 500);

                    map.setZoom(9);
                    map.setCenter(this.getPosition());
                    //
                    // setTimeout(function () {
                    getItems();
                    // }, 500);
                });


            });

            markerCluster = new MarkerClusterer(map, city_markers, {
                imagePath: '/libs/js-marker-clusterer/images/m',
                // imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
                maxZoom: 12
            });

            markerCluster.setCalculator(function(markers, numStyles) {
                var index = 0,
                    count = markers.reduce(function(sum, marker) {
                        return sum + marker.serviceCount;
                    }, 0),
                    total = count;

                while (total !== 0) {
                    total = parseInt(total / 5, 10);
                    index++;
                }

                index = Math.min(index, numStyles);

                return {
                    text: count,
                    index: index
                };
            });
        }
    })
}

function clearMarkers() {
    // for (var i = 0; i < country_markers.length; i++) {
    //     country_markers[i].setMap(null);
    //     markerCluster.remove(country_markers[i]);
    // }
    // country_markers.length = 0;

    for (var i = 0; i < city_markers.length; i++) {
        city_markers[i].setMap(null);
    }
    if(typeof markerCluster.clearMarkers == "function"){
        markerCluster.clearMarkers();
        markerCluster.redraw();
    }


    city_markers.length = 0;
}

function addMarkers() {
    var country = $(countrySelector).val();
    var city = $(citySelector).val();
    if (country) {
        addCityMarkers(false);
        // if (city)
        //     $(citySelector).trigger('change');
    }
    else {
        // addCountryMarkers();
        addAllCityMarkers();
    }
}

function getCountryCity(countryId) {
    $(citySelector).html('');
    $.get(get_city_url, {country: countryId}, function (res) {
        if (res) {

            $.each(res, function (i, e) {
                var html = '<option value="' + i + '">' + e + '</option>';
                $(citySelector).append(html);
                $(citySelector).trigger('refresh');
            });
        }
    });

}

function geocode(address, zoom) {
    var url = 'https://maps.googleapis.com/maps/api/geocode/json';
    var key = 'AIzaSyAd-xU32Xabya3UlmfnanpKKv6XdTXU3d0';

    $.get(url, {address: address, key: key}, function (res) {
        if (res.status == 'OK') {
            var coords = res.results[0].geometry.location;
            if (map_init) {
                map.setCenter(coords);
                map.setZoom(zoom);
            }
        }

    });
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: uluru
    });
    map_init = true;

    var countryId = $(countrySelector).val();
    var city_id = $(citySelector).val();
    var country = $("option:selected", $(countrySelector)).text();

    if (city_id) {
        var city = $("option:selected", $(citySelector)).text();
        if (map_isset) {
            geocode(country + ', ' + city, 9);
        }

        setTimeout(function () {
            getItems();
        }, 500);
    }
    else if (countryId) {
        if (countryId != '' && countryId > 0) {
            geocode(country, 4);
            clearMarkers();
            // addCityMarkers(false);
            // addAllCityMarkers();

        } else {
            // addCountryMarkers();
            // map.setZoom(3),
            //     map.setCenter(uluru);
        }
        addAllCityMarkers();

        setTimeout(function () {
            getItems();
        }, 500);
    }

}

function getItems() {
    var data = $('#search-form').serialize();
    var url = $('.search_result').data('url');
    history.pushState({}, "", url + '?' + data);
    $('#pager').html('');
    $.get(show_more_url, data, function (res) {
        $('#search-service-result').html(res.html);
        if (res.pager)
            $('#pager').html(res.pager);

        $('.searching_sort_panel_count').html(res.count_title);
        initRate();
    });
}


function updateFilter() {
    $('#pjax').val(1);
    var data = $('#search-form').serialize();
    var url = $('.search_result').data('url');
    history.pushState({}, "", url + '?' + data);

    $.pjax.reload({container: '#search-filter'});

    $('#pjax').val(0);

}



//reviews and rate
$(document).on('click', 'a.show-more-reviews', function () {
    var page = $(this).data('page');
    var pages = $(this).data('pages');
    var service = $(this).data('service');
    var url = $(this).attr('href');

    page++;
    $(this).data('page', page);

    $.get(url, {page: page, service: service}, function (res) {
        $('#reviews-container').append(res);
        initRate();
        if (page >= pages)
            $('a.show-more-reviews').remove();
    });

    return false;

});


function initRate() {
    //init rate widget
    $('div.rating').raty({
        number: 5,
        readOnly: true,
        score: function () {
            return $(this).attr('data-rate');
        },
        starOff: '/img/icon/star_off.svg',
        starOn: '/img/icon/star_on.svg',
        starHalf: '/img/icon/star_on.svg'

    });
}

$(document).ready(function () {
    initRate();
    $('div.rating-input').raty({
        number: 5,
        starOff: '/img/icon/star_off.svg',
        starOn: '/img/icon/star_on.svg',
        starHalf: '/img/icon/star_on.svg',
        target: '#hint',
        targetType: 'score',
        targetKeep: true,
        targetScore: '#hint'
    });

    $('div.filter-rating-input').raty({
        number: 5,
        starOff: '/img/icon/star_off.svg',
        starOn: '/img/icon/star_on.svg',
        starHalf: '/img/icon/star_on.svg',
        // target: '#service-rate',
        targetType: 'score',
        targetKeep: false,
        targetScore: '#service-rate',
        click: function (e) {
            $('#service-rate').val(e);
            filtering();
        }
    });
    $('.searching_rating_reset').on('click', function() {
        $('#service-rate').val('');
        $('.filter-rating-input img').attr('src', '/img/icon/star_off.svg');
        filtering();
    });
    $('.related_slider').slick({
        infinite: true,
        dots: true,
        arrows: false,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 1281,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 671,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            },
        ]
    });

});

$(window).on('load resize', function() {
    $('.slick-dots li').width($('.slick-dots').width() / $('.slick-dots li').length);
    // $('.slick-dots li').width($('.slick-dots').width() / $('.slick-dots li').length - ($('.slick-dots').width() * 0.03));
});



//show-hide password
$(document).on('click', 'a.show-pass', function () {
    var form = $(this).parents('form');
    var pass_hide = $('input[type="password"]', form).length;
    if (pass_hide) {
        $('input.pass', form).attr('type', 'text');
    } else
        $('input.pass', form).attr('type', 'password');

    return false;
});

$('#map_button, .searching_map_display').on('click', function () {
    if ($('.searching_map_display').is(':visible')){
    $('.searching_map_display').fadeOut();
    $('.searching_map_container').addClass('map_on');
    $('.searching_map_button img').addClass('map_button_invert');
    } else {
    $('.searching_map_display').fadeIn();
    $('.searching_map_container').removeClass('map_on');
    $('.searching_map_button img').removeClass('map_button_invert');
    }
});


