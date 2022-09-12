up_front:
	cd frontend && \
	npm run build

edit_nginx:
	sudo nano /etc/nginx/sites-available/default

reload_nginx:
	sudo nginx -t && \
	sudo systemctl restart nginx

pm2_restart:
	pm2 restart app
