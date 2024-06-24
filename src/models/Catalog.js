
const mongoose = require('mongoose');

const catalogSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    image: String,
    catalogName: String,
    vendorCode: String,
    analogSample: String,
    sampleCode: String,
    dimensions: String,
    dimensionsLength:Number,
    dimensionsWidth:Number,
    description: String,
    price: Number,
    name: String,
    provider: String,
    type: String,
    units: String,
    typeEquipment: String,
    safetyZones: String,
    techDocumentation: String,
    ageCategory: String,
    ageStart: Number,
    ageEnd: Number,
    territoryType: {
        territoryType: {
            type: [String],
            default: undefined
        }
    }
});

const Catalog = mongoose.model('Catalog', catalogSchema);

module.exports = Catalog;