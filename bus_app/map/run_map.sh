#!/bin/bash
sudo docker run -d --rm -it -v $(pwd):/data -p 8080:80 klokantech/openmaptiles-server
