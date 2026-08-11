import store from "../store/store.js";

const setCommand = (key, value) => {
    store.set(key, value);
    return "OK";
};

export default setCommand;