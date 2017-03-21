$(function() {
    $('.delete').click(function(event) {
        event.preventDefault();
        var id = $(this).parent().parent().prop('id');
        $.ajax({
            url: 'https://buycle.herokuapp.com/remove/' + id,
            contentType: 'application/json; charset=UTF-8',
            type: 'GET',
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                var dataOj = $.parseJSON(data);
                $('#total-price').html("Total: Rs. " + dataOj.total);
                $('.cart-qty').html(dataOj.qty);
                $('#' + id).remove();
                if ($('.cart-items tr').length === 1) {
                    $('.cart-panel').html('<h2>Your Cart is Empty.</h2>');
                }

            }
        });
    });

    $('.add-cart').click(function(event) {
        event.preventDefault();
        var id = $(this).attr('data-id');
        $.ajax({
            url: 'https://buycle.herokuapp.com/add-to-cart/' + id,
            contentType: 'application/json; charset=UTF-8',
            type: 'GET',
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                var dataOj = $.parseJSON(data);
                console.log(dataOj);
                $('.cart-qty').html(dataOj.cartQty);
            }
        });
    });
});
