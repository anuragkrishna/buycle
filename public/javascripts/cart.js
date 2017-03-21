$(function() {
    $('.delete').click(function(event) {
        event.preventDefault();
        var id = $(this).parent().parent().prop('id');
        $.ajax({
            url: 'https://krishtest:3000/remove/' + id,
            contentType: 'application/json; charset=UTF-8',
            type: 'GET',
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
            url: 'https://krishtest:3000/add-to-cart/' + id,
            contentType: 'application/json; charset=UTF-8',
            type: 'GET',
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                var dataOj = $.parseJSON(data);
                $('.cart-qty').html(dataOj.cartQty);
            }
        });
    });
});
