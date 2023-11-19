
//todo ===========================> LOADING SCREAN
$(document).ready(function () {
    $(".fa-spin").fadeOut(900, function () {
        $(".loading-screen").fadeOut(900, function () {
            $("body").css("overflow", "auto");
        })
    });
})
$(window).ajaxStart(function() {
    $(".inner-loading-screen").fadeIn(500);
});
$(window).ajaxStop(function() {
    $(".inner-loading-screen").fadeOut(500);
});

$("#rowData").ready(function () {
    $(".fa-spin").fadeOut(900, function () { 
        $(".inner-loading-screen").fadeOut(900);
    })
})




// async function getMeals(endPoint, meal = "", num = "") {
//     const jqXHR = $.ajax({
//         url: `https://www.themealdb.com/api/json/v1/1/${endPoint}${meal}`,
//         method: 'GET',
//         dataType: 'json'
//     });
 
//     jqXHR.done(function(data) {
//         mealsData = data.meals;
//         if (mealsData != null) {
//             if (!num) {
//                 displayMeals(data.meals);
//             } else {
//                 displayMeals(data.meals.slice(0,num))
//             }
//         }
//     });
 
//     jqXHR.ajaxStart(function() {
//         $(".inner-loading-screen").fadeIn(500);
//     });
 
//     jqXHR.ajaxStop(function() {
//         $(".inner-loading-screen").fadeOut(500);
//     });
//  }
 

//! ===================================> HTML VARIABLES 
const rowData = document.getElementById("rowData");


//! ====================================> APP VARIABLES
let mealsData = "";
let mainIndex = 0;
let mainId = 0;

//todo ===============================> OPEN AND CLOSE NAV BAR MENU

$(".open-close-icon").click(function () {
    if ($(".side-nav-menu").css("left") != "0px") {
        $(".side-nav-menu").animate({ "left": "0px" }, 500);
        $(".open-close-icon").removeClass("fa-solid fa-bars");
        $(".open-close-icon").addClass("fa-solid fa-xmark");
        $(".links ul li").eq(0).animate({ "top": "0px" }, 500);
        $(".links ul li").eq(1).animate({ "top": "0px" }, 650);
        $(".links ul li").eq(2).animate({ "top": "0px" }, 800);
        $(".links ul li").eq(3).animate({ "top": "0px" }, 950);
        $(".links ul li").eq(4).animate({ "top": "0px" }, 1100);
    } else {
        closeNav();
    }
})

//?================================> FETCH DATA OF MEALS


async function getMeals(endPoint, meal = "", num = "") {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/${endPoint}${meal}`);
    const data = await response.json();
    mealsData = data.meals;
    if (mealsData != null) {
        if (!num) {
        displayMeals(data.meals);
        } else {
            displayMeals(data.meals.slice(0,num))
        }
        
    }
}


getMeals("search.php?s=", "");



//?================================> DISPLAY MEALS ON FIRST PAGE
function displayMeals(data) {
    let meals = "";
    for (let i = 0; i < data.length; i++){
        mainIndex = i;
        meals += ` <div class="col-md-3">
        <div class="meal position-relative cursor-pointer overflow-hidden rounded-2" onclick="getMealDetails(${mealsData[mainIndex].idMeal})">
            <img class="w-100" src="${data[i].strMealThumb}" alt="Meal Picture">
            <div class="meal-layer position-absolute p-2 text-black d-flex align-items-center">
                <h3>${data[i].strMeal}</h3>
            </div>
        </div>
    </div>`
    }
    
    rowData.innerHTML = meals;
}


//todo ============================> SHOW MEALS DEATILS ON CLICK
async function getMealDetails(id) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    let mealDetails = data.meals[0];
    const mealIngeredient = Object.values(mealDetails).slice(9, 29).filter(e => e);
    
    const mealMeasures = Object.values(mealDetails).slice(29, 49).filter(m => m);
   
    let final = "";

    for (let j = 0; j < mealIngeredient.length; j++){
        final += mealMeasures[j] + " " + mealIngeredient[j] + ",";
    }

    finish = final.split(",",).filter(n => n)

    closeNav();

    rowData.innerHTML = ` <div class="col-md-4">
    <div class="meal-img overflow-hidden">
        <img class="w-100 rounded-3" src="${mealDetails.strMealThumb}" alt="Meal Picture">
        <h2>${mealDetails.strMeal}</h2>
    </div>
</div>
<div class="col-md-8">
   <div class="meal-details">
    <h2>Instructions</h2>
    <p>${mealDetails.strInstructions}</p>
    <h3>Area : ${mealDetails.strArea}</h3>
    <h3>Category : ${mealDetails.strCategory}</h3>
    <h3>Recipes : </h3>
    <ul class="list-unstyled d-flex flex-wrap g-3">
    ${finish.map((y) => `<li class="alert alert-info p-1 m-2">${y}</li>`).join("")}
    </ul>
    <h3>Tags : </h3>
    <ul class="list-unstyled d-flex flex-wrap g-3">
        ${(mealDetails.strTags == null ? "" : mealDetails.strTags).split(",",).filter(b => b).map((a) => `<li class="alert alert-danger p-1 m-2">${a}</li>` ).join("")}
        
    </ul>
    <a target="_blank" class="btn btn-success" href="${mealDetails.strSource}">Source</a>
    <a target="_blank" class="btn btn-danger" href="${mealDetails.strYoutube}">Youtube</a>
   </div>
</div>`;
    
}


//! ==================================> CLOSE NAV
function closeNav() {
    $(".side-nav-menu").animate({ "left": "-241.429px" }, 500);
        $(".open-close-icon").removeClass("fa-solid fa-xmark");
        $(".open-close-icon").addClass("fa-solid fa-bars");
        $(".links ul li").animate({ "top": "300px" }, 400);
}

//!====================================> SEARCH LINK
for (let i = 0; i < 5; i++){
    $(".links ul li").eq(i).click(closeNav);
    $(".links ul li").eq(i).click(function () {
        $("#rowData").html("");
    });
}
for (let i = 0; i < 4; i++){
    $(".links ul li").not($(".links ul li").eq(0)).click(function () {
        $("#searchContainer").html("");
    })
}

$(".links ul li").eq(0).click(showSearchInputs);
$(".links ul li").eq(1).click(getCategories);
$(".links ul li").eq(2).click(getAreas);
$(".links ul li").eq(3).click(getIngredients);
$(".links ul li").eq(4).click(contact);




//! ==================================> SEARCH MEALS
function showSearchInputs(){
    $("#searchContainer").html(` <div class="row pt-4">
    <div class="col-md-6">
    <div class="mb-lg-0 mb-4 px-4">
    <input id="searchNameInput" type="text" class="form-control bg-transparent text-white" placeholder="Search By Name">
    </div>
</div>
<div class="col-md-6">
    <div class="mb-lg-0 mb-4 px-4">
    <input id="searchLetterInput" type="text" class="form-control bg-transparent text-white" maxlength="1" placeholder="Search By First Letter">
    </div>

</div>
    </div>  
    
`);
    
    
    const searchNameInput = document.getElementById("searchNameInput");
    const searchLetterInput = document.getElementById("searchLetterInput");
    
        searchNameInput.addEventListener("keyup", function () {
            getMeals("search.php?s=", searchNameInput.value)
        })
        
        searchLetterInput.addEventListener("keyup", function () {
            getMeals("search.php?f=", searchLetterInput.value)
        })
    
}
//! =================================> CATEGORIES
async function getCategories() {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    const data = await response.json();
    showCategories(data.categories);
}
function showCategories(data) {
      let categoriesList = "";
    for (let i = 0; i < data.length; i++){
        categoriesList += `<div class="col-md-3">
        <div class="meal position-relative overflow-hidden cursor-pointer rounded-2" >
            <img src="${data[i].strCategoryThumb}" class="w-100" alt="Category Picture">
            <div class="meal-layer position-absolute text-center text-black p-2">
                <h3>${data[i].strCategory}</h3>
                <p>${data[i].strCategoryDescription.split(/[.;]/).slice(0,1)}</p>
            </div>
        </div>
    </div>`
    }

    rowData.innerHTML = categoriesList;
    const mealsCategories = document.querySelectorAll(".meal");
    for (let j = 0; j < mealsCategories.length; j++){
        mealsCategories[j].addEventListener("click", async function () {
            let categoryId = mealsCategories[j].querySelector('h3').innerHTML;
            await getMeals("filter.php?c=", categoryId , 20);
        })
    }
}



//!============================>  AREA
async function getAreas() {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    const data = await response.json();
    showAreas(data.meals);
}

function showAreas(data) {
    let areasList = "";
    for (let i = 0; i < data.length; i++){
        areasList += `<div class="col-md-3">
        <div class="area cursor-pointer text-center rounded-2" >
        <i class="fa-solid fa-house-laptop fa-4x"></i>
           <h3>${data[i].strArea}</h3>
    </div>
    </div>`
    }

    rowData.innerHTML = areasList;

    const areasMeals = document.querySelectorAll(".area");

    for (let j = 0; j < areasMeals.length; j++){
        areasMeals[j].addEventListener("click", async function () {
            let areaName = areasMeals[j].querySelector('h3').innerHTML;
            await getMeals("filter.php?a=", areaName , 20);
        })
    }
}




//!  ==============================> INGREDIENTS
async function getIngredients() {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    const data = await response.json();
    showIngredients(data.meals.slice(0,20));
}

function showIngredients(data) {
    let ingredients = "";
    for (let i = 0; i < data.length; i++){
        ingredients += `<div class="col-md-3">
        <div class="ingredient cursor-pointer text-center rounded-2" >
        <i class="fa-solid fa-drumstick-bite fa-4x" fa-4x"></i>
           <h3>${data[i].strIngredient}</h3>
           <p>${data[i].strDescription.split(/[.;,]/).slice(0,2).join("")}</p>
           
    </div>
    </div>`
    }
    rowData.innerHTML = ingredients;

    const ingredient = document.querySelectorAll(".ingredient");

    for (let j = 0; j < ingredient.length; j++){
        ingredient[j].addEventListener("click", async function () {
            let ingredientName = ingredient[j].querySelector('h3').innerHTML;
            await getMeals("filter.php?i=", ingredientName ,20);
        })
    }
}



//!=================================> CONTACT US
const nameRegex = /^[a-zA-Z]{2,20}$/;

const emailRegex = /^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$/;

const phoneRegex = /^01[0125][0-9]{8}$/;

const ageRegex = /^[1-9]{1}[0-9]?$/;

const passwordRegex = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-zA-Z]).*$/;

function contact() {
    $("#rowData").html(`
    <div class="contact d-flex justify-content-center align-items-center min-vh-100">
                    <div class="container text-center">
                        <div class="row g-4">
                            <div class="col-md-6">
                                <input id="nameInput" type="text" class="form-control" placeholder="Enter Your Name">
                                <div class="alert alert-danger w-100 d-none my-2">Special characters and numbers not allowed</div>
                            </div>
                            <div class="col-md-6">
                                <input id="emailInput" type="email" class="form-control" placeholder="Enter Your Email">
                                <div class="alert alert-danger w-100 d-none my-2">Email not valid *exemple@yyy.zzz</div>
                            </div>
                            <div class="col-md-6">
                                <input id="phoneInput" type="text" class="form-control" placeholder="Enter Your Phone">
                                <div class="alert alert-danger w-100 d-none my-2">Enter valid Phone Number</div>
                            </div>
                            <div class="col-md-6">
                                <input id="ageInput" type="number" class="form-control" placeholder="Enter Your Age">
                                <div class="alert alert-danger w-100 d-none my-2">Enter valid age</div>
                            </div>
                            <div class="col-md-6">
                                <input id="passwordInput" type="password" class="form-control" placeholder="Enter Your Password">
                                <div class="alert alert-danger w-100 d-none my-2c">Enter valid password *Minimum eight characters, at least one letter and one number:*</div>
                            </div>
                            <div class="col-md-6">
                                <input id="repasswordInput" type="password" class="form-control" placeholder="Enter valid repassword">
                                <div class="alert alert-danger w-100 d-none my-2">Enter valid repassword</div>
                            </div>
                            
                        </div>
                        <button id="submitBtn" class="btn btn-outline-danger px-2 my-3" disabled>submit</button>
                    </div>
                </div>
    `);

    const allInputs = document.querySelectorAll("input");
const submitBtn = document.getElementById("submitBtn");

// Initialize the validation array
const validationResults = Array.from({ length: allInputs.length }, () => true);


for (let i = 0; i < allInputs.length; i++) {
  allInputs[i].addEventListener("keyup", validateInputs);
}

function validateInputs(e) {
  let isValid = true;

  if (e.target.id === "nameInput") {
    isValid = validate(nameRegex, nameInput);
  } else if (e.target.id === "emailInput") {
    isValid = validate(emailRegex, emailInput);
  } else if (e.target.id === "phoneInput") {
    isValid = validate(phoneRegex, phoneInput);
  } else if (e.target.id === "ageInput") {
    isValid = validate(ageRegex, ageInput);
  } else if (e.target.id === "passwordInput") {
    isValid = validate(passwordRegex, passwordInput);
  } else if (e.target.id === "repasswordInput") {
    isValid = repasswordValidate(repasswordInput, passwordInput);
  }

  // Update the validation result for the current input field
  validationResults[Array.from(allInputs).indexOf(e.target)] = isValid;

  // Check if all input fields are valid
  const isAllValid = validationResults.every((result) => result);

  if (isAllValid) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", "disabled");
  }
}

function validate(regex, element) {
  if (regex.test(element.value)) {
    element.nextElementSibling.classList.replace("d-block", "d-none");
  } else {
    element.nextElementSibling.classList.replace("d-none", "d-block");
  }
  return regex.test(element.value);
}

function repasswordValidate(repasswordInput, passwordInput) {
  if (repasswordInput.value === passwordInput.value) {
    return true;
  }
  return repasswordInput.value === passwordInput.value;
}

}    
