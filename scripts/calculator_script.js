document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded");
    const value = getMetValue("running")
    console.log("value is" + value.low);
    getProfile();
    getWorkoutList();
    saveWorkoutListener();
})


function saveWorkoutListener() {
    $('#save-workout-form').submit((e) => {
        saveWorkout();
    })

    $("#save-profile").click(() => {
        saveProfile();
    })
}

function getProfile() {
    let profileList = localStorage.getItem('profileList') ;
    if (profileList) {
        profileList = JSON.parse(profileList);
        console.log("profileList is" + profileList[profileList.length - 1]);
        const profile = profileList[profileList.length - 1];
        $('#name').val( profile.name);
        $('#age').val(profile.age);
        $('#weight').val ( profile.weight);
        $('#height').val( profile.height);
        $('#gender').val ( profile.gender);

    }
}

function saveProfile() {
    let profileList = JSON.parse(localStorage.getItem('profileList'))||[];
    let name = $('#name').val();
    let age = $('#age').val();
    let weight = $('#weight').val();
    let height = $('#height').val();
    let gender = $('#gender').val();
    console.log("name is" + name);
    const isValidProfile = validateProfile(name, age, weight, height, gender);
    if (!isValidProfile) {
        alert("Please fill out all the fields");
        return;
    } else {
        let profile = {
            name: name,
            age: age,
            weight: weight,
            height: height,
            gender: gender,
        }
       profileList.push(profile)
        localStorage.setItem('profileList', JSON.stringify(profileList));
        alert("Profile saved");
    }


}

function getMetValue(workoutname) {
    switch (workoutname) {
        case 'running':
            return {
                low: 7,
                medium: 10,
                high: 14
            };
        case 'jogging':
            return {
                low: 3.8,
                medium: 5,
                high: 7
            };
        case 'cycling':
            return {
                low: 4,
                medium: 8,
                high: 12
            };
        case 'walking':
            return {
                low: 3,
                medium: 4.5,
                high: 6
            };
        case 'swimming':
            return {
                low: 5,
                medium: 8,
                high: 11
            };
        case 'yoga':
            return {
                low: 2.5,
                medium: 3.5,
                high: 5
            };
        case 'weightlifting':
            return {
                low: 3,
                medium: 4,
                high: 6
            };
        case 'basketball':
            return {
                low: 6,
                medium: 8,
                high: 10
            };
        case 'soccer':
            return {
                low: 7,
                medium: 9,
                high: 12
            };
        case 'tennis':
            return {
                low: 5,
                medium: 7,
                high: 10
            };
        case 'golf':
            return {
                low: 3,
                medium: 4,
                high: 5
            };
        case 'volleyball':
            return {
                low: 4,
                medium: 6,
                high: 8
            };
        case 'baseball':
            return {
                low: 4,
                medium: 6,
                high: 8
            };
        case 'football':
            return {
                low: 8,
                medium: 10,
                high: 13
            };
        case 'hockey':
            return {
                low: 8,
                medium: 10,
                high: 13
            };
        case 'skiing':
            return {
                low: 7,
                medium: 9,
                high: 12
            };
        case 'snowboarding':
            return {
                low: 7,
                medium: 9,
                high: 12
            };
        case 'surfing':
            return {
                low: 3,
                medium: 4,
                high: 6
            };
        case 'skateboarding':
            return {
                low: 3,
                medium: 4,
                high: 6
            };
        case 'rowing':
            return {
                low: 5,
                medium: 7,
                high: 10
            };
        case 'boxing':
            return {
                low: 7,
                medium: 9,
                high: 12
            };
        case 'martialArts':
            return {
                low: 6,
                medium: 8,
                high: 11
            };
        case 'dancing':
            return {
                low: 3,
                medium: 5,
                high: 7
            };
        case 'hiking':
            return {
                low: 4,
                medium: 6,
                high: 8
            };
        case 'climbing':
            return {
                low: 5,
                medium: 7,
                high: 10
            };
        case 'kayaking':
            return {
                low: 4,
                medium: 6,
                high: 8
            };
        case 'canoeing':
            return {
                low: 4,
                medium: 6,
                high: 8
            };
        case 'pilates':
            return {
                low: 3,
                medium: 4,
                high: 6
            };
        case 'zumba':
            return {
                low: 4,
                medium: 6,
                high: 8
            };
        case 'crossfit':
            return {
                low: 6,
                medium: 8,
                high: 11
            };
        case 'bootcamp':
            return {
                low: 6,
                medium: 8,
                high: 11
            };
        case 'barre':
            return {
                low: 3,
                medium: 4,
                high: 6
            };
        case 'spin':
            return {
                low: 5,
                medium: 7,
                high: 10
            };
        case 'kickboxing':
            return {
                low: 6,
                medium: 8,
                high: 11
            };
        case 'aerobics':
            return {
                low: 5,
                medium: 7,
                high: 10
            };
        case 'step':
            return {
                low: 5,
                medium: 7,
                high: 10
            };
        case 'waterAerobics':
            return {
                low: 4,
                medium: 6,
                high: 8
            };
        case 'strengthtraining':
            return {
                low: 3,
                medium: 5,
                high: 7
            };
        case 'stretching':
            return {
                low: 2,
                medium: 3,
                high: 5
            };
        default:
            return {
                low: 3,
                medium: 5,
                high: 7
            };



    }
}

    function saveWorkout() {
        let workoutList = JSON.parse(localStorage.getItem('workoutList'))||[];
        let workoutType = $('#workout-type').val();
        let workoutName = $('#workout-name').val();
        let workoutDate = $('#workout-date').val();
        let workoutDuration = $('#workout-duration').val();
        let workoutIntensity = $('#intensity').val();
        let workoutNotes = $('#notes').val();
      const isValidWorkout=  validateWorkout(workoutType, workoutName, workoutDate, workoutDuration, workoutIntensity);
      if(isValidWorkout){
        const calorieBurned= calculateCalorieBurned(workoutType, workoutDuration, workoutIntensity);
        let workout = {
            workoutID:Date.now(),
            workoutType: workoutType,
            workoutName: workoutName,
            workoutDate: workoutDate,
            workoutDuration: workoutDuration,
            workoutIntensity:workoutIntensity,
            workoutNotes: workoutNotes,
            calorieBurned: calorieBurned,
            currentDate:workoutDate,
        }
         workoutList.push(workout);
        localStorage.setItem('workoutList', JSON.stringify(workoutList));
        getWorkoutList();
      }else{
        alert("Please fill out all the fields");
        return;
      }
    
    }


    function getWorkoutList() {
        let workoutList = localStorage.getItem('workoutList');
        if (workoutList) {
            workoutList= JSON.parse(workoutList);
             displayTotals(workoutList)
             displayWorkoutList(workoutList)
        }
    }

    function displayTotals(workoutList){
        let totalCalories=0;
        let totalDuration=0;
        let totalWorkouts=workoutList.length;
        for(let i=0; i<workoutList.length; i++){
            totalCalories+=workoutList[i].calorieBurned;
            totalDuration+= parseFloat(workoutList[i].workoutDuration);
        }
        $('#total-calories').text(totalCalories);
        $('#total-duration').text(totalDuration);
        $('#total-workout').text(totalWorkouts);
    }

    function displayWorkoutList(workoutList){
        const workoutListContainer= $('#workout-list');
        if(workoutList.length===0){
            workoutListContainer.html('<p>No workouts available</p>');
            return;
        }else{
           workoutList.forEach(element => {
            workoutListContainer.append(displayWorkoutCard(element))  
           });

        }
       
    }
    function displayWorkoutCard(workout){
        const workoutCard=document.createElement('div');
        workoutCard.className='workout-card-item';
        
        workoutCard.innerHTML=`
        <div class="workout-card-header">
        <div class="workout-name">${workout.workoutName}</div>
        <div class="workout-date">${workout.currentDate}</div>
        </div>
        <div class="workout-card-body">
        <div class="workout-item">${workout.workoutType}</div>
        <div class="workout-item">${workout.workoutDuration} Mins</div>
        <div class="workout-item">${workout.workoutIntensity}</div>
        <div class="workout-item">${workout.calorieBurned} Calories</div>
        </div>
        <div class="workout-description">${workout.workoutNotes}</div>
        <div class="workout-delete-container">
        <button class ="workout-delete-button">Delete</button>
        </div>
        `;
        return workoutCard;
    }

    function getCurrentDateAndTime(){
        const date= new Date();
        const year= date.getFullYear();
        const month= date.getMonth()+1;
        const day= date.getDate();
        const hours= date.getHours();
        const minutes= date.getMinutes();
        const seconds= date.getSeconds();
        const TwelveHourFormat= hours>=12? hours-12: hours;
        const amPm= hours>=12? 'PM': 'AM';
        return `${day}-${month}-${year} ${TwelveHourFormat}:${minutes}:${seconds} ${amPm}`;
    }




    function calculateCalorieBurned(workoutType, workoutDuration, workoutIntensity) {
        let metValue = getMetValue(workoutType);
        let calorieBurned = 0;
        if (workoutIntensity === 'low') {
            calorieBurned = metValue.low * workoutDuration;
        } else if (workoutIntensity === 'medium') {
            calorieBurned = metValue.medium * workoutDuration;
        } else {
            calorieBurned = metValue.high * workoutDuration;
        }
        return calorieBurned;
    }

    function validateProfile(name, age, weight, height, gender) {
        if (name === '' || age === '' || weight === '' || height === '' || gender === '') {
            return false;
        }
        return true;
    }
    function validateWorkout(workoutType, workoutName, workoutDate, workoutDuration, workoutIntensity) {

        if (workoutType === '' || workoutName === '' || workoutDate === '' || workoutDuration === '' || workoutIntensity === '') {
            return false;
        }
        return true;
    }   