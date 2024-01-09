export const getFirstNumber = (string) => {
    const match = string.match(/\d+/);
    if (match) {
        return parseInt(match[0]);
    } else {
        return null;
    }
}

const formatDate = (date) => {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
  
    // Function to get the ordinal suffix for the day
    function getOrdinalSuffix(day) {
        if (day >= 11 && day <= 13) {
            return 'th';
        }
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
      }
    }
  
    const ordinalSuffix = getOrdinalSuffix(day);
  
    return `${month} ${day}${ordinalSuffix}, ${year}`;
}

export const convertDate = (num) => {
    const timestamp = parseInt(`${num}`, 10);
    return formatDate(new Date(timestamp));
}
  