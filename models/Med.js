const mongoose = require('mongoose');
const { Schema } = mongoose;

const medSchema = new Schema({
    drug_company: String,
    drug_brand_name: String,
    drug_generic_name: String
});

const Med = mongoose.model("Med", medSchema, "meds");
module.exports = Med;