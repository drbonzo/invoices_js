function InvoiceController($scope) {

    $scope.vatRates = [
        { label: "23 %", id: 23, value: 0.23 },
        { label: "8 %", id: 8, value: 0.08 },
        { label: "5 %", id: 3, value: 0.05 },
        { label: "0 %", id: 0, value: 0.0 },
        { label: "zw.", id: -1, value: 0.0 }
    ];

    var defaultVatRate = $scope.vatRates[0];

    $scope.selectedVatRate = defaultVatRate; // must be THE SAME object as in vatRates

    $scope.invoiceItems = [
        new InvoiceItem('iPhone 5', 199.99, 9, defaultVatRate),
        new InvoiceItem('iPad 3', 499.99, 7, defaultVatRate),
        new InvoiceItem('MacBook Air', 999.99, 1, defaultVatRate),
        new InvoiceItem('iMac 21', 1299.99, 3, defaultVatRate),
        new InvoiceItem('Foobar', 9.99, 3.2, defaultVatRate)
    ];

}

function InvoiceItem(name, unitNettoPrice, quantity, vatRate) {
    this.name = name;
    this.unitNettoPrice = unitNettoPrice;
    this.quantity = quantity;
    this.vatRate = vatRate;
}

InvoiceItem.prototype.vat = function () {
    return this.vatRate.value;
};

InvoiceItem.prototype.unitBruttoPrice = function () {
    var unitBruttoPrice = this.unitNettoPrice * (1.0 + this.vat());
    return this.roundPrice(unitBruttoPrice);
};

InvoiceItem.prototype.totalNettoPrice = function () {
    var totalNettoPrice = this.quantity * this.unitNettoPrice;
    return this.roundPrice(totalNettoPrice);
};

InvoiceItem.prototype.totalVatPrice = function () {
    var totalVatPrice = this.totalNettoPrice() * this.vat();
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
