const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./args')
});

// Read Separate Lines
let array = [];
lineReader.on('line', (line) => {
  array.push((line));
});

lineReader.on('close', () => {;
  array = array[0].split(',');
  array = array.map(value => Number(value));

  let errorStack = [];

  let numInstructions = 4;
  for (let i = 0; i < array.length; i += numInstructions) {
    let current = i;
    // Solution
    let opCode = array[i] % 100;
    let prep = Math.floor(array[i] / 100);

    let modes = [prep % 10, 
      Math.floor(prep / 10),
      Math.floor(prep / 100)];
    modes[1] = modes[1] - (modes[2] * 10);

    let parameters = [
      array[i + 1],
      array[i + 2],
      array[i + 3]
    ];
    let arguments = [];

    if (opCode <= 2) numInstructions = 4;
    else numInstructions = 2;

    for (let i = 0; i < numInstructions - 1; i++) {
      if (modes[i] === 1) {
        arguments.push(parameters[i]);
      } else if (modes[i] === 0) {
        arguments.push(array[parameters[i]]);
      }
    }
    if (opCode === 1) {
      array[parameters[2]] = arguments[0] + arguments[1];
    } else if (opCode === 2) {
      array[parameters[2]] = arguments[0] * arguments[1];
    } else if (opCode === 3) {
      array[parameters[0]] = 1;
    } else if (opCode === 4) {
      console.log('==========');
      console.log(current);
      console.log(arguments[0]);
      console.log('==========');
      if (arguments[0] === 0) {
        console.log(errorStack);
        errorStack = [];
      }
      else {
        console.log(errorStack);
        return;
      }
    } else if (opCode === 99) {
      console.log(errorStack);
      console.log(current);
    }

    errorStack.push({
      opCode, prep, modes, parameters, arguments, output: array[parameters[2]]
    });
  }
});