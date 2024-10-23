import stateAndLGAs from "../nigeria-state-and-lgas.json";

function getAll () {
    return stateAndLGAs;
}

function getStates () {
    return stateAndLGAs.map((s) => {return s.state});
}

function getLGAs (state: string) {
    return stateAndLGAs.find(s => s.state == state)?.lgas;
}

export {
    getAll,
    getStates,
    getLGAs
}
