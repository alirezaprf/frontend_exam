//set cookie
function setCookie(name, value, days) {
	const expires = new Date();
	expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
	document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}
//get cookies
function getCookie(name) {
	const cookieName = `${name}=`;
	const decodedCookie = decodeURIComponent(document.cookie);
	const cookieArray = decodedCookie.split(";");

	for (let i = 0; i < cookieArray.length; i++) {
		let cookie = cookieArray[i].trim();
		if (cookie.indexOf(cookieName) === 0) {
			return cookie.substring(cookieName.length, cookie.length);
		}
	}

	return null;
}

function deleteCookie(name) {
	document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

function setLocalStorageItem(key, value) {
	localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorageItem(key) {
	const storedValue = localStorage.getItem(key);
	return storedValue ? JSON.parse(storedValue) : null;
}

function removeLocalStorageItem(key) {
	localStorage.removeItem(key);
}
//save user input data 
function saveData() {
	const name = getValue("name");
	const male = getChecked("male");
	const female = getChecked("female");
	const value = male ? 0 : (female ? 1 : null);
	if (value != null) {
		setLocalStorageItem(name, value); // save in local storage
    console.log("saved")
	}
}
//set error label
function vay_error(err){
  document.getElementById('error_label').innerHTML = err
}
//check gender from api 
function submitData() {
	const name = getValue("name")

	//using fetch to call the api and then transform json to  object and user gender & probability valuse  
  fetch(`https://api.genderize.io/?name=${name}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          const gender = data['gender']
          document.getElementById('prediction_class_label').innerHTML =  gender ;
			    document.getElementById('prediction_val_label').innerHTML =  `${data['probability']}`;
          setValue("prediction", "fetched");
          if (gender === 'male') {
            setChecked('male' , true)
          }
          
          else if (gender === 'female') {
            setChecked('female' , true)
          }
          else{
            document.getElementById('prediction_class_label').innerHTML =  'alien' ;
            setChecked('male' , false)
            setChecked('female' , false)
          }


          console.log('Data from API:', data);
        })
        .catch(error => {
          // Handle errors
          vay_error(error.toString())
        }).finally(() => {
          // Introduce a 1-second delay using setTimeout
          setTimeout(() => {
            console.log('1-second timeout completed.');
          }, 1000);
        });

	console.log("Data submitted");
}
function setValue(name, value) {
	document.getElementById(name).value = value;
}
function setChecked(name, checked) {
	document.getElementById(name).checked = checked;
}

function getValue(name) {
	return document.getElementById(name).value;
}
function getChecked(name) {
	return document.getElementById(name).checked;
}
//clear results to its initial state
function clearResults(){
  setValue("prediction", "not found");
  setValue("prediction_val_label", "");
  document.getElementById('prediction_class_label').innerHTML =  "";
  document.getElementById('prediction_val_label').innerHTML =  "";
  setChecked("female", false);
  setChecked("male", false);
  document.getElementById('error_label').innerHTML = ""
}
function clearPrediction() {
  const name = getValue("name");
  removeLocalStorageItem(name);
  clearResults()

}
//input change
function ontextChange() {
	const name = document.getElementById("name").value;
	console.log();
	const cookie_value = getCookie(name);
	const localStorage_value = getLocalStorageItem(name);
  
	if (cookie_value != null || localStorage_value != null) {
    console.log("found");
    console.log(cookie_value , localStorage_value)
	/* -------------------------------------------------------------------------- */
	/*               check local storage and cookies to find a match              */
	/* -------------------------------------------------------------------------- */
		if (cookie_value === 0 || localStorage_value === 0) {
			setValue("prediction", "Saved Answer");
			setChecked("male", true);
			document.getElementById('prediction_class_label').innerHTML =  "Male";
			document.getElementById('prediction_val_label').innerHTML =  "";

		}

		if (cookie_value === 1 || localStorage_value === 1) {
			setValue("prediction", "Saved Answer");
			setChecked("female", true);
			document.getElementById('prediction_class_label').innerHTML =  "Female";
			document.getElementById('prediction_val_label').innerHTML =  "";
		}
	} else {
		// console.log("Not found");
      clearResults()



      

	}
}
