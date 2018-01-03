var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var db_connect = {
    init: function (url) {
        this.url = url;
    },
    /**
     * Create mongoDB connection.
     * 
     * @param {function} callback
     * @returns {undefined}
     */
    _getConnection: function (callback) {
        MongoClient.connect(this.url, function (err, db) {
            if (err) {
                new Error("DB Connect Fail !!");
            } else {
                callback(db);
            }
        });
    },
    findAll: function (sTable, callback) {
        this._getConnection(function (db) {
            db.collection(sTable).find({}, function (err, cursor) {
                if (err) {
                    callback([]);
                } else {
                    cursor.toArray(function (err, data) {
                        callback(data);
                        db.close();
                    });
                }
            });
        });
    },
    find: function (sTable, sField, sValue, callback) {
        var query = {};
        if (sField === "id") {
            sField = "_id";
            sValue = new ObjectId(sValue);
        }
        query[sField] = sValue;
        this._getConnection(function (db) {
            db.collection(sTable).find(query, function (err, cursor) {
                if (err) {
                    callback(sField == "_id" ? {} : []);
                } else {
                    cursor.toArray(function (err, data) {
                        callback(sField == "_id" ? data[0] : data);
                        db.close();
                    });
                }
            });
        });
    },
    findById: function (sTable, sId, callback) {

        this._getConnection(function (db) {
            db.collection(sTable).findOne({_id: new ObjectId(sId)}, function (err, data) {
                if (err) {
                    callback(null);
                } else {
                    callback(data);
                }
                db.close();
            });
        });
    },
    findByIds: function (sTable, aIds, callback) {

        aIds = aIds.map(function (v) {
            return new ObjectId(v);
        });

        this._getConnection(function (db) {
            db.collection(sTable).find({_id: {$in: aIds}}, function (err, cursor) {
                if (err) {
                    callback([]);
                    db.close();
                } else {
                    cursor.toArray(function (err, data) {
                        callback(data);
                        db.close();
                    });
                }

            });
        });
    },
    remove: function (sTable, sId, callback) {
        this._getConnection(function (db) {
            db.collection(sTable).deleteOne({_id: new ObjectId(sId)}, function (err, result) {
                if (err) {
                    callback(null);
                } else {
                    callback(result);
                }
                db.close();
            });
        });
    },
    save: function (sTable, oData, callback) {
        this._getConnection(function (db) {
            db.collection(sTable).insert(oData, function (err, result) {
                if (err) {
                    console.error(err);
                    callback(null);
                } else {
                    callback(result);
                }
                db.close();
            });
        });
    },
    update: function (sTable, sId, oData, callback) {
        this._getConnection(function (db) {
            delete(oData._id);
            db.collection(sTable).replaceOne({_id: new ObjectId(sId)}, oData, function (err, result) {
                if (err) {
                    callback(null);
                } else {
                    callback(result);
                }
                db.close();
            });
        });
    }
};

module.exports = db_connect;