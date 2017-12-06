function showMessage(year) {
    $("#messages").empty();
    const str = "Happy New Year " + year; // TODO fetch from the server
    const spans = '<span>' + str.split(/\s+/).join(' </span><span>') + '</span>';
    $(spans).hide().appendTo('#messages').each(function(i) {
        $(this).delay(400 * i).fadeIn(1000);
    });
}
