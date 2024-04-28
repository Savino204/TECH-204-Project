// Initialize variables for recording
let isRecording = false; // Flag to track if recording is ongoing
let mediaRecorder; // MediaRecorder object for recording audio
let recordedChunks = []; // Array to store recorded audio chunks
let recordingIndex = 1; // Variable to track the index of recorded audio files

// DOM elements
const recordButton = document.getElementById('recordButton'); // Button element for recording
const audioList = document.getElementById('audioList'); // Audio list element

// Event listener for mouse down (button click)
recordButton.addEventListener('touchstart', startRecording);

// Event listener for mouse up (button release)
recordButton.addEventListener('touchend', stopRecording);

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

// Define variables for controlling playback
let audioBuffer;
let audioSourceNode;

// Function to display the recorded audio files
function displayRecordedAudio() {
    const blob = new Blob(recordedChunks, { type: 'audio/mpeg' }); // Change type to 'audio/mpeg' for MP3 format

    // Decode the audio blob into an AudioBuffer
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const fileReader = new FileReader();
    fileReader.onload = function() {
        audioContext.decodeAudioData(fileReader.result, function(buffer) {
            audioBuffer = buffer;
            playLatestRecordedAudio(); // Automatically start playback
        });
    };
    fileReader.readAsArrayBuffer(blob);
}

// Function to play the latest recorded audio
function playLatestRecordedAudio() {
    if (audioBuffer) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        const gainNode = audioContext.createGain();
        gainNode.gain.value = 1.5;
        
        // Stop any previous playback
        stopRecordedAudio();

        // Create a new AudioBufferSourceNode
        audioSourceNode = audioContext.createBufferSource();
        audioSourceNode.buffer = audioBuffer;
        audioSourceNode.loop = true; // Set loop attribute to true
        audioSourceNode.connect(gainNode);
        gainNode.connect(audioContext.destination); // Connect to audio output
        audioSourceNode.start(); // Start playback
    }
}

// Function to stop recorded audio playback
function stopRecordedAudio() {
    if (audioSourceNode) {
        audioSourceNode.stop(); // Stop playback
        audioSourceNode.disconnect(); // Disconnect from audio output
    }
}

