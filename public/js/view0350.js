$(document).ready(function(){



    availableCategories = [];
    $('.category_3rd_dot').each(function( index ) {
        if ($( this ).text().toLowerCase()!=$('.drugoe').text().toLowerCase()){
            availableCategories.push({label:$( this ).text(),labelLow:$( this ).text().toLowerCase(), ids:$(this).data( "id" )})
        }
    });

    $( '#category-warp').autocomplete({source: availableCategories,  select: function(event, ui) {
            categoryClickBait(null, ui.item.value);
        }});


    $( '#category-warp').on("change paste keyup", function() {
        categoryClickBait(this);
        return false;
    });

    $( '#servicelanguagetranslate-type_of_service').on("keyup", function() {
        var result = $(this).val().toLowerCase();
        var res = result.split(" ");
        if (res.length > 0) {
            $('.category_3rd_possibility').empty();
            $('.category_3rd_possibility').hide();
            $('.category_3rd_possibility_label').hide();
            $.each(res, function( index, value ) {
                if (value.length > 3) {
                    $.each(availableCategories, function( index2, value2 ) {
                        if (value2['labelLow'].indexOf(value) != -1){
                            var index_aproof = 0;
                            $.each($('.category_3rd_possibility div'), function( index, value ) {
                                if ($(this).text() == value2['label']) { index_aproof = 1; }
                            });

                            if (index_aproof == 0 ){
                                $('.category_3rd_possibility').show();
                                $('.category_3rd_possibility_label').show();
                                $('.category_3rd_possibility').append('<div>'+value2['label']+'</div>')
                            }
                        }
                    });
                }
            });

        }
        return false;
    });

    $('.category_3rd_possibility').on('click', 'div', function() {
        categoryClickBait(null, $(this).text());
        $('.category_3rd_possibility').empty();
        $('.category_3rd_possibility').hide();
        $('.category_3rd_possibility_label').hide();
    });


    function  categoryClickBait(view, text) {
        var inputData;
        if (view==null) {var inputData=text} else {inputData = $(view).val();}

        $.each(availableCategories, function( key, value ) {
            if (value['label'] == inputData) {
                $('.category_3rd_dot').removeClass('category_3rd_grade');
                $('.category_3rd_dot[data-id ='+value['ids']+']').addClass('category_3rd_grade');
                $('#service-field_of_activity_id').val(value['ids']);
                $('.category_3rd_title,.category_3rd_title2').next('ul').hide('slow');
                $('.category_3rd_title,.category_3rd_title2').removeClass('category_3rd_extend');
                $('.category_3rd_title,.category_3rd_title2').find('i').removeClass('category_3rd_revert');
                $('.category_3rd_label_1').hide('fast');
                $('.category_3rd_label_2').show('fast');
                $('.category_3rd_chosen').find('span').empty();
                $('.category_3rd_chosen').find('span').append(value['label']);
                $('.category_3rd_chosen').show('fast');
                return false;
            }
        });
    }

    $("#service_popup_edit_form button.submit").on("click", function() {
        var form = $("#service_popup_edit_form");
        var error_summary_container = form.find('.error_summary_container');
        var url = form.attr("action");
        var formData = new FormData(form[0]);      // Для отправки файлов

        $.ajax({
            type: "POST",
            processData: false,
            contentType: false,
            url: url,
            dataType: "json",
            data:  formData,
            success: function(response) {
                if (response.result != undefined && response.result == "OK") {
                    window.location.reload(true);
                } else if (response.result != undefined && response.result == "ERROR_SUMMARY") {
                    error_summary_container.html(response.errors);
                } else if (response.message != undefined) {
                    error_summary_container.empty();
                    alert(response.message);
                }
            }
        })
    });
    $('.category_3rd_title,.category_3rd_title2').on('click', function() {

        if($(this).hasClass("category_3rd_extend")){
            $(this).removeClass('category_3rd_extend');
            $(this).next('ul').fadeOut('fast');
            $(this).find('i').removeClass('category_3rd_revert');
        } else {
            $(this).addClass('category_3rd_extend');
            $(this).next('ul').fadeIn('slow');
            $(this).find('i').addClass('category_3rd_revert');
        }

        return false;
    });

    $('.category_3rd_dot').on('click', function() {

        $('.category_3rd_dot').removeClass('category_3rd_grade');
        $(this).addClass('category_3rd_grade');
        $('#service-field_of_activity_id').val($(this).data( "id" ));
        $('.category_3rd_title,.category_3rd_title2').next('ul').hide('slow');
        $('.category_3rd_title,.category_3rd_title2').removeClass('category_3rd_extend');
        $('.category_3rd_title,.category_3rd_title2').find('i').removeClass('category_3rd_revert');
        $('.category_3rd_label_1').hide('fast');
        $('.category_3rd_label_2').show('fast');
        $('.category_3rd_chosen').find('span').empty();
        $('.category_3rd_chosen').find('span').append($(this).text());
        $('.category_3rd_chosen').show('fast');
        return false;
    });


    $(function() {
        var category_3rd = $('#service-field_of_activity_id').val();
        $('[data-id='+category_3rd+']').addClass('category_3rd_grade');
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
    initRate();



    $(document).on('click', '.add-review', function () {
        addReview();
        return false;
    });
    $(document).on('click', '.cancel_btn', function () {
        $('#overlay').trigger('click');
        return false;
    });


    $('#review-form').on('beforeSubmit', function () {
        addReview();
        return false;
    });

    function addReview() {
        var data = $('#review-form').serialize();
        var error_summary_container = $('#review-form .error_summary_container');

        $.post($('#review-form').attr('action'), data, function (res) {
            if (res == 'success') {
                $('#overlay').trigger('click');
                window.location.reload();
            } else {
                var err_mess = "";
                $.each(res, function (i, e) {
                    $('#' + i).addClass('error');
                    err_mess += res[i].join(', ');
                });

                error_summary_container.html(err_mess);
            }
        });
    }


});

