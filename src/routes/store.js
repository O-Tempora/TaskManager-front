import { writable } from "svelte/store";

const userToken = localStorage.getItem("user");
export const user = writable(userToken);
user.subscribe(value =>{
    if (value === null){
        localStorage.removeItem("user");
        return;
    } else{
        localStorage.setItem("user", value);
    }
});
export default user;