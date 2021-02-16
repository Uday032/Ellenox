import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8000"
});

const coingekoinstance = axios.create({
    baseURL: "https://api.coingecko.com/api/v3"
});

const newsapi = axios.create({
    baseURL: "https://newsapi.org/v2"
})
export { 
    instance, 
    coingekoinstance,
    newsapi
};