
var Companymodel = require('./schema/company');
var requestmodel = require('./schema/request');
var mongoose = require('mongoose')

function register(req, res) {
    var company = new Companymodel(req.body)
    company.save((err, data) => {
        if (err) {
            res.json({ code: 500, message: 'internal server error' })
        } else {
            res.json({ code: 200, message: "data saved successfully", data })
        }
    })
}


function createEmployee(req, res) {
    var employee = new Companymodel(req.body)
    employee.save((err, data) => {
        if (err) {
            res.json({ code: 500, message: 'internal server error' })
        } else {
            if (data.role == 'employee') {
                Companymodel.findOneAndUpdate({ _id: req.params.id }, { $push: { employeeId: data._id } }, { new: true }).exec((err, data1) => {
                    if (err) {
                        console.log(err)
                        res.json({ code: 500, message: 'internal server error' })
                    } else if (!data1) {
                        return res.json({ code: 400, message: "not register company" })
                    } else {
                        data = data.toObject();
                        delete data.employeeId;
                        delete data.inventoryId;
                        return res.json({ code: 200, message: "successfully register", data })
                    }
                })
            } else if (data.role == 'inventory') {
                Companymodel.findOneAndUpdate({ _id: req.params.id, }, { $push: { inventoryId: data._id } }, { new: true, "fields": { "employeeId": 0, "inventoryId": 0 } }).exec((err, result) => {
                    if (err) {
                        res.json({ code: 500, message: 'internal server error' })
                    }
                    else if (!result) {
                        return res.json({ code: 400, message: "not register company" })
                    } else {
                        data = data.toObject();
                        delete data.employeeId;
                        delete data.inventoryId;
                        return res.json({ code: 200, message: "successfully register", data })
                    }
                })
            } else {
                res.json({ code: 500, message: 'internal server error' })
            }
        }
    })
}



function requestFood(req, res) {
    req.body.userId = req.params.id
    var foodlist = new requestmodel(req.body)
    foodlist.save((err, data) => {
        if (err) {
            return res.json({ code: 500, message: "Internal server error" })
        } else {
            return res.json({ code: 200, message: "request assign", data })
        }
    })
}


function assignTo(req, res) {
    requestmodel.findOneAndUpdate({ "_id": req.params.id }, { new: true }, (err, data) => {
        if (err) {
            return res.json({ code: 500, message: "Internal server error" })
        } else {
            Companymodel.findOne({ employeeId: data.userId, inventoryId: { $in: [req.params.aid] } }, (err, result) => {
                if (err) {
                    return res.json({ code: 500, message: "Internal server error" })
                }
                else if (!result) {
                    return res.json({ code: 400, message: "data not found" })
                }
                else {
                    requestmodel.findOneAndUpdate({ _id: data._id }, { $set: { requestassignto: req.params.aid, status: 'Processing' } }, { new: true }, (err, data) => {
                        if (err) {
                            return res.json({ code: 500, message: "Internal server error" })
                        } else {
                            return res.json({ code: 200, message: "request assign successfully", data })
                        }
                    })
                }
            })
        }
    })
}

function completedOrder(req, res) {
    requestmodel.findByIdAndUpdate({ _id: req.params.id, userId: req.params.userid }, { $set: { status: "Completed" } }, { new: true }, (err, data) => {
        if (err) {
            return res.json({ code: 500, message: "Internal server error" })
        } else {
            return res.json({ code: 200, message: "ok", data })
        }
    })
}


function getEmployeeList(req, res) {
    Companymodel.find({ _id: req.params.id }).populate('employeeId').select('employeeId').exec((err, data) => {
        if (err) {
            return res.json({ code: 500, message: "Internal server error" })
        } else if (!data) {
            return res.json({ code: 404, message: "user not found" })
        } else {
            return res.json({ code: 200, message: "ok", data })
        }
    })
}


function getInventoryList(req, res) {
    Companymodel.find({ _id: req.params.id }).populate('inventoryId').select('inventoryId').exec((err, data) => {
        if (err) {
            return res.json({ code: 500, message: "Internal server error" })
        } else if (!data) {
            return res.json({ code: 404, message: "data not found" })
        } else {
            return res.json({ code: 200, message: "ok", data })
        }
    })
}

function pendingOrder(req, res) {
    requestmodel.aggregate([
        { $match: { status: "Pending" } },
        {
            $lookup:
            {
                from: "companies",
                localField: "userId",
                foreignField: "employeeId",
                as: "userdata"
            }
        },
        { $unwind: '$userdata' },
        {
            $match: { 'userdata._id': { $in: [mongoose.Types.ObjectId(req.params.id)] } }
        },
        {
            $project: { "userdata": 0 }
        }

    ]).exec().then((data) => {
        console.log(data)
        return res.json({ code: 200, message: "ok", data })
    })
}


function processingOrder(req, res) {
    requestmodel.find({ status: "Processing" }, (err, data) => {
        console.log(data)
        if (err) {
            return res.json({ code: 500, message: "Internal server error" })
        } else {
            return res.json({ code: 200, message: "ok", data })
        }
    })
}


function countEmployee(req, res) {
    Companymodel.find({ role: "employee" }).count((err, data) => {
        if (err) {
            return res.json({ code: 500, message: "Internal server error" })
        } else {
            return res.json({ code: 200, message: "ok", data })
        }
    })
}


function countInventory(req, res) {
    Companymodel.find({ role: "inventory" }).count((err, data) => {
        if (err) {
            return res.json({ code: 500, message: "Internal server error" })
        } else if (!data) {
            return res.json({ code: 404, message: "No Inventory" })
        } else {
            return res.json({ code: 200, message: "ok", data })
        }
    })
}


module.exports = {
    register,
    createEmployee,
    requestFood,
    getEmployeeList,
    getInventoryList,
    countEmployee,
    countInventory,
    pendingOrder,
    assignTo,
    processingOrder,
    completedOrder

}