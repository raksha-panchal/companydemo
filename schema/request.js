var mongoose = require('mongoose');
var requestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'company' },
    name: [{ type: String, required: true }],
    type: { type: String, enum: ['Urgent', 'noUrgent'] },
    qty: { type: Number },
    requestassignto: { type: mongoose.Schema.Types.ObjectId, ref: 'company' },
    status: { type: String, enum: ['Pending', 'Processing', 'Completed'], default: "Pending" },
});

module.exports = mongoose.model("request", requestSchema)