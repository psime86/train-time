 $(document).ready(function(){
 
 // Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBzoAwq-SMpZKplkXvAF9lRhcs9V8iqDQ4",
    authDomain: "simpletrainman.firebaseapp.com",
    databaseURL: "https://simpletrainman.firebaseio.com",
    projectId: "simpletrainman",
    storageBucket: "simpletrainman.appspot.com",
    messagingSenderId: "496240507858",
    appId: "1:496240507858:web:c6e6f34a7161774196a60b",
    measurementId: "G-WNEH6ENNC0"
  };

// Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

// Create a variable to reference the database
    var database = firebase.database();
    console.log(database);

// Current time
    var currentTime = moment().format();
    console.log(currentTime);

// User input
$("#submit").on("click", function(){
    event.preventDefault();

    var trainNameInput = $("#TrainNameInput").val().trim();
    var destinationInput = $("#DestinationInput").val().trim();
    var firstTrainTimeInput = $("#FirstTrainTimeInput").val().trim();
    var frequencyInput = $("#FrequencyInput").val().trim();



// Create user train from input and push user train to database
    var userTrain = {
        train: trainNameInput,
        destination: destinationInput,
        first: firstTrainTimeInput,
        frequency: frequencyInput,
    };

    database.ref().push(userTrain);

// Clear user input form
    $("#TrainNameInput").val("");
    $("#DestinationInput").val("");
    $("#FirstTrainTimeInput").val("");
    $("#FrequencyInput").val("");
})

// Firebase snapshot variables
database.ref().on("child_added", function(childSnapshot){

    var trainNameInput = childSnapshot.val().train;
    var destinationInput = childSnapshot.val().destination;
    var firstTrainTimeInput = childSnapshot.val().time;
    var frequencyInput = childSnapshot.val().frequency;

// Time variables //
    
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTrainTimeInput, "HH:mm").subtract(1, "years");

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var remainder = Math.abs(diffTime % frequencyInput);

    // Minute Until Train
    var minutesUntilTrain = frequencyInput - remainder;
    console.log(minutesUntilTrain);
    // Next Train
    var nextArrival = moment(currentTime).add(minutesUntilTrain, "minutes").format("HH:mm");

    // Append to new row in HTML
    var newRow = $("<tr>").append(
        $("<td>").text(trainNameInput),
        $("<td>").text(destinationInput),
        $("<td>").text(frequencyInput),
        $("<td>").text(nextArrival),
        $("<td>").text(minutesUntilTrain),
    );

    $("#TrainTable > tbody").append(newRow);
})

})