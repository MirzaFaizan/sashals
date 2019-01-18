var workCountrySelector = '#work_country_list';
var workCitySelector = '#work_city_list';
var workFormSelector = '#work-search-form';
var workMap;
var map_init = false;
var markers = [];
var workMarkerCluster = [];

var uluru = {lat: 56.009657, lng: 37.9456611};

$(document).on('change', '#work_country_list, #work_city_list, #worksearch-price_from, #worksearch-price_to, #currency_list, #worksearch-date_type input, #worksearch-from_date, #worksearch-to_date', function (e) {
    getWorkItems();
    if(map_init)
        getWorkMarkers();
});


function catalogListenerOn() {
    $(document).on('change.catalogMode', '#work-search-form input[type="checkbox"]', function () {
        getWorkItems();
        if(map_init)
            getWorkMarkers();
    });
}
function catalogListenerOff() {
    $(document).off('change.catalogMode', '#work-search-form input[type="checkbox"]');
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
    getWorkItems();
    if(map_init)
    getWorkMarkers();
});



$(document).on('change', workCountrySelector, function (e) {
    e.preventDefault();
    var country = $("option:selected", $(this)).text();
    var countryId = $(this).val();
    $('#search_page').val(1);

    if (countryId != '' && countryId > 0) {
        getCityByCountry(countryId);
    } else {

    }
});

function getCityByCountry(countryId) {
    $(workCitySelector).html('');
    $.get(get_city_url, {country: countryId}, function (res) {
        if (res) {
            var html = '';
            $.each(res, function (i, e) {
                html += '<option value="' + i + '">' + e + '</option>';
            });
            $(workCitySelector).html(html);
            $(workCitySelector).trigger('refresh');
        }
    });
}


function getWorkItems() {
    var data = $('#work-search-form').serialize();
    var url = $(workFormSelector).attr('action');
    history.pushState({}, "", url + '?' + data);
    $('#pager').hide();
    $.get(show_more_url, data, function (res) {
        $('.work_items').html(res.html);
        $('.more_work_link').attr('data-pages',res.pages);
        $('.more_work_link').attr('data-page','1');
        console.log(res.pages);
        if (res.pages != null)
            $('#pager').show();
        $('.searching_sort_panel_count').html(res.count_title);
        initRate();
    });
}

function initWorkMap() {
    workMap = new google.maps.Map(document.getElementById('work-map'), {
        zoom: 3,
        center: uluru
    });
    map_init = true;
}

function getWorkMarkers() {
    clearWorkMarkers();
    var form_data = $('#work-search-form').serialize();
    $.get(WORK_SEARCH_URL, form_data, function (res) {
        $.each(res, function (i, e) {
            var image = {
                url: '/libs/js-marker-clusterer/images/marker1.png',
                origin: new google.maps.Point(0, 0)
            };
            var marker = new google.maps.Marker({
                position: {lat: parseFloat(e.coords[0]), lng: parseFloat(e.coords[1])},
                map: workMap,
                label: String(e.count),
                icon: image,
                cityId: e.city_id,
                countryId: e.country_id,
                serviceCount: e.count
            });
            markers.push(marker);

            google.maps.event.addListener(marker, 'click', function () {
                var cityId = this.cityId;
                var countryId = this.countryId;
                $(workCountrySelector).val(countryId).trigger('refresh');
                $(workCitySelector).val(cityId).trigger('refresh');
                getCityByCountry(countryId);

                setTimeout(function () {
                    $(workCitySelector).val(cityId).trigger('refresh');
                    getWorkItems();
                }, 300);
                map.setCenter(this.getPosition());
            });
        });

        workMarkerCluster = new MarkerClusterer(workMap, markers, {
            imagePath: '/libs/js-marker-clusterer/images/m',
            maxZoom: 12
        });

        workMarkerCluster.setCalculator(function (markers, numStyles) {
            var index = 0,
                count = markers.reduce(function (sum, marker) {
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
    });
}

function clearWorkMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    if (typeof workMarkerCluster.clearMarkers == "function") {
        workMarkerCluster.clearMarkers();
        workMarkerCluster.redraw();
    }
    markers.length = 0;
}

function mainFunction(){

}

$(document).ready(function () {
    initWorkMap();
    getWorkMarkers();
    mainFunction();
    catalogListenerOn();
});


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

