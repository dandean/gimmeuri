I thought you might like a data uri.
====================================

`gimmeuri` gets you the datauri for a single file and copies it to your clipboard, or optionally saves it to a file. That's it.


Usage:
------

Copy the datauri for a file to your clipboard:

    gimmeuri path/to/file


Advanced Usage:
---------------

    Usage: gimmeuri [options] <file>

    Options:

      -m, --max [bytes]       maximum file size to process (1048576)
      -s, --save-path [path]  path to save the daturi
      -V, --version           output the version number
      -h, --help              output usage information


**Save Path**

`gimmeuri` copies the specified file's data uri to the clipboard by default. It will instead be written to `--save-path`, if provided.

**Max File Size**

`gimmeuri` will exit(1) if the specified file is larger than the maximum file size. The default is 1048576 (1 megabyte), but can be overridden with the `--max` option.


TODO:
-----

Provide a interface in JavaScript so you can use `gimmeuri` like this:

    require('gimmeuri')(path, cb);


License:
--------

MIT
