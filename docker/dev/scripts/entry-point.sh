#!/bin/bash

/scripts/init-replica-set.sh &
mongod --replSet todo-rs --bind_ip_all
