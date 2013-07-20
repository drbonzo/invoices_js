function InvoiceFromBruttoPrices() {

}

function InvoiceFromNettoPrices(fullNumber) {
    this.fullNumber = fullNumber;
    this.invoiceItems = [];
    this.vatRates = [];

    this.initializeVatRates();
}

InvoiceFromNettoPrices.prototype.initializeVatRates = function () {

    this.vatRates.push(new InvoiceVatRate('23%', 0.23));
    this.vatRates.push(new InvoiceVatRate('8%', 0.08));
    this.vatRates.push(new InvoiceVatRate('5%', 0.05));
    this.vatRates.push(new InvoiceVatRate('0%', 0.0));
    this.vatRates.push(new InvoiceVatRate('zw.', 0.0));
};

InvoiceFromNettoPrices.prototype.getVatRateForId = function (vatRateId) {
    for (var i in this.vatRates) {
        if (this.vatRates[i].id == vatRateId) {
            return this.vatRates[i];
        }
    }

    throw "InvoiceVatRate not defined for vatRateId = '" + vatRateId + '"';
};

InvoiceFromNettoPrices.prototype.addInvoiceItemFromData = function (name, unitNettPrice, quantity, vatRate) {
    var invoiceItem = new InvoiceItem();
    invoiceItem.name = name;
    invoiceItem.vatRate = vatRate;
    invoiceItem.unitNettoPrice = unitNettPrice;
    invoiceItem.quantity = quantity;

    this.invoiceItems.push(invoiceItem);
};

InvoiceFromNettoPrices.prototype.removeInvoiceItem = function (invoiceItem) {
    var i = this.invoiceItems.indexOf(invoiceItem);
    if (i != -1) {
        this.invoiceItems.splice(i, 1);
    }
};

InvoiceFromNettoPrices.prototype.addNewInvoiceItem = function () {
    this.addInvoiceItemFromData('', 0.0, 1, 'rate_23');
};

function InvoiceItem() {
    this.name = '';
    this.unitNettoPrice = 0.0;
    this._unitBruttoPrice = 0.0;
    // FIXME to sie nie aktualizuje
    this.vatRate = null;
    this.quantity = 0;
    this._totalNettoValue = 0.0;
    this._totalVatValue = 0.0;
    this._totalBruttoValue = 0.0;
}

InvoiceItem.prototype.vat = function () {
    return this.vatRate.value;
};

InvoiceItem.prototype.unitBruttoPrice = function () {
    this._unitBruttoPrice = this.roundPrice(this.unitNettoPrice * (1.0 + this.vat()));
    return this._unitBruttoPrice;
};

InvoiceItem.prototype.totalNettoValue = function () {
    this._totalNettoValue = this.roundPrice(this.quantity * this.unitNettoPrice);
    return this._totalNettoValue;
};

InvoiceItem.prototype.totalVatValue = function () {
    this._totalVatValue = this.roundPrice(this.totalNettoValue() * this.vat());
    return this._totalVatValue;
};

InvoiceItem.prototype.totalBruttoValue = function () {
    // rounding is needed, as adding floats in IEEE 754 may not give result with same precision
    this._totalBruttoValue = this.roundPrice(this.totalNettoValue() + this.totalVatValue());
    return this._totalBruttoValue;
};

InvoiceItem.prototype.roundPrice = function (price) {
    return Number((price.toFixed(2)));
};

function InvoiceVatTable() { // FIXME

}

function InvoiceVatTableRow() {// FIXME

}

function InvoiceVatTableSummaryRow() {// FIXME

}

/**
 * @param name string
 * @param value float
 *
 * @constructor
 */
function InvoiceVatRate(name, value) {
    this.name = name;
    this.value = value;
    var valueInPercents = (value * 100);
    this.id = 'rate_' + Number((valueInPercents.toFixed(0)));
}