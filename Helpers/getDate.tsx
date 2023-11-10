export const  getDate =  new Date().toLocaleString('default', {month: 'short', year: 'numeric', day: '2-digit'})
export  const getCurrentYear = () : number => {
    let today = new Date();
    return today.getFullYear();
}
export const reCreateDate = (date: Date | string) : string => {
    return new Date(date).toLocaleString('default', {month: 'short', year: 'numeric', day: '2-digit'})
}

export const getCurrentDate = (number: number) => {
    let today = new Date();
    let lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - number).toLocaleTimeString([], {month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'});
    return lastWeek;
}

export const getCurrDate = () => {
    let today = new Date();
    let lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes()).toLocaleTimeString([], {year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'});
    return lastWeek;
}

export const timeDifference = (givenTime: string): string => {
    const currentTime = new Date();
    const createdTime = new Date(givenTime)
    let differenceInMilliseconds = currentTime.getTime() - createdTime.getTime();
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);

    if (differenceInHours > 0) {
        return differenceInHours + 'h';
    } else if (differenceInMinutes > 0) {
        return differenceInMinutes + 'm';
    } else {
        return '< 1m';
    }
}

export const getHourMinute = (date: Date) => {
    const givenDate = new Date(date);
    const hours = givenDate.getHours();
    const minutes = givenDate.getMinutes();

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

export const getLocaleDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'short', 
        day: '2-digit', 
        month: 'short', 
        hour: '2-digit'
    };

    return date.toLocaleString('en-Us', options)
}

export default getDate;