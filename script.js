const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");


// Symbols
// 30 SYMBOLS
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
uppercaseCheck.checked = true;
handleSlider();
//set strength circle color to grey
setIndicator("#ccc");

//set Password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength-min) *100 / (max - min)) + "% 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getRandomInteger(0, 9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol() {
    const randNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && (hasNum || hasSym) && passwordLength >=8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >=6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
        checkCount++;
    });

    //special condition 
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach ((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input' , (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
    copyContent();
})

// Shuffle using "FISHER YATES" METHOD
function shufflePassword(array){
    for(let i = array.length-1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[i] = temp;
    }
    let str = "";
    array.forEach(function(el){
        str += el;
    });
    return str;
}

//Generate Btn
generateBtn.addEventListener('click', () => {  
    //none of the checkbox are selected
    if(checkCount == 0) return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
    //let's start the journey to find the new password
    console.log("Starting the Journey");
    //remove old password
    password = "";

    let funcArr = [];

    if(uppercaseCheck.checked)
      funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
      funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
      funcArr.push(generateRandomNumber);
    
    if(symbolsCheck.checked)
      funcArr.push(generateSymbol);

    //compulsary addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    console.log("Compulsory addition done");

    //remaining addition
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randomIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[randomIndex](); 
    }
    console.log("Remaining addition done");

    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");

    //Show in UI
    passwordDisplay.value = password;
    console.log("UI addition done");

    //Strength
    calcStrength();
});
