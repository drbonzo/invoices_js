// FIXME     this.vatTable.refresh(this.invoiceItems); to ma sie robic na watch z invoices
function InvoiceFromBruttoPrices() {

}

function InvoiceFromNettoPrices(fullNumber) {
    /**
     * @type {String}
     */
    this.fullNumber = fullNumber;

    /**
     * @type {InvoiceItem[]|Array}
     */
    this.invoiceItems = [];

    /**
     * @type {InvoiceVatRate[]|Array}
     */
    this.vatRates = this.initializeVatRates();

    /**
     * @type {InvoiceVatTable}
     */
    this.vatTable = this.initializeVatTable(this.vatRates);
}

InvoiceFromNettoPrices.prototype.initializeVatRates = function () {

    var vatRates = [];
    vatRates.push(new InvoiceVatRate('23%', 0.23));
    vatRates.push(new InvoiceVatRate('8%', 0.08));
    vatRates.push(new InvoiceVatRate('5%', 0.05));
    vatRates.push(new InvoiceVatRate('0%', 0.0));
    vatRates.push(new InvoiceVatRate('zw.', 0.0));

    return vatRates;
};

/**
 *
 * @param {InvoiceVatRate[]|Array} vatRates
 * @returns {InvoiceVatTable}
 */
InvoiceFromNettoPrices.prototype.initializeVatTable = function (vatRates) {

    var vatTable = new InvoiceVatTable();
    for (var i in vatRates) {
        var vatTableRow = new InvoiceVatTableRow(vatRates[i]);
        vatTable.addVatTableRow(vatTableRow);
    }

    return vatTable;
};

/**
 * @param {String} vatRateId
 * @returns {InvoiceVatRate}
 */
InvoiceFromNettoPrices.prototype.getVatRateForId = function (vatRateId) {
    for (var i in this.vatRates) {
        if (this.vatRates[i].id == vatRateId) {
            return this.vatRates[i];
        }
    }

    throw "InvoiceVatRate not defined for vatRateId = '" + vatRateId + '"';
};

/**
 * @param {String} name
 * @param {Number} unitNettPrice
 * @param {Number} quantity
 * @param {InvoiceVatRate} vatRate
 *
 * @return {InvoiceItem}
 */
InvoiceFromNettoPrices.prototype.addInvoiceItemFromData = function (name, unitNettPrice, quantity, vatRate) {
    var invoiceItem = new InvoiceItem();
    invoiceItem.name = name;
    invoiceItem.vatRate = vatRate;
    invoiceItem.unitNettoPrice = unitNettPrice;
    invoiceItem.quantity = quantity;

    this.invoiceItems.push(invoiceItem);

    return invoiceItem;
};

/**
 * @param {InvoiceItem} invoiceItem
 */
InvoiceFromNettoPrices.prototype.removeInvoiceItem = function (invoiceItem) {
    var i = this.invoiceItems.indexOf(invoiceItem);
    if (i != -1) {
        this.invoiceItems.splice(i, 1);
    }
};

/**
 * @returns {InvoiceItem}
 */
InvoiceFromNettoPrices.prototype.addNewInvoiceItem = function () {
    return this.addInvoiceItemFromData('', 0.0, 1, this.vatRates[0]);
};

function InvoiceItem() {
    this.name = '';
    this.unitNettoPrice = 0.0;
    this._unitBruttoPrice = 0.0;

    /**
     * @type {InvoiceVatRate}
     */
    this.vatRate = null;
    this.quantity = 0;
    this._totalNettoValue = 0.0;
    this._totalVatValue = 0.0;
    this._totalBruttoValue = 0.0;
}

/**
 * @returns {float}
 */
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

function InvoiceVatTable() {

    /**
     *
     * @type {InvoiceVatTableRow[]|Array}
     */
    this.rows = [];

    /**
     * @type {InvoiceVatTableSummaryRow}
     */
    this.summaryRow = new InvoiceVatTableSummaryRow();
}

/**
 * @param {InvoiceVatTableRow} vatTableRow
 */
InvoiceVatTable.prototype.addVatTableRow = function (vatTableRow) {
    this.rows.push(vatTableRow);
};

/**
 *
 * @param {InvoiceItem[]|Array} invoiceItems
 */
InvoiceVatTable.prototype.refresh = function (invoiceItems) {

    this.summaryRow.reset();

    // find row for this item
    for (var r in this.rows) {
        var row = this.rows[r];

        // reset each row
        row.reset();

        // add Invoice items for the same vat rate
        for (var i in invoiceItems) {
            var invoiceItem = invoiceItems[i];
            var vatRate = invoiceItem.vatRate;

            if (row.vatRate === invoiceItem.vatRate) {
                row.addInvoiceItem(invoiceItem);
            }
        }

        // compute totals
        row.refreshTotals();

        this.summaryRow.addTotals(row.totalNettoValue, row.totalVatValue, row.totalBruttoValue);
    }
};
/**
 * @param {InvoiceVatRate} vatRate
 * @constructor
 */
function InvoiceVatTableRow(vatRate) {

    /**
     * @type {InvoiceVatRate}
     */
    this.vatRate = vatRate;
    this.totalNettoValue = 0.0;
    this.totalVatValue = 0.0;
    this.totalBruttoValue = 0.0;

    this.reset();
}

InvoiceVatTableRow.prototype.reset = function () {
    this.totalNettoValue = 0.0;
    this.totalVatValue = 0.0;
    this.totalBruttoValue = 0.0;
};

InvoiceVatTableRow.prototype.roundPrice = function (price) {
    return Number((price.toFixed(2)));
};

/**
 * @param {InvoiceItem} invoiceItem
 */
InvoiceVatTableRow.prototype.addInvoiceItem = function (invoiceItem) {
    this.totalNettoValue += invoiceItem.totalNettoValue();
};

InvoiceVatTableRow.prototype.refreshTotals = function () {
    this.totalNettoValue = this.roundPrice(this.totalNettoValue);
    this.totalVatValue = this.roundPrice(this.totalNettoValue * this.vatRate.value);
    this.totalBruttoValue = this.roundPrice(this.totalNettoValue + this.totalVatValue);
};

function InvoiceVatTableSummaryRow() {
    this.totalNettoValue = 0.0;
    this.totalVatValue = 0.0;
    this.totalBruttoValue = 0.0;

    this.reset();
}

InvoiceVatTableSummaryRow.prototype.reset = function () {
    this.totalNettoValue = 0.0;
    this.totalVatValue = 0.0;
    this.totalBruttoValue = 0.0;
};

InvoiceVatTableSummaryRow.prototype.addTotals = function (totalNettoValue, totalVatValue, totalBruttoValue) {
    this.totalNettoValue += totalNettoValue;
    this.totalVatValue += totalVatValue;
    this.totalBruttoValue += totalBruttoValue;
};

/**
 * @param {string} name
 * @param {float} value
 *
 * @constructor
 */
function InvoiceVatRate(name, value) {
    this.name = name;
    this.value = value;
    var valueInPercents = (value * 100);
    this.id = 'rate_' + Number((valueInPercents.toFixed(0)));
}