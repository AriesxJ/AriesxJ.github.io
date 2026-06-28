alert("JavaScript connected?");

window.onload = function () {
  displayTodayDate();
  setBirthDateRange();
  setupEventListeners();
};

function displayTodayDate() {
  var today = new Date();
  document.getElementById("todayDate").textContent = today.toLocaleDateString();
}

function formatDateForInput(dateValue) {
  var year = dateValue.getFullYear();
  var month = String(dateValue.getMonth() + 1).padStart(2, "0");
  var day = String(dateValue.getDate()).padStart(2, "0");

  return year + "-" + month + "-" + day;
}

function setBirthDateRange() {
  var today = new Date();
  var oldestDate = new Date();
  var dob = document.getElementById("dob");

  oldestDate.setFullYear(today.getFullYear() - 120);

  dob.max = formatDateForInput(today);
  dob.min = formatDateForInput(oldestDate);
}

function setupEventListeners() {
  var form = document.getElementById("patientForm");
  var screenTime = document.getElementById("screenTime");
  var reviewButton = document.getElementById("reviewButton");
  var userId = document.getElementById("userId");

  screenTime.addEventListener("input", updateScreenTime);
  reviewButton.addEventListener("click", reviewForm);
  userId.addEventListener("blur", makeUserIdLowercase);
  form.addEventListener("submit", validateBeforeSubmit);
  form.addEventListener("reset", resetFormMessages);
}

function updateScreenTime() {
  var screenTime = document.getElementById("screenTime").value;
  var label = screenTime === "12" ? "12+ hrs" : screenTime + " hrs";

  document.getElementById("screenTimeValue").textContent = label;
}

function makeUserIdLowercase() {
  var userId = document.getElementById("userId");

  userId.value = userId.value.toLowerCase();
}

function clearErrors() {
  document.getElementById("firstNameError").textContent = "";
  document.getElementById("dobError").textContent = "";
  document.getElementById("userIdError").textContent = "";
  document.getElementById("passwordError").textContent = "";
  document.getElementById("confirmPasswordError").textContent = "";
}

function validateOtherReason() {
  var otherReason = document.getElementById("otherReason").value;

  if (otherReason.indexOf('"') !== -1) {
    alert("Please remove double quotes from the other reason box.");
    return false;
  }

  return true;
}

function validatePasswords() {
  var firstName = document.getElementById("firstName").value.toLowerCase();
  var lastName = document.getElementById("lastName").value.toLowerCase();
  var userId = document.getElementById("userId").value.toLowerCase();
  var password = document.getElementById("password").value;
  var confirmPassword = document.getElementById("confirmPassword").value;
  var passwordLower = password.toLowerCase();
  var passwordError = document.getElementById("passwordError");
  var confirmPasswordError = document.getElementById("confirmPasswordError");
  var isValid = true;

  if (password.indexOf('"') !== -1 || password.indexOf("'") !== -1) {
    passwordError.textContent = "Password cannot contain quotation marks.";
    isValid = false;
  }

  if (password !== confirmPassword) {
    confirmPasswordError.textContent = "Passwords do not match.";
    isValid = false;
  }

  if (userId !== "" && passwordLower.indexOf(userId) !== -1) {
    passwordError.textContent = "Password cannot contain your user ID.";
    isValid = false;
  }

  if (firstName !== "" && passwordLower.indexOf(firstName) !== -1) {
    passwordError.textContent = "Password cannot contain your first name.";
    isValid = false;
  }

  if (lastName !== "" && passwordLower.indexOf(lastName) !== -1) {
    passwordError.textContent = "Password cannot contain your last name.";
    isValid = false;
  }

  return isValid;
}

function validateBirthDate() {
  var dob = document.getElementById("dob");
  var dobError = document.getElementById("dobError");

  if (dob.value === "") {
    dobError.textContent = "Date of birth is required.";
    return false;
  }

  if (dob.value < dob.min || dob.value > dob.max) {
    dobError.textContent = "Date of birth must be within the allowed range.";
    return false;
  }

  return true;
}

function validateBeforeSubmit(event) {
  var form = document.getElementById("patientForm");
  var passwordsOk;
  var dateOk;
  var otherReasonOk;

  clearErrors();
  makeUserIdLowercase();

  passwordsOk = validatePasswords();
  dateOk = validateBirthDate();
  otherReasonOk = validateOtherReason();

  if (!form.checkValidity() || !passwordsOk || !dateOk || !otherReasonOk) {
    event.preventDefault();
    form.reportValidity();
  }

function getCheckedReasons() {
  var checkedBoxes = document.querySelectorAll("input[name='reason']:checked");
  var values = [];

  checkedBoxes.forEach(function (box) {
    values.push(box.value);
  });

  return values.length > 0 ? values.join(", ") : "None selected";
}

function getRadioValue(name) {
  var selected = document.querySelector("input[name='" + name + "']:checked");

  return selected ? selected.value : "Not selected";
}

function getTruncatedZip() {
  var zip = document.getElementById("zip").value;

  return zip.substring(0, 5);
}

function addReviewLine(parent, label, value) {
  var line = document.createElement("div");
  var labelSpan = document.createElement("span");
  var valueSpan = document.createElement("span");

  line.className = "review-line";
  labelSpan.textContent = label + ": ";
  labelSpan.className = "review-label";
  valueSpan.textContent = value;

  line.appendChild(labelSpan);
  line.appendChild(valueSpan);
  parent.appendChild(line);
}

function reviewForm() {
  var form = document.getElementById("patientForm");
  var reviewContent = document.getElementById("reviewContent");
  var otherReason = document.getElementById("otherReason").value;
  var screenTime = document.getElementById("screenTimeValue").textContent;
  var passwordsOk;
  var dateOk;
  var otherReasonOk;

  clearErrors();
  makeUserIdLowercase();

  passwordsOk = validatePasswords();
  dateOk = validateBirthDate();
  otherReasonOk = validateOtherReason();

  if (!form.checkValidity() || !passwordsOk || !dateOk || !otherReasonOk) {
    form.reportValidity();
    return;
  }

  reviewContent.innerHTML = "";

  addReviewLine(reviewContent, "First Name", document.getElementById("firstName").value);
  addReviewLine(reviewContent, "Middle Initial", document.getElementById("middleInitial").value || "Blank");
  addReviewLine(reviewContent, "Last Name", document.getElementById("lastName").value);
  addReviewLine(reviewContent, "Date of Birth", document.getElementById("dob").value);
  addReviewLine(reviewContent, "Patient ID Number", "Hidden for privacy");
  addReviewLine(reviewContent, "Email", document.getElementById("email").value);
  addReviewLine(reviewContent, "Phone", document.getElementById("phone").value);
  addReviewLine(reviewContent, "Address Line 1", document.getElementById("address1").value);
  addReviewLine(reviewContent, "Address Line 2", document.getElementById("address2").value || "Blank");
  addReviewLine(reviewContent, "City", document.getElementById("city").value);
  addReviewLine(reviewContent, "State", document.getElementById("state").value);
  addReviewLine(reviewContent, "ZIP Code", getTruncatedZip());
  addReviewLine(reviewContent, "Reasons for Visit", getCheckedReasons());
  addReviewLine(reviewContent, "Other Reason", otherReason || "Blank");
  addReviewLine(reviewContent, "Health Insurance", getRadioValue("insurance"));
  addReviewLine(reviewContent, "New Patient", getRadioValue("newPatient"));
  addReviewLine(reviewContent, "Gender", getRadioValue("gender"));
  addReviewLine(reviewContent, "Average Daily Screen Time", screenTime);
  addReviewLine(reviewContent, "Age", document.getElementById("age").value || "Blank");
  addReviewLine(reviewContent, "Desired User ID", document.getElementById("userId").value);
  addReviewLine(reviewContent, "Social Security", "Hidden for privacy");
  addReviewLine(reviewContent, "Password", "Hidden for privacy");
}

function resetFormMessages() {
  setTimeout(function () {
    clearErrors();
    updateScreenTime();
    document.getElementById("reviewContent").innerHTML = "<p>Your entered information will appear here after you click Review.</p>";
  }, 0);
}
