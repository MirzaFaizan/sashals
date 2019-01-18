    /* Counterparty verification: BEGIN */

    var CounterpartyVerificationController = (function () {

        var lang                    = $('#page_lang').val();
        var contragentLabels        = $('.verification_service .verification_label ');
      //  var contragentDesc        = $('.contragent_desc');
        var contragentDesc          = $('.verification_service_info_description');
        var verificationSectionbuy  = $('.verification_service_info_buy');
        var verificationMarks       = $('.verification_service_info_buy_item_line_block_mark');
        var dataDefault             = $('.verification_data_default');
        var contragentInfo          = $('#contragent_info');
        var preloader               = $('.verification_layer');

        var selectContragentById = function(contragentId) {
            contragentLabels.each(function( index ) {
                if ($( this ).data('contragent_id') == contragentId) {
                    activateLabel($( this ));
                }
            });
        };
        
        var detectLang = function (lang) {
            switch (lang) {
                case 'ru-RU':
                    return 'ru';
                    break;
                case 'zh-CN':
                    return 'zh';
                    break;
                case 'en-GB':
                    return 'en';
                    break;
            }

        }

        var showLabelContragentById = function (contragentId) {
            contragentLabels.each(function( index ) {
                if ($( this ).data('contragent_id') == contragentId) {

                    // show label contragent
                    $( this ).css('display', 'table-cell');
                }
            });

        }

        $('.check_contragent_info').click(function (e) {
            e.preventDefault();

            var data = $('#verification_form').serialize();

            var cuid = $('#contragentcheckform-cid').val();

            var host = location.host;
            var url = '//' + host + '/' + detectLang(lang) + '/site/get-contragent-info?' + data;

            preloader.show();

            ajax(url, function (data) {
                contragentInfo.html(data);
                dataDefault.hide();
                preloader.hide();
            });
        });

        var getAvailibleContragents = function (country_id) {
            var host = location.host;
            var url = '//' + host + '/ru/site/get-available-contragent-by-country-id?country_id=' + country_id;
            ajax(url, function (data) {

                try {
                    var data = JSON.parse(data);
                    if (data['success'] != undefined && data['success'] == true) {

                        //reset label of contragents
                        contragentLabels.css('display', 'none');

                        for (i = 0; i < data['data'].length; i++) {
                            var contragentId = data['data'][i];
                            showLabelContragentById(contragentId);

                            // activate first lable cintragent
                            if (i == 0) {
                                selectContragentById(contragentId);
                            }
                        }

                    }

                    var countryId = $( "select" ).val();

                    if (data['success'] == false && countryId) {
                        $('.verification_contragent_not_found').css('display', 'block');
                    }

                } catch (e) {
                    console.log(e);
                }
            });

        };

        // activate labale contragent
        var activateLabel = function(label) {
            contragentLabels.removeClass('active');
            label.addClass('active');

            dataDefault.show();
            contragentInfo.html('');

            var contragent_id = label.data('contragent_id');

            // reset and activate contragent descriptions
            contragentDesc.css("display" , "none");
            $.each(contragentDesc, function( index ) {
                if ($( this ).data('contragent_id') == contragent_id) {
                    $( this ).fadeIn();
                }
            })

            // reset and activate section buy contragent
            verificationSectionbuy.css("display" , "none");
            $.each(verificationSectionbuy, function( index ) {

                if ($( this ).data('contragent_id') == contragent_id) {
                    $( this ).fadeIn();
                }
            })

            // select contragent radio button
            var radio_btns = $('#contragents_checklist').find('[type=radio]');
            $.each(radio_btns, function( index, radioInput ) {
                if (radioInput.value == contragent_id) {
                    radioInput.checked = true;
                }
            });
        };

        var toggleMark = function(mark) {

            var contragentId = mark.data('contragent_id');

            mark.toggleClass( "open" );

            if (mark.hasClass( "free" )) {

                // var blockFree = $('.verification_service_info_buy_item_enumeration.free');
                // if ( blockFree.data('contragent_id') == contragentId) {
                //     blockFree.toggle(400);
                // }
            }

            if (mark.hasClass( "paid" )) {
                // var blockFPaid = $('.verification_service_info_buy_item_enumeration.paid');
                // if ( blockFPaid.data('contragent_id') == contragentId) {
                //     blockFPaid.toggle(400);
                // }
            }
        };

        /**
         * Counterparty verification
         * make checked label contragent after click
         */
        contragentLabels.click(function(e) {
            e.preventDefault();
            activateLabel($(this));
        });

        verificationMarks.click(function (e) {
            toggleMark($(this));
        });

        var resetContragents = function () {
          //  $('.verification_service').css('visibility', 'visible');
          //  $('.verification_data').css('visibility', 'hidden');
            contragentLabels.css('display', 'block');
            dataDefault.show();
            $('.verification_service_info_description').css('display', 'none');
            $('.verification_service_info_description_2').css('display', 'none');
            $('.verification_service_info_buy').css('display', 'none');
            contragentInfo.html('');
            $('.verification_contragent_not_found').css('display', 'none');
        }

        return {
            selectContragentById: function (contragentId) {
                return selectContragentById(contragentId);
            },
            getAvailibleContragents : function (countryId) {
                return getAvailibleContragents(countryId);
            },
            resetContragents : function () {
                return resetContragents();
            },
        };
    })();

    /* Counterparty verification: END */

    // company info
    $("body").on("touchstart", ".company-info__statistics-field", function() {
        let $details = $(this).find(".company-info__statistics-field-details");

        $('.company-info__statistics-field').removeClass("company-info__statistics-field--opened");
        $('.company-info__statistics-field').find(".company-info__statistics-field-details").fadeOut(200);

        if ($details.is(":visible")) {
            $(this).removeClass("company-info__statistics-field--opened");
            $details.fadeOut(200);
        } else {
            $(this).addClass("company-info__statistics-field--opened");
            $details.fadeIn(200);
        }
    });
