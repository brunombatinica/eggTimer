document.addEventListener('DOMContentLoaded', function() {
    // Get reference to the html elements
    const startButton = document.querySelector('#start');
    const stopButton = document.querySelector('#stop');
    const resetButton = document.querySelector('#reset');
    const timerDisplay = document.querySelector('#timer-display');
    const typeDisplay = document.querySelector('#type-display');

    let eggTimerIntervalID; // variable to store the interval/timer reference
    let isTimerRunning = false; // variable to store the timer status
    let placeHolderWorkTime = 5; // variable to store the placeholder time
    let placeHolderBreakTime = 2; // variable to store the placeholder time
    let placeHolderSessions = 2; // variable to store the placeholder time
    let timeLeftInSeconds; // variable to store the time left in seconds
    let sessionsLeft;
    let sessionType = "Work";

    //main function to start the timer
    function startButtonPressed() {
        if (isTimerRunning) {  //if the timer is already running no need to read time left in seconds just "create the interval" - restart the timer
            // do nothing - will call set interval later
        } else { //if the timer is not running, read in how much timer to run for
            beep();
            isTimerRunning = true;

            //parse inputs and set defaults if missing
            workTime = parseInt(document.getElementById('work').value)*60 || placeHolderWorkTime;
            breakTime = parseInt(document.getElementById('break').value)*60 || placeHolderBreakTime;
            sessions = parseInt(document.getElementById('sessions').value) || placeHolderSessions;

            //get the time input value
            timeLeftInSeconds = workTime; //parse the input value as an integer, if it's not a number, set it to 20
            sessionsLeft = sessions;
        }
        //start the timer
        startTimer(timeLeftInSeconds, sessionsLeft, sessionType);
    }
    
    function startTimer(timeLeftInSeconds, sessionsLeft, sessionType) {
        //create an interval to update the display every second
        eggTimerIntervalID = setInterval(() => {  //setInterval is a built-in javascript function that takes a callback function and a delay in milliseconds
            //update the display
            updateDisplay(timeLeftInSeconds, sessionsLeft, sessionType);

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
                        startTimer(timeLeftInSeconds, sessionsLeft, sessionType);
                    } else {
                        // no break time, start new work session
                        sessionsLeft--;
                        if (sessionsLeft > 0) {
                            timeLeftInSeconds = workTime;
                            startTimer(timeLeftInSeconds, sessionsLeft, sessionType);
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
                        startTimer(timeLeftInSeconds, sessionsLeft, sessionType);
                    } else {
                        // no more sessions left, stop the timer
                        endOfSessions();
                    }
                }
            } 
        }, 1000); // 1000ms =  1s
    }

    function updateDisplay(timeLeft, sessionsLeft, sessionType) {
        //calculate the minutes and seconds
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        //format the minutes and seconds to ensure they are always 2 digits
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');

        //update the display
        timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;
        typeDisplay.textContent = `${sessionType} - ${sessionsLeft} left`;

        //change the color of the display based on the session type
        timerDisplay.style.color = sessionType === "Work" ? "#44aa44" : "#ff4444";
        typeDisplay.style.color = timerDisplay.style.color;
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
        alert("")
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
        clearInterval(eggTimerIntervalID); //cleart the interval = pause the timer but dont reset anything
    });

    resetButton.addEventListener('click', () => {
        clearInterval(eggTimerIntervalID); //clear the interval - stop the timer 
        isTimerRunning = false; //reset the timer status
        timerDisplay.textContent = "00:00";
        timerDisplay.style.color = "#000000";
        typeDisplay.textContent = "";
        typeDisplay.style.color = "#000000";
    });


});