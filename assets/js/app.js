// author: chaitanyachavali
// web: http://chaitanyachavali.com

$(document).ready(function() {
    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
        $("#left").toggle();
        $("#right").toggle();
    });
    $("#left").toggle();
    $("#right, #left").on('click', function() {
        $("#sidebarCollapse").trigger('click');
    });
});

