var EventEnum1 = require('./EventEnum1');
var EventEnum2 = require('./EventEnum2');
var EventEnum3 = require('./EventEnum3');

// autocomplete - 3
// find definition - 3
// find usages - 2
// nesting - 1
// summary - 9
console.log(EventEnum1.FSWATCER_FILE_ADDED_1);
console.log(EventEnum1.QUEUE_EVENT_RAISED_1);

// autocomplete - 3
// find definition - 3
// find usages - 3
// nesting - 1
// summary - 10 - WINNER!!
console.log(EventEnum2.FSWATCER_FILE_ADDED_2);
console.log(EventEnum2.QUEUE_EVENT_RAISED_2);

// autocomplete - 1
// find definition - 3
// find usages - 1
// nesting - 3
// summary - 8
console.log(EventEnum3.fswatcher.file.added);
console.log(EventEnum3.queue.event.raised);
