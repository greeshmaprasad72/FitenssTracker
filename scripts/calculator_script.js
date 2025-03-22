document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded");
  const value = getMetValue("running");
  console.log("value is " + value.low);
  // getProfile();
  getWorkoutList();
  setupListeners();
  setupFilterListeners();
});

function setupListeners() {
  $("#save-workout-form").submit((e) => {
    e.preventDefault();
    saveWorkout();
  });

  $("#save-profile").click(() => {
    saveProfile();
  });

  $(document).on("click", ".workout-delete-button", function () {
    const workoutID = $(this).data("id");
    deleteWorkout(workoutID);
  });
}
function setupFilterListeners() {
  // Add event listeners to the filter and sort dropdowns
  $("#filter-type").change(() => applyFiltersAndSort());
  $("#filter-intensity").change(() => applyFiltersAndSort());
  $("#filter-sort").change(() => applyFiltersAndSort());
}

function applyFiltersAndSort() {
  // Get the selected filter and sort values
  const selectedType = $("#filter-type").val();
  const selectedIntensity = $("#filter-intensity").val();
  const selectedSort = $("#filter-sort").val();

  // Get the workout list from localStorage
  let workoutList = JSON.parse(localStorage.getItem("workoutList")) || [];

  // Filter the workout list based on the selected criteria
  const filteredWorkoutList = workoutList.filter((workout) => {
    const typeMatch =
      selectedType === "all" || workout.workoutType === selectedType;
    const intensityMatch =
      selectedIntensity === "all" ||
      workout.workoutIntensity === selectedIntensity;
    return typeMatch && intensityMatch;
  });

  // Sort the filtered workout list
  const sortedWorkoutList = sortWorkoutList(filteredWorkoutList, selectedSort);

  // Display the filtered and sorted workout list
  displayWorkoutList(sortedWorkoutList);
}

function sortWorkoutList(workoutList, sortBy) {
  switch (sortBy) {
    case "newest":
      return workoutList.sort(
        (a, b) => new Date(b.workoutDate) - new Date(a.workoutDate)
      );
    case "oldest":
      return workoutList.sort(
        (a, b) => new Date(a.workoutDate) - new Date(b.workoutDate)
      );
    case "longest":
      return workoutList.sort((a, b) => b.workoutDuration - a.workoutDuration);
    case "shortest":
      return workoutList.sort((a, b) => a.workoutDuration - b.workoutDuration);
    default:
      return workoutList;
  }
}

// function getProfile() {
//     let profileList = JSON.parse(localStorage.getItem('profileList')) || [];
//     if (profileList.length > 0) {
//         const profile = profileList[profileList.length - 1];
//         $('#name').val(profile.name);
//         $('#age').val(profile.age);
//         $('#weight').val(profile.weight);
//         $('#height').val(profile.height);
//         $('#gender').val(profile.gender);
//     }
// }
// function resetProfileForm() {
//   // Clear input fields
//   $("#name").val("");
//   $("#age").val("");
//   $("#weight").val("");
//   $("#height").val("");
//   $("#gender").val("");
// }
// function saveProfile() {
//     let profileList = JSON.parse(localStorage.getItem('profileList')) || [];
//     let name = $('#name').val();
//     let age = $('#age').val();
//     let weight = $('#weight').val();
//     let height = $('#height').val();
//     let gender = $('#gender').val();

//     if (!validateProfile(name, age, weight, height, gender)) {
//         alert("Please fill out all the fields");
//         return;
//     }

//     let profile = { name, age, weight, height, gender };
//     profileList.push(profile);
//     localStorage.setItem('profileList', JSON.stringify(profileList));
//     alert("Profile saved");
//     resetProfileForm();
// }

function getMetValue(workoutName) {
  const metValues = {
    running: { low: 7, medium: 10, high: 14 },
    jogging: { low: 3.8, medium: 5, high: 7 },
    cycling: { low: 4, medium: 8, high: 12 },
    walking: { low: 3, medium: 4.5, high: 6 },
    swimming: { low: 5, medium: 8, high: 11 },
    yoga: { low: 2.5, medium: 3.5, high: 5 },
    default: { low: 3, medium: 5, high: 7 },
    weightlifting: { low: 3, medium: 4, high: 6 },
    boxing: { low: 7, medium: 9, high: 12 },
    hiking: { low: 4, medium: 6, high: 8 },
    climbing: { low: 5, medium: 7, high: 10 },
    zumba: { low: 4, medium: 6, high: 8 },
    crossfit: { low: 6, medium: 8, high: 11 },
    spin: { low: 5, medium: 7, high: 10 },
    kickboxing: { low: 6, medium: 8, high: 11 },
    aerobics: { low: 5, medium: 7, high: 10 },
    step: { low: 5, medium: 7, high: 10 },
    waterAerobics: { low: 4, medium: 6, high: 8 },
    strengthTraining: { low: 3, medium: 5, high: 7 },
    stretching: { low: 2, medium: 3, high: 5 },
  };
  return metValues[workoutName] || metValues.default;
}
function resetWorkoutForm() {
  // Clear input fields
  $("#workout-type").val("");
  $("#workout-name").val("");
  $("#workout-date").val("");
  $("#workout-duration").val("");
  $("#intensity").val("");
  $("#notes").val("");
}
function saveWorkout() {
  let workoutList = JSON.parse(localStorage.getItem("workoutList")) || [];
  let workoutType = $("#workout-type").val();
  let workoutName = $("#workout-name").val();
  let workoutDate = $("#workout-date").val();
  let workoutDuration = $("#workout-duration").val();
  let workoutIntensity = $("#intensity").val();
  let workoutNotes = $("#notes").val();

  if (
    !validateWorkout(
      workoutType,
      workoutName,
      workoutDate,
      workoutDuration,
      workoutIntensity
    )
  ) {
    alert("Please fill out all the fields");
    return;
  }

  const calorieBurned = calculateCalorieBurned(
    workoutType,
    workoutDuration,
    workoutIntensity
  );
  let workout = {
    workoutID: Date.now(),
    workoutType,
    workoutName,
    workoutDate,
    workoutDuration,
    workoutIntensity,
    workoutNotes,
    calorieBurned,
  };

  workoutList.push(workout);
  localStorage.setItem("workoutList", JSON.stringify(workoutList));
  getWorkoutList();
  resetWorkoutForm();
}

function getWorkoutList() {
  let workoutList = JSON.parse(localStorage.getItem("workoutList")) || [];
  displayTotals(workoutList);
  displayWorkoutList(workoutList);
  applyFiltersAndSort();
}

function displayTotals(workoutList) {
  let totalCalories = 0;
  let totalDuration = 0;
  let totalWorkouts = workoutList.length;

  workoutList.forEach((workout) => {
    totalCalories += workout.calorieBurned;
    totalDuration += parseFloat(workout.workoutDuration);
  });

  $("#total-calories").text(totalCalories);
  $("#total-duration").text(totalDuration);
  $("#total-workouts").text(totalWorkouts);
}

function displayWorkoutList(workoutList) {
  const workoutListContainer = $("#workout-list");
  workoutListContainer.empty();

  if (workoutList.length === 0) {
    workoutListContainer.html("<p>No workouts available</p>");
    return;
  }

  workoutList.forEach((workout) => {
    workoutListContainer.append(displayWorkoutCard(workout));
  });
}

function displayWorkoutCard(workout) {
  return `
        <div class="workout-card-item">
            <div class="workout-card-header">
                <div class="workout-name">${workout.workoutName}</div>
                <div class="workout-date">${workout.workoutDate}</div>
            </div>
            <div class="workout-card-body">
                <div class="workout-item">${workout.workoutType}</div>
                <div class="workout-item">${workout.workoutDuration} Mins</div>
                <div class="workout-item">${workout.workoutIntensity}</div>
                <div class="workout-item">${workout.calorieBurned} Calories</div>
            </div>
            <div class="workout-delete-container">
                <button class="workout-delete-button" data-id="${workout.workoutID}">Delete</button>
            </div>
        </div>`;
}

function deleteWorkout(workoutID) {
  let workoutList = JSON.parse(localStorage.getItem("workoutList")) || [];
  workoutList = workoutList.filter(
    (workout) => workout.workoutID !== workoutID
  );
  localStorage.setItem("workoutList", JSON.stringify(workoutList));
  getWorkoutList();
}

function calculateCalorieBurned(
  workoutType,
  workoutDuration,
  workoutIntensity
) {
  let metValue = getMetValue(workoutType);
  let calorieBurned = 0;
  if (workoutIntensity === "low") {
    calorieBurned = metValue.low * workoutDuration;
  } else if (workoutIntensity === "medium") {
    calorieBurned = metValue.medium * workoutDuration;
  } else {
    calorieBurned = metValue.high * workoutDuration;
  }
  return calorieBurned;
}

function validateProfile(name, age, weight, height, gender) {
  return (
    name &&
    !isNaN(age) &&
    age > 0 &&
    !isNaN(weight) &&
    weight > 0 &&
    !isNaN(height) &&
    height > 0 &&
    gender
  );
}

function validateWorkout(
  workoutType,
  workoutName,
  workoutDate,
  workoutDuration,
  workoutIntensity
) {
  return (
    workoutType &&
    workoutName &&
    workoutDate &&
    !isNaN(workoutDuration) &&
    workoutDuration > 0 &&
    workoutIntensity
  );
}
