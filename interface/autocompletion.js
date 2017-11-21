
$('input#country').typeahead({
    source:  function (query, process) {
        return process($.parseJSON(`["Australia", "America"]`));
        /*
        const url = "https://www....." + query; // CHANGE THAT
        return $.get(url, { query: query }, function (data) {
            data = $.parseJSON(data);
            return process(data);
        });
        */
    }
});
