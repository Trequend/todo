#!/bin/bash

RS_MEMBER="{ \"_id\": 0, \"host\": \"mongo\" }"

sleep 10
mongo --eval "rs.initiate({ \"_id\": \"todo-rs\", \"members\": [${RS_MEMBER}] });"
