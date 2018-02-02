// Initialize Firebase
var config = {
    apiKey: "AIzaSyDxl6XyvXwJ3JdST0e6haa2FH80AAf7Qnk",
    authDomain: "train-scheduler-b40ee.firebaseapp.com",
    databaseURL: "https://train-scheduler-b40ee.firebaseio.com",
    projectId: "train-scheduler-b40ee",
    storageBucket: "train-scheduler-b40ee.appspot.com",
    messagingSenderId: "513579342763"
};
firebase.initializeApp(config);


// Create a variable to reference the database
var database = firebase.database();

// Button for adding a new train
$('#addTrainBtn').on("click", function() {
    event.preventDefault();

    //Grabs user input
    var trainName = $('#trainNameInput').val().trim();
    var destination = $('#destInput').val().trim();
    var firstTrain = $('#firstTrainInput').val().trim();
    var frequency = $('#freqInput').val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        dest: destination,
        first: firstTrain,
        freq: frequency
    }

    //Uploads employee data to the database
    database.ref().push(newTrain);

    console.log(newTrain.name);
    console.log(newTrain.dest);
    console.log(newTrain.first);
    console.log(newTrain.freq);

    // Clears all of the text-boxes
    $('#trainNameInput').val("");
    $('#destInput').val("");
    $('#firstTrainInput').val("");
    $('#freqInput').val("");


});


// auto-refresh page every 10 secs - see corresponding code in body tag (next time do w/o "blink")
function AutoRefresh(t) {
    setTimeout("location.reload(true);", t);
}

// Creates a Firebase event for adding trains to the database and a row in the html
database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().dest;
    var firstTrain = childSnapshot.val().first;
    var frequency = childSnapshot.val().freq;

    // Train info
    console.log(trainName);
    console.log(destination);
    console.log(firstTrain);
    console.log(frequency);

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current time
    var currentTime = moment();
    console.log("CURRENT TIME:" + moment(currentTime).format("HH:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Mins until train
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


    $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td></tr>");

});