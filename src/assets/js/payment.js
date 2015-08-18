function paymentListener(orderId, baseUrl) {
    setInterval(function () {
        var r = new XMLHttpRequest();
        r.open("POST", baseUrl + '/index.php?wc-api=paymentwall_gateway&action=ajax', true);
        r.onreadystatechange = function () {
            if (r.readyState != 4 || r.status != 200) return;
            if (r.responseText) {
                var data = JSON.parse(r.responseText);
                if (data && data.status == '1') {
                    location.href = data.url;
                }
            }
        };
        var formData = new FormData();
        formData.append('order_id', orderId);
        r.send(formData);
    }, 5000);
}

// Create Brick token key
function brickTokenizeCard() {
    brick.tokenizeCard({
        card_number: jQuery('#card-number').val(),
        card_expiration_month: jQuery('#card-expiration-month').val(),
        card_expiration_year: jQuery('#card-expiration-year').val(),
        card_cvv: jQuery('#card-cvv').val()
    }, function (response) {
        if (response.type == 'Error') {
            // handle errors
            alert("Brick errors:\n" + " - " + response.error.join("\n - "));
        } else {

            jQuery('#brick-token').val(response.token);
            jQuery('#brick-fingerprint').val(Brick.getFingerprint());
            jQuery('#brick-get-token-success').val(1);

            // Async: recall form submit
            jQuery('form.checkout').submit();
        }
    });
}