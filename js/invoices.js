function InvoiceController($scope) {

    $scope.invoiceItems = [
        new InvoiceItem('iPhone 5', 199.99, 9),
        new InvoiceItem('iPad 3', 499.99, 7),
        new InvoiceItem('MacBook Air', 999.99, 1),
        new InvoiceItem('iMac 21', 1299.99, 3),
        new InvoiceItem('Foobar', 9.99, 3.2)
    ];

}

function InvoiceItem(name, unitNettoPrice, quantity) {
    this.index = 0;
    this.name = name;
    this.unitNettoPrice = unitNettoPrice;
    this.quantity = quantity;
    this.vat = 0.23;
}

InvoiceItem.prototype.unitBruttoPrice = function () {
    var unitBruttoPrice = this.unitNettoPrice * (1.0 + this.vat);
    return this.roundPrice(unitBruttoPrice);
};

InvoiceItem.prototype.totalNettoPrice = function () {
    var totalNettoPrice = this.quantity * this.unitNettoPrice;
    return this.roundPrice(totalNettoPrice);
};

InvoiceItem.prototype.totalVatPrice = function () {
    var totalVatPrice = this.totalNettoPrice() * this.vat;
    return this.roundPrice(totalVatPrice);
};
InvoiceItem.prototype.totalBruttoPrice = function () {
    // rounding is needed, as adding floats in IEEE 754 may not give result with same precision
    var totalBruttoPrice = this.totalNettoPrice() + this.totalVatPrice();
    return this.roundPrice(totalBruttoPrice);
};


InvoiceItem.prototype.roundPrice = function (price) {
    return Number((price.toFixed(2)));
};
//TODO add Invoice -> renumber all
//TODO remove Invoice -> renumber all
