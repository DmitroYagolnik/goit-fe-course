import axios from 'axios';
const API_KEY = '5d90fc369da494547dff5fd7604f18c8ee32cf3da41d7';

export const fetchURLData = (userURL) => {
    
    const url = `http://api.linkpreview.net/?key=${API_KEY}&q=${userURL}`;

    return axios
        .get(url)
        .then(res => res.data)
        .catch(err => console.log('axios err : ', err));
        
}