// access all in variable
const currentTime = document.querySelector('#current-time');
const hour        = document.querySelector('#hour');
const minute      = document.querySelector('#minute');
const second      = document.querySelector('#second');
const ampm        = document.querySelector('#ampm');
const alarmButton = document.querySelector('#start-button');
const alarmContainer =document.querySelector('#alarmContainer');
const audio = document.querySelector('#myAudio');


// Adding time to our dropmenu

window.addEventListener('DOMContentLoaded',(event)=>{

    dropDownMenu(1,12,hour);
    dropDownMenu(0,59,minute);
    dropDownMenu(0,59,second);
    setInterval(getCurrentTime,1000);
    fetchAlarm();

});

alarmButton.addEventListener('click',getInput);

function dropDownMenu(start,end,final){

    for(let i=start;i<=end;i++){
        const dropDown = document.createElement('option');
        dropDown.value = i<10 ? "0"+i:i;
        dropDown.innerHTML = i<10 ? "0"+i:i;
        final.appendChild(dropDown);
    }
}

// now set our time and start as live time 


function getCurrentTime() {

    let time = new Date();
    time = time.toLocaleTimeString('en-IN',{
        hour:'numeric',
        minute:'numeric',
        second:'numeric',
        hour12:true,

    });
    currentTime.innerHTML = time;
    return time;

};



// now get the input value when click on submit button to add alarm

function getInput(e){
    
    e.preventDefault();
    const hourValue   = hour.value;
    const minuteValue = minute.value;
    const secondValue = second.value;
    const ampmValue   = ampm.value;

   const alarmTime = convertToTime(
    hourValue,
    minuteValue,
    secondValue,
    ampmValue
   )
    setAlarm(alarmTime);

};

function convertToTime(hour, minute, second, ampm) {
    return `${parseInt(hour)}:${minute}:${second} ${ampm}`;
  }


function setAlarm(time,fetching=false){

    const alarm = setInterval(()=>{
        if(time === getCurrentTime()){
            audio.play();
        }
    },1000);

    // so add alarm to a list

    addAlarmToList(time,alarm);
    if(!fetching){
        saveAlarm(time);
    }
}

// so add alarm to a list which will display on body

function addAlarmToList(time, intervalId){

    const alarm = document.createElement('div');
    alarm.classList.add('alarm','mb','d-flex');
    alarm.innerHTML = `<div class = 'time'> ${time}</div>
    <button class = 'btn delete-alarm' data-id=${intervalId}>Delete</button>`;
    const deleteButton = alarm.querySelector('.delete-alarm');
    deleteButton.addEventListener('click',(e)=>deleteAlarm(e,time,intervalId));
    alarmContainer.prepend(alarm);

}

//save alarm to local storage

function saveAlarm(time){

    const alarm = checkAlarm();
    alarm.push(time);
    localStorage.setItem('alarm',JSON.stringify(alarm));
}

//check alarm

function checkAlarm(){

    let alarm = [];
    const isPresent = localStorage.getItem('alarm');
    if(isPresent) alarm = JSON.parse(isPresent);
    return alarm;
}

//fetching alarm from local storage to use it

function fetchAlarm(){

    const alarm = checkAlarm();
    alarm.forEach((time)=>{
        setAlarm(time,true);
    });
}

function deleteAlarm(event,time,intervalId){

    const self = event.target;
    clearInterval(intervalId);
    const alarm = self.parentElement;
    console.log(time);
    deleteAlarmFromLocal(time);
    alarm.remove();

}

function deleteAlarmFromLocal(time){

    const alarm = checkAlarm();

    const index = alarm.indexOf(time);
    alarm.splice(index,1);
    localStorage.setItem('alarm',JSON.stringify(alarm));
}





