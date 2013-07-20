function InvoiceController($scope) {

    $scope.vatRates = [
        { label: '23%', id: 'rate_23', value: 0.23 },
        { label: '8%', id: 'rate_8', value: 0.08 },
        { label: '5%', id: 'rate_3', value: 0.05 },
        { label: '0%', id: 'rate_0', value: 0.0 },
        { label: 'zw.', id: 'rate_zw', value: 0.0 }
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

    $scope.removeInvoiceItem = function (invoiceItem) {
        var i = $scope.invoiceItems.indexOf(invoiceItem);
        if (i != -1) {
            $scope.invoiceItems.splice(i, 1);
        }
    };

    $scope.addNewInvoiceItem = function () {
        $scope.invoiceItems.push(new InvoiceItem(null, 0, 1, defaultVatRate));
        // needs to be called "later" as it will not work
        setTimeout(function () {
            $('.invoiceItems tr.invoiceItem:last input:first').focus();
        }, 10);
    };

    $scope.vatSummaryRows = [];
    for (var i in $scope.vatRates) {
        // todo index with vat.id
        var vatSummaryRow = new VatSummaryRow($scope.vatRates[i]);
        $scope.vatSummaryRows.push(vatSummaryRow);
    }

    // FIXME crete invoice, adding, removing items will refresh it
    // FIXME what about invoice item changes?
    $scope.getVatSummaryRows = function () {
        for (var i in $scope.vatSummaryRows) {
            var vsr = $scope.vatSummaryRows[i];
            vsr.reset();

            for (var ii in $scope.invoiceItems) {
                var invoiceItem = $scope.invoiceItems[ii];
                if (invoiceItem.vatRate === vsr.vatRate) {
                    vsr.addInvoiceItem(invoiceItem);
                }
            }

            vsr.refreshTotals();
        }
        return $scope.vatSummaryRows;
    }
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

function VatSummaryRow(vatRate) {
    this.vatRate = vatRate;
    this.totalNettoValue = 0.0;
    this.totalVatValue = 0.0;
    this.totalBruttoValue = 0.0;

    this.reset();
}

VatSummaryRow.prototype.reset = function () {
    this.totalNettoValue = 0.0;
    this.totalVatValue = 0.0;
    this.totalBruttoValue = 0.0;
};


VatSummaryRow.prototype.roundPrice = function (price) {
    return Number((price.toFixed(2)));
};

VatSummaryRow.prototype.addInvoiceItem = function (invoiceItem) {
    this.totalNettoValue += invoiceItem.totalNettoPrice();
};

VatSummaryRow.prototype.refreshTotals = function () {
    this.totalNettoValue = this.roundPrice(this.totalNettoValue);
    this.totalVatValue = this.roundPrice(this.totalNettoValue * this.vatRate.value);
    this.totalBruttoValue = this.roundPrice(this.totalNettoValue + this.totalVatValue);
};