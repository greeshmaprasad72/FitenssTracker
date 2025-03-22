// Global variables to store data
let dailyCalorieGoal = 0;
let totalCaloriesConsumed = 0;
let totalProtein = 0;
let totalCarbs = 0;
let totalFat = 0;
let currentDayIndex = 0;
let weeklyPlan = Array(7)
  .fill()
  .map(() => ({
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
  }));

// Initialize the app
document.addEventListener("DOMContentLoaded", function () {
  // Set current date in the diary date picker
  const today = new Date();
  const dateString = today.toISOString().split("T")[0];
  document.getElementById("diary-date").value = dateString;

  // Load saved data from localStorage if available
  loadData();
});

// Save all data to localStorage
function saveData() {
  const data = {
    dailyCalorieGoal,
    totalCaloriesConsumed,
    totalProtein,
    totalCarbs,
    totalFat,
    meals: {
      breakfast: getMealListItems("breakfast-list"),
      lunch: getMealListItems("lunch-list"),
      dinner: getMealListItems("dinner-list"),
      snack: getMealListItems("snack-list"),
    },
    weeklyPlan,
    diaryEntries: getDiaryEntries(),
  };

  localStorage.setItem("dietTrackerData", JSON.stringify(data));
}

// Load data from localStorage
function loadData() {
  const savedData = localStorage.getItem("dietTrackerData");

  if (savedData) {
    const data = JSON.parse(savedData);

    // Restore calorie goals and macros
    dailyCalorieGoal = data.dailyCalorieGoal || 0;
    totalCaloriesConsumed = data.totalCaloriesConsumed || 0;
    totalProtein = data.totalProtein || 0;
    totalCarbs = data.totalCarbs || 0;
    totalFat = data.totalFat || 0;

    // Update UI
    document.getElementById("calorie-goal").textContent = dailyCalorieGoal;
    document.getElementById("total-calories").textContent =
      totalCaloriesConsumed;
    document.getElementById("remaining-calories").textContent =
      dailyCalorieGoal - totalCaloriesConsumed;
    document.getElementById("protein-amount").textContent = totalProtein + "g";
    document.getElementById("carbs-amount").textContent = totalCarbs + "g";
    document.getElementById("fat-amount").textContent = totalFat + "g";

    // Restore meals
    if (data.meals) {
      restoreMealList("breakfast-list", data.meals.breakfast);
      restoreMealList("lunch-list", data.meals.lunch);
      restoreMealList("dinner-list", data.meals.dinner);
      restoreMealList("snack-list", data.meals.snack);
    }

    // Restore weekly plan
    if (data.weeklyPlan) {
      weeklyPlan = data.weeklyPlan;
      showDayPlan(currentDayIndex);
    }

    // Restore diary entries
    if (data.diaryEntries) {
      const diaryContainer = document.getElementById("diary-entries");
      diaryContainer.innerHTML = "";
      data.diaryEntries.forEach((entry) => {
        const diaryItem = document.createElement("div");
        diaryItem.className = "diary-item";
        diaryItem.innerHTML = `
                    <div class="date">${entry.date}</div>
                    <div class="note">${entry.note}</div>
                    <button class="delete-entry-btn" onclick="deleteDiaryEntry(this)">Delete</button>
                `;
        diaryContainer.appendChild(diaryItem);
      });
    }
  }
}

// Helper function to get meal list items
function getMealListItems(listId) {
  const items = [];
  const list = document.getElementById(listId);
  if (list) {
    const listItems = list.querySelectorAll("li");
    listItems.forEach((item) => {
      const text = item.childNodes[0].textContent;
      items.push(text);
    });
  }
  return items;
}

// Helper function to restore meal list
function restoreMealList(listId, items) {
  const list = document.getElementById(listId);
  if (list && items) {
    list.innerHTML = "";
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "X";
      deleteBtn.onclick = function () {
        li.remove();
        saveData();
      };
      li.appendChild(deleteBtn);
      list.appendChild(li);
    });
  }
}

// Helper function to get diary entries
function getDiaryEntries() {
  const entries = [];
  const diaryContainer = document.getElementById("diary-entries");
  if (diaryContainer) {
    const diaryItems = diaryContainer.querySelectorAll(".diary-item");
    diaryItems.forEach((item) => {
      const date = item.querySelector(".date").textContent;
      const note = item.querySelector(".note").textContent;
      entries.push({ date, note });
    });
  }
  return entries;
}

// BMI Calculator
function calculateBMI() {
  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value) / 100;
  const age = parseInt(document.getElementById("age").value);
  const sex = document.getElementById("sex").value;
  const activity = parseFloat(document.getElementById("activity").value);

  if (weight && height && age) {
    // Calculate BMI
    const bmi = (weight / (height * height)).toFixed(2);
    document.getElementById("bmi-result").innerText = `Your BMI: ${bmi}`;

    // Determine BMI category
    let category = "";
    if (bmi < 18.5) {
      category = "Underweight";
    } else if (bmi >= 18.5 && bmi < 25) {
      category = "Normal weight";
    } else if (bmi >= 25 && bmi < 30) {
      category = "Overweight";
    } else {
      category = "Obese";
    }
    document.getElementById("bmi-category").innerText = `Category: ${category}`;

    // Calculate daily calorie needs (Mifflin-St Jeor equation)
    let bmr = 0;
    if (sex === "male") {
      bmr = 10 * weight + 6.25 * (height * 100) - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * (height * 100) - 5 * age - 161;
    }

    // Apply activity multiplier
    dailyCalorieGoal = Math.round(bmr * activity);
    document.getElementById(
      "daily-calories"
    ).innerText = `Recommended daily calories: ${dailyCalorieGoal}`;

    // Update the calorie goal in the tracker
    document.getElementById("calorie-goal").innerText = dailyCalorieGoal;
    document.getElementById("remaining-calories").innerText =
      dailyCalorieGoal - totalCaloriesConsumed;

    // Save data
    saveData();
  } else {
    alert("Please enter weight, height, and age.");
  }
}

// Add food to the calorie tracker
function addFood() {
  const foodName = document.getElementById("food-name").value;
  const calories =
    parseInt(document.getElementById("food-calories").value) || 0;
  const protein = parseInt(document.getElementById("food-protein").value) || 0;
  const carbs = parseInt(document.getElementById("food-carbs").value) || 0;
  const fat = parseInt(document.getElementById("food-fat").value) || 0;
  const mealType = document.getElementById("meal-type").value;

  if (foodName && calories) {
    // Update totals
    totalCaloriesConsumed += calories;
    totalProtein += protein;
    totalCarbs += carbs;
    totalFat += fat;

    // Update the UI
    document.getElementById("total-calories").innerText = totalCaloriesConsumed;
    document.getElementById("remaining-calories").innerText =
      dailyCalorieGoal - totalCaloriesConsumed;
    document.getElementById("protein-amount").innerText = totalProtein + "g";
    document.getElementById("carbs-amount").innerText = totalCarbs + "g";
    document.getElementById("fat-amount").innerText = totalFat + "g";

    // Add to the appropriate meal list
    const listId = mealType + "-list";
    const list = document.getElementById(listId);
    const li = document.createElement("li");
    li.textContent = `${foodName} - ${calories} cal (P:${protein}g, C:${carbs}g, F:${fat}g)`;

    // Add delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "X";
    deleteBtn.onclick = function () {
      // Subtract from totals when removed
      totalCaloriesConsumed -= calories;
      totalProtein -= protein;
      totalCarbs -= carbs;
      totalFat -= fat;

      // Update the UI
      document.getElementById("total-calories").innerText =
        totalCaloriesConsumed;
      document.getElementById("remaining-calories").innerText =
        dailyCalorieGoal - totalCaloriesConsumed;
      document.getElementById("protein-amount").innerText = totalProtein + "g";
      document.getElementById("carbs-amount").innerText = totalCarbs + "g";
      document.getElementById("fat-amount").innerText = totalFat + "g";

      li.remove();
      saveData();
    };

    li.appendChild(deleteBtn);
    list.appendChild(li);

    // Clear the form
    clearFoodInputs();

    // Save data
    saveData();
  } else {
    alert("Please enter at least food name and calories.");
  }
}

// Add planned meal to weekly plan
function addPlannedMeal() {
  const meal = document.getElementById("planned-meal").value;
  const calories =
    parseInt(document.getElementById("planned-calories").value) || 0;
  const mealType = document.getElementById("planned-meal-type").value;

  if (meal) {
    // Create meal item
    const listId = "week-" + mealType + "-list";
    const list = document.getElementById(listId);
    const li = document.createElement("li");
    li.textContent = `${meal}${calories ? ` - ${calories} cal` : ""}`;

    // Add delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "X";
    deleteBtn.onclick = function () {
      li.remove();

      // Update weekly plan data
      weeklyPlan[currentDayIndex][mealType] = getMealListItems(listId);
      saveData();
    };

    li.appendChild(deleteBtn);
    list.appendChild(li);

    // Update weekly plan data
    weeklyPlan[currentDayIndex][mealType].push(
      `${meal}${calories ? ` - ${calories} cal` : ""}`
    );

    // Clear form
    clearPlanInputs();

    // Save data
    saveData();
  } else {
    alert("Please enter a meal name.");
  }
}

// Show the selected meal plan tab
function showMealTab(tab) {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((t) => t.classList.remove("active"));

  if (tab === "today") {
    document.getElementById("today-tab").style.display = "block";
    document.getElementById("weekly-tab").style.display = "none";
    document.querySelector(".tab:nth-child(1)").classList.add("active");
  } else {
    document.getElementById("today-tab").style.display = "none";
    document.getElementById("weekly-tab").style.display = "block";
    document.querySelector(".tab:nth-child(2)").classList.add("active");
  }
}

// Show the selected day in weekly meal plan
function showDayPlan(dayIndex) {
  currentDayIndex = dayIndex;

  // Update the day buttons
  const dayButtons = document.querySelectorAll(".day-btn");
  dayButtons.forEach((btn, index) => {
    if (index === dayIndex) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Update the selected day header
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  document.getElementById("selected-day").textContent = days[dayIndex];

  // Clear the meal lists
  document.getElementById("week-breakfast-list").innerHTML = "";
  document.getElementById("week-lunch-list").innerHTML = "";
  document.getElementById("week-dinner-list").innerHTML = "";
  document.getElementById("week-snack-list").innerHTML = "";

  // Populate the lists from weekly plan data
  const dayPlan = weeklyPlan[dayIndex];
  if (dayPlan) {
    Object.keys(dayPlan).forEach((mealType) => {
      const listId = "week-" + mealType + "-list";
      const list = document.getElementById(listId);

      dayPlan[mealType].forEach((mealText) => {
        const li = document.createElement("li");
        li.textContent = mealText;

        // Add delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "X";
        deleteBtn.onclick = function () {
          li.remove();

          // Update weekly plan data
          weeklyPlan[currentDayIndex][mealType] = getMealListItems(listId);
          saveData();
        };

        li.appendChild(deleteBtn);
        list.appendChild(li);
      });
    });
  }
}

// Save a diary note
function saveNote() {
  const date = document.getElementById("diary-date").value;
  const note = document.getElementById("diary-note").value;

  if (date && note) {
    const diaryContainer = document.getElementById("diary-entries");
    const formattedDate = new Date(date).toLocaleDateString();

    // Create diary entry
    const diaryItem = document.createElement("div");
    diaryItem.className = "diary-item";
    diaryItem.innerHTML = `
            <div class="date">${formattedDate}</div>
            <div class="note">${note}</div>
            <button class="delete-entry-btn" onclick="deleteDiaryEntry(this)">Delete</button>
        `;

    diaryContainer.appendChild(diaryItem);

    // Clear the note input
    clearDiaryInput();

    // Save data
    saveData();
  } else {
    alert("Please enter a note.");
  }
}

// Delete a diary entry
function deleteDiaryEntry(button) {
  const diaryItem = button.parentElement;
  diaryItem.remove();
  saveData();
}

// Clear functions for all sections

// Clear BMI Calculator
function clearBMICalculator() {
  document.getElementById("weight").value = "";
  document.getElementById("height").value = "";
  document.getElementById("age").value = "";
  document.getElementById("sex").value = "male";
  document.getElementById("activity").value = "1.2";
  document.getElementById("bmi-result").innerText = "";
  document.getElementById("bmi-category").innerText = "";
  document.getElementById("daily-calories").innerText = "";
  saveData();
}

// Clear Calorie Counter
function clearCalorieCounter() {
  totalCaloriesConsumed = 0;
  totalProtein = 0;
  totalCarbs = 0;
  totalFat = 0;

  document.getElementById("total-calories").innerText = "0";
  document.getElementById("remaining-calories").innerText = dailyCalorieGoal;
  document.getElementById("protein-amount").innerText = "0g";
  document.getElementById("carbs-amount").innerText = "0g";
  document.getElementById("fat-amount").innerText = "0g";

  saveData();
}

// Clear Food Inputs
function clearFoodInputs() {
  document.getElementById("food-name").value = "";
  document.getElementById("food-calories").value = "";
  document.getElementById("food-protein").value = "";
  document.getElementById("food-carbs").value = "";
  document.getElementById("food-fat").value = "";
}

// Clear Today's Meals
function clearTodayMeals() {
  document.getElementById("breakfast-list").innerHTML = "";
  document.getElementById("lunch-list").innerHTML = "";
  document.getElementById("dinner-list").innerHTML = "";
  document.getElementById("snack-list").innerHTML = "";

  // Reset calorie counters as well
  clearCalorieCounter();

  saveData();
}

// Clear Plan Inputs
function clearPlanInputs() {
  document.getElementById("planned-meal").value = "";
  document.getElementById("planned-calories").value = "";
}

// Clear Weekly Plan
function clearWeeklyPlan() {
  weeklyPlan = Array(7)
    .fill()
    .map(() => ({
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    }));

  document.getElementById("week-breakfast-list").innerHTML = "";
  document.getElementById("week-lunch-list").innerHTML = "";
  document.getElementById("week-dinner-list").innerHTML = "";
  document.getElementById("week-snack-list").innerHTML = "";

  saveData();
}

// Clear Diary Input
function clearDiaryInput() {
  document.getElementById("diary-note").value = "";
}

// Clear All Diary Entries
function clearAllDiaryEntries() {
  const diaryContainer = document.getElementById("diary-entries");
  diaryContainer.innerHTML = "";
  saveData();
}
