# NOTE: Use `volumes` to make: part-two/client/public/
# available at: /usr/local/apache2/htdocs/

FROM httpd:2.4

RUN echo "\
\n\
ServerName cryptomoji\n\
AddDefaultCharset utf-8\n\
LoadModule proxy_module modules/mod_proxy.so\n\
LoadModule proxy_http_module modules/mod_proxy_http.so\n\
ProxyPass /api http://rest-api:8008\n\
ProxyPassReverse /api http://rest-api:8008\n\
RequestHeader set X-Forwarded-Path \"/api\"\n\
\n\
" >>/usr/local/apache2/conf/httpd.conf

EXPOSE 80/tcp
