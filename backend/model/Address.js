const mongoose = require("mongoose");
 
// Modelo/Estrutura do endereço
const addressSchema = new mongoose.Schema(
 {
    cep: { type: String, required: true, unique: true }, // Unique garante que seja só 1
    logradouro: { type: String, required: true},
    bairro: { type: String, required: true},
    cidade: { type: String, required: true},
    estado: { type: String, required: true, maxlength: 2}, // Estado somente dois carac. (SP)
 },
 {
    timestamps: true, // Campos de criação e atualização (Dt. Hr.) automaticos
 }
);
 
// Cria o modelo
const Address = mongoose.model("Address", addressSchema);
 
// Exporta o modelo para ser usado
module.exports = Address;
 
 