import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8000"
});

const coingekoinstance = axios.create({
    baseURL: "https://api.coingecko.com/api/v3"
});

export { 
    instance, 
    coingekoinstance
};