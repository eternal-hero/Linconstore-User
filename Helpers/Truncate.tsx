export default function Truncate(str: string, num: number){
    if(str.length > num){
        return str.slice(0,num) + '...'
    }
    return str;
}
export const getLength = (word: string) : number => word.length