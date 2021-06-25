#!/usr/bin/env bash

set -u

public_path="$1"
shift
server_opts="$@"

./node_modules/.bin/http-server $public_path -p 9003 -c-1 --cors $server_opts
