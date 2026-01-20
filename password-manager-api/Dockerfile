FROM php:8.2-apache

# 1. Instalar dependencias del sistema y extensiones de PHP necesarias
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl

RUN docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# 2. Habilitar mod_rewrite para Laravel
RUN a2enmod rewrite

# 3. Instalar Composer globalmente
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# 4. Configurar el directorio de trabajo
WORKDIR /var/www/html
COPY . .

# 5. Instalar dependencias de Laravel
RUN composer install --no-dev --optimize-autoloader

# 6. Configurar Apache para que apunte a la carpeta 'public'
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 7. Permisos de escritura para Laravel
RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 80
