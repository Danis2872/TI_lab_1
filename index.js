const russianAlphabetBeginning = 1072;
const russianUniqueLetter = 1105;
const englishAlphabetBeginning = 65;
const j_position = 9;

function isLetterOfEnglishAlphabet(letter) {
    if (letter === j_position + englishAlphabetBeginning)
        return false;
    else
        return ((letter >= englishAlphabetBeginning) && (letter <= englishAlphabetBeginning + 25));
}

function isLetterOfRussianAlphabet(letter) {
    if ((letter >= russianAlphabetBeginning) && (letter <= russianAlphabetBeginning + 31))
        return true;
    else
        return letter === russianUniqueLetter;
}

function getLetterCode(number){
    if (number === 6){
        return russianUniqueLetter;
    }else if (number > 6){
        return number + russianAlphabetBeginning - 1;
    }else{
        return number + russianAlphabetBeginning;
    }
}

function getLetterNumber(letter){
    if (letter.charCodeAt(0) < russianAlphabetBeginning + 6){
        return letter.charCodeAt(0) - russianAlphabetBeginning;
    }else if(letter.charCodeAt(0) === russianUniqueLetter){
        return 6;
    }else{
        return letter.charCodeAt(0) - russianAlphabetBeginning + 1;
    }
}

function getNewCharCode(keyChar, inputChar){
    let position = getLetterNumber(inputChar) + getLetterNumber(keyChar);
    position %= 33;
    return getLetterCode(position);
}

function getPreviousCharCode(keyChar, cipherChar){
    let position = getLetterNumber(cipherChar) - getLetterNumber(keyChar);
    if (position < 0){
        position += 33;
    }
    position %= 33;
    return getLetterCode(position);
}

function vigenereEncryptAlgorithm() {
    const key = document.getElementById("singleKey").value.toLowerCase();
    document.getElementById("singleKey").value = key.toUpperCase();
    const plainText = document.getElementById("inputText").value.toLowerCase();
    document.getElementById("inputText").value = plainText.toUpperCase();
    let cipherText = "";
    let newChar = "";
    let countOfWasteChars = 0;
    for (let i = 0; i < plainText.length; i++) {
        const keyPos = (i - countOfWasteChars) % key.length;
        if (isLetterOfRussianAlphabet(plainText[i].charCodeAt(0)))
            newChar = getNewCharCode(key.charAt(keyPos), plainText.charAt(i));
        else {
            newChar = plainText.charCodeAt(i);
            countOfWasteChars++;
        }
        cipherText += String.fromCharCode(newChar);
    }
    document.getElementById("cipherText").value = cipherText.toUpperCase();
}

function vigenereDecryptAlgorithm() {
    const key = document.getElementById("singleKey").value.toLowerCase();
    const cipherText = document.getElementById("cipherText").value.toLowerCase();
    let plainText = "";
    let newChar = "";
    for (let i = 0; i < cipherText.length; i++) {
        const keyPos = i % key.length;
        if (isLetterOfRussianAlphabet(cipherText[i].charCodeAt(0)))
            newChar = getPreviousCharCode(key.charAt(keyPos), cipherText.charAt(i));
        else
            newChar = cipherText.charCodeAt(i);
        plainText += String.fromCharCode(newChar);
    }
    document.getElementById("inputText").value = plainText.toUpperCase();
}

function createPlayfairTable(key){
    let table = []
    for (let i = 0; i < key.length; i++){
        if (!table.includes(key[i])){
            table.push(key[i]);
        }
    }
    for (let i = 0; i < 26; i++){
        if (i === j_position)
            continue;
        if (!table.includes(String.fromCharCode(i + englishAlphabetBeginning))){
            table.push(String.fromCharCode(i + englishAlphabetBeginning));
        }
    }
    return table;
}

function transformBigram(first, second, table_1, table_2, table_3, table_4){
    let first_indexes;
    let second_indexes;
    let result = "";
    let i, j;
    i = Math.trunc(table_2.indexOf(first) / 5);
    j = table_2.indexOf(first) % 5;
    first_indexes = [i,j];
    i = Math.trunc(table_4.indexOf(second) / 5);
    j = table_4.indexOf(second) % 5;
    second_indexes = [i,j];
    console.log(first_indexes, second_indexes);
    result += table_1[first_indexes[0] * 5 + second_indexes[1]];
    result += table_3[second_indexes[0] * 5 + first_indexes[1]];
    console.log(result);
    return result;
}

function normalizeKeys(){
    document.getElementById("key1").value = document.getElementById("key1").value.toUpperCase();
    document.getElementById("key2").value = document.getElementById("key2").value.toUpperCase();
    document.getElementById("key3").value = document.getElementById("key3").value.toUpperCase();
    document.getElementById("key4").value = document.getElementById("key4").value.toUpperCase();
}

function playfairEncryptAlgorithm() {
    let plainText = document.getElementById("inputText").value.toUpperCase();
    document.getElementById("inputText").value = plainText;
    normalizeKeys();
    let table_1 = createPlayfairTable(document.getElementById("key1").value);
    let table_2 = createPlayfairTable(document.getElementById("key2").value);
    let table_3 = createPlayfairTable(document.getElementById("key3").value);
    let table_4 = createPlayfairTable(document.getElementById("key4").value);
    let cipherText = "";
    let i = 0;
    let textToEnciphering = "";
    while (i < plainText.length) {
        if (isLetterOfEnglishAlphabet(plainText[i].charCodeAt(0))) {
            textToEnciphering += plainText[i];
        }
        i++
    }
    if (textToEnciphering.length % 2 !== 0) {
        textToEnciphering += "X";
    }
    console.log(textToEnciphering);
    console.log(plainText);
    i = 0;
    while (i < textToEnciphering.length) {
        cipherText += transformBigram(textToEnciphering[i], textToEnciphering[i + 1], table_1, table_2, table_3, table_4);
        i+=2;
    }
    let index = 0;
    i = 0;
    textToEnciphering = cipherText;
    cipherText = "";
    console.log(textToEnciphering);
    console.log(plainText);
    while (i < plainText.length) {
        if (isLetterOfEnglishAlphabet(plainText[i].charCodeAt(0))) {
            cipherText += textToEnciphering[index];
            index++;
        }else{
            cipherText += plainText[i];
        }
        i++;
    }
    document.getElementById("cipherText").value = cipherText;
}

function playfairDecryptAlgorithm() {
    let cipherText = document.getElementById("cipherText").value.toUpperCase();
    document.getElementById("cipherText").value = cipherText;
    normalizeKeys();
    let table_1 = createPlayfairTable(document.getElementById("key1").value);
    let table_2 = createPlayfairTable(document.getElementById("key2").value);
    let table_3 = createPlayfairTable(document.getElementById("key3").value);
    let table_4 = createPlayfairTable(document.getElementById("key4").value);
    let plainText = "";
    let i = 0;
    let textToDecrypting = "";
    while (i < cipherText.length) {
        if (isLetterOfEnglishAlphabet(cipherText[i].charCodeAt(0))) {
            textToDecrypting += cipherText[i];
        }
        i++
    }
    i = 0;
    while (i < textToDecrypting.length) {
        plainText += transformBigram(textToDecrypting[i], textToDecrypting[i + 1], table_2, table_1, table_4, table_3);
        i+=2;
    }
    let index = 0;
    i = 0;
    textToDecrypting = plainText;
    plainText = "";
    while (i < cipherText.length) {
        if (isLetterOfEnglishAlphabet(cipherText[i].charCodeAt(0))) {
            plainText += textToDecrypting[index];
            index++;
        }else{
            plainText += cipherText[i];
        }
        i++;
    }
    document.getElementById("inputText").value = plainText;
}

document.addEventListener("DOMContentLoaded", function(){
    let playfair = true;
    document.getElementById("btnVigenere").addEventListener("click", function(){
        playfair = false;
    });
    document.getElementById("btnPlayfair").addEventListener("click", function(){
        playfair = true;
    });
    document.getElementById("encryptBtn").addEventListener("click", function(){
        if (playfair === true){
            if (!(document.getElementById("key1").value === "") &&
                !(document.getElementById("key2").value === "") &&
                !(document.getElementById("key3").value === "") &&
                !(document.getElementById("key4").value === ""))
                playfairEncryptAlgorithm();
        }else{
            if (!(document.getElementById("singleKey").value === ""))
                vigenereEncryptAlgorithm();
        }
    });
    document.getElementById("decryptBtn").addEventListener("click", function(){
        if (playfair === true){
            if (!(document.getElementById("key1").value === "") &&
                !(document.getElementById("key2").value === "") &&
                !(document.getElementById("key3").value === "") &&
                !(document.getElementById("key4").value === ""))
                playfairDecryptAlgorithm();
        }else{
            if (!(document.getElementById("singleKey").value === ""))
                vigenereDecryptAlgorithm();
        }
    });
});