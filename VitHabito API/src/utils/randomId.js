import randomId from "random-id";

const idRandom = {}

var len = 30;
 
var pattern = 'aA0'

idRandom.generate = () => {
    return randomId(len, pattern)
}

export default idRandom