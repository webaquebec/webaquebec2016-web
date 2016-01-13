#!bin/bash

cd www
uglifyjs app.js -o app.min.js
cp index.live.html index.html
zip -r waq.zip ./*
scp -i /Users/mcote/Desktop/QuebecNumerique-WAQ.pem waq.zip ubuntu@54.86.106.29:/home/ubuntu
rm -rf waq.zip
ssh -i /Users/mcote/Desktop/QuebecNumerique-WAQ.pem ubuntu@54.86.106.29 "mv /home/ubuntu/waq.zip /var/www/waq/public_html/ &&
																			cd /var/www/waq/public_html &&
																			unzip waq.zip &&
																			rm -rf waq.zip"
