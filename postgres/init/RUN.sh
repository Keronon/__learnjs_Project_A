#!/bin/bash
set -e
psql -U "postgres" -f /init_x/_.x 1>../log/out.txt 2>../log/err.txt
