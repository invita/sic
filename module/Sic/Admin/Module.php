<?php
namespace Sic\Admin;


use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;

use Zend\Session\SessionManager;
use Zend\Session\Container;
use Zend\Session\Config\SessionConfig;
use Zend\Session\Validator\HttpUserAgent;
use Zend\Session\Validator\RemoteAddr;

use Zend\Db\TableGateway\TableGateway;
use Zend\Session\SaveHandler\DbTableGateway;
use Zend\Session\SaveHandler\DbTableGatewayOptions;
use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Sic\Admin\Models\Util;



class Module
{
    public function onBootstrap(MvcEvent $e)
    {
        $eventManager = $e->getApplication()->getEventManager();
        $moduleRouteListener = new ModuleRouteListener();
        $moduleRouteListener->attach($eventManager);

        $this->bootstrapDatabase($e);
        $this->bootstrapSession($e);
        $this->bootstrapConfig($e);
    }

    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }

    public function bootstrapDatabase(MvcEvent $e)
    {
        $sm = $e->getApplication()->getServiceManager();
        $adapter = $sm->get('Zend\Db\Adapter\Adapter');

        GlobalAdapterFeature::setStaticAdapter($adapter);
    }

    public function bootstrapSession(MvcEvent $e)
    {
        $config = array(
            'remember_me_seconds' => 180,
            'use_cookies' => true,
            'cookie_httponly' => true
        );
        $sessionConfig = new SessionConfig();
        $sessionConfig->setOptions($config);
        $sessionManager = new SessionManager($sessionConfig);
        $sessionManager->getValidatorChain()->attach('session.validate', array(new HttpUserAgent(), 'isValid'));
        $sessionManager->getValidatorChain()->attach('session.validate', array(new RemoteAddr(), 'isValid'));
        $sessionManager->setSaveHandler(new DbTableGateway(new TableGateway('session', GlobalAdapterFeature::getStaticAdapter()), new DbTableGatewayOptions()));
        $sessionManager->start();
        Container::setDefaultManager($sessionManager);
    }

    public function bootstrapConfig(MvcEvent $e)
    {
        $config = $this->getConfig();
        $sicConfig = isset($config['sic']) ? $config['sic'] : array();
        foreach ($sicConfig as $cKey => $cVal) Util::set($cKey, $cVal);
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