//get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");

//track attendance
let count = 0;
const maxCount = 50;

//Handel form submission
form.addEventListener("submit", function (event) {
  //prevent the webpage to refresh
  event.preventDefault();

  //get form value
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, team, teamName);

  //Increment the count
  count++;
  console.log("Total check-ins: " + count);
  attendeeCount.textContent = count;

  //update progess bar
  const procentage = Math.round((count / maxCount) * 100) + "%";
  console.log(`Progress: ${procentage}`);
  progressBar.style.width = procentage;

  //update the team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  //show welcome message
  const message = `Welcome ${name}! You are checked in to ${teamName}.`;
  greeting.textContent = message;
  greeting.style.display = "block";

  form.reset();
});
