<?php
namespace Sic\Admin;

use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;

use Zend\Session\SessionManager;
use Zend\Session\Container;
/*
use ApplicationServiceErrorHandling as ErrorHandlingService;
use ZendLogLogger;
use ZendLogWriterStream as LogWriterStream;
*/

class Module
{
    public function onBootstrap(MvcEvent $e)
    {
        $eventManager = $e->getApplication()->getEventManager();

        /*
        $eventManager->attach('dispatch.error', function($event){
            $exception = $event->getResult()->exception;
            if ($exception) {
                $sm = $event->getApplication()->getServiceManager();
                $service = $sm->get('ApplicationServiceErrorHandling');
                $service->logException($exception);
            }
        });
        */

        $moduleRouteListener = new ModuleRouteListener();
        $moduleRouteListener->attach($eventManager);

        //$this->bootstrapSession($e);
    }

    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }

    public function bootstrapSession(MvcEvent $e)
    {
        $session = $e->getApplication()->getServiceManager()->get('Zend\Session\SessionManager');
        $session->start();

        $container = new Container('initialized');
        if (!isset($container->init)) {
            $serviceManager = $e->getApplication()->getServiceManager();
            $request        = $serviceManager->get('Request');

            $session->regenerateId(true);
            $container->init          = 1;
            $container->remoteAddr    = $request->getServer()->get('REMOTE_ADDR');
            $container->httpUserAgent = $request->getServer()->get('HTTP_USER_AGENT');

            $config = $serviceManager->get('Config');
            if (!isset($config['session'])) {
                return;
            }

            $sessionConfig = $config['session'];
            if (isset($sessionConfig['validators'])) {
                $chain   = $session->getValidatorChain();

                foreach ($sessionConfig['validators'] as $validator) {
                    switch ($validator) {
                        case 'Zend\Session\Validator\HttpUserAgent':
                            $validator = new $validator($container->httpUserAgent);
                            break;
                        case 'Zend\Session\Validator\RemoteAddr':
                            $validator  = new $validator($container->remoteAddr);
                            break;
                        default:
                            $validator = new $validator();
                    }

                    $chain->attach('session.validate', array($validator, 'isValid'));
                }
            }
        }
    }


    /*
    public function getServiceConfig()
    {
        return array(
            'factories' => array(
                'ApplicationServiceErrorHandling' =>  function($sm) {
                    $logger = $sm->get('ZendLog');
                    $service = new ErrorHandlingService($logger);
                    return $service;
                },
                'ZendLog' => function ($sm) {
                    $filename = 'log_' . date('F') . '.txt';
                    $log = new Logger();
                    $writer = new LogWriterStream('./data/logs/' . $filename);
                    $log->addWriter($writer);

                    return $log;
                },
            ),
        );
    }
    */

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