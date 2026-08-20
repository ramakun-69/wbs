FROM php:8.4-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    unzip \
    zip \
    nano \
    supervisor \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libwebp-dev \
    libzip-dev \
    libicu-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    && docker-php-ext-configure gd \
    --with-freetype \
    --with-jpeg \
    --with-webp \
    && docker-php-ext-install \
    pdo_mysql \
    bcmath \
    exif \
    gd \
    intl \
    opcache \
    pcntl \
    zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www


# PHP Configuration
RUN echo "memory_limit=512M" > /usr/local/etc/php/conf.d/memory-limit.ini \
    && echo "upload_max_filesize=512M" > /usr/local/etc/php/conf.d/uploads.ini \
    && echo "post_max_size=512M" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "max_execution_time=5000" > /usr/local/etc/php/conf.d/execution.ini \
    && echo "date.timezone=Asia/Jakarta" > /usr/local/etc/php/conf.d/timezone.ini

EXPOSE 9000

CMD ["php-fpm"]