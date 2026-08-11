import store from "../store/store.js";

const getCommand = (key) => {
    const value = store.get(key);

    if (value === undefined) {
        return "(nil)";
    }

    return value;
};

export default getCommand;