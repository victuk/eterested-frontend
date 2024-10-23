import stateAndLGAs from "../nigeria-state-and-lgas.json";

interface StatesAndLGAs {
    state: string;
    alias: string;
    lgas: string[]
}

function getStates () {
    const stateAndLGAs: StatesAndLGAs = [
        {
            alias: "",
            state: "",
            lgas: []
        }
    ];
}
