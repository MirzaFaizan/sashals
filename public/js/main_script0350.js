$(document).ready(function () {
    var authToken = $(".chat-status").data("auth-token");
    var userID = $(".chat-status").data("userid");

    if (authToken) {
        updateUnreadMessagesStatus();
        setInterval(function () {
            updateUnreadMessagesStatus();
        }, 5000);
    }


    //feedback

    $('#feedback_form').on('beforeSubmit', function () {
        $('input', $(this)).removeClass('error');
        addFeedback();
        return false;
    });

    function addFeedback() {
        var data = $('#feedback_form').serialize();

        $.post($('#feedback_form').attr('action'), data, function (res) {
            if (res == 'success') {
                alert(window.alert_sended);
                window.location.reload();
            } else {
                $.each(res, function (i, e) {
                    $('#' + i).addClass('error');
                })
            }
        });
    }

    function updateUnreadMessagesStatus() {
        $.ajax({
            url: "https://chat.bankofpartners.com/unread-messages?userID=" + userID,
            method: "GET",
            headers: { "auth-token": authToken },

            success: function(result) {
                if (result.unreadMessagesCount === 0) {
                    $(".chat-status .unread-messages-count").addClass("empty").text("");
                    return;
                }
    
                $(".chat-status .unread-messages-count").removeClass("empty").text(result.unreadMessagesCount);
            }
        });
    }

    $(document).on("click", ".favorite-button", function() {
        var $favoriteButton = $(this);

        $.get($favoriteButton.data("url"), function() {
            if ($favoriteButton.hasClass("favorite-button--active")) {
                $favoriteButton.removeClass("favorite-button--active");
                return;
            }

            $favoriteButton.addClass("favorite-button--active");
        });
    });

    if ($.fn.modal) {
        $.fn.modal.Constructor.prototype.enforceFocus = function () {
        };
    }

    $(document).on('click', '.search_toggle_button', function() {
        var container = $(this).parents('.aside_menu_search');
        var content = container.find('.filter_aside_menu');

        if (content.is(':visible')) {
            content.slideUp(200);
        } else {
            content.slideDown(200);
        }
    });

    $('.aside_menu .popup_open').click(function() {
        $('.aside_menu .aside_close_button').click();
    });

    $('.menu_filter_link').on('click', function(e) {
        var menuContainer = $(this).closest('body').find('.aside_menu');
        var overlay = $(this).closest('body').find('.aside_menu_overlay');

        menuContainer.toggleClass('show');

        if (menuContainer.hasClass('show')) {
            overlay.css('display', 'block').animate({'opacity': 1}, 500);
        } else {
            overlay.animate({'opacity': 0}, 500, function() {
                $(this).css('display', 'none');
            });
        }

        overlay.on('click', function (e) {
            menuContainer.removeClass('show');
            $(this).animate({'opacity': 0}, 500, function () {
                $(this).css('display', 'none');
            });
        });
    });

    $('.aside_menu .aside_close_button').on('click', function() {
        var overlay = $(this).closest('body').find('.aside_menu_overlay');

        $('.aside_menu').toggleClass('show');

        overlay.animate({'opacity': 0}, 500, function() {
            $(this).css('display', 'none');
        });
    });

    $('.social_item').on('click', function (e) {
        e.preventDefault();
        var type = $(this).data('type');
        var userAttribute = $(this).data('user_attribute');

        var $socialItem = $('<div />').addClass('input_wrap social');
        var $socialIcon = $('<i />').addClass('icon icon_' + type + '_social');
        var $socialLabel = $('<label />').attr('for', '#').text(getSocialLabelText(type));
        var $socialInput = $('<input />').attr('type', 'text').attr('name', 'User[' + userAttribute + '][]');

        var $removeLink = $('<a />').addClass('remove').attr('href', '#');
        var $removeLinkIcon = $('<i />').addClass('icon icon_delete');

        $removeLink
            .append($removeLinkIcon);

        $socialItem
            .append($socialIcon)
            .append($socialLabel)
            .append($socialInput)
            .append($removeLink);

        var $container = $('.social_items');
        $container
            .append($socialItem);

        $socialInput.focus();
    });

    $(document).on('click', '.input_wrap.social .remove .icon', function (e) {
        e.preventDefault();

        var $container = $(this).parents('.social');

        $container.remove();
    });

    function getSocialLabelText(type) {
        switch (type) {
            case 'skype':
                return 'Skype';
            case 'chat':
                return 'WeChat';
            case 'vk':
                return 'VK';
            case 'fb':
                return 'Facebook';
            case 'gplus':
                return 'Google Plus';
            default:
                return '';
        }
    }

    //// Lang Switch
    //$('.lang_select a').on('click', function (e) {
    //    e.preventDefault();
    //
    //    $(this).addClass('active').siblings().removeClass('active');
    //});
    //// End Lang Switch

    // Remove Hash Tag
    $(document).on('click', '.hashtag_wrap .hashtag a', function (e) {
        e.preventDefault();

        $(this).closest('.hashtag').remove();
    });
    // End Remove Hash Tag

    // Change Link Icon
    $('.addr_link_wrap .addr_link').on('click', function (e) {
        e.preventDefault();

        var container = $(this);
        var input = container.find('input').val();

        if (input.length > 1) {
            container.find('i.icon_link').addClass('icon_link').removeClass('icon_link_blue');
        } else {
            container.find('i.icon_link').addClass('icon_link_blue').removeClass('icon_link');
        }
    });
    // End Change Link Icon

    //////////////////////////////////////////////////////////////////////////////////////////////
    //                      Код вынесен в виджет frontend/widget/ServiceLink
    //// create link
    //$('.add_link_wrap').on('click', function(e) {
    //    e.preventDefault();
    //
    //    var $linksContainer = $(this).parents('.form_edite_wrap').find('.addr_link_wrap');
    //
    //    var $newLinkContainer = $('<div class="addr_link">\
    //					           <i class="icon icon_link_blue"></i>\
    //					           <input type="text" name="Links[]">\
    //					           <a href="#">\
    //						           <i class="icon icon_delete"></i>\
    //					           </a>\
    //				           </div>')
    //
    //    $linksContainer.append($newLinkContainer);
    //    $newLinkContainer.find('input[type=text]').focus();
    //});
    //////////////////////////////////////////////////////////////////////////////////////////////

    // Create Lang
    //$('.add_lang_wrap').on('click', function (e) {
    //    e.preventDefault();
    //
    //    var $this = $(this);
    //    var container = $this.closest('.form_profile_edite').find('.language');
    //
    //    container.append('<div class="language_wrap">\
    //					<img src="img/flag/flag_russia.svg" alt="flag">\
    //					<input type="text"/>\
    //					<a href="#">\
    //						<i class="icon icon_delete"></i>\
    //					</a>\
    //				</div>');
    //
    //});
    // End Create Lang

    // Remove Link
    $(document).on('click', '.language_wrap a', function (e) {
        e.preventDefault();

        $(this).closest('.language_wrap').remove();
    });

    // End Remove Link

    // Remove Lang
    $(document).on('click', '.addr_link_wrap .addr_link a, .view_link_delete_icon', function (e) {
        e.preventDefault();

        $(this).parents('.addr_link').remove();
    });
    // End Remove Lang

    // Remove Cat
    $('.cat_delete_link').on('click', function (e) {
        e.preventDefault();

        $(this).closest('.item_category').remove();
    });
    // End Remove Cat

    // Remove Skill
    $('.skill a').on('click', function (e) {
        e.preventDefault();

        $(this).closest('.skill').remove();
    });
    // End Remove Skill

    // Toggle Category Filter
    $('.item_title').on('click', function (e) {
        var $this = $(this);
        var catList = $this.next('.item_list');
        var iconChange = $this.find('i');
        var target = $(e.target);

        if (target.is('.searching_checkbox_relative')) {

       /*    target.toggleClass('checked');

           catList.find('.jq-checkbox').trigger('click');


            if (catList.is(':hidden')) {
                catList.toggle(300);
                if (catList.is(':visible')) {
                    iconChange.toggleClass('icon_cat_arr_up');
                }
            }

*/

        } else {


            var catList = $this.next('.item_list');
            var iconChange = $this.find('i');

            catList.toggle(300);

            if (catList.is(':visible')) {
                iconChange.toggleClass('icon_cat_arr_up');
            }
        }
    });
    // End Toggle Category Filter

    // Toggle legal documents
    $('.links_container .legal-documents').on('click', function(e) {
        var documentsContainer = $(this).next('.legal-documents__documents-container');
        var toggleIcon = $(this).find('.icon');

        documentsContainer.toggle(300);

        if (documentsContainer.is(':visible'))
            toggleIcon.toggleClass('icon_cat_arr_up');

    })
    // End toggle legal documents

    //FAQ Toggle
    $('.faq_title').on('click', function (e) {



        var $this = $(this);
        var container = $this.closest('.faq_item');
        var faqDescr = container.find('.faq_descr');
        var iconChange = $this.find('i');


        faqDescr.toggle(300);

        if (faqDescr.is(':visible')) {
            iconChange.toggleClass('icon_arrow_up');
        }

    });
    //End FAQ Toggle

    // Slider_func
    $('.slider_controls_btn').on('click', function (e) {
        e.preventDefault();
        var $this = $(this);
        var container = $this.closest('.slider');
        var list = container.find('.slider_list');
        var items = container.find('.slider_item');
        var activeSlide = items.filter('.active');
        var nextSlide = activeSlide.next();
        var prevSlide = activeSlide.prev();
        var firstSlide = items.first();
        var lastSlide = items.last();
        var sliderOffset = container.offset().left;
        var reqPos = 0;

        if ($(this).hasClass('slider_controls_next')) {

            if (nextSlide.length) {
                findReqPos(nextSlide);
                addActiveClass(nextSlide);
            } else {
                findReqPos(firstSlide);
                addActiveClass(firstSlide);
            }

        } else if ($(this).hasClass('slider_controls_prev')) {

            if (prevSlide.length) {
                findReqPos(prevSlide);
                addActiveClass(prevSlide);
            } else {
                findReqPos(lastSlide);
                addActiveClass(lastSlide);
            }

        }

        list.css('left', '-=' + reqPos + 'px')

        function addActiveClass(reqSlide) {
            reqSlide.addClass('active').siblings().removeClass('active');
        }

        function findReqPos(slide) {
            reqPos = slide.offset().left - sliderOffset;
        }

    });
    // end of slider_func

    //Popup
    var popupOverlay = $('#overlay');

    $(document).on('click', '.popup_open', function (e) {
        if (!$(this).hasClass('disable-body-overflow')) {
            $('body').css({
                overflow: "hidden",
                position: "fixed"
            });
        }

        e.preventDefault();


        var currentPopup = $(this).closest('.popup');
        if (!!currentPopup && currentPopup.css('display') == 'block') {
            currentPopup.css('display', 'none');
        }

        var div = $(this).attr('href') || $(this).data('mod');
        popupOverlay.fadeIn(400,
            function () {
                $(div)
                    .css('display', 'block');
            });
    });


    $('.menu_filter_link').on('click', function(e) {
        $('body').css('overflow', 'hidden');
    });

    $(document).on('click', '.link_close_popup, #overlay, .aside_menu_overlay, .close_form_edite, .prev_btn, .cancel_btn', function(e) {
        e.preventDefault();

        $('body').css({
            overflow: 'auto',
            position: 'inherit'
        });

        $('.popup').css('display', 'none');
        popupOverlay.fadeOut(400);
    });
    //End Popup

    //Profile and menu social media yandex toggle
    $('.yan-social-button').click(function() {
        $(this).hide();
        $('.yan-social-layer2').fadeIn('slow');
    });

    //Profile and menu social media yandex toggle end

    //Menu Toggle
    $('.account_menu').on('click', function (e) {
        var container = $(this);
        var submenu = container.find('.submenu');

        submenu.slideDown(300);

        submenu.on({
            mouseleave: function () {
                $(this).slideUp(300);
            }
        });
    });
    $('.lang_select').on('click', function(e) {
        var languageMenu = $(this).find('.language-menu');

        languageMenu.slideDown(300);

        languageMenu.on({
            mouseleave: function() {
                $(this).slideUp(300);
            }
        });
    })
    //End Menu Toggle

    $('.how_to_title h3').on('click', function () {
        $('.how_to_title h3').removeClass('selected');
        $(this).addClass('selected');

        var type = $(this).data('type');

        $('.how_to .tabs_content>div').hide();

        $('.how_to .tabs_content .how_to_' + type).show();
    });

    $('#form_profile_edite .show_hide_password').on('click', function () {
        var $container = $(this).parents('.input_wrap');
        var $input = $container.find('input');

        var type = $input.attr('type');

        if (type === 'password') {
            $input.attr('type', 'text');
            $(this).css('opacity', 1);
        } else {
            $input.attr('type', 'password');
            $(this).css('opacity', 0.5);
        }
    });

    //Message
    $('.message_list a').on('click', function (e) {
        var container = $(this).closest('.message_list');
        var $this = $(this);

        $this.addClass('active').siblings().removeClass('active');

    });
    //End Message

    //Map
    $('.look_map_link').on('click', function (e) {
        e.preventDefault();
        var map = $('.map_wrapper');
        var mapLink = $(this);

        if (map.is(":visible")) {
            map.slideUp(500);
            mapLink.find("span").text(mapLink.data("show"));
        } else {
            map.slideDown(500);
            initMap();
            addMarkers();

            mapLink.find("span").text(mapLink.data("hide"));
        }
    });

    $('.roll_up_link').on('click', function (e) {
        e.preventDefault();
        var map = $('.map_wrapper');

        map.slideUp(500);

    });

    $('#requestServiceBtn').click(function() {
        dataLayer.push({'event': 'chat_btn'});
    });


    $(document).click(function(event) {
        var pId = event.target.id;
        if (pId != 'account_menu' && pId != 'account_img_wrap' && pId != 'icon_user' && pId != 'icon_arrow_dow' && pId != 'account_menu_button' ){
            $('.submenu').slideUp(300);

        }
        if (pId != 'header_lang' && pId != 'language-menu' && pId != 'language_name' && pId != 'language_flag'){
            $('.language-menu').slideUp(300);
        }
    });
    $(document).scroll(function(event) {
        if($('.submenu').is(":visible")) {
            $('.submenu').slideUp(300);
        }
        if($('.language-menu').is(":visible")) {
            $('.language-menu').slideUp(300);
        }
    });

    $('.message-editor__send-button').click(function() {
        dataLayer.push({'event': 'SendMessageChat'});
    });

    <!-- Top100 (Kraken) Counter -->

    (function (w, d, c) {
        (w[c] = w[c] || []).push(function() {
            var options = {
                project: 5961479
            };
            try {
                w['t5961479'] = new top100(options);
            } catch(e) { }
        });

        var n = d.getElementsByTagName("script")[0],
            s = d.createElement("script"),
            f = function () { n.parentNode.insertBefore(s, n); };
        s.type = "text/javascript";
        s.async = true;
        s.src =
            (d.location.protocol == "https:" ? "https:" : "http:") +
            "//st.top100.ru/top100/top100.js";

        if (w.opera == "[object Opera]") {
            d.addEventListener("DOMContentLoaded", f, false);
        } else { f(); }
    })(window, document, "_top100q");

    <!-- END Top100 (Kraken) Counter -->

    <!-- Top100 (Kraken) Counter -->
    (function (w, d, c) {
        (w[c] = w[c] || []).push(function() {
            var goals = {
                'goal': 'registration_2'
            };
            var options = {
                project: 5961479,
                custom_vars: goals
            };
            try {
                w['t5961479'] = new top100(options);
            } catch(e) { }
        });

        var n = d.getElementsByTagName("script")[0],
            s = d.createElement("script"),
            f = function () { n.parentNode.insertBefore(s, n); };
        s.type = "text/javascript";
        s.async = true;
        s.src =
            (d.location.protocol == "https:" ? "https:" : "http:") +
            "//st.top100.ru/top100/top100.js";

        if (w.opera == "[object Opera]") {
            d.addEventListener("DOMContentLoaded", f, false);
        } else { f(); }
    })(window, document, "_top100q");
    <!-- END Top100 (Kraken) Counter -->
//Вконтакте
(window.Image ? (new Image()) : document.createElement('img')).src = 'https://vk.com/rtrg?p=VK-RTRG-229856-bFilj';
    //фейсбук
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1820980058207601');
    fbq('track', 'PageView');


    // company info
    $(".company-info__statistics-field").hover(
        function() {
            $(this).addClass("company-info__statistics-field--opened")

            $(this).find(".company-info__statistics-field-details").fadeIn(200);
        },
        function() {
            $(this).removeClass("company-info__statistics-field--opened")

            $(".company-info__statistics-field-details").fadeOut(200);
        }
    );

    $(".company-info__statistics-field").on("touchstart", function() {
        let $details = $(this).find(".company-info__statistics-field-details");

        if ($details.is(":visible")) {
            $(this).removeClass("company-info__statistics-field--opened");
            $details.fadeOut(200);
        } else {
            $(this).addClass("company-info__statistics-field--opened");
            $details.fadeIn(200);
        }
    });

    $(".contractor-check__provider--mobile").click(function(e) {
        e.stopPropagation();
        $(".contractor-check__provider-list").fadeIn(200);
    });

    $(window).click(function() {
        $(".contractor-check__provider-list").fadeOut(200);
    });

    $(".contractor-check__provider-list").click(function(e) {
        e.stopPropagation();
    });

});



/**
 * IE 5.5+, Firefox, Opera, Chrome, Safari XHR object
 *
 * @param string url
 * @param object callback
 * @param mixed data
 * @param null x
 */
function ajax(url, callback, data, x) {
    try {
        x = new(this.XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
        x.open(data ? 'POST' : 'GET', url, 1);
        x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        x.onreadystatechange = function () {
            x.readyState > 3 && callback && callback(x.responseText, x);
        };
        x.send(data)
    } catch (e) {
        window.console && console.log(e);
    }
};

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}