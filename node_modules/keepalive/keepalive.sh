#!/bin/bash -e
# Usage: keepalive [--num=<num>] <user> <log> <cmd> [<cmdopts>]

declare opts=$(getopt -o "" -lnum: -- "$@")
declare -i num=1
declare -i index
declare user
declare logfile
declare -ai pids

eval set -- "$opts"
while true; do
    case "$1" in
        --num) num="$2"; shift 2;;
        --) shift; break;;
    esac
done

index=$((num-1))
user="$1"
logfile="$2"
shift 2 || error "invalid arguments"

# error <msg> [<status>]
# Generate an error.
error () {
    echo "$1" >&2
    return ${2-1}
}

# openlog
# Open or reopen the log file.
openlog () {
    echo "keepalive: opening logfile '$logfile'"
    exec 1>> "$logfile" 2>&1
}

# pgid
# Display the process group id.
pgid () {
    pid=$$
    echo $(ps -o pgid= $pid | grep -o [0-9]*)
}

# terminate
# Shut down service.
terminate () {
    echo "keepalive: shutting down PGID "$(pgid)

    # send TERM to group
    kill -TERM -- -$(pgid)

    # wait a second for normal termination, then send KILL to group
    sleep 1
    kill -KILL -- -$(pgid)
}

# launch <cmd> [<cmdopts>]
# Launch service instance if not currently running at full capacity.
launch () {
    local -i pid
    local -i procs=${#pids[@]}

    if [ $procs -lt $num ]; then
        echo "keepalive: launching instance $((procs+1))/$num"
        sudo -u$user "$@" &
        pid=$!
        pids+=($!)
        echo "keepalive: launched instance with PID: $pid"
    fi
}

# reap
# Reap dead child.  Each time this function is called, it only attempts to reap
# one child.  Subsequent calls will cycle through the children.
reap () {
    local pid

    # adjust the reap index
    index=$((index+1))
    [ $index -ge $num ] && index=0

    # check for child at the current index and reap if dead
    pid=${pids[$index]}
    if [ ! -e /proc/$pid ]; then
        echo "keepalive: reaping instance with PID: $pid"
        unset pids[$index]
        pids=("${pids[@]}")
    fi
}

# run
# Begin running service.
run () {
    local -i children=0
    local pid

    while true; do
        launch "$@"
        reap
        sleep 1
    done

}

trap terminate EXIT
trap openlog HUP
openlog
run "$@"
