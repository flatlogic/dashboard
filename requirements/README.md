# Websocket Views


## Console view

+ Displays text line by line like a console / terminal window.
+ Here is a mock  ![console](/requirements/images/console.png)
+ Event format from websocket is a single line of string per event.
+ It should look like terminal window and be able to accept keyboard input like a terminal.

## Timeline

+ The mock is here: ![timeline](/requirements/images/timeline.png)
+ Accepts events from websocket as lines of string, with a special format / protocol:

### Protocol with the websocket server

+ The data source is identified as a URL, specified in an Angular directive.
+ The payload of an event is a string (\n delimited)
+ Each line represents the output of a process running on a server.  For example we may want to run `ls -al /bin` on the server and there are many lines returned from the stdout.
+ Each line is rendered in the detailed view, just like a web console / terminal emulator.
+ Depending on the format of the line, trigger special handling and display events in the milestone view.

Each event from the websocket is a single string of the format:

    {special_chars},{[|]},{UnixTimeStamp},{Title},{Comment}

The `special_chars` sequence is one of

+ `****`  (4 chars)  This means INFO - render the event using Green icon
+ `????`  This means WARNING - render the event icon using Yellow
+ `!!!!`  This means ERROR - render the event icon using Red.

For example, a line that looks like 

    ****,[,1431578593,MILESTONE 1,This is a milestone **** 

followed by a line

    ****,],1431578680,MILESTONE 1,No errors ****

will cause a new entry titled `MILESTONE 1` to be added, with a description `This is a milestone`.  The starting time is the Unix timestamp (1431578593).  The description is 'This is a milestone'.  This event is added to the timeline.

When the second line with `]` is received, the last event is updated with an elapsed time (subtract the starting timestamp from the timestamp in this line), and the description is appended with the comment of this line (`This is a milestone. No errors`.

When you encounter another line with the sequence and `[`, render a new event in the timeline.

It's ok to assume that `[` and `]` are always paired. 


## A Tree view

+ Displays hierarchical data.  ![tree](/requirements/images/tree.png)
+ There's a hierarchical tree on the left with a view for showing the detail of the selected node.
+ Uses a similar protocol like the timeline to interpret the line received from websocket `onMessage()`

### Websocket protocol for the tree view

Similar to the line-oriented protocol for the timeline:

    {special_chars},{+|-|*},{UnixTimeStamp},{Path},{Value},{Url}

+ The `{special_chars}` is `////`
+ The second field is either a 
  + `+` for ADD a tree node, 
  + `-` for REMOVE a tree node, or 
  + `*` for changing an existing tree node.  
  + Tree nodes are identified by the `{Path}`.  Path uses `/` as separator, like Unix filename.  
  + {Value} is a string corresponding to the value of the node.  
  + The `{Url}` is a resource URL for fetching details of the object when it's selected.  When `{Url}` is not specified, the detail view simply shows a text box with the value of the node. 
+ So for each line received from the `onMessage`, the line is parsed and the tree model should be updated according to the verb (`+`, `-`, or `*`)

Example

    ////,+,1431578680,/usr/local/bin/foo.txt,A text file,https://server.com/path/12345

Would add a tree node `foo.txt` under the `bin` parent node, which is a child of the `local` node under `usr`.  The value is `A text file` and the URL to use when the user clicks on it to render the right-hand side is `https://server.com/path/12345`.

Another websocket event

    ////,*,1431578680,/usr/local/bin/foo.txt,A text file CHANGED,https://server.com/path/CHANGED/12345

will update the value of the node, including the URL.

Finally 

    ////,-,1431578680,/usr/local/bin/foo.txt,A text file CHANGED,https://server.com/path/CHANGED/12345

will remove this tree node.


## An timeline / log view component

+ A timeline / log viewer
  + Here is the mock  ![mock](/requirements/images/mock.png)
  + It's a composition of the timeline view and the console view
    + A milestone view: this is basically the Timeline view
    + A console view: this is a console view that is read-only (allows disable of keyboard input).
  + Both get data from the same websocket URL.
  + There's should be button to let the user hide the console view and see only the timeline.




