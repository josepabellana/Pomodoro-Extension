// variables
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const workTittle = document.getElementById('work');
const breakTittle = document.getElementById('break');

let workTime = 25;
let breakTime = 5;

let seconds = "00"

//status
let stats;
chrome.storage.local.get({ stats, seconds }).then((result) => {
    console.log("Status currently is " + result.stats, result.seconds);
    stats = result.stats;
    if(stats == "running"){
        start(result.workTime, result.breakTime, result.seconds)
    }
});

// display
window.onload = () => {
    document.getElementById('minutes').innerHTML = workTime;
    document.getElementById('seconds').innerHTML = seconds;

    workTittle.classList.add('active');
}

startButton.addEventListener('click', () => start());
// start timer
function start(workMinutes = workTime-1, breakMinutes = breakTime -1, seconds = 59) {
    // change button
    document.getElementById('start').style.display = "none";
    document.getElementById('reset').style.display = "block";

    breakCount = 0;
    const stats = "running";
    chrome.storage.local.set({ stats }).then(() => {
        console.log("Value is set");
    });
    // countdown
    let timerFunction = () => {
        //change the display
        document.getElementById('minutes').innerHTML = workMinutes;
        document.getElementById('seconds').innerHTML = seconds;

        chrome.storage.local.set({ workMinutes, breakMinutes }).then(() => {
            console.log("Timer value set");
        });
        chrome.storage.local.get({ stats, seconds }).then((result) => {
            console.log("Status currently is " + result.stats, result.seconds);
        });

        // start
        seconds = seconds - 1;

        if(seconds === 0) {
            workMinutes = workMinutes - 1;
            if(workMinutes === -1 ){
                if(breakCount % 2 === 0) {
                    // start break
                    workMinutes = breakMinutes;
                    breakCount++

                    // update local storage
                    const stats = "running"
                    chrome.storage.local.set({ stats, workMinutes, breakCount, seconds}).then(() => {
                        console.log("Value is set");
                    });

                    // change the painel
                    workTittle.classList.remove('active');
                    breakTittle.classList.add('active');
                }else {
                    // continue work
                    workMinutes = workTime;
                    breakCount++

                    // update localStorage
                    const stats = "running"
                    chrome.storage.local.set({ stats, workMinutes, breakCount, seconds }).then(() => {
                        console.log("Value is set");
                    });

                    // change the painel
                    breakTittle.classList.remove('active');
                    workTittle.classList.add('active');
                }
            }
            seconds = 59;
        }
    }

    // start countdown
    setInterval(timerFunction, 1000); // 1000 = 1s
}



resetButton.addEventListener('click', () => reset());
// reset timer
function reset(){
    // change button
    document.getElementById('start').style.display = "block";
    document.getElementById('reset').style.display = "none";
    window.onload();

    // reset localstorage values
    const stats = "reset"
    const workMinutes = 25;
    const seconds = "00";
    chrome.storage.local.set({ stats, workMinutes, breakCount, seconds }).then(() => {
        console.log("Value is set");
    });
}