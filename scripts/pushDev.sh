#!bin/bash

# NOTICE : Please do not add your prem file path, user your '.ssh/config' instead
cd www
zip -r waq.zip ./*
zip -d waq.zip sitemap.xml
zip -j waq.zip ../env/dev/robots.txt
scp waq.zip ubuntu@waq.cortex.ninja:/home/ubuntu
rm -rf waq.zip
ssh ubuntu@waq.cortex.ninja "sudo mv /home/ubuntu/waq.zip /var/www/waq/public_html/ &&
																			cd /var/www/waq/public_html &&
																			sudo unzip waq.zip &&
																			sudo rm -rf waq.zip"
