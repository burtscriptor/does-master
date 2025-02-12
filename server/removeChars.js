const removeChars = (data) => {
    
    const regex = /[1-9]\./g;

    if (typeof data === "string") {
    return data.replace(regex, "")
    } else {
        console.log(typeof(data))
    }
};

module.exports = {
    removeChars
};