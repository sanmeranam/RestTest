var express = require('express');
var router = express.Router();

var fnCollectTags = function (aItems) {
    var oTagList = {};
    for (var i in aItems) {
        var item = aItems[i];
        for (var n in item.tags) {
            var tag = item.tags[n];
            if (!oTagList[tag.text]) {
                oTagList[tag.text] = [];
            }
            oTagList[tag.text].push(item._id);
        }
    }
    return oTagList;
};

router.get('/:table', function (req, res, next) {
    req.db.findAll(req.params.table, function (aData) {
        res.json(aData);
    });
});

router.get('/:table/:id', function (req, res, next) {
    req.db.findById(req.params.table, req.params.id, function (aData) {
        res.json(aData);
    });
});


router.get('/:table/:field/:value', function (req, res, next) {
    req.db.find(req.params.table, req.params.field, req.params.value, function (aData) {
        res.json(aData);
    });
});

router.put('/:table', function (req, res, next) {
    req.db.save(req.params.table, req.body, function (oResult) {
        res.json(oResult);
    });
});

router.post('/:table', function (req, res, next) {

    req.db.findByIds(req.params.table, req.body, function (oResult) {
        res.json(oResult);
    });
});

router.post('/:table/:id', function (req, res, next) {
    req.db.update(req.params.table, req.params.id, req.body, function (oResult) {
        res.json(oResult);
    });
});

router.delete('/:table/:id', function (req, res, next) {
    req.db.remove(req.params.table, req.params.id, function (oResult) {
        res.json(oResult);
    });
});

module.exports = router;
