<?php

chdir(realpath(__DIR__."/../"));

// *** Prepare global error handling
error_reporting(E_ALL);
ini_set('display_errors', 1);

function handleExceptions_debug($exception){
    echo sprintf("%s: <b>%s</b> in file %s:%s\n<br/>", get_class($exception),
        $exception->getMessage(), $exception->getFile(), $exception->getLine());
}

function handleExceptions_production($exception){
    echo sprintf("%s: %s\n", get_class($exception), $exception->getMessage());
}

// * Set Exception handling function
//set_exception_handler('handleExceptions_debug');
//set_exception_handler('handleExceptions_production');



// *** Init
if (php_sapi_name() === 'cli-server' && is_file(__DIR__ . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH))) {
    return false;
}

require 'init_autoloader.php';

// *** Run application
Zend\Mvc\Application::init(require 'config/application.config.php')->run();

