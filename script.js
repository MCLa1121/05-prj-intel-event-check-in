//get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const attendeeList = document.getElementById("attendeeList");
const storageKey = "intel-sustainability-summit-attendance";

//track attendance
let count = 0;
const maxCount = 50;
const teamCounts = {
  water: 0,
  zero: 0,
  power: 0,
};

const attendees = [];

const teamNames = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};

function getWinningTeam() {
  const teamKeys = Object.keys(teamCounts);
  let winningTeam = teamKeys[0];

  for (let i = 1; i < teamKeys.length; i++) {
    const currentTeam = teamKeys[i];
    if (teamCounts[currentTeam] > teamCounts[winningTeam]) {
      winningTeam = currentTeam;
    }
  }

  return winningTeam;
}

function saveAttendanceState() {
  const attendanceState = {
    count: count,
    teamCounts: teamCounts,
    attendees: attendees,
  };

  localStorage.setItem(storageKey, JSON.stringify(attendanceState));
}

function loadAttendanceState() {
  const savedState = localStorage.getItem(storageKey);

  if (!savedState) {
    return;
  }

  const attendanceState = JSON.parse(savedState);

  count = attendanceState.count || 0;
  teamCounts.water = attendanceState.teamCounts.water || 0;
  teamCounts.zero = attendanceState.teamCounts.zero || 0;
  teamCounts.power = attendanceState.teamCounts.power || 0;
  attendees.length = 0;

  if (attendanceState.attendees && attendanceState.attendees.length > 0) {
    for (let i = 0; i < attendanceState.attendees.length; i++) {
      attendees.push(attendanceState.attendees[i]);
    }
  }
}

function updateAttendanceDisplay() {
  const progressValue = Math.min(Math.round((count / maxCount) * 100), 100);

  attendeeCount.textContent = count;
  progressBar.style.width = progressValue + "%";
  progressBar.setAttribute("aria-valuenow", String(count));
  progressText.textContent = `${count} of ${maxCount} attendees checked in`;

  document.getElementById("waterCount").textContent = teamCounts.water;
  document.getElementById("zeroCount").textContent = teamCounts.zero;
  document.getElementById("powerCount").textContent = teamCounts.power;
}

function renderAttendeeList() {
  if (attendees.length === 0) {
    attendeeList.innerHTML =
      '<li class="attendee-list-empty">No attendees checked in yet.</li>';
    return;
  }

  let listMarkup = "";

  for (let i = 0; i < attendees.length; i++) {
    const attendee = attendees[i];
    listMarkup +=
      '<li class="attendee-item">' +
      '<span class="attendee-name">' +
      attendee.name +
      "</span>" +
      '<span class="attendee-team">' +
      attendee.teamName +
      "</span>" +
      "</li>";
  }

  attendeeList.innerHTML = listMarkup;
}

function updateCelebrationMessage() {
  if (count < maxCount) {
    greeting.className = "success-message";
    greeting.style.display = "none";
    return;
  }

  const winningTeam = getWinningTeam();
  greeting.className = "success-message celebration-message";
  greeting.innerHTML = `Celebration! <strong>${teamNames[winningTeam]}</strong> wins the attendance goal!`;
  greeting.style.display = "block";
}

loadAttendanceState();
updateAttendanceDisplay();
renderAttendeeList();
updateCelebrationMessage();

//Handel form submission
form.addEventListener("submit", function (event) {
  //prevent the webpage to refresh
  event.preventDefault();

  //get form value
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;
  const teamCounter = document.getElementById(team + "Count");

  console.log(name, team, teamName);

  //Increment the count
  count++;
  console.log("Total check-ins: " + count);

  //update progess bar

  //update the team counter
  teamCounts[team]++;
  const teamCard = teamCounter.parentElement;
  teamCard.classList.remove("team-card-flash");
  void teamCard.offsetWidth;
  teamCard.classList.add("team-card-flash");

  attendees.push({
    name: name,
    teamName: teamName,
  });

  updateAttendanceDisplay();
  renderAttendeeList();
  saveAttendanceState();

  //show welcome message
  let message = `Welcome ${name}! You are checked in to ${teamName}.`;
  greeting.className = "success-message";

  if (count === maxCount) {
    const winningTeam = getWinningTeam();
    message = `Celebration! <strong>${teamNames[winningTeam]}</strong> wins the attendance goal!`;
    greeting.className = "success-message celebration-message";
  }

  greeting.innerHTML = message;
  greeting.style.display = "block";

  form.reset();
});
