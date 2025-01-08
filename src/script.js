document.addEventListener('DOMContentLoaded', function() {
    // Get reference to the html elements
    const startButton = document.querySelector('#start');
    const stopButton = document.querySelector('#stop');
    const resetButton = document.querySelector('#reset');
    const timerDisplay = document.querySelector('#timer-display');
    const typeDisplay = document.querySelector('#type-display');
    const progressBar = document.querySelector('#progress-bar');
    const progressBackground = document.querySelector('#progress-background');

    let eggTimerIntervalID; // variable to store the interval/timer reference
    let isTimerRunning = false; // variable to store the timer status - has timer been started
    let isTimerPaused = false; // variable to store the timer status - is it currently paused
    let placeHolderWorkTime = 5; // variable to store the placeholder time
    let placeHolderBreakTime = 2; // variable to store the placeholder time
    let placeHolderSessions = 2; // variable to store the placeholder time
    let timeLeftInSeconds; // variable to store the time left in seconds
    let sessionsLeft;
    let sessionType = "Work";
    let totalTime;

    //main function to start the timer
    function startButtonPressed() {
        if (isTimerRunning && !isTimerPaused) {  //if the timer is already running no need to read time left in seconds just "create the interval" - restart the timer
            // do nothing - will call set interval later
        } else if (isTimerRunning && isTimerPaused) { //if the timer is paused, resume it
            isTimerPaused = false;
            startTimer();
        } else { //if the timer is not running, read in how much timer to run for
            beep();
            isTimerRunning = true;

            //parse inputs and set defaults if missing
            workTime = parseInt(document.getElementById('work').value)*60 || placeHolderWorkTime;
            breakTime = parseInt(document.getElementById('break').value)*60 || placeHolderBreakTime;
            sessions = parseInt(document.getElementById('sessions').value) || placeHolderSessions;

            //get the time input value
            timeLeftInSeconds = workTime; 
            totalTime = workTime;
            sessionsLeft = sessions;
            sessionType = "Work";

            //start the timer
            startTimer();
        } 
        
    }
    
    function startTimer() {
        //updateDisplay();
        
        //create an interval to update the display every second
        eggTimerIntervalID = setInterval(() => {  //setInterval is a built-in javascript function that takes a callback function and a delay in milliseconds
            //update the display
            updateDisplay();

            //decrement the time left in seconds
            timeLeftInSeconds--;

            //check for end condition
            if (timeLeftInSeconds < 0) {
                //timer has reached 0 - logic to switch between work and break or end the session
                clearInterval(eggTimerIntervalID); //clear current interval
                
                if (sessionType == "Work") {
                    if (breakTime > 0) {
                        endOfInterval();
                        sessionType = "Break";
                        timeLeftInSeconds = breakTime;
                        totalTime = breakTime;
                        startTimer();
                    } else {
                        // no break time, start new work session
                        sessionsLeft--;
                        if (sessionsLeft > 0) {
                            timeLeftInSeconds = workTime;
                            totalTime = workTime;
                            startTimer();
                        } else {
                            // no more sessions left, stop the timer
                            endOfSessions();
                        }
                    }
                } else if (sessionType == "Break") {
                    sessionsLeft--;
                    if (sessionsLeft > 0) {
                        endOfInterval();
                        sessionType = "Work";
                        timeLeftInSeconds = workTime;
                        totalTime = workTime;
                        startTimer();
                    } else {
                        // no more sessions left, stop the timer
                        endOfSessions();
                    }
                }
            } 
        }, 1000); // 1000ms =  1s
    }

    function updateDisplay() {
        //calculate the minutes and seconds
        const minutes = Math.floor(timeLeftInSeconds / 60);
        const seconds = timeLeftInSeconds % 60;

        //format the minutes and seconds to ensure they are always 2 digits
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');

        //update the display
        timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;
        typeDisplay.textContent = `${sessionType} - ${sessionsLeft} left`;

        //change the color of the display based on the session type
        //timerDisplay.style.color = sessionType === "Work" ? "#ffffff" : "#000000";
        timerDisplay.style.color = "#000000";
        typeDisplay.style.color = timerDisplay.style.color;

        console.log(timeLeftInSeconds, totalTime);
        //update the progress bar
        progressBar.style.width = `${(timeLeftInSeconds / totalTime) * 100}%`;
        progressBar.style.backgroundColor = sessionType === "Work" ? "#44aa44" : "#ff4444";

        //update the progress background
        progressBackground.style.width = `${(timeLeftInSeconds / totalTime) * 100}%`;
        progressBackground.style.backgroundColor = sessionType === "Work" ? "#44aa44" : "#ff4444";
    }

    function beep() {
        return new Promise((resolve) => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = "sine";
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.1);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
            
            oscillator.start();
            setTimeout(() => {
                oscillator.stop();
                resolve();
            }, 300);
        });
    }

    async function endOfInterval(){
        await beep();
        // temporarily disable the transition for the progress bar
        alert("");
        progressBar.style.transition = "none"; // will be reset in the updateDisplay function
    }

    async function endOfSessions(){
        clearInterval(eggTimerIntervalID); //clear the interval - stop the timer 
        isTimerRunning = false; //reset the timer status
        timerDisplay.textContent = "Time's up!";
        typeDisplay.textContent = "";
        await beep();
        await beep();
        await beep();
        alert("DONE!");
    }

    startButton.addEventListener('click', startButtonPressed);

    stopButton.addEventListener('click', () => {
        isTimerPaused = true;
        clearInterval(eggTimerIntervalID); //cleart the interval = pause the timer but dont reset anything
    });

    resetButton.addEventListener('click', () => {
        clearInterval(eggTimerIntervalID); //clear the interval - stop the timer 
        isTimerRunning = false; //reset the timer status
        timerDisplay.textContent = "00:00";
        timerDisplay.style.color = "#000000";
        typeDisplay.textContent = "";
        typeDisplay.style.color = "#000000";

        progressBar.style.width = "100%";
        progressBar.style.backgroundColor = "#000000";
    });


});