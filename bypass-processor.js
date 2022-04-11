// Copyright (c) 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * A simple bypass node demo.
 *
 * @class BypassProcessor
 * @extends AudioWorkletProcessor
 */

var record =[];
var startInRecord =0;
var startOutRecord =0;
var flag1 = true;

class BypassProcessor extends AudioWorkletProcessor {

  constructor() {
    super();
    this.port.onmessage = (event) => {
      flag1 = true;
       //Handling data from the node.
      //console.log(event.data);
    };

    this.port.postMessage('Hi!');
  }

    // When constructor() undefined, the default constructor will be
    // implicitly used.

    // uses an array to slow output to double time and half freq of input.
    // ie a 440 Hz sine will output as 220.

    process(inputs, outputs) {

        if (record.length > 1000000){ // reinitialise
          record =[];
          startInRecord =0;
          startOutRecord =0;
        }

        // By default, the node has single input and output.
        const input = inputs[0][0];
        const output = outputs[0][0];

        for (let i = 0; i < input.length; i++) {

            record[startInRecord] = input[i];
            startInRecord++
        }
if (flag1) {
  for (let j = 0; j < output.length; j += 2) {
    output[j] = record[startOutRecord];
    output[j + 1] = output[j];
    startOutRecord++; //after end of loop should be 64 higher than before loop.
  }
}

return true;
        }
}

registerProcessor('bypass-processor', BypassProcessor);
