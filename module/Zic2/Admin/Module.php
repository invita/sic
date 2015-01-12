<?php
namespace Zic2\Admin;

use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;
use Zend\Session\Config\StandardConfig;
use Zend\Session\Container;
use Zend\Session\SessionManager;
use Zend\ServiceManager\ServiceManager;
use Zend\Session\Config\SessionConfig;
use Zend\Session\Storage\SessionArrayStorage;

class Module
{
    public function onBootstrap(MvcEvent $e)
    {
        $eventManager = $e->getApplication()->getEventManager();
        $moduleRouteListener = new ModuleRouteListener();
        $moduleRouteListener->attach($eventManager);
        //$this->bootstrapAdmin($e);

        /*
        $sharedManager = $eventManager->getSharedManager();
        $sharedManager->attach('Zend\Mvc\Controller\AbstractActionController', 'dispatch',
            array($this, 'handleControllerCannotDispatchRequest' ), 101);

        $eventManager->attach('dispatch.error',
            array($this,
                'handleControllerNotFoundAndControllerInvalidAndRouteNotFound'), 100);
        */
    }

    /*
    public function handleControllerCannotDispatchRequest(MvcEvent $e)
    {
        $action = $e->getRouteMatch()->getParam('action');
        $controller = get_class($e->getTarget());

        // error-controller-cannot-dispatch
        if (! method_exists($e->getTarget(), $action.'Action')) {
            $logText = 'The requested controller '.
                $controller.' was unable to dispatch the request : '.$action.'Action';
            //you can do logging, redirect, etc here..
            echo $logText;
        }
    }

    public function handleControllerNotFoundAndControllerInvalidAndRouteNotFound(MvcEvent $e)
    {
        $error  = $e->getError();
        if ($error == Application::ERROR_CONTROLLER_NOT_FOUND) {
            //there is no controller named $e->getRouteMatch()->getParam('controller')
            $logText =  'The requested controller '
                .$e->getRouteMatch()->getParam('controller'). '  could not be mapped to an existing controller class.';

            //you can do logging, redirect, etc here..
            echo $logText;
        }

        if ($error == Application::ERROR_CONTROLLER_INVALID) {
            //the controller doesn't extends AbstractActionController
            $logText =  'The requested controller '
                .$e->getRouteMatch()->getParam('controller'). ' is not dispatchable';

            //you can do logging, redirect, etc here..
            echo $logText;
        }

        if ($error == Application::ERROR_ROUTER_NO_MATCH) {
            // the url doesn't match route, for example, there is no /foo literal of route
            $logText =  'The requested URL could not be matched by routing.';
            //you can do logging, redirect, etc here...
            echo $logText;
        }
    }
    */

    public function bootstrapAdmin(MvcEvent $e)
    {
        $eventManager        = $e->getApplication()->getEventManager();
        $moduleRouteListener = new ModuleRouteListener();
        $moduleRouteListener->attach($eventManager);

        //echo "Admin bootstrap\n";
        //$adminConfig = new StandardConfig();
        //$adminConfig->setOptions(array(
        //    'testConfigKey' => 'testConfigValue'
        //));
    }

    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
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