
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
  var validateButton = document.getElementById("validateButton");
  var reviewButton = document.getElementById("reviewButton");
  var resetButton = document.querySelector("input[type='reset']");
  var form = document.getElementById("patientForm");

  addTextValidation("firstName", validateFirstName);
  addTextValidation("middleInitial", validateMiddleInitial);
  addTextValidation("lastName", validateLastName);
  addTextValidation("dob", validateBirthDate);
  addTextValidation("ssn", validateSsn);
  addTextValidation("address1", validateAddress1);
  addTextValidation("address2", validateAddress2);
  addTextValidation("city", validateCity);
  addTextValidation("zip", validateZip);
  addTextValidation("email", validateEmail);
  addTextValidation("phone", validatePhone);
  addTextValidation("userId", validateUserId);
  addTextValidation("password", validatePasswords);
  addTextValidation("confirmPassword", validatePasswords);
  addTextValidation("otherReason", validateOtherReason);
  addTextValidation("age", validateAge);

  document.getElementById("state").addEventListener("change", validateState);
  document.getElementById("screenTime").addEventListener("input", updateScreenTime);
  document.getElementById("screenTime").addEventListener("change", validateScreenTime);

  addRadioValidation("insurance", validateInsurance);
  addRadioValidation("newPatient", validateNewPatient);
  addRadioValidation("gender", validateGender);
  addCheckboxValidation("reason", validateReasons);

  validateButton.addEventListener("click", validateAndShowSubmit);
  reviewButton.addEventListener("click", reviewForm);
  resetButton.addEventListener("click", resetFormMessages);
  form.addEventListener("submit", validateBeforeSubmit);
}

function addTextValidation(fieldId, validationFunction) {
  var field = document.getElementById(fieldId);

  field.addEventListener("input", function () {
    validationFunction();
    hideSubmitButton();
  });

  field.addEventListener("blur", function () {
    validationFunction();
    hideSubmitButton();
  });
}

function addRadioValidation(name, validationFunction) {
  var fields = document.querySelectorAll("input[name='" + name + "']");

  fields.forEach(function (field) {
    field.addEventListener("change", function () {
      validationFunction();
      hideSubmitButton();
    });
  });
}

function addCheckboxValidation(name, validationFunction) {
  var fields = document.querySelectorAll("input[name='" + name + "']");

  fields.forEach(function (field) {
    field.addEventListener("change", function () {
      validationFunction();
      hideSubmitButton();
    });
  });
}

function setError(errorId, message) {
  document.getElementById(errorId).textContent = message;
  return message === "";
}

function hideSubmitButton() {
  document.getElementById("submitButton").classList.remove("ready");
}

function showSubmitButton() {
  document.getElementById("submitButton").classList.add("ready");
}

function updateScreenTime() {
  var screenTime = document.getElementById("screenTime").value;
  var label = screenTime === "12" ? "12+ hrs" : screenTime + " hrs";

  document.getElementById("screenTimeValue").textContent = label;
  hideSubmitButton();
}

function validateFirstName() {
  var value = document.getElementById("firstName").value.trim();

  if (!/^[A-Za-z'-]{1,30}$/.test(value)) {
    return setError("firstNameError", "First name must be 1 to 30 letters. Apostrophes and dashes are allowed.");
  }

  return setError("firstNameError", "");
}

function validateMiddleInitial() {
  var value = document.getElementById("middleInitial").value.trim();

  if (value !== "" && !/^[A-Za-z]$/.test(value)) {
    return setError("middleInitialError", "Middle initial must be one letter or blank.");
  }

  return setError("middleInitialError", "");
}

function validateLastName() {
  var value = document.getElementById("lastName").value.trim();

  if (!/^[A-Za-z'-]{1,30}$/.test(value)) {
    return setError("lastNameError", "Last name must be 1 to 30 letters. Apostrophes and dashes are allowed.");
  }

  return setError("lastNameError", "");
}

function validateBirthDate() {
  var dob = document.getElementById("dob");

  if (dob.value === "") {
    return setError("dobError", "Date of birth is required.");
  }

  if (dob.value < dob.min || dob.value > dob.max) {
    return setError("dobError", "Date must not be in the future or more than 120 years ago.");
  }

  return setError("dobError", "");
}

function validateSsn() {
  var ssn = document.getElementById("ssn");
  var digits = ssn.value.replace(/\D/g, "");

  ssn.value = digits;

  if (!/^[0-9]{9}$/.test(digits)) {
    return setError("ssnError", "Enter exactly 9 digits. Do not use your real SSN for testing.");
  }

  return setError("ssnError", "");
}

function validateAddress1() {
  var value = document.getElementById("address1").value.trim();

  if (value.length < 2 || value.length > 30) {
    return setError("address1Error", "Address line 1 must be 2 to 30 characters.");
  }

  return setError("address1Error", "");
}

function validateAddress2() {
  var value = document.getElementById("address2").value.trim();

  if (value !== "" && (value.length < 2 || value.length > 30)) {
    return setError("address2Error", "Address line 2 must be blank or 2 to 30 characters.");
  }

  return setError("address2Error", "");
}

function validateCity() {
  var value = document.getElementById("city").value.trim();

  if (!/^[A-Za-z .'-]{2,30}$/.test(value)) {
    return setError("cityError", "City must be 2 to 30 characters.");
  }

  return setError("cityError", "");
}

function validateState() {
  var value = document.getElementById("state").value;

  if (value === "") {
    return setError("stateError", "Please choose a state.");
  }

  return setError("stateError", "");
}

function validateZip() {
  var zip = document.getElementById("zip");
  zip.value = zip.value.replace(/\D/g, "").substring(0, 5);

  if (!/^[0-9]{5}$/.test(zip.value)) {
    return setError("zipError", "ZIP code must be exactly 5 digits.");
  }

  return setError("zipError", "");
}

function validateEmail() {
  var email = document.getElementById("email");
  email.value = email.value.toLowerCase();

  if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email.value)) {
    return setError("emailError", "Email must be in the format name@domain.tld.");
  }

  return setError("emailError", "");
}

function validatePhone() {
  var phone = document.getElementById("phone");
  var digits = phone.value.replace(/\D/g, "").substring(0, 10);

  if (digits.length >= 7) {
    phone.value = digits.substring(0, 3) + "-" + digits.substring(3, 6) + "-" + digits.substring(6);
  } else {
    phone.value = digits;
  }

  if (!/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(phone.value)) {
    return setError("phoneError", "Phone must be in this format: 000-000-0000.");
  }

  return setError("phoneError", "");
}

function validateUserId() {
  var userId = document.getElementById("userId");
  userId.value = userId.value.toLowerCase();

  if (!/^[a-z][a-z0-9_-]{4,19}$/.test(userId.value)) {
    return setError("userIdError", "User ID must be 5 to 20 characters, start with a letter, and use only letters, numbers, dash, or underscore.");
  }

  return setError("userIdError", "");
}

function getPasswordRuleMessage(password) {
  var missingRules = [];

  if (password.length < 8) {
    missingRules.push("at least 8 characters");
  }

  if (!/[A-Z]/.test(password)) {
    missingRules.push("1 uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    missingRules.push("1 lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    missingRules.push("1 number");
  }

  if (password.indexOf('"') !== -1 || password.indexOf("'") !== -1) {
    missingRules.push("no quotation marks");
  }

  if (missingRules.length > 0) {
    return "Password needs: " + missingRules.join(", ") + ".";
  }

  return "";
}

function validatePasswords() {
  var firstName = document.getElementById("firstName").value.toLowerCase();
  var lastName = document.getElementById("lastName").value.toLowerCase();
  var userId = document.getElementById("userId").value.toLowerCase();
  var password = document.getElementById("password").value;
  var confirmPassword = document.getElementById("confirmPassword").value;
  var passwordLower = password.toLowerCase();
  var message = getPasswordRuleMessage(password);
  var valid = true;

  if (message !== "") {
    setError("passwordError", message);
    valid = false;
  } else if (passwordLower === userId && userId !== "") {
    setError("passwordError", "Password cannot equal your user ID.");
    valid = false;
  } else if (firstName !== "" && passwordLower.indexOf(firstName) !== -1) {
    setError("passwordError", "Password cannot contain your first name.");
    valid = false;
  } else if (lastName !== "" && passwordLower.indexOf(lastName) !== -1) {
    setError("passwordError", "Password cannot contain your last name.");
    valid = false;
  } else {
    setError("passwordError", "");
  }

  if (confirmPassword === "" || password !== confirmPassword) {
    setError("confirmPasswordError", "Passwords must match.");
    valid = false;
  } else {
    setError("confirmPasswordError", "");
  }

  return valid;
}

function validateOtherReason() {
  var value = document.getElementById("otherReason").value;

  if (value.indexOf('"') !== -1 || /<[^>]*>/.test(value)) {
    return setError("otherReasonError", "Do not use double quotes or HTML tags.");
  }

  return setError("otherReasonError", "");
}

function validateReasons() {
  var checked = document.querySelectorAll("input[name='reason']:checked");

  if (checked.length === 0) {
    return setError("reasonError", "Choose at least one reason for your visit.");
  }

  return setError("reasonError", "");
}

function validateInsurance() {
  return validateRadioGroup("insurance", "insuranceError", "Choose an insurance answer.");
}

function validateNewPatient() {
  return validateRadioGroup("newPatient", "newPatientError", "Choose a new patient answer.");
}

function validateGender() {
  return validateRadioGroup("gender", "genderError", "Choose a gender option.");
}

function validateRadioGroup(name, errorId, message) {
  var selected = document.querySelector("input[name='" + name + "']:checked");

  if (!selected) {
    return setError(errorId, message);
  }

  return setError(errorId, "");
}

function validateScreenTime() {
  var value = Number(document.getElementById("screenTime").value);

  if (value < 0 || value > 12) {
    return setError("screenTimeError", "Screen time must be between 0 and 12 hours.");
  }

  return setError("screenTimeError", "");
}

function validateAge() {
  var value = document.getElementById("age").value;

  if (value !== "" && (Number(value) < 1 || Number(value) > 120)) {
    return setError("ageError", "Age must be blank or between 1 and 120.");
  }

  return setError("ageError", "");
}

function validateAllFields(showSubmit) {
  var checks = [
    validateFirstName(),
    validateMiddleInitial(),
    validateLastName(),
    validateBirthDate(),
    validateSsn(),
    validateAddress1(),
    validateAddress2(),
    validateCity(),
    validateState(),
    validateZip(),
    validateEmail(),
    validatePhone(),
    validateUserId(),
    validatePasswords(),
    validateOtherReason(),
    validateReasons(),
    validateInsurance(),
    validateNewPatient(),
    validateGender(),
    validateScreenTime(),
    validateAge()
  ];
  var errorCount = checks.filter(function (result) {
    return result === false;
  }).length;

  if (errorCount === 0 && showSubmit) {
    showSubmitButton();
    return true;
  }

  hideSubmitButton();
  return errorCount === 0;
}

function validateAndShowSubmit() {
  var valid = validateAllFields(true);

  if (!valid) {
    alert("Please fix the errors on the form before submitting.");
  }
}

function validateBeforeSubmit(event) {
  if (!validateAllFields(false)) {
    event.preventDefault();
    alert("Please validate the form and fix all errors before submitting.");
  }
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
  var reviewContent = document.getElementById("reviewContent");

  if (!validateAllFields(false)) {
    alert("Please fix the errors before reviewing the form.");
    return;
  }

  reviewContent.innerHTML = "";
  addReviewLine(reviewContent, "First Name", document.getElementById("firstName").value);
  addReviewLine(reviewContent, "Middle Initial", document.getElementById("middleInitial").value || "Blank");
  addReviewLine(reviewContent, "Last Name", document.getElementById("lastName").value);
  addReviewLine(reviewContent, "Date of Birth", document.getElementById("dob").value);
  addReviewLine(reviewContent, "Social Security", "Hidden for privacy");
  addReviewLine(reviewContent, "Email", document.getElementById("email").value);
  addReviewLine(reviewContent, "Phone", document.getElementById("phone").value);
  addReviewLine(reviewContent, "Address Line 1", document.getElementById("address1").value);
  addReviewLine(reviewContent, "Address Line 2", document.getElementById("address2").value || "Blank");
  addReviewLine(reviewContent, "City", document.getElementById("city").value);
  addReviewLine(reviewContent, "State", document.getElementById("state").value);
  addReviewLine(reviewContent, "ZIP Code", document.getElementById("zip").value);
  addReviewLine(reviewContent, "Reasons for Visit", getCheckedReasons());
  addReviewLine(reviewContent, "Other Reason", document.getElementById("otherReason").value || "Blank");
  addReviewLine(reviewContent, "Health Insurance", getRadioValue("insurance"));
  addReviewLine(reviewContent, "New Patient", getRadioValue("newPatient"));
  addReviewLine(reviewContent, "Gender", getRadioValue("gender"));
  addReviewLine(reviewContent, "Average Daily Screen Time", document.getElementById("screenTimeValue").textContent);
  addReviewLine(reviewContent, "Age", document.getElementById("age").value || "Blank");
  addReviewLine(reviewContent, "Desired User ID", document.getElementById("userId").value);
  addReviewLine(reviewContent, "Password", "Hidden for privacy");
}

function resetFormMessages() {
  setTimeout(function () {
    var errors = document.querySelectorAll(".error-message");

    errors.forEach(function (error) {
      error.textContent = "";
    });

    updateScreenTime();
    hideSubmitButton();
    document.getElementById("reviewContent").innerHTML = "<p>Your entered information will appear here after you click Review.</p>";
  }, 0);
}
