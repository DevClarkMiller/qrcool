/*Brief: Returns the current date in an sql presentable format
*/
export default function currentDate(): string{
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
}