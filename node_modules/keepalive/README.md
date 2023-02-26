keepalive
=========
Keepalive is a simple bash script that executes a process and respawns it if it
exits.

Usage
-----
```sh
keepalive [--num=<num>] <user> <log> <cmd> [<cmdopts>]

ARGUMENTS
  user          Username which ia used to run service
  log           Path to log file
  cmd           Path to command
  cmdopts	Options to pass to command

OPTIONS
  --num=<num>	Number of instances to spawn (default 1)
```

Example
-------
```sh
$ keepalive nobody my.log /bin/my-service --options foo
```

Signals
-------
Keepalive recognizes the following signals:

 * `HUP`: reopen log files
 * `TERM`: send TERM to process group (terminates service)

Change Log
----------
 * `3.0.0`: bump version to reflect introduction of a breaking change
 * `2.1.0`: --num option (WARNING: this was unintentionally a breaking change)
 * `2.0.1`: fix issues reopening log file
 * `2.0.0`: required args
 * `1.3.1`: fix issues killing process group
 * `1.3.0`: --user option
 * `1.2.0`: --logfile option
 * `1.1.0`: log support and reopen log on `HUP`
 * `1.0.1`: kill launched process on `TERM`
 * `1.0.0`: initial release
