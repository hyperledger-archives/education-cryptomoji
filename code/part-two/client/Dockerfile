# NOTE: Use `volumes` to make: part-two/client/public/
# available at: /usr/local/apache2/htdocs/

FROM httpd:2.4

RUN echo "\
\n\
ServerName cryptomoji\n\
AddDefaultCharset utf-8\n\
\n\
LoadModule proxy_module modules/mod_proxy.so\n\
LoadModule proxy_http_module modules/mod_proxy_http.so\n\
ProxyPass /api http://rest-api:8008\n\
ProxyPassReverse /api http://rest-api:8008\n\
RequestHeader set X-Forwarded-Path \"/api\"\n\
\n\
LoadModule rewrite_module modules/mod_rewrite.so\n\
RewriteEngine On\n\
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]\n\
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d\n\
RewriteRule ^ - [L]\n\
RewriteCond %{REQUEST_FILENAME} !^/api\n\
RewriteRule ^ /index.html\n\
\n\
" >>/usr/local/apache2/conf/httpd.conf

EXPOSE 80/tcp
