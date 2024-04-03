// Initialize variables for recording
let isRecording = false; // Flag to track if recording is ongoing
let mediaRecorder; // MediaRecorder object for recording audio
let recordedChunks = []; // Array to store recorded audio chunks
let recordingIndex = 1; // Variable to track the index of recorded audio files

// DOM elements
const recordButton = document.getElementById('recordButton'); // Button element for recording
const audioList = document.getElementById('audioList'); // Audio list element

// Event listener for mouse down (button click)
recordButton.addEventListener('mousedown', startRecording);

// Event listener for mouse up (button release)
recordButton.addEventListener('mouseup', stopRecording);

// Function to start recording audio
function startRecording() {
    stopRecordedAudio();
    isRecording = true; // Set recording flag to true
    recordButton.style.backgroundColor = '#be4d25'; // Change button color to indicate recording
    recordedChunks = []; // Clear any previous recorded audio chunks
    // Access user's microphone and start recording
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream); // Create a new MediaRecorder object
            mediaRecorder.ondataavailable = handleDataAvailable; // Event handler for when data is available
            mediaRecorder.start(); // Start recording
        })
        .catch(err => console.error('Error accessing microphone:', err)); // Log any errors
}

// Function to stop recording audio
function stopRecording() {
    if (isRecording) { // Check if recording is ongoing
        isRecording = false; // Set recording flag to false
        recordButton.style.backgroundColor = '#007bff'; // Change button color back to default
        mediaRecorder.stop(); // Stop the recording
    }
}

// Function to handle available data during recording
function handleDataAvailable(event) {
    if (event.data.size > 0) { // Check if there is data available
        recordedChunks.push(event.data); // Push the recorded audio data to the array
    }
    if (!isRecording) { // Check if recording has finished
        displayRecordedAudio(); // Display the recorded audio
        playLatestRecordedAudio(); // Play the latest recorded audio
    }
}

// Function to display the recorded audio files
function displayRecordedAudio() {
    const blob = new Blob(recordedChunks, { type: 'audio/wav' }); // Create a Blob from the recorded audio chunks
    const url = URL.createObjectURL(blob); // Create a URL from the Blob
    
    // Create a new audio element
    const audioElement = document.createElement('audio');
    audioElement.src = url;
    //audioElement.controls = true; // Add controls to the audio element
    audioElement.className = 'recorded-audio'; // Add a class for styling
    audioElement.setAttribute('data-index', recordingIndex); // Set the data-index attribute to track the index
    
    // Create a new list item element
    const listItem = document.createElement('li');
    //listItem.textContent = `Recording ${recordingIndex}`; // Display the recording index as text
    listItem.appendChild(audioElement); // Append the audio element to the list item
    
    audioList.appendChild(listItem); // Append the list item to the audio list
    
    recordingIndex++; // Increment the recording index for the next recording
}

//Play the latest recorded audio
function playLatestRecordedAudio() {
    const latestAudio = document.querySelector(`.recorded-audio[data-index="${recordingIndex - 1}"]`); // Get the latest recorded audio element
    if (latestAudio) {
        latestAudio.loop = true; // Set the loop attribute to true
        latestAudio.play(); // Play the latest recorded audio
    }
}

function stopRecordedAudio() {
    const prevAudio = document.querySelector(`.recorded-audio[data-index="${recordingIndex - 1}"]`); // Get the latest recorded audio element
    if (prevAudio) {
        prevAudio.loop = false; // Set the loop attribute to true
        prevAudio.pause(); // Play the latest recorded audio
    }
}

