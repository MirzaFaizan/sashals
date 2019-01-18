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






    $('#newservice_step1_form button.btn_submit').on('click', function() {
        var form = $(this).closest('form');
        var error_summary_container = form.find('.error_summary_container');
        var url = form.attr('action');
        var data = form.serialize();

        $.post(url, data, function(response) {
            if (response.result != undefined && response.result == 'OK') {
                error_summary_container.empty();
                $('#newservice_steps a:last').tab('show');
            } else if (response.result != undefined && response.result == 'ERROR_SUMMARY') {
                error_summary_container.html(response.errors);
            } else if (response.message != undefined) {
                error_summary_container.empty();
                alert(response.message);
            }
        });

        return false;
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
        var id = $(this).data( "id" );
        $(this).parents('.cat').find('.category-id').val(id);
        $('.category_3rd_dot').removeClass('category_3rd_grade');
        $(this).addClass('category_3rd_grade');
        // $('#service-field_of_activity_id').val(id);
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


});

