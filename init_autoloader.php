<?php
$zf2Version = "2.3.3";
$zf2Path = __DIR__."/library/ZF2/ZendFramework-".$zf2Version."/library";

include $zf2Path . '/Zend/Loader/AutoloaderFactory.php';

Zend\Loader\AutoloaderFactory::factory(array(
    'Zend\Loader\StandardAutoloader' => array(
        'autoregister_zf' => true
    )
));

if (!class_exists('Zend\Loader\AutoloaderFactory')) {
    throw new RuntimeException('Unable to load Zend Framework 2');
}