<?php
namespace Zic2\Auth;

use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;
use Zend\Session\Container;
use Zend\Session\SessionManager;
use Zend\ServiceManager\ServiceManager;
use Zend\Session\Config\SessionConfig;
use Zend\Session\Storage\SessionArrayStorage;

class Module
{
    public function onBootstrap(MvcEvent $e)
    {
        $eventManager        = $e->getApplication()->getEventManager();
        $moduleRouteListener = new ModuleRouteListener();
        $moduleRouteListener->attach($eventManager);
        $this->bootstrapSession($e);
    }

    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }

    public function bootstrapSession(MvcEvent $e)
    {
        $sessionConfig = new SessionConfig();
        $sessionConfig->setOptions(array(
            'save_path' => realpath(__DIR__."/../../../data/session"),
            'name' => 'capitalism'
        ));

        $sessionStorage = new SessionArrayStorage();

        $sessionSaveHandler = null;

        $sessionManager = new SessionManager($sessionConfig, $sessionStorage, $sessionSaveHandler);

        $container = new Container('initialized');
        $container->setDefaultManager($sessionManager);
        $container->offsetSet("foo", "bar");
    }

    public function getAutoloaderConfig()
    {
        return array(
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/src/'
                ),
            ),
        );
    }
}