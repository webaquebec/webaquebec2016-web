#!bin/bash

cd www
cp index.dev.html index.html
zip -r waq.zip ./*
scp -i /Users/mcote/Desktop/QuebecNumerique-WAQ.pem waq.zip ubuntu@54.86.106.29:/home/ubuntu
rm -rf waq.zip
ssh -i /Users/mcote/Desktop/QuebecNumerique-WAQ.pem ubuntu@54.86.106.29 "sudo mv /home/ubuntu/waq.zip /var/www/waq/public_html/ &&
																			cd /var/www/waq/public_html &&
																			sudo unzip waq.zip &&
																			sudo rm -rf waq.zip"
