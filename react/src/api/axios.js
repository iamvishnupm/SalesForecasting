import axios from 'axios';

// Determine the base URL dynamically
const getBaseURL = () => {
    if (process.env.REACT_APP_API_BASE_URL) {
        // Use the environment variable if set
        return process.env.REACT_APP_API_BASE_URL;
    }

    const { protocol, hostname, port } = window.location;

    // Handle different environments and ports
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return `${protocol}//${hostname}:8000/api/`; // Local development
    }

    return `${protocol}//${hostname}/api/`; // Production
};

const instance = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;
