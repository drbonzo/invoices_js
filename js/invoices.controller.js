function InvoiceController($scope) {
    /**
     * @type {InvoiceFromNettoPrices}
     */
    var invoice = new InvoiceFromNettoPrices('FS/2013/1');

    (function initializeInvoice() {
        invoice.addInvoiceItemFromData('iPhone 5', 199.00, 3, 'rate_23');
        invoice.addInvoiceItemFromData('iPad 3', 499.00, 2, 'rate_23');
        invoice.addInvoiceItemFromData('iMac', 1299.00, 7, 'rate_23');
        invoice.addInvoiceItemFromData('MacBook Air', 999.00, 1, 'rate_23');
        invoice.addInvoiceItemFromData('Foobar', 99.99, 9.99, 'rate_8');
    })();


    $scope.invoice = invoice;


    $scope.addNewInvoiceItem = function () {
        $scope.invoice.addNewInvoiceItem();

        // focus on first input of new Invoice
        setTimeout(function () {
            $('.invoiceItems tr.invoiceItem:last input:first').focus();
        }, 10);
    };

    $scope.removeInvoiceItem = function (invoiceItem) {
        $scope.invoice.removeInvoiceItem(invoiceItem);
    }
}


