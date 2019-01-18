$(document).ready(function () {
    $('.searching_filter_toggle').on('click', function(e) {
        $(this).fadeOut('fast');
        $('.menu_search_toggle').fadeIn('fast');
    })

    $('.filter_hide').on('click', function(e) {
        $('.menu_search_toggle').fadeOut('fast');
        $('.searching_filter_toggle').fadeIn('fast');
    })

    $('.searching_sort_panel_item').on('click', function(e) {
        var $this = $(this);
        if ($this.hasClass('active')) return true;
        if ($this.hasClass('searching_sort_panel_block')){
            $this.addClass('active').removeClass('deactive');
            $('.searching_sort_panel_list').removeClass('active').addClass('deactive');
            searchingMakeBlocks();
        }else{
            $this.addClass('active').removeClass('deactive');
            $('.searching_sort_panel_block').removeClass('active').addClass('deactive');
            searchingMakeList();
        }
    })
    function searchingMakeBlocks() {
        $('#search-service-result>div').addClass('searching-lg-4 searching-md-6 searching-xs-12 text-center').removeClass('searching_list');
        $('.last_added').removeClass('line');
    }
    function searchingMakeList() {
        $('#search-service-result>div').removeClass('searching-lg-4 searching-md-6 searching-xs-12 text-center').addClass('searching_list');
        $('.last_added').addClass('line');
    }
});