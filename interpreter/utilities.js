function isRhyme(rhyme, word1, word2){
    return rhyme.doRhyme(cleanWord(word1), cleanWord(word2));
}

function cleanWord(word){
    return stripFinalPunctuation(word.toLowerCase());
}
function stripFinalPunctuation(word){
    return word.replace(/\b[\.\?\!\,]+/, "");
}

module.exports = {
    isRhyme: isRhyme
}
