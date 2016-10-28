var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

var fs = require('fs');

var DataBase;
// Connection URL
var url = 'mongodb://localhost:27017/myproject';

// Use connect method to connect to the server
var promise = MongoClient.connect(url);



//returned connection promise
promise.then(function (db) {
    DataBase = db;
    var x = { food: {} };
    find(x);

});

function find($scope) {
    var food = getFood();
    food.then(function (foodItems) {
        $scope.food = foodItems;
        var values = getValues(1);
        values.then(function (foodValues) {
            for (var index = 0; index < $scope.food.length; index++) {
                var element = $scope.food[index];
                insertCombined(element, foodValues);
            }
        })
    });
}

function getFood() {
    var collection = DataBase.collection('f-type');
    return collection.find().toArray();
}

function getValues(foodId) {
    var collection = DataBase.collection('f-values');
    return collection.find({ f_key: foodId }).toArray();
}

function insertFood() {
    var collection = db.collection('f-type');
    var items = [
        { name: 'eggs', f_key: 1 },
    ];

    //insert return promise
    var p = collection.insertMany(items);
    //after inserting
    p.then(function (val) {
        console.log(val + 'has been inserted');
    })
}

function insertValues() {

}

function insertCombined(food, values) {
    var newVal = {
        name: food.name,
        protein: values[0].value,
        fat: values[1].value,
        vita_C: values[2].value,
        calories: values[2].value
    };

    fs.appendFileSync(__dirname + '/test.json', JSON.stringify(newVal));
}

