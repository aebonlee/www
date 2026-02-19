@echo off
robocopy "D:\www\react-source\dist\assets" "D:\www\assets" /MIR /NFL /NDL /NJH /NJS
copy /Y "D:\www\react-source\dist\index.html" "D:\www\index.html"
copy /Y "D:\www\react-source\dist\favicon.svg" "D:\www\favicon.svg"
copy /Y "D:\www\react-source\dist\404.html" "D:\www\404.html"
copy /Y "D:\www\react-source\dist\robots.txt" "D:\www\robots.txt"
copy /Y "D:\www\react-source\dist\sitemap.xml" "D:\www\sitemap.xml"
copy /Y "D:\www\react-source\dist\CNAME" "D:\www\CNAME"
echo DEPLOY_COMPLETE > "D:\www\deploy_result.txt"
